import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { HANH_SLUG } from '@/components/ck/canChiHelpers';
import {
  ChuGiaiHanh,
  DocNhanh,
  TrichNguyenVan,
  type TheDocNhanhItem,
} from '@/components/ck/truc-quan';
import type { Hanh } from '@/lib/trang/can-chi';
import { daDungKinhDich, duongDanQue } from '@/lib/trang/chu-dich';
import { BAT_QUAI, type KetQuaGieo, type Que } from '@/lib/trang/kinh-dich';
import {
  LOI_SACH_THE_DUNG,
  NGUON_MAI_HOA,
  TEN_QUAN_HE,
  TRICH_MAI_HOA,
  VI_DU_SACH,
  phanTichMaiHoa,
  queMaiHoaLuc,
  queMaiHoaTheoSo,
  queMaiHoaTheoThoiGian,
  type QuanHeTheDung,
  type TrichMaiHoa,
} from '@/lib/trang/mai-hoa';
import { metaTrang, thongTinTrang, type MacDinhTrang } from '@/lib/trang/meta';
import { DIA_CHI, KHUNG_GIO, chiCanhGio } from '@/lib/tuvi-v2/am-lich';
import { GOC_SITE, serializeJsonLd, taoSchemaWebPage } from '../KinhDichHelpers';
import { HinhHao, LienKetKiem } from '../KinhDichUi';
import SoDoTheDungSvg from './SoDoTheDungSvg';
import '../mai-hoa.css';

export const dynamic = 'force-dynamic';

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

const MAC_DINH_MAI_HOA: MacDinhTrang = {
  title: 'Mai hoa Dịch số: lập quẻ theo thời gian, số, thể dụng',
  h1: 'Mai hoa Dịch số',
  description:
    'Lập quẻ Mai hoa Dịch số theo thời gian âm lịch hoặc số đếm được: in đủ bước tính, quẻ chủ, hỗ, biến, ngũ hành thể dụng và hai ví dụ trong sách.',
};

const CAU_DOC_NHANH =
  'Mai hoa Dịch số lập quẻ từ con số: năm, tháng, ngày, giờ âm lịch, hoặc một số đếm được. Quái không có hào động là thể (mình), quái có hào động là dụng (việc); xét ngũ hành sinh khắc giữa thể với dụng, hỗ, biến.';

function layMot(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function kiemCoThamSo(sp: Record<string, string | string[] | undefined>): boolean {
  return Object.values(sp).some((v) =>
    Array.isArray(v)
      ? v.some((x) => x.trim() !== '')
      : typeof v === 'string' && v.trim() !== '',
  );
}

function docNgayIso(s: string): { ngay: number; thang: number; nam: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const nam = Number(m[1]);
  const thang = Number(m[2]);
  const ngay = Number(m[3]);
  if (nam < 1900 || nam > 2100 || thang < 1 || thang > 12 || ngay < 1 || ngay > 31) {
    return null;
  }
  const d = new Date(Date.UTC(nam, thang - 1, ngay));
  if (
    d.getUTCFullYear() !== nam ||
    d.getUTCMonth() + 1 !== thang ||
    d.getUTCDate() !== ngay
  ) {
    return null;
  }
  return { ngay, thang, nam };
}

function docGioPhut(s: string): { gio: number; phut: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const gio = Number(m[1]);
  const phut = Number(m[2]);
  if (gio < 0 || gio > 23 || phut < 0 || phut > 59) return null;
  return { gio, phut };
}

function trichProps(t: TrichMaiHoa, nhan?: string) {
  return {
    dich: t.dich,
    viTriViet: t.viTriViet,
    doanId: t.doanId,
    tenSach: NGUON_MAI_HOA.tenHanViet,
    tacGia: NGUON_MAI_HOA.tacGia,
    nienDai: NGUON_MAI_HOA.nienDai,
    ghiCong: NGUON_MAI_HOA.ghiCong,
    url: NGUON_MAI_HOA.url,
    nhan,
  };
}

function classLoiSach(qh: QuanHeTheDung): string {
  if (qh === 'sinh-the') return 'ck-mh-loi-sach ck-mh-loi-sach-diu';
  if (qh === 'ty-hoa') return 'ck-mh-loi-sach ck-mh-loi-sach-ty';
  if (qh === 'the-khac') return 'ck-mh-loi-sach ck-mh-loi-sach-khac';
  return 'ck-mh-loi-sach ck-mh-loi-sach-hp';
}

function TheQueBa({
  nhan,
  que,
  daDung,
  haoDong,
  ghiChuHo,
}: {
  nhan: string;
  que: Que;
  daDung: Set<string>;
  haoDong?: number[];
  ghiChuHo?: string;
}) {
  const href = duongDanQue(que);
  return (
    <article className="ck-mh-que-the">
      <span className="ck-mh-que-nhan">{nhan}</span>
      <h3 className="ck-mh-que-ten">
        #{que.so}{' '}
        <LienKetKiem href={href} daDung={daDung}>
          {que.ten}
        </LienKetKiem>
      </h3>
      <p className="ck-mh-que-quai">
        Thượng: <strong>{que.thuong.ten}</strong> ({que.thuong.tuong} · {que.thuong.hanh})
        <br />
        Hạ: <strong>{que.ha.ten}</strong> ({que.ha.tuong} · {que.ha.hanh})
      </p>
      <HinhHao
        hao={que.hao}
        moTa={`Hình quẻ ${que.ten}, 6 hào từ dưới lên`}
        tachQuai
        haoDong={haoDong}
      />
      {ghiChuHo ? <p className="ck-mh-ho-chu">{ghiChuHo}</p> : null}
    </article>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/kinh-dich/mai-hoa-dich-so', MAC_DINH_MAI_HOA),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: `${GOC_SITE}/kinh-dich/mai-hoa-dich-so` },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function MaiHoaDichSoPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/kinh-dich/mai-hoa-dich-so', MAC_DINH_MAI_HOA),
    searchParams,
  ]);
  const daDung = daDungKinhDich();
  const jsonLd = taoSchemaWebPage(tt);

  const vnHienTai = new Date(Date.now() + 7 * 3600_000);
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const ngayMacDinh = `${vnHienTai.getUTCFullYear()}-${pad2(vnHienTai.getUTCMonth() + 1)}-${pad2(vnHienTai.getUTCDate())}`;
  const gioMacDinh = `${pad2(vnHienTai.getUTCHours())}:${pad2(vnHienTai.getUTCMinutes())}`;
  const chiGioMacDinh = chiCanhGio(vnHienTai.getUTCHours());

  const viDuRaw = layMot(sp['vi-du'])?.trim();
  const soRaw = layMot(sp.so)?.trim();
  const gioChiRaw = layMot(sp['gio-chi'])?.trim();
  const ngayRaw = layMot(sp.ngay)?.trim();
  const gioRaw = layMot(sp.gio)?.trim();

  let cheDoTab: 'thoi-gian' | 'so' = 'thoi-gian';
  let loi: string | null = null;
  let ketQua: KetQuaGieo | null = null;
  let moTaDauVao = '';
  let laViDuSach: (typeof VI_DU_SACH)[number] | null = null;

  let ngayForm = ngayRaw || ngayMacDinh;
  let gioForm = gioRaw || gioMacDinh;
  let soForm = soRaw ?? '';
  let chiGioForm = chiGioMacDinh;

  if (viDuRaw !== undefined && viDuRaw !== '') {
    const found = VI_DU_SACH.find((v) => v.ma === viDuRaw);
    if (!found) {
      loi = `Không tìm thấy ví dụ "${viDuRaw}". Chỉ có hai ví dụ chép trong sách: Quán mai và Mẫu đơn.`;
    } else {
      laViDuSach = found;
      ketQua = queMaiHoaTheoThoiGian(
        found.chiNam,
        found.thang,
        found.ngay,
        found.chiGio,
      );
      moTaDauVao = `${found.ten}: năm ${DIA_CHI[found.chiNam]}, tháng ${found.thang} âm, ngày ${found.ngay} âm, giờ ${DIA_CHI[found.chiGio]}.`;
    }
  } else if (soRaw !== undefined && soRaw !== '') {
    cheDoTab = 'so';
    if (!/^-?\d+$/.test(soRaw)) {
      loi = 'Số dùng lập quẻ phải là số nguyên dương lớn hơn 0.';
    } else {
      const soNum = Number(soRaw);
      let chiGio = chiGioMacDinh;
      if (gioChiRaw !== undefined && gioChiRaw !== '') {
        if (!/^\d+$/.test(gioChiRaw) || Number(gioChiRaw) < 0 || Number(gioChiRaw) > 11) {
          loi = 'Chi giờ phải nằm từ 0 (Tý) đến 11 (Hợi).';
        } else {
          chiGio = Number(gioChiRaw);
        }
      }
      chiGioForm = chiGio;
      if (!loi) {
        try {
          ketQua = queMaiHoaTheoSo(soNum, chiGio);
          moTaDauVao = `Số đã nhập: ${soNum} · Giờ ${DIA_CHI[chiGio]} (${KHUNG_GIO[chiGio]})`;
        } catch (err) {
          loi = err instanceof Error ? err.message : 'Số lập quẻ không hợp lệ.';
        }
      }
    }
  } else if ((ngayRaw !== undefined && ngayRaw !== '') || (gioRaw !== undefined && gioRaw !== '')) {
    const ngayOk = ngayRaw ? docNgayIso(ngayRaw) : docNgayIso(ngayMacDinh);
    const gioOk = gioRaw ? docGioPhut(gioRaw) : { gio: 12, phut: 0 };
    if (!ngayOk) {
      loi = 'Ngày dương lịch không hợp lệ (cần dạng YYYY-MM-DD trong khoảng 1900–2100).';
    } else if (!gioOk) {
      loi = 'Giờ lập quẻ không hợp lệ (cần dạng HH:MM từ 00:00 đến 23:59).';
    } else {
      ngayForm = `${ngayOk.nam}-${pad2(ngayOk.thang)}-${pad2(ngayOk.ngay)}`;
      gioForm = `${pad2(gioOk.gio)}:${pad2(gioOk.phut)}`;
      const kqLuc = queMaiHoaLuc(
        ngayOk.ngay,
        ngayOk.thang,
        ngayOk.nam,
        gioOk.gio,
        gioOk.phut,
      );
      ketQua = kqLuc;
      moTaDauVao = kqLuc.thoiDiem;
    }
  }

  const pt = ketQua ? phanTichMaiHoa(ketQua) : null;

  const theDocNhanh: TheDocNhanhItem[] = pt
    ? [
        {
          ma: 'the',
          nhan: 'Thể (mình)',
          giaTri: `${pt.the.ten} (${pt.the.hanh})`,
          hanh: pt.the.hanh as Hanh,
          chiTiet: `Quái không có hào động, đặt ở ${pt.viTriDung === 'thuong' ? 'hạ quái' : 'thượng quái'}.`,
        },
        {
          ma: 'dung',
          nhan: 'Dụng (việc)',
          giaTri: `${pt.dung.ten} (${pt.dung.hanh})`,
          hanh: pt.dung.hanh as Hanh,
          chiTiet: `Quái có hào ${pt.ketQua.haoDong.join(', ')} động, đặt ở ${pt.viTriDung === 'thuong' ? 'thượng quái' : 'hạ quái'}.`,
        },
        {
          ma: 'quan-he',
          nhan: 'Thể – Dụng',
          giaTri: TEN_QUAN_HE[pt.cacQuai[0].quanHe],
          muc:
            pt.cacQuai[0].quanHe === 'sinh-the' || pt.cacQuai[0].quanHe === 'ty-hoa'
              ? 'tot'
              : pt.cacQuai[0].quanHe === 'khac-the' || pt.cacQuai[0].quanHe === 'the-sinh'
                ? 'diu'
                : 'binh',
          chiTiet: pt.loiSachTheDung,
        },
      ]
    : [
        {
          ma: 'the',
          nhan: 'Quái thể',
          giaTri: 'Mình (tĩnh)',
          muc: 'binh',
          chiTiet: 'Quái không chứa hào động là thể, giữ làm chủ.',
        },
        {
          ma: 'dung',
          nhan: 'Quái dụng',
          giaTri: 'Việc (động)',
          muc: 'binh',
          chiTiet: 'Quái chứa hào động là dụng, xét sinh khắc với thể.',
        },
        {
          ma: 'ho-bien',
          nhan: 'Hỗ và biến',
          giaTri: 'Khoảng giữa & kết',
          muc: 'binh',
          chiTiet: 'Quẻ hỗ là khoảng giữa; quẻ biến là kỳ sau cùng.',
        },
      ];

  const theVaDung = pt
    ? pt.viTriDung === 'thuong'
      ? [
          { vai: 'Dụng (trên)', quai: pt.dung, laThe: false },
          { vai: 'Thể (dưới)', quai: pt.the, laThe: true },
        ]
      : [
          { vai: 'Thể (trên)', quai: pt.the, laThe: true },
          { vai: 'Dụng (dưới)', quai: pt.dung, laThe: false },
        ]
    : [];

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/kinh-dich/mai-hoa-dich-so"
      tenCuoi="Mai hoa Dịch số"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1. Đọc nhanh */}
      <DocNhanh cau={CAU_DOC_NHANH} the={theDocNhanh} tieuDeId="ck-mh-dn-tieu" luoiCot={3} />
      <div style={{ marginTop: 12 }}>
        <TrichNguyenVan {...trichProps(TRICH_MAI_HOA.theDung, 'Thể và dụng')} />
      </div>

      {/* 2. Form 2 tab bằng CSS thuần */}
      <section className="ck-td-muc" aria-labelledby="ck-mh-lap-tieu">
        <h2 id="ck-mh-lap-tieu" className="ck-td-tieu">
          Lập quẻ Mai hoa Dịch số
        </h2>

        <div className="ck-mh-tabs" key={`${cheDoTab}-${soForm}-${ngayForm}-${gioForm}`}>
          <input
            className="ck-mh-radio"
            type="radio"
            name="ck-mh-che-do"
            id="ck-mh-tab-tg"
            defaultChecked={cheDoTab === 'thoi-gian'}
          />
          <input
            className="ck-mh-radio"
            type="radio"
            name="ck-mh-che-do"
            id="ck-mh-tab-so"
            defaultChecked={cheDoTab === 'so'}
          />

          <div className="ck-mh-tab-bar" role="tablist" aria-label="Cách lập quẻ Mai hoa">
            <label htmlFor="ck-mh-tab-tg" className="ck-mh-tab">
              Theo thời gian
            </label>
            <label htmlFor="ck-mh-tab-so" className="ck-mh-tab">
              Theo số
            </label>
          </div>

          <div className="ck-mh-panel ck-mh-panel-tg">
            <form action="/kinh-dich/mai-hoa-dich-so" method="get">
              <div className="ck-mh-form-hang">
                <label className="ck-mh-form-o" htmlFor="ck-mh-ngay">
                  <span>Ngày dương lịch (1900–2100)</span>
                  <input
                    id="ck-mh-ngay"
                    name="ngay"
                    type="date"
                    min="1900-01-01"
                    max="2100-12-31"
                    defaultValue={ngayForm}
                    required
                  />
                </label>

                <label className="ck-mh-form-o" htmlFor="ck-mh-gio">
                  <span>Giờ Việt Nam</span>
                  <input
                    id="ck-mh-gio"
                    name="gio"
                    type="time"
                    defaultValue={gioForm}
                    required
                  />
                </label>

                <button type="submit" className="ck-nut ck-nut-son ck-mh-nut">
                  Lập quẻ lúc này
                </button>
              </div>
              <p className="ck-mh-form-ghi">
                Tự quy đổi sang năm, tháng, ngày âm lịch và chi giờ (giờ Tý 23:00 tính sang ngày hôm sau).
              </p>
            </form>
          </div>

          <div className="ck-mh-panel ck-mh-panel-so">
            <form action="/kinh-dich/mai-hoa-dich-so" method="get">
              <div className="ck-mh-form-hang">
                <label className="ck-mh-form-o" htmlFor="ck-mh-so">
                  <span>Số nguyên dương (vật đếm được)</span>
                  <input
                    id="ck-mh-so"
                    name="so"
                    type="number"
                    min={1}
                    step={1}
                    defaultValue={soForm}
                    placeholder="Ví dụ: 16"
                    required
                  />
                </label>

                <label className="ck-mh-form-o" htmlFor="ck-mh-gio-chi">
                  <span>Giờ chi (Tý 1 … Hợi 12)</span>
                  <select id="ck-mh-gio-chi" name="gio-chi" defaultValue={String(chiGioForm)}>
                    {DIA_CHI.map((chi, idx) => (
                      <option key={chi} value={String(idx)}>
                        {`${chi} · ${KHUNG_GIO[idx]}`}
                      </option>
                    ))}
                  </select>
                </label>

                <button type="submit" className="ck-nut ck-nut-son ck-mh-nut">
                  Lập quẻ theo số
                </button>
              </div>
              <p className="ck-mh-form-ghi">
                Số đã nhập chia 8 lấy thượng quái, chi giờ chia 8 lấy hạ quái, tổng cộng chia 6 lấy hào động.
              </p>
            </form>
          </div>
        </div>

        {loi ? (
          <div className="ck-mh-loi" role="alert">
            {loi}
          </div>
        ) : null}
      </section>

      {/* 3. Kết quả khi có query hợp lệ */}
      {pt ? (
        <>
          <section className="ck-td-muc" aria-labelledby="ck-mh-buoc-tieu">
            <h2 id="ck-mh-buoc-tieu" className="ck-td-tieu">
              Thời điểm và các bước tính
            </h2>

            <div className="ck-mh-thoi-diem">
              {laViDuSach ? (
                <span className="ck-mh-huy-hieu">Ví dụ chép trong sách</span>
              ) : null}
              <span>{moTaDauVao}</span>
            </div>

            <div className="ck-mh-buoc-hop" style={{ marginTop: 12 }}>
              <ol className="ck-mh-buoc">
                {pt.ketQua.moTa.map((dong, idx) => (
                  <li key={idx}>{dong}</li>
                ))}
              </ol>
            </div>
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-mh-ba-que-tieu">
            <h2 id="ck-mh-ba-que-tieu" className="ck-td-tieu">
              Quẻ chủ, quẻ hỗ và quẻ biến
            </h2>

            <div className="ck-mh-bo-ba">
              <TheQueBa
                nhan="Quẻ Chủ"
                que={pt.ketQua.queChu}
                daDung={daDung}
                haoDong={pt.ketQua.haoDong}
              />

              <TheQueBa
                nhan="Quẻ Hỗ"
                que={pt.queHo}
                daDung={daDung}
                ghiChuHo={
                  pt.hoTuQueBien
                    ? 'Càn, Khôn không có hỗ, lấy hỗ của quẻ biến.'
                    : 'Bỏ hào 1 và hào 6; lấy hào 2–4 làm hạ quái, hào 3–5 làm thượng quái.'
                }
              />

              {pt.ketQua.queBien ? (
                <TheQueBa
                  nhan="Quẻ Biến"
                  que={pt.ketQua.queBien}
                  daDung={daDung}
                  haoDong={pt.ketQua.haoDong}
                />
              ) : null}
            </div>

            {pt.hoTuQueBien ? (
              <div style={{ marginTop: 12 }}>
                <TrichNguyenVan {...trichProps(TRICH_MAI_HOA.queHo, 'Lệ quẻ hỗ')} />
              </div>
            ) : null}
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-mh-the-dung-tieu">
            <h2 id="ck-mh-the-dung-tieu" className="ck-td-tieu">
              Thể, dụng và ngũ hành sinh khắc
            </h2>

            <div className="ck-mh-td-luoi">
              <div className="ck-mh-td-cot">
                {theVaDung.map((item) => {
                  const slug = HANH_SLUG[item.quai.hanh as Hanh];
                  return (
                    <article
                      key={item.vai}
                      className={`ck-mh-td-the${item.laThe ? ' ck-mh-td-chinh' : ''}`}
                    >
                      <span className="ck-mh-td-vai">{item.vai}</span>
                      <h3 className="ck-mh-td-ten">Quái {item.quai.ten}</h3>
                      <span className="ck-mh-td-hanh">
                        <i
                          className={`ck-tq-hanh-cham ck-tq-cham-${slug}`}
                          aria-hidden="true"
                        />
                        <span>
                          {item.quai.hanh} · Tượng: {item.quai.tuong}
                        </span>
                      </span>
                    </article>
                  );
                })}
              </div>

              <div className="ck-mh-sodo-khung">
                <SoDoTheDungSvg pt={pt} />
                <div className="ck-mh-qh-ds">
                  {pt.cacQuai.map((item) => (
                    <div key={item.vai} className="ck-mh-qh-o">
                      <span className="ck-mh-qh-vai">{item.tenVai}</span>
                      <span className="ck-mh-qh-quai">
                        {item.quai.ten} ({item.quai.hanh})
                      </span>
                      <span className={`ck-mh-qh-nhan ck-mh-qh-${item.quanHe}`}>
                        {TEN_QUAN_HE[item.quanHe]}
                      </span>
                    </div>
                  ))}
                </div>
                <ChuGiaiHanh />
              </div>
            </div>
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-mh-sach-ghi-tieu">
            <h2 id="ck-mh-sach-ghi-tieu" className="ck-td-tieu">
              Sách ghi về thể và dụng
            </h2>

            <div className={classLoiSach(pt.cacQuai[0].quanHe)}>
              {pt.loiSachTheDung}
            </div>

            <div className="ck-mh-trich-ds">
              <TrichNguyenVan {...trichProps(TRICH_MAI_HOA.sinhKhac)} />
              <TrichNguyenVan {...trichProps(TRICH_MAI_HOA.vaiTro)} />
              <TrichNguyenVan {...trichProps(TRICH_MAI_HOA.quaiKhac)} />
            </div>

            {laViDuSach ? (
              <div style={{ marginTop: 14 }}>
                <TrichNguyenVan
                  {...trichProps(laViDuSach.trich, `Ví dụ: ${laViDuSach.ten}`)}
                />
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      {/* 4. Hai ví dụ trong sách */}
      <section className="ck-td-muc" aria-labelledby="ck-mh-vidu-tieu">
        <h2 id="ck-mh-vidu-tieu" className="ck-td-tieu">
          Ví dụ chép trong sách
        </h2>

        <div className="ck-mh-vidu-luoi">
          {VI_DU_SACH.map((vd) => (
            <article key={vd.ma} className="ck-mh-vidu-the">
              <h3>{vd.ten}</h3>
              <TrichNguyenVan {...trichProps(vd.trich)} />
              <Link
                href={`/kinh-dich/mai-hoa-dich-so?vi-du=${vd.ma}`}
                className="ck-nut ck-nut-vien ck-mh-nut ck-mh-vidu-nut"
              >
                Xem cách tính
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Phép lập quẻ theo sách */}
      <section className="ck-td-muc" aria-label="Phép lập quẻ theo sách">
        <details className="ck-mh-details">
          <summary>Phép lập quẻ theo sách</summary>
          <div className="ck-mh-details-than">
            <div className="ck-mh-bang-boc">
              <table className="ck-mh-bang">
                <thead>
                  <tr>
                    <th scope="col">Số Tiên thiên</th>
                    <th scope="col">Quái</th>
                    <th scope="col">Tượng</th>
                    <th scope="col">Hành</th>
                  </tr>
                </thead>
                <tbody>
                  {BAT_QUAI.map((q) => (
                    <tr key={q.ten}>
                      <td>{q.soTienThien}</td>
                      <td>
                        <strong>{q.ten}</strong>
                      </td>
                      <td>{q.tuong}</td>
                      <td>{q.hanh}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ck-mh-trich-ds">
              <TrichNguyenVan {...trichProps(TRICH_MAI_HOA.soTienThien)} />
              <TrichNguyenVan {...trichProps(TRICH_MAI_HOA.thoiGian)} />
              <TrichNguyenVan {...trichProps(TRICH_MAI_HOA.soVat)} />
              <TrichNguyenVan {...trichProps(TRICH_MAI_HOA.chiaTam)} />
              <TrichNguyenVan {...trichProps(TRICH_MAI_HOA.chiaSau)} />
              <TrichNguyenVan {...trichProps(TRICH_MAI_HOA.queHo)} />
            </div>
          </div>
        </details>
      </section>

      {/* 6. Ghi chú cuối trang & liên kết */}
      <aside className="ck-mh-ghi-chu-cuoi" aria-label="Phạm vi sử dụng">
        <p>
          Trang chỉ tính quẻ và in quan hệ ngũ hành theo sách; không đoán việc thay người xem.
        </p>
        <div className="ck-lien-quan-ds">
          <Link href="/kinh-dich/gieo-que">Gieo quẻ Kinh Dịch</Link>
          <Link href="/kinh-dich/64-que">Bảng 64 quẻ</Link>
          <Link href="/kinh-dich">Tổng quan Kinh Dịch</Link>
        </div>
      </aside>
    </KhungTrang>
  );
}
