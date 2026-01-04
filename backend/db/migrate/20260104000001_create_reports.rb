class CreateReports < ActiveRecord::Migration[8.0]
  def change
    create_table :reports do |t|
      t.references :user, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.text :description, null: false

      t.timestamps
    end

    add_index :reports, [:user_id, :product_id], unique: true
  end
end
