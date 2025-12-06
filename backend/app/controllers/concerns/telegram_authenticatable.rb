module TelegramAuthenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_telegram_user!
  end

  private

  def authenticate_telegram_user!
    init_data_string = request.headers["X-Telegram-Init-Data"]

    if init_data_string.blank?
      render json: { error: "Missing authentication" }, status: :unauthorized
      return
    end

    begin
      init_data = TelegramAuthService.parse_init_data(init_data_string)

      unless TelegramAuthService.validate_init_data(init_data)
        render json: { error: "Invalid authentication" }, status: :unauthorized
        return
      end

      user_data = TelegramAuthService.get_user_from_init_data(init_data)
      @current_user = User.find_or_create_from_telegram_data(user_data)
    rescue JSON::ParserError, StandardError => e
      render json: { error: "Authentication error: #{e.message}" }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
