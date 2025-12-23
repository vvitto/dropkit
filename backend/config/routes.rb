Rails.application.routes.draw do
  # API routes
  namespace :api do
    namespace :v1 do
      resource :session, only: [ :show ]

      resources :products, only: [ :index, :create, :show, :update, :destroy ]
      post 'products/:id/create_share_message', to: 'products#create_share_message'

      resources :product_intents, only: [ :create ]

      resources :public_products, only: [ :show ] do
        member do
          get :check_access
          post :create_invoice
          post :confirm_payment
          get :content
          post :deliver_content
        end
      end

      resource :income, only: [ :show ], controller: :income
      get "wallet/payload", to: "wallet#payload"
      post "wallet/validate", to: "wallet#validate"

      resources :withdrawals, only: [ :create ] do
        member do
          post :cancel
        end
      end
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"

  telegram_webhook Telegram::WebhookController
end
