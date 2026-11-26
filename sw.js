// =======================================================
// JPV PYSTUDIO - SERVICE WORKER DE ALTO RENDIMIENTO (WASMCORP CACHE)
// =======================================================
const CACHE_WASM_NAME = "pystudio-wasm-v1";
const CACHE_APP_NAME = "pystudio-app-v5";

const WASM_URLS_PATTERNS = [
  "cdn.jsdelivr.net/pyodide",
  "@stlite/mountable",
  "esm.sh",
  ".wasm",
  ".zip"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_WASM_NAME && k !== CACHE_APP_NAME) {
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // 1. Recursos pesados de WebAssembly y CDNs: Estrategia Cache-First
  const esRecursoPesado = WASM_URLS_PATTERNS.some((p) => url.includes(p));

  if (esRecursoPesado && event.request.method === "GET") {
    event.respondWith(
      caches.open(CACHE_WASM_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) {
          return cached;
        }
        try {
          const response = await fetch(event.request);
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        } catch (err) {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  // 2. Archivos de la App: Estrategia Network-First con fallback a Cache
  if (event.request.method === "GET" && (url.startsWith(self.location.origin) || url.includes("jsdelivr.net"))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const respClone = response.clone();
            caches.open(CACHE_APP_NAME).then((cache) => {
              cache.put(event.request, respClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});
