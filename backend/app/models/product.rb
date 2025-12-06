class Product < ApplicationRecord
  belongs_to :user
  has_many :purchases, dependent: :destroy
  has_one_attached :file

  enum :content_type, { file: "file", link: "link", text: "text" }

  validates :title, presence: true, length: { maximum: 100 }
  validates :content_type, presence: true
  validates :price_stars, presence: true, numericality: { greater_than: 0, only_integer: true }
  validate :content_presence

  scope :active, -> { where(is_active: true) }

  def increment_sales!
    increment!(:sales_count)
  end

  def purchased_by?(user)
    purchases.exists?(buyer: user)
  end

  def content_for_buyer
    case content_type
    when "file"
      { type: "file", filename: file.filename.to_s, url: nil }
    when "link"
      { type: "link", url: content_text }
    when "text"
      { type: "text", text: content_text }
    end
  end

  private

  def content_presence
    if file? && !file.attached?
      errors.add(:file, "must be attached for file content type")
    elsif (link? || text?) && content_text.blank?
      errors.add(:content_text, "can't be blank for #{content_type} content type")
    end
  end
end
