
const CACHE_NAME = 'dataviz-cache-v5';

// 预缓存列表
// 注意：在 Vite 构建中，JS 文件会有哈希值（如 index-x8s.js）。
// 这里的静态列表无法预测这些哈希文件名。
// 但是，下面的 'fetch' 事件中的动态缓存策略会处理这些新文件。
// 我们至少保证核心 HTML 和 图标 被缓存。
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/192.png',
  './icons/512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // 忽略非 HTTP/HTTPS 请求
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // 优先网络，失败后回退到缓存 (Network First, fall back to Cache)
  // 这种策略适合数据频繁变动的应用
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 如果网络请求成功，克隆响应并更新缓存
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
           // 只缓存 GET 请求
           if (event.request.method === 'GET') {
             cache.put(event.request, responseToCache);
           }
        });
        
        return response;
      })
      .catch(() => {
        // 网络失败，尝试从缓存读取
        return caches.match(event.request);
      })
  );
});