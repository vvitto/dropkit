module Api
  module V1
    class ProductIntentsController < BaseController
      def create
        TelegramChat::SendProductIntentInstruction.call(current_user)
        render json: { message: "Instruction sent" }, status: :ok
      end
    end
  end
end
