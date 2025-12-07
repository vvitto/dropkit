# Dropkit (Unlocker)

## Project Description

Telegram Mini App for instant pay-to-view digital content sales. A simplified "Gumroad/Patreon" in one button for channel admins, experts, and creators.

## Core Concept

- Sellers upload content (file/link/text), set price in Telegram Stars or TON
- App generates a widget card that can be posted to channels
- Buyers see teaser, pay in 2 clicks via Telegram Stars/wallet
- Content unlocks instantly inside Mini App

## Target Audience

- Channel admins selling micro-products (guides, checklists, presets, exclusive content)
- Telegram creators monetizing audience without complex payment setups
- Crypto-friendly users (TON/USDT payments)

## User Flows

### Seller Flow
1. Open Mini App -> View existing products dashboard
2. Click "Create new product" -> Constructor form (title, content type, price)
3. Publish -> Get shareable widget card -> Post to channel

### Buyer Flow
1. See post in channel with "Buy" button
2. Click -> Paywall screen with blurred preview
3. Pay via Telegram Stars (native payment)
4. Content unlocks with animation, download/copy available

## Tech Stack

- **Frontend**: React.js + TypeScript
- **Styling**: CSS Modules + Telegram UI component library
- **Backend**: Ruby on Rails
- **API**: REST (all client-server communication via HTTP endpoints)
- **Platform**: Telegram Mini App (native look & feel, adaptive theme)
- **Payments**: Telegram Stars, TON/USDT