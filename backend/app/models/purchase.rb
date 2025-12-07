# == Schema Information
#
# Table name: purchases
#
#  id                         :integer          not null, primary key
#  amount_stars               :integer          not null
#  status                     :string           default("completed")
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  buyer_id                   :integer          not null
#  product_id                 :integer          not null
#  telegram_payment_charge_id :string
#
# Indexes
#
#  index_purchases_on_buyer_id                    (buyer_id)
#  index_purchases_on_product_id                  (product_id)
#  index_purchases_on_product_id_and_buyer_id     (product_id,buyer_id)
#  index_purchases_on_telegram_payment_charge_id  (telegram_payment_charge_id) UNIQUE
#
# Foreign Keys
#
#  buyer_id    (buyer_id => users.id)
#  product_id  (product_id => products.id)
#
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
