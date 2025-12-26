module Api
  module V1
    class WithdrawalsController < BaseController
      def create
        Withdrawals::CreateService.call!(current_user)
        render status: :created, json: { message: "Withdraw created successfully" }
      rescue StandardError => e
        Rails.logger.error("Withdraw creation failed: #{e.message}")
        render json: { error: "Withdraw creation error" }, status: :unprocessable_entity
      end
    end
  end
end
