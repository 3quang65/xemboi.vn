'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { R1_COPY } from '@/lib/r1/copy';
import { BAN_MAU_BIEN_TAP } from '@/lib/r1/ban-mau-bien-tap';
import { hienNut149k } from '@/lib/r1/metrics';
import { breadcrumb, trangDaDung } from '@/lib/trang/dieu-huong';
import type { HoaTen, LaSo, LuuNien, NguHanh } from '@/lib/tuvi-v2';
import type {
  KetQuaR1,
  NhanDinhMienPhi,
  NutGiaR1,
  R1EventName,
  UtmParams,
} from '@/lib/r1/types';
import { AnTieuDe, ChiaVach, HoaVanGoc4, HoaVanGocVang4, HoaVanMay, TrienXemBoi } from './HoaVanE3';
import { SvgSpriteE3, TranhDauTrangDai, TranhDauTrangNen } from './TranhDauTrang';
import LaSo12Cung from './LaSo12Cung';
import HopThoaiMua from './HopThoaiMua';

const CHI_GIO = [
  'Tý',
  'Sửu',
  'Dần',
  'Mão',
  'Thìn',
  'Tỵ',
  'Ngọ',
  'Mùi',
  'Thân',
  'Dậu',
  'Tuất',
  'Hợi',
] as const;

const MANG_SAP_CO = [
  'Lịch âm',
  'Xem tuổi',
  'Xem ngày',
  'Bát tự',
  'Kinh Dịch',
  'Thần số học',
  'Phong thủy',
  'Từ điển',
] as const;

const HANH_CLS: Record<NguHanh, string> = {
  Kim: 'r1e-c-k',
  Mộc: 'r1e-c-m',
  Thủy: 'r1e-c-t',
  Hỏa: 'r1e-c-h',
  Thổ: 'r1e-c-o',
};

const LUA_HOA_HANH: Record<HoaTen, NguHanh> = {
  'Hóa Lộc': 'Mộc',
  'Hóa Quyền': 'Hỏa',
  'Hóa Khoa': 'Kim',
  'Hóa Kỵ': 'Thủy',
};

const LA_MA = ['I', 'II', 'III', 'IV', 'V'] as const;

function layHoacTaoSessionId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let sid = window.sessionStorage.getItem('r1_sid');
    if (!sid) {
      sid = `r1_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      window.sessionStorage.setItem('r1_sid', sid);
    }
    return sid;
  } catch {
    return `r1_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

function docUtmTuUrl(): UtmParams {
  if (typeof window === 'undefined') {
    return { utmSource: '(trực tiếp)', utmMedium: '', utmCampaign: '' };
  }
  const sp = new URLSearchParams(window.location.search);
  return {
    utmSource: sp.get('utm_source')?.trim() || '(trực tiếp)',
    utmMedium: sp.get('utm_medium')?.trim() || '',
    utmCampaign: sp.get('utm_campaign')?.trim() || '',
  };
}

interface SaoDanChungChip {
  key: string;
  loai: 'cung' | 'sao';
  nhan: string;
  phu?: string;
  hanh?: NguHanh;
  dacTinh?: string | null;
  luu?: boolean;
}

function trichSaoDanChung(
  canCu: string,
  laSo: LaSo,
  luuNien2027: LuuNien,
): { chips: SaoDanChungChip[]; chis: number[] } {
  const chips: SaoDanChungChip[] = [];
  const seenKeys = new Set<string>();
  const chiSet = new Set<number>();

  const pushChip = (chip: SaoDanChungChip) => {
    if (seenKeys.has(chip.key)) return;
    seenKeys.add(chip.key);
    chips.push(chip);
  };

  // Tách nhãn căn cứ thành các đoạn để giữ đúng thứ tự cung / sao được nhắc
  const noiDung = canCu.replace(/^\[Căn cứ:\s*/i, '').replace(/\]$/, '');
  const doanList = noiDung
    .split(/[–—;,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  for (const doan of doanList) {
    // 1. Cung được nhắc tên (vd "Cung Nô Bộc (Mùi)" hoặc "Cung Phúc Đức")
    for (const c of laSo.cung) {
      if (
        doan.includes(`Cung ${c.ten}`) ||
        doan.includes(`(${c.tenChi})`) ||
        doan.includes(`Thân cư ${c.ten}`)
      ) {
        chiSet.add(c.chi);
        pushChip({
          key: `cung-${c.chi}`,
          loai: 'cung',
          nhan: c.ten,
          phu: c.tenChi,
        });
      }
    }

    // 2. Lưu Thái Tuế năm xem
    if (/Lưu Thái Tuế/i.test(doan)) {
      chiSet.add(luuNien2027.luuThaiTue);
      pushChip({
        key: 'luu-thai-tue',
        loai: 'sao',
        nhan: 'Thái Tuế',
        phu: `lưu ${luuNien2027.namXem}`,
        hanh: 'Hỏa',
        luu: true,
      });
    }

    // 3. Lưu Tứ Hóa năm xem
    for (const lh of luuNien2027.luuTuHoa) {
      if (doan.includes(`Lưu ${lh.hoa}`)) {
        chiSet.add(lh.chi);
        pushChip({
          key: `luu-hoa-${lh.hoa}`,
          loai: 'sao',
          nhan: lh.hoa,
          phu: `→ ${lh.sao}`,
          hanh: LUA_HOA_HANH[lh.hoa],
          luu: true,
        });
      }
    }

    // 4. Sao thật trong lá số được nhắc trong đoạn căn cứ
    if (!/Lưu\s+/i.test(doan)) {
      for (const c of laSo.cung) {
        const allStars = [...c.chinhTinh, ...c.catTinh, ...c.hungTinh];
        for (const s of allStars) {
          if (doan.includes(s.ten)) {
            pushChip({
              key: `sao-${c.chi}-${s.key}`,
              loai: 'sao',
              nhan: s.ten,
              hanh: s.hanh,
              dacTinh: s.dacTinh,
            });
          }
        }
      }
    }
  }

  return { chips, chis: Array.from(chiSet) };
}

function dinhDangGioHeader(dongHo: string): string {
  const parts = dongHo.split(':');
  if (parts.length !== 2) return dongHo;
  return `${parts[0]}:${parts[1]}`;
}

export default function TrangR1Client({
  fontClassName = '',
  trongKhungV2 = false,
}: {
  fontClassName?: string;
  trongKhungV2?: boolean;
}) {
  // Form state (không hỏi họ tên thật, không hỏi SĐT)
  const [lich, setLich] = useState<'duong' | 'am'>('duong');
  const [ngay, setNgay] = useState('15');
  const [thang, setThang] = useState('8');
  const [nam, setNam] = useState('1998');
  const [nhuan, setNhuan] = useState(false);
  const [gio, setGio] = useState('9');
  const [phut, setPhut] = useState('30');
  const [gioiTinh, setGioiTinh] = useState<'nu' | 'nam'>('nu');
  const [chuaRoGioSinh, setChuaRoGioSinh] = useState(false);
  const [dongYNgaySinh, setDongYNgaySinh] = useState(false);
  const [timHienThi, setTimHienThi] = useState('');

  const [dangTinh, setDangTinh] = useState(false);
  const [loiForm, setLoiForm] = useState('');
  const [ketQua, setKetQua] = useState<KetQuaR1 | null>(null);
  const [soiNhanDinhId, setSoiNhanDinhId] = useState<string | null>(null);
  const [soiChis, setSoiChis] = useState<number[]>([]);

  // Menu cuộn ngang ở mobile
  const menuListRef = useRef<HTMLUListElement | null>(null);
  const [menuCoCuon, setMenuCoCuon] = useState(false);
  const [menuHetCuon, setMenuHetCuon] = useState(false);

  // Modal state
  const [hopThoaiMo, setHopThoaiMo] = useState(false);
  const [nutGiaDaChon, setNutGiaDaChon] = useState<NutGiaR1>('79k');

  // Tracking refs (ẩn danh, không gửi ngày sinh)
  const sessionIdRef = useRef<string>('');
  const utmRef = useRef<UtmParams>({ utmSource: '(trực tiếp)', utmMedium: '', utmCampaign: '' });
  const daBatDauFormRef = useRef(false);
  const daLapLaSoRef = useRef(false);
  const daXemGiaRef = useRef(false);
  const daGuiBoFormRef = useRef(false);
  const pricingSectionRef = useRef<HTMLElement | null>(null);
  const resultSectionRef = useRef<HTMLElement | null>(null);

  const guiSuKien = useCallback(
    (eventName: R1EventName, extra?: { coGioSinh?: boolean; dungBeacon?: boolean }) => {
      if (typeof window === 'undefined') return;
      const sessionId = sessionIdRef.current || layHoacTaoSessionId();
      sessionIdRef.current = sessionId;
      const payload = JSON.stringify({
        sessionId,
        eventName,
        ...(typeof extra?.coGioSinh === 'boolean' ? { coGioSinh: extra.coGioSinh } : {}),
        utmSource: utmRef.current.utmSource,
        utmMedium: utmRef.current.utmMedium,
        utmCampaign: utmRef.current.utmCampaign,
      });

      if (
        extra?.dungBeacon &&
        typeof navigator !== 'undefined' &&
        typeof navigator.sendBeacon === 'function'
      ) {
        try {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/r1/su-kien', blob);
          return;
        } catch {
          // fallback sang fetch keepalive
        }
      }

      fetch('/api/r1/su-kien', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: Boolean(extra?.dungBeacon),
      }).catch(() => {});
    },
    [],
  );

  // Ghi nhận xem_trang và theo dõi bo_form khi rời trang
  useEffect(() => {
    sessionIdRef.current = layHoacTaoSessionId();
    utmRef.current = docUtmTuUrl();
    guiSuKien('xem_trang');

    const xuLyRoiTrang = () => {
      if (daBatDauFormRef.current && !daLapLaSoRef.current && !daGuiBoFormRef.current) {
        daGuiBoFormRef.current = true;
        guiSuKien('bo_form', { dungBeacon: true });
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') xuLyRoiTrang();
    };
    window.addEventListener('pagehide', xuLyRoiTrang);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', xuLyRoiTrang);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [guiSuKien]);

  // Theo dõi xem_gia khi khối giá xuất hiện trong khung nhìn
  useEffect(() => {
    const el = pricingSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !daXemGiaRef.current) {
            daXemGiaRef.current = true;
            guiSuKien('xem_gia');
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [guiSuKien, ketQua]);

  // Cập nhật gợi ý cuộn ngang trên thanh menu
  const capNhatMenuCuon = useCallback(() => {
    const ul = menuListRef.current;
    if (!ul) return;
    setMenuCoCuon(ul.scrollWidth > ul.clientWidth + 2);
    setMenuHetCuon(ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 4);
  }, []);

  useEffect(() => {
    if (trongKhungV2) return;
    capNhatMenuCuon();
    window.addEventListener('resize', capNhatMenuCuon);
    return () => window.removeEventListener('resize', capNhatMenuCuon);
  }, [capNhatMenuCuon, trongKhungV2]);

  const danhDauBatDauForm = () => {
    if (!daBatDauFormRef.current) {
      daBatDauFormRef.current = true;
      guiSuKien('bat_dau_form');
    }
  };

  async function handleLapLaSo(e: React.FormEvent) {
    e.preventDefault();
    danhDauBatDauForm();
    setLoiForm('');

    if (!dongYNgaySinh) {
      setLoiForm('Vui lòng tích ô đồng ý xử lý ngày giờ sinh trước khi lập lá số.');
      return;
    }

    setDangTinh(true);
    try {
      const res = await fetch('/api/r1/la-so', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lich,
          ngay: Number(ngay),
          thang: Number(thang),
          nam: Number(nam),
          nhuan: lich === 'am' ? nhuan : false,
          gio: Number(gio),
          phut: Number(phut),
          gioiTinh,
          chuaRoGioSinh,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; loi?: string; ketQua?: KetQuaR1 };
      if (!res.ok || !data.ok || !data.ketQua) {
        setLoiForm(data.loi || 'Ngày giờ sinh chưa hợp lệ. Bạn vui lòng kiểm tra lại.');
        return;
      }

      setKetQua(data.ketQua);
      setSoiNhanDinhId(null);
      setSoiChis([]);
      daLapLaSoRef.current = true;
      guiSuKien('lap_la_so', { coGioSinh: !chuaRoGioSinh });

      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } catch {
      setLoiForm('Không thể kết nối máy chủ để lập lá số. Bạn vui lòng thử lại.');
    } finally {
      setDangTinh(false);
    }
  }

  function handleBamNutMua(nut: NutGiaR1) {
    setNutGiaDaChon(nut);
    setHopThoaiMo(true);
    guiSuKien(nut === '149k' ? 'bam_mua_149' : 'bam_mua_79');
  }

  function handleSoiCanCu(id: string, chis: number[]) {
    if (soiNhanDinhId === id) {
      setSoiNhanDinhId(null);
      setSoiChis([]);
      return;
    }
    setSoiNhanDinhId(id);
    setSoiChis(chis);
    resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Quy tắc R4 (04 mục 3.1): ẩn nút 149k khi người dùng chọn "Chưa rõ giờ sinh"
  const coGioHienTai = ketQua ? ketQua.loai === 'co_gio' : !chuaRoGioSinh;
  const duocHien149k = hienNut149k(coGioHienTai);

  // Sắp xếp nhận định của lá số thật: đưa Chủ đề 2027 (I · 2027) lên trước rồi tới Mệnh–Thân
  const dsNhanDinhCoGio: NhanDinhMienPhi[] =
    ketQua?.loai === 'co_gio'
      ? [
          ...(ketQua.chuDe2027 ? [ketQua.chuDe2027] : []),
          ...ketQua.nhanDinhMenhThan,
        ]
      : [];

  const dsBreadcrumb = breadcrumb('/tu-vi-2027');
  const daDung = trangDaDung();
  const VungNoiDung: React.ElementType = trongKhungV2 ? React.Fragment : 'main';

  return (
    <div className={`r1e${fontClassName ? ` ${fontClassName}` : ''}`}>
      {!trongKhungV2 && (
        <>
          <SvgSpriteE3 />

          {/* Dải cam kết trên cùng */}
          <div className="r1e-dai-tren">
            <div className="r1e-w">
              <span>Lập lá số tử vi, tra cứu huyền học có căn cứ</span>
              <span className="r1e-dai-tren-phai">
                Không quảng cáo · Không popup · Không bán lễ giải hạn
              </span>
            </div>
          </div>

          {/* Đầu trang sơn mài: logo triện + tìm kiếm hiển thị + thanh menu */}
          <header className="r1e-dau r1e-toi">
            <div className="r1e-w r1e-dau-in">
              <a className="r1e-logo" href="/tu-vi-2027" aria-label="xemboi.vn, trang Tử Vi 2027">
                <TrienXemBoi />
                <span className="r1e-logo-vach" aria-hidden="true" />
                <span className="r1e-logo-chu">
                  <b className="r1e-chu-vang">{R1_COPY.thuongHieu}</b>
                  <small>
                    <i />
                    Tử vi · Lịch âm · Huyền học
                    <i />
                  </small>
                </span>
              </a>

              <form
                className="r1e-tim"
                role="search"
                onSubmit={(e) => e.preventDefault()}
                aria-label="Tìm kiếm minh họa"
              >
                <input
                  type="search"
                  value={timHienThi}
                  onChange={(e) => setTimHienThi(e.target.value)}
                  placeholder="Tìm sao, cung, quẻ, ngày…"
                  aria-label="Tìm trong xemboi.vn"
                />
                <button type="submit" aria-label="Tìm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path d="M15.5 15.5L21 21" />
                  </svg>
                </button>
              </form>
            </div>

            <div className="r1e-hoi-van" aria-hidden="true" />

            <nav
              className={`r1e-menu${menuCoCuon ? ' r1e-cuon' : ''}${menuHetCuon ? ' r1e-het' : ''}`}
              aria-label="Các mảng"
            >
              <div className="r1e-w">
                <ul ref={menuListRef} onScroll={capNhatMenuCuon}>
                  <li>
                    <a className="r1e-on" href="#lap" aria-current="page">
                      Tử vi
                    </a>
                  </li>
                  {MANG_SAP_CO.map((ten) => (
                    <li key={ten}>
                      <span className="r1e-menu-soon" aria-disabled="true">
                        {ten}
                        <em className="r1e-sap-co">Sắp có</em>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <span className="r1e-menu-goi" aria-hidden="true">
                ›
              </span>
            </nav>
          </header>
        </>
      )}

      <VungNoiDung>
        {/* 1. ĐẦU TRANG: TRANH SƠN MÀI ĐÊM TRĂNG + FORM LẬP LÁ SỐ */}
        <section className="r1e-dau-trang r1e-toi" id="lap" aria-labelledby="r1-hero-heading">
          <TranhDauTrangNen />
          <TranhDauTrangDai />

          <div className="r1e-w">
            <nav aria-label="Đường dẫn" className="r1e-vet">
              <ol>
                {dsBreadcrumb.map((muc, i) => {
                  const laCuoi = i === dsBreadcrumb.length - 1;
                  return (
                    <li key={`${muc.href}-${i}`}>
                      {laCuoi ? (
                        <b aria-current="page">{muc.ten}</b>
                      ) : daDung.has(muc.href) ? (
                        <Link href={muc.href}>{muc.ten}</Link>
                      ) : (
                        <span>{muc.ten}</span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="r1e-lap">
              <div className="r1e-minh-o">
                <p className="r1e-eb">Tử Vi 2027 · Nam Phái · Miễn phí</p>
                <h1 id="r1-hero-heading">{R1_COPY.hero.tieuDe}</h1>
                <p className="r1e-tranh-chu" aria-hidden="true">
                  Đêm trăng, sân đình, gốc đa và ngọn đèn dầu
                </p>
              </div>

              <form
                className="r1e-to-giay"
                id="form-lap"
                onSubmit={handleLapLaSo}
                onFocus={danhDauBatDauForm}
                noValidate
                aria-labelledby="r1-form-heading"
              >
                <HoaVanGoc4 />
                <div className="r1e-form-tit">
                  <HoaVanMay />
                  <h2 id="r1-form-heading">{R1_COPY.form.tieuDe}</h2>
                  <HoaVanMay flipped />
                </div>
                <p className="r1e-form-phu">{R1_COPY.form.phuDe}</p>

                {loiForm && (
                  <div className="r1e-alert-error" role="alert">
                    {loiForm}
                  </div>
                )}

                <div className="r1e-hang2">
                  <div className="r1e-o-nhap">
                    <span className="r1e-nhan-o" id="r1-gt-label">
                      Giới tính
                    </span>
                    <div className="r1e-chon" role="radiogroup" aria-labelledby="r1-gt-label">
                      <label>
                        <input
                          type="radio"
                          name="gt"
                          value="nam"
                          checked={gioiTinh === 'nam'}
                          onChange={() => {
                            danhDauBatDauForm();
                            setGioiTinh('nam');
                          }}
                        />
                        Nam
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="gt"
                          value="nu"
                          checked={gioiTinh === 'nu'}
                          onChange={() => {
                            danhDauBatDauForm();
                            setGioiTinh('nu');
                          }}
                        />
                        Nữ
                      </label>
                    </div>
                  </div>

                  <div className="r1e-o-nhap">
                    <span className="r1e-nhan-o" id="r1-lich-label">
                      Ngày sinh theo
                    </span>
                    <div className="r1e-chon" role="radiogroup" aria-labelledby="r1-lich-label">
                      <label>
                        <input
                          type="radio"
                          name="lich"
                          value="duong"
                          checked={lich === 'duong'}
                          onChange={() => {
                            danhDauBatDauForm();
                            setLich('duong');
                            setNhuan(false);
                          }}
                        />
                        Dương lịch
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="lich"
                          value="am"
                          checked={lich === 'am'}
                          onChange={() => {
                            danhDauBatDauForm();
                            setLich('am');
                          }}
                        />
                        Âm lịch
                      </label>
                    </div>
                  </div>
                </div>

                <div className="r1e-o-nhap r1e-hang">
                  <label className="r1e-o-con" htmlFor="r1-ngay">
                    <span>Ngày sinh</span>
                    <select
                      id="r1-ngay"
                      value={ngay}
                      onChange={(e) => {
                        danhDauBatDauForm();
                        setNgay(e.target.value);
                      }}
                    >
                      {Array.from({ length: lich === 'am' ? 30 : 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="r1e-o-con" htmlFor="r1-thang">
                    <span>Tháng</span>
                    <select
                      id="r1-thang"
                      value={thang}
                      onChange={(e) => {
                        danhDauBatDauForm();
                        setThang(e.target.value);
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="r1e-o-con" htmlFor="r1-nam">
                    <span>Năm</span>
                    <input
                      id="r1-nam"
                      type="number"
                      min={1900}
                      max={2100}
                      inputMode="numeric"
                      value={nam}
                      onChange={(e) => {
                        danhDauBatDauForm();
                        setNam(e.target.value);
                      }}
                      required
                    />
                  </label>
                </div>

                {lich === 'am' && (
                  <label className="r1e-chua-ro" htmlFor="r1-nhuan">
                    <input
                      id="r1-nhuan"
                      type="checkbox"
                      checked={nhuan}
                      onChange={(e) => {
                        danhDauBatDauForm();
                        setNhuan(e.target.checked);
                      }}
                    />
                    <span>Sinh vào tháng nhuận âm lịch</span>
                  </label>
                )}

                <div className="r1e-o-nhap r1e-hang r1e-hang-gio">
                  <label className="r1e-o-con" htmlFor="r1-gio">
                    <span>Giờ sinh</span>
                    <select
                      id="r1-gio"
                      value={gio}
                      disabled={chuaRoGioSinh}
                      onChange={(e) => {
                        danhDauBatDauForm();
                        setGio(e.target.value);
                      }}
                    >
                      {Array.from({ length: 24 }, (_, h) => (
                        <option key={h} value={h}>
                          {String(h).padStart(2, '0')} giờ ({CHI_GIO[Math.floor((h + 1) / 2) % 12]})
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="r1e-o-con" htmlFor="r1-phut">
                    <span>Phút</span>
                    <select
                      id="r1-phut"
                      value={phut}
                      disabled={chuaRoGioSinh}
                      onChange={(e) => {
                        danhDauBatDauForm();
                        setPhut(e.target.value);
                      }}
                    >
                      {Array.from({ length: 60 }, (_, p) => (
                        <option key={p} value={p}>
                          {String(p).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="r1e-o-con" htmlFor="r1-namxem">
                    <span>Năm xem</span>
                    <select id="r1-namxem" value="2027" onChange={() => {}}>
                      <option value="2027">2027</option>
                    </select>
                  </label>
                </div>

                <label className="r1e-chua-ro" htmlFor="r1-chua-ro-gio">
                  <input
                    id="r1-chua-ro-gio"
                    type="checkbox"
                    checked={chuaRoGioSinh}
                    onChange={(e) => {
                      danhDauBatDauForm();
                      setChuaRoGioSinh(e.target.checked);
                    }}
                  />
                  <span>
                    <strong>{R1_COPY.form.nhanChuaRoGio}</strong>
                    <small className="r1e-chua-ro-hint">
                      {' '}
                      ({R1_COPY.form.giaiThichChuaRoGio})
                    </small>
                  </span>
                </label>

                <label className="r1e-chua-ro r1e-consent" htmlFor="r1-consent-birth">
                  <input
                    id="r1-consent-birth"
                    type="checkbox"
                    checked={dongYNgaySinh}
                    onChange={(e) => {
                      danhDauBatDauForm();
                      setDongYNgaySinh(e.target.checked);
                    }}
                    required
                  />
                  <span>{R1_COPY.form.dongYXuLyNgaySinh}</span>
                </label>

                <button
                  className="r1e-nut r1e-nut-son r1e-nut-lon"
                  type="submit"
                  disabled={dangTinh}
                >
                  {dangTinh ? R1_COPY.form.nutDangTinh : R1_COPY.form.nutLapLaSo}
                </button>
                <p className="r1e-ghi-nho">
                  Giờ tính theo múi giờ Việt Nam (UTC+7). Sinh từ 23:00 trở đi tính giờ Tý ngày hôm
                  sau.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Dải giới thiệu & 3 cam kết trên nền ngà */}
        <section className="r1e-gt" aria-label="Điều xemboi cam kết">
          <div className="r1e-w r1e-gt-in">
            <p>{R1_COPY.hero.dinhVi}</p>
            <ul className="r1e-tin">
              {R1_COPY.hero.loiHua.map((cau, i) => (
                <li key={i}>
                  <span className="r1e-ic-o" aria-hidden="true">
                    {i === 0 && (
                      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 25c-5-1.6-8.5-5.6-8.5-10.5 3.4 0 6.2 1.7 8.5 4.2 2.3-2.5 5.1-4.2 8.5-4.2 0 4.9-3.5 8.9-8.5 10.5z" />
                        <path d="M16 18.5c-1.7-3.3-1.7-7.2 0-10.5 1.7 3.3 1.7 7.2 0 10.5z" />
                      </svg>
                    )}
                    {i === 1 && (
                      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="5" y="8" width="22" height="16" rx="1.5" />
                        <path d="M5 26L27 6" />
                      </svg>
                    )}
                    {i === 2 && (
                      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 9c-3-2.2-7-2.6-11-2v18c4-.6 8-.2 11 2 3-2.2 7-2.6 11-2V7c-4-.6-8-.2-11 2z" />
                        <path d="M16 9v18" />
                      </svg>
                    )}
                  </span>
                  <div>
                    <b>{cau}</b>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="r1e-dai-may" aria-hidden="true" />

        {/* 2. KẾT QUẢ LÁ SỐ HOẶC TỔNG QUAN CHƯA RÕ GIỜ */}
        {ketQua && (
          <>
            <section
              ref={resultSectionRef}
              className="r1e-sec r1e-sec-kem"
              id="la-so"
              aria-labelledby="r1-result-heading"
            >
              <div className="r1e-w-rong">
                {ketQua.loai === 'co_gio' ? (
                  <>
                    <div className="r1e-tieu">
                      <AnTieuDe />
                      <h2 id="r1-result-heading">Lá số Tử Vi 12 cung của bạn</h2>
                      <p>
                        {ketQua.laSo.gioiTinh}, sinh {ketQua.laSo.duong.ngay}/
                        {ketQua.laSo.duong.thang}/{ketQua.laSo.duong.nam} lúc{' '}
                        {dinhDangGioHeader(ketQua.laSo.gio.dongHo)} dương lịch (âm lịch{' '}
                        {ketQua.laSo.am.ngay}/{ketQua.laSo.am.thang}/{ketQua.laSo.am.nam}
                        {ketQua.laSo.am.nhuan ? ' nhuận' : ''}). Họ tên đã ẩn. Lưu niên{' '}
                        {ketQua.luuNien2027.namXem}.
                      </p>
                      <ChiaVach />
                    </div>

                    <LaSo12Cung
                      laSo={ketQua.laSo}
                      luuNien2027={ketQua.luuNien2027}
                      moTaQuyUoc={ketQua.moTaQuyUoc}
                      highlightedChis={soiChis}
                    />
                  </>
                ) : (
                  <>
                    <div className="r1e-tieu">
                      <AnTieuDe />
                      <h2 id="r1-result-heading">
                        Tổng quan theo ngày sinh (chế độ chưa rõ giờ sinh)
                      </h2>
                      <p>
                        Tính chính xác ngày âm lịch, Can Chi, Ngũ Hành Nạp Âm và trục tương quan năm
                        Đinh Mùi 2027.
                      </p>
                      <ChiaVach />
                    </div>

                    <div className="r1e-ls-vo r1e-crg-vo">
                      <HoaVanGocVang4 />
                      <div className="r1e-ls-nga r1e-crg-nga">
                        <div className="r1e-crg-grid">
                          <div className="r1e-crg-item">
                            <span className="r1e-crg-nhan">Ngày dương / âm</span>
                            <b className="r1e-crg-tri">
                              {ketQua.duong.ngay}/{ketQua.duong.thang}/{ketQua.duong.nam} →{' '}
                              {ketQua.am.ngay}/{ketQua.am.thang}/{ketQua.am.nam}
                              {ketQua.am.nhuan ? ' (nhuận)' : ''}
                            </b>
                          </div>
                          <div className="r1e-crg-item">
                            <span className="r1e-crg-nhan">Can Chi Năm – Tháng – Ngày</span>
                            <b className="r1e-crg-tri">
                              {ketQua.canChiNam} · {ketQua.canChiThang} · {ketQua.canChiNgay}
                            </b>
                          </div>
                          <div className="r1e-crg-item">
                            <span className="r1e-crg-nhan">Bản Mệnh (Nạp Âm)</span>
                            <b className={`r1e-crg-tri ${HANH_CLS[ketQua.hanhMenh]}`}>
                              {ketQua.banMenh} (hành {ketQua.hanhMenh})
                            </b>
                          </div>
                          <div className="r1e-crg-item">
                            <span className="r1e-crg-nhan">Tuổi mụ năm 2027</span>
                            <b className="r1e-crg-tri">
                              {ketQua.tuoiMu2027} tuổi · Con giáp {ketQua.conGiap}
                            </b>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            <div className="r1e-chuyen" aria-hidden="true">
              <span>
                <i />
                <HoaVanMay />
                <i />
              </span>
            </div>

            {/* 3. NHẬN ĐỊNH CÓ CĂN CỨ (CUỘN GIẤY LỀ SON) */}
            <section className="r1e-sec" id="nhan-dinh" aria-labelledby="r1-insight-heading">
              <div className="r1e-w">
                <div className="r1e-tieu">
                  <AnTieuDe />
                  <h2 id="r1-insight-heading">Nhận định có căn cứ</h2>
                  <p>
                    {ketQua.loai === 'co_gio'
                      ? 'Rút từ kho quy tắc tĩnh có ghi rõ sao–cung căn cứ và tên sách nguồn. Yếu tố chưa có câu quy tắc tĩnh sẽ bỏ qua, không tự bịa thêm.'
                      : 'Tương quan Ngũ Hành bản mệnh với năm Đinh Mùi 2027 và giải thích lý do không tự đoán 12 cung.'}
                  </p>
                  <ChiaVach />
                </div>

                <div className="r1e-nd-luoi">
                  <div className="r1e-cuon">
                    <span className="r1e-truc r1e-tr" aria-hidden="true" />
                    <div className="r1e-nd">
                      <span className="r1e-le-so" aria-hidden="true">
                        I<i />
                        2027
                      </span>
                      <TrienXemBoi className="r1e-nd-trien r1e-trien-o" />

                      {ketQua.loai === 'co_gio' ? (
                        dsNhanDinhCoGio.map((muc, idx) => {
                          const { chips, chis } = trichSaoDanChung(
                            muc.canCu,
                            ketQua.laSo,
                            ketQua.luuNien2027,
                          );
                          const dangSoi = soiNhanDinhId === muc.id;
                          return (
                            <article key={muc.id} className="r1e-nd-muc">
                              <div className="r1e-cc-khoi">
                                <span className="r1e-cc-nhan">Căn cứ</span>
                                <p className="r1e-can-cu">{muc.canCu}</p>
                              </div>

                              {chips.length > 0 && (
                                <div className="r1e-sao-dc">
                                  <span>Sao dẫn chứng</span>
                                  {chips.map((ch) => (
                                    <span
                                      key={ch.key}
                                      className={`r1e-sao${ch.loai === 'cung' ? ' r1e-cung' : ''}${ch.hanh ? ` ${HANH_CLS[ch.hanh]}` : ''}${ch.luu ? ' r1e-luu' : ''}`}
                                      style={ch.luu ? ({ '--l': '14px' } as React.CSSProperties) : undefined}
                                    >
                                      {ch.luu && <span className="r1e-sr">L. </span>}
                                      {ch.nhan}
                                      {ch.dacTinh && <small>({ch.dacTinh})</small>}
                                      {ch.phu && <em>{ch.phu}</em>}
                                    </span>
                                  ))}
                                </div>
                              )}

                              <h3>
                                <span className="r1e-muc-la-ma">{LA_MA[idx] ?? idx + 1}.</span>{' '}
                                {muc.tieuDe}
                              </h3>
                              <p className="r1e-nd-van">{muc.noiDung}</p>
                              <div className="r1e-nguon">
                                Nguồn sách:
                                <ul>
                                  {muc.nguon.map((ng, nIdx) => (
                                    <li key={nIdx}>{ng}</li>
                                  ))}
                                </ul>
                              </div>
                              {muc.ghiChuKiemDuyet && (
                                <p className="r1e-kd">{muc.ghiChuKiemDuyet}</p>
                              )}
                              {chis.length > 0 && (
                                <button
                                  type="button"
                                  className={`r1e-nut r1e-nut-vien${dangSoi ? ' r1e-on' : ''}`}
                                  aria-pressed={dangSoi}
                                  onClick={() => handleSoiCanCu(muc.id, chis)}
                                >
                                  {dangSoi ? 'Bỏ soi căn cứ' : 'Soi căn cứ trên lá số'}
                                </button>
                              )}
                            </article>
                          );
                        })
                      ) : (
                        <>
                          <article className="r1e-nd-muc">
                            <div className="r1e-cc-khoi">
                              <span className="r1e-cc-nhan">Căn cứ</span>
                              <p className="r1e-can-cu">{ketQua.tongQuan2027.canCu}</p>
                            </div>
                            <div className="r1e-sao-dc">
                              <span>Ngũ hành đối chiếu</span>
                              <span className={`r1e-sao ${HANH_CLS[ketQua.hanhMenh]}`}>
                                {ketQua.banMenh} <em>{ketQua.hanhMenh}</em>
                              </span>
                              <span className="r1e-sao r1e-c-t">
                                {ketQua.tongQuan2027.napAm2027}
                              </span>
                            </div>
                            <h3>{ketQua.tongQuan2027.quanHeNguHanh}</h3>
                            <p className="r1e-nd-van">{ketQua.tongQuan2027.moTaQuanHe}</p>
                            <p className="r1e-goi-y-2027">
                              Gợi ý 2027: {ketQua.tongQuan2027.goiYDinhHuong}
                            </p>
                          </article>

                          <article className="r1e-nd-muc">
                            <h3>Vì sao chưa an được lá số 12 cung khi thiếu giờ sinh?</h3>
                            <p className="r1e-nd-van">{ketQua.lyDoKhongAn12Cung}</p>
                            <p className="r1e-kd">
                              Gợi ý: Nếu bạn có thể hỏi lại gia đình hoặc xem giấy khai sinh để biết
                              khoảng giờ sinh, hãy bỏ tích ô &ldquo;Chưa rõ giờ sinh&rdquo; và lập
                              lại hoàn toàn miễn phí.
                            </p>
                          </article>
                        </>
                      )}
                    </div>
                    <span className="r1e-truc r1e-du" aria-hidden="true" />
                  </div>

                  <aside className="r1e-cach-viet">
                    <h3>Một nhận định ở xemboi gồm</h3>
                    <ol>
                      <li>
                        <div>
                          <b>Nhãn căn cứ</b>
                          Cung nào, sao nào, Hóa nào. Bấm soi để thấy đúng ô trên lá số.
                        </div>
                      </li>
                      <li>
                        <div>
                          <b>Ý trong sách</b>
                          Diễn lại bằng lời bình thường, xưng &ldquo;bạn&rdquo;, không phán chắc.
                        </div>
                      </li>
                      <li>
                        <div>
                          <b>Nguồn và trạng thái</b>
                          Ghi tên sách, và ghi rõ câu đã hay chưa qua người duyệt.
                        </div>
                      </li>
                    </ol>
                  </aside>
                </div>
              </div>
            </section>

            <div className="r1e-chuyen" aria-hidden="true">
              <span>
                <i />
                <HoaVanMay />
                <i />
              </span>
            </div>
          </>
        )}

        {/* 4. ĐOẠN BẢN LUẬN GIẢI MẪU ĐẦY ĐỦ */}
        <section className="r1e-sec" id="ban-mau" aria-labelledby="r1-sample-heading">
          <div className="r1e-w">
            <div className="r1e-tieu">
              <AnTieuDe />
              <h2 id="r1-sample-heading">{R1_COPY.banMau.tieuDe}</h2>
              <p>{R1_COPY.banMau.moTaNguon}</p>
              <ChiaVach />
            </div>

            <div className="r1e-nd-luoi">
              <div className="r1e-cuon">
                <span className="r1e-truc r1e-tr" aria-hidden="true" />
                <div className="r1e-nd">
                  <span className="r1e-le-so" aria-hidden="true">
                    MẪU
                    <i />
                    2027
                  </span>
                  <TrienXemBoi className="r1e-nd-trien r1e-trien-o" />

                  <div className="r1e-sample-badge">{BAN_MAU_BIEN_TAP.nhanBatBuoc}</div>
                  <div className="r1e-sample-meta">{BAN_MAU_BIEN_TAP.thongTinLaSoMau}</div>

                  {BAN_MAU_BIEN_TAP.cacMuc.map((muc, idx) => (
                    <article key={idx} className="r1e-nd-muc">
                      <div className="r1e-cc-khoi">
                        <span className="r1e-cc-nhan">Căn cứ</span>
                        <p className="r1e-can-cu">{muc.canCu}</p>
                      </div>
                      <h3>{muc.tieuDe}</h3>
                      <p className="r1e-nd-van">{muc.noiDung}</p>
                      <p className="r1e-goi-y-2027">{muc.goiY}</p>
                    </article>
                  ))}

                  <p className="r1e-kd r1e-sample-cuoi">{BAN_MAU_BIEN_TAP.ghiChuCuoi}</p>
                </div>
                <span className="r1e-truc r1e-du" aria-hidden="true" />
              </div>

              <aside className="r1e-cach-viet">
                <h3>Một nhận định ở xemboi gồm</h3>
                <ol>
                  <li>
                    <div>
                      <b>Nhãn căn cứ</b>
                      Ghi rõ cung nào, sao nào, Hóa nào đang làm cơ sở cho từng luận điểm.
                    </div>
                  </li>
                  <li>
                    <div>
                      <b>Ý trong sách</b>
                      Diễn lại bằng lời bình thường, xưng &ldquo;bạn&rdquo;, không phán chắc hay hù
                      dọa.
                    </div>
                  </li>
                  <li>
                    <div>
                      <b>Gợi ý thực tế</b>
                      Đề xuất bước chuẩn bị cụ thể để bạn chủ động cân nhắc trong năm 2027.
                    </div>
                  </li>
                </ol>
              </aside>
            </div>
          </div>
        </section>

        <div className="r1e-dai-may" aria-hidden="true" />

        {/* 5. KHỐI GIÁ: NỀN SƠN ĐEN + THẺ SON VIỀN VÀNG LÁ */}
        <section
          ref={pricingSectionRef}
          className="r1e-sec r1e-sec-den r1e-toi"
          id="gia"
          aria-labelledby="r1-pricing-heading"
        >
          <div className="r1e-w">
            <div className="r1e-tieu">
              <AnTieuDe />
              <h2 id="r1-pricing-heading" className="r1e-chu-vang">
                {R1_COPY.gia.tieuDe}
              </h2>
              <p>{R1_COPY.gia.thongDiepChinh}</p>
              <ChiaVach />
            </div>

            <div className={`r1e-gia${duocHien149k ? '' : ' r1e-gia-1'}`}>
              {/* Gói 79.000đ: thẻ giản dị */}
              <article className="r1e-the-gia r1e-thuong">
                <span className="r1e-eb">Trả 1 lần</span>
                <h3>{R1_COPY.gia.goi79.ten}</h3>
                <div className="r1e-so">
                  {R1_COPY.gia.goi79.gia} <small>· {R1_COPY.gia.goi79.moTaNgan}</small>
                </div>
                <ul>
                  {R1_COPY.gia.goi79.diemChinh.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="r1e-nut r1e-nut-vien"
                  data-testid="btn-mua-79"
                  onClick={() => handleBamNutMua('79k')}
                >
                  {R1_COPY.gia.nut79}
                </button>
              </article>

              {/* Gói 149.000đ: thẻ son viền vàng lá — ẨN khi chưa rõ giờ sinh (R4, 04 mục 3.1) */}
              {duocHien149k && (
                <article className="r1e-the-gia r1e-chinh">
                  <HoaVanGocVang4 />
                  <span className="r1e-dau-goi">Gói chính</span>
                  <span className="r1e-eb">Trả 1 lần</span>
                  <h3>{R1_COPY.gia.goi149.ten}</h3>
                  <div className="r1e-so r1e-chu-vang">
                    {R1_COPY.gia.goi149.gia}{' '}
                    <small>· {R1_COPY.gia.goi149.moTaNgan}</small>
                  </div>
                  <ul>
                    {R1_COPY.gia.goi149.diemChinh.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="r1e-nut"
                    data-testid="btn-mua-149"
                    onClick={() => handleBamNutMua('149k')}
                  >
                    {R1_COPY.gia.nut149}
                  </button>
                </article>
              )}
            </div>

            {!duocHien149k && (
              <p className="r1e-gia-an-note" role="note" data-testid="ghi-chu-an-149">
                {R1_COPY.gia.ghiChuAn149KhiChuaRoGio}
              </p>
            )}

            <p className="r1e-gia-ghi">
              xemboi.vn không bán lễ giải hạn hay vật phẩm phong thủy.
            </p>
          </div>
        </section>
      </VungNoiDung>

      {/* 7. CHÂN TRANG SƠN ĐEN SÂU */}
      {!trongKhungV2 && (
        <footer className="r1e-chan r1e-toi">
          <div className="r1e-dai-may" aria-hidden="true" />
          <div className="r1e-w r1e-chan-in">
            <div>
              <span className="r1e-logo">
                <TrienXemBoi />
                <span className="r1e-logo-chu">
                  <b className="r1e-chu-vang">{R1_COPY.thuongHieu}</b>
                </span>
              </span>
              <p className="r1e-cam">
                Lá số tử vi minh bạch, rõ căn cứ từng sao–cung.
                <br />
                Không quảng cáo. Không bán lễ giải hạn.
              </p>
              <p className="r1e-chu-the">
                <strong>{R1_COPY.chanTrang.chuTheLabel}</strong>{' '}
                {R1_COPY.chanTrang.chuThePlaceholder} · Liên hệ:{' '}
                {R1_COPY.chanTrang.lienHePlaceholder}
              </p>
            </div>

            <div>
              <h4 className="r1e-chu-vang">Tử vi 2027</h4>
              <ul>
                <li>
                  <a href="#lap">Lập lá số miễn phí</a>
                </li>
                <li>
                  <a href="#ban-mau">Bản luận giải mẫu</a>
                </li>
                <li>
                  <a href="#gia">Bảng giá dự kiến</a>
                </li>
              </ul>
            </div>

            <div className="r1e-chan-chinhsach">
              <h4 className="r1e-chu-vang">Dữ liệu &amp; miễn trừ</h4>
              <p>{R1_COPY.chanTrang.chinhSachDuLieu}</p>
              <p>{R1_COPY.chanTrang.mienTruTrachNhiem}</p>
            </div>
          </div>
          <div className="r1e-hoi-van" aria-hidden="true" />
          <div className="r1e-w r1e-chan-duoi">
            <span>© 2026 {R1_COPY.thuongHieu}</span>
            <span>Tử Vi 2027 · Quy ước Nam Phái</span>
          </div>
        </footer>
      )}

      {/* 6. HỘP THOẠI TRUNG THỰC KHI BẤM MUA */}
      <HopThoaiMua
        mo={hopThoaiMo}
        nutGia={nutGiaDaChon}
        utm={utmRef.current}
        onDong={() => setHopThoaiMo(false)}
        onGuiThanhCong={() => guiSuKien('gui_lien_he')}
      />
    </div>
  );
}
