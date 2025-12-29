# == Schema Information
#
# Table name: withdrawals
#
#  id             :bigint           not null, primary key
#  amount_stars   :integer          not null
#  processed_at   :datetime
#  tx_hash        :string
#  wallet_address :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  status_id      :string           default("10"), not null
#  user_id        :integer          not null
#
# Indexes
#
#  index_withdrawals_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Withdrawal < ApplicationRecord
  STATUSES = {
    pending: 10,
    completed: 20,
    rejected: 30
  }.freeze

  STAR_TO_USD = 0.013

  belongs_to :user
  has_one :balance_transaction, as: :source, class_name: "BalanceTransaction"

  validates :amount_stars, presence: true, numericality: { greater_than: 0, only_integer: true }
  validates :wallet_address, presence: true

  scope :pending, -> { where(status_id: STATUSES[:pending]) }
  scope :completed, -> { where(status_id: STATUSES[:completed]) }
  scope :rejected, -> { where(status_id: STATUSES[:rejected]) }

  def status
    STATUSES.key(status_id)
  end

  def pending?
    status_id == STATUSES[:pending]
  end

  def completed?
    status_id == STATUSES[:completed]
  end

  def rejected?
    status_id == STATUSES[:rejected]
  end

  def mark_completed!(tx_hash:)
    ActiveRecord::Base.transaction do
      update!(
        status_id: STATUSES[:completed],
        processed_at: Time.current,
        tx_hash: tx_hash
      )
      create_withdrawal_transaction!
      user.decrement!(:cached_available_stars, amount_stars)
    end
  end

  def mark_rejected!
    update!(
      status_id: STATUSES[:rejected],
      processed_at: Time.current
    )
  end

  private

  def create_withdrawal_transaction!
    BalanceTransaction.create!(
      user: user,
      transaction_type: "withdrawal",
      amount: -amount_stars,
      available_at: nil,
      processed: true,
      source: self
    )
  end
end
