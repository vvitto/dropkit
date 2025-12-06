module Api
  module V1
    class ProductsController < BaseController
      before_action :set_product, only: [ :show, :update, :destroy ]

      def index
        @products = current_user.products.order(created_at: :desc)

        render json: @products.map { |p| product_json(p) }
      end

      def show
        render json: product_json(@product, include_content: true)
      end

      def create
        @product = current_user.products.build(product_params)

        if @product.save
          render json: product_json(@product), status: :created
        else
          render json: { error: @product.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
      end

      def update
        if @product.update(product_params)
          render json: product_json(@product)
        else
          render json: { error: @product.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
      end

      def destroy
        @product.destroy
        head :no_content
      end

      private

      def set_product
        @product = current_user.products.find(params[:id])
      end

      def product_params
        params.require(:product).permit(:title, :content_type, :content_text, :price_stars, :file, :is_active)
      end

      def product_json(product, include_content: false)
        json = {
          id: product.id,
          title: product.title,
          content_type: product.content_type,
          price_stars: product.price_stars,
          sales_count: product.sales_count,
          is_active: product.is_active,
          created_at: product.created_at.iso8601
        }

        if include_content
          json[:content_text] = product.content_text if product.link? || product.text?
          # json[:file_attached] = product.file.attached?
          # json[:file_name] = product.file.filename.to_s if product.file.attached?
        end

        json
      end
    end
  end
end
