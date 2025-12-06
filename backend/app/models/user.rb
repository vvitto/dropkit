class User < ApplicationRecord
  has_many :products, dependent: :destroy
  has_many :purchases, foreign_key: :buyer_id, dependent: :destroy
  has_many :purchased_products, through: :purchases, source: :product

  validates :telegram_id, presence: true, uniqueness: true
  validates :first_name, presence: true

  def self.find_or_create_from_telegram_data(data)
    user = find_or_initialize_by(telegram_id: data["id"])
    user.update!(
      first_name: data["first_name"],
      last_name: data["last_name"],
      username: data["username"],
      language_code: data["language_code"] || "en"
    )
    user
  end

  def display_name
    username.present? ? "@#{username}" : first_name
  end
end
