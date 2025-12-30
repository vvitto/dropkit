class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.string :description
      t.string :tg_message_id, null: false
      t.integer :price_stars, null: false

      t.timestamps
    end
  end
end
