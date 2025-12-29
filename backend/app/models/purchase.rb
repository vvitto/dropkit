# == Schema Information
#
# Table name: purchases
#
#  id                         :bigint           not null, primary key
#  amount_stars               :integer          not null
#  payment_method             :string           default("stars"), not null
#  uuid                       :string           not null
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
#  index_purchases_on_uuid                        (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (buyer_id => users.id)
#  fk_rails_...  (product_id => products.id)
#
class Purchase < ApplicationRecord
  include HasUuid

  LOCKUP_PERIODS = {
    "stars" => 21.days,
    "ton" => 0.days,
    "usdt" => 0.days
  }.freeze

  belongs_to :product
  belongs_to :buyer, class_name: "User"
  has_one :balance_transaction, as: :source, class_name: "BalanceTransaction"

  validates :amount_stars, presence: true, numericality: { greater_than: 0, only_integer: true }
  validates :telegram_payment_charge_id, uniqueness: true, allow_nil: true
  validates :payment_method, presence: true

  COMMISSION_RATE = 0.05

  after_create :create_seller_transaction

  def net_amount
    commission = (amount_stars * COMMISSION_RATE).floor
    amount_stars - commission
  end

  private

  def create_seller_transaction
    seller = product.user
    lockup = LOCKUP_PERIODS.fetch(payment_method, 21.days)
    immediate = lockup.zero?
    seller_amount = net_amount

    BalanceTransaction.create!(
      user: seller,
      transaction_type: "sale",
      amount: seller_amount,
      available_at: immediate ? nil : lockup.from_now,
      processed: immediate,
      source: self
    )

    if immediate
      seller.increment!(:cached_available_stars, seller_amount)
    else
      seller.increment!(:cached_pending_stars, seller_amount)
    end
  end
end
