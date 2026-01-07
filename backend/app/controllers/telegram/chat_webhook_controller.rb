class Telegram::ChatWebhookController < Telegram::Bot::UpdatesController
  def message(message)
    if message["successful_payment"].present?
      process_successful_payment(message["successful_payment"])
      return
    end

    lang_code = payload.dig("from", "language_code")
    text = I18n.t("telegram.create_product_prompt", locale: lang_code)

    reply_with :message, text: text, parse_mode: "HTML", reply_markup: {
      inline_keyboard: [
        [
          { text: I18n.t("telegram.create_product_button", locale: lang_code), url: "https://t.me/#{Rails.configuration.app[:bot_name]}?startapp=r_#{message[:message_id]}" }
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

    scope = Product.active.joins(:user).where(user: { telegram_id: user_id })
    if query.present?
      sanitized_query = ActiveRecord::Base.sanitize_sql_like(query)
      scope = scope.where("title LIKE ?", "%#{sanitized_query}%")
    end
    products = scope.limit(50).all

    resp = products.map do |product|
      img_url = product.cover.attached? ? product.cover.url : "https://#{Rails.configuration.app[:app_host]}/img-placeholder2.webp"

      {
        type: "article",
        id: product.uuid,
        thumbnail_url: img_url,
        title: product.title,
        description: product.description || "",
        input_message_content: {
          message_text: "<b>#{CGI.escapeHTML(product.title)}</b>\n#{CGI.escapeHTML(product.description.to_s)}",
          parse_mode: "HTML",
          link_preview_options: {
            show_above_text: true,
            url: img_url
          }
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: product.buy_button_text, url: "https://t.me/#{Rails.configuration.app[:bot_name]}?startapp=p_#{product.uuid}" }
            ]
          ]
        }
      }
    end

    answer_inline_query(resp, is_personal: true,)
  end

  def start!(params = nil, *_)
    lang_code = payload.dig("from", "language_code")
    text = I18n.t("telegram.greeting", locale: lang_code)

    respond_with :photo, photo: "https://#{Rails.configuration.app[:app_host]}/img-placeholder2.webp", parse_mode: "HTML", caption: text, reply_markup: {
      inline_keyboard: [
        [
          { text: I18n.t("telegram.start", locale: lang_code), url: "https://t.me/#{Rails.configuration.app[:bot_name]}?startapp" },
        ]
      ]
    }

  rescue StandardError => e
    Rails.logger.error("Start command error: #{e.class.name} - #{e.message}")
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
