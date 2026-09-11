(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("founder-access-form");
    const status = document.getElementById("founder-status");
    if (!form || !status) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      if (button.disabled) return;
      button.disabled = true;
      status.className = "founder-status";
      status.textContent = "Перевіряємо доступ...";

      const email = String(form.elements.email.value || "").trim().toLowerCase();
      const secret = String(form.elements.secret.value || "");

      try {
        const response = await fetch("/api/access/founder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Founder-Secret": secret
          },
          body: JSON.stringify({ email: email })
        });
        const data = await response.json();

        if (!response.ok || !data.ok || !data.accessToken) {
          throw new Error(response.status === 403 ? "Перевір email і секретний ключ власника." : "Не вдалося відкрити доступ. Спробуй ще раз.");
        }

        if (!window.VitalRiseSystem || !window.VitalRiseSystem.access || typeof window.VitalRiseSystem.access.setAccessPayload !== "function") {
          throw new Error("Модуль доступу не завантажився.");
        }

        window.VitalRiseSystem.access.setAccessPayload(data);
        form.elements.secret.value = "";
        status.textContent = "Безстроковий доступ відкрито. Перенаправляємо...";
        window.setTimeout(function () {
          window.location.href = "/";
        }, 500);
      } catch (error) {
        status.className = "founder-status error";
        status.textContent = error.message || "Помилка авторизації.";
      } finally {
        button.disabled = false;
      }
    });
  });
})();
