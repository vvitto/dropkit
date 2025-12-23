# == Schema Information
#
# Table name: withdrawals
#
#  id               :integer          not null, primary key
#  admin_notes      :text
#  amount_stars     :integer          not null
#  net_amount_stars :integer          not null
#  payment_details  :string
#  payment_method   :string
#  processed_at     :datetime
#  status           :string           default("pending"), not null
#  usd_equivalent   :decimal(10, 2)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  user_id          :integer          not null
#
# Indexes
#
#  index_withdrawals_on_status              (status)
#  index_withdrawals_on_user_id             (user_id)
#  index_withdrawals_on_user_id_and_status  (user_id,status)
#
# Foreign Keys
#
#  user_id  (user_id => users.id)
#
class Withdrawal < ApplicationRecord
  STATUSES = %w[pending completed rejected].freeze
  COMMISSION_RATE = 0.05
  STAR_TO_USD = 0.013

  belongs_to :user
  has_one :balance_transaction, as: :source, class_name: "BalanceTransaction"

  validates :amount_stars, presence: true, numericality: { greater_than: 0, only_integer: true }
  validates :net_amount_stars, presence: true, numericality: { greater_than: 0, only_integer: true }
  validates :status, presence: true, inclusion: { in: STATUSES }

  scope :pending, -> { where(status: "pending") }
  scope :completed, -> { where(status: "completed") }
  scope :rejected, -> { where(status: "rejected") }

  before_validation :calculate_net_amount, on: :create
  before_validation :calculate_usd_equivalent, on: :create

  def pending?
    status == "pending"
  end

  def completed?
    status == "completed"
  end

  def rejected?
    status == "rejected"
  end

  def mark_completed!(notes: nil)
    ActiveRecord::Base.transaction do
      update!(
        status: "completed",
        processed_at: Time.current,
        admin_notes: notes
      )
      create_withdrawal_transaction!
      user.decrement!(:cached_available_stars, net_amount_stars)
    end
  end

  def mark_rejected!(notes: nil)
    update!(
      status: "rejected",
      processed_at: Time.current,
      admin_notes: notes
    )
  end

  private

  def calculate_net_amount
    return if amount_stars.blank?
    self.net_amount_stars = (amount_stars * (1 - COMMISSION_RATE)).floor
  end

  def calculate_usd_equivalent
    return if net_amount_stars.blank?
    self.usd_equivalent = net_amount_stars * STAR_TO_USD
  end

  def create_withdrawal_transaction!
    BalanceTransaction.create!(
      user: user,
      transaction_type: "withdrawal",
      amount: -net_amount_stars,
      available_at: nil,
      processed: true,
      source: self
    )
  end
end
