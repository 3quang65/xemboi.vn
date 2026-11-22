// Service worker v1 của XemBoi.vn đã bỏ (v2 không chạy ngoại tuyến).
// Bản này chỉ để máy đã cài bản cũ tự dọn bộ nhớ đệm và gỡ đăng ký, sau đó tải trang mới từ máy chủ.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) await caches.delete(k);
    await self.registration.unregister();
    for (const c of await self.clients.matchAll({ type: 'window' })) c.navigate(c.url);
  })());
});
