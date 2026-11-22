// Chỉ số cho bộ đánh giá RAG (docs/v2/17 mục 3.4). Hàm thuần.

export type ChiSoCau = {
  /** Hạng (1-based) của đoạn đúng đầu tiên trong danh sách trả về; null nếu không có. */
  hang: number | null;
  /** Tỷ lệ đoạn đúng lọt vào top 10, chia cho min(số đoạn đúng, 10). */
  recall10: number;
  trung10: boolean;
  dungNguonTop1: boolean;
};

export function chiSoCau(ketQua: bigint[], dung: bigint[], nguonTop1: string | null, nguonDung: string[]): ChiSoCau {
  const tapDung = new Set(dung.map(String));
  const i = ketQua.findIndex((x) => tapDung.has(String(x)));
  const trong10 = ketQua.slice(0, 10).filter((x) => tapDung.has(String(x))).length;
  return {
    hang: i < 0 ? null : i + 1,
    recall10: dung.length ? trong10 / Math.min(dung.length, 10) : 0,
    trung10: trong10 > 0,
    dungNguonTop1: nguonTop1 != null && nguonDung.includes(nguonTop1),
  };
}

export type TongHop = { soCau: number; recallAt10: number; hitAt10: number; mrr: number; tyLeDungNguon: number };

export function tongHop(ds: ChiSoCau[]): TongHop {
  const n = ds.length || 1;
  const tb = (f: (x: ChiSoCau) => number) => Math.round((ds.reduce((s, x) => s + f(x), 0) / n) * 10_000) / 10_000;
  return {
    soCau: ds.length,
    recallAt10: tb((x) => x.recall10),
    hitAt10: tb((x) => (x.trung10 ? 1 : 0)),
    mrr: tb((x) => (x.hang ? 1 / x.hang : 0)),
    tyLeDungNguon: tb((x) => (x.dungNguonTop1 ? 1 : 0)),
  };
}

/** Đọc CSV RFC 4180 (có ngoặc kép, xuống dòng trong ô). */
export function docCsv(s: string): Record<string, string>[] {
  const dong: string[][] = [];
  let o = '', hang: string[] = [], ngoac = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (ngoac) {
      if (c === '"' && s[i + 1] === '"') { o += '"'; i++; }
      else if (c === '"') ngoac = false;
      else o += c;
    } else if (c === '"') ngoac = true;
    else if (c === ',') { hang.push(o); o = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      hang.push(o); o = '';
      if (hang.some((x) => x !== '')) dong.push(hang);
      hang = [];
    } else o += c;
  }
  hang.push(o);
  if (hang.some((x) => x !== '')) dong.push(hang);
  const [dau, ...than] = dong;
  const tieuDe = (dau ?? []).map((x) => x.replace(/^﻿/, '').trim());
  return than.map((h) => Object.fromEntries(tieuDe.map((t, i) => [t, (h[i] ?? '').trim()])));
}
