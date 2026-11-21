# Tóm tắt tat-ca-tu-khoa.csv theo đầu ngữ (2 và 3 âm tiết đầu) để thiết kế sitemap. Đầu ra: tom-tat-tu-khoa.md
import csv, os, collections
D = os.path.dirname(os.path.abspath(__file__))
ds = list(csv.DictReader(open(os.path.join(D, 'tat-ca-tu-khoa.csv'), encoding='utf-8')))
vol = lambda r: int(r['luong_tim'] or 0)
out = ['# Tóm tắt bộ từ khóa (tự sinh từ tat-ca-tu-khoa.csv)', '',
       f'- Tổng: {len(ds)} từ khóa không trùng; {sum(1 for r in ds if vol(r))} có lượng tìm Keyword Planner; tổng lượng {sum(map(vol, ds)):,}/tháng.',
       '- Nguồn: KP = Keyword Planner (VN, 11/2025–10/2026, lượng theo khoảng của Google), AC = autocomplete của 65 hạt, GG = gợi ý Google.',
       '- Lưu ý: lượng tìm KP là mức làm tròn (10, 50, 500, 5.000, 50.000…); từ khóa AC/GG không có lượng.', '']
for n in (2, 3):
    g = collections.defaultdict(lambda: [0, 0, []])
    for r in ds:
        t = r['tu_khoa'].split()
        if len(t) < n: k = r['tu_khoa']
        else: k = ' '.join(t[:n])
        x = g[k]; x[0] += vol(r); x[1] += 1; x[2].append(r)
    top = sorted(g.items(), key=lambda kv: (-kv[1][0], -kv[1][1]))[:250 if n == 2 else 200]
    out += [f'## Đầu ngữ {n} âm tiết (xếp theo tổng lượng tìm)', '', '| đầu ngữ | tổng lượng | số từ khóa | ví dụ (lượng) |', '|---|---:|---:|---|']
    for k, (v, c, rs) in top:
        vd = '; '.join(f"{r['tu_khoa']} ({r['luong_tim'] or '-'})" for r in sorted(rs, key=lambda r: -vol(r))[:6])
        out.append(f'| {k} | {v:,} | {c} | {vd} |')
    out.append('')
out += ['## 500 từ khóa lượng tìm cao nhất', '', '| từ khóa | lượng | cạnh tranh | tháng cao nhất |', '|---|---:|---|---|']
for r in sorted(ds, key=lambda r: -vol(r))[:500]:
    out.append(f"| {r['tu_khoa']} | {r['luong_tim']} | {r['canh_tranh']} | {r['thang_cao_nhat']} |")
open(os.path.join(D, 'tom-tat-tu-khoa.md'), 'w', encoding='utf-8').write('\n'.join(out))
print(len(out), 'dòng')
