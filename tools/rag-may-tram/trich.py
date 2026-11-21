"""Bước 2a: trích văn bản sạch từ tệp mandoku (Kanripo) và JSON Wikisource.

Đầu ra mỗi tệp là danh sách "trang" (Kanripo: một tệp = một quyển; Wikisource: một trang wiki), mỗi
trang có danh sách khối:
  {"k": "h", "cap": n, "t": "..."}              tiêu đề (quyển / thiên / mục)
  {"k": "p", "t": "...", "tho": bool, "pb": "..."}  đoạn văn; chú nhỏ để trong ngoặc ASCII "(...)"
  {"k": "bang", "dong": ["...", ...]}            bảng: không nhúng

Tệp tải về là dữ liệu không tin cậy: chỉ đọc chữ, không chạy gì trong đó.
"""
from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

PHIEN_BAN = "trich v1"

HAN = r"㐀-䶿一-鿿豈-﫿\U00020000-\U0003134f"
RE_HAN = re.compile(f"[{HAN}]")
DAU_CAU = "。．，、；：？！「」『』（）《》〈〉…"


# ---------------------------------------------------------------- Kanripo (mandoku)

RE_PB = re.compile(r"<pb:([^>]*)>")
# Tiêu đề thiên/mục trong bản Tứ khố thường có các chữ này; câu thơ thụt lề thì không.
RE_TU_TIEU_DE = re.compile(r"[論论歌訣诀賦赋圖图例法篇說说序條条問问總总格局章卷部凡引要斷断經经解式表傳传第目錄录跋記记占]")
RE_TAC_GIA = re.compile(r"(撰|著|編|編次|註|注|述|輯|集|解|校|纂|譔|撰集|奉敕撰|奉勅撰|集註|集解|訂|補|演|傳|疏)$")


def _rong_hien(s: str) -> float:
    """Độ rộng hiển thị của một dòng: chữ trong chú hai dòng (...) tính nửa ô."""
    w, trong_chu = 0.0, False
    for ch in s:
        if ch == "(":
            trong_chu = True
            continue
        if ch == ")":
            trong_chu = False
            continue
        if ch == "/":
            continue
        w += 0.5 if trong_chu else 1.0
    return w


def _la_bang(dong: list[str]) -> bool:
    """Nhiều dòng rất ngắn liên tiếp, không dấu câu, không chú → bảng hoặc đồ biểu."""
    if len(dong) < 6:
        return False
    ngan = [d for d in dong if len(d) <= 8 and "(" not in d and not re.search("[，。：、；！？]", d)]
    return len(ngan) >= 0.8 * len(dong)


def trich_kanripo(van_ban: str, ten_sach: str) -> list[dict]:
    """Một tệp mandoku → một trang (một quyển)."""
    juan = None
    dong_tho = []
    for line in van_ban.splitlines():
        if line.startswith("#"):
            m = re.match(r"#\+PROPERTY:\s*JUAN\s+(.*)", line)
            if m:
                juan = m.group(1).strip()
            continue
        dong_tho.append(line)

    # Tách dòng vật lý: bỏ ¶, ghi số trang.
    dong: list[tuple[int, str, str | None, bool]] = []  # (thụt, chữ, pb, có ¶)
    pb = None
    for line in dong_tho:
        co_pb = False
        for m in RE_PB.finditer(line):
            pb = m.group(1)
            co_pb = True
        line = RE_PB.sub("", line)
        if co_pb and not line.replace("¶", "").strip("　 "):
            continue  # dòng chỉ có mốc trang: không phải dòng trống
        co_ngat = line.endswith("¶")
        line = line.replace("¶", "").rstrip()
        thut = len(line) - len(line.lstrip("　 "))
        dong.append((thut, line.strip("　 "), pb, co_ngat))

    dai = [len(t) for _, t, _, _ in dong if len(t) >= 12 and not t.startswith("*")]
    rong_day = Counter(round(_rong_hien(t)) for _, t, _, _ in dong if len(t) >= 12).most_common(1)
    rong_day = rong_day[0][0] if rong_day else 20
    thut_than = Counter(th for th, t, _, _ in dong if _rong_hien(t) >= rong_day - 1).most_common(1)
    thut_than = thut_than[0][0] if thut_than else 1

    # Bản đã chấm câu (vd. tls): phân đoạn bằng dòng trống, không đoán theo khổ dòng.
    co_chu = [t for _, t, _, _ in dong if t]
    cham_cau = bool(co_chu) and sum(1 for t in co_chu if t[-1] in "，。：、；！？」") / len(co_chu) > 0.3

    khoi: list[dict] = []
    if juan:
        khoi.append({"k": "h", "cap": 1, "t": juan if not re.fullmatch(r"\d+", juan) else f"卷{juan}"})
    gom: list[str] = []
    gom_dong: list[str] = []
    gom_pb = None

    def xa():
        nonlocal gom, gom_dong, gom_pb
        if gom:
            if _la_bang(gom_dong):
                khoi.append({"k": "bang", "dong": gom_dong[:]})
            else:
                khoi.append({"k": "p", "t": "".join(gom), "tho": cham_cau and len(gom) > 1, "pb": gom_pb})
        gom, gom_dong, gom_pb = [], [], None

    ten_ngan = re.sub(r"[（(].*", "", ten_sach).strip()
    truoc_ngan = True
    for thut, t, pb_dong, _ in dong:
        if not t:
            xa()
            truoc_ngan = True
            continue
        m = re.match(r"^(\*+)\s+(.*)$", t)
        if m:
            xa()
            khoi.append({"k": "h", "cap": 1 + len(m.group(1)), "t": m.group(2).strip("《》 ")})
            truoc_ngan = True
            continue
        t_gon = t.replace("　", "").replace(" ", "")
        if re.fullmatch(r"(欽定)?四庫全書.{0,8}", t_gon) or (
                ten_ngan and t_gon.startswith(ten_ngan) and re.search(r"[部類]", t_gon[len(ten_ngan):]) and len(t_gon) <= len(ten_ngan) + 8):
            xa()
            truoc_ngan = True
            continue
        # Dòng tên sách + quyển ("星學大成卷一") lặp lại ở đầu/cuối quyển: bỏ.
        if len(t) <= 24 and ten_ngan and t.replace("　", "").startswith(ten_ngan[:4]) and re.search(r"卷[第]?[一二三四五六七八九十百上中下首末\d]+", t):
            xa()
            truoc_ngan = True
            continue
        # Dòng tên người soạn ("明　萬民英　撰").
        if "　" in t and len(t) <= 30 and "(" not in t and RE_TAC_GIA.search(t.replace("　", "")):
            xa()
            truoc_ngan = True
            continue
        rong = _rong_hien(t)
        la_tieu_de = (
            not cham_cau and truoc_ngan and thut > thut_than and len(t) <= 20 and "(" not in t
            and not any(c in t for c in "。，；") and rong < rong_day - 1
            and RE_TU_TIEU_DE.search(t)
        )
        if la_tieu_de:
            xa()
            khoi.append({"k": "h", "cap": 3, "t": t.replace("　", " ").strip()})
            truoc_ngan = True
            continue
        if gom_pb is None:
            gom_pb = pb_dong
        gom.append(t.replace("　", ""))
        gom_dong.append(t)
        # Dòng kết thúc sớm (ngắn hơn khổ) = hết đoạn. Bản tls/có chấm câu: dòng trống phân đoạn.
        if not cham_cau and rong < rong_day - 1 and dai:
            xa()
            truoc_ngan = True
        else:
            truoc_ngan = False
    xa()
    return [{"trang": 1, "ten": juan or "", "tho": van_ban, "khoi": khoi}]


# ---------------------------------------------------------------- Wikisource (wikitext)

TMPL_BO = {"header", "header2", "footer", "further", "清朝作品", "pd-old", "pd", "ps", "textquality",
           "process", "版权", "copyright", "fixed", "sisterlinks", "wikipedia", "noprint", "proofread",
           "documentation", "defaultsort", "toc", "tocright", "clear", "page", "pages"}
TMPL_CHU = {"*", "small", "smaller", "注", "註", "小字", "sup", "note", "font-size", "small text", "!"}


def _bo_template(s: str) -> str:
    """Xử lý {{...}} từ trong ra ngoài (lồng nhau)."""
    re_tmpl = re.compile(r"\{\{([^{}]*)\}\}", re.S)
    for _ in range(20):
        def thay(m):
            ben_trong = m.group(1)
            phan = [p.strip() for p in ben_trong.split("|")]
            ten = phan[0].strip().lower()
            if ten.startswith("#") or ten.startswith("../") or ten.startswith("/") or ten.startswith(":"):
                return ""
            if ten in TMPL_BO or any(ten.startswith(x) for x in ("header", "footer", "pd", "process")):
                return ""
            vi_tri = [p for p in phan[1:] if "=" not in p.split("|")[0][:20]]
            if ten in TMPL_CHU:
                return "(" + "".join(vi_tri) + ")" if vi_tri else ""
            if not vi_tri:
                return ""
            return vi_tri[-1] if ten not in ("ruby", "rubyh") else vi_tri[0]
        moi = re_tmpl.sub(thay, s)
        if moi == s:
            break
        s = moi
    return s


def _bo_lang(s: str) -> str:
    s = re.sub(r"-\{T\|[^}]*\}-", "", s)

    def thay(m):
        t = m.group(1)
        if ";" in t and ":" in t:
            cap = dict(x.split(":", 1) for x in t.split(";") if ":" in x)
            return cap.get("zh-hant") or cap.get("zh-tw") or next(iter(cap.values()))
        return t.split("|")[-1]
    return re.sub(r"-\{(.*?)\}-", thay, s)


def _wikitext_sang_khoi(wt: str) -> list[dict]:
    s = re.sub(r"<!--.*?-->", "", wt, flags=re.S)
    s = re.sub(r"<ref[^>/]*/>", "", s)
    s = re.sub(r"<ref[^>]*>.*?</ref>", "", s, flags=re.S)
    s = _bo_lang(s)
    s = _bo_template(s)
    s = re.sub(r"\[\[(?:File|Image|檔案|文件|图像|圖像|Category|分類|分类)[^\[\]]*(?:\[\[[^\]]*\]\][^\[\]]*)*\]\]", "", s, flags=re.I)
    s = re.sub(r"\[\[[a-z\-]{2,12}:[^\]]*\]\]", "", s)
    s = re.sub(r"\[\[([^\]|]*)\|([^\]]*)\]\]", r"\2", s)
    s = re.sub(r"\[\[([^\]]*)\]\]", lambda m: m.group(1).lstrip("/").split("/")[-1], s)
    s = re.sub(r"\[https?://\S+\s*([^\]]*)\]", r"\1", s)
    s = re.sub(r"'''''|'''|''", "", s)
    s = re.sub(r"__[A-Z]+__", "", s)

    khoi: list[dict] = []
    tho = False
    bang: list[str] | None = None
    for raw in s.splitlines():
        line = raw.strip()
        low = line.lower()
        if bang is not None:
            if line.startswith("|}"):
                dong = [d for d in bang if d]
                if dong:
                    khoi.append({"k": "bang", "dong": dong})
                bang = None
                continue
            if line.startswith("|-") or line.startswith("{|"):
                bang.append("")
                continue
            o = re.sub(r"^[|!]", "", line)
            o = re.sub(r"^[^|]*?(style|align|colspan|rowspan|width)=[^|]*\|", "", o)
            o = " | ".join(x.strip() for x in re.split(r"\|\||!!", o))
            o = re.sub(r"<[^>]+>", "", o)
            if bang and bang[-1]:
                bang[-1] += " | " + o
            else:
                if bang:
                    bang[-1] = o
                else:
                    bang.append(o)
            continue
        if line.startswith("{|"):
            bang = []
            continue
        if "<poem" in low:
            tho = True
        if "</poem>" in low:
            tho_ket = True
        else:
            tho_ket = False
        line = re.sub(r"<br\s*/?>", "\n", line, flags=re.I)
        line = re.sub(r"</?[a-zA-Z][^>]*>", "", line).strip()
        m = re.match(r"^(={2,6})\s*(.*?)\s*\1\s*$", line)
        if m:
            khoi.append({"k": "h", "cap": len(m.group(1)) - 1, "t": m.group(2)})
        elif line and line not in ("----",):
            line = re.sub(r"^[*#:;]+\s*", "", line).strip()
            for phan in line.split("\n"):
                phan = phan.strip()
                if phan:
                    khoi.append({"k": "p", "t": phan, "tho": tho, "pb": None})
        if tho_ket:
            tho = False
    return khoi


def trich_wikisource(van_ban: str) -> list[dict]:
    d = json.loads(van_ban)
    trang = d.get("trang") or {}
    ten_trang = list(trang)
    kq = []
    for i, ten in enumerate(ten_trang, 1):
        wt = trang[ten] or ""
        # Trang gốc có trang con: chỉ là mục lục. Trang "全覽" chỉ nhúng lại các trang con.
        co_con = any(t.startswith(ten + "/") for t in ten_trang if t != ten)
        if co_con or ten.endswith("全覽") or ten.endswith("全览"):
            khoi = []
        else:
            khoi = _wikitext_sang_khoi(wt)
        kq.append({"trang": i, "ten": ten, "tho": wt, "khoi": khoi})
    return kq


def van_ban_sach(khoi: list[dict]) -> str:
    """Bản đọc được của các khối, ghi vào rag_van_ban.vanBanSach."""
    ra = []
    for k in khoi:
        if k["k"] == "h":
            ra.append("#" * k["cap"] + " " + k["t"])
        elif k["k"] == "p":
            ra.append(k["t"])
        else:
            ra.append("[bảng]\n" + "\n".join(k["dong"]) + "\n[/bảng]")
    return "\n".join(ra)


def trich_tep(duong_dan: Path, kieu: str, ten_sach: str) -> list[dict]:
    van_ban = duong_dan.read_text(encoding="utf-8", errors="replace")
    if kieu == "JSON":
        return trich_wikisource(van_ban)
    return trich_kanripo(van_ban, ten_sach)
