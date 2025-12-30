# == Schema Information
#
# Table name: products
#
#  id              :bigint           not null, primary key
#  buy_button_text :string           default("Buy"), not null
#  deleted_at      :datetime
#  description     :string
#  price_stars     :integer          not null
#  title           :string           not null
#  uuid            :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  tg_message_id   :string           not null
#  user_id         :integer          not null
#
# Indexes
#
#  index_products_on_deleted_at  (deleted_at)
#  index_products_on_user_id     (user_id)
#  index_products_on_uuid        (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Product < ApplicationRecord
  include HasUuid

  belongs_to :user
  has_many :purchases, dependent: :destroy
  has_one_attached :cover

  scope :active, -> { where(deleted_at: nil) }
  scope :deleted, -> { where.not(deleted_at: nil) }

  validates :title, presence: true, length: { maximum: 100 }
  validates :buy_button_text, presence: true, length: { maximum: 30 }
  validates :price_stars, presence: true, numericality: { greater_than: 0, only_integer: true }
  validates :tg_message_id, presence: true

  def purchased_by?(user)
    purchases.exists?(buyer: user)
  end

  def deleted?
    deleted_at.present?
  end

  def soft_delete!
    update!(deleted_at: Time.current)
  end
end
