# 📺 YogiStream Live TV & Sports Hub | @yogiprojects

Complete standalone, bug-free, zero-ads streaming suite and API engine of **YogiStream** by **[@yogiprojects](https://t.me/yogiprojects)**. Includes 900+ live TV channels, SonyLiv, Zee5, FanCode live cricket and sports tournaments, ClearKey DRM configurations, session tokens, and security shield.

---

## 🌟 Highlights & Features

- **Futuristic Hub Dashboard (`index.html`)**: Cyberpunk dark mode with animated RGB gradients, dynamic Particles.js background, and instant portal routing.
- **Official Telegram Integration**: Smart, non-spammy Join Modal & Floating Widget for **`https://t.me/yogiprojects`** (`assets/security.js`).
- **Security & Anti-Theft Protection**: Client cryptographic handshake, anti-scraping deterrence, referrer lock, and obfuscated stream handlers to prevent API theft.
- **JioTV+ Portal (`jjtv/`)**: 900+ Live channels with search, categories, favorites, Worldwide ClearKey DASH player (`pworld.html`), and India Tokenized player (`pind.html`).
- **SonyLiv Portal (`sony/`)**: Full channel catalog including Sony Entertainment and Sony Sports Ten with custom JWPlayer & HLS engine (`ptest1.html`).
- **SonyLiv Live Events (`events/`)**: Real-time Cricket, Football, and combat sports match feeds with Live / Upcoming tabs (`player1.html`).
- **Zee5 SD Channels (`zee5/`)**: Regional & national Zee channels with live search and ClearKey DRM DASH playback (`player.html`).
- **FanCode Live Sports (`fcw/`)**: Live matches, tournaments, team fixtures, and multi-language commentary HLS player (`player_world.html`, `player_india.html`).
- **Full Offline & Local API Fallback**: 8 bundled JSON datasets with automatic online fallback to live streams.
- **Zero Ads / Clean Experience**: Cleaned from all intrusive ad networks and redirect scripts.
- **Vercel & Cloudflare Deployable**: Pre-configured `vercel.json`, `manifest.json`, `sitemap.xml`, and `robots.txt`.

---

## 📂 Project Directory Structure

```
.
├── index.html                 # Main YogiStream Hub Dashboard
├── robots.txt                 # SEO crawler rules
├── sitemap.xml                # Sitemap configuration
├── manifest.json              # PWA Mobile Web App Manifest
├── vercel.json                # Vercel Deployment & CORS Routing
├── API_DOCUMENTATION.md       # Complete API & DRM technical documentation
├── README.md                  # Project overview & usage guide
│
├── api/                       # 📡 Centralized API & JSON Datasets
│   ├── stream-token.js        # Vercel Serverless Handshake Function
│   ├── jstr4web.json          # JioTV Channels Database (435 KB)
│   ├── den-ww.json            # Worldwide JioTV ClearKeys & Manifests (876 KB)
│   ├── sliv3.json             # SonyLiv Stream Datasets (7 KB)
│   ├── sonyliv_events.json    # SonyLiv Live Matches Feed (16 KB)
│   ├── channels199.json       # Zee5 ClearKey DRM Channels (11 KB)
│   ├── fancode_latest.json    # FanCode Live Match Feed (34 KB)
│   ├── cookies.json           # Akamai Stream Authentication Tokens (191 B)
│   └── star_cookie.json       # Per-channel Stream Fallback Tokens (16 KB)
│
├── assets/                    # 🖼️ Security Scripts & High-Res Logos
│   ├── security.js            # YogiStream Security & Telegram Suite
│   ├── jiotv_plus.png         # JioTV+ Logo
│   ├── sony_liv.avif          # SonyLiv Logo
│   ├── sonyliv_events.png     # SonyLiv Events Logo
│   ├── zee5.jpg               # Zee5 Logo
│   ├── fancode.png            # FanCode Logo
│   ├── telegram.png           # Telegram Icon
│   └── logo.jpg               # YogiStream Logo
│
├── jjtv/                      # 📺 JioTV+ Module (900+ Live Channels)
│   ├── index.html             # JioTV+ Channel Browser (Search, Categories, Favorites)
│   ├── pworld.html            # Worldwide Shaka Player with ClearKey DRM
│   ├── pind.html              # India Shaka Player with Akamai Token Auth
│   ├── jstr4web.json          # Local JioTV Channel DB
│   └── den-ww.json            # Local Worldwide DRM DB
│
├── sony/                      # 🎬 SonyLiv Module
│   ├── index.html             # SonyLiv Channel Browser
│   ├── ptest1.html            # Custom JWPlayer & HLS Stream Player
│   └── sliv3.json             # Sony Channel Playlists & Metadata
│
├── events/                    # 🏆 SonyLiv Live Events & Sports
│   ├── index.html             # Live Events Browser (Live Now & Upcoming tabs)
│   ├── player1.html           # Live Match Video Player
│   └── sonyliv.json           # Live Matches DB
│
├── zee5/                      # 🎭 Zee5 Module
│   ├── index.html             # Zee5 Channel Browser with Search Filter
│   ├── player.html            # Shaka Player with ClearKey DRM Support
│   └── channels199.json       # Zee5 Channel & ClearKey DB
│
└── fcw/                       # 🏏 FanCode Live Sports Module
    ├── index.html             # Live Cricket & Sports Browser
    ├── player_world.html      # Worldwide HLS Video Player
    ├── player_india.html      # India Video Player
    └── fancode_latest.json    # FanCode Matches DB
```

---

## 🚀 How to Run Locally

You can run this project locally on your machine with any simple web server:

### Python 3
```bash
python -m http.server 8080
```
Then open in your browser: `http://localhost:8080`

### Node.js
```bash
npx serve .
# or
npx live-server .
```

---

## 🌐 Custom Domain Setup (`yogistream.xyz`)

Aapka platform custom domain **`yogistream.xyz`** ke liye fully configured hai:
- **DNS Records**: Add CNAME or A record pointing to your hosting provider (Vercel / Cloudflare / Netlify / VPS).
- **SSL / HTTPS**: Automatic via DNS provider.
- **Sitemap & Robots**: Pre-configured at `https://yogistream.xyz/sitemap.xml` and `https://yogistream.xyz/robots.txt`.

---

## ☁️ Deployment Guide

### Deploy to Vercel (Custom Domain: `yogistream.xyz`):
1. Terminal mein run karein:
   ```bash
   npx vercel --prod
   ```
2. Vercel Dashboard -> **Settings** -> **Domains** -> Add `yogistream.xyz` & `www.yogistream.xyz`.

### Deploy to Cloudflare Pages:
1. Upload folder or connect GitHub repository to Cloudflare Pages.
2. Custom Domains -> Add `yogistream.xyz`.

---

## 📢 Official Telegram

Join our Telegram channel for live stream links, match updates, and exclusive channels:  
🔗 **[https://t.me/yogiprojects](https://t.me/yogiprojects)** (`@yogiprojects`)

---

*Engineered with ❤️ by @yogiprojects for YogiStream.*
