"""Kết nối Postgres cho pipeline RAG máy trạm.

Đọc DATABASE_URL từ biến môi trường, nếu không có thì từ tệp .env ở gốc repo.
Không bao giờ in mật khẩu: mọi chỗ cần hiện chuỗi kết nối đều đi qua `an_mat_khau`.
"""
from __future__ import annotations

import os
import re
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

import psycopg

GOC_REPO = Path(__file__).resolve().parents[2]


def _doc_env(duong_dan: Path) -> dict[str, str]:
    kq: dict[str, str] = {}
    if not duong_dan.is_file():
        return kq
    for dong in duong_dan.read_text(encoding="utf-8").splitlines():
        m = re.match(r'\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$', dong)
        if not m or dong.lstrip().startswith("#"):
            continue
        gia_tri = m.group(2).strip()
        if len(gia_tri) >= 2 and gia_tri[0] == gia_tri[-1] and gia_tri[0] in "\"'":
            gia_tri = gia_tri[1:-1]
        kq[m.group(1)] = gia_tri
    return kq


def chuoi_ket_noi() -> str:
    url = os.environ.get("DATABASE_URL") or _doc_env(GOC_REPO / ".env").get("DATABASE_URL")
    if not url:
        raise SystemExit("Thiếu DATABASE_URL (biến môi trường hoặc .env ở gốc repo).")
    # Prisma thêm ?schema=public, libpq không hiểu tham số này.
    p = urlsplit(url)
    q = [(k, v) for k, v in parse_qsl(p.query) if k != "schema"]
    return urlunsplit((p.scheme, p.netloc, p.path, urlencode(q), p.fragment))


def an_mat_khau(url: str) -> str:
    return re.sub(r"(://[^:/@]+:)[^@]*@", r"\1***@", url)


def ket_noi(autocommit: bool = False) -> psycopg.Connection:
    return psycopg.connect(chuoi_ket_noi(), autocommit=autocommit, application_name="rag-may-tram")


def vector_sql(v) -> str:
    """numpy 1 chiều → chuỗi '[x,y,...]' để ép kiểu ::vector."""
    return "[" + ",".join(f"{float(x):.6f}" for x in v) + "]"
