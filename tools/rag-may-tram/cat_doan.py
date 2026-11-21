"""Bước 4: cắt đoạn theo cấu trúc (12 mục 5.2).

- Thứ bậc quyển → thiên → mục; đường dẫn lưu vào duongDan và đặt ở đầu chuỗi đem nhúng.
- Văn xuôi: 150–400 chữ, không cắt giữa câu, gối đầu 1 câu khi cùng thiên.
- Phú (賦/歌/訣): 2–4 cặp câu một đoạn.
- Vấn đáp (問…): một sao (một tiêu đề 問) một đoạn; dài quá thì tách.
- Kinh Dịch: lời quẻ / mỗi hào một đoạn; 彖/象/文言 là đoạn 'chu' nối về hào (chaIdx, meta.cha).
- Chú nhỏ trong ngoặc tách thành đoạn 'chu' riêng, nối về chính văn.
- Bảng: loai='bang', không nhúng, dòng bảng để trong meta.bang.
"""
from __future__ import annotations

import re

from lam_sach import chuan_hoa, la_tieng_viet, tach_chu

PHIEN_BAN = "catdoan v1.1"

MIN, MAX, MAX_CHU = 150, 400, 400
RE_HAN = re.compile(r"[㐀-䶿一-鿿豈-﫿\U00020000-\U0003134f〓]")
RE_HAO = re.compile(r"^(初[六九]|[六九][二三四五]|上[六九]|用[六九])\s*[：:、，,。]?")
RE_TRUYEN = re.compile(r"^(彖曰|象曰|文言曰|小象|大象|彖傳|象傳|文言)\s*[：:]?\s*$")
RE_KINH_NHAN = re.compile(r"^(易經|經文|經)\s*[：:]\s*$")
RE_TRUYEN_DAU = re.compile(r"^《?(彖|象|文言)》?曰")
RE_PHU = re.compile(r"(賦|赋|歌|訣|诀|謠|谣)")
DAU_KET = "。！？；!?;"
DONG_NGOAC = "」』”’"


def do_dai(s: str) -> int:
    """Số chữ: chữ Hán, cộng số từ La-tinh (tiếng Việt)."""
    return len(RE_HAN.findall(s)) + len(re.findall(r"[A-Za-zÀ-ỹ]+", s))


def _do_dai_chinh(s: str) -> int:
    return do_dai(tach_chu(s)[0])


def tach_cau(t: str, dau: str = DAU_KET) -> list[str]:
    """Tách câu ở độ sâu ngoặc 0. Văn không chấm câu thì cắt cứng ~300 chữ, ưu tiên sau một chú."""
    cau, cur, sau = [], [], 0
    i = 0
    while i < len(t):
        ch = t[i]
        cur.append(ch)
        if ch == "(":
            sau += 1
        elif ch == ")":
            sau = max(0, sau - 1)
        elif sau == 0 and ch in dau:
            while i + 1 < len(t) and t[i + 1] in DONG_NGOAC:
                i += 1
                cur.append(t[i])
            cau.append("".join(cur))
            cur = []
        i += 1
    if cur:
        cau.append("".join(cur))
    ra = []
    for c in cau:
        if _do_dai_chinh(c) <= MAX:
            ra.append(c)
            continue
        # Cắt cứng: duyệt ký tự, cắt khi đủ ~300 chữ chính văn ở ngoài ngoặc.
        cur, n, sau = [], 0, 0
        for ch in c:
            cur.append(ch)
            if ch == "(":
                sau += 1
            elif ch == ")":
                sau = max(0, sau - 1)
                if n >= 280 and sau == 0:
                    ra.append("".join(cur)); cur, n = [], 0
                continue
            elif sau == 0 and RE_HAN.match(ch):
                n += 1
                if n >= 320:
                    ra.append("".join(cur)); cur, n = [], 0
        if cur:
            ra.append("".join(cur))
    return [x for x in ra if x.strip()]


class BoCat:
    def __init__(self, ten_sach: str, gian_the: bool):
        self.ten_sach = ten_sach
        self.gian = gian_the
        self.doan: list[dict] = []

    # ------------------------------------------------------------ ghi đoạn
    def _them(self, van_ban: str, duong: list[str], loai: str, the: str, meta: dict, cha: int | None = None,
              nhung: bool = True) -> int | None:
        van_ban = van_ban.strip()
        if do_dai(van_ban) < 2 and loai != "bang":
            return None
        d = {
            "thuTu": len(self.doan) + 1,
            "duongDan": duong[:],
            "loai": loai,
            "vanBan": van_ban,
            "vanBanChuan": chuan_hoa(van_ban, None, self.gian),
            "chaIdx": cha,
            "nhung": nhung,
            "meta": {**meta, "the": the},
        }
        if cha is not None:
            d["meta"]["cha"] = self.doan[cha]["thuTu"]
        self.doan.append(d)
        return len(self.doan) - 1

    def _them_raw(self, raw: str, duong, the, meta, loai_chinh="chinh_van", cha=None) -> int | None:
        """Một khối thô (có chú trong ngoặc) → đoạn chính văn + đoạn chú."""
        chinh, chu = tach_chu(raw)
        idx = None
        if do_dai(chinh) >= 2:
            idx = self._them(chinh, duong, loai_chinh, the, meta, cha=cha)
        if chu:
            noi = "｜".join(chu)
            loai_chu = "chu"
            cha_chu = idx if idx is not None else cha
            # Chú quá ngắn ngoài Kinh Dịch thường là nhãn ("賦云｜三命云", "臣"): không thành đoạn.
            if do_dai(noi) >= (4 if the == "kinh_dich" else 8):
                for phan in self._chia_chu(noi):
                    self._them(phan, duong, loai_chu, the, meta, cha=cha_chu)
        return idx

    @staticmethod
    def _chia_chu(s: str) -> list[str]:
        if do_dai(s) <= MAX_CHU + 100:
            return [s]
        phan, cur = [], ""
        for c in re.split(r"(?<=[｜。；])", s):
            if cur and do_dai(cur + c) > MAX_CHU:
                phan.append(cur); cur = ""
            cur += c
        if cur:
            if phan and do_dai(cur) < 60:
                phan[-1] += cur
            else:
                phan.append(cur)
        ra = []
        for p in phan:  # chú không chấm câu
            while do_dai(p) > MAX_CHU + 200:
                ra.append(p[:MAX_CHU]); p = p[MAX_CHU:]
            ra.append(p)
        return ra

    # ------------------------------------------------------------ thể loại
    def cat_van_xuoi(self, para: list[dict], duong, meta, lon=MAX, nho=MIN, goi_dau=True, dau=DAU_KET):
        don_vi: list[tuple[str, bool]] = []  # (câu, đầu đoạn?)
        for p in para:
            for j, c in enumerate(tach_cau(p["t"], dau)):
                don_vi.append((c, j == 0))
        if not don_vi:
            return
        cham_cau = any(c[-1:] in DAU_KET for c, _ in don_vi)
        nhom: list[list[tuple[str, bool]]] = []
        cur: list[tuple[str, bool]] = []
        n = 0
        for c, dau_doan in don_vi:
            l = _do_dai_chinh(c)
            if cur and n + l > lon and n >= nho:
                nhom.append(cur)
                truoc = cur[-1][0]
                if goi_dau and cham_cau and _do_dai_chinh(truoc) <= 60 and len(cur) > 1:
                    cur, n = [(truoc, False)], _do_dai_chinh(truoc)
                else:
                    cur, n = [], 0
            cur.append((c, dau_doan))
            n += l
        if cur:
            if nhom and n < nho and sum(_do_dai_chinh(c) for c, _ in nhom[-1]) + n <= lon + 50:
                nhom[-1].extend(x for x in cur if x not in nhom[-1][-1:])
            else:
                nhom.append(cur)
        for g in nhom:
            raw = "".join(("\n" if (dd and k) else "") + c for k, (c, dd) in enumerate(g))
            self._them_raw(raw, duong, meta.get("the", "van_xuoi"), meta)

    def cat_phu(self, para, duong, meta):
        """2–4 cặp câu; một 'cặp' = một câu kết bằng 。！？ (thường gồm hai vế đối)."""
        cap: list[str] = []
        for p in para:
            cap.extend(tach_cau(p["t"], "。！？!?"))
        if not cap or not any(c[-1:] in "。！？!?" for c in cap):
            return self.cat_van_xuoi(para, duong, meta, lon=200, nho=60, goi_dau=False)
        nhom, cur = [], []
        for c in cap:
            if cur and (len(cur) >= 4 or _do_dai_chinh("".join(cur) + c) > 200) and len(cur) >= 2:
                nhom.append(cur); cur = []
            cur.append(c)
        if cur:
            if nhom and len(cur) < 2 and len(nhom[-1]) < 5:
                nhom[-1].extend(cur)
            else:
                nhom.append(cur)
        for g in nhom:
            self._them_raw("".join(g), duong, "phu", meta)

    def cat_van_dap(self, para, duong, meta):
        raw = "\n".join(p["t"] for p in para)
        if _do_dai_chinh(raw) <= 800:
            self._them_raw(raw, duong, "van_dap", meta)
        else:
            self.cat_van_xuoi(para, duong, {**meta, "the": "van_dap"})

    def cat_dich(self, para, duong, meta):
        nhan = None  # nhãn truyện hiện tại (彖曰/象曰/文言曰) hoặc None = kinh văn
        hao: list[tuple[int, str]] = []  # (idx đoạn, lời hào) để nối truyện về hào
        que_idx = None
        for p in para:
            t = p["t"].strip()
            if RE_KINH_NHAN.match(t):
                nhan = None
                continue
            m = RE_TRUYEN.match(t)
            if m:
                nhan = m.group(1)
                continue
            if nhan is None and not RE_TRUYEN_DAU.match(t):
                idx = self._them_raw(t, duong, "kinh_dich", {**meta, "hao": (RE_HAO.match(t).group(1) if RE_HAO.match(t) else "que")})
                if idx is not None:
                    if RE_HAO.match(t):
                        hao.append((idx, RE_HAO.sub("", tach_chu(t)[0])))
                    elif que_idx is None:
                        que_idx = idx
                continue
            # Truyện / chú: đoạn 'chu' nối về hào có câu trùng ≥ 4 chữ, không thì về lời quẻ.
            chinh = tach_chu(t)[0]
            cha = que_idx
            for idx, loi in hao:
                loi_s = re.sub(r"[，。；：、「」]", "", loi)
                if len(loi_s) >= 2 and any(loi_s[i:i + 4] in chinh for i in range(0, max(1, len(loi_s) - 3))):
                    cha = idx
                    break
            noi = (nhan + "：" if nhan and not t.startswith(nhan) else "") + t
            self._them_raw(noi, duong, "kinh_dich", meta, loai_chinh="chu", cha=cha)

    # ------------------------------------------------------------ điều phối
    def cat_muc(self, para: list[dict], duong: list[str], meta: dict):
        if not para:
            return
        cuoi = duong[-1] if duong else ""
        so_hao = sum(1 for p in para if RE_HAO.match(p["t"].strip()))
        if so_hao >= 2 or (so_hao >= 1 and any(RE_TRUYEN.match(p["t"].strip()) or RE_TRUYEN_DAU.match(p["t"].strip()) for p in para)):
            return self.cat_dich(para, duong, meta)
        if re.match(r"^[問问]", cuoi):
            return self.cat_van_dap(para, duong, meta)
        if RE_PHU.search(cuoi) or (not cuoi and RE_PHU.search(self.ten_sach[-3:])):
            return self.cat_phu(para, duong, meta)
        return self.cat_van_xuoi(para, duong, {**meta, "the": "van_xuoi"})


def cat_tep(trang: list[dict], ten_sach: str, tep_rel: str, kieu: str) -> list[dict]:
    """Danh sách trang đã làm sạch → danh sách đoạn (chưa có id)."""
    goc = None
    if kieu == "JSON" and trang:
        goc = trang[0]["ten"].split("/")[0]
    bo = BoCat(ten_sach, False)
    for tr in trang:
        bo.gian = tr.get("gianThe", False)
        phu_de: list[str] = []
        if kieu == "JSON":
            phan = tr["ten"].split("/")
            phu_de = phan[1:] if phan[0] == goc else phan
        ngan_xep: list[tuple[int, str]] = []
        para: list[dict] = []
        meta_trang = {"tep": tep_rel, "trang": tr["trang"]}

        def duong():
            return phu_de + [t for _, t in ngan_xep]

        def xa():
            nonlocal para
            if para:
                bo.cat_muc(para, duong(), {**meta_trang, "pb": para[0].get("pb")})
            para = []

        for k in tr["khoi"]:
            if k["k"] == "h":
                xa()
                t = k.get("tChuan") or k["t"]
                t = re.sub(r"\s+", " ", t).strip(" ：:")
                if not t:
                    continue
                # Tiêu đề cấp 1 lặp tên sách/trang ("紫微斗數全書卷一") thì bỏ.
                if kieu == "JSON" and k["cap"] <= 1 and (
                    (goc and chuan_hoa(goc, True) in t) or any(p and p in t for p in phu_de)):
                    continue
                while ngan_xep and ngan_xep[-1][0] >= k["cap"]:
                    ngan_xep.pop()
                ngan_xep.append((k["cap"], t))
            elif k["k"] == "p":
                para.append(k)
            elif k["k"] == "bang":
                xa()
                bo._them("\n".join(k["dong"]), duong(), "bang", "bang",
                         {**meta_trang, "bang": k.get("dongChuan") or k["dong"]}, nhung=False)
        xa()
    for d in bo.doan:
        d["meta"]["ngonNgu"] = "vi" if la_tieng_viet(d["vanBan"]) else "han"
    return bo.doan
