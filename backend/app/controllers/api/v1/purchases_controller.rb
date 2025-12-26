module Api
  module V1
    class PurchasesController < BaseController
      def index
        @purchases = current_user.purchases
          .includes(product: :user)
          .order(created_at: :desc)

        render json: @purchases.map { |p| purchase_json(p) }
      end

      private

      def purchase_json(purchase)
        product = purchase.product
        seller = product.user

        {
          id: purchase.id,
          purchased_at: purchase.created_at.iso8601,
          product: {
            id: product.id,
            title: product.title,
            description: product.description,
            price_stars: product.price_stars,
            cover_url: product.cover.attached? ? url_for(product.cover) : nil
          },
          seller: {
            first_name: seller.first_name,
            username: seller.username
          }
        }
      end
    end
  end
end
