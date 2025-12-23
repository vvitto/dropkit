class AddPaymentMethodToPurchases < ActiveRecord::Migration[8.0]
  def change
    add_column :purchases, :payment_method, :string, default: 'stars', null: false
  end
end
