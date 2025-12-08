module Api
  module V1
    class ProductsController < BaseController
      def index
        @products = current_user.products.order(created_at: :desc)

        render json: @products.map { |p| product_json(p) }
      end

      private

      def product_json(product)
        {
          id: product.id,
          title: product.title,
          price_stars: product.price_stars,
          created_at: product.created_at.iso8601
        }
      end
    end
  end
end
