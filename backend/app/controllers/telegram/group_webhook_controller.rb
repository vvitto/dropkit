class Telegram::GroupWebhookController < Telegram::Bot::UpdatesController
  def message(message)
    p message
  end
end
