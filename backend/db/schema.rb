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

ActiveRecord::Schema[8.0].define(version: 2025_12_06_000003) do
  create_table "products", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "title", null: false
    t.string "content_type", null: false
    t.text "content_text"
    t.integer "price_stars", null: false
    t.integer "sales_count", default: 0
    t.boolean "is_active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["is_active"], name: "index_products_on_is_active"
    t.index ["user_id"], name: "index_products_on_user_id"
  end

  create_table "purchases", force: :cascade do |t|
    t.integer "product_id", null: false
    t.integer "buyer_id", null: false
    t.string "telegram_payment_charge_id"
    t.integer "amount_stars", null: false
    t.string "status", default: "completed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["buyer_id"], name: "index_purchases_on_buyer_id"
    t.index ["product_id", "buyer_id"], name: "index_purchases_on_product_id_and_buyer_id"
    t.index ["product_id"], name: "index_purchases_on_product_id"
    t.index ["telegram_payment_charge_id"], name: "index_purchases_on_telegram_payment_charge_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.bigint "telegram_id", null: false
    t.string "first_name", null: false
    t.string "last_name"
    t.string "username"
    t.string "language_code", default: "en"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["telegram_id"], name: "index_users_on_telegram_id", unique: true
  end

  add_foreign_key "products", "users"
  add_foreign_key "purchases", "products"
  add_foreign_key "purchases", "users", column: "buyer_id"
end
