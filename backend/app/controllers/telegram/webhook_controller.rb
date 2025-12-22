class Telegram::WebhookController < Telegram::Bot::UpdatesController

  def message(message)
    text = "<b>Хотите создать новый товар?</b>"

    reply_with :message, text: text, parse_mode: "HTML", reply_markup: {
      inline_keyboard: [
        [
          { text: "Создать цифровой товар", url: "https://t.me/dropkit_bot?startapp=r_#{message[:message_id]}" },
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
      img_url = product.cover.attached? ? "https://dropkit.ngrok.dev#{Rails.application.routes.url_helpers.rails_blob_path(product.cover)}" : 'https://picsum.photos/536/354'

      {
        type: 'article',
        id: product.id,
        thumbnail_url: img_url,
        title: product.title,
        description: product.description || '',
        input_message_content: {
          message_text: product.description || '',
          link_preview_options: {
            url: img_url
          }
        },
        reply_markup: {
          inline_keyboard: [
            [
              { text: "⭐ Purchase product", url: "https://t.me/dropkit_bot?startapp=p_#{product.id}" }
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
end
