class AddUuid < ActiveRecord::Migration[8.0]
  def change
    add_column :products, :uuid, :string, null: false, default: -> { "gen_random_uuid()" }
    add_column :purchases, :uuid, :string, null: false, default: -> { "gen_random_uuid()" }

    add_index :products, :uuid, unique: true
    add_index :purchases, :uuid, unique: true
  end
end
