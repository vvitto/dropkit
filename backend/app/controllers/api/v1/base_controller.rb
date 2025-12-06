module Api
  module V1
    class BaseController < ActionController::API
      include TelegramAuthenticatable

      rescue_from ActiveRecord::RecordNotFound do |e|
        render json: { error: "Not found" }, status: :not_found
      end

      rescue_from ActiveRecord::RecordInvalid do |e|
        render json: { error: e.record.errors.full_messages.join(", ") }, status: :unprocessable_entity
      end

      rescue_from ActionController::ParameterMissing do |e|
        render json: { error: "Missing parameter: #{e.param}" }, status: :bad_request
      end
    end
  end
end
