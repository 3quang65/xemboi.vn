"""Nhánh vector cho bộ đánh giá RAG (docs/v2/17 mục 3.4, 12 mục 5.3): tìm CHÍNH XÁC (không qua HNSW) top-k
đoạn cho một loạt câu hỏi, với một mô hình nhúng chọn trước.

  python -I tools/rag-may-tram/tim_vector.py --mo-hinh bge-m3 --vao cau.json --ra kq.json [--k 100]

- vao: JSON [{"khoa": "...", "van_ban": "..."}]; ra: {"moHinh", "phienBan", "giayNhungKho", "ketQua": {khoa: [id, ...]}}.
- bge-m3: vector kho lấy thẳng từ cột rag_doan.embedding (đã nhúng ở bước 5).
- Mô hình khác: nhúng lại toàn kho bằng đúng chuỗi của bước 5 (chay.chuoi_nhung), lưu đệm ở
  may-tram/danh-gia/<mo-hinh>.npz; kho đổi (thêm/sửa đoạn) thì tự nhúng lại.
- Chỉ dùng các đoạn đã có vector bge-m3, để mọi mô hình so trên cùng một tập.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
import time
from pathlib import Path

sys.dont_write_bytecode = True
THU_MUC = Path(__file__).resolve().parent
if str(THU_MUC) not in sys.path:
    sys.path.insert(0, str(THU_MUC))

import numpy as np  # noqa: E402

from csdl import ket_noi  # noqa: E402

DEM = Path(r"D:\VibeCode\Antigravity\may-tram\danh-gia")
MO_HINH = {
    "bge-m3": {"ten": "BAAI/bge-m3", "hoi": ""},
    "qwen3-0.6b": {"ten": "Qwen/Qwen3-Embedding-0.6B",
                   "hoi": "Instruct: Given a Vietnamese question about Chinese divination classics, retrieve the classical passage that answers it\nQuery: "},
    "aiteamvn": {"ten": "AITeamVN/Vietnamese_Embedding", "hoi": ""},
}


def doc_kho(cn, lay_vector: bool):
    cot = ', d.embedding::text' if lay_vector else ''
    rows = cn.execute(
        f'SELECT d.id, n."tenGoc", d."duongDan", d.loai, coalesce(d."vanBanChuan", d."vanBan"), d."bamNoiDung"{cot}'
        ' FROM rag_doan d JOIN rag_nguon n ON n.id = d."nguonId" WHERE d.embedding IS NOT NULL ORDER BY d.id').fetchall()
    return rows


def chuoi(ten_goc: str, duong: list[str], loai: str, vb: str) -> str:
    # Giống hệt chay.chuoi_nhung (không import chay để khỏi kéo cả pipeline).
    d = " · ".join([ten_goc] + list(duong or []))
    return f"{d}\n{'〔注〕' if loai == 'chu' else ''}{vb}"


def vector_kho(cn, ma: str, bn_tao):
    """Trả (ids int64[N], ma trận float32[N, D] đã chuẩn hóa, số giây nhúng kho hoặc 0 nếu lấy đệm)."""
    DEM.mkdir(parents=True, exist_ok=True)
    if ma == "bge-m3":
        rows = doc_kho(cn, True)
        ids = np.array([r[0] for r in rows], dtype=np.int64)
        m = np.stack([np.fromstring(r[6][1:-1], sep=",", dtype=np.float32) for r in rows])
        m /= np.linalg.norm(m, axis=1, keepdims=True).clip(min=1e-12)
        return ids, m, 0.0
    rows = doc_kho(cn, False)
    ids = np.array([r[0] for r in rows], dtype=np.int64)
    dau = hashlib.sha256("".join(f"{r[0]}:{r[5]}:{r[3]}|" for r in rows).encode()).hexdigest()[:16]
    tep = DEM / f"{ma}.npz"
    if tep.is_file():
        z = np.load(tep)
        if str(z["dau"]) == dau:
            return z["ids"], z["m"], 0.0
    bn = bn_tao()
    # Sắp theo độ dài để lô đều, đỡ tốn bộ nhớ đệm.
    van_ban = [chuoi(r[1], r[2], r[3], r[4]) for r in rows]
    thu_tu = np.argsort([len(x) for x in van_ban])
    phan = []
    t0 = time.perf_counter()
    for i in range(0, len(thu_tu), 2048):
        lo = [van_ban[j] for j in thu_tu[i:i + 2048]]
        v, _ = bn.nhung(lo)
        phan.append(v)
        print(f"  nhúng kho {min(i + 2048, len(thu_tu))}/{len(thu_tu)}", file=sys.stderr, flush=True)
    giay = time.perf_counter() - t0
    v = np.concatenate(phan)
    m = np.zeros_like(v)
    m[thu_tu] = v
    np.savez(tep, ids=ids, m=m, dau=np.array(dau))
    return ids, m, giay


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--mo-hinh", required=True, choices=sorted(MO_HINH))
    ap.add_argument("--vao", required=True)
    ap.add_argument("--ra", required=True)
    ap.add_argument("--k", type=int, default=100)
    a = ap.parse_args(argv)
    cau = json.loads(Path(a.vao).read_text(encoding="utf-8"))
    cfg = MO_HINH[a.mo_hinh]

    from nhung import BoNhung
    _bn = {}

    def bn_tao():
        if "x" not in _bn:
            _bn["x"] = BoNhung(cfg["ten"], lo=16)
        return _bn["x"]

    with ket_noi() as cn:
        ids, m, giay_kho = vector_kho(cn, a.mo_hinh, bn_tao)
    bn = bn_tao()
    q, giay_cau = bn.nhung([cfg["hoi"] + c["van_ban"] for c in cau])
    diem = q @ m.T  # cosine (đã chuẩn hóa)
    k = min(a.k, diem.shape[1])
    ket_qua = {}
    for i, c in enumerate(cau):
        top = np.argpartition(-diem[i], k - 1)[:k]
        top = top[np.argsort(-diem[i][top])]
        ket_qua[c["khoa"]] = [int(ids[j]) for j in top]
    Path(a.ra).write_text(json.dumps({
        "moHinh": a.mo_hinh, "phienBan": bn.phien_ban, "soDoanKho": int(len(ids)),
        "giayNhungKho": round(giay_kho, 1), "msMoiCau": round(giay_cau * 1000 / max(len(cau), 1), 1),
        "gpu": bn.ten_gpu, "ketQua": ket_qua}, ensure_ascii=False), encoding="utf-8")
    print(f"{a.mo_hinh}: {len(cau)} câu, kho {len(ids)} đoạn, nhúng kho {giay_kho:.0f} s", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    sys.exit(main())
