
// < Best practise for a Service Worker file is to add a version number to indicate updates to the file
// < This is also one of the only ways to trigger any updates for your users
const VERSION = "v1";

// < We also add our cache name, which is the name of our app + the version
const CACHE_NAME = `reminder-time-${VERSION}`;


// < Now we add static resources, mainly to provide information while the app may be offline (disconnected from the web)
// < Here you'd add any images used within the app, so it can load then without downloaded them from the web live
const APP_STATIC_RESOURCES = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/heart.svg",
  ]

 
// < We cache our static resources for installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
});

// < MDN WebDocs suggests you delete your old cache to help the installation along
// < Delete old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      // < As we're calling an async function, we need to give the system a promise that we will provide the data it's looking for 
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
      await clients.claim();
    })()
  );
});

// < When we want to access the app offline or avoid the network,
// we add an event listener that catches the fetch request from the user
self.addEventListener("fetch", (event) => {
  // < As a single-page app, direct the app to always go to the cached home page instead of fetching a new one
  if (event.request.mode === "navigate") {
    event.respondWith(caches.match("/"));
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        // < Update the cache with the latest response from the network
        cache.put(event.request, networkResponse.clone());
        // < Return the network response
        return networkResponse;
      } catch (error) {
        // < If the network request fails, try to serve from the cache
        const cacheResponse = await caches.match(event.request);
        return cacheResponse || new Response(null, { status: 404 });
      }
    })()
  );
});
