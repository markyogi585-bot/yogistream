/**
 * YogiStream Advanced Security & Anti-Scraping Shield
 * Official Domain: yogistream.xyz
 * Telegram: @yogiprojects
 */

(function () {
  'use strict';

  const YOGI_CONFIG = {
    domain: 'yogistream.xyz',
    telegramChannel: 'yogiprojects',
    telegramUrl: 'https://t.me/yogiprojects',
    version: '4.5.0-PRO'
  };

  // Anti-DevTools / Anti-Inspection Protection (Gentle Mode)
  function initAntiInspection() {
    // Disable context menu on video elements only to protect stream inspection
    document.addEventListener('contextmenu', function (e) {
      if (e.target.tagName === 'VIDEO' || e.target.closest('.shaka-video-container')) {
        e.preventDefault();
      }
    });

    // Disable common scraping shortcuts on video pages
    document.addEventListener('keydown', function (e) {
      // F12 or Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
      ) {
        if (window.location.pathname.includes('player') || window.location.pathname.includes('pind') || window.location.pathname.includes('pworld')) {
          e.preventDefault();
          return false;
        }
      }
    });
  }

  // Auto-Fix Broken Images across the site
  function initImageShield() {
    document.addEventListener('error', function (e) {
      if (e.target.tagName === 'IMG') {
        const img = e.target;
        if (!img.dataset.fallbackApplied) {
          img.dataset.fallbackApplied = 'true';
          const name = img.getAttribute('alt') || 'Live TV';
          // Fallback to high quality SVG badge
          img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=101428&color=00f0ff&bold=true&length=2`;
        }
      }
    }, true);
  }

  // Session Token & Watermark Engine
  function initSessionProtection() {
    if (!sessionStorage.getItem('yogi_session_token')) {
      const token = 'yogi_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
      sessionStorage.setItem('yogi_session_token', token);
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initAntiInspection();
      initImageShield();
      initSessionProtection();
    });
  } else {
    initAntiInspection();
    initImageShield();
    initSessionProtection();
  }

  window.YOGI_SECURITY = {
    version: YOGI_CONFIG.version,
    getSession: () => sessionStorage.getItem('yogi_session_token')
  };
})();
