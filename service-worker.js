const CACHE_NAME = "vitalrise-v287";
const RUNTIME_CACHE_NAME = "vitalrise-runtime-v234";
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
  "./assets/css/style.css?v=legal-contact-1",
  "./assets/images/labs-bloodwork-bg.webp",
  "./assets/images/nutrition-food-bg.webp",
  "./assets/images/vlog-dna-bg-photo.png",
  "./assets/images/exercises/vitalrise-seated-dumbbell-press.png",
  "./assets/images/exercises/vitalrise-bent-over-row.png",
  "./assets/images/exercises/vitalrise-cable-pullover.png",
  "./assets/js/modules/system.js",
  "./assets/js/modules/i18n.js?v=modules-i18n-9",
  "./assets/js/modules/vlog-i18n.js?v=vlog-translation-10",
  "./assets/js/modules/legal-i18n.js?v=legal-i18n-6",
  "./assets/js/modules/mobile-menu.js",
  "./assets/js/modules/storage.js",
  "./assets/js/modules/print.js?v=print-clean-1",
  "./assets/js/modules/data-portability.js",
  "./assets/js/modules/calculator-shell.js?v=single-module-1",
  "./assets/js/modules/pricing-flip.js?v=mobile-flip-1",
  "./assets/js/modules/module-orbit.js?v=mobile-orbit-glow-1",
  "./assets/js/modules/hero-parallax.js?v=hero-parallax-5",
  "./assets/js/modules/reveal.js",
  "./assets/js/modules/dashboard.js",
  "./assets/js/modules/nutrition-custom.js",
  "./assets/js/modules/nutrition.js?v=exact-bju-3",
  "./assets/js/modules/nutrition-render.js?v=nutrition-i18n-1",
  "./assets/js/modules/training.js",
  "./assets/js/modules/training-templates.js?v=female-outdoor-glutes-1",
  "./assets/js/modules/training-guidance.js?v=training-control-1",
  "./assets/js/modules/training-progression.js",
  "./assets/js/modules/training-render.js?v=training-copy-fix-1",
  "./assets/js/modules/training-builder.js?v=female-outdoor-glutes-1",
  "./assets/js/modules/exercise-atlas-data.js?v=bulgarian-split-squat-1",
  "./assets/js/modules/exercise-atlas.js?v=atlas-clean-1",
  "./assets/js/modules/labs.js",
  "./assets/js/modules/lab-protocols.js?v=expanded-report-1",
  "./assets/js/modules/progress-decision.js?v=cycle-water-progress-1",
  "./assets/js/modules/blueprint.js",
  "./assets/js/modules/supplements.js?v=testosterone-ergogenic-2",
  "./assets/js/modules/coach.js?v=quick-profiles-2",
  "./assets/js/modules/access.js?v=payment-return-fix-2",
  "./assets/js/script.js?v=age-screening-1",
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

self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

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
