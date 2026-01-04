# == Schema Information
#
# Table name: reports
#
#  id          :bigint           not null, primary key
#  description :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  product_id  :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_reports_on_product_id              (product_id)
#  index_reports_on_user_id                 (user_id)
#  index_reports_on_user_id_and_product_id  (user_id,product_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (product_id => products.id)
#  fk_rails_...  (user_id => users.id)
#
class Report < ApplicationRecord
  belongs_to :user
  belongs_to :product

  validates :description, presence: true
  validates :user_id, uniqueness: { scope: :product_id, message: "has already reported this product" }
end
