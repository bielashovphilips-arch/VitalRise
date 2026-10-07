const CACHE_NAME = "vitalrise-nutrition-20261007-3";
const RUNTIME_CACHE_NAME = "vitalrise-runtime-nutrition-20261007-3";
const APP_SHELL = [
  "./assets/js/modules/lab-evidence.js?v=release-20261004-1",
  "./assets/css/training-session.css?v=release-20261004-1",
  "./assets/js/modules/training-adaptation.js?v=release-20261004-1",
  "./assets/js/modules/training-session.js?v=release-20261004-1",
  "./assets/js/modules/training-progress.js?v=release-20261004-1",
  "./assets/css/calculator-studio.css?v=release-20261004-1",
  "./assets/images/training-gym-vitalrise.webp",
  "./assets/js/modules/calculator-studio.js?v=release-20261004-1",
  "./assets/css/brand-icon.css?v=release-20261004-1",
  "./assets/images/logo-icon.svg?v=metallic-r-20260911",
  "./",
  "./index.html",
  "./nutrition.html",
  "./training.html",
  "./profile.html",
  "./labs.html",
  "./supplements.html",
  "./recovery.html",
  "./progress.html",
  "./blueprint.html",
  "./vlog.html",
  "./privacy.html",
  "./terms.html",
  "./disclaimer.html",
  "./assets/css/style.css?v=release-20261004-1",
  "./assets/images/labs-bloodwork-bg.webp",
  "./assets/images/nutrition-food-bg.webp",
  "./assets/images/vlog-dna-bg-photo.png",
  "./assets/images/logo-icon.svg?v=logo-v2",
  "./assets/images/exercises/vitalrise-seated-dumbbell-press.png",
  "./assets/images/exercises/vitalrise-bent-over-row.png",
  "./assets/images/exercises/vitalrise-cable-pullover.png",
  "./assets/js/modules/system.js?v=release-20261004-1",
  "./assets/js/modules/i18n.js?v=release-20261004-1",
  "./assets/js/modules/vlog-i18n.js?v=release-20261004-1",
  "./assets/js/modules/legal-i18n.js?v=release-20261004-1",
  "./assets/js/modules/mobile-menu.js?v=release-20261004-1",
  "./assets/js/modules/storage.js?v=release-20261004-1",
  "./assets/js/modules/print.js?v=nutrition-20261007-3",
  "./assets/js/modules/data-portability.js?v=release-20261004-1",
  "./assets/js/modules/calculator-shell.js?v=release-20261004-1",
  "./assets/js/modules/pricing-flip.js?v=release-20261004-1",
  "./assets/js/modules/free-calculator.js?v=release-20261004-1",
  "./assets/js/modules/marketing.js?v=release-20261004-1",
  "./assets/js/modules/module-orbit.js?v=release-20261004-1",
  "./assets/js/modules/hero-parallax.js?v=release-20261004-1",
  "./assets/js/modules/reveal.js?v=release-20261004-1",
  "./assets/js/modules/dashboard.js?v=release-20261004-1",
  "./assets/css/nutrition-workspace.css?v=nutrition-20261007-3",
  "./assets/js/modules/nutrition-catalog.js?v=nutrition-20261007-3",
  "./assets/js/modules/nutrition-quality-data.js?v=nutrition-20261007-3",
  "./assets/js/modules/nutrition-micronutrient-data.js?v=nutrition-20261007-3",
  "./assets/js/modules/nutrition-micronutrients.js?v=nutrition-20261007-3",
  "./assets/js/modules/nutrition-quality.js?v=nutrition-20261007-3",
  "./assets/js/modules/nutrition-swaps.js?v=nutrition-20261007-3",
  "./assets/js/modules/nutrition-workspace.js?v=nutrition-20261007-3",
  "./assets/js/modules/nutrition-custom.js?v=nutrition-20261007-3",
  "./assets/js/modules/nutrition.js?v=nutrition-20261007-3",
  "./assets/js/modules/nutrition-render.js?v=nutrition-20261007-3",
  "./assets/js/modules/training.js?v=release-20261004-1",
  "./assets/js/modules/training-prescription.js?v=release-20261004-1",
  "./assets/js/modules/training-templates.js?v=release-20261004-1",
  "./assets/js/modules/training-gym-dips-patch.js?v=release-20261004-1",
  "./assets/js/modules/training-guidance.js?v=release-20261004-1",
  "./assets/js/modules/training-progression.js?v=release-20261004-1",
  "./assets/js/modules/training-render.js?v=release-20261004-1",
  "./assets/js/modules/training-builder.js?v=release-20261004-1",
  "./assets/js/modules/exercise-atlas-data.js?v=release-20261004-1",
  "./assets/js/modules/exercise-atlas.js?v=release-20261004-1",
  "./assets/js/modules/labs.js?v=release-20261004-1",
  "./assets/js/modules/lab-protocols.js?v=release-20261004-1",
  "./assets/js/modules/progress-decision.js?v=release-20261004-1",
  "./assets/js/modules/blueprint.js?v=release-20261004-1",
  "./assets/js/modules/supplements.js?v=release-20261004-1",
  "./assets/js/modules/coach.js?v=release-20261004-1",
  "./assets/js/modules/access.js?v=release-20261004-1",
  "./assets/js/script.js?v=nutrition-20261007-3",
  "./manifest.webmanifest"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(APP_SHELL);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (key) {
        return key !== CACHE_NAME && key !== RUNTIME_CACHE_NAME;
      }).map(function (key) {
        return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

function shouldRuntimeCache(request) {
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  return /\.(?:css|js|json|png|jpg|jpeg|webp|svg|md)$/i.test(url.pathname);
}

function shouldNetworkFirst(request) {
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (request.mode === "navigate") return true;
  return /\.(?:html|css|js|json|webmanifest)$/i.test(url.pathname);
}

function isSitemapRequest(request) {
  const url = new URL(request.url);
  return url.origin === self.location.origin && url.pathname === "/sitemap.xml";
}

self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  // Never turn an API/network failure into cached homepage HTML.
  if (new URL(event.request.url).pathname.startsWith("/api/")) return;

  // Let crawlers and browsers receive the real static XML file from Pages.
  // Do not put sitemap.xml through cache or the offline index.html fallback.
  if (isSitemapRequest(event.request)) return;

  if (shouldNetworkFirst(event.request)) {
    event.respondWith(
      fetch(event.request).then(function (response) {
        if (!response || response.status !== 200) return response;
        const copy = response.clone();
        caches.open(RUNTIME_CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        });
        return response;
      }).catch(function () {
        return caches.match(event.request).then(function (cached) {
          return cached || caches.match("./index.html");
        });
      })
    );
    return;
  }

  if (shouldRuntimeCache(event.request)) {
    event.respondWith(
      caches.match(event.request).then(function (cached) {
        if (cached) return cached;

        return fetch(event.request).then(function (response) {
          if (!response || response.status !== 200) return response;
          const copy = response.clone();
          caches.open(RUNTIME_CACHE_NAME).then(function (cache) {
            cache.put(event.request, copy);
          });
          return response;
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).catch(function () {
        return caches.match("./index.html");
      });
    })
  );
});
