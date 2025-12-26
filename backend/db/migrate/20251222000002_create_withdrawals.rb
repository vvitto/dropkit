class CreateWithdrawals < ActiveRecord::Migration[8.0]
  def change
    create_table :withdrawals do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :amount_stars, null: false
      t.string :status_id, default: 10, null: false
      t.string :tx_hash
      t.string :wallet_address, null: false
      t.datetime :processed_at

      t.timestamps
    end
  end
end
