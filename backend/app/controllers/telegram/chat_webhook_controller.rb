class Telegram::ChatWebhookController < Telegram::Bot::UpdatesController
  def message(message)
    if message["successful_payment"].present?
      process_successful_payment(message["successful_payment"])
      return
    end

    text = I18n.t("telegram.create_product_prompt")

    reply_with :message, text: text, parse_mode: "HTML", reply_markup: {
      inline_keyboard: [
        [
          { text: I18n.t("telegram.create_product_button"), url: "https://t.me/#{Rails.configuration.app[:bot_name]}?startapp=r_#{message[:message_id]}" }
        ]
      ]
    }
  end

  def pre_checkout_query(_)
    answer_pre_checkout_query(true)
  end

  def inline_query(_, __)
    user_id = payload.dig("from", "id")
    query = payload["query"]

    scope = Product.joins(:user).where(user: { telegram_id: user_id })
    if query.present?
      scope .where("title LIKE ?", "%#{query}%")
    end
    products = scope.limit(10).all

    resp = products.map do |product|
      img_url = product.cover.attached? ? product.cover.url : "https://picsum.photos/536/354"

      {
        type: "article",
        id: product.uuid,
        thumbnail_url: img_url,
        title: product.title,
        description: product.description || "",
        input_message_content: {
          message_text: product.title,
          link_preview_options: {
            url: img_url
          }
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: I18n.t("telegram.purchase_button"), url: "https://t.me/#{Rails.configuration.app[:bot_name]}?startapp=p_#{product.uuid}" }
            ]
          ]
        }
      }
    end

    answer_inline_query(resp)
  end

  def start!(params = nil, *_)
    p "================================"
    # log_info("Start command received")
    # log_info("Params: #{params.inspect}")
    # log_info("Payload: #{payload}")
    p "================================"

    #     user_telegram_id = payload.dig("from", "id")
    #     if user_telegram_id.is_a?(Integer)
    #       User.where(telegram_id: user_telegram_id, bot_blocked: true).update_all(bot_blocked: false)
    #     end
    #
    #     url = ReferralImage.random_image
    #     caption = "
    # <b>Mutant Gifts</b> - The first game with integrated AI and telegram gifts.
    # Join the game to:
    # 🧬 Mutate your unique characters with NFT.
    # 🔥 Fight in epic arenas.
    # 🎁 Win new gifts every season!"
    #
    #     respond_with :photo, photo: url, parse_mode: "HTML", caption:, reply_markup: {
    #       inline_keyboard: [
    #         [
    #           { text: "🎮 Play game", url: "https://t.me/mutant_gifts_bot?startapp" },
    #           { text: "📱Community", url: "https://t.me/mutant_gifts" }
    #         ]
    #       ]
    #     }
    #
    #   rescue StandardError => e
    #     if e.message.include? "bot was blocked by the user"
    #       log_info("Bot was blocked by the user with telegram ID: #{user_telegram_id}")
    #       User.where  (telegram_id: user_telegram_id).update_all(bot_blocked: true)
    #     else
    #       raise e
    #     end
  end

  private

  def process_successful_payment(payment)
    Rails.logger.info "[Telegram Webhook] Processing successful payment"

    payload = JSON.parse(payment["invoice_payload"])
    return unless payload["product_id"].present?

    product = Product.find(payload["product_id"])
    buyer = User.find(payload["buyer_id"])

    # Skip if already purchased (idempotency)
    if Purchase.exists?(telegram_payment_charge_id: payment["telegram_payment_charge_id"])
      Rails.logger.info "[Telegram Webhook] Payment already processed: #{payment["telegram_payment_charge_id"]}"
      return
    end

    Purchase.create!(
      product: product,
      buyer: buyer,
      amount_stars: payment["total_amount"],
      telegram_payment_charge_id: payment["telegram_payment_charge_id"]
    )

    send_message_to_group!(payment, buyer, product)

    Rails.logger.info "[Telegram Webhook] Purchase created for product #{product.id} by user #{buyer.id}"
  rescue StandardError => e
    Rails.logger.error "[Telegram Webhook] Error processing payment: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
  end

  def send_message_to_group!(payment, buyer, product)
    Telegram.bots[:group].send_message(
      chat_id: TelegramChat::Const::GROUP_CHAT_ID,
      message_thread_id: TelegramChat::Const::PURCHASES_THREAD_ID,
      text: "New purchase:\nUser ID: #{buyer.id}\nAmount: #{payment['total_amount']} stars\nProduct ID: #{product.id}\nTransaction ID: #{payment['telegram_payment_charge_id']}"
    )
  rescue StandardError => e
    Rails.logger.error("Failed to send withdrawal notification: #{e.message}")
  end
end
