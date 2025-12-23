class CreateTransactions < ActiveRecord::Migration[8.0]
  def change
    create_table :transactions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :transaction_type, null: false
      t.integer :amount, null: false
      t.datetime :available_at
      t.boolean :processed, default: false, null: false
      t.references :source, polymorphic: true

      t.timestamps
    end

    add_index :transactions, [:user_id, :available_at]
    add_index :transactions, [:user_id, :processed]
    add_index :transactions, :transaction_type
  end
end
