module Api
  module V1
    class IncomeController < BaseController
      def show
        available_stars = current_user.available_stars
        pending_stars = current_user.pending_stars

        render json: {
          summary: {
            total_earned_stars: current_user.total_earned_stars,
            available_stars: available_stars,
            pending_stars: pending_stars,
            total_earned_usd: format_usd(current_user.total_earned_stars),
            available_usd: format_usd(available_stars),
            pending_usd: format_usd(pending_stars),
            available_ton: calculate_ton(available_stars),
            lockup_days: Purchase::LOCKUP_PERIODS["stars"].to_i / 1.day.to_i
          },
          has_pending_withdrawal: current_user.withdrawals.pending.exists?
        }
      end

      private

      def format_usd(stars)
        (stars * Withdrawal::STAR_TO_USD).round(2)
      end

      def calculate_ton(stars)
        CurrencyRate.stars_to_ton(stars)
      end
    end
  end
end
