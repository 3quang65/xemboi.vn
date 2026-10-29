// Service worker của XemBoi.vn: chạy được khi mất mạng (lịch, xem ngày, lá số).
// Đổi số phiên bản mỗi khi sửa giao diện để người dùng nhận bản mới.
const PHIEN_BAN = 'xemboi-v34';
const TINH = [
  '/', '/index.html', '/lich.js', '/tuvi.js', '/thayba.js', '/thuvien.js', '/trondoi.js', '/homnay.js', '/manifest.webmanifest',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png', '/icons/favicon-32.png'
];
const FONT = 'xemboi-font';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(PHIEN_BAN).then((c) => c.addAll(TINH)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== PHIEN_BAN && k !== FONT).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Máy chủ (luận giải, thanh toán) và ảnh QR: luôn lấy mới, không lưu
  if (url.origin === location.origin && url.pathname.startsWith('/api/')) return;
  if (url.hostname === 'img.vietqr.io' || url.hostname.endsWith('vietqr.io')) return;

  // Phông chữ Google: lưu lâu dài
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONT).then(async (c) => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') c.put(req, res.clone());
      return res;
    }));
    return;
  }

  if (url.origin !== location.origin) return;

  // Trang và mã chạy (html, js): luôn ưu tiên bản mới trên mạng, mất mạng mới dùng bản đã lưu.
  // Nhờ vậy trang mới không bao giờ chạy với tệp js cũ.
  if (req.mode === 'navigate' || /\.(js|html|webmanifest)$/.test(url.pathname)) {
    e.respondWith(fetch(req).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        // chỉ lưu trang chính làm bản dự phòng khi mất mạng (không lưu đè bằng trang khác)
        const khoa = req.mode === 'navigate' ? (url.pathname === '/' || url.pathname === '/index.html' ? '/' : null) : url.pathname;
        if (khoa) caches.open(PHIEN_BAN).then((c) => c.put(khoa, copy));
      }
      return res;
    }).catch(() => caches.match(req.mode === 'navigate' && (url.pathname === '/' || url.pathname === '/index.html') ? '/' : req, { ignoreSearch: true })
      .then((hit) => hit || caches.match('/'))));
    return;
  }

  // Ảnh, biểu tượng: trả bản đã lưu ngay, đồng thời cập nhật ngầm
  e.respondWith(caches.open(PHIEN_BAN).then(async (c) => {
    const hit = await c.match(req);
    const net = fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
