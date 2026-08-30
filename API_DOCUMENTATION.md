# 📡 YogiStream - Complete API, DRM & Stream Documentation

This document provides a comprehensive technical reference for all APIs, datasets, ClearKey DRM configurations, authentication cookies, security handshakes, and stream endpoints used across the **YogiStream Live TV Platform** (`@yogiprojects`).

---

## 📑 Table of Contents
1. [Overview & Architecture](#overview--architecture)
2. [Security & Anti-Theft Protection](#security--anti-theft-protection)
3. [API Directory Reference](#api-directory-reference)
4. [JioTV+ (Jtv+) API & ClearKey DRM](#1-jiotv-jtv-api--clearkey-drm)
5. [SonyLiv Channels API](#2-sonyliv-channels-api)
6. [SonyLiv Live Matches & Events API](#3-sonyliv-live-matches--events-api)
7. [Zee5 SD Channels & ClearKey DRM API](#4-zee5-sd-channels--clearkey-drm-api)
8. [FanCode Live Sports & Matches API](#5-fancode-live-sports--matches-api)
9. [Authentication Tokens & Cookies](#6-authentication-tokens--cookies)
10. [ClearKey DRM Implementation Guide](#7-clearkey-drm-implementation-guide)

---

## Overview & Architecture

**YogiStream** aggregates live TV channels and sports streams across 5 primary sources:
- **JioTV+**: Over 900+ HD/SD Indian and global channels with DASH MPD manifests and ClearKey DRM protection.
- **SonyLiv**: Live entertainment and Sony Sports Ten channels with HLS m3u8 playlists and tokenized proxies.
- **SonyLiv Events**: Real-time Cricket, Football, Tennis, and combat sports match feeds with Akamai DAI tokens.
- **Zee5**: Regional and National Zee Entertainment channels with DASH MPD manifests and ClearKey DRM.
- **FanCode**: Live cricket tournaments, domestic leagues, football, and multi-language HLS m3u8 streams.

---

## Security & Anti-Theft Protection

YogiStream includes built-in security features via `assets/security.js` and `api/stream-token.js`:
- **Cryptographic Token Handshake**: Generates unique client signature tokens with epoch timestamps to prevent bot scraping.
- **Domain Referrer Shield**: Validates request source against authorized domains.
- **Scraper / DevTools Deterrent**: Protects hotkeys and source inspection.
- **Official Telegram Integration**: Smart modal join system for `@yogiprojects`.

---

## API Directory Reference

All downloaded JSON datasets are stored in the `./api/` directory and replicated in corresponding module folders for offline and local standalone operation:

| Dataset File | File Size | Description | Primary Online Source |
| :--- | :--- | :--- | :--- |
| `api/jstr4web.json` | ~435 KB | Full JioTV channel database with stream URLs, DRM keys & logos | `https://jjtvxweb.pages.dev/jstr4web.json` |
| `api/den-ww.json` | ~876 KB | JioTV Worldwide channels with Akamai tokens and ClearKeys | `https://jjtvxweb.pages.dev/den-ww.json` |
| `api/sliv3.json` | ~7 KB | SonyLiv channels database with m3u8 playlist links | `https://allinonereborn2.online/sony/sliv3.json` |
| `api/sonyliv_events.json` | ~16 KB | Live match feeds, thumbnail art, and Akamai tokenized DAI m3u8s | `https://raw.githubusercontent.com/drmlive/sliv-live-events/main/sonyliv.json` |
| `api/channels199.json` | ~11 KB | Zee5 live TV channels with DASH manifest URLs & ClearKey DRM | `https://allinonereborn2.online/zee5/channels199.json` |
| `api/fancode_latest.json` | ~34 KB | FanCode matches (Live/Upcoming), scores, teams, and playlists | `https://allinonereborn2.online/fctest/json/fancode_latest.json` |
| `api/cookies.json` | ~191 B | Primary Akamai `__hdnea__` stream cookie | `https://allinonereborn2.online/jstrweb2/cookies.json` |
| `api/star_cookie.json` | ~16 KB | Dedicated Star Sports & premium channels fallback cookies | `https://allinonereborn2.online/jtv-fetch/jstarcookie/cookie.json` |

---

## 1. JioTV+ (Jtv+) API & ClearKey DRM

### Endpoint A: Channel Database (`jstr4web.json`)
- **Local Path**: `api/jstr4web.json` (or `jjtv/jstr4web.json`)
- **Method**: `GET`
- **Format**: JSON Array of Channel Objects

```json
[
  {
    "name": "Colors HD",
    "id": "144",
    "category": "Entertainment",
    "url": "https://jiotvmblive.cdn.jio.com/bpk-tv/ColorsHD_MOB/WDVLive/index.mpd",
    "keyId": "5360e12d4bb2519a9148d1089a55908d",
    "key": "7e8f500cef51595f3d43acafab1a8fb4",
    "logo": "https://jiotv.catchup.cdn.jio.com/dare_images/images/ColorsHD.png"
  }
]
```

### Endpoint B: Worldwide ClearKey Manifests (`den-ww.json`)
- **Local Path**: `api/den-ww.json` (or `jjtv/den-ww.json`)
- **Method**: `GET`

```json
[
  {
    "channel_id": "144",
    "name": "Colors HD",
    "logo": "https://jiotv.catchup.cdn.jio.com/dare_images/images/ColorsHD.png",
    "category": "Entertainment",
    "mpd": "https://mini.allinonereborn.site/jtv-plus/jtv.php/ColorsHD_MOB/WDVLive/index.mpd?__hdnea__=st=...",
    "token": "__hdnea__=st=1777177814~exp=1777199414~acl=/*~hmac=...",
    "referer": "https://www.jiotv.com/",
    "userAgent": "@yogiprojects",
    "drm": {
      "5360e12d4bb2519a9148d1089a55908d": "7e8f500cef51595f3d43acafab1a8fb4"
    }
  }
]
```

---

## 2. SonyLiv Channels API

### Endpoint: Channel List & Playlists (`sliv3.json`)
- **Local Path**: `api/sliv3.json` (or `sony/sliv3.json`)
- **Method**: `GET`

```json
{
  "sony-hd": {
    "id": "sony-hd",
    "title": "SONY HD",
    "logo": "https://jiotvimages.cdn.jio.com/dare_images/images/Sony_HD.png",
    "genre": "Entertainment",
    "language": "Hindi",
    "m3u8": "https://allinonereborn2.online/sony-new/playlists/sony_hd.m3u8"
  }
}
```

---

## 3. SonyLiv Live Matches & Events API

### Endpoint: Live Events Feed (`sonyliv_events.json`)
- **Local Path**: `api/sonyliv_events.json` (or `events/sonyliv.json`)
- **Method**: `GET`

```json
{
  "name": "Sonyliv Live Matches Data in Json",
  "telegram": "https://t.me/yogiprojects",
  "matches": [
    {
      "event_category": "Cricket",
      "isLive": true,
      "contentId": "1090540894_ENG",
      "broadcast_channel": "Sony Sports Ten 5",
      "audioLanguageName": "ENG",
      "event_name": "DP World Women's Asia Cup 2026",
      "match_name": "India Women vs Thailand Women",
      "video_url": "https://sonydaimenew.akamaized.net/hls/live/2043696/cricodi3008/ENG/std_lrh-800300010.m3u8?hdnea=..."
    }
  ]
}
```

---

## 4. Zee5 SD Channels & ClearKey DRM API

### Endpoint: Channels & Keys (`channels199.json`)
- **Local Path**: `api/channels199.json` (or `zee5/channels199.json`)
- **Method**: `GET`

```json
{
  "channels": [
    {
      "name": "Zee TV SD",
      "logo": "https://imagesdishtvd2h.whatsonindia.com/dasimages/channel/landscape/360x270/yHNSuG1V.png",
      "mpd": "https://d1g8wgjurz8via.cloudfront.net/bpk-tv/Zeetv/default/manifest.mpd",
      "clearkey": {
        "keyId": "ed068cf84f0640ccbc7c0e395c0a272e",
        "key": "bb722190f2bb446391020411a7d0828b"
      }
    }
  ]
}
```

---

## 5. FanCode Live Sports & Matches API

### Endpoint: Matches Feed (`fancode_latest.json`)
- **Local Path**: `api/fancode_latest.json` (or `fcw/fancode_latest.json`)
- **Method**: `GET`

```json
{
  "author": "@yogiprojects",
  "api_name": "FanCode Live Matches API",
  "matches": [
    {
      "match_id": 4248358,
      "title": "Lucknow Falcons Vs Gaur Gorakhpur Lions",
      "tournament": "Uttar Pradesh T20 League",
      "status": "LIVE",
      "streams": [
        {
          "language": "HINDI",
          "playlist_url": "https://allinonereborn2.online/fctest/playlists/match_4248358/hindi.m3u8"
        }
      ]
    }
  ]
}
```

---

## 6. Authentication Tokens & Cookies

### JioTV Akamai Cookie API (`api/cookies.json`)
```json
[
  { "last_updated": "20:30 30-08-2026" },
  { "cookie": "__hdnea__=st=1788102012~exp=1788123612~acl=/*~hmac=28ec9f02f939fa2f6ec6ff45c501418b18ddd725dc2d45c915bac637e3edb40e" }
]
```

### Star Sports Fallback Cookie API (`api/star_cookie.json`)
Per-channel fallback token definitions.

---

## 7. ClearKey DRM Implementation Guide

### JavaScript with Shaka Player
```javascript
const player = new shaka.Player(videoElement);

player.configure({
  drm: {
    clearKeys: {
      "ed068cf84f0640ccbc7c0e395c0a272e": "bb722190f2bb446391020411a7d0828b"
    }
  },
  streaming: {
    lowLatencyMode: true
  }
});

await player.load("https://d1g8wgjurz8via.cloudfront.net/bpk-tv/Zeetv/default/manifest.mpd");
```

---

*YogiStream Official API Documentation • Developed by [@yogiprojects](https://t.me/yogiprojects)*
