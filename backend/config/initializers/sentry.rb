# frozen_string_literal: true

Sentry.init do |config|
  config.breadcrumbs_logger = [:active_support_logger]
  config.dsn = 'https://7b2b9678da71f66ee637f52a55f3ea01@o231542.ingest.us.sentry.io/4510641024729088'
  config.send_default_pii = true
end
