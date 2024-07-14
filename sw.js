const CACHE_NAME = "kucharky";

const cacheList = [
  // "/kucharky/",
  "/kucharky/",
  "/kucharky/new",
  "/kucharky/edit",
  "/kucharky/recipe",
  "/kucharky/sw.js",
  "/kucharky/manifest.json",
  "/kucharky/css/main.css",
  "/kucharky/js/main.js",
  "/kucharky/icon/pen.svg",
  "/kucharky/icon/plus.svg",
  "/kucharky/icon/plus.png",
  "/kucharky/icon/settings.svg",
  "/kucharky/icon/heart.svg",
  "/kucharky/icon/heart-empty.svg",
  "/kucharky/icon/trash.svg",
  "/kucharky/icon/search.svg",
  "/kucharky/image/cookbook.min.svg",
  "/kucharky/image/cookbook.svg",
  "/kucharky/image/icons-192.png",
  "/kucharky/image/icons-512.png",
  "/kucharky/image/icons-vector.svg",
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
