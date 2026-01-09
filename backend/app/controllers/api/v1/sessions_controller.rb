module Api
  module V1
    class SessionsController < BaseController
      def show
        render json: {
          telegram_id: current_user.telegram_id,
          first_name: current_user.first_name,
          last_name: current_user.last_name,
          username: current_user.username,
          language_code: current_user.language_code,
          commission_rate: current_user.commission_rate.to_f
        }
      end

      def update
        if current_user.update(session_params)
          render json: {
            telegram_id: current_user.telegram_id,
            first_name: current_user.first_name,
            last_name: current_user.last_name,
            username: current_user.username,
            language_code: current_user.language_code,
            commission_rate: current_user.commission_rate.to_f
          }
        else
          render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def session_params
        params.permit(:language_code)
      end
    end
  end
end
