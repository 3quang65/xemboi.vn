"""Nạp danh mục nguồn (docs/v2/12-thu-vien-rag.csv + so-tai.csv) vào rag_nguon.

- Upsert theo `ma`, chạy lại bao nhiêu lần cũng được.
- Mặc định lúc nhập (17 mục 3.1): A → chiNoiBo=false, xinPhep=KHONG_CAN; B, C, chưa xếp loại →
  chiNoiBo=true, xinPhep=CHUA_XIN. Khi cập nhật KHÔNG ghi đè chiNoiBo/xinPhep (người có thể đã sửa).
- KHÔNG BAO GIỜ gửi phamVi: trigger rag_nguon_tinh_pham_vi tự tính.
- Nếu pháp lý của một dòng khác giữa hai tệp, hoặc khác với CSDL, thì dừng chờ người quyết.
"""
from __future__ import annotations

import csv
import json
import re
from pathlib import Path

from csdl import GOC_REPO, ket_noi

CSV_DANH_MUC = GOC_REPO / "docs" / "v2" / "12-thu-vien-rag.csv"
CSV_SO_TAI = Path(r"D:\VibeCode\Antigravity\thu-vien-rag\so-tai.csv")

TRONG = {"", "—", "-", "–"}

COT = [
    "tenGoc", "tenHanViet", "tacGia", "nienDai", "ngonNgu", "mang", "loaiNguon", "noiCoBanSo",
    "url", "dinhDang", "phapLy", "ghiChuPhapLy", "giayPhep", "ghiCong", "uuTien", "daKiemUrl",
    "trangThaiTai", "dungLuongMb", "duongDanCucBo",
]


def _rong(s: str | None) -> str | None:
    s = (s or "").strip()
    return None if s in TRONG else s


def _mang(s: str | None) -> list[str]:
    return [x.strip() for x in re.split(r"[;；]", s or "") if x.strip() and x.strip() not in TRONG]


def _giay_phep(ghi_chu: str, noi: str, ma: str) -> tuple[str | None, str | None]:
    """Rút giấy phép và dòng ghi công từ ghi_chu_phap_ly (CSV không có cột riêng)."""
    g = ghi_chu or ""
    giay = None
    for mau, ten in [
        (r"CC[ -]?BY[ -]?SA[ -]?4\.0", "CC BY-SA 4.0"), (r"CC[ -]?BY[ -]?SA[ -]?3\.0", "CC BY-SA 3.0"),
        (r"CC[ -]?BY[ -]?NC", "CC BY-NC"), (r"CC[ -]?BY[ -]?4\.0", "CC BY 4.0"), (r"CC0", "CC0"),
        (r"\bMIT\b", "MIT"), (r"Apache", "Apache-2.0"), (r"\bPD\b|phạm vi công cộng|hết hạn bảo hộ", "Phạm vi công cộng"),
    ]:
        if re.search(mau, g, re.I):
            giay = ten
            break
    if ma.startswith("KR"):
        noi_ngan = "Kanripo"
        giay = giay or "CC BY-SA 4.0"
    elif ma.startswith("WS"):
        noi_ngan = "Wikisource"
        if giay in (None, "Phạm vi công cộng") and "CC BY-SA" in g:
            giay = "CC BY-SA 4.0"
    else:
        noi_ngan = re.split(r"[ (;（]", (noi or "").strip())[0] or None
    ghi_cong = f"Văn bản: {noi_ngan}, {giay}" if (giay and noi_ngan) else None
    return giay, ghi_cong


def doc_hai_tep() -> tuple[list[dict], list[str]]:
    with open(CSV_DANH_MUC, encoding="utf-8-sig", newline="") as f:
        dm = list(csv.DictReader(f))
    with open(CSV_SO_TAI, encoding="utf-8-sig", newline="") as f:
        st = {r["ma"].strip(): r for r in csv.DictReader(f)}
    loi: list[str] = []
    dong: list[dict] = []
    for r in dm:
        ma = r["ma"].strip()
        pl = (r.get("phap_ly") or "").strip().upper()
        s = st.get(ma)
        if s and (s.get("phap_ly") or "").strip().upper() not in ("", pl):
            loi.append(f"{ma}: phap_ly danh mục={pl!r} khác so-tai={s['phap_ly']!r}")
        chua_xep = pl not in ("A", "B", "C")
        trang_thai_tai = _rong(s.get("trang_thai")) if s else None
        noi_luu = _rong(s.get("noi_luu_hoac_ly_do")) if s else None
        try:
            dl = float(s["dung_luong_mb"]) if s and _rong(s.get("dung_luong_mb")) else None
        except ValueError:
            dl = None
        giay, ghi_cong = _giay_phep(r.get("ghi_chu_phap_ly", ""), r.get("noi_co_ban_so", ""), ma)
        try:
            uu_tien = int(r["uu_tien"]) if _rong(r.get("uu_tien")) else None
        except ValueError:
            uu_tien = None
        ghi_chu = _rong(r.get("ghi_chu_phap_ly"))
        if chua_xep:
            ghi_chu = ("[CHƯA XẾP LOẠI: tạm lưu C] " + (ghi_chu or "")).strip()
        dong.append({
            "ma": ma,
            "tenGoc": _rong(r.get("ten_goc")) or ma,
            "tenHanViet": _rong(r.get("ten_han_viet")),
            "tacGia": _rong(r.get("tac_gia")),
            "nienDai": _rong(r.get("nien_dai")),
            "ngonNgu": _mang(r.get("ngon_ngu")),
            "mang": _mang(r.get("mang")),
            "loaiNguon": _rong(r.get("loai_nguon")) or "sach_co",
            "noiCoBanSo": _rong(r.get("noi_co_ban_so")),
            "url": _rong(r.get("url")),
            "dinhDang": _rong(r.get("dinh_dang")),
            "phapLy": "C" if chua_xep else pl,
            "ghiChuPhapLy": ghi_chu,
            "giayPhep": giay,
            "ghiCong": ghi_cong,
            "uuTien": uu_tien,
            "daKiemUrl": (r.get("da_kiem_url") or "").strip().lower() in ("co", "có", "true", "1", "yes"),
            "trangThaiTai": trang_thai_tai,
            "dungLuongMb": dl,
            # Chỉ coi là đường dẫn khi đã tải; ngược lại cột này là lý do lỗi.
            "duongDanCucBo": noi_luu if trang_thai_tai == "đã tải" else None,
            "_chua_xep": chua_xep,
            "_ly_do_tai": noi_luu if trang_thai_tai != "đã tải" else None,
        })
    ma_trung = {d["ma"] for d in dong if sum(1 for x in dong if x["ma"] == d["ma"]) > 1}
    if ma_trung:
        loi.append(f"Mã trùng trong danh mục: {sorted(ma_trung)}")
    return dong, loi


def nap(xem_truoc: bool = False, chap_nhan_doi_phap_ly: bool = False) -> dict:
    dong, loi = doc_hai_tep()
    if loi:
        print("DỪNG: hai tệp lệch nhau, cần người quyết:")
        for l in loi:
            print("  -", l)
        return {"loi": loi}
    with ket_noi() as cn, cn.cursor() as cur:
        cur.execute('SELECT ma, "phapLy"::text, ' + ", ".join(f'"{c}"' for c in COT if c != "phapLy") + " FROM rag_nguon")
        ten_cot = [d.name for d in cur.description]
        cu = {r[0]: dict(zip(ten_cot, r)) for r in cur.fetchall()}
        moi, doi, giu, doi_pl = [], [], [], []
        for d in dong:
            c = cu.get(d["ma"])
            if c is None:
                moi.append(d["ma"])
                continue
            if c["phapLy"] != d["phapLy"]:
                doi_pl.append(f'{d["ma"]}: CSDL={c["phapLy"]} → CSV={d["phapLy"]}')
            khac = [k for k in COT if (c.get(k) if k != "dungLuongMb" else (None if c.get(k) is None else round(c[k], 3)))
                    != (d[k] if k != "dungLuongMb" else (None if d[k] is None else round(d[k], 3)))]
            (doi if khac else giu).append((d["ma"], khac))
        print(f"Danh mục: {len(dong)} dòng | mới {len(moi)} | đổi {len(doi)} | giữ nguyên {len(giu)}")
        for ma, khac in doi[:15]:
            print(f"  ~ {ma}: {', '.join(khac)}")
        if doi_pl:
            print("Pháp lý đổi so với CSDL:")
            for x in doi_pl:
                print("  !", x)
            if not chap_nhan_doi_phap_ly:
                print("DỪNG: có dòng đổi pháp lý. Chạy lại với --chap-nhan-doi-phap-ly nếu người đã duyệt.")
                return {"loi": doi_pl}
        if xem_truoc:
            print("(xem trước, chưa ghi)")
            return {"moi": len(moi), "doi": len(doi), "giu": len(giu)}

        sql = (
            'INSERT INTO rag_nguon (ma, "tenGoc", "tenHanViet", "tacGia", "nienDai", "ngonNgu", mang, "loaiNguon",'
            ' "noiCoBanSo", url, "dinhDang", "phapLy", "ghiChuPhapLy", "giayPhep", "ghiCong", "uuTien", "daKiemUrl",'
            ' "trangThaiTai", "dungLuongMb", "duongDanCucBo", "chiNoiBo", "xinPhep", "capNhatLuc")'
            ' VALUES (%(ma)s, %(tenGoc)s, %(tenHanViet)s, %(tacGia)s, %(nienDai)s, %(ngonNgu)s, %(mang)s, %(loaiNguon)s,'
            ' %(noiCoBanSo)s, %(url)s, %(dinhDang)s, %(phapLy)s::"PhapLy", %(ghiChuPhapLy)s, %(giayPhep)s, %(ghiCong)s,'
            ' %(uuTien)s, %(daKiemUrl)s, %(trangThaiTai)s, %(dungLuongMb)s, %(duongDanCucBo)s, %(chiNoiBo)s,'
            ' %(xinPhep)s::"TrangThaiXinPhep", now())'
            ' ON CONFLICT (ma) DO UPDATE SET '
            + ", ".join(f'"{c}" = EXCLUDED."{c}"' for c in COT)
            + ', "capNhatLuc" = now()'
            # Không đụng chiNoiBo / xinPhep / phamVi của dòng đã có.
            ' WHERE (' + ", ".join(f'rag_nguon."{c}"' for c in COT) + ') IS DISTINCT FROM ('
            + ", ".join(f'EXCLUDED."{c}"' for c in COT) + ')'
        )
        for d in dong:
            a = d["phapLy"] == "A" and not d["_chua_xep"]
            d["chiNoiBo"] = not a
            d["xinPhep"] = "KHONG_CAN" if a else "CHUA_XIN"
        cur.executemany(sql, dong)
        cn.commit()
        cur.execute('SELECT count(*), count(*) FILTER (WHERE "phamVi"=\'CONG_KHAI\'), count(*) FILTER (WHERE "chiNoiBo") FROM rag_nguon')
        tong, ck, nb = cur.fetchone()
        print(f"rag_nguon: {tong} dòng | CONG_KHAI (trigger tính) {ck} | chiNoiBo {nb}")
        return {"tong": tong, "moi": len(moi), "doi": len(doi), "congKhai": ck}


if __name__ == "__main__":
    print(json.dumps(nap(xem_truoc=True), ensure_ascii=False))
