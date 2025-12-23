class CreateWithdrawals < ActiveRecord::Migration[8.0]
  def change
    create_table :withdrawals do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :amount_stars, null: false
      t.integer :net_amount_stars, null: false
      t.decimal :usd_equivalent, precision: 10, scale: 2
      t.string :status, default: 'pending', null: false
      t.string :payment_method
      t.string :payment_details
      t.text :admin_notes
      t.datetime :processed_at

      t.timestamps
    end

    add_index :withdrawals, [:user_id, :status]
    add_index :withdrawals, :status
  end
end
