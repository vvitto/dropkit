class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.bigint :telegram_id, null: false
      t.string :first_name, null: false
      t.string :last_name
      t.string :username
      t.string :language_code, default: "en"

      t.timestamps
    end

    add_index :users, :telegram_id, unique: true
  end
end
