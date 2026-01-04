module TelegramChat
  class SendReportNotification
    def self.call(report)
      new(report).call
    end

    def initialize(report)
      @report = report
    end

    def call
      client = Telegram.bots[:group]
      client.send_message(
        chat_id: TelegramChat::Const::GROUP_CHAT_ID,
        message_thread_id: TelegramChat::Const::REPORTS_THREAD_ID,
        text: message_text,
        parse_mode: "HTML"
      )
    rescue StandardError => e
      Rails.logger.error("Failed to send report notification: #{e.message}")
    end

    private

    def message_text
      <<~TEXT
        <b>New Report</b>

        <b>Product ID:</b> #{@report.product.uuid}
        <b>Product Title:</b> #{@report.product.title}
        <b>Reporter:</b> @#{@report.user.username || @report.user.telegram_id}

        <b>Description:</b>
        #{@report.description}
      TEXT
    end
  end
end
