Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(
      "http://localhost:5173",
      "https://localhost:5173",
      /\Ahttps:\/\/.*\.ngrok\.dev\z/,
      /\Ahttps:\/\/.*\.ngrok-free\.app\z/,
      /\Ahttps:\/\/.*\.tapps\.global\z/
    )

    resource "/api/*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      expose: [ "X-Total-Count" ],
      credentials: false
  end
end
