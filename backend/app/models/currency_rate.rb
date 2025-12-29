# == Schema Information
#
# Table name: currency_rates
#
#  id            :bigint           not null, primary key
#  from_currency :string           not null
#  to_currency   :string           not null
#  rate          :decimal(18, 8)   not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_currency_rates_on_from_currency_and_to_currency  (from_currency,to_currency) UNIQUE
#
class CurrencyRate < ApplicationRecord
  validates :from_currency, presence: true
  validates :to_currency, presence: true
  validates :rate, presence: true, numericality: { greater_than: 0 }
  validates :from_currency, uniqueness: { scope: :to_currency }

  def self.ton_usd_rate
    find_by(from_currency: "TON", to_currency: "USD")&.rate
  end

  def self.usd_to_ton(usd_amount)
    rate = ton_usd_rate
    return nil unless rate && rate > 0

    (usd_amount / rate).round(4)
  end

  # Convert Stars to TON (Stars -> USD -> TON)
  def self.stars_to_ton(stars_amount)
    usd_amount = stars_amount * Withdrawal::STAR_TO_USD
    usd_to_ton(usd_amount)
  end
end
