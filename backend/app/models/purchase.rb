class Purchase < ApplicationRecord
  belongs_to :product
  belongs_to :buyer, class_name: "User"

  enum :status, { pending: "pending", completed: "completed", refunded: "refunded" }

  validates :amount_stars, presence: true, numericality: { greater_than: 0, only_integer: true }
  validates :telegram_payment_charge_id, uniqueness: true, allow_nil: true

  after_create :increment_product_sales, if: :completed?

  private

  def increment_product_sales
    product.increment_sales!
  end
end
