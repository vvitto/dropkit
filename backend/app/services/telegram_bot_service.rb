require "net/http"
require "json"

class TelegramBotService
  BASE_URL = "https://api.telegram.org"

  def initialize(bot_token: nil)
    @bot_token = bot_token || Rails.application.credentials.telegram.bot.token
  end

  def create_invoice_link(product:, buyer:)
    payload = {
      product_id: product.id,
      buyer_id: buyer.id,
      timestamp: Time.current.to_i
    }

    response = call_api("createInvoiceLink", {
      title: product.title,
      description: "Access to: #{product.title}",
      payload: payload.to_json,
      provider_token: "",
      currency: "XTR",
      prices: [
        { label: product.title, amount: product.price_stars }
      ]
    })

    response["result"]
  end

  def get_star_transactions(offset: nil, limit: 100)
    params = { limit: limit }
    params[:offset] = offset if offset.present?

    response = call_api("getStarTransactions", params)
    response["result"]
  end

  private

  def call_api(method, params = {})
    uri = URI("#{BASE_URL}/bot#{@bot_token}/#{method}")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri)
    request["Content-Type"] = "application/json"
    request.body = params.to_json

    response = http.request(request)
    result = JSON.parse(response.body)

    unless result["ok"]
      raise ApiError, result["description"] || "Unknown API error"
    end

    result
  end

  class ApiError < StandardError; end
end
