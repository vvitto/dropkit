class AddBuyButtonText < ActiveRecord::Migration[8.0]
  def change
    add_column :products, :buy_button_text, :string, null: false, default: "Buy"
  end
end
