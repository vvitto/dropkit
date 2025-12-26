module Api
  module V1
    class ProductsController < BaseController
      def index
        @products = current_user.products.order(created_at: :desc)

        render json: @products.map { |p| product_json(p) }
      end

      def create
        current_user.with_lock do
          @product = current_user.products.build(product_params)

          if @product.save
            client = Telegram.bots[:chat]
            id = client.copy_message(
              chat_id: TelegramChat::Const::PRODUCTS_CHAT_ID,
              from_chat_id: current_user.telegram_id,
              message_id: params[:product][:tg_file_id]
            )

            @product.update!(tg_file_id: id['result']['message_id'])

            render json: product_json(@product), status: :created
          else
            render json: { error: @product.errors.full_messages.join(", ") }, status: :unprocessable_entity
          end
        end
      end

      def create_share_message
        product = current_user.products.find(params[:id])
        img_url = product.cover.attached? ? url_for(product.cover) : 'https://picsum.photos/536/354'
        response = Telegram.bots[:chat].save_prepared_inline_message(
          user_id: current_user.telegram_id,
          result: {
            type: "photo",
            thumb_url: img_url,
            photo_url: img_url,
            caption: product.title,
            id: "share_#{Time.now.to_i}",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "⭐ Purchase product", url: "https://t.me/dropkit_bot?startapp=p_#{product.id}" },
                ]
              ]
            }
          },
          allow_user_chats: true,
          allow_group_chats: true,
          allow_channel_chats: true
        )

        if response["ok"]
          render json: { message_id: response["result"]["id"] }, status: :ok
        else
          Rails.logger.error "Failed to prepare share message: #{response.inspect}"
          render json: { error: "Failed to prepare share message" }, status: :unprocessable_entity
        end

      rescue Telegram::Bot::Error => e
        Rails.logger.error "Error while preparing share message: #{e.class.name} #{e.message}"
        render json: { error: "Failed to prepare share message" }, status: :unprocessable_entity
      end

      private

      def product_params
        params.require(:product).permit(:title, :description, :price_stars, :tg_file_id, :cover)
      end

      def product_json(product)
        {
          id: product.id,
          title: product.title,
          description: product.description,
          price_stars: product.price_stars,
          tg_file_id: product.tg_file_id,
          cover_url: product.cover.attached? ? url_for(product.cover) : nil,
          created_at: product.created_at.iso8601
        }
      end
    end
  end
end
