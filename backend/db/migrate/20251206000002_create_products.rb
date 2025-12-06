class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.string :content_type, null: false
      t.text :content_text
      t.integer :price_stars, null: false
      t.integer :sales_count, default: 0
      t.boolean :is_active, default: true

      t.timestamps
    end

    add_index :products, :is_active
  end
end
