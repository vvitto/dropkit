module Api
  module V1
    class ProductsController < BaseController
      before_action :set_own_product, only: [ :update, :destroy, :create_share_message ]
      before_action :set_any_product, only: [ :show, :create_invoice, :content, :deliver_content ]

      def index
        @products = current_user.products.active.order(created_at: :desc)
        render json: @products.map { |p| owner_product_json(p) }
      end

      def show
        if @product.user == current_user
          render json: owner_product_json(@product)
        else
          render json: public_product_json(@product)
        end
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

            @product.update!(tg_file_id: id["result"]["message_id"])

            render json: owner_product_json(@product), status: :created
          else
            render json: { error: @product.errors.full_messages.join(", ") }, status: :unprocessable_entity
          end
        end
      end

      def update
        if @product.update(update_params)
          render json: owner_product_json(@product)
        else
          render json: { error: @product.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
      end

      def destroy
        @product.soft_delete!
        head :no_content
      end

      def create_share_message
        img_url = @product.cover.attached? ? url_for(@product.cover) : "https://picsum.photos/536/354"
        response = Telegram.bots[:chat].save_prepared_inline_message(
          user_id: current_user.telegram_id,
          result: {
            type: "photo",
            thumb_url: img_url,
            photo_url: img_url,
            caption: @product.title,
            id: "share_#{Time.now.to_i}",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "⭐ Purchase product", url: "https://t.me/dropkit_bot?startapp=p_#{@product.uuid}" }
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

      def create_invoice
        if @product.deleted?
          render json: { error: "Product is no longer available" }, status: :gone
          return
        end

        if @product.user == current_user
          render json: { error: "Cannot purchase your own product" }, status: :unprocessable_entity
          return
        end

        if @product.purchased_by?(current_user)
          render json: { error: "Already purchased" }, status: :unprocessable_entity
          return
        end

        begin
          bot_service = TelegramBotService.new
          invoice_url = bot_service.create_invoice_link(product: @product, buyer: current_user)

          render json: { invoice_url: invoice_url }
        rescue TelegramBotService::ApiError => e
          render json: { error: "Failed to create invoice: #{e.message}" }, status: :service_unavailable
        end
      end

      def content
        unless @product.purchased_by?(current_user) || @product.user == current_user
          render json: { error: "Access denied" }, status: :forbidden
          return
        end

        render json: {
          tg_file_id: @product.tg_file_id
        }
      end

      def deliver_content
        unless @product.purchased_by?(current_user) || @product.user == current_user
          render json: { error: "Access denied" }, status: :forbidden
          return
        end

        begin
          client = Telegram.bots[:chat]
          client.copy_message(
            chat_id: current_user.telegram_id,
            from_chat_id: "8552432490",
            message_id: @product.tg_file_id
          )

          render json: { success: true }
        rescue TelegramBotService::ApiError => e
          render json: { error: "Failed to send file: #{e.message}" }, status: :service_unavailable
        end
      end

      private

      def set_own_product
        @product = current_user.products.active.find_by!(uuid: params[:id])
      end

      def set_any_product
        @product = Product.find_by!(uuid: params[:id])

        # Deleted products are only visible to buyers who already purchased them
        if @product.deleted? && !@product.purchased_by?(current_user)
          raise ActiveRecord::RecordNotFound
        end
      end

      def product_params
        params.require(:product).permit(:title, :description, :price_stars, :tg_file_id, :cover)
      end

      def update_params
        params.require(:product).permit(:title, :description, :price_stars, :cover)
      end

      def owner_product_json(product)
        {
          id: product.uuid,
          title: product.title,
          description: product.description,
          price_stars: product.price_stars,
          tg_file_id: product.tg_file_id,
          cover_url: product.cover.attached? ? url_for(product.cover) : nil,
          created_at: product.created_at.iso8601,
          is_owner: true
        }
      end

      def public_product_json(product)
        {
          id: product.uuid,
          title: product.title,
          description: product.description,
          price_stars: product.price_stars,
          cover_url: product.cover.attached? ? url_for(product.cover) : nil,
          is_purchased: product.purchased_by?(current_user),
          is_owner: false,
          seller: {
            first_name: product.user.first_name,
            username: product.user.username
          }
        }
      end
    end
  end
end
