const CACHE_NAME = "kucharky";

const cacheList = [
  // "/kucharky/",
  "/",
  "/new",
  "/edit",
  "/recipe",
  "/sw.js",
  "/manifest.json",
  "/css/main.css",
  "/js/main.js",
  "/icon/pen.svg",
  "/icon/plus.svg",
  "/icon/plus.png",
  "/icon/settings.svg",
  "/icon/heart.svg",
  "/icon/heart-empty.svg",
  "/icon/trash.svg",
  "/icon/search.svg",
  "/image/cookbook.min.svg",
  "/image/cookbook.svg",
  "/image/icons-192.png",
  "/image/icons-512.png",
  "/image/icons-vector.svg",
];

/**
 * Listen for the install event, which fires when the service worker is installing.
 * We use event.waitUntil() to ensure the install doesn't finished until our promise resolves
 * so we don't do anything else until the initial caching is done.
 */
self.addEventListener("install", async (event) => {
  console.log("installing!");
  self.skipWaiting();
  event.waitUntil(cache_assets());
});

async function cache_assets() {
  const cache = await self.caches.open(CACHE_NAME);
  return cache.addAll(cacheList);
}

/**
 * Listen for the activate event, which is fired after installation
 * Activate is when the service worker actually takes over from the previous
 * version, which is a good time to clean up old caches.
 * Again we use waitUntil() to ensure we don't move on until the old caches are deleted.
 */
self.addEventListener("activate", async (event) => {
  console.log("activating!");
  event.waitUntil(delete_old_caches());
});

async function delete_old_caches() {
  // Get the keys of all the old caches
  const keys = await caches.keys();
  const deletePromises = keys
    .filter((key) => key !== CACHE_NAME)
    .map((key) => self.caches.delete(key));
  return Promise.all(deletePromises);
}


self.addEventListener("fetch", function (e) {
  // console.log('Fetch event:', e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response != null) {
        console.log("Using cache for:", e.request.url);
        return response;
      }
      console.warn("Fallback to fetch:", e.request.url);
      return fetch(e.request.url);
    })
  );
});
