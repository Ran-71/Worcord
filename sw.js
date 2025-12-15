
const CACHE_NAME = 'dataviz-cache-v1';

// 核心文件列表 - 安装时立即缓存
// 注意：如果您的图片或其他静态资源路径不同，请在此添加
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.ts',
  '/components/Header.tsx',
  '/components/MetricSelector.tsx',
  '/components/BottomSelector.tsx',
  '/components/DataDashboard.tsx'
];

// 安装事件：缓存核心文件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting()) // 强制立即激活
  );
});

// 激活事件：清理旧缓存
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
    }).then(() => self.clients.claim()) // 立即接管页面
  );
});

// Fetch 事件：网络请求拦截策略 (Cache First, falling back to Network)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 1. 如果缓存中有，直接返回缓存
        if (response) {
          return response;
        }

        // 2. 如果缓存没有，发起网络请求
        return fetch(event.request).then(
          (response) => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // 3. 将新请求到的资源（如 esm.sh 的依赖、CDN 图片等）放入缓存
            // 克隆响应，因为响应流只能使用一次
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // 仅缓存 GET 请求
                if (event.request.method === 'GET') {
                    cache.put(event.request, responseToCache);
                }
              });

            return response;
          }
        );
      })
  );
});
