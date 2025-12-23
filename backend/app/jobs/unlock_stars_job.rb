class UnlockStarsJob < ApplicationJob
  queue_as :default

  def perform
    Rails.logger.info "[UnlockStarsJob] Starting to process unlocked transactions"

    unlocked_count = 0

    BalanceTransaction.where(transaction_type: "sale")
               .where("available_at <= ?", Time.current)
               .where(processed: false)
               .find_each do |tx|
      tx.user.with_lock do
        tx.update!(processed: true)
        tx.user.decrement!(:cached_pending_stars, tx.amount)
        tx.user.increment!(:cached_available_stars, tx.amount)
        unlocked_count += 1
      end
    end

    Rails.logger.info "[UnlockStarsJob] Completed. Unlocked #{unlocked_count} transactions"
  end
end
