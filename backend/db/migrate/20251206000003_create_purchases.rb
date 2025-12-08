class CreatePurchases < ActiveRecord::Migration[8.0]
  def change
    create_table :purchases do |t|
      t.references :product, null: false, foreign_key: true
      t.references :buyer, null: false, foreign_key: { to_table: :users }
      t.string :telegram_payment_charge_id
      t.integer :amount_stars, null: false

      t.timestamps
    end

    add_index :purchases, :telegram_payment_charge_id, unique: true
    add_index :purchases, [ :product_id, :buyer_id ]
  end
end
