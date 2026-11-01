/* The production build replaces these two values with a content hash and the
   complete exported asset list. Development never registers this worker. */
const CACHE_NAME = "rootly-97e7d7399107f2b9e899";
const PRECACHE_URLS = ["/404.html","/404/index.html","/__next.__PAGE__.txt","/__next._full.txt","/__next._tree.txt","/_next/static/chunks/185f5ec5-885b2d357bb4c2c8.js","/_next/static/chunks/370-4c9030cabe1bad7b.js","/_next/static/chunks/583.cd8f6a97531b20ba.js","/_next/static/chunks/96bf5641.113c22731d8710f9.js","/_next/static/chunks/app/_global-error/page-fe70334c65b89022.js","/_next/static/chunks/app/_not-found/page-6ec2b8ce6ab4bad6.js","/_next/static/chunks/app/layout-191517fc2e170d29.js","/_next/static/chunks/app/manifest.webmanifest/route-fe70334c65b89022.js","/_next/static/chunks/app/page-37b3f748f258f201.js","/_next/static/chunks/framework-76a1aa6f82a8de51.js","/_next/static/chunks/main-533e232f9d0a8eec.js","/_next/static/chunks/main-app-8ed6ad9a6eaf2f37.js","/_next/static/chunks/next/dist/client/components/builtin/app-error-fe70334c65b89022.js","/_next/static/chunks/next/dist/client/components/builtin/forbidden-fe70334c65b89022.js","/_next/static/chunks/next/dist/client/components/builtin/global-error-760d599770221f1e.js","/_next/static/chunks/next/dist/client/components/builtin/not-found-fe70334c65b89022.js","/_next/static/chunks/next/dist/client/components/builtin/unauthorized-fe70334c65b89022.js","/_next/static/chunks/polyfills-42372ed130431b0a.js","/_next/static/chunks/webpack-809a9bc7d4749b28.js","/_next/static/css/952e94410b60bf79.css","/_next/static/css/f228a292f3e7678f.css","/_next/static/eeeoc_KIb-PoWja3BpYTl/_buildManifest.js","/_next/static/eeeoc_KIb-PoWja3BpYTl/_ssgManifest.js","/_next/static/media/22a5144ee8d83bca-s.p.woff2","/_next/static/media/9766a7e9e2e0ad5a-s.woff2","/_next/static/media/aa016aab0e6d1295-s.woff2","/_next/static/media/b66cf8e69499582a-s.woff2","/_next/static/media/f639721981034f88-s.woff2","/_not-found/__next._full.txt","/_not-found/__next._not-found.__PAGE__.txt","/_not-found/__next._tree.txt","/_not-found/index.html","/_not-found/index.txt","/app-icon-192.png","/app-icon-512.png","/app-icon.svg","/content-licenses/ATTRIBUTION.txt","/content-licenses/OEWN-LICENSE.txt","/content-licenses/WordNet-LICENSE.txt","/favicon.ico","/file.svg","/globe.svg","/index.html","/index.txt","/manifest.webmanifest","/next.svg","/vercel.svg","/window.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const results = await Promise.allSettled(PRECACHE_URLS.map(async (url) => {
      try {
        const response = await fetch(url, { cache: "reload" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        // Finish the network stream before Chrome's cache writer consumes large
        // vocabulary chunks. Keep decoded bodies consistent with their headers.
        const body = await response.arrayBuffer();
        const headers = new Headers(response.headers);
        headers.delete("content-encoding");
        headers.delete("content-length");
        await cache.put(url, new Response(body, { status: response.status, statusText: response.statusText, headers }));
      }
      catch (error) { throw new Error(`${url}: ${String(error)}`); }
      }));
      const failure = results.find(result => result.status === "rejected");
      if (failure) throw failure.reason;
    }).catch(async (error) => {
      await caches.delete(CACHE_NAME);
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      for (const client of clients) client.postMessage({ type: "rootly:offline-error", detail: String(error) });
      throw error;
    }),
  );
  // Let an active study session finish on its own version before updating.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(async (names) => {
      await Promise.all(
        names
          .filter((name) => name.startsWith("rootly-") && name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    }),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const pathname = decodeURI(url.pathname);
      const cachePath = pathname.endsWith("/")
        ? `${pathname}index.html`
        : pathname;
      const cached = await cache.match(cachePath);
      if (cached) return cached;
      try {
        return await fetch(event.request);
      } catch {
        if (event.request.mode === "navigate") {
          return (
            (await cache.match("/index.html")) ??
            new Response(
              "The app is not ready for offline use yet. Connect once, then reopen it.",
              {
                status: 503,
                headers: { "Content-Type": "text/plain; charset=utf-8" },
              },
            )
          );
        }
        return new Response("Offline", { status: 503 });
      }
    })(),
  );
});
