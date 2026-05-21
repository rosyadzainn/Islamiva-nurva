const CACHE_NAME = "islametra-v1";
const STATIC_CACHE = "islametra-static-v1";

const PRECACHE_PAGES = ["/", "/quran", "/doa", "/hadith", "/kisah-nabi", "/sejarah", "/jadwal-sholat", "/tasbih", "/zakat"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_PAGES).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/admin")) return;
  if (!url.origin.includes("islametra.com") && !url.origin.includes("localhost")) return;

  // Static assets — cache first
  if (url.pathname.startsWith("/_next/static/") || url.pathname.match(/\.(woff2?|png|jpg|jpeg|svg|ico)$/)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((res) => {
            cache.put(request, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Navigation — stale-while-revalidate
  if (request.mode === "navigate") {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const network = fetch(request)
            .then((res) => {
              cache.put(request, res.clone());
              return res;
            })
            .catch(() => null);
          return cached || network;
        })
      )
    );
  }
});
