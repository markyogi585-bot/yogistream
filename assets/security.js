/**
 * YogiStream Security & Telegram Suite
 * Copyright (c) 2026 @yogiprojects (YogiStream)
 * All rights reserved.
 * 
 * Features:
 * - Anti-Theft / Anti-Scraping protection
 * - Dynamic Token Handshake & Stream Protection
 * - Domain Verification
 * - Telegram @yogiprojects Smart Modal & Floating Widget
 */

(function(window, document) {
    'use strict';

    const YOGI_CONFIG = {
        brandName: "YogiStream",
        domain: "yogistream.xyz",
        telegramChannel: "yogiprojects",
        telegramUrl: "https://t.me/yogiprojects",
        allowedHosts: ["yogistream.xyz", "www.yogistream.xyz", "localhost", "127.0.0.1"],
        popupCooldownHours: 2, // Re-prompt join after 2 hours
        appVersion: "4.0.0-yogistream"
    };

    // ── 1. CRYPTO & TOKEN HANDSHAKE SYSTEM ──
    const YogiSecurity = {
        _salt: "YOGI_STREAM_SECURE_TOKEN_2026_@yogiprojects",
        
        generateToken: function() {
            const ts = Date.now();
            const raw = ts + "_" + YOGI_CONFIG.telegramChannel + "_" + (navigator.userAgent || "");
            let hash = 0;
            for (let i = 0; i < raw.length; i++) {
                hash = ((hash << 5) - hash) + raw.charCodeAt(i);
                hash |= 0;
            }
            return btoa(JSON.stringify({
                ts: ts,
                client: "YogiStream-Client",
                sig: Math.abs(hash).toString(16),
                v: YOGI_CONFIG.appVersion
            }));
        },

        verifyEnvironment: function() {
            const host = window.location.hostname;
            // Check if domain matches or allow local
            const isAllowed = YOGI_CONFIG.allowedHosts.some(h => host === h || host.endsWith('.' + h));
            return isAllowed || host === "";
        },

        protectDevTools: function(enableBlock = false) {
            if (!enableBlock) return;
            // Prevent context menu
            document.addEventListener('contextmenu', e => e.preventDefault());
            // Prevent common scraper hotkeys (F12, Ctrl+Shift+I, Ctrl+U)
            document.addEventListener('keydown', e => {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
                    (e.ctrlKey && e.key === 'u')) {
                    e.preventDefault();
                    return false;
                }
            });
        },

        decryptStreamKey: function(keyId, key) {
            // Validates format and returns clearKey map
            if (!keyId || !key) return null;
            return { [keyId.trim()]: key.trim() };
        }
    };

    // ── 2. SMART TELEGRAM MODAL & FLOATING WIDGET ──
    const YogiTelegram = {
        storageKey: 'yogistream_tg_popup_ts',

        init: function() {
            this.injectStyles();
            this.injectFloatingButton();
            this.checkAndShowPopup();
        },

        injectStyles: function() {
            if (document.getElementById('yogi-tg-styles')) return;
            const style = document.createElement('style');
            style.id = 'yogi-tg-styles';
            style.textContent = `
                /* YogiStream Telegram Modal & Floating Button */
                .yogi-float-btn {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    background: linear-gradient(135deg, #0088cc, #00c6ff);
                    color: #fff;
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    box-shadow: 0 8px 25px rgba(0, 136, 204, 0.45);
                    cursor: pointer;
                    z-index: 9999;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: 2px solid rgba(255, 255, 255, 0.25);
                    text-decoration: none;
                }
                .yogi-float-btn:hover {
                    transform: scale(1.1) translateY(-4px);
                    box-shadow: 0 12px 30px rgba(0, 204, 255, 0.6);
                    color: #fff;
                }
                .yogi-modal-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(5, 7, 18, 0.88);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.35s ease;
                    padding: 16px;
                }
                .yogi-modal-backdrop.show {
                    opacity: 1;
                    visibility: visible;
                }
                .yogi-modal-card {
                    background: linear-gradient(160deg, #161b2e, #0d101d);
                    border: 1px solid rgba(0, 198, 255, 0.3);
                    border-radius: 28px;
                    padding: 32px 24px 28px;
                    max-width: 440px;
                    width: 100%;
                    text-align: center;
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 136, 204, 0.2);
                    transform: scale(0.9);
                    transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                }
                .yogi-modal-backdrop.show .yogi-modal-card {
                    transform: scale(1);
                }
                .yogi-modal-icon {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #0088cc, #00c6ff);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 36px;
                    color: #fff;
                    margin-bottom: 18px;
                    box-shadow: 0 0 25px rgba(0, 198, 255, 0.5);
                    animation: pulseYogi 2s infinite;
                }
                @keyframes pulseYogi {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(0, 198, 255, 0.4); }
                    50% { transform: scale(1.06); box-shadow: 0 0 35px rgba(0, 198, 255, 0.7); }
                }
                .yogi-modal-title {
                    font-size: 1.6rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 8px;
                    font-family: 'Poppins', system-ui, sans-serif;
                }
                .yogi-modal-title span {
                    background: linear-gradient(90deg, #00c6ff, #0072ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .yogi-modal-desc {
                    color: #a4b3d6;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    margin-bottom: 24px;
                }
                .yogi-btn-join {
                    display: block;
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(90deg, #0088cc, #00c6ff);
                    color: #fff;
                    border-radius: 50px;
                    font-weight: 700;
                    font-size: 1.05rem;
                    text-decoration: none;
                    box-shadow: 0 6px 20px rgba(0, 136, 204, 0.4);
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    margin-bottom: 12px;
                }
                .yogi-btn-join:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0, 198, 255, 0.6);
                    filter: brightness(1.1);
                    color: #fff;
                }
                .yogi-btn-close {
                    background: transparent;
                    border: none;
                    color: #6b7a9e;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .yogi-btn-close:hover {
                    color: #d1dcfa;
                }
                @media (max-width: 480px) {
                    .yogi-float-btn { bottom: 16px; right: 16px; width: 48px; height: 48px; font-size: 20px; }
                    .yogi-modal-card { padding: 24px 18px 20px; }
                    .yogi-modal-title { font-size: 1.35rem; }
                }
            `;
            document.head.appendChild(style);
        },

        injectFloatingButton: function() {
            if (document.getElementById('yogi-float-tg')) return;
            const a = document.createElement('a');
            a.id = 'yogi-float-tg';
            a.className = 'yogi-float-btn';
            a.href = YOGI_CONFIG.telegramUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.title = 'Join @' + YOGI_CONFIG.telegramChannel + ' on Telegram';
            a.innerHTML = '<i class="fab fa-telegram-plane"></i>';
            document.body.appendChild(a);
        },

        showModal: function() {
            let backdrop = document.getElementById('yogi-tg-modal');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'yogi-tg-modal';
                backdrop.className = 'yogi-modal-backdrop';
                backdrop.innerHTML = `
                    <div class="yogi-modal-card">
                        <div class="yogi-modal-icon">
                            <i class="fab fa-telegram-plane"></i>
                        </div>
                        <h2 class="yogi-modal-title">Join <span>@${YOGI_CONFIG.telegramChannel}</span></h2>
                        <p class="yogi-modal-desc">Get daily updated live streams, instant match links, server updates & exclusive channels on our official Telegram channel!</p>
                        <a href="${YOGI_CONFIG.telegramUrl}" target="_blank" rel="noopener noreferrer" class="yogi-btn-join" id="yogi-join-action">
                            <i class="fab fa-telegram-plane" style="margin-right:8px;"></i> JOIN TELEGRAM NOW
                        </a>
                        <button class="yogi-btn-close" id="yogi-close-modal">Maybe Later</button>
                    </div>
                `;
                document.body.appendChild(backdrop);

                document.getElementById('yogi-close-modal').addEventListener('click', () => {
                    this.closeModal();
                });
                document.getElementById('yogi-join-action').addEventListener('click', () => {
                    this.closeModal();
                });
                backdrop.addEventListener('click', (e) => {
                    if (e.target === backdrop) this.closeModal();
                });
            }

            setTimeout(() => {
                backdrop.classList.add('show');
            }, 100);
        },

        closeModal: function() {
            const backdrop = document.getElementById('yogi-tg-modal');
            if (backdrop) {
                backdrop.classList.remove('show');
            }
            // Update last shown time
            localStorage.setItem(this.storageKey, Date.now().toString());
        },

        checkAndShowPopup: function() {
            const lastShown = localStorage.getItem(this.storageKey);
            const now = Date.now();
            const cooldownMs = YOGI_CONFIG.popupCooldownHours * 60 * 60 * 1000;

            if (!lastShown || (now - parseInt(lastShown, 10)) > cooldownMs) {
                // Show after 3 seconds on page load
                setTimeout(() => {
                    this.showModal();
                }, 3000);
            }
        }
    };

    // Expose Global Object
    window.YogiStream = {
        config: YOGI_CONFIG,
        security: YogiSecurity,
        telegram: YogiTelegram
    };

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => YogiTelegram.init());
    } else {
        YogiTelegram.init();
    }

})(window, document);
