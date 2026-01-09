class AddCommissionRateToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :commission_rate, :decimal, precision: 5, scale: 4, default: 0.05, null: false
  end
end
