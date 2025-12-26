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
      "<b>Хотите создать новый товар?</b>📦 - просто скиньте его одним сообщением в этот чат.👇"
    end
  end
end
