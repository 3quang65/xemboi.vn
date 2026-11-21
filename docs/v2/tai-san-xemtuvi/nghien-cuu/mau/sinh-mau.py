import importlib.util as u, json, random, sys
src=sys.argv[1]; out=sys.argv[2]
s=u.spec_from_file_location('e',src+'/tuvi-ref-engine.py');e=u.module_from_spec(s);s.loader.exec_module(e)
old=json.load(open(src+'/tuvi-test-cases.json'))['cases']
# (gioiTinh, menh mong muốn, cục mong muốn, ghi chú đặc biệt)
T=[('nam','Tỵ','Mộc Tam Cục',''),('nam','Thân','Kim Tứ Cục',''),('nam','Thìn','Hỏa Lục Cục',''),
   ('nam','Ngọ','Thủy Nhị Cục','tymuon'),('nam','Tuất','Thổ Ngũ Cục','truoc1968'),('nam','Dần','Kim Tứ Cục',''),
   ('nu','Ngọ','Kim Tứ Cục',''),('nu','Thân','Mộc Tam Cục',''),('nu','Tuất','Thủy Nhị Cục','nhuan'),
   ('nu','Tỵ','Thổ Ngũ Cục',''),('nu','Thìn','Hỏa Lục Cục',''),('nu','Dậu','Mộc Tam Cục','')]
rnd=random.Random(2026); used=set(); res=[]
for g,mn,cu,sp in T:
    for _ in range(200000):
        y=rnd.randint(1950,2005) if sp!='truoc1968' else rnd.randint(1950,1967)
        if y in used: continue
        mo=rnd.randint(1,12); d=rnd.randint(2,27)
        h=23 if sp=='tymuon' else rnd.choice([0,2,4,6,8,10,12,14,16,18,20])
        mi=rnd.choice([0,15,30,45]) if sp!='tymuon' else 30
        if mo==2 and d>28: continue
        c=e.chart(y,mo,d,h,mi,g)
        if c['menh']!=mn or c['cuc']!=cu: continue
        if sp=='nhuan' and not c['lunar']['nhuan']: continue
        if sp!='nhuan' and c['lunar']['nhuan']: continue
        used.add(y); res.append((g,y,mo,d,h,mi,sp,c)); break
    else: print('KHONG TIM',g,mn,cu,sp); sys.exit(2)
cases=[]
for i,(g,y,mo,d,h,mi,sp,c) in enumerate(res,1):
    ten=f"{'Nam' if g=='nam' else 'Nữ'} {c['canChi']['nam']} {d:02d}/{mo:02d}/{y} {h:02d}:{mi:02d}"
    cs={'id':f'MR{i:02d}','ten':ten,
     'input':{'lich':'duong','muiGio':'UTC+7 (giờ địa phương Việt Nam)','ngay':d,'thang':mo,'nam':y,'gio':h,'phut':mi,'gioiTinh':g},
     'quyUoc':{'gioTyMuon':'23:00–23:59 tính sang ngày hôm sau','thangNhuan':'an như tháng chính','muiGioLich':'UTC+8 trước 01/01/1968, UTC+7 từ 01/01/1968','bangSao':'mặc định của đặc tả (mục 10)'},
     'kyVong':c,'nguon':'tuvi-ref-engine.py (mặc định), sinh bởi nghien-cuu/mau/sinh-mau.py','dacBiet':sp or None}
    if sp=='tymuon':
        v=e.chart(y,mo,d,h,mi,g,late_ty='same_day'); cs['bienThe']=[{'quyUoc':'Giờ Tý muộn giữ ngày hiện tại','lunar':v['lunar'],'menh':v['menh'],'cuc':v['cuc']}]
    if sp=='nhuan':
        cs['bienThe']=[{'quyUoc':r,'lunar':(v:=e.chart(y,mo,d,h,mi,g,leap_rule=r))['lunar'],'menh':v['menh'],'cuc':v['cuc']} for r in('split15','next')]
    cases.append(cs)
json.dump(cases,open(out,'w'),ensure_ascii=False,indent=1)
# ma trận
CH=['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi']
CU=['Thủy Nhị Cục','Mộc Tam Cục','Kim Tứ Cục','Thổ Ngũ Cục','Hỏa Lục Cục']
rows=[(c['id'],c['input']['gioiTinh'],c['kyVong']['menh'],c['kyVong']['cuc'],'cũ') for c in old]+[(c['id'],c['input']['gioiTinh'],c['kyVong']['menh'],c['kyVong']['cuc'],'mới') for c in cases]
nam=sum(r[1]=='nam' for r in rows);nu=len(rows)-nam
L=['# Ma trận phủ bộ lá số mẫu (cũ 11 + mở rộng 12)','',f'Nguồn: `tuvi-test-cases.json` (TC01–TC11) + `mau/mo-rong.json` (MR01–MR12). Tổng {len(rows)} lá: nam {nam}, nữ {nu}.','']
L+=['## 1. Cung Mệnh × giới (số lá; nam/nữ)','','| Cung Mệnh | Nam | Nữ | Mã lá |','|---|---|---|---|']
for ch in CH:
    r=[x for x in rows if x[2]==ch]; L.append(f"| {ch} | {sum(x[1]=='nam' for x in r)} | {sum(x[1]=='nu' for x in r)} | {', '.join(x[0] for x in r)} |")
L+=['','Phủ đủ 12/12 cung Mệnh: '+('có' if all(any(x[2]==ch for x in rows) for ch in CH) else 'CHƯA'),'','## 2. Cục × giới','','| Cục | Nam | Nữ | Mã lá |','|---|---|---|---|']
for cu in CU:
    r=[x for x in rows if x[3]==cu]; L.append(f"| {cu} | {sum(x[1]=='nam' for x in r)} | {sum(x[1]=='nu' for x in r)} | {', '.join(x[0] for x in r)} |")
L+=['','Phủ đủ 5/5 cục: '+('có' if all(any(x[3]==cu for x in rows) for cu in CU) else 'CHƯA'),'','## 3. Cung Mệnh × cục (ô đã phủ ✔, ô còn thiếu ·)','','| Cung \\ Cục | '+' | '.join(CU)+' |','|---|'+'---|'*5]
miss=[]
for ch in CH:
    cells=[]
    for cu in CU:
        ok=any(x[2]==ch and x[3]==cu for x in rows); cells.append('✔' if ok else '·')
        if not ok: miss.append(f'{ch}/{cu}')
    L.append(f'| {ch} | '+' | '.join(cells)+' |')
L+=['',f'Đã phủ {60-len(miss)}/60 ô. Ô còn thiếu ({len(miss)}): '+'; '.join(miss)+'.','','Ghi chú: cung Mệnh và cục gắn với can năm nên một số ô có thể không bao giờ xảy ra; chưa kiểm ô nào bất khả (cần tra spec 3.2). Phủ 60 ô cần thêm lá, ngoài phạm vi việc này.','','## 4. Giới','']
L+=[f'- Nam {nam}, nữ {nu}, tổng {len(rows)}. Tiêu chí nghiệm thu (gộp 24 lá, mỗi giới ≥ 12) **chưa đạt**: bộ cũ chỉ có 11 lá (nam 6, nữ 5), lệnh test cố định 12 lá mới → tối đa 23 lá; một giới chỉ đạt 11. Cần quyết: thêm 1 lá (sửa test thành 13) hoặc đổi tiêu chí thành 23 lá.','','## 5. Lá đặc biệt','']
for c in cases:
    if c['dacBiet']: L.append(f"- {c['id']} ({c['ten']}): {c['dacBiet']}")
open(out.replace('mo-rong.json','ma-tran-phu.md'),'w').write('\n'.join(L)+'\n')
print(nam,nu,len(miss))
