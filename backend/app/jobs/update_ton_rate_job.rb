require 'net/http'

class UpdateTonRateJob < ApplicationJob
  queue_as :default

  COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd".freeze

  def perform
    Rails.logger.info "[UpdateTonRateJob] Fetching TON rate from CoinGecko"

    response = fetch_rate
    return unless response

    rate = parse_rate(response)
    return unless rate

    update_rate(rate)
  rescue StandardError => e
    Rails.logger.error "[UpdateTonRateJob] Failed to update TON rate: #{e.message}"
  end

  private

  def fetch_rate
    uri = URI(COINGECKO_API_URL)
    response = Net::HTTP.get_response(uri)

    unless response.is_a?(Net::HTTPSuccess)
      Rails.logger.error "[UpdateTonRateJob] API request failed: #{response.code}"
      return nil
    end

    response.body
  end

  def parse_rate(response_body)
    data = JSON.parse(response_body)
    rate = data.dig("the-open-network", "usd")

    unless rate
      Rails.logger.error "[UpdateTonRateJob] Invalid response format"
      return nil
    end

    rate.to_d
  end

  def update_rate(rate)
    currency_rate = CurrencyRate.find_or_initialize_by(
      from_currency: "TON",
      to_currency: "USD"
    )

    currency_rate.rate = rate
    currency_rate.save!

    Rails.logger.info "[UpdateTonRateJob] Updated TON rate: #{rate} USD"
  end
end
