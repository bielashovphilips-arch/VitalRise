(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function initModuleOrbit() {
    const section = document.querySelector(".platform-section");
    if (!section) return;

    const cards = Array.prototype.slice.call(section.querySelectorAll(".module-card"));
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    let ticking = false;

    function update() {
      ticking = false;

      if (!mobileQuery.matches) {
        section.style.removeProperty("--module-orbit-angle");
        [1, 2, 3, 4, 5, 6].forEach(function (index) {
          section.style.removeProperty("--module-x-" + index);
          section.style.removeProperty("--module-y-" + index);
        });
        cards.forEach(function (card) {
          card.classList.remove("is-scroll-lit");
        });
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
      const motion = (progress - 0.5) * 20;
      const values = [
        [0.18, 0],
        [0.08, 0],
        [-0.08, 0],
        [-0.08, 0],
        [0.08, 0],
        [0.18, 0]
      ];

      values.forEach(function (pair, index) {
        section.style.setProperty("--module-x-" + (index + 1), (motion * pair[0]).toFixed(1) + "px");
        section.style.setProperty("--module-y-" + (index + 1), (motion * pair[1]).toFixed(1) + "px");
      });

      const activeIndex = clamp(Math.round(progress * (cards.length - 1)), 0, cards.length - 1);
      cards.forEach(function (card, index) {
        card.classList.toggle("is-scroll-lit", index === activeIndex);
      });
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", requestUpdate);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initModuleOrbit);
  } else {
    initModuleOrbit();
  }
})();
