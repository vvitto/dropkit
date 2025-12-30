class ReplaceTgFileId < ActiveRecord::Migration[8.0]
  def change
    rename_column :products, :tg_message_id, :tg_message_id
  end
end
