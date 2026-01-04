module Api
  module V1
    class ReportsController < BaseController
      before_action :set_product

      def create
        if @product.user == current_user
          render json: { error: I18n.t("reports.errors.cannot_report_own") }, status: :unprocessable_entity
          return
        end

        @report = current_user.reports.build(report_params.merge(product: @product))

        if @report.save
          TelegramChat::SendReportNotification.call(@report)
          render json: { success: true }, status: :created
        else
          render json: { error: @report.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
      end

      private

      def set_product
        @product = Product.find_by!(uuid: params[:product_id])
      end

      def report_params
        params.require(:report).permit(:description)
      end
    end
  end
end
