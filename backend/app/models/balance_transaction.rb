# == Schema Information
#
# Table name: balance_transactions
#
#  id               :bigint           not null, primary key
#  amount           :integer          not null
#  available_at     :datetime
#  processed        :boolean          default(FALSE), not null
#  source_type      :string
#  transaction_type :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  source_id        :integer
#  user_id          :integer          not null
#
# Indexes
#
#  index_balance_transactions_on_transaction_type          (transaction_type)
#  index_balance_transactions_on_user_id                   (user_id)
#  index_balance_transactions_on_user_id_and_available_at  (user_id,available_at)
#  index_balance_transactions_on_user_id_and_processed     (user_id,processed)
#  index_transactions_on_source                            (source_type,source_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class BalanceTransaction < ApplicationRecord
  TYPES = %w[sale withdrawal refund fee].freeze

  belongs_to :user
  belongs_to :source, polymorphic: true, optional: true

  validates :transaction_type, presence: true, inclusion: { in: TYPES }
  validates :amount, presence: true, numericality: { other_than: 0 }

  scope :available, -> { where("available_at IS NULL OR available_at <= ?", Time.current) }
  scope :pending, -> { where("available_at > ?", Time.current) }
  scope :unprocessed, -> { where(processed: false) }
  scope :sales, -> { where(transaction_type: "sale") }
  scope :withdrawals, -> { where(transaction_type: "withdrawal") }
end
