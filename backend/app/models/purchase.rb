# == Schema Information
#
# Table name: purchases
#
#  id                         :integer          not null, primary key
#  amount_stars               :integer          not null
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

  validates :amount_stars, presence: true, numericality: { greater_than: 0, only_integer: true }
  validates :telegram_payment_charge_id, uniqueness: true, allow_nil: true
end
