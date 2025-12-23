class RenameTransactionsToBalanceTransactions < ActiveRecord::Migration[8.0]
  def change
    rename_table :transactions, :balance_transactions
  end
end
