class CreateCurrencyRates < ActiveRecord::Migration[8.0]
  def change
    create_table :currency_rates do |t|
      t.string :from_currency, null: false
      t.string :to_currency, null: false
      t.decimal :rate, precision: 18, scale: 8, null: false

      t.timestamps
    end

    add_index :currency_rates, [:from_currency, :to_currency], unique: true
  end
end
