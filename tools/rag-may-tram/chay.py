"""Pipeline RAG trên máy trạm (Đợt 1: văn bản sạch Kanripo + Wikisource).

  python -I tools/rag-may-tram/chay.py nap-danh-muc [--xem-truoc]
  python -I tools/rag-may-tram/chay.py xu-ly --nguon WS01 KR3g0041 ...   (hoặc --dot1)
  python -I tools/rag-may-tram/chay.py xu-ly --nguon WS01 --tu-buoc 4    (làm lại từ bước 4)
  python -I tools/rag-may-tram/chay.py xu-ly --chay-lai-loi              (chạy lại mọi việc LOI)
  python -I tools/rag-may-tram/chay.py trang-thai

Bước (17 mục 3.2): 1 PHAT_HIEN · 2 TRICH · 3 LAM_SACH · 4 CAT_DOAN · 5 NHUNG · 6 NAP_DB.
Mỗi bước là một dòng rag_viec (CHO → DANG_CHAY → XONG | LOI). Đầu ra trung gian để ở thư mục tạm
ngoài repo (RAG_TAM), đầu ra cuối ở rag_tep, rag_van_ban, rag_doan.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import platform
import socket
import sys
import threading
import time
import traceback
from pathlib import Path

# Chạy với `python -I` thì thư mục của script không nằm trong sys.path: tự thêm (chỉ thư mục này).
sys.dont_write_bytecode = True  # không để __pycache__ trong repo
THU_MUC = Path(__file__).resolve().parent
if str(THU_MUC) not in sys.path:
    sys.path.insert(0, str(THU_MUC))

import numpy as np  # noqa: E402
from psycopg.types.json import Jsonb  # noqa: E402

import cat_doan  # noqa: E402
import danh_muc  # noqa: E402
import lam_sach  # noqa: E402
import trich  # noqa: E402
from csdl import ket_noi, vector_sql  # noqa: E402

GOC_THU_VIEN = Path(os.environ.get("RAG_THU_VIEN", r"D:\VibeCode\Antigravity\thu-vien-rag"))
RAG_TAM = Path(os.environ.get("RAG_TAM", r"D:\VibeCode\Antigravity\may-tram\rag-tam"))
MAY_ID = os.environ.get("RAG_MAY_ID", "may-tram-1")

BUOC = ["PHAT_HIEN", "TRICH", "LAM_SACH", "CAT_DOAN", "NHUNG", "NAP_DB"]
SO_BUOC = {b: i + 1 for i, b in enumerate(BUOC)}
DUOI = {"TRICH": "trich", "LAM_SACH": "sach", "CAT_DOAN": "doan"}

# Đợt 1 (12 mục 4): Kanripo KR3g, KR1a đã chọn, KR3f0018; Wikisource WS01–WS17, WS24–WS25.
DOT1_WS = [f"WS{i:02d}" for i in list(range(1, 18)) + [24, 25]]
MANG_CAM = ("M ",)  # 12 mục 6 rủi ro 9: tướng mặt chỉ giữ ở mức danh mục


def sha256_tep(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for khoi in iter(lambda: f.read(1 << 20), b""):
            h.update(khoi)
    return h.hexdigest()


def sha256_chu(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


# ---------------------------------------------------------------- máy xử lý + nhịp tim

def dang_ky_may(phien_ban: dict) -> None:
    with ket_noi(autocommit=True) as cn:
        cn.execute(
            'INSERT INTO rag_may_xu_ly (id, "moTa", "noiChay", "phienBan", "nhipTimLuc")'
            " VALUES (%s, %s, 'MAY_TRAM', %s, now())"
            ' ON CONFLICT (id) DO UPDATE SET "moTa" = EXCLUDED."moTa", "phienBan" = EXCLUDED."phienBan", "nhipTimLuc" = now()',
            (MAY_ID, f"{socket.gethostname()} · {platform.platform()}", Jsonb(phien_ban)))


class NhipTim(threading.Thread):
    def __init__(self, giay: int = 60):
        super().__init__(daemon=True)
        self.giay = giay
        self.dung = threading.Event()

    def run(self):
        while not self.dung.wait(self.giay):
            try:
                with ket_noi(autocommit=True) as cn:
                    cn.execute('UPDATE rag_may_xu_ly SET "nhipTimLuc" = now() WHERE id = %s', (MAY_ID,))
            except Exception as e:  # mất kết nối thì thử lại ở nhịp sau
                print(f"[nhịp tim] lỗi: {e}", file=sys.stderr)


# ---------------------------------------------------------------- hàng việc

class Viec:
    """Một bước của một nguồn/tệp, ghi trạng thái vào rag_viec."""

    def __init__(self, cn, loai: str, nguon_id: int, tep_id: str | None, tham_so: dict):
        self.cn, self.loai, self.nguon_id, self.tep_id, self.tham_so = cn, loai, nguon_id, tep_id, tham_so
        self.id = None

    def _cu(self):
        return self.cn.execute(
            'SELECT id, "trangThai"::text, "soLanThu", "toiDaThu", "thamSo", "ketQua" FROM rag_viec'
            ' WHERE loai = %s::"LoaiViecRag" AND "nguonId" = %s AND "tepId" IS NOT DISTINCT FROM %s'
            ' ORDER BY id DESC LIMIT 1', (self.loai, self.nguon_id, self.tep_id)).fetchone()

    def chay(self, ham, lam_lai: bool = False, chay_lai_loi: bool = False):
        """Trả về (trạng thái, kết quả): 'bo_qua' | 'xong' | 'loi' | 'het_luot'."""
        cu = self._cu()
        if cu:
            vid, tt, so_lan, toi_da, ts, kq = cu
            if tt == "XONG" and ts == self.tham_so and not lam_lai:
                return "bo_qua", kq
            if tt == "LOI" and so_lan >= toi_da and not (lam_lai or chay_lai_loi):
                return "het_luot", None
            if tt in ("CHO", "LOI", "DANG_CHAY"):
                self.id = vid
                if tt == "LOI" and (lam_lai or chay_lai_loi) and so_lan >= toi_da:
                    self.cn.execute('UPDATE rag_viec SET "soLanThu" = 0 WHERE id = %s', (vid,))
        if self.id is None:
            self.id = self.cn.execute(
                'INSERT INTO rag_viec (loai, "noiChay", "nguonId", "tepId", "thamSo", "trangThai", "uuTien")'
                ' VALUES (%s::"LoaiViecRag", \'MAY_TRAM\', %s, %s, %s, \'CHO\', %s) RETURNING id',
                (self.loai, self.nguon_id, self.tep_id, Jsonb(self.tham_so), 50 - SO_BUOC[self.loai])).fetchone()[0]
        # Nhận việc: khóa dòng, bỏ qua nếu tiến trình khác đang giữ.
        r = self.cn.execute('SELECT id FROM rag_viec WHERE id = %s FOR UPDATE SKIP LOCKED', (self.id,)).fetchone()
        if r is None:
            self.cn.rollback()
            return "bo_qua", None
        self.cn.execute(
            'UPDATE rag_viec SET "trangThai" = \'DANG_CHAY\', "soLanThu" = "soLanThu" + 1, "batDauLuc" = now(),'
            ' "ketThucLuc" = NULL, "nhanBoi" = %s, "thamSo" = %s, loi = NULL WHERE id = %s',
            (MAY_ID, Jsonb(self.tham_so), self.id))
        self.cn.commit()
        t0 = time.perf_counter()
        try:
            kq = ham() or {}
            kq["giay"] = round(time.perf_counter() - t0, 3)
            self.cn.execute(
                'UPDATE rag_viec SET "trangThai" = \'XONG\', "ketQua" = %s, "ketThucLuc" = now() WHERE id = %s',
                (Jsonb(kq), self.id))
            self.cn.commit()
            return "xong", kq
        except Exception as e:
            self.cn.rollback()
            loi = f"{type(e).__name__}: {e}\n{traceback.format_exc()[-3000:]}"
            self.cn.execute(
                'UPDATE rag_viec SET "trangThai" = \'LOI\', loi = %s, "ketThucLuc" = now() WHERE id = %s',
                (loi, self.id))
            self.cn.commit()
            print(f"  ✗ {self.loai} lỗi: {e}")
            return "loi", None


# ---------------------------------------------------------------- tệp trung gian

def tam(ma: str, ten: str) -> Path:
    p = RAG_TAM / ma
    p.mkdir(parents=True, exist_ok=True)
    return p / ten


def ghi_json(p: Path, x) -> None:
    tmp = p.with_suffix(p.suffix + ".tmp")
    tmp.write_text(json.dumps(x, ensure_ascii=False), encoding="utf-8")
    tmp.replace(p)


def doc_json(p: Path):
    if not p.is_file():
        raise FileNotFoundError(f"Thiếu tệp trung gian {p}; chạy lại từ bước trước (--tu-buoc).")
    return json.loads(p.read_text(encoding="utf-8"))


# ---------------------------------------------------------------- các bước

def buoc_phat_hien(cn, ng: dict) -> dict:
    goc = Path(ng["duongDanCucBo"].replace("/", os.sep))
    if not goc.exists():
        raise FileNotFoundError(f"Không thấy {goc}")
    if goc.is_file():
        tep = [goc]
    else:
        tep = sorted(p for p in goc.rglob("*.txt") if ".git" not in p.parts)
    ket = []
    for p in tep:
        rel = p.resolve().relative_to(GOC_THU_VIEN.resolve()).as_posix()
        kieu = "JSON" if p.suffix.lower() == ".json" else "TXT"
        sha = sha256_tep(p)
        r = cn.execute(
            'INSERT INTO rag_tep (id, "nguonId", "duongDan", kieu, "kichThuoc", sha256, "trangThai")'
            " VALUES (%s, %s, %s, %s::\"KieuTep\", %s, %s, 'MOI')"
            ' ON CONFLICT ("nguonId", "duongDan") DO UPDATE SET kieu = EXCLUDED.kieu, "kichThuoc" = EXCLUDED."kichThuoc",'
            ' sha256 = EXCLUDED.sha256,'
            ' "trangThai" = CASE WHEN rag_tep.sha256 = EXCLUDED.sha256 THEN rag_tep."trangThai" ELSE \'MOI\' END'
            ' RETURNING id',
            ("tep_" + sha256_chu(f'{ng["id"]}:{rel}')[:22], ng["id"], rel, kieu, p.stat().st_size, sha)).fetchone()
        ket.append({"id": r[0], "duongDan": rel, "kieu": kieu, "sha256": sha})
    if not ket:
        raise RuntimeError(f"{ng['ma']}: không có tệp văn bản trong {goc}")
    ghi_json(tam(ng["ma"], "tep.json"), ket)
    return {"soTep": len(ket), "tongMb": round(sum((GOC_THU_VIEN / t["duongDan"]).stat().st_size for t in ket) / 1e6, 3)}


def buoc_trich(cn, ng: dict, t: dict) -> dict:
    trang = trich.trich_tep(GOC_THU_VIEN / t["duongDan"], t["kieu"], ng["tenGoc"])
    cn.execute('DELETE FROM rag_van_ban WHERE "tepId" = %s', (t["id"],))
    for tr in trang:
        cn.execute(
            'INSERT INTO rag_van_ban (id, "tepId", trang, "vanBanTho", "vanBanSach", "phienBanCongCu")'
            " VALUES (%s, %s, %s, %s, %s, %s)",
            ("vb_" + sha256_chu(f'{t["id"]}:{tr["trang"]}')[:22], t["id"], tr["trang"], tr["tho"],
             trich.van_ban_sach(tr["khoi"]), trich.PHIEN_BAN))
    cn.execute("UPDATE rag_tep SET \"trangThai\" = 'DANG_XU_LY' WHERE id = %s", (t["id"],))
    for tr in trang:
        tr.pop("tho", None)
    ghi_json(tam(ng["ma"], f'{t["id"]}.trich.json'), trang)
    return {"soTrang": len(trang), "soKhoi": sum(len(x["khoi"]) for x in trang)}


def buoc_lam_sach(cn, ng: dict, t: dict) -> dict:
    trang = lam_sach.lam_sach_trang(doc_json(tam(ng["ma"], f'{t["id"]}.trich.json')))
    ghi_json(tam(ng["ma"], f'{t["id"]}.sach.json'), trang)
    return {"soTrang": len(trang), "gianThe": sum(1 for x in trang if x.get("gianThe"))}


def buoc_cat_doan(cn, ng: dict, t: dict) -> dict:
    trang = doc_json(tam(ng["ma"], f'{t["id"]}.sach.json'))
    doan = cat_doan.cat_tep(trang, ng["tenGoc"], t["duongDan"], t["kieu"])
    ghi_json(tam(ng["ma"], f'{t["id"]}.doan.json'), doan)
    dem: dict[str, int] = {}
    for d in doan:
        dem[d["loai"]] = dem.get(d["loai"], 0) + 1
    dai = [cat_doan.do_dai(d["vanBan"]) for d in doan if d["loai"] == "chinh_van"]
    return {"soDoan": len(doan), "theoLoai": dem, "doDaiTB": round(sum(dai) / len(dai), 1) if dai else 0}


def chuoi_nhung(ng: dict, d: dict) -> str:
    duong = " · ".join([ng["tenGoc"]] + d["duongDan"])
    nhan = "〔注〕" if d["loai"] == "chu" else ""
    return f"{duong}\n{nhan}{d['vanBanChuan']}"


def tat_ca_doan(ng: dict, tep: list[dict]) -> list[tuple[int, dict, dict]]:
    ra = []
    for i, t in enumerate(tep):
        for d in doc_json(tam(ng["ma"], f'{t["id"]}.doan.json')):
            ra.append((i, t, d))
    return ra


_BO_NHUNG = None


def bo_nhung(lo: int):
    global _BO_NHUNG
    if _BO_NHUNG is None:
        from nhung import BoNhung
        print("  … nạp mô hình bge-m3")
        _BO_NHUNG = BoNhung(lo=lo)
        print(f"  … {_BO_NHUNG.phien_ban} trên {_BO_NHUNG.ten_gpu or 'CPU'}")
    return _BO_NHUNG


def buoc_nhung(cn, ng: dict, tep: list[dict], lo: int) -> dict:
    bn = bo_nhung(lo)
    p = tam(ng["ma"], "nhung.npz")
    cu: dict[str, np.ndarray] = {}
    if p.is_file():
        # Đọc hết rồi đóng tệp: trên Windows, NpzFile còn mở thì không thay tệp được.
        with np.load(p, allow_pickle=False) as z:
            if str(z["moHinh"]) == bn.phien_ban:
                cu = dict(zip(z["khoa"].tolist(), np.array(z["vec"])))
    chuoi, khoa = [], []
    for _, _, d in tat_ca_doan(ng, tep):
        if not d["nhung"]:
            continue
        s = chuoi_nhung(ng, d)
        k = sha256_chu(s)
        if k in cu or k in khoa:
            continue
        chuoi.append(s)
        khoa.append(k)
    vec, giay = bn.nhung(chuoi)
    so_token = bn.so_token(chuoi) if chuoi else 0
    for k, v in zip(khoa, vec):
        cu[k] = v
    k_all = list(cu)
    np.savez(p.with_suffix(".tmp.npz"), khoa=np.array(k_all), vec=np.stack([cu[k] for k in k_all]) if k_all
             else np.zeros((0, 1024), np.float32), moHinh=np.array(bn.phien_ban))
    p.with_suffix(".tmp.npz").replace(p)
    return {"soNhungMoi": len(chuoi), "tongVector": len(k_all), "giayGpu": round(giay, 3), "soToken": so_token,
            "doanMoiGiay": round(len(chuoi) / giay, 1) if giay > 0 else None, "moHinh": bn.phien_ban,
            "gpu": bn.ten_gpu, "lo": lo}


def buoc_nap_db(cn, ng: dict, tep: list[dict], don_cu: bool) -> dict:
    p = tam(ng["ma"], "nhung.npz")
    vec: dict[str, np.ndarray] = {}
    mo_hinh = None
    if p.is_file():
        with np.load(p, allow_pickle=False) as z:
            vec = dict(zip(z["khoa"].tolist(), np.array(z["vec"])))
            mo_hinh = str(z["moHinh"])
    co_san = {b: (i, co_vec) for b, i, co_vec, _ in cn.execute(
        'SELECT "bamNoiDung", id, embedding IS NOT NULL, "thuTu" FROM rag_doan WHERE "nguonId" = %s', (ng["id"],)).fetchall()}
    thu_tu_cu = dict(cn.execute('SELECT id, "thuTu" FROM rag_doan WHERE "nguonId" = %s', (ng["id"],)).fetchall())
    doi_thu_tu = 0
    id_theo_tt: dict[tuple[int, int], int] = {}
    moi = trung = cap_vec = thieu_vec = 0
    giu: set[str] = set()
    for i, t, d in tat_ca_doan(ng, tep):
        bam = sha256_chu(d["vanBan"])
        giu.add(bam)
        thu_tu = i * 100000 + d["thuTu"]
        v = vec.get(sha256_chu(chuoi_nhung(ng, d))) if d["nhung"] else None
        if d["nhung"] and v is None:
            thieu_vec += 1
        if bam in co_san:
            did, co_vec = co_san[bam]
            trung += 1
            if v is not None and not co_vec:
                cn.execute('UPDATE rag_doan SET embedding = %s::vector, "moHinhNhung" = %s, "nhungLuc" = now(),'
                           ' "capNhatLuc" = now() WHERE id = %s', (vector_sql(v), mo_hinh, did))
                cap_vec += 1
            if thu_tu_cu.get(did) != thu_tu:  # cắt lại làm đoạn dời chỗ: cập nhật vị trí
                cha = id_theo_tt.get((i, cat_doan_cha(d))) if d.get("chaIdx") is not None else None
                cn.execute('UPDATE rag_doan SET "thuTu" = %s, "duongDan" = %s, "chaId" = %s, "capNhatLuc" = now()'
                           ' WHERE id = %s', (thu_tu, d["duongDan"], cha, did))
                doi_thu_tu += 1
            id_theo_tt[(i, d["thuTu"])] = did
            continue
        cha = id_theo_tt.get((i, cat_doan_cha(d))) if d.get("chaIdx") is not None else None
        meta = {**d["meta"], "phienBan": {"trich": trich.PHIEN_BAN, "lamSach": lam_sach.PHIEN_BAN,
                                         "catDoan": cat_doan.PHIEN_BAN}}
        if d["loai"] == "bang":
            meta["khongNhung"] = True
        did = cn.execute(
            'INSERT INTO rag_doan ("nguonId", "tepId", "duongDan", "thuTu", loai, "chaId", "vanBan", "vanBanChuan",'
            ' "bamNoiDung", embedding, "moHinhNhung", "nhungLuc", meta, "capNhatLuc")'
            ' VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s::vector, %s, %s, %s, now()) RETURNING id',
            (ng["id"], t["id"], d["duongDan"], thu_tu, d["loai"], cha, d["vanBan"], d["vanBanChuan"], bam,
             vector_sql(v) if v is not None else None, mo_hinh if v is not None else None,
             _bay_gio() if v is not None else None, Jsonb(meta))).fetchone()[0]
        co_san[bam] = (did, v is not None)
        id_theo_tt[(i, d["thuTu"])] = did
        moi += 1
    xoa = 0
    if don_cu:
        # Đoạn cũ không còn trong lần cắt mới, và chưa ai sửa/trích/gắn nhãn.
        xoa = cn.execute(
            'DELETE FROM rag_doan d WHERE d."nguonId" = %s AND NOT (d."bamNoiDung" = ANY(%s))'
            ' AND NOT EXISTS (SELECT 1 FROM rag_doan_sua s WHERE s."doanId" = d.id)'
            ' AND NOT EXISTS (SELECT 1 FROM rag_doan_nhan n WHERE n."doanId" = d.id)'
            ' AND NOT EXISTS (SELECT 1 FROM "NoiDungTrichDan" x WHERE x."doanId" = d.id)',
            (ng["id"], list(giu))).rowcount
    cn.execute("UPDATE rag_tep SET \"trangThai\" = 'XONG' WHERE id = ANY(%s)", ([t["id"] for t in tep],))
    cn.execute("UPDATE rag_nguon SET \"trangThai\" = 'DA_NAP', \"ngayNap\" = now(), \"capNhatLuc\" = now() WHERE id = %s",
               (ng["id"],))
    return {"moi": moi, "trungBoQua": trung, "doiViTri": doi_thu_tu, "boSungVector": cap_vec, "thieuVector": thieu_vec, "xoaCu": xoa}


def cat_doan_cha(d: dict) -> int:
    return d["meta"].get("cha")


def _bay_gio():
    import datetime
    return datetime.datetime.now()


# ---------------------------------------------------------------- điều phối

def lay_nguon(cn, ma: str) -> dict | None:
    r = cn.execute('SELECT id, ma, "tenGoc", "phapLy"::text, mang, "duongDanCucBo", "trangThaiTai" FROM rag_nguon'
                   " WHERE ma = %s", (ma,)).fetchone()
    if not r:
        return None
    return dict(zip(["id", "ma", "tenGoc", "phapLy", "mang", "duongDanCucBo", "trangThaiTai"], r))


def danh_sach_dot1(cn) -> list[str]:
    r = cn.execute(
        "SELECT ma FROM rag_nguon WHERE \"trangThaiTai\" = 'đã tải' AND \"phapLy\" = 'A' AND"
        " (ma LIKE 'KR3g%%' OR ma LIKE 'KR1a%%' OR ma = 'KR3f0018' OR ma = ANY(%s)) ORDER BY \"uuTien\", ma",
        (DOT1_WS,)).fetchall()
    return [x[0] for x in r]


def xu_ly(args) -> int:
    cn = ket_noi()
    ds = list(args.nguon or [])
    if args.dot1:
        ds += [m for m in danh_sach_dot1(cn) if m not in ds]
    if args.chay_lai_loi and not ds:
        ds = [x[0] for x in cn.execute(
            "SELECT DISTINCT n.ma FROM rag_viec v JOIN rag_nguon n ON n.id = v.\"nguonId\" WHERE v.\"trangThai\" = 'LOI'").fetchall()]
    if not ds:
        print("Không có nguồn nào. Dùng --nguon MA ... hoặc --dot1.")
        return 1
    import torch  # chỉ để ghi phiên bản
    dang_ky_may({"python": sys.version.split()[0], "torch": torch.__version__, "cuda": torch.version.cuda,
                 "gpu": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
                 "trich": trich.PHIEN_BAN, "lamSach": lam_sach.PHIEN_BAN, "catDoan": cat_doan.PHIEN_BAN})
    nhip = NhipTim()
    nhip.start()
    tu = args.tu_buoc or 99
    loi_tong = 0
    for ma in ds:
        ng = lay_nguon(cn, ma)
        if ng is None:
            print(f"{ma}: không có trong rag_nguon (chạy nap-danh-muc trước)")
            loi_tong += 1
            continue
        if not (ma.startswith("KR") or ma.startswith("WS")):
            print(f"{ma}: ngoài phạm vi Đợt 1 (chỉ Kanripo/Wikisource văn bản sạch), bỏ qua")
            continue
        if ng["trangThaiTai"] != "đã tải" or not ng["duongDanCucBo"]:
            print(f"{ma}: chưa tải ({ng['trangThaiTai']}), bỏ qua")
            continue
        if any(m.startswith(MANG_CAM) for m in ng["mang"] or []) and not args.cho_mang_cam:
            print(f"{ma}: mảng {ng['mang']} chỉ giữ ở mức danh mục (12 mục 6 rủi ro 9), bỏ qua")
            continue
        print(f"▶ {ma} {ng['tenGoc']} (pháp lý {ng['phapLy']})")
        cn.execute("UPDATE rag_nguon SET \"trangThai\" = 'DANG_NAP', \"capNhatLuc\" = now() WHERE id = %s AND \"trangThai\" <> 'DA_NAP'", (ng["id"],))
        cn.commit()
        lam_lai = {b: SO_BUOC[b] >= tu for b in BUOC}
        tt, kq = Viec(cn, "PHAT_HIEN", ng["id"], None, {"duongDan": ng["duongDanCucBo"]}).chay(
            lambda: buoc_phat_hien(cn, ng), lam_lai["PHAT_HIEN"] or not tam(ma, "tep.json").is_file(), args.chay_lai_loi)
        print(f"  1 PHAT_HIEN {tt} {kq or ''}")
        if tt in ("loi", "het_luot"):
            loi_tong += 1
            continue
        tep = doc_json(tam(ma, "tep.json"))
        hong = False
        tong_doan = 0
        for t in tep:
            # thamSo của mỗi bước gồm sha256 tệp + phiên bản mọi công cụ phía trước: đổi gì thì bước sau tự chạy lại.
            pb: list[str] = []
            for b, ham, ten_pb in [("TRICH", buoc_trich, trich.PHIEN_BAN), ("LAM_SACH", buoc_lam_sach, lam_sach.PHIEN_BAN),
                                   ("CAT_DOAN", buoc_cat_doan, cat_doan.PHIEN_BAN)]:
                pb.append(ten_pb)
                ts = {"sha256": t["sha256"], "phienBan": pb[:]}
                # Mất tệp trung gian (thư mục tạm bị dọn) thì làm lại bước đó dù thamSo không đổi.
                mat = not tam(ma, f'{t["id"]}.{DUOI[b]}.json').is_file()
                tt, kq = Viec(cn, b, ng["id"], t["id"], ts).chay(lambda ham=ham, t=t: ham(cn, ng, t), lam_lai[b] or mat,
                                                                 args.chay_lai_loi)
                if tt in ("loi", "het_luot"):
                    print(f"  {SO_BUOC[b]} {b} {t['duongDan']}: {tt}")
                    hong = True
                    break
                if b == "CAT_DOAN" and kq:
                    tong_doan += kq.get("soDoan", 0)
            if hong:
                break
        if hong:
            loi_tong += 1
            continue
        print(f"  2–4 TRICH/LAM_SACH/CAT_DOAN xong {len(tep)} tệp, {tong_doan} đoạn")
        ts_n = {"tep": sorted(t["sha256"] for t in tep),
                "phienBan": [trich.PHIEN_BAN, lam_sach.PHIEN_BAN, cat_doan.PHIEN_BAN], "moHinh": "BAAI/bge-m3", "lo": args.lo}
        tt, kq = Viec(cn, "NHUNG", ng["id"], None, ts_n).chay(lambda: buoc_nhung(cn, ng, tep, args.lo),
                                                           lam_lai["NHUNG"] or not tam(ma, "nhung.npz").is_file(), args.chay_lai_loi)
        print(f"  5 NHUNG {tt} {kq or ''}")
        if tt in ("loi", "het_luot"):
            loi_tong += 1
            continue
        ts_d = {**ts_n, "donCu": bool(args.don_cu)}
        tt, kq = Viec(cn, "NAP_DB", ng["id"], None, ts_d).chay(lambda: buoc_nap_db(cn, ng, tep, args.don_cu),
                                                            lam_lai["NAP_DB"], args.chay_lai_loi)
        print(f"  6 NAP_DB {tt} {kq or ''}")
        if tt in ("loi", "het_luot"):
            loi_tong += 1
    nhip.dung.set()
    with ket_noi(autocommit=True) as c2:
        c2.execute('UPDATE rag_may_xu_ly SET "nhipTimLuc" = now() WHERE id = %s', (MAY_ID,))
    cn.close()
    return 1 if loi_tong else 0


def trang_thai(args) -> int:
    with ket_noi() as cn:
        n = cn.execute('SELECT count(*), count(*) FILTER (WHERE "phamVi" = \'CONG_KHAI\'), count(*) FILTER (WHERE "trangThai" = \'DA_NAP\') FROM rag_nguon').fetchone()
        print(f"rag_nguon: {n[0]} dòng | CONG_KHAI {n[1]} | đã nạp {n[2]}")
        d = cn.execute('SELECT count(*), count(embedding), count(*) FILTER (WHERE loai = \'bang\'), count(DISTINCT "nguonId"),'
                       ' pg_size_pretty(pg_total_relation_size(\'rag_doan\')) FROM rag_doan').fetchone()
        print(f"rag_doan: {d[0]} đoạn | có vector {d[1]} | bảng (không nhúng) {d[2]} | {d[3]} nguồn | {d[4]}")
        print("\nNguồn đã xử lý:")
        for r in cn.execute(
                'SELECT n.ma, n."tenGoc", n."phamVi"::text, count(DISTINCT t.id), count(DISTINCT d.id), count(DISTINCT d.id) FILTER (WHERE d.embedding IS NOT NULL)'
                ' FROM rag_nguon n LEFT JOIN rag_tep t ON t."nguonId" = n.id LEFT JOIN rag_doan d ON d."nguonId" = n.id'
                ' WHERE n."trangThai" <> \'DANH_MUC\' GROUP BY n.id ORDER BY n.ma').fetchall():
            print(f"  {r[0]:<10} {r[1][:24]:<24} {r[2]:<9} tệp {r[3]:>3} | đoạn {r[4]:>6} | vector {r[5]:>6}")
        print("\nrag_viec theo bước:")
        for r in cn.execute('SELECT loai::text, "trangThai"::text, count(*) FROM rag_viec GROUP BY 1, 2 ORDER BY 1, 2').fetchall():
            print(f"  {r[0]:<10} {r[1]:<9} {r[2]}")
        for r in cn.execute('SELECT v.id, n.ma, v.loai::text, v."soLanThu", left(v.loi, 200) FROM rag_viec v'
                            ' JOIN rag_nguon n ON n.id = v."nguonId" WHERE v."trangThai" = \'LOI\' ORDER BY v.id DESC LIMIT 10').fetchall():
            print(f"  LỖI #{r[0]} {r[1]} {r[2]} lần {r[3]}: {r[4]}")
        tg = cn.execute('SELECT sum(("ketQua"->>\'soNhungMoi\')::int), sum(("ketQua"->>\'giayGpu\')::float) FROM rag_viec'
                        ' WHERE loai = \'NHUNG\' AND "trangThai" = \'XONG\'').fetchone()
        if tg[0] and tg[1]:
            print(f"\nTốc độ nhúng cộng dồn: {tg[0]} đoạn / {tg[1]:.1f} s GPU = {tg[0] / tg[1]:.1f} đoạn/giây")
        for r in cn.execute('SELECT id, "noiChay"::text, "nhipTimLuc", "phienBan" FROM rag_may_xu_ly').fetchall():
            print(f"Máy {r[0]} ({r[1]}): liên lạc lần cuối {r[2]:%Y-%m-%d %H:%M:%S} | {json.dumps(r[3], ensure_ascii=False)}")
    return 0


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(prog="chay.py", description="Pipeline RAG máy trạm (Đợt 1)")
    sub = ap.add_subparsers(dest="lenh", required=True)
    a = sub.add_parser("nap-danh-muc", help="Nạp 12-thu-vien-rag.csv + so-tai.csv vào rag_nguon")
    a.add_argument("--xem-truoc", action="store_true", help="Chỉ in khác biệt, không ghi")
    a.add_argument("--chap-nhan-doi-phap-ly", action="store_true")
    b = sub.add_parser("xu-ly", help="Chạy các bước 1–6 cho nguồn")
    b.add_argument("--nguon", nargs="*", help="Mã nguồn, vd WS01 KR3g0041")
    b.add_argument("--dot1", action="store_true", help="Mọi nguồn Kanripo/Wikisource của Đợt 1 đã tải")
    b.add_argument("--tu-buoc", type=int, choices=range(1, 7), help="Làm lại từ bước N (1–6)")
    b.add_argument("--chay-lai-loi", action="store_true", help="Chạy lại việc LOI kể cả đã hết lượt thử")
    b.add_argument("--don-cu", action="store_true", help="Ở bước 6, xóa đoạn cũ không còn trong lần cắt mới")
    b.add_argument("--lo", type=int, default=32, help="Cỡ lô GPU (mặc định 32)")
    b.add_argument("--cho-mang-cam", action="store_true", help="Cho xử lý cả mảng chỉ-giữ-danh-mục (M)")
    sub.add_parser("trang-thai", help="Thống kê nguồn, đoạn, việc, máy")
    args = ap.parse_args(argv)
    if args.lenh == "nap-danh-muc":
        kq = danh_muc.nap(xem_truoc=args.xem_truoc, chap_nhan_doi_phap_ly=args.chap_nhan_doi_phap_ly)
        return 1 if kq.get("loi") else 0
    if args.lenh == "xu-ly":
        return xu_ly(args)
    return trang_thai(args)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    sys.exit(main())
