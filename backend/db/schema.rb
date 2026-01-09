# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_01_09_000001) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "balance_transactions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "transaction_type", null: false
    t.integer "amount", null: false
    t.datetime "available_at"
    t.boolean "processed", default: false, null: false
    t.string "source_type"
    t.integer "source_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["source_type", "source_id"], name: "index_transactions_on_source"
    t.index ["transaction_type"], name: "index_balance_transactions_on_transaction_type"
    t.index ["user_id", "available_at"], name: "index_balance_transactions_on_user_id_and_available_at"
    t.index ["user_id", "processed"], name: "index_balance_transactions_on_user_id_and_processed"
    t.index ["user_id"], name: "index_balance_transactions_on_user_id"
  end

  create_table "currency_rates", force: :cascade do |t|
    t.string "from_currency", null: false
    t.string "to_currency", null: false
    t.decimal "rate", precision: 18, scale: 8, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["from_currency", "to_currency"], name: "index_currency_rates_on_from_currency_and_to_currency", unique: true
  end

  create_table "products", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "title", null: false
    t.string "description"
    t.string "tg_message_id", null: false
    t.integer "price_stars", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.string "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.string "buy_button_text", default: "Buy", null: false
    t.index ["deleted_at"], name: "index_products_on_deleted_at"
    t.index ["user_id"], name: "index_products_on_user_id"
    t.index ["uuid"], name: "index_products_on_uuid", unique: true
  end

  create_table "purchases", force: :cascade do |t|
    t.integer "product_id", null: false
    t.integer "buyer_id", null: false
    t.string "telegram_payment_charge_id"
    t.integer "amount_stars", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "payment_method", default: "stars", null: false
    t.string "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.index ["buyer_id"], name: "index_purchases_on_buyer_id"
    t.index ["product_id", "buyer_id"], name: "index_purchases_on_product_id_and_buyer_id"
    t.index ["product_id"], name: "index_purchases_on_product_id"
    t.index ["telegram_payment_charge_id"], name: "index_purchases_on_telegram_payment_charge_id", unique: true
    t.index ["uuid"], name: "index_purchases_on_uuid", unique: true
  end

  create_table "reports", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "product_id", null: false
    t.text "description", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_reports_on_product_id"
    t.index ["user_id", "product_id"], name: "index_reports_on_user_id_and_product_id", unique: true
    t.index ["user_id"], name: "index_reports_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.bigint "telegram_id", null: false
    t.string "first_name", null: false
    t.string "last_name"
    t.string "username"
    t.string "language_code", default: "en"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "cached_available_stars", default: 0, null: false
    t.integer "cached_pending_stars", default: 0, null: false
    t.string "wallet_address"
    t.decimal "commission_rate", precision: 5, scale: 4, default: "0.05", null: false
    t.index ["telegram_id"], name: "index_users_on_telegram_id", unique: true
  end

  create_table "withdrawals", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "amount_stars", null: false
    t.string "status_id", default: "10", null: false
    t.string "tx_hash"
    t.string "wallet_address", null: false
    t.datetime "processed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_withdrawals_on_user_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "balance_transactions", "users"
  add_foreign_key "products", "users"
  add_foreign_key "purchases", "products"
  add_foreign_key "purchases", "users", column: "buyer_id"
  add_foreign_key "reports", "products"
  add_foreign_key "reports", "users"
  add_foreign_key "withdrawals", "users"
end
