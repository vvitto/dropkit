class TelegramAuthService
  class AuthError < StandardError; end

  def self.validate_init_data(init_data)
    return false unless init_data["hash"]

    data_check_arr = init_data.reject { |k, _| k == "hash" }
      .map { |k, v| "#{k}=#{v}" }
      .sort
    data_check_string = data_check_arr.join("\n")

    secret_key = OpenSSL::HMAC.digest("sha256", "WebAppData", Rails.application.credentials.telegram.bots[:chat][:token])
    signature = OpenSSL::HMAC.hexdigest("sha256", secret_key, data_check_string)

    init_data["hash"] == signature
  end

  def self.parse_init_data(init_data_string)
    URI.decode_www_form(init_data_string).to_h
  end

  def self.get_user_from_init_data(init_data)
    JSON.parse(init_data["user"])
  end
end
