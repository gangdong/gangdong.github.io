---
layout: null
permalink: /sw.js
---
const CACHE = "blog-cache-v1";
const PRECACHE_URLS = [
  "{{ '/assets/css/style.css' | relative_url }}",
  "{{ site.cdn_baseurl }}/assets/js/darkmode.js",
  "{{ site.cdn_baseurl }}/assets/my_new_avatar.jpg",
  "https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js",
  "https://fonts.font.im/css?family=Poppins:400,900|Raleway|Roboto:400,900|Roboto+Mono&display=swap"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.startsWith("/assets/") || url.hostname.includes("cdn.")) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(request, clone));
        return res;
      }))
    );
  } else {
    event.respondWith(
      fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(request, clone));
        return res;
      }).catch(() => caches.match(request))
    );
  }
});
