module Api
  module V1
    class WalletController < BaseController
      def payload
        json = Ton::ProofValidator.new.generate_ton_proof_payload

        render json:
      end

      def validate
        payload = params[:payload]
        service = Ton::ProofValidator.new

        begin
          is_valid = service.verify_ton_proof(
            proof: payload[:proof],
            declared_addr: payload[:address],
            ttl_seconds: Ton::ProofValidator::TTL
          )

          if is_valid
            current_user.update!(wallet_address: payload[:address])

            render status: :ok, json: { message: I18n.t("wallet.success") }
          else
            render status: :unprocessable_entity, json: { message: I18n.t("wallet.invalid_proof") }
          end
        rescue => e
          Rails.logger.error("Error validating TON proof: #{e.message}")
          render status: :internal_server_error, json: { message: I18n.t("wallet.validation_error") }
        end
      end
    end
  end
end
