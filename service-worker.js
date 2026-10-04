const CACHE_NAME = "vitalrise-nutrition-20261004-2";
const RUNTIME_CACHE_NAME = "vitalrise-runtime-nutrition-20261004-2";
const APP_SHELL = [
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
  "./assets/css/style.css?v=mobile-calculator-title-3",
  "./assets/images/labs-bloodwork-bg.webp",
  "./assets/images/nutrition-food-bg.webp",
  "./assets/images/vlog-dna-bg-photo.png",
  "./assets/images/logo-icon.svg?v=logo-v2",
  "./assets/images/exercises/vitalrise-seated-dumbbell-press.png",
  "./assets/images/exercises/vitalrise-bent-over-row.png",
  "./assets/images/exercises/vitalrise-cable-pullover.png",
  "./assets/js/modules/system.js",
  "./assets/js/modules/i18n.js?v=nutrition-workspace-20261004-2",
  "./assets/js/modules/vlog-i18n.js?v=vlog-translation-13",
  "./assets/js/modules/legal-i18n.js?v=legal-i18n-7",
  "./assets/js/modules/mobile-menu.js",
  "./assets/js/modules/storage.js",
  "./assets/js/modules/print.js?v=nutrition-workspace-20261004-2",
  "./assets/js/modules/data-portability.js",
  "./assets/js/modules/calculator-shell.js?v=single-module-2",
  "./assets/js/modules/pricing-flip.js?v=mobile-flip-1",
  "./assets/js/modules/free-calculator.js?v=free-engagement-1",
  "./assets/js/modules/marketing.js?v=meta-pixel-2",
  "./assets/js/modules/module-orbit.js?v=mobile-orbit-glow-1",
  "./assets/js/modules/hero-parallax.js?v=hero-parallax-5",
  "./assets/js/modules/reveal.js",
  "./assets/js/modules/dashboard.js",
  "./assets/css/nutrition-workspace.css?v=20261004-2",
  "./assets/js/modules/nutrition-catalog.js?v=20261004-1",
  "./assets/js/modules/nutrition-workspace.js?v=20261004-2",
  "./assets/js/modules/nutrition-custom.js?v=nutrition-workspace-20261004-2",
  "./assets/js/modules/nutrition.js?v=nutrition-workspace-20261004-2",
  "./assets/js/modules/nutrition-render.js?v=nutrition-workspace-20261004-2",
  "./assets/js/modules/training.js",
  "./assets/js/modules/training-prescription.js?v=load-policy-1",
  "./assets/js/modules/training-templates.js?v=beginner-circuit-1",
  "./assets/js/modules/training-gym-dips-patch.js?v=gym-dips-1",
  "./assets/js/modules/training-guidance.js?v=training-control-1",
  "./assets/js/modules/training-progression.js",
  "./assets/js/modules/training-adaptation.js?v=beginner-period-1",
  "./assets/js/modules/training-render.js?v=training-copy-fix-1",
  "./assets/js/modules/training-builder.js?v=beginner-period-1",
  "./assets/js/modules/training-session.js?v=training-session-3",
  "./assets/js/modules/training-progress.js?v=training-progress-1",
  "./assets/js/modules/exercise-atlas-data.js?v=bulgarian-split-squat-1",
  "./assets/js/modules/exercise-atlas.js?v=atlas-clean-1",
  "./assets/js/modules/labs.js",
  "./assets/js/modules/lab-protocols.js?v=expanded-report-1",
  "./assets/js/modules/progress-decision.js?v=cycle-water-progress-1",
  "./assets/js/modules/blueprint.js",
  "./assets/js/modules/supplements.js?v=testosterone-ergogenic-2",
  "./assets/js/modules/coach.js?v=coach-contact-1",
  "./assets/js/modules/access.js?v=paid-gate-1",
  "./assets/js/script.js?v=nutrition-workspace-20261004-2",
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
