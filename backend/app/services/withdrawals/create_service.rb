module Withdrawals
  class CreateService
    class Error < StandardError; end

    def self.call!(user)
      new(user).call!
    end

    def initialize(user)
      @user = user
    end

    def call!
      @user.with_lock do
        raise Error, I18n.t("withdrawals.no_wallet") if @user.wallet_address.blank?
        raise Error, I18n.t("withdrawals.no_balance") if @user.available_stars <= 0
        raise Error, I18n.t("withdrawals.pending_exists") if pending_withdrawal_exists?

        @withdraw = @user.withdrawals.create!(
          amount_stars: @user.available_stars,
          wallet_address: @user.wallet_address
        )

        @user.decrement!(:cached_available_stars, @user.available_stars)
        send_message_to_group!
      end
    end

    private

    def pending_withdrawal_exists?
      @user.withdrawals.pending.exists?
    end

    def send_message_to_group!
      amount_usd = (@withdraw.amount_stars * Withdrawal::STAR_TO_USD).round(2)

      Telegram.bots[:group].send_message(
        chat_id: TelegramChat::Const::GROUP_CHAT_ID,
        message_thread_id: TelegramChat::Const::WITHDRAWS_THREAD_ID,
        text: "New withdrawal request:\nUser ID: #{@user.id}\nAmount: #{@withdraw.amount_stars} stars (~$#{amount_usd})\nWallet: #{@withdraw.wallet_address}"
      )
    rescue StandardError => e
      Rails.logger.error("Failed to send withdrawal notification: #{e.message}")
    end
  end
end
