"""Nhúng trang SEO bằng bge-m3 để gợi ý liên kết theo độ gần ngữ nghĩa (docs/v2/17 mục 1.3 bước 4).

  python -I tools/rag-may-tram/nhung_trang_seo.py [--goc http://localhost:3047] [--thu]

Chuỗi nhúng: title + H1 + 500 ký tự đầu của nội dung chính. Nội dung lấy từ trang đang chạy ở `--goc`
(chỉ với trang lần quét gần nhất trả 200); trang chưa có thì dùng meta description. Ghi "SeoTrang".embedding.
Chỉ đọc trang của chính site mình; không theo chuyển hướng.
"""
from __future__ import annotations

import argparse
import html
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

sys.dont_write_bytecode = True
THU_MUC = Path(__file__).resolve().parent
if str(THU_MUC) not in sys.path:
    sys.path.insert(0, str(THU_MUC))

from csdl import ket_noi, vector_sql  # noqa: E402


class _KhongChuyen(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):  # không theo 3xx
        return None


_MO = urllib.request.build_opener(_KhongChuyen)


def noi_dung_chinh(goc: str, duong: str, gioi_han: int = 500) -> str | None:
    url = goc.rstrip("/") + urllib.parse.quote(duong, safe="/-_.~%")
    try:
        with _MO.open(urllib.request.Request(url, headers={"User-Agent": "xemboi-nhung-seo"}), timeout=20) as r:
            if r.status != 200:
                return None
            h = r.read(2_000_000).decode("utf-8", "replace")
    except (urllib.error.URLError, TimeoutError, ValueError):
        return None
    m = re.search(r"<main\b[^>]*>(.*?)</main>", h, re.S | re.I)
    h = m.group(1) if m else h
    h = re.sub(r"<(script|style|noscript|svg|nav|header|footer|form)\b.*?</\1>", " ", h, flags=re.S | re.I)
    h = re.sub(r"<!--.*?-->", " ", h, flags=re.S)
    chu = html.unescape(re.sub(r"<[^>]+>", " ", h))
    chu = re.sub(r"\s+", " ", chu).strip()
    return chu[:gioi_han] or None


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--goc", default="http://localhost:3047")
    ap.add_argument("--thu", action="store_true", help="chỉ in thống kê, không ghi")
    a = ap.parse_args(argv)
    with ket_noi() as cn:
        rows = cn.execute(
            'SELECT id, "duongDan", title, h1, "metaDescription", "maHttpLanQuet" FROM "SeoTrang"'
            " WHERE \"duongDan\" NOT LIKE '%{%' AND \"trangThai\" NOT IN ('AN', 'DA_CHUYEN') ORDER BY \"duongDan\"").fetchall()
        chuoi, nguon = [], {"trang": 0, "meta": 0, "chi_tieu_de": 0}
        for _id, duong, title, h1, meta, ma in rows:
            than = noi_dung_chinh(a.goc, duong) if ma == 200 else None
            if than:
                nguon["trang"] += 1
            elif meta:
                than = meta
                nguon["meta"] += 1
            else:
                nguon["chi_tieu_de"] += 1
            chuoi.append("\n".join(x for x in [title, h1 if h1 and h1 != title else None, than] if x))
        print(f"{len(rows)} trang; nội dung từ trang: {nguon['trang']}, từ meta: {nguon['meta']}, chỉ tiêu đề: {nguon['chi_tieu_de']}")
        if a.thu or not rows:
            return 0
        from nhung import BoNhung
        bn = BoNhung(lo=16, do_dai_toi_da=512)
        v, giay = bn.nhung(chuoi)
        for (pid, *_), x in zip(rows, v):
            cn.execute('UPDATE "SeoTrang" SET embedding = %s::vector WHERE id = %s', (vector_sql(x), pid))
        cn.commit()
        print(f"Đã nhúng {len(rows)} trang bằng {bn.phien_ban} trong {giay:.1f} s")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    sys.exit(main())
