(function () {
  const system = window.VitalRiseSystem || {};
  const TIER_KEY = "vitalrise:access:tier";
  const TOKEN_KEY = "vitalrise:access:token";
  const EMAIL_KEY = "vitalrise:access:email";
  const EXPIRES_KEY = "vitalrise:access:expires";
  const tierRank = { free: 0, start: 1, pro: 2, premium: 3, admin: 4 };

  const plans = {
    start: { 
      label: "Start", 
      price: "499 грн", 
      unlocks: {
        uk: "7-денний раціон, базова програма тренувань, PDF-звіт і Blueprint",
        en: "7-day nutrition plan, basic training program, PDF report, and Blueprint",
        ru: "7-дневный рацион, базовая программа тренировок, PDF-отчет и Blueprint"
      }
    },
    pro: { 
      label: "Pro", 
      price: "1 499 грн", 
      unlocks: {
        uk: "Усе з Start + Coach Command Center, тижневий check-in, прогрес-трекер, розширений Blueprint",
        en: "Everything in Start + Coach Command Center, weekly check-in, progress tracker, extended Blueprint",
        ru: "Все из Start + Coach Command Center, weekly check-in, трекер прогресса, расширенный Blueprint"
      }
    },
    premium: { 
      label: "Premium", 
      price: "3 500 грн", 
      unlocks: {
        uk: "Усе з Pro + персональний супровід, ручна корекція плану, пріоритетна підтримка",
        en: "Everything in Pro + personal support, manual plan correction, priority support",
        ru: "Все из Pro + персональное сопровождение, ручная коррекция плана, приоритетная поддержка"
      }
    }
  };

  function getLanguage() {
    return window.VitalRiseI18n && typeof window.VitalRiseI18n.getLanguage === "function"
      ? window.VitalRiseI18n.getLanguage()
      : "uk";
  }

  function phrase(key) {
    const language = getLanguage();
    const dictionary = {
      uk: {
        locked: "Платний модуль",
        need: "Потрібен тариф",
        unlock: "Розблокувати",
        paymentTitle: "Оформлення доступу",
        paymentText: "Введи email для створення замовлення. Після реальної оплати платіжний сервіс підтвердить покупку на сервері, і цей email отримає персональний доступ.",
        email: "Email для доступу",
        checkout: "Перейти до оплати",
        redeem: "Активувати код",
        code: "Одноразовий код доступу",
        codeHint: "Код видається сервером після підтвердження оплати і прив’язується до email.",
        close: "Закрити",
        orderCreated: "Замовлення створено. Після підключення платіжного сервісу тут відкриватиметься сторінка оплати.",
        mockUnlocked: "Тестову оплату підтверджено. Доступ відкрито.",
        codeSuccess: "Доступ відкрито.",
        codeFail: "Код не підійшов або вже використаний.",
        serverUnavailable: "Сервер доступу не відповідає. Запусти access server або спробуй пізніше.",
        invalidEmail: "Введи коректний email.",
        newsletterSuccess: "Готово. Email збережено.",
        newsletterPlaceholder: "Твій email",
        admin: "Admin-доступ активний",
        current: "Поточний доступ"
      },
      en: {
        locked: "Paid module",
        need: "Required plan",
        unlock: "Unlock",
        paymentTitle: "Access checkout",
        paymentText: "Enter your email to create an order. After real payment, the payment provider confirms the purchase on the server and this email receives personal access.",
        email: "Access email",
        checkout: "Go to payment",
        redeem: "Activate code",
        code: "One-time access code",
        codeHint: "The server issues the code after payment confirmation and binds it to the email.",
        close: "Close",
        orderCreated: "Order created. Once a payment provider is connected, the payment page will open here.",
        mockUnlocked: "Test payment confirmed. Access unlocked.",
        codeSuccess: "Access unlocked.",
        codeFail: "Code did not match or was already used.",
        serverUnavailable: "Access server is not responding. Start the access server or try later.",
        invalidEmail: "Enter a valid email.",
        newsletterSuccess: "Done. Email saved.",
        newsletterPlaceholder: "Your email",
        admin: "Admin access active",
        current: "Current access"
      },
      ru: {
        locked: "Платный модуль",
        need: "Нужен тариф",
        unlock: "Разблокировать",
        paymentTitle: "Оформление доступа",
        paymentText: "Введи email для создания заказа. После реальной оплаты платежный сервис подтвердит покупку на сервере, и этот email получит персональный доступ.",
        email: "Email для доступа",
        checkout: "Перейти к оплате",
        redeem: "Активировать код",
        code: "Одноразовый код доступа",
        codeHint: "Код выдается сервером после подтверждения оплаты и привязывается к email.",
        close: "Закрыть",
        orderCreated: "Заказ создан. После подключения платежного сервиса здесь будет открываться страница оплаты.",
        mockUnlocked: "Тестовая оплата подтверждена. Доступ открыт.",
        codeSuccess: "Доступ открыт.",
        codeFail: "Код не подошел или уже использован.",
        serverUnavailable: "Сервер доступа не отвечает. Запусти access server или попробуй позже.",
        invalidEmail: "Введи корректный email.",
        newsletterSuccess: "Готово. Email сохранен.",
        newsletterPlaceholder: "Твой email",
        admin: "Admin-доступ активен",
        current: "Текущий доступ"
      }
    };
    return (dictionary[language] || dictionary.uk)[key] || dictionary.uk[key] || "";
  }

  function normalizeTier(tier) {
    return Object.prototype.hasOwnProperty.call(tierRank, tier) ? tier : "free";
  }

  function getPlanUnlocks(tier) {
    const plan = plans[normalizeTier(tier)] || plans.start;
    if (typeof plan.unlocks === "string") return plan.unlocks;
    return plan.unlocks[getLanguage()] || plan.unlocks.uk || "";
  }

  function getStored(key) {
    try {
      return window.localStorage.getItem(key) || "";
    } catch (error) {
      return "";
    }
  }

  function setStored(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      // Storage can be unavailable in locked-down browsers.
    }
  }

  function clearPaidAccess() {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(EMAIL_KEY);
      window.localStorage.removeItem(EXPIRES_KEY);
      window.localStorage.setItem(TIER_KEY, "free");
    } catch (error) {
      // Ignore storage failures.
    }
  }

  function getTier() {
    return normalizeTier(document.body.dataset.accessTier || getStored(TIER_KEY));
  }

  function setTier(tier) {
    const normalized = normalizeTier(tier);
    document.body.dataset.accessTier = normalized;
    setStored(TIER_KEY, normalized);
    applyAccessState();
  }

  function setPaidAccess(payload) {
    const tier = normalizeTier(payload.tier);
    if (!payload.accessToken || tier === "free") return;
    setStored(TOKEN_KEY, payload.accessToken);
    setStored(TIER_KEY, tier);
    if (payload.email) setStored(EMAIL_KEY, payload.email);
    if (payload.expiresAt) setStored(EXPIRES_KEY, payload.expiresAt);
    document.body.dataset.accessTier = tier;
    applyAccessState();
  }

  function hasAccess(requiredTier) {
    const required = normalizeTier(requiredTier);
    return tierRank[getTier()] >= tierRank[required];
  }

  function getPlanLabel(tier) {
    const normalized = normalizeTier(tier);
    return plans[normalized] ? plans[normalized].label : "Free";
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  }

  function activateAdminFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("access") === "admin") {
      setTier("admin");
    }
  }

  async function postJson(url, payload) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {})
    });
    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Request failed");
    }
    return data;
  }

  async function verifyStoredToken() {
    const token = getStored(TOKEN_KEY);
    if (!token || getTier() === "admin") return;

    try {
      const data = await postJson("/api/access/verify", { token: token });
      setStored(TIER_KEY, normalizeTier(data.tier));
      if (data.email) setStored(EMAIL_KEY, data.email);
      if (data.expiresAt) setStored(EXPIRES_KEY, data.expiresAt);
      document.body.dataset.accessTier = normalizeTier(data.tier);
    } catch (error) {
      clearPaidAccess();
    }

    applyAccessState();
  }

  function ensurePaymentModal() {
    const modal = document.getElementById("payment-modal");
    if (!modal) return null;

    if (modal.dataset.accessReady === "true") return modal;
    modal.dataset.accessReady = "true";

    modal.addEventListener("click", function (event) {
      if (event.target.closest("[data-payment-close]")) closePaymentModal();
    });

    const checkoutButton = modal.querySelector("#payment-checkout-button");
    const redeemButton = modal.querySelector("#payment-redeem-button");

    if (checkoutButton) checkoutButton.addEventListener("click", submitCheckout);
    if (redeemButton) redeemButton.addEventListener("click", submitRedeemCode);

    return modal;
  }

  function updatePaymentModalText(tier) {
    const modal = ensurePaymentModal();
    if (!modal) return;
    const plan = plans[normalizeTier(tier)] || plans.start;

    modal.dataset.selectedTier = normalizeTier(tier);
    modal.querySelector("#payment-kicker").textContent = phrase("paymentTitle");
    modal.querySelector("#payment-title").textContent = plan.label + " · " + plan.price;
    modal.querySelector("#payment-plan-note").textContent = getPlanUnlocks(tier);
    modal.querySelector("#payment-plan-label").textContent = phrase("need");
    modal.querySelector("#payment-plan-value").textContent = plan.label;
    modal.querySelector("#payment-price-label").textContent = "UAH";
    modal.querySelector("#payment-price-value").textContent = plan.price;
    modal.querySelector("#payment-text").textContent = phrase("paymentText");
    modal.querySelector("#payment-email-label").textContent = phrase("email");
    modal.querySelector("#payment-code-label").textContent = phrase("code");
    modal.querySelector("#payment-code-hint").textContent = phrase("codeHint");
    modal.querySelector("#payment-close-button").textContent = phrase("close");
    modal.querySelector("#payment-checkout-button").textContent = phrase("checkout");
    modal.querySelector("#payment-redeem-button").textContent = phrase("redeem");
    modal.querySelector("#payment-status").textContent = "";

    const emailInput = modal.querySelector("#payment-email");
    if (emailInput && getStored(EMAIL_KEY)) emailInput.value = getStored(EMAIL_KEY);
  }

  function openPaymentModal(tier) {
    const modal = ensurePaymentModal();
    if (!modal) return;

    const normalizedTier = normalizeTier(tier);
    updatePaymentModalText(normalizedTier);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("has-payment-open");
    
    // Track tier view
    if (window.VitalRiseAnalytics && typeof window.VitalRiseAnalytics.trackTierView === 'function') {
      window.VitalRiseAnalytics.trackTierView(normalizedTier);
    }
  }

  function closePaymentModal() {
    const modal = document.getElementById("payment-modal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("has-payment-open");
  }

  function setPaymentStatus(message) {
    const status = document.getElementById("payment-status");
    if (status) status.textContent = message;
  }

  async function submitCheckout() {
    const modal = ensurePaymentModal();
    if (!modal) return;
    const tier = normalizeTier(modal.dataset.selectedTier || "start");
    const emailInput = modal.querySelector("#payment-email");
    const email = emailInput ? String(emailInput.value || "").trim().toLowerCase() : "";

    if (!isValidEmail(email)) {
      setPaymentStatus(phrase("invalidEmail"));
      return;
    }

    setStored(EMAIL_KEY, email);
    setPaymentStatus("...");
    
    // Track checkout start
    if (window.VitalRiseAnalytics && typeof window.VitalRiseAnalytics.trackCheckoutStart === 'function') {
      window.VitalRiseAnalytics.trackCheckoutStart(tier, email);
    }

    try {
      const data = await postJson("/api/access/checkout", { plan: tier, email: email });

      if (data.accessToken) {
        setPaidAccess(data);
        setPaymentStatus(phrase("mockUnlocked"));
        
        // Track successful purchase
        if (window.VitalRiseAnalytics && typeof window.VitalRiseAnalytics.trackPurchase === 'function') {
          window.VitalRiseAnalytics.trackPurchase(tier, data.orderId);
        }
        
        closePaymentModal();
        return;
      }

      setPaymentStatus(data.message || phrase("orderCreated"));
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    } catch (error) {
      setPaymentStatus(phrase("serverUnavailable"));
    }
  }

  async function submitRedeemCode() {
    const modal = ensurePaymentModal();
    if (!modal) return;
    const emailInput = modal.querySelector("#payment-email");
    const codeInput = modal.querySelector("#payment-access-code");
    const email = emailInput ? String(emailInput.value || "").trim().toLowerCase() : "";
    const code = codeInput ? String(codeInput.value || "").trim() : "";

    if (!isValidEmail(email)) {
      setPaymentStatus(phrase("invalidEmail"));
      return;
    }

    try {
      const data = await postJson("/api/access/redeem", { email: email, code: code });
      setPaidAccess(data);
      
      // Track code redemption
      if (window.VitalRiseAnalytics && typeof window.VitalRiseAnalytics.trackCodeRedeemed === 'function') {
        window.VitalRiseAnalytics.trackCodeRedeemed(data.tier || "unknown");
      }
      
      setPaymentStatus(phrase("codeSuccess"));
      closePaymentModal();
    } catch (error) {
      setPaymentStatus(error.message || phrase("codeFail"));
    }
  }

  function createPaywall(requiredTier) {
    const plan = plans[requiredTier] || plans.start;
    const overlay = document.createElement("div");
    overlay.className = "module-paywall";
    overlay.innerHTML =
      '<div class="module-paywall-card">' +
        '<span>' + phrase("locked") + '</span>' +
        '<h3>' + phrase("need") + ' ' + plan.label + '</h3>' +
        '<p>' + getPlanUnlocks(requiredTier) + '</p>' +
        '<button type="button" class="btn btn-primary" data-open-payment="' + requiredTier + '">' + phrase("unlock") + ' ' + plan.label + '</button>' +
      '</div>';
    return overlay;
  }

  function disableInteractive(root, disabled) {
    root.querySelectorAll("input, select, textarea, button").forEach(function (node) {
      if (node.closest(".module-paywall")) return;
      if (disabled) {
        if (!node.dataset.accessOriginalDisabled) {
          node.dataset.accessOriginalDisabled = node.disabled ? "true" : "false";
        }
        node.disabled = true;
      } else if (node.dataset.accessOriginalDisabled) {
        node.disabled = node.dataset.accessOriginalDisabled === "true";
        delete node.dataset.accessOriginalDisabled;
      }
    });
  }

  function applyAccessState() {
    const tier = getTier();
    document.body.dataset.accessTier = tier;

    document.querySelectorAll("[data-plan-required]").forEach(function (node) {
      const requiredTier = normalizeTier(node.dataset.planRequired);
      const allowed = hasAccess(requiredTier);
      const existing = node.querySelector(":scope > .module-paywall");

      node.classList.toggle("is-locked-module", !allowed);
      disableInteractive(node, !allowed);

      if (!allowed && !existing) {
        node.insertBefore(createPaywall(requiredTier), node.firstChild);
      } else if (allowed && existing) {
        existing.remove();
      } else if (!allowed && existing) {
        existing.replaceWith(createPaywall(requiredTier));
      }
    });

    document.querySelectorAll("[data-access-status]").forEach(function (node) {
      node.textContent = tier === "admin"
        ? phrase("admin")
        : phrase("current") + ": " + getPlanLabel(tier);
    });
  }

  function bindPricingButtons() {
    document.addEventListener("click", function (event) {
      const paymentTarget = event.target.closest("[data-open-payment]");
      if (paymentTarget) {
        event.preventDefault();
        openPaymentModal(paymentTarget.dataset.openPayment);
        return;
      }

      const planTarget = event.target.closest("[data-select-plan]");
      if (planTarget) {
        event.preventDefault();
        openPaymentModal(planTarget.dataset.selectPlan);
      }
    });
  }

  function bindNewsletterForm() {
    const form = document.getElementById("newsletter-form");
    if (!form) return;
    
    form.addEventListener("submit", async function(event) {
      event.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = (input.value || "").trim().toLowerCase();
      
      if (!isValidEmail(email)) {
        const status = document.getElementById("newsletter-status");
        if (status) status.textContent = phrase("invalidEmail");
        return;
      }
      
      // Store email for future use
      setStored(EMAIL_KEY, email);
      
      // Log newsletter signup
      if (window.VitalRiseAnalytics && typeof window.VitalRiseAnalytics.trackNewsletterSignup === "function") {
        window.VitalRiseAnalytics.trackNewsletterSignup();
      }
      
      const status = document.getElementById("newsletter-status");
      input.value = "";
      input.placeholder = phrase("newsletterSuccess");
      if (status) status.textContent = phrase("newsletterSuccess");
      setTimeout(() => {
        input.placeholder = phrase("newsletterPlaceholder");
        if (status) status.textContent = "";
      }, 3000);
    });
  }

  function initAccess() {
    activateAdminFromUrl();
    document.body.dataset.accessTier = getTier();
    ensurePaymentModal();
    bindPricingButtons();
    bindNewsletterForm();
    applyAccessState();
    verifyStoredToken();

    window.setTimeout(applyAccessState, 300);
    window.addEventListener("languagechange", applyAccessState);
  }

  system.access = {
    getTier: getTier,
    setTier: setTier,
    hasAccess: hasAccess,
    openPaymentModal: openPaymentModal,
    apply: applyAccessState
  };

  window.VitalRiseSystem = system;
  document.addEventListener("DOMContentLoaded", initAccess);
})();
