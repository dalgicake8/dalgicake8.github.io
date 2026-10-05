/* The production build replaces these two values with a content hash and the
   complete exported asset list. Development never registers this worker. */
const CACHE_NAME = "rootly-7c023bd6f02de517c241";
const PRECACHE_URLS = ["/404.html","/404/index.html","/__next.__PAGE__.txt","/__next._full.txt","/__next._tree.txt","/_next/static/chunks/02fh7_m5mrih8.js","/_next/static/chunks/05tl6ud6m1x02.js","/_next/static/chunks/0cz1d0mv5g_q7.js","/_next/static/chunks/2m912stn0vfa6.js","/_next/static/chunks/32pl08vyvrxep.css","/_next/static/chunks/3fntmmi971322.js","/_next/static/chunks/3l04zcqx63h3y.js","/_next/static/chunks/3z33jdkdlhrt5.js","/_next/static/chunks/turbopack-3sj55jfiigmn5.js","/_next/static/mRMxbu13xpVxLM7C316Q4/_buildManifest.js","/_next/static/mRMxbu13xpVxLM7C316Q4/_clientMiddlewareManifest.js","/_next/static/mRMxbu13xpVxLM7C316Q4/_ssgManifest.js","/_next/static/media/53b9e256198e5412-s.390ncx5urfkfu.woff2","/_next/static/media/7178b3e590c64307-s.21jp631_3pja2.woff2","/_next/static/media/8a480f0b521d4e75-s.1qq4vpdcun5oj.woff2","/_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2","/_next/static/media/favicon.2vob68tjqpejf.ico","/_next/static/media/fef07dbb0973bf53-s.3p2_lha1f2xer.woff2","/_not-found/__next._full.txt","/_not-found/__next._not-found.__PAGE__.txt","/_not-found/__next._tree.txt","/_not-found/index.html","/_not-found/index.txt","/app-icon-192.png","/app-icon-512.png","/app-icon.svg","/favicon.ico","/file.svg","/globe.svg","/index.html","/index.txt","/manifest.webmanifest","/next.svg","/vercel.svg","/window.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
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
