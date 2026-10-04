(function () {
  "use strict";
  const GA_ID = "G-ZWZ69L25NR", KEY = "vitalrise-marketing-consent";
  const prices = { start: 499, pro: 1499, premium: 3500 };
  let initialized = false, memoryConsent = "";
  const copy = {
    uk: ["Твій вибір cookies", "Дозволь аналітику, щоб допомогти покращити VitalRise. Сайт працює і без неї.", "Лише необхідні", "Дозволити", "Налаштування cookies", "Деталі"],
    en: ["Your cookie choice", "Allow analytics to help improve VitalRise. The site works without it.", "Essential only", "Allow", "Cookie settings", "Details"],
    ru: ["Твой выбор cookies", "Разреши аналитику, чтобы помочь улучшить VitalRise. Сайт работает и без неё.", "Только необходимые", "Разрешить", "Настройки cookies", "Подробнее"]
  };
  const read = (storage, key) => { try { return storage.getItem(key) || ""; } catch { return ""; } };
  const consent = () => memoryConsent || read(window.localStorage, KEY);
  const lang = () => document.documentElement.lang || "uk";
  function canTrack() {
    const route = location.pathname.replace(/^\/(en|ru)(?=\/|$)/, "").replace(/\.html$/, "").replace(/\/$/, "") || "/";
    return consent() === "accepted" && !["localhost", "127.0.0.1", ""].includes(location.hostname)
      && ["/", "/index", "/calorie-calculator", "/training-plan", "/meal-planning", "/first-week", "/partners"].includes(route);
  }
  function inject(id, src) {
    if (document.getElementById(id)) return;
    const script = document.createElement("script"); script.id = id; script.async = true; script.src = src; document.head.appendChild(script);
  }
  function initialize() {
    if (initialized || !canTrack()) return;
    initialized = true;
    const cleanUrl = new URL(location.pathname, location.origin), params = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach(key => {
      const value = params.get(key);
      if (value && /^[a-zA-Z0-9_-]{1,80}$/.test(value)) cleanUrl.searchParams.set(key, value);
    });
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { page_location: cleanUrl.toString(), page_referrer: "", allow_google_signals: false, allow_ad_personalization_signals: false });
    inject("vitalrise-ga4", "https://www.googletagmanager.com/gtag/js?id=" + GA_ID);
    // Meta Pixel is intentionally disabled pending a separate health-data / ads review.
    // Unlike GA's explicit page_location, a pixel can attach the full current URL.
  }
  function ga(name, payload) {
    if (!canTrack()) return false;
    initialize();
    window.gtag("event", name, Object.assign({ language: lang(), page_location: location.origin + location.pathname }, payload));
    return true;
  }
  function product(tier) { return { currency: "UAH", value: prices[tier], items: [{ item_id: tier, item_name: "VitalRise " + tier, price: prices[tier], quantity: 1 }] }; }
  window.VitalRiseAnalytics = {
    trackTierView: tier => { if (prices[tier]) ga("view_tier", { tier: tier }); },
    trackCheckoutStart: tier => { if (prices[tier]) ga("begin_checkout", product(tier)); },
    trackPurchase: function (tier, orderId) {
      if (!prices[tier] || !orderId || /^mock|^manual-/i.test(orderId)) return;
      const key = "vitalrise:purchase-tracked:" + orderId;
      if (read(window.localStorage, key)) return;
      if (ga("purchase", Object.assign({ transaction_id: orderId }, product(tier)))) {
        try { window.localStorage.setItem(key, "1"); } catch { /* Storage is optional. */ }
      }
    },
    trackCodeRedeemed: tier => ga("redeem_code", { tier: tier }),
    trackNewsletterSignup: () => ga("generate_lead", { lead_source: "site_newsletter" }),
    trackFreeCalculation: () => ga("calculator_complete", { tool: "calories" }),
    trackCalculatorStart: () => ga("calculator_start", { tool: "calories" }),
    trackGuideDownload: () => ga("guide_download", { guide: "first_week" }),
    trackCta: placement => ga("cta_click", { placement: placement })
  };
  function drawBanner(force) {
    document.querySelector("[data-vitalrise-marketing-banner]")?.remove();
    if (!force && ["accepted", "essential"].includes(consent())) return;
    const words = copy[lang()] || copy.uk;
    const banner = document.createElement("aside"); banner.className = "marketing-consent"; banner.dataset.vitalriseMarketingBanner = "true";
    banner.setAttribute("aria-label", words[0]);
    const title = document.createElement("strong"); title.textContent = words[0];
    const paragraph = document.createElement("p"); paragraph.append(title, document.createElement("br"), words[1] + " ");
    const link = document.createElement("a"); link.href = "/privacy" + (lang() === "uk" ? "" : "?lang=" + lang()); link.textContent = words[5]; paragraph.appendChild(link);
    const actions = document.createElement("div"); actions.className = "marketing-consent-actions";
    ["essential", "accepted"].forEach((value, index) => {
      const button = document.createElement("button"); button.type = "button"; button.dataset.marketingConsent = value; button.textContent = words[index + 2];
      button.addEventListener("click", () => {
        const previous = consent(); memoryConsent = value;
        try { window.localStorage.setItem(KEY, value); } catch { /* Honor the in-memory choice. */ }
        banner.remove();
        if (value === "accepted") initialize();
        else if (previous === "accepted" && initialized) { window["ga-disable-" + GA_ID] = true; window.fbq?.("consent", "revoke"); location.reload(); }
      });
      actions.appendChild(button);
    });
    banner.append(paragraph, actions); document.body.appendChild(banner);
  }
  document.addEventListener("DOMContentLoaded", () => {
    initialize(); drawBanner(false);
    const settings = document.createElement("button"); settings.type = "button"; settings.className = "footer-clear-data"; settings.dataset.cookieSettings = "true";
    const localize = () => { settings.textContent = (copy[lang()] || copy.uk)[4]; if (document.querySelector("[data-vitalrise-marketing-banner]")) drawBanner(true); };
    settings.addEventListener("click", () => drawBanner(true));
    (document.querySelector("footer .footer-note") || document.querySelector("footer .container") || document.querySelector("footer") || document.body).appendChild(settings);
    localize(); new MutationObserver(localize).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  });
})();
