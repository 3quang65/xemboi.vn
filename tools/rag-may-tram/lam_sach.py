"""Bước 3: làm sạch và chuẩn hóa.

- `vanBan` giữ nguyên chữ của bản gốc (đã bỏ mã đánh dấu) để trích.
- `vanBanChuan` để tìm: giản → phồn (OpenCC, chỉ khi đoạn thật sự là giản thể), bảng dị thể tối
  thiểu, chữ tương thích CJK → chữ thống nhất, mã chữ thiếu của Kanripo (&KR0008;) → 〓.
- Tách chú nhỏ "(…/…)" ra khỏi chính văn (12 mục 5.2 ý 4).
"""
from __future__ import annotations

import re
import unicodedata

PHIEN_BAN = "lamsach v1"

try:  # OpenCC thuần Python (Apache-2.0)
    from opencc import OpenCC
    _S2T = OpenCC("s2t")
    _T2S = OpenCC("t2s")
except Exception:  # pragma: no cover
    _S2T = _T2S = None

# Chữ vốn cũng là chữ phồn thể có nghĩa riêng: giữ nguyên khi chuyển giản → phồn
# (巨門 không thành 鉅門, 紫微斗數 không thành 鬥數, 天干/三台/云/余 giữ nguyên).
GIU_KHI_S2T = set("斗余巨布干只里面系台云谷丑卜了松制征注准才表克凶卷范郁游折朴")

# Dị thể hay gặp trong Kanripo (bản Tứ khố) ↔ Wikisource. Cố ý KHÔNG đụng chữ có nghĩa riêng
# (巳 địa chi, 乾/干, 后, 只...).
DI_THE = str.maketrans({
    "爲": "為", "无": "無", "丗": "世", "隂": "陰", "陽": "陽", "冝": "宜", "乆": "久", "敎": "教", "録": "錄",
    "吴": "吳", "呉": "吳", "衆": "眾", "内": "內", "鬭": "鬥", "竒": "奇", "夀": "壽", "廵": "巡",
    "徳": "德", "恊": "協", "曽": "曾", "揔": "總", "摠": "總", "緫": "總", "絶": "絕", "禄": "祿",
    "冲": "沖", "鋭": "銳", "説": "說", "産": "產", "虚": "虛", "晩": "晚", "黒": "黑", "黄": "黃",
    "卽": "即", "旣": "既", "槪": "概", "戸": "戶", "嵗": "歲", "歳": "歲", "温": "溫", "寳": "寶",
    "隣": "鄰", "煕": "熙", "羣": "群", "躰": "體", "軆": "體", "髙": "高", "髮": "髮", "觧": "解",
    "兾": "冀", "㓂": "寇", "筭": "算", "迯": "逃", "姪": "姪", "竝": "並", "囬": "回",
    "囘": "回", "廻": "迴", "畧": "略", "蓋": "蓋", "葢": "蓋", "淸": "清", "靑": "青", "眞": "真",
    "寛": "寬", "鄕": "鄉", "郷": "鄉", "嚮": "嚮", "陷": "陷", "陥": "陷", "强": "強", "彊": "強",
    "凶": "凶", "兇": "凶", "殺": "殺", "煞": "煞", "癸": "癸", "氷": "冰", "况": "況", "凢": "凡",
    "効": "效", "槩": "概", "勅": "敕", "勑": "敕", "於": "於", "亊": "事", "叅": "參", "恠": "怪",
    "揷": "插", "撿": "檢", "敘": "敘", "叙": "敘", "鉅": "鉅", "禮": "禮", "礼": "禮", "壻": "婿",
    "胷": "胸", "脉": "脈", "衞": "衛", "衛": "衛", "裏": "裡", "峯": "峰", "麤": "粗", "麄": "粗",
})
DI_THE = {k: v for k, v in DI_THE.items() if chr(k) != v}

RE_KR_MA = re.compile(r"&KR\d+;")
RE_HAN = re.compile(r"[㐀-䶿一-鿿豈-﫿\U00020000-\U0003134f]")
RE_CHU = re.compile(r"\(([^()]*)\)")


def la_tieng_viet(s: str) -> bool:
    latin = len(re.findall(r"[A-Za-zÀ-ỹ]", s))
    return latin > len(RE_HAN.findall(s))


def _tuong_thich(s: str) -> str:
    """Chữ tương thích CJK (U+F900–FAFF, U+2F800–2FA1F) → chữ thống nhất, không đụng dấu câu."""
    return "".join(unicodedata.normalize("NFKC", c) if ("豈" <= c <= "﫿" or "\U0002f800" <= c <= "\U0002fa1f") else c for c in s)


def la_gian_the(s: str) -> bool | None:
    """True nếu là giản thể, False nếu phồn thể, None nếu quá ngắn để đoán."""
    if _S2T is None:
        return False
    han = RE_HAN.findall(s)
    if len(han) < 4:
        return None
    r_s = sum(1 for a, b in zip(s, _S2T.convert(s)) if a != b) / len(han)
    r_t = sum(1 for a, b in zip(s, _T2S.convert(s)) if a != b) / len(han)
    if len(han) < 20:  # đoạn ngắn: chỉ kết luận khi một phía hoàn toàn không đổi
        if r_s > 0 and r_t == 0:
            return True
        if r_t > 0 and r_s == 0:
            return False
        return None
    return r_s > r_t and r_s > 0.02


def s2t(s: str) -> str:
    t = _S2T.convert(s)
    if len(t) != len(s):
        return t
    return "".join(a if a in GIU_KHI_S2T else b for a, b in zip(s, t))


def chuan_hoa(s: str, gian_the: bool | None = None, mac_dinh: bool = False) -> str:
    """Văn bản để tìm kiếm. `gian_the=None` thì tự đoán; quá ngắn thì theo `mac_dinh` (của trang)."""
    if la_tieng_viet(s):
        return unicodedata.normalize("NFC", s)
    s = RE_KR_MA.sub("〓", s)
    s = _tuong_thich(s)
    if gian_the is None:
        gian_the = la_gian_the(s)
        if gian_the is None:
            gian_the = mac_dinh
    if gian_the and _S2T is not None:
        s = s2t(s)
    s = s.translate(DI_THE)
    s = re.sub(r"[ \t　]+", lambda m: " " if re.search(r"[A-Za-z]", s) else "", s)
    return s.strip()


def tach_chu(t: str) -> tuple[str, list[str]]:
    """'次二銳一(火性上達旣/以火德而處)無不達' → ('次二銳一無不達', ['火性上達旣以火德而處'])."""
    chu = [m.group(1).replace("/", "") for m in RE_CHU.finditer(t)]
    chinh = RE_CHU.sub("", t).replace("(", "").replace(")", "")
    return chinh.strip(), [c.strip() for c in chu if c.strip()]


def lam_sach_trang(trang: list[dict]) -> list[dict]:
    """Thêm cho mỗi khối: chinh, chu (danh sách), và bản chuẩn của cả hai."""
    # Đoán giản/phồn theo cả trang (đoạn ngắn đoán riêng dễ sai).
    for tr in trang:
        toan = "".join(k.get("t", "") for k in tr["khoi"] if k["k"] == "p")[:20000]
        gian = bool(la_gian_the(toan)) if toan else False
        tr["gianThe"] = gian  # mặc định của trang; từng đoạn đủ dài thì tự đoán lại
        for k in tr["khoi"]:
            if k["k"] == "h":
                k["tChuan"] = chuan_hoa(k["t"], None, gian)
            elif k["k"] == "p":
                chinh, chu = tach_chu(k["t"])
                k["chinh"] = chinh
                k["chu"] = chu
                k["chinhChuan"] = chuan_hoa(chinh, None, gian)
                k["chuChuan"] = [chuan_hoa(c, None, gian) for c in chu]
            elif k["k"] == "bang":
                k["dongChuan"] = [chuan_hoa(d, None, gian) for d in k["dong"]]
    return trang
