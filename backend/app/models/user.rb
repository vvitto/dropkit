# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  cached_available_stars :integer          default(0), not null
#  cached_pending_stars   :integer          default(0), not null
#  first_name             :string           not null
#  language_code          :string           default("en")
#  last_name              :string
#  username               :string
#  wallet_address         :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  telegram_id            :bigint           not null
#
# Indexes
#
#  index_users_on_telegram_id  (telegram_id) UNIQUE
#
class User < ApplicationRecord
  has_many :products, dependent: :destroy
  has_many :purchases, foreign_key: :buyer_id, dependent: :destroy
  has_many :purchased_products, through: :purchases, source: :product
  has_many :balance_transactions, dependent: :destroy
  has_many :withdrawals, dependent: :destroy
  has_many :reports, dependent: :destroy

  validates :telegram_id, presence: true, uniqueness: true
  validates :first_name, presence: true

  def self.find_or_create_from_telegram_data(data)
    user = find_or_initialize_by(telegram_id: data["id"])
    attrs = {
      first_name: data["first_name"],
      last_name: data["last_name"],
      username: data["username"],
      language_code: data["language_code"] || "en"
    }
    if user.persisted?
      attrs.except!(:language_code)
    else
      send_message_to_group(user)
    end
    user.update!(**attrs)
    user
  end

  def display_name
    username.present? ? "@#{username}" : first_name
  end

  # Balance methods (O(1) - read from cache)
  def available_stars
    cached_available_stars
  end

  def pending_stars
    cached_pending_stars
  end

  # Total earned from sales (requires query)
  def total_earned_stars
    balance_transactions.sales.sum(:amount)
  end

  # Recalculate cache from balance_transactions (for consistency checks)
  def recalculate_balance!
    available = balance_transactions.available.sum(:amount)
    pending = balance_transactions.pending.sum(:amount)
    update!(
      cached_available_stars: [ available, 0 ].max,
      cached_pending_stars: [ pending, 0 ].max
    )
  end

  def self.send_message_to_group(user)
    Telegram.bots[:group].send_message(
      chat_id: TelegramChat::Const::GROUP_CHAT_ID,
      message_thread_id: TelegramChat::Const::USERS_THREAD_ID,
      text: "New user | Username: #{user.display_name} ID: #{user.telegram_id}"
    )
  rescue Telegram::Bot::Error => e
    Rails.logger.error("Failed to send message to group: #{e.message}")
  end

  def locale
    language_code
  end
end
