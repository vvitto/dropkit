module Api
  module V1
    class WithdrawalsController < BaseController
      def create
        Withdrawals::CreateService.call!(current_user)
        render status: :created, json: { message: I18n.t("withdrawals.created") }
      rescue StandardError => e
        Rails.logger.error("Withdraw creation failed: #{e.message}")
        render json: { error: I18n.t("withdrawals.creation_error") }, status: :unprocessable_entity
      end
    end
  end
end
