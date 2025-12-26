# == Schema Information
#
# Table name: products
#
#  id          :integer          not null, primary key
#  deleted_at  :datetime
#  description :string
#  price_stars :integer          not null
#  title       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  tg_file_id  :string           not null
#  user_id     :integer          not null
#
# Indexes
#
#  index_products_on_deleted_at  (deleted_at)
#  index_products_on_user_id     (user_id)
#
# Foreign Keys
#
#  user_id  (user_id => users.id)
#
class Product < ApplicationRecord
  belongs_to :user
  has_many :purchases, dependent: :destroy
  has_one_attached :cover

  scope :active, -> { where(deleted_at: nil) }
  scope :deleted, -> { where.not(deleted_at: nil) }

  validates :title, presence: true, length: { maximum: 100 }
  validates :price_stars, presence: true, numericality: { greater_than: 0, only_integer: true }
  validates :tg_file_id, presence: true

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
