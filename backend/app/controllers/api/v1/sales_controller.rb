module Api
  module V1
    class SalesController < BaseController
      PER_PAGE = 20

      def index
        scope = base_scope
        scope = apply_search(scope) if params[:q].present?

        purchases = scope
          .order(created_at: :desc)
          .limit(PER_PAGE)
          .offset(offset)

        render json: {
          sales: purchases.map { |p| sale_json(p) },
          has_more: scope.count > offset + PER_PAGE
        }
      end

      private

      def base_scope
        Purchase
          .joins(:product)
          .includes(:buyer, :product, :balance_transaction)
          .where(products: { user_id: current_user.id })
      end

      def apply_search(scope)
        query = params[:q].to_s.strip

        # Search by purchase UUID
        if query.match?(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
          return scope.where(uuid: query)
        end

        # Search by username (with or without @)
        username = query.delete_prefix("@")
        sanitized_username = ActiveRecord::Base.sanitize_sql_like(username)
        sanitized_query = ActiveRecord::Base.sanitize_sql_like(query)
        scope.joins(:buyer).where("users.username ILIKE ? OR telegram_payment_charge_id LIKE ?", "%#{sanitized_username}%", "%#{sanitized_query}%")
      end

      def offset
        [ (params[:page].to_i - 1) * PER_PAGE, 0 ].max
      end

      def sale_json(purchase)
        {
          id: purchase.uuid,
          product_title: purchase.product.title,
          amount_stars: purchase.amount_stars,
          buyer: {
            username: purchase.buyer.username,
            first_name: purchase.buyer.first_name
          },
          payment_method: purchase.payment_method,
          available_at: purchase.balance_transaction&.available_at,
          is_available: purchase.balance_transaction&.available_at.nil? ||
                        purchase.balance_transaction.available_at <= Time.current,
          created_at: purchase.created_at
        }
      end
    end
  end
end
