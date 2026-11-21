#!/usr/bin/env python3
"""Kiểm mo-rong.json: gọi lại e.chart từ input, so với kyVong; kiểm trường và trùng khóa.
Dùng: python3 -I kiem-mo-rong.py <engine.py | thư mục chứa tuvi-ref-engine.py> <mo-rong.json>
Thoát 0 nếu 0 lệch/0 lỗi, 1 nếu có lệch. Không ghi tệp."""
import importlib.util as u, json, os, sys

TRUONG = ['lunar', 'canChi', 'menh', 'than', 'cuc', 'tuHoa', 'chinhTinh']
TRU = ['nam', 'thang', 'ngay', 'gio']
INP = ['ngay', 'thang', 'nam', 'gio', 'phut', 'gioiTinh']

def nap(p):
    if os.path.isdir(p): p = os.path.join(p, 'tuvi-ref-engine.py')
    s = u.spec_from_file_location('e', p); e = u.module_from_spec(s); s.loader.exec_module(e); return e

def main():
    if len(sys.argv) < 3: sys.exit(__doc__)
    e = nap(sys.argv[1])
    try: ds = json.load(open(sys.argv[2], encoding='utf-8'))
    except Exception as x: sys.exit(f'JSON KHONG HOP LE: {x}')
    khop, loi, khoa, ids = 0, [], {}, {}
    trung = 0
    for c in ds:
        i = c.get('id', '?'); sai = []
        if i in ids: trung += 1; sai.append('trùng id')
        ids[i] = 1
        inp = c.get('input', {})
        for k in INP:
            if inp.get(k) is None: sai.append(f'thiếu input.{k}')
        kv = c.get('kyVong', {})
        for k in TRUONG:
            if k not in kv: sai.append(f'thiếu kyVong.{k}')
        for t in TRU:
            if not kv.get('canChi', {}).get(t): sai.append(f'thiếu canChi.{t}')
        for k in ('ngay', 'thang', 'nam', 'nhuan'):
            if k not in kv.get('lunar', {}): sai.append(f'thiếu lunar.{k}')
        k = tuple(inp.get(x) for x in INP)
        if k in khoa: trung += 1; sai.append(f'trùng khóa với {khoa[k]}')
        khoa[k] = i
        if not sai:
            try:
                r = e.chart(inp['nam'], inp['thang'], inp['ngay'], inp['gio'], inp['phut'], inp['gioiTinh'])
                for f in TRUONG:
                    if r.get(f) != kv.get(f): sai.append(f'lệch {f}')
            except Exception as x: sai.append(f'engine lỗi: {x}')
        if sai: loi.append((i, sai))
        else: khop += 1
    print(f'mẫu {len(ds)}; JSON hợp lệ; trùng {trung}; khớp {khop}; lệch/lỗi {len(loi)}')
    for i, s in loi[:20]: print(' ', i, '; '.join(s))
    sys.exit(1 if loi else 0)
main()
