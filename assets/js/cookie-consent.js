/**
 * Cookie Consent Manager for Sales Whisper
 * Управление согласием на cookies и аналитику
 */
(function() {
  'use strict';

  const CONSENT_KEY = 'sw_cookie_consent';
  const CONSENT_VERSION = '1.0';
  
  // Configuration
  const config = {
    analyticsCookies: {
      yandexMetrika: '105925596'
    }
  };

  // Get stored consent
  function getConsent() {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return null;
  }

  // Save consent
  function saveConsent(consent) {
    const data = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      necessary: true,
      analytics: consent.analytics || false,
      marketing: consent.marketing || false
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    return data;
  }

  // Load analytics if consented
  function loadAnalytics() {
    const consent = getConsent();
    if (consent && consent.analytics) {
      // Load Yandex Metrika
      if (config.analyticsCookies.yandexMetrika && !window.ym) {
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
        ym(105925596, "init", {
          ssr: true,
          webvisor: true,
          clickmap: true,
          ecommerce: "dataLayer",
          accurateTrackBounce: true,
          trackLinks: true
        });
      }
    }
  }

  // Create banner HTML
  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
      <div class="cookie-banner">
        <div class="cookie-banner__content">
          <div class="cookie-banner__text">
            <strong>🍪 Мы используем cookies</strong>
            <p>Мы используем файлы cookies для улучшения работы сайта и анализа трафика. 
            <a href="/legal/cookies.html" target="_blank">Подробнее о cookies</a></p>
          </div>
          <div class="cookie-banner__options">
            <label class="cookie-option">
              <input type="checkbox" id="cookie-necessary" checked disabled>
              <span>Необходимые</span>
            </label>
            <label class="cookie-option">
              <input type="checkbox" id="cookie-analytics">
              <span>Аналитика</span>
            </label>
          </div>
          <div class="cookie-banner__buttons">
            <button class="btn btn--secondary btn--small" id="cookie-settings-btn">Настройки</button>
            <button class="btn btn--primary btn--small" id="cookie-accept-all">Принять все</button>
            <button class="btn btn--ghost btn--small" id="cookie-accept-selected">Сохранить выбор</button>
          </div>
        </div>
      </div>
    `;
    return banner;
  }

  // Add styles
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #cookie-consent-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10000;
        padding: 0 20px 20px;
        pointer-events: none;
      }
      .cookie-banner {
        max-width: 600px;
        margin: 0 auto;
        background: #1a1a2e;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        padding: 20px 24px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        pointer-events: auto;
      }
      .cookie-banner__text {
        margin-bottom: 15px;
      }
      .cookie-banner__text strong {
        display: block;
        margin-bottom: 8px;
        color: #fff;
        font-size: 16px;
      }
      .cookie-banner__text p {
        color: rgba(255,255,255,0.7);
        font-size: 13px;
        line-height: 1.5;
        margin: 0;
      }
      .cookie-banner__text a {
        color: #667eea;
      }
      .cookie-banner__options {
        display: flex;
        gap: 20px;
        margin-bottom: 15px;
        flex-wrap: wrap;
      }
      .cookie-option {
        display: flex;
        align-items: center;
        gap: 8px;
        color: rgba(255,255,255,0.9);
        font-size: 14px;
        cursor: pointer;
      }
      .cookie-option input {
        width: 18px;
        height: 18px;
        accent-color: #667eea;
      }
      .cookie-option input:disabled {
        opacity: 0.6;
      }
      .cookie-banner__buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .cookie-banner__buttons .btn {
        padding: 10px 16px;
        font-size: 13px;
      }
      .btn--ghost {
        background: transparent;
        border: 1px solid rgba(255,255,255,0.2);
        color: rgba(255,255,255,0.8);
      }
      .btn--ghost:hover {
        background: rgba(255,255,255,0.05);
      }
      @media (max-width: 480px) {
        .cookie-banner__buttons {
          flex-direction: column;
        }
        .cookie-banner__buttons .btn {
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize
  function init() {
    const consent = getConsent();
    
    // If already consented, just load analytics if allowed
    if (consent && consent.version === CONSENT_VERSION) {
      loadAnalytics();
      return;
    }

    // Show banner
    addStyles();
    const banner = createBanner();
    document.body.appendChild(banner);

    // Event handlers
    document.getElementById('cookie-accept-all').addEventListener('click', function() {
      saveConsent({ analytics: true, marketing: true });
      loadAnalytics();
      banner.remove();
    });

    document.getElementById('cookie-accept-selected').addEventListener('click', function() {
      const analytics = document.getElementById('cookie-analytics').checked;
      saveConsent({ analytics: analytics, marketing: false });
      if (analytics) loadAnalytics();
      banner.remove();
    });

    document.getElementById('cookie-settings-btn').addEventListener('click', function() {
      window.location.href = '/legal/cookies.html';
    });
  }

  // Expose for settings page
  window.CookieConsent = {
    getConsent: getConsent,
    saveConsent: function(opts) {
      const result = saveConsent(opts);
      if (opts.analytics) loadAnalytics();
      return result;
    },
    reset: function() {
      localStorage.removeItem(CONSENT_KEY);
      location.reload();
    }
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
