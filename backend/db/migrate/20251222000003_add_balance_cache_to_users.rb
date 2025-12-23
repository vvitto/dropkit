class AddBalanceCacheToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :cached_available_stars, :integer, default: 0, null: false
    add_column :users, :cached_pending_stars, :integer, default: 0, null: false
  end
end
