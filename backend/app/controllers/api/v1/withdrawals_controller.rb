module Api
  module V1
    class WithdrawalsController < BaseController
      def create
        amount = params[:amount_stars].to_i

        if amount <= 0
          render json: { error: "Invalid amount" }, status: :bad_request
          return
        end

        if amount > current_user.available_stars
          render json: { error: "Insufficient balance" }, status: :unprocessable_entity
          return
        end

        if current_user.withdrawals.pending.exists?
          render json: { error: "You already have a pending withdrawal request" }, status: :unprocessable_entity
          return
        end

        withdrawal = current_user.withdrawals.create!(
          amount_stars: amount,
          payment_method: params[:payment_method],
          payment_details: params[:payment_details]
        )

        render json: withdrawal_json(withdrawal), status: :created
      end

      def cancel
        withdrawal = current_user.withdrawals.pending.find(params[:id])
        withdrawal.mark_rejected!(notes: "Cancelled by user")
        render json: { success: true }
      end

      private

      def withdrawal_json(withdrawal)
        {
          id: withdrawal.id,
          amount_stars: withdrawal.amount_stars,
          net_amount_stars: withdrawal.net_amount_stars,
          usd_equivalent: withdrawal.usd_equivalent.to_f,
          status: withdrawal.status,
          payment_method: withdrawal.payment_method,
          created_at: withdrawal.created_at.iso8601,
          processed_at: withdrawal.processed_at&.iso8601
        }
      end
    end
  end
end
