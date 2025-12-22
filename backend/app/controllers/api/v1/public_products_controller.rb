module Api
  module V1
    class PublicProductsController < BaseController
      before_action :set_product

      def show
        render json: {
          id: @product.id,
          title: @product.title,
          description: @product.description,
          price_stars: @product.price_stars,
          cover_url: @product.cover.attached? ? url_for(@product.cover) : nil,
          is_purchased: @product.purchased_by?(current_user),
          is_owner: @product.user == current_user,
          seller: {
            first_name: @product.user.first_name,
            username: @product.user.username
          }
        }
      end

      def check_access
        has_access = @product.purchased_by?(current_user)

        render json: { has_access: has_access }
      end

      def create_invoice
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

      def confirm_payment
        charge_id = params[:telegram_payment_charge_id]

        if charge_id.blank?
          render json: { error: "Missing payment charge ID" }, status: :bad_request
          return
        end

        if Purchase.exists?(telegram_payment_charge_id: charge_id)
          render json: { error: "Payment already processed" }, status: :unprocessable_entity
          return
        end

        purchase = @product.purchases.create!(
          buyer: current_user,
          telegram_payment_charge_id: charge_id,
          amount_stars: @product.price_stars
        )

        render json: { success: true, purchase_id: purchase.id }
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
          client = Telegram.bot
          client.copy_message(
            chat_id: current_user.telegram_id,
            from_chat_id: '8552432490',
            message_id: @product.tg_file_id
          )

          render json: { success: true }
        rescue TelegramBotService::ApiError => e
          render json: { error: "Failed to send file: #{e.message}" }, status: :service_unavailable
        end
      end

      private

      def set_product
        @product = Product.find(params[:id])
      end
    end
  end
end
