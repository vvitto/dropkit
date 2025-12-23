module Api
  module V1
    class IncomeController < BaseController
      def show
        render json: {
          summary: {
            total_earned_stars: current_user.total_earned_stars,
            available_stars: current_user.available_stars,
            total_earned_usd: format_usd(current_user.total_earned_stars),
            available_usd: format_usd(current_user.available_stars),
            commission_rate: (Withdrawal::COMMISSION_RATE * 100).to_i,
            lockup_days: Purchase::LOCKUP_PERIODS["stars"].to_i / 1.day.to_i
          },
          has_pending_withdrawal: current_user.withdrawals.pending.exists?
        }
      end

      private

      def format_usd(stars)
        (stars * Withdrawal::STAR_TO_USD).round(2)
      end
    end
  end
end
