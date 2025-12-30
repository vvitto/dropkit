module TelegramChat
  class SendProductIntentInstruction
    def self.call(user)
      new(user).call
    end

    def initialize(user)
      @user = user
    end

    def call
      client = Telegram.bots[:chat]
      client.send_message(chat_id: @user.telegram_id, text: message_text, parse_mode: "HTML")
    end

    private

    def message_text
      I18n.t("telegram.create_product_instruction")
    end
  end
end
