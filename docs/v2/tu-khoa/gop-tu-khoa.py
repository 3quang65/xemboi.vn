# Gộp toàn bộ từ khóa (Keyword Planner + autocomplete + gợi ý Google) thành một tệp sạch, không trùng.
# Đầu ra: docs/v2/tu-khoa/tat-ca-tu-khoa.csv (tu_khoa, luong_tim, canh_tranh, mua_cao_nhat, nguon)
import csv, glob, json, os, re, unicodedata

D = os.path.dirname(os.path.abspath(__file__))
kq = {}

def chuan(k):
    k = unicodedata.normalize('NFC', k).strip().lower()
    return re.sub(r'\s+', ' ', k)

def them(k, nguon, vol=None, ct='', mua=''):
    k = chuan(k)
    if not k or len(k) > 120: return
    r = kq.setdefault(k, {'tu_khoa': k, 'luong_tim': '', 'canh_tranh': '', 'thang_cao_nhat': '', 'nguon': set()})
    r['nguon'].add(nguon)
    if vol is not None and (r['luong_tim'] == '' or vol > r['luong_tim']):
        r['luong_tim'], r['canh_tranh'], r['thang_cao_nhat'] = vol, ct, mua

for p in sorted(glob.glob(os.path.join(D, 'keyword-planner-*.csv'))):
    dong = open(p, encoding='utf-8').read().splitlines()
    i = next(n for n, l in enumerate(dong) if l.startswith('Keyword\t'))
    hd = dong[i].split('\t')
    thang = [n for n, h in enumerate(hd) if h.startswith('Searches: ')]
    for l in dong[i + 1:]:
        c = l.split('\t')
        if len(c) < 5 or not c[0]: continue
        try: vol = int(float(c[3])) if c[3] else 0
        except ValueError: vol = 0
        ms = [(int(float(c[n])) if n < len(c) and c[n] else 0, hd[n][10:]) for n in thang]
        mua = max(ms)[1] if ms and max(ms)[0] > 0 else ''
        them(c[0], 'KP', vol, c[6] if len(c) > 6 else '', mua)

for p in sorted(glob.glob(os.path.join(D, 'tu-khoa-*.csv'))):
    for l in open(p, encoding='utf-8'):
        them(l.split(',')[0] if l.count(',') and not l.strip().startswith('"') else l.strip().strip('"'), 'AC')

g = json.load(open(os.path.join(D, 'goi-y-google.json'), encoding='utf-8'))
def duyet(x):
    if isinstance(x, str): them(x, 'GG')
    elif isinstance(x, list): [duyet(y) for y in x]
    elif isinstance(x, dict): [duyet(y) for y in x.values()]
duyet(g.get('hat', {}))

ds = sorted(kq.values(), key=lambda r: (-(r['luong_tim'] or 0), r['tu_khoa']))
with open(os.path.join(D, 'tat-ca-tu-khoa.csv'), 'w', encoding='utf-8', newline='') as f:
    w = csv.writer(f); w.writerow(['tu_khoa', 'luong_tim', 'canh_tranh', 'thang_cao_nhat', 'nguon'])
    for r in ds: w.writerow([r['tu_khoa'], r['luong_tim'], r['canh_tranh'], r['thang_cao_nhat'], '+'.join(sorted(r['nguon']))])
co_vol = [r for r in ds if r['luong_tim']]
print(len(ds), 'từ khóa;', len(co_vol), 'có lượng tìm; tổng lượng', sum(r['luong_tim'] for r in co_vol))
print('top 15:', [(r['tu_khoa'], r['luong_tim']) for r in ds[:15]])
