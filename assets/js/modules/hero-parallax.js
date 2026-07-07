(function () {
  const system = window.VitalRiseSystem || {};

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function initHeroParallax() {
    const hero = document.querySelector("[data-parallax-hero]");
    if (!hero) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopQuery = window.matchMedia("(min-width: 769px)");
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let renderedProgress = 0;

    function render() {
      frame = 0;

      if (motionQuery.matches) {
        hero.removeAttribute("style");
        renderedProgress = 0;
        return;
      }

      const rect = hero.getBoundingClientRect();
      const targetProgress = clamp(-rect.top / Math.max(1, rect.height * 1.08), 0, 1);
      const progressDelta = targetProgress - renderedProgress;
      renderedProgress += progressDelta * (desktopQuery.matches ? 0.058 : 0.074);

      if (Math.abs(progressDelta) < 0.0008) {
        renderedProgress = targetProgress;
      }

      const progress = renderedProgress;
      const pointerStrength = desktopQuery.matches ? 1 : 0;
      const focusProgress = clamp(progress / 0.92, 0, 1);
      const easedProgress = 1 - Math.pow(1 - focusProgress, 3);
      const copyExit = clamp((focusProgress - 0.3) / 0.7, 0, 1);
      const depthProgress = clamp((focusProgress - 0.12) / 0.88, 0, 1);
      const sweepOpacity = Math.sin(focusProgress * Math.PI);
      const scale = 1.025 + easedProgress * (desktopQuery.matches ? 0.34 : 0.25);
      const x = pointerX * 1.1 * pointerStrength - easedProgress * (desktopQuery.matches ? 2.4 : 1.2);
      const y = pointerY * 0.7 * pointerStrength + easedProgress * (desktopQuery.matches ? 1.8 : 1);
      const focusX = 68 + pointerX * 1.8 * pointerStrength + easedProgress * 3;
      const focusY = 48 + pointerY * 1.2 * pointerStrength - easedProgress * 18;

      hero.style.setProperty("--hero-media-scale", scale.toFixed(4));
      hero.style.setProperty("--hero-media-x", x.toFixed(3) + "%");
      hero.style.setProperty("--hero-media-y", y.toFixed(3) + "%");
      hero.style.setProperty("--hero-focus-x", focusX.toFixed(3) + "%");
      hero.style.setProperty("--hero-focus-y", focusY.toFixed(3) + "%");
      hero.style.setProperty("--hero-media-opacity", (1 - copyExit * 0.34).toFixed(4));
      hero.style.setProperty("--hero-media-contrast", (1.02 + easedProgress * 0.11).toFixed(4));
      hero.style.setProperty("--hero-media-saturation", (0.94 - easedProgress * 0.18).toFixed(4));
      hero.style.setProperty("--hero-vignette", (0.14 + easedProgress * 0.3).toFixed(4));
      hero.style.setProperty("--hero-copy-opacity", (1 - copyExit * 0.88).toFixed(4));
      hero.style.setProperty("--hero-badge-x", (-depthProgress * 3).toFixed(3) + "vw");
      hero.style.setProperty("--hero-badge-y", (-depthProgress * 8).toFixed(2) + "px");
      hero.style.setProperty("--hero-badge-scale", (1 - depthProgress * 0.03).toFixed(4));
      hero.style.setProperty("--hero-title-x", (-depthProgress * 8).toFixed(3) + "vw");
      hero.style.setProperty("--hero-title-y", (-depthProgress * 3).toFixed(2) + "px");
      hero.style.setProperty("--hero-title-scale", (1 + depthProgress * 0.025).toFixed(4));
      hero.style.setProperty("--hero-text-x", (-depthProgress * 5).toFixed(3) + "vw");
      hero.style.setProperty("--hero-text-y", (depthProgress * 6).toFixed(2) + "px");
      hero.style.setProperty("--hero-metrics-x", (-depthProgress * 2.5).toFixed(3) + "vw");
      hero.style.setProperty("--hero-metrics-y", (depthProgress * 18).toFixed(2) + "px");
      hero.style.setProperty("--hero-metrics-scale", (1 - depthProgress * 0.04).toFixed(4));
      hero.style.setProperty("--hero-actions-x", (-depthProgress * 1.2).toFixed(3) + "vw");
      hero.style.setProperty("--hero-actions-y", (depthProgress * 30).toFixed(2) + "px");
      hero.style.setProperty("--hero-grid-opacity", (sweepOpacity * 0.28).toFixed(4));
      hero.style.setProperty("--hero-grid-scale", (1 + easedProgress * 0.16).toFixed(4));
      hero.style.setProperty("--hero-sweep-x", (6 + focusProgress * 88).toFixed(3) + "%");
      hero.style.setProperty("--hero-sweep-opacity", (sweepOpacity * 0.9).toFixed(4));
      hero.style.setProperty("--hero-edge-opacity", (0.52 + easedProgress * 0.48).toFixed(4));

      if (Math.abs(targetProgress - renderedProgress) >= 0.0008) {
        frame = window.requestAnimationFrame(render);
      }
    }

    function requestRender() {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    }

    function handlePointer(event) {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      pointerX = clamp((event.clientX / window.innerWidth - 0.5) * 2, -1, 1);
      pointerY = clamp((event.clientY / window.innerHeight - 0.5) * 2, -1, 1);
      requestRender();
    }

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender, { passive: true });
    window.addEventListener("pointermove", handlePointer, { passive: true });
    motionQuery.addEventListener("change", requestRender);
    desktopQuery.addEventListener("change", requestRender);
    requestRender();
  }

  system.initHeroParallax = initHeroParallax;
  window.VitalRiseSystem = system;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroParallax, { once: true });
  } else {
    initHeroParallax();
  }
})();
