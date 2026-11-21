#!/usr/bin/env python3
"""Sinh 20 mẫu mới MR-M01…MR-M20 bằng engine tham chiếu, không trùng mẫu cũ.
Dùng: sinh-them-20.py <engine.py | thư mục chứa tuvi-ref-engine.py> <mo-rong.json> [tệp-ra]
Tệp ra mặc định: $OFFICE_TRAO_DOI/mau-moi-20.json (không ghi vào mo-rong.json).
Hạt giống cố định → chạy lại ra cùng kết quả."""
import importlib.util as u, json, os, random, sys

SEED = 20261109
CUC = ['Thủy Nhị Cục', 'Mộc Tam Cục', 'Kim Tứ Cục', 'Thổ Ngũ Cục', 'Hỏa Lục Cục']
# (giới, chỉ số cục, đặc biệt). 5 cục × (2 nam + 2 nữ) = 20; 10 nam / 10 nữ.
SLOTS = [('nam', 0, 'nhuan'), ('nam', 0, ''), ('nu', 0, ''), ('nu', 0, ''),
         ('nam', 1, 'tymuon'), ('nam', 1, ''), ('nu', 1, ''), ('nu', 1, ''),
         ('nam', 2, 'truoc1968'), ('nam', 2, ''), ('nu', 2, 'nhuan'), ('nu', 2, ''),
         ('nam', 3, ''), ('nam', 3, ''), ('nu', 3, 'tymuon'), ('nu', 3, ''),
         ('nam', 4, ''), ('nam', 4, ''), ('nu', 4, 'truoc1968'), ('nu', 4, '')]

def nap_engine(p):
    if os.path.isdir(p):
        p = os.path.join(p, 'tuvi-ref-engine.py')
    s = u.spec_from_file_location('e', p); e = u.module_from_spec(s); s.loader.exec_module(e)
    return e

def khoa_ngay(i):
    return (i['ngay'], i['thang'], i['nam'], i['gio'], i['phut'], i['gioiTinh'])

def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    e = nap_engine(sys.argv[1])
    cu = json.load(open(sys.argv[2]))
    out = sys.argv[3] if len(sys.argv) > 3 else os.path.join(
        os.environ.get('OFFICE_TRAO_DOI') or '.', 'mau-moi-20.json')
    khoa_cu = {khoa_ngay(c['input']) for c in cu}
    bo_cu = {(c['kyVong']['menh'], c['kyVong']['cuc'], c['input']['gioiTinh'], c['input']['nam']) for c in cu}
    rnd = random.Random(SEED); khoa_moi = set(); bo_moi = set(); kq = []
    for g, ic, sp in SLOTS:
        for _ in range(300000):
            y = rnd.randint(1950, 1967) if sp == 'truoc1968' else rnd.randint(1950, 2005)
            mo = rnd.randint(1, 12); d = rnd.randint(2, 27)
            h = 23 if sp == 'tymuon' else rnd.choice([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20])
            mi = 30 if sp == 'tymuon' else rnd.choice([0, 15, 30, 45])
            k = (d, mo, y, h, mi, g)
            if k in khoa_cu or k in khoa_moi:
                continue
            c = e.chart(y, mo, d, h, mi, g)
            if c['cuc'] != CUC[ic]:
                continue
            if bool(c['lunar']['nhuan']) != (sp == 'nhuan'):
                continue
            b = (c['menh'], c['cuc'], g, y)
            if b in bo_cu or b in bo_moi:
                continue
            khoa_moi.add(k); bo_moi.add(b); kq.append((g, y, mo, d, h, mi, sp, c)); break
        else:
            sys.exit(f'KHONG TIM {g} {CUC[ic]} {sp}')
    cases = []
    for i, (g, y, mo, d, h, mi, sp, c) in enumerate(kq, 1):
        ten = f"{'Nam' if g == 'nam' else 'Nữ'} {c['canChi']['nam']} {d:02d}/{mo:02d}/{y} {h:02d}:{mi:02d}"
        cs = {'id': f'MR-M{i:02d}', 'ten': ten,
              'input': {'lich': 'duong', 'muiGio': 'UTC+7 (giờ địa phương Việt Nam)', 'ngay': d, 'thang': mo,
                        'nam': y, 'gio': h, 'phut': mi, 'gioiTinh': g},
              'quyUoc': {'gioTyMuon': '23:00–23:59 tính sang ngày hôm sau', 'thangNhuan': 'an như tháng chính',
                         'muiGioLich': 'UTC+8 trước 01/01/1968, UTC+7 từ 01/01/1968',
                         'bangSao': 'mặc định của đặc tả (mục 10)'},
              'kyVong': c, 'nguon': 'tuvi-ref-engine.py (mặc định), sinh bởi nghien-cuu/mau/sinh-them-20.py',
              'dacBiet': sp or None}
        if sp == 'tymuon':
            v = e.chart(y, mo, d, h, mi, g, late_ty='same_day')
            cs['bienThe'] = [{'quyUoc': 'Giờ Tý muộn giữ ngày hiện tại', 'lunar': v['lunar'], 'menh': v['menh'], 'cuc': v['cuc']}]
        if sp == 'nhuan':
            cs['bienThe'] = []
            for r in ('split15', 'next'):
                v = e.chart(y, mo, d, h, mi, g, leap_rule=r)
                cs['bienThe'].append({'quyUoc': r, 'lunar': v['lunar'], 'menh': v['menh'], 'cuc': v['cuc']})
        cases.append(cs)
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    json.dump(cases, open(out, 'w'), ensure_ascii=False, indent=1)
    nam = sum(c['input']['gioiTinh'] == 'nam' for c in cases)
    print(f'{len(cases)} mẫu: nam {nam}, nữ {len(cases)-nam}; cục {len({c["kyVong"]["cuc"] for c in cases})}/5; '
          f'nhuận {sum(c["dacBiet"]=="nhuan" for c in cases)}; tý muộn {sum(c["dacBiet"]=="tymuon" for c in cases)}; '
          f'<1968 {sum(c["input"]["nam"]<1968 for c in cases)} -> {out}')

main()
