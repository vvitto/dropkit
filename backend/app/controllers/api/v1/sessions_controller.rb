module Api
  module V1
    class SessionsController < BaseController
      def show
        render json: {
          id: current_user.id,
          telegram_id: current_user.telegram_id,
          first_name: current_user.first_name,
          last_name: current_user.last_name,
          username: current_user.username,
          language_code: current_user.language_code
        }
      end
    end
  end
end
