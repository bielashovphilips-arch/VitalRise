(function () {
  "use strict";

  const GA_ID = "G-ZWZ69L25NR";
  const META_PIXEL_ID = "279102968001873";
  const CONSENT_KEY = "vitalrise-marketing-consent";
  const BANNER_SELECTOR = "[data-vitalrise-marketing-banner]";
  const planValues = { start: 499, pro: 1499, premium: 3500 };
  let initialized = false;

  function hasConsent() {
    try {
      return window.localStorage.getItem(CONSENT_KEY) === "accepted";
    } catch (error) {
      return false;
    }
  }

  function storeConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch (error) {
      // The website remains usable when browser storage is blocked.
    }
  }

  function loadScript(id, src) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  function initializeAnalytics() {
    if (initialized || !hasConsent()) return;
    initialized = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    loadScript("vitalrise-ga4", "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID));
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });

    if (!window.fbq) {
      const fbq = function () {
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      window.fbq = fbq;
      window._fbq = fbq;
      loadScript("vitalrise-meta-pixel", "https://connect.facebook.net/en_US/fbevents.js");
      const fallback = document.createElement("noscript");
      fallback.innerHTML = '<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=' + encodeURIComponent(META_PIXEL_ID) + '&ev=PageView&noscript=1" />';
      document.body.appendChild(fallback);
    }

    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
  }

  function tierValue(tier) {
    return planValues[tier] || 0;
  }

  function productPayload(tier) {
    return {
      content_ids: [tier],
      content_name: "VitalRise " + tier,
      content_type: "product",
      value: tierValue(tier),
      currency: "UAH"
    };
  }

  function gaEvent(name, payload) {
    if (hasConsent() && typeof window.gtag === "function") window.gtag("event", name, payload);
  }

  function metaEvent(name, payload) {
    if (hasConsent() && typeof window.fbq === "function") window.fbq("track", name, payload);
  }

  window.VitalRiseAnalytics = {
    trackTierView: function (tier) {
      const payload = productPayload(tier);
      gaEvent("view_tier", Object.assign({ tier: tier }, payload));
      metaEvent("ViewContent", payload);
    },
    trackCheckoutStart: function (tier) {
      const payload = productPayload(tier);
      gaEvent("begin_checkout", Object.assign({ tier: tier, items: [{ item_id: tier, item_name: "VitalRise " + tier, price: payload.value, quantity: 1 }] }, payload));
      metaEvent("InitiateCheckout", payload);
    },
    trackPurchase: function (tier, orderId) {
      const payload = productPayload(tier);
      gaEvent("purchase", Object.assign({ transaction_id: orderId || ("manual-" + Date.now()), tier: tier, items: [{ item_id: tier, item_name: "VitalRise " + tier, price: payload.value, quantity: 1 }] }, payload));
      metaEvent("Purchase", payload);
    },
    trackCodeRedeemed: function (tier) {
      gaEvent("redeem_code", { tier: tier });
    },
    trackNewsletterSignup: function () {
      gaEvent("newsletter_signup", { source: "pricing", language: document.documentElement.lang || "uk" });
      metaEvent("Lead", { content_name: "VitalRise newsletter" });
    },
    trackFreeCalculation: function () {
      gaEvent("generate_lead", { content_name: "Free calorie estimate" });
      metaEvent("Lead", { content_name: "Free calorie estimate" });
    }
  };

  function removeBanner() {
    document.querySelector(BANNER_SELECTOR)?.remove();
  }

  function setConsent(value) {
    storeConsent(value);
    removeBanner();
    if (value === "accepted") initializeAnalytics();
  }

  function createBanner() {
    if (document.querySelector(BANNER_SELECTOR) || hasConsent()) return;
    const banner = document.createElement("aside");
    banner.dataset.vitalriseMarketingBanner = "true";
    banner.className = "marketing-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Налаштування cookies");
    banner.innerHTML = '<p><strong>Cookies та аналітика</strong><br>За вашою згодою ми використовуємо Google Analytics і Meta Pixel, щоб вимірювати ефективність реклами та покращувати сайт. Дані з калькуляторів до рекламних систем не передаються. <a href="privacy.html">Детальніше</a></p><div class="marketing-consent-actions"><button type="button" data-marketing-consent="essential">Лише необхідні</button><button type="button" data-marketing-consent="accepted">Дозволити аналітику</button></div>';
    banner.addEventListener("click", function (event) {
      const button = event.target.closest("[data-marketing-consent]");
      if (button) setConsent(button.dataset.marketingConsent);
    });
    document.body.appendChild(banner);
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (hasConsent()) initializeAnalytics();
    else createBanner();
  });
})();
