"""Truy vấn thử: nhúng câu hỏi bằng bge-m3, lấy top-k đoạn theo cosine (pgvector <=>).

  python -I tools/rag-may-tram/truy_van.py "Tử Vi tại Ngọ" "Thiên Phủ" "Hóa Kỵ"
  python -I tools/rag-may-tram/truy_van.py --k 5 --mo-rong "Tử Vi tại Ngọ"

--mo-rong: thêm thuật ngữ chữ Hán vào câu hỏi (12 mục 5.2 ý 7). Lấy từ bảng thuat_ngu; bảng còn
trống thì dùng bảng nhỏ dựng sẵn bên dưới (chỉ để thử).
--cong-khai: chỉ tìm trong view rag_doan_cong_khai (đường của trang công khai).
"""
from __future__ import annotations

import argparse
import re
import sys
import unicodedata
from pathlib import Path

sys.dont_write_bytecode = True  # không để __pycache__ trong repo
THU_MUC = Path(__file__).resolve().parent
if str(THU_MUC) not in sys.path:
    sys.path.insert(0, str(THU_MUC))

from csdl import ket_noi, vector_sql  # noqa: E402

THUAT_NGU_TAM = {
    "tử vi": "紫微", "thiên cơ": "天機", "thái dương": "太陽", "vũ khúc": "武曲", "thiên đồng": "天同",
    "liêm trinh": "廉貞", "thiên phủ": "天府", "thái âm": "太陰", "tham lang": "貪狼", "cự môn": "巨門",
    "thiên tướng": "天相", "thiên lương": "天梁", "thất sát": "七殺", "phá quân": "破軍", "văn xương": "文昌",
    "văn khúc": "文曲", "tả phù": "左輔", "hữu bật": "右弼", "lộc tồn": "祿存", "kình dương": "擎羊",
    "đà la": "陀羅", "hỏa tinh": "火星", "linh tinh": "鈴星", "hóa lộc": "化祿", "hóa quyền": "化權",
    "hóa khoa": "化科", "hóa kỵ": "化忌", "mệnh": "命宮",
    "tý": "子", "sửu": "丑", "dần": "寅", "mão": "卯", "thìn": "辰", "tỵ": "巳", "ngọ": "午", "mùi": "未",
    "thân": "申", "dậu": "酉", "tuất": "戌", "hợi": "亥",
}


def _bo_dau(s: str) -> str:
    s = unicodedata.normalize("NFD", s.lower())
    return unicodedata.normalize("NFC", "".join(c for c in s if unicodedata.category(c) != "Mn")).replace("đ", "d")


def mo_rong(cn, cau: str) -> str:
    bang = {}
    try:
        for han, hv in cn.execute('SELECT han, "hanViet" FROM thuat_ngu').fetchall():
            bang[hv.lower()] = han
    except Exception:
        cn.rollback()
    if not bang:
        bang = THUAT_NGU_TAM
    thap = cau.lower()
    them = []
    for hv in sorted(bang, key=len, reverse=True):
        if re.search(r"(?<!\w)" + re.escape(hv) + r"(?!\w)", thap):
            them.append(bang[hv])
            thap = thap.replace(hv, " ")
    return cau + (" " + "".join(them) if them else "")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("cau", nargs="+", help="Câu hỏi")
    ap.add_argument("--k", type=int, default=5)
    ap.add_argument("--mo-rong", action="store_true")
    ap.add_argument("--cong-khai", action="store_true")
    ap.add_argument("--dai", type=int, default=90, help="Số ký tự đoạn trích in ra")
    a = ap.parse_args(argv)

    from nhung import BoNhung
    bn = BoNhung()
    bang = "rag_doan_cong_khai" if a.cong_khai else "rag_doan"
    with ket_noi() as cn:
        # Tìm chính xác trên HNSW: ef_search lớn hơn k nhiều.
        cn.execute("SET hnsw.ef_search = 100")
        for cau in a.cau:
            q = mo_rong(cn, cau) if a.mo_rong else cau
            v, giay = bn.nhung([q])
            rows = cn.execute(
                f'SELECT d.id, n.ma, n."tenGoc", d."duongDan", d.loai, d."vanBan", 1 - (d.embedding <=> %s::vector) AS sim'
                f' FROM {bang} d JOIN rag_nguon n ON n.id = d."nguonId" WHERE d.embedding IS NOT NULL'
                f' ORDER BY d.embedding <=> %s::vector LIMIT %s',
                (vector_sql(v[0]), vector_sql(v[0]), a.k)).fetchall()
            print(f"\n=== {cau}" + (f"  →  {q}" if q != cau else "") + f"  (nhúng {giay * 1000:.0f} ms)")
            for i, (did, ma, ten, duong, loai, vb, sim) in enumerate(rows, 1):
                trich_doan = re.sub(r"\s+", " ", vb)[: a.dai]
                print(f" {i}. [{sim:.3f}] {ma} {ten} · {' · '.join(duong)} ({loai}, #{did})")
                print(f"    {trich_doan}")
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    sys.exit(main())
