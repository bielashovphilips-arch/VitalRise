const CACHE_NAME = "vitalrise-v145";
const RUNTIME_CACHE_NAME = "vitalrise-runtime-v145";
const APP_SHELL = [
  "./",
  "./index.html",
  "./vlog.html",
  "./assets/css/style.css?v=training-control-1",
  "./assets/js/modules/system.js",
  "./assets/js/modules/i18n.js?v=training-control-1",
  "./assets/js/modules/mobile-menu.js",
  "./assets/js/modules/reveal.js",
  "./assets/js/modules/access.js?v=roadmap-1",
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
