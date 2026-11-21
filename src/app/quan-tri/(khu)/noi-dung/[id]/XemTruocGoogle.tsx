'use client';

function demLanXuatHien(chuoi: string, tuKhoa: string): number {
  const s = chuoi.normalize('NFC').toLowerCase();
  const k = tuKhoa.normalize('NFC').toLowerCase().trim();
  if (!s || !k) return 0;
  let dem = 0;
  let i = s.indexOf(k);
  while (i !== -1) {
    dem += 1;
    i = s.indexOf(k, i + k.length);
  }
  return dem;
}

function khacHanH1(title: string, h1: string): boolean {
  const t = title.normalize('NFC').toLowerCase().trim();
  const h = h1.normalize('NFC').toLowerCase().trim();
  if (!t || !h) return false;
  if (t.includes(h) || h.includes(t)) return false;
  const tuT = new Set(t.split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 1));
  const tuH = new Set(h.split(/[^\p{L}\p{N}]+/u).filter((w) => w.length > 1));
  if (tuT.size === 0 || tuH.size === 0) return false;
  let chung = 0;
  for (const w of tuT) if (tuH.has(w)) chung += 1;
  return chung / Math.max(tuT.size, tuH.size) < 0.3;
}

function taoBreadcrumb(duongDan: string): string {
  const phan = duongDan.split('/').filter(Boolean);
  if (phan.length === 0) return 'https://xemboi.vn';
  return 'https://xemboi.vn › ' + phan.join(' › ');
}

export default function XemTruocGoogle({
  coTrang,
  duongDan,
  titleGoc,
  titleCat,
  titleBiCat,
  titlePx,
  metaCat,
  metaBiCat,
  h1,
  tuKhoaChinh,
}: {
  coTrang: boolean;
  duongDan: string;
  titleGoc: string;
  titleCat: string;
  titleBiCat: boolean;
  titlePx: number;
  metaCat: string;
  metaBiCat: boolean;
  h1: string;
  tuKhoaChinh: string;
}) {
  if (!coTrang) {
    return (
      <div className="qt-the">
        <h2>Xem trước kết quả Google</h2>
        <p style={{ color: 'var(--muted)', margin: 0 }}>
          Mục này chưa gắn vào một <code>SeoTrang</code> nên chưa có title, meta description và đường dẫn để mô phỏng.
        </p>
        <p className="qt-gg-ghi-chu">Mô phỏng gần đúng, Google có thể hiển thị khác.</p>
      </div>
    );
  }

  const canhBaoVietLai: string[] = [];
  if (titleBiCat || titlePx > 580 || titleGoc.length > 60) {
    canhBaoVietLai.push(`Title dài (~${titlePx} px, ${titleGoc.length} ký tự) có thể bị cắt hoặc Google tự rút gọn.`);
  }
  if (tuKhoaChinh && demLanXuatHien(titleGoc, tuKhoaChinh) >= 2) {
    canhBaoVietLai.push(`Title lặp từ khóa chính “${tuKhoaChinh}” nhiều lần.`);
  }
  if (khacHanH1(titleGoc, h1)) {
    canhBaoVietLai.push('Title và H1 khác hẳn nhau; Google có thể thay title bằng H1.');
  }

  const urlHien = taoBreadcrumb(duongDan);

  return (
    <div className="qt-the">
      <h2>Xem trước kết quả Google</h2>

      {canhBaoVietLai.length > 0 && (
        <div className="qt-bao" style={{ fontSize: 12 }}>
          <b>Cảnh báo khả năng Google viết lại title:</b>
          <ul style={{ margin: '4px 0 0 18px', padding: 0 }}>
            {canhBaoVietLai.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="qt-gg-khung">
        <div className="qt-gg">
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>
            Khung máy tính (title ≤ 580 px, ~{titlePx} px; meta ≤ 158 ký tự)
          </div>
          <div className="qt-gg-url">
            XemBói.vn · {urlHien}
          </div>
          <div className="qt-gg-tieu-de">{titleCat || '(Chưa có title)'}</div>
          <div className="qt-gg-meta">
            {metaCat || '(Chưa có meta description)'}
            {metaBiCat && ' [cắt ở 158 ký tự]'}
          </div>
        </div>

        <div className="qt-gg qt-gg-dt">
          <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>Khung điện thoại</div>
          <div className="qt-gg-url">
            XemBói.vn · {urlHien}
          </div>
          <div className="qt-gg-tieu-de">{titleCat || '(Chưa có title)'}</div>
          <div className="qt-gg-meta">{metaCat || '(Chưa có meta description)'}</div>
        </div>
      </div>

      <p className="qt-gg-ghi-chu">Mô phỏng gần đúng, Google có thể hiển thị khác.</p>
    </div>
  );
}
