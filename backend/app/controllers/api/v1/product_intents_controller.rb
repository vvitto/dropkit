module Api
  module V1
    class ProductIntentsController < BaseController
      def create
        TelegramChat::SendProductIntentInstruction.call(current_user)
        render json: { message: I18n.t("product_intents.instruction_sent") }, status: :ok
      rescue Telegram::Bot::Forbidden => e
        render json: { error: 'Bot is blocked' }, status: :forbidden
      end
    end
  end
end
