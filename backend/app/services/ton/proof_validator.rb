require "net/http"
require "uri"
require "json"
require "base64"
require "digest"
require "ed25519"

class Ton::ProofValidator
  TTL = 30
  STATUS_INIT_URL = "https://tonapi.io/v2/tonconnect/stateinit"

  def verify_ton_proof(proof:, declared_addr:, ttl_seconds:)
    # 1) Domain check
    domain = proof[:domain][:value]
    return false unless allowed_domains.include?(domain)

    # 2) Timestamp check
    ts = proof[:timestamp].to_i
    time_diff = Time.now.to_i - ts
    return false if time_diff > ttl_seconds

    # 3) Payload check
    JWT.decode(proof[:payload], Rails.application.credentials.secret_key_base, true)

    # 4) Fetch wallet info
    info = fetch_wallet_info(proof[:state_init])
    return false unless info[:address_str] == declared_addr

    address_hex = declared_addr.gsub(/^0:/, "")
    workchain = 0

    # convert hex to raw bytes
    address_bin  = [ address_hex ].pack("H*")
    pubkey_bytes = [ info[:public_key_hex] ].pack("H*")

    timestamp    = proof[:timestamp].to_i
    domain_len   = proof[:domain][:lengthBytes].to_i
    domain_value = proof[:domain][:value].dup.force_encoding("ASCII-8BIT")
    signature    = Base64.decode64(proof[:signature])
    # Use hash of payload because wallet signs the hash, not the original JWT
    payload      = Digest::SHA256.hexdigest(proof[:payload]).force_encoding("ASCII-8BIT")

    # build the message
    msg = +"ton-proof-item-v2/"
    msg << [ workchain ].pack("V")      # 4-byte LE
    msg << address_bin
    msg << [ domain_len ].pack("V")     # 4-byte LE
    msg << domain_value
    msg << [ timestamp ].pack("Q<")     # 8-byte LE
    msg << payload

    # hash and then wrap with prefix for signing
    h_msg  = Digest::SHA256.digest(msg)
    sig_msg = "\xFF\xFF".b + "ton-connect".b + h_msg
    h_sig  = Digest::SHA256.digest(sig_msg)

    verify_key = Ed25519::VerifyKey.new(pubkey_bytes)
    verify_key.verify(signature, h_sig)

    true
  rescue JWT::DecodeError => e
    Rails.logger.error("JWT payload decode failed: #{e.message}")
    false
  rescue Ed25519::VerifyError => e
    Rails.logger.error("Signature verification failed: #{e.message}")
    false
  rescue StandardError => e
    Rails.logger.error("TON proof validation error: #{e.class.name} - #{e.message}")
    false
  end

  def generate_ton_proof_payload
    random_payload = SecureRandom.hex(32)
    token = JWT.encode(
      random_payload,
      Rails.application.credentials.secret_key_base,
      "HS256",
      { expires_in: TTL }
    )

    {
      ton_proof: token,
      ton_proof_hash: Digest::SHA256.hexdigest(token)
    }
  end

  private

  def fetch_wallet_info(state_init_b64)
    uri = URI(STATUS_INIT_URL)
    req = Net::HTTP::Post.new(uri, "Content-Type" => "application/json")
    req.body = { state_init: state_init_b64 }.to_json

    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(req)
    end
    raise "TON API error: #{res.code}" unless res.is_a?(Net::HTTPSuccess)

    data = JSON.parse(res.body)

    {
      public_key_hex: data["public_key"],
      address_str: data["address"]
    }
  end

  def allowed_domains
    # host = Rails.configuration.config.frontend_host
    # [ host.sub(%r{^https?://}, "") ]
    [ "gemifi.ngrok.dev" ]
  end
end
