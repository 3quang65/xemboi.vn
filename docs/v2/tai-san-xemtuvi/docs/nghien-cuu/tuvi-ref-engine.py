# Reference implementation (independent) of the spec defaults, for cross-checking.
# Chi index: 0=Ty(Tý) .. 11=Hoi. Can index: 0=Giap .. 9=Quy.
import math, json, sys

CAN = ['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý']
CHI = ['Tý','Sửu','Dần','Mão','Thìn','Tỵ','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi']

# ---------------- Lunar calendar (Ho Ngoc Duc / Meeus), tz = 7 ----------------
def jd_from_date(d, m, y):
    a = (14 - m) // 12; yy = y + 4800 - a; mm = m + 12*a - 3
    jd = d + (153*mm + 2)//5 + 365*yy + yy//4 - yy//100 + yy//400 - 32045
    if jd < 2299161:
        jd = d + (153*mm + 2)//5 + 365*yy + yy//4 - 32083
    return jd

def jd_to_date(jd):
    if jd > 2299160:
        a = jd + 32044; b = (4*a + 3)//146097; c = a - (b*146097)//4
    else:
        b = 0; c = jd + 32082
    d = (4*c + 3)//1461; e = c - (1461*d)//4; m = (5*e + 2)//153
    return (e - (153*m + 2)//5 + 1, m + 3 - 12*(m//10), b*100 + d - 4800 + m//10)

def new_moon(k):
    T = k/1236.85; T2 = T*T; T3 = T2*T; dr = math.pi/180
    jd1 = 2415020.75933 + 29.53058868*k + 0.0001178*T2 - 0.000000155*T3
    jd1 += 0.00033*math.sin((166.56 + 132.87*T - 0.009173*T2)*dr)
    M = 359.2242 + 29.10535608*k - 0.0000333*T2 - 0.00000347*T3
    Mpr = 306.0253 + 385.81691806*k + 0.0107306*T2 + 0.00001236*T3
    F = 21.2964 + 390.67050646*k - 0.0016528*T2 - 0.00000239*T3
    C1 = (0.1734 - 0.000393*T)*math.sin(M*dr) + 0.0021*math.sin(2*dr*M)
    C1 += -0.4068*math.sin(Mpr*dr) + 0.0161*math.sin(dr*2*Mpr) - 0.0004*math.sin(dr*3*Mpr)
    C1 += 0.0104*math.sin(dr*2*F) - 0.0051*math.sin(dr*(M+Mpr))
    C1 += -0.0074*math.sin(dr*(M-Mpr)) + 0.0004*math.sin(dr*(2*F+M))
    C1 += -0.0004*math.sin(dr*(2*F-M)) - 0.0006*math.sin(dr*(2*F+Mpr))
    C1 += 0.0010*math.sin(dr*(2*F-Mpr)) + 0.0005*math.sin(dr*(2*Mpr+M))
    if T < -11:
        dt = 0.001 + 0.000839*T + 0.0002261*T2 - 0.00000845*T3 - 0.000000081*T*T3
    else:
        dt = -0.000278 + 0.000265*T + 0.000262*T2
    return jd1 + C1 - dt

def sun_long(jdn):
    T = (jdn - 2451545.0)/36525; T2 = T*T; dr = math.pi/180
    M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2
    L0 = 280.46645 + 36000.76983*T + 0.0003032*T2
    DL = (1.914600 - 0.004817*T - 0.000014*T2)*math.sin(dr*M)
    DL += (0.019993 - 0.000101*T)*math.sin(dr*2*M) + 0.000290*math.sin(dr*3*M)
    L = (L0 + DL)*dr
    return L - 2*math.pi*math.floor(L/(2*math.pi))

TZ = 7
TG_RULE = 'double'
def nm_day(k): return math.floor(new_moon(k) + 0.5 + TZ/24)
def sun_sector(jdn): return math.floor(sun_long(jdn - 0.5 - TZ/24)/math.pi*6)
def month11(y):
    off = jd_from_date(31, 12, y) - 2415021
    k = math.floor(off/29.530588853)
    nm = nm_day(k)
    if sun_sector(nm) >= 9: nm = nm_day(k-1)
    return nm
def leap_offset(a11):
    k = math.floor((a11 - 2415021.076998695)/29.530588853 + 0.5)
    i = 1; arc = sun_sector(nm_day(k+i))
    while True:
        last = arc; i += 1; arc = sun_sector(nm_day(k+i))
        if arc == last or i >= 14: break
    return i - 1

def solar2lunar(d, m, y):
    dn = jd_from_date(d, m, y)
    k = math.floor((dn - 2415021.076998695)/29.530588853)
    ms = nm_day(k+1)
    if ms > dn: ms = nm_day(k)
    a11 = month11(y); b11 = a11
    if a11 >= ms:
        ly = y; a11 = month11(y-1)
    else:
        ly = y+1; b11 = month11(y+1)
    ld = dn - ms + 1
    diff = (ms - a11)//29
    leap = False; lm = diff + 11
    if b11 - a11 > 365:
        ld_ = leap_offset(a11)
        if diff >= ld_:
            lm = diff + 10
            if diff == ld_: leap = True
    if lm > 12: lm -= 12
    if lm >= 11 and diff < 4: ly -= 1
    return ld, lm, ly, leap

def month_len(d, m, y):
    """length of the lunar month containing solar date d/m/y"""
    dn = jd_from_date(d, m, y)
    k = math.floor((dn - 2415021.076998695)/29.530588853)
    ms = nm_day(k+1)
    if ms > dn: ms = nm_day(k); k -= 1
    else: pass
    # next new moon after ms
    kk = k
    while nm_day(kk) <= ms: kk += 1
    return nm_day(kk) - ms

# ---------------- Nap am ----------------
NAP_AM = ['Hải Trung Kim','Lô Trung Hỏa','Đại Lâm Mộc','Lộ Bàng Thổ','Kiếm Phong Kim','Sơn Đầu Hỏa',
 'Giản Hạ Thủy','Thành Đầu Thổ','Bạch Lạp Kim','Dương Liễu Mộc','Tuyền Trung Thủy','Ốc Thượng Thổ',
 'Tích Lịch Hỏa','Tùng Bách Mộc','Trường Lưu Thủy','Sa Trung Kim','Sơn Hạ Hỏa','Bình Địa Mộc',
 'Bích Thượng Thổ','Kim Bạch Kim','Phú Đăng Hỏa','Thiên Hà Thủy','Đại Trạch Thổ','Thoa Xuyến Kim',
 'Tang Đố Mộc','Đại Khê Thủy','Sa Trung Thổ','Thiên Thượng Hỏa','Thạch Lựu Mộc','Đại Hải Thủy']
def jiazi(can, chi):
    for n in range(60):
        if n % 10 == can and n % 12 == chi: return n
    raise ValueError('invalid can-chi')
def nap_am(can, chi): return NAP_AM[jiazi(can, chi)//2]
CUC = {'Thủy': 2, 'Mộc': 3, 'Kim': 4, 'Thổ': 5, 'Hỏa': 6}
CUC_TEN = {2: 'Thủy Nhị Cục', 3: 'Mộc Tam Cục', 4: 'Kim Tứ Cục', 5: 'Thổ Ngũ Cục', 6: 'Hỏa Lục Cục'}

def m12(x): return x % 12

def hour_branch(h, mi=0):
    return ((h + 1) % 24)//2

def chart(y, m, d, h, mi, gender, late_ty='next_day', leap_rule='same', tz_rule='hist'):
    """gender 'nam'/'nu'. late_ty: 'next_day' (23h-24h => next lunar day) or 'same_day'.
    leap_rule: 'same' (leap month treated as the month itself), 'split15', 'next'."""
    hb = hour_branch(h, mi)
    sd, sm, sy = d, m, y
    if late_ty == 'next_day' and h == 23:
        sd, sm, sy = jd_to_date(jd_from_date(d, m, y) + 1)
    global TZ
    TZ = 8 if (tz_rule == 'hist' and jd_from_date(sd, sm, sy) < jd_from_date(1, 1, 1968)) else 7
    ld, lm, ly, leap = solar2lunar(sd, sm, sy)
    TZ = 7
    mm = lm
    if leap and leap_rule == 'next': mm = lm % 12 + 1
    if leap and leap_rule == 'split15' and ld > 15: mm = lm % 12 + 1
    can_y = (ly + 6) % 10; chi_y = (ly + 8) % 12
    duong = can_y % 2 == 0
    nam = gender == 'nam'
    thuan = (duong and nam) or ((not duong) and (not nam))
    dirn = 1 if thuan else -1
    jd = jd_from_date(sd, sm, sy)
    can_d = (jd + 9) % 10; chi_d = (jd + 1) % 12
    can_h = ((can_d % 5)*2 + hb) % 10
    # Can chi thang (ngu ho don, dac ta 2.1): can thang Gieng = (C mod 5)*2 + 2, thang lm cong (lm - 1).
    # Thang nhuan dung can chi cua thang chinh (lm), khong theo leap_rule; leap_rule chi doi M de an sao.
    can_m = ((can_y % 5)*2 + 2 + (lm - 1)) % 10
    # Menh / Than
    menh = m12(2 + (mm - 1) - hb)
    than = m12(2 + (mm - 1) + hb)
    # palace stems (ngu ho don): stem of Dan
    can_dan = ((can_y % 5)*2 + 2) % 10
    def can_cung(c): return (can_dan + m12(c - 2)) % 10
    na_menh = nap_am(can_cung(menh), menh)
    cuc = CUC[na_menh.split()[-1]]
    # Tu Vi
    k = 0
    while (ld + k) % cuc != 0: k += 1
    q = (ld + k)//cuc
    tv = m12(2 + q - 1 + (-k if k % 2 else k))
    tp = m12(4 - tv)
    S = {}
    S['Tử Vi'] = tv; S['Thiên Cơ'] = m12(tv-1); S['Thái Dương'] = m12(tv-3); S['Vũ Khúc'] = m12(tv-4)
    S['Thiên Đồng'] = m12(tv-5); S['Liêm Trinh'] = m12(tv+4)
    S['Thiên Phủ'] = tp; S['Thái Âm'] = m12(tp+1); S['Tham Lang'] = m12(tp+2); S['Cự Môn'] = m12(tp+3)
    S['Thiên Tướng'] = m12(tp+4); S['Thiên Lương'] = m12(tp+5); S['Thất Sát'] = m12(tp+6); S['Phá Quân'] = m12(tp+10)
    main = dict(S)
    # Loc Ton ring
    LT = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0][can_y]
    S['Lộc Tồn'] = LT; S['Kình Dương'] = m12(LT+1); S['Đà La'] = m12(LT-1)
    for i, n in enumerate(['Bác Sĩ','Lực Sĩ','Thanh Long','Tiểu Hao','Tướng Quân','Tấu Thư','Phi Liêm','Hỷ Thần','Bệnh Phù','Đại Hao','Phục Binh','Quan Phủ']):
        S[n] = m12(LT + dirn*i)
    # Thai Tue ring
    for i, n in enumerate(['Thái Tuế','Thiếu Dương','Tang Môn','Thiếu Âm','Quan Phù','Tử Phù','Tuế Phá','Long Đức','Bạch Hổ','Phúc Đức','Điếu Khách','Trực Phù']):
        S[n] = m12(chi_y + i)
    S['Thiên Không'] = m12(chi_y + 1)
    # Trang sinh
    ts0 = {2: 8, 5: 8, 3: 11, 4: 5, 6: 2}[cuc]
    TS = {}
    for i, n in enumerate(['Tràng Sinh','Mộc Dục','Quan Đới','Lâm Quan','Đế Vượng','Suy','Bệnh','Tử','Mộ','Tuyệt','Thai','Dưỡng']):
        TS[n] = m12(ts0 + dirn*i)
    # month stars
    S['Tả Phù'] = m12(4 + mm - 1); S['Hữu Bật'] = m12(10 - (mm - 1))
    S['Thiên Hình'] = m12(9 + mm - 1); S['Thiên Riêu'] = m12(1 + mm - 1); S['Thiên Y'] = S['Thiên Riêu']
    S['Thiên Giải'] = m12(8 + (mm - 1)) if TG_RULE=='simple' else m12(8 + 2*(mm - 1))
    S['Địa Giải'] = m12(7 + mm - 1)
    S['Thiên Nguyệt'] = [10, 5, 4, 2, 7, 3, 11, 7, 2, 6, 10, 2][mm-1]
    S['Thiên Vu'] = [5, 8, 2, 11][(mm-1) % 4]
    S['Âm Sát'] = [2, 0, 10, 8, 6, 4][(mm-1) % 6]
    # hour stars
    S['Văn Khúc'] = m12(4 + hb); S['Văn Xương'] = m12(10 - hb)
    S['Địa Kiếp'] = m12(11 + hb); S['Địa Không'] = m12(11 - hb)
    S['Thai Phụ'] = m12(6 + hb); S['Phong Cáo'] = m12(2 + hb)
    # day stars
    S['Tam Thai'] = m12(S['Tả Phù'] + ld - 1); S['Bát Tọa'] = m12(S['Hữu Bật'] - (ld - 1))
    S['Ân Quang'] = m12(S['Văn Xương'] + ld - 2); S['Thiên Quý'] = m12(S['Văn Khúc'] - (ld - 2))
    # year-stem stars
    KHOI = [1, 0, 11, 11, 1, 0, 1, 6, 3, 3][can_y]     # spec default Toan Thu / Thai Thu Lang
    VIET = [7, 8, 9, 9, 7, 8, 7, 2, 5, 5][can_y]
    S['Thiên Khôi'] = KHOI; S['Thiên Việt'] = VIET
    S['Thiên Quan'] = [7, 4, 5, 2, 3, 9, 11, 9, 10, 6][can_y]
    S['Thiên Phúc'] = [9, 8, 0, 11, 3, 2, 6, 5, 6, 5][can_y]
    S['Văn Tinh'] = m12(LT + 3); S['Đường Phù'] = m12(LT + 5); S['Quốc Ấn'] = m12(LT + 8)
    S['Lưu Hà'] = [9, 10, 7, 8, 5, 6, 4, 3, 11, 2][can_y]   # default: Dinh=Than, Canh=Thin (repo: Dinh=Thin, Canh=Than)
    S['Thiên Trù'] = [5, 6, 0, 5, 6, 8, 2, 6, 9, 10][can_y]   # VN: Quy = Tuat (iztro: Hoi)
    # year-branch stars
    S['Long Trì'] = m12(4 + chi_y); S['Phượng Các'] = m12(10 - chi_y); S['Giải Thần'] = S['Phượng Các']
    S['Thiên Khốc'] = m12(6 - chi_y); S['Thiên Hư'] = m12(6 + chi_y)
    S['Hồng Loan'] = m12(3 - chi_y); S['Thiên Hỷ'] = m12(9 - chi_y)
    S['Thiên Đức'] = m12(9 + chi_y); S['Nguyệt Đức'] = m12(5 + chi_y)
    S['Thiên Tài'] = m12(menh + chi_y); S['Thiên Thọ'] = m12(than + chi_y)
    grp = chi_y % 4   # 0: Than Ty Thin, 1: Ty Dau Suu (Suu=1,Ty=5,Dau=9), 2: Dan Ngo Tuat, 3: Hoi Mao Mui
    S['Thiên Mã'] = {0: 2, 1: 11, 2: 8, 3: 5}[grp]
    S['Hoa Cái'] = {0: 4, 1: 1, 2: 10, 3: 7}[grp]
    S['Kiếp Sát'] = {0: 5, 1: 2, 2: 11, 3: 8}[grp]
    S['Đào Hoa'] = {0: 9, 1: 6, 2: 3, 3: 0}[grp]
    S['Cô Thần'] = [2, 2, 5, 5, 5, 8, 8, 8, 11, 11, 11, 2][chi_y]
    S['Quả Tú'] = m12(S['Cô Thần'] - 4)
    S['Phá Toái'] = [5, 1, 9][chi_y % 3]           # Ty Ngo Mao Dau -> Ty(5); Dan Than Ty Hoi -> Dau; Thin Tuat Suu Mui -> Suu
    # Hoa / Linh (VN: direction by am duong)
    if chi_y in (2, 6, 10): hs, ls = 1, 3
    elif chi_y in (8, 0, 4): hs, ls = 2, 10
    elif chi_y in (5, 9, 1): hs, ls = 3, 10
    else: hs, ls = 9, 10
    if thuan:
        S['Hỏa Tinh'] = m12(hs + hb); S['Linh Tinh'] = m12(ls - hb)
    else:
        S['Hỏa Tinh'] = m12(hs - hb); S['Linh Tinh'] = m12(ls + hb)
    S['Thiên La'] = 4; S['Địa Võng'] = 10
    S['Thiên Thương'] = m12(menh + 5); S['Thiên Sứ'] = m12(menh + 7)
    S['Đẩu Quân'] = m12(chi_y - (mm - 1) + hb)
    # Tu hoa (VN default)
    TH = [['Liêm Trinh','Phá Quân','Vũ Khúc','Thái Dương'], ['Thiên Cơ','Thiên Lương','Tử Vi','Thái Âm'],
          ['Thiên Đồng','Thiên Cơ','Văn Xương','Liêm Trinh'], ['Thái Âm','Thiên Đồng','Thiên Cơ','Cự Môn'],
          ['Tham Lang','Thái Âm','Hữu Bật','Thiên Cơ'], ['Vũ Khúc','Tham Lang','Thiên Lương','Văn Khúc'],
          ['Thái Dương','Vũ Khúc','Thiên Đồng','Thái Âm'], ['Cự Môn','Thái Dương','Văn Khúc','Văn Xương'],
          ['Thiên Lương','Tử Vi','Thiên Phủ','Vũ Khúc'], ['Phá Quân','Cự Môn','Thái Âm','Tham Lang']][can_y]
    hoa = dict(zip(['Hóa Lộc','Hóa Quyền','Hóa Khoa','Hóa Kỵ'], TH))
    for kname, star in hoa.items(): S[kname] = S[star]
    # Tuan / Triet
    head = m12(chi_y - can_y)   # chi of the Giap day starting the decade
    tuan = [m12(head + 10), m12(head + 11)]
    triet = [[8, 9], [6, 7], [4, 5], [2, 3], [0, 1]][can_y % 5]
    # Dai han
    dh = {}
    for i in range(12):
        dh[m12(menh + dirn*i)] = cuc + 10*i
    # tieu han
    start = {2: 4, 6: 4, 10: 4, 8: 10, 0: 10, 4: 10, 5: 7, 9: 7, 1: 7, 11: 1, 3: 1, 7: 1}[chi_y]
    tdir = 1 if nam else -1
    tieu = {}
    for i in range(12):
        tieu[m12(start + tdir*i)] = CHI[m12(chi_y + i)]
    MENH_CHU = ['Tham Lang','Cự Môn','Lộc Tồn','Văn Khúc','Liêm Trinh','Vũ Khúc','Phá Quân','Vũ Khúc','Liêm Trinh','Văn Khúc','Lộc Tồn','Cự Môn']
    THAN_CHU = ['Linh Tinh','Thiên Tướng','Thiên Lương','Thiên Đồng','Văn Xương','Thiên Cơ','Hỏa Tinh','Thiên Tướng','Thiên Lương','Thiên Đồng','Văn Xương','Thiên Cơ']
    PALACES = ['Mệnh','Phụ Mẫu','Phúc Đức','Điền Trạch','Quan Lộc','Nô Bộc','Thiên Di','Tật Ách','Tài Bạch','Tử Tức','Phu Thê','Huynh Đệ']
    cung = {CHI[m12(menh + i)]: PALACES[i] for i in range(12)}
    out = {
        'lunar': {'ngay': ld, 'thang': lm, 'nam': ly, 'nhuan': leap},
        'canChi': {'nam': CAN[can_y]+' '+CHI[chi_y], 'thang': CAN[can_m]+' '+CHI[(lm+1) % 12],
                   'ngay': CAN[can_d]+' '+CHI[chi_d], 'gio': CAN[can_h]+' '+CHI[hb]},
        'amDuong': ('Dương' if duong else 'Âm') + (' Nam' if nam else ' Nữ'),
        'napAmNam': nap_am(can_y, chi_y),
        'menh': CHI[menh], 'than': CHI[than], 'thanCu': cung[CHI[than]],
        'cuc': CUC_TEN[cuc], 'napAmMenhCung': na_menh, 'canCungMenh': CAN[can_cung(menh)],
        'chinhTinh': {k: CHI[v] for k, v in main.items()},
        'sao': {k: CHI[v] for k, v in S.items()},
        'trangSinh': {k: CHI[v] for k, v in TS.items()},
        'tuHoa': hoa,
        'tuan': [CHI[x] for x in tuan], 'triet': [CHI[x] for x in triet],
        'daiHan': {CHI[k]: v for k, v in dh.items()},
        'tieuHan': {CHI[k]: v for k, v in tieu.items()},
        'cung': cung,
        'menhChu_theoChiNam': MENH_CHU[chi_y], 'menhChu_theoCungMenh': MENH_CHU[menh],
        'thanChu': THAN_CHU[chi_y],
    }
    return out

def luu_nien(year_lunar, menh_chi=None):
    c = (year_lunar + 6) % 10; y = (year_lunar + 8) % 12
    LT = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0][c]
    out = {'L.Thái Tuế': y, 'L.Tang Môn': m12(y+2), 'L.Bạch Hổ': m12(y+8), 'L.Thiên Khốc': m12(6-y), 'L.Thiên Hư': m12(6+y),
           'L.Lộc Tồn': LT, 'L.Kình Dương': m12(LT+1), 'L.Đà La': m12(LT-1),
           'L.Thiên Mã': {0: 2, 1: 11, 2: 8, 3: 5}[y % 4],
           'L.Thiên Khôi': [1, 0, 11, 11, 1, 0, 1, 6, 3, 3][c], 'L.Thiên Việt': [7, 8, 9, 9, 7, 8, 7, 2, 5, 5][c],
           'L.Văn Xương': m12(LT+3), 'L.Văn Khúc': [9, 8, 6, 5, 6, 5, 3, 2, 0, 11][c],
           'L.Hồng Loan': m12(3-y), 'L.Thiên Hỷ': m12(9-y)}
    return {k: CHI[v] for k, v in out.items()}

if __name__ == '__main__':
    a = sys.argv[1:]
    print(json.dumps(chart(int(a[0]), int(a[1]), int(a[2]), int(a[3]), int(a[4]), a[5],
                           *(a[6:])), ensure_ascii=False, indent=1))
