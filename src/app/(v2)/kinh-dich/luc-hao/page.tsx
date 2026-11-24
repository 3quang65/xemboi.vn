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
import { daDungKinhDich, duongDanQue } from '@/lib/trang/chu-dich';
import { gieoDongXu, type Hao, type Que } from '@/lib/trang/kinh-dich';
import {
  NGUON_LUC_HAO,
  TAM_CUNG,
  THU_TU_CUNG,
  TRICH_LUC_HAO,
  anQue,
  thoiGianAnQue,
  type QueAn,
  type QueTrongCung,
  type TrichLucHao,
} from '@/lib/trang/luc-hao';
import {
  NGUON_HOA_CHAU_LAM,
  TRICH_NANG_CAO,
  VIEC_HOI,
  dungThanTheoViec,
  haoNangCao,
  phucThan,
  ungKy,
  type HaoNangCao,
  type KetQuaDungThan,
  type MucVuong,
  type PhucThan,
  type QuanHeNgay,
  type TrichNangCao,
} from '@/lib/trang/luc-hao-nang-cao';
import { metaTrang, thongTinTrang, type MacDinhTrang } from '@/lib/trang/meta';
import { GOC_SITE, serializeJsonLd, taoSchemaWebPage } from '../KinhDichHelpers';
import { LienKetKiem } from '../KinhDichUi';
import GieoLucHaoClient from './GieoLucHaoClient';
import '../luc-hao.css';

export const dynamic = 'force-dynamic';

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

const MAC_DINH_LUC_HAO: MacDinhTrang = {
  title: 'Lục hào nạp giáp: an quẻ, lục thân, thế ứng, lục thần',
  h1: 'An quẻ Lục hào',
  description:
    'An quẻ Lục hào theo Tăng san bốc Dịch: tám cung, thế ứng, nạp chi, lục thân, hào biến, lục thần, tuần không và nguyệt phá.',
};

const CAU_DOC_NHANH =
  'Lục hào gieo 3 đồng xu sáu lần để được quẻ, rồi an cho mỗi hào một địa chi (nạp giáp), một lục thân theo hành của cung, đánh dấu hào thế và hào ứng; ngày gieo cho lục thần và tuần không, tháng gieo cho nguyệt phá.';

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

function phanTichXu(raw: string): { giaTri?: number[]; loi?: string } {
  const clean = raw.trim();
  const parts = /[\s,]/.test(clean)
    ? clean.split(/[\s,]+/).filter(Boolean)
    : [...clean];
  if (parts.length !== 6 || parts.some((p) => !/^[6789]$/.test(p))) {
    return {
      loi: 'Cần nhập đúng 6 số 6, 7, 8 hoặc 9 từ hào 1 (dưới) lên hào 6 (trên), ví dụ 789678.',
    };
  }
  return { giaTri: parts.map(Number) };
}

function tenQueHienThi(q: Que): string {
  if (q.thuong.ten === q.ha.ten) {
    return `${q.ten} (${q.thuong.ten} vi ${q.thuong.tuong})`;
  }
  return q.ten;
}

function trichProps(t: TrichLucHao, nhan?: string) {
  return {
    dich: t.dich,
    viTriViet: t.viTriViet,
    doanId: t.doanId,
    tenSach: NGUON_LUC_HAO.tenHanViet,
    tacGia: NGUON_LUC_HAO.tacGia,
    nienDai: NGUON_LUC_HAO.nienDai,
    ghiCong: NGUON_LUC_HAO.ghiCong,
    url: NGUON_LUC_HAO.url,
    nhan,
  };
}

function trichNangCaoProps(t: TrichNangCao, nhan?: string) {
  const nguon = t.nguon === 'WS09' ? NGUON_HOA_CHAU_LAM : NGUON_LUC_HAO;
  return {
    dich: t.dich,
    viTriViet: t.viTriViet,
    doanId: t.doanId,
    tenSach: nguon.tenHanViet,
    tacGia: nguon.tacGia,
    nienDai: nguon.nienDai,
    ghiCong: nguon.ghiCong,
    url: nguon.url,
    nhan,
  };
}

function classVuongSuy(muc: MucVuong): string {
  if (muc === 'Hưu tù') return 'ck-lh-nhan-vs ck-lh-nhan-hp';
  return 'ck-lh-nhan-vs ck-lh-nhan-tot';
}

function classNhatThan(qh: QuanHeNgay): string {
  if (qh === 'Nhật phá' || qh === 'Ngày khắc' || qh === 'Ngày xung') {
    return 'ck-lh-nhan-nt ck-lh-nhan-hp';
  }
  return 'ck-lh-nhan-nt ck-lh-nhan-tot';
}

function chuVuongSuy(h: HaoNangCao): string {
  if (!h.vuongSuy) return '';
  const phu: string[] = [];
  if (h.vuongSuy.lamNguyetKien) phu.push('lâm nguyệt kiến');
  if (h.vuongSuy.duKhi) phu.push('dư khí');
  return phu.length ? `${h.vuongSuy.muc}, ${phu.join(', ')}` : h.vuongSuy.muc;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/kinh-dich/luc-hao', MAC_DINH_LUC_HAO),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: `${GOC_SITE}/kinh-dich/luc-hao` },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function LucHaoPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/kinh-dich/luc-hao', MAC_DINH_LUC_HAO),
    searchParams,
  ]);
  const daDung = daDungKinhDich();
  const jsonLd = taoSchemaWebPage(tt);

  const vnNow = new Date(Date.now() + 7 * 3600_000);
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const ngayMacDinh = `${vnNow.getUTCFullYear()}-${pad2(vnNow.getUTCMonth() + 1)}-${pad2(vnNow.getUTCDate())}`;
  const gioMacDinh = `${pad2(vnNow.getUTCHours())}:${pad2(vnNow.getUTCMinutes())}`;

  const xuRaw = layMot(sp.xu)?.trim();
  const gieoRaw = layMot(sp.gieo)?.trim();
  const ngayRaw = layMot(sp.ngay)?.trim();
  const gioRaw = layMot(sp.gio)?.trim();
  const viecRaw = layMot(sp.viec)?.trim() ?? '';
  const viecHopLe = VIEC_HOI.some((v) => v.ma === viecRaw) ? viecRaw : '';

  let loi: string | null = null;
  let giaTri: number[] | null = null;
  let ngayForm = ngayMacDinh;
  let gioForm = gioMacDinh;

  if (xuRaw !== undefined && xuRaw !== '') {
    const kq = phanTichXu(xuRaw);
    if (kq.loi) {
      loi = kq.loi;
    } else if (kq.giaTri) {
      giaTri = kq.giaTri;
    }
  } else if (gieoRaw === '1') {
    const g = gieoDongXu();
    giaTri = g.giaTriHao ?? null;
  }

  let qa: QueAn | null = null;
  let dongHaoSo: number[] = [];
  let tgSo: ReturnType<typeof thoiGianAnQue> | null = null;

  if (giaTri && !loi) {
    const ngayOk = ngayRaw ? docNgayIso(ngayRaw) : docNgayIso(ngayMacDinh);
    const gioOk = gioRaw
      ? docGioPhut(gioRaw)
      : ngayRaw
        ? { gio: 12, phut: 0 }
        : docGioPhut(gioMacDinh);

    if (!ngayOk) {
      loi = 'Ngày gieo không hợp lệ (cần dạng YYYY-MM-DD trong khoảng 1900–2100).';
    } else if (!gioOk) {
      loi = 'Giờ gieo không hợp lệ (cần dạng HH:MM từ 00:00 đến 23:59).';
    } else {
      ngayForm = `${ngayOk.nam}-${pad2(ngayOk.thang)}-${pad2(ngayOk.ngay)}`;
      gioForm = `${pad2(gioOk.gio)}:${pad2(gioOk.phut)}`;
      const hao = giaTri.map((x) => (x % 2) as Hao);
      dongHaoSo = giaTri.flatMap((x, i) => (x === 6 || x === 9 ? [i + 1] : []));
      tgSo = thoiGianAnQue(
        ngayOk.ngay,
        ngayOk.thang,
        ngayOk.nam,
        gioOk.gio,
        gioOk.phut,
      );
      qa = anQue(hao, dongHaoSo, tgSo);
    }
  } else if (ngayRaw && !ngayRaw.match(/^\d{4}-\d{2}-\d{2}$/)) {
    loi = 'Ngày gieo không hợp lệ (cần dạng YYYY-MM-DD trong khoảng 1900–2100).';
  }

  const dsHaoNC: HaoNangCao[] =
    qa && tgSo ? haoNangCao(qa, tgSo.chiThang, tgSo.chiNgay) : [];
  const dsPhuc: PhucThan[] = qa ? phucThan(qa) : [];
  const phucTheoViTri = new Map<number, PhucThan[]>();
  for (const p of dsPhuc) {
    const arr = phucTheoViTri.get(p.viTri) ?? [];
    arr.push(p);
    phucTheoViTri.set(p.viTri, arr);
  }
  const kqDung: KetQuaDungThan | null =
    qa && tgSo && viecHopLe
      ? dungThanTheoViec(qa, dsHaoNC, viecHopLe, tgSo.chiThang)
      : null;

  const theDocNhanh: TheDocNhanhItem[] = qa
    ? [
        {
          ma: 'cung',
          nhan: 'Cung quẻ',
          giaTri: `${qa.cung.ten} (${qa.hanhCung})`,
          hanh: qa.hanhCung,
          chiTiet: `${qa.tenThuTu}. Lục thân tính theo hành ${qa.hanhCung} của cung.`,
        },
        {
          ma: 'the-ung',
          nhan: 'Thế và Ứng',
          giaTri: `Thế H${qa.hao.find((h) => h.theUng === 'Thế')?.viTri ?? ''} · Ứng H${qa.hao.find((h) => h.theUng === 'Ứng')?.viTri ?? ''}`,
          muc: 'binh',
          chiTiet: 'Theo sách: cách hào Thế hai vị là hào Ứng.',
        },
        {
          ma: 'tinh-chat',
          nhan: 'Xung / Hợp & Biến',
          giaTri: qa.lucXung
            ? 'Lục xung'
            : qa.lucHop
              ? 'Lục hợp'
              : qa.queBien
                ? `${dongHaoSo.length} hào động`
                : 'Quẻ tĩnh',
          muc: qa.lucXung ? 'diu' : qa.lucHop ? 'tot' : 'binh',
          chiTiet: qa.queBien
            ? `Biến thành ${tenQueHienThi(qa.queBien)}.`
            : 'Sáu hào đều tĩnh, không có quẻ biến.',
        },
      ]
    : [
        {
          ma: 'cung',
          nhan: 'Tám cung',
          giaTri: '64 quẻ · 8 cung',
          muc: 'binh',
          chiTiet: 'Mỗi quẻ thuộc một trong tám cung, định hành để an lục thân.',
        },
        {
          ma: 'nap-giap',
          nhan: 'Nạp giáp & Lục thần',
          giaTri: '6 địa chi + 6 thần',
          muc: 'binh',
          chiTiet: 'Nạp địa chi theo quái trong, quái ngoài; lục thần theo can ngày.',
        },
        {
          ma: 'tuan-khong',
          nhan: 'Tuần không & Nguyệt phá',
          giaTri: 'Theo ngày & tiết tháng',
          muc: 'binh',
          chiTiet: 'Hai chi vắng trong tuần giáp là tuần không; chi xung tháng là nguyệt phá.',
        },
      ];

  const nhom8Cung: { cung: QueTrongCung['cung']; ds: QueTrongCung[] }[] =
    THU_TU_CUNG.map((tenCung) => {
      const ds = TAM_CUNG.filter((x) => x.cung.ten === tenCung).sort(
        (a, b) => a.thuTu - b.thuTu,
      );
      return { cung: ds[0].cung, ds };
    });

  const cacHaoTuTren = [...dsHaoNC].reverse();

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/kinh-dich/luc-hao"
      tenCuoi="Lục hào"
      toi
      rong
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1. Đọc nhanh & thẻ sách nguồn */}
      <DocNhanh cau={CAU_DOC_NHANH} the={theDocNhanh} tieuDeId="ck-lh-dn-tieu" luoiCot={3} />
      <aside className="ck-lh-nguon-the" aria-label="Sách nguồn phép Lục hào">
        <strong>Sách gốc:</strong> <em>{NGUON_LUC_HAO.tenHanViet}</em> ({NGUON_LUC_HAO.tacGia}, đời{' '}
        {NGUON_LUC_HAO.nienDai}).{' '}
        <a href={NGUON_LUC_HAO.url} target="_blank" rel="noopener noreferrer nofollow">
          {NGUON_LUC_HAO.ghiCong}
        </a>
        .
      </aside>

      {/* 2. Form gieo / nhập xu */}
      <section className="ck-td-muc" aria-labelledby="ck-lh-form-tieu">
        <h2 id="ck-lh-form-tieu" className="ck-td-tieu">
          Gieo hoặc nhập 6 hào đồng xu
        </h2>

        <div key={`${giaTri?.join('') ?? ''}-${ngayForm}-${gioForm}-${viecHopLe}`}>
          <GieoLucHaoClient
            xuMacDinh={giaTri ? giaTri.join('') : xuRaw ?? ''}
            ngayMacDinh={ngayForm}
            gioMacDinh={gioForm}
            viecMacDinh={viecHopLe}
          />
        </div>

        {loi ? (
          <div className="ck-lh-loi" role="alert">
            {loi}
          </div>
        ) : null}
      </section>

      {/* 3. Kết quả an quẻ */}
      {qa && giaTri ? (
        <section className="ck-td-muc" aria-labelledby="ck-lh-ket-qua-tieu">
          <h2 id="ck-lh-ket-qua-tieu" className="ck-td-tieu">
            Quẻ đã an
          </h2>

          <div className="ck-lh-ten-bar">
            {daDung.has(duongDanQue(qa.que)) ? (
              <Link href={duongDanQue(qa.que)} className="ck-lh-que-link">
                #{qa.que.so} {tenQueHienThi(qa.que)}
              </Link>
            ) : (
              <span className="ck-lh-que-chu">
                #{qa.que.so} {tenQueHienThi(qa.que)}
              </span>
            )}

            <span className="ck-lh-cung-meta">
              cung <strong>{qa.cung.ten}</strong> ({qa.hanhCung})
            </span>

            <span className="ck-lh-nhan ck-lh-nhan-thutu">{qa.tenThuTu}</span>

            {qa.lucXung ? (
              <span className="ck-lh-nhan ck-lh-nhan-xung">Lục xung</span>
            ) : null}
            {qa.lucHop ? (
              <span className="ck-lh-nhan ck-lh-nhan-hop">Lục hợp</span>
            ) : null}

            {qa.queBien ? (
              <span className="ck-lh-bien-link">
                biến{' '}
                <LienKetKiem href={duongDanQue(qa.queBien)} daDung={daDung}>
                  {tenQueHienThi(qa.queBien)}
                </LienKetKiem>
              </span>
            ) : null}
          </div>

          {qa.thoiGian ? (
            <div className="ck-lh-thoi-gian">
              Tháng <strong>{qa.thoiGian.thang}</strong> · Ngày{' '}
              <strong>{qa.thoiGian.ngay}</strong> · Tuần không{' '}
              <strong>{qa.thoiGian.tuanKhong.join(', ')}</strong>
            </div>
          ) : null}

          <div className="ck-lh-bang-khung">
            <table className="ck-lh-bang">
              <thead>
                <tr>
                  <th scope="col" className="ck-lh-col-than6">
                    Lục thần
                  </th>
                  <th scope="col">Lục thân</th>
                  <th scope="col">Chi · Hành</th>
                  <th scope="col" className="ck-lh-col-vs">
                    Vượng suy
                  </th>
                  <th scope="col" className="ck-lh-col-nhat">
                    Nhật thần
                  </th>
                  <th scope="col" className="ck-lh-col-hinh">
                    Hình hào
                  </th>
                  <th scope="col">Thế / Ứng</th>
                  <th scope="col">Hào biến</th>
                </tr>
              </thead>
              <tbody>
                {cacHaoTuTren.map((h) => {
                  const slugHanh = HANH_SLUG[h.hanh];
                  const xuHao = giaTri[h.viTri - 1];
                  const kyDong = h.hao === 1 ? '○' : '×';
                  const slugBien = h.bien ? HANH_SLUG[h.bien.hanh] : null;
                  const phucTaiHao = phucTheoViTri.get(h.viTri) ?? [];

                  const laDung = kqDung
                    ? kqDung.cacHao.some((x) => x.viTri === h.viTri)
                    : false;
                  const laChonVuong = kqDung ? kqDung.haoVuong === h.viTri : false;
                  const laNguyen = kqDung
                    ? kqDung.nguyen.cacHao.includes(h.viTri)
                    : false;
                  const laKy = kqDung ? kqDung.ky.cacHao.includes(h.viTri) : false;
                  const laCuu = kqDung ? kqDung.cuu.cacHao.includes(h.viTri) : false;

                  const rowCls = [
                    h.dong ? 'ck-lh-hang-dong' : '',
                    laDung ? 'ck-lh-hang-dung' : '',
                    laChonVuong ? 'ck-lh-hang-vuong' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <tr key={h.viTri} className={rowCls || undefined}>
                      <td className="ck-lh-col-than6">{h.lucThan6 ?? '—'}</td>

                      <td>
                        <div className="ck-lh-than-dong">
                          <span className="ck-lh-hao-vi">H{h.viTri}</span>
                          <span className="ck-lh-luc-than">{h.lucThan}</span>
                        </div>
                        {laDung || laNguyen || laKy || laCuu ? (
                          <div className="ck-lh-vai-ds">
                            {laDung ? (
                              <span className="ck-lh-vai ck-lh-vai-tot">Dụng</span>
                            ) : null}
                            {laChonVuong ? (
                              <span className="ck-lh-vai ck-lh-vai-tot">Chọn vượng</span>
                            ) : null}
                            {laNguyen ? (
                              <span className="ck-lh-vai ck-lh-vai-tot">Nguyên</span>
                            ) : null}
                            {laKy ? (
                              <span className="ck-lh-vai ck-lh-vai-hp">Kỵ</span>
                            ) : null}
                            {laCuu ? (
                              <span className="ck-lh-vai ck-lh-vai-hp">Cừu</span>
                            ) : null}
                          </div>
                        ) : null}
                        {h.lucThan6 ? (
                          <span className="ck-lh-than6-phu">{h.lucThan6}</span>
                        ) : null}
                      </td>

                      <td>
                        <span className="ck-lh-chi-hang">
                          <i
                            className={`ck-tq-hanh-cham ck-tq-cham-${slugHanh}`}
                            aria-hidden="true"
                          />
                          <strong>{h.chi}</strong>
                          <span>{h.hanh}</span>
                          {h.dong ? (
                            <span className="ck-lh-dong-phu">
                              {kyDong} động ({xuHao})
                            </span>
                          ) : null}
                        </span>
                        {phucTaiHao.map((p) => {
                          const trungDung = Boolean(
                            kqDung?.phuc.some(
                              (x) => x.viTri === p.viTri && x.lucThan === p.lucThan,
                            ),
                          );
                          return (
                            <div
                              key={`${p.viTri}-${p.lucThan}`}
                              className={`ck-lh-phuc-dong${trungDung ? ' ck-lh-phuc-dung' : ''}`}
                            >
                              Phục: <strong>{p.lucThan}</strong> {p.chi} {p.hanh}
                            </div>
                          );
                        })}
                        {h.tuanKhong || h.nguyetPha ? (
                          <div className="ck-lh-tag-list">
                            {h.tuanKhong ? (
                              <span className="ck-lh-tag">Tuần không</span>
                            ) : null}
                            {h.nguyetPha ? (
                              <span className="ck-lh-tag">Nguyệt phá</span>
                            ) : null}
                          </div>
                        ) : null}
                        {h.vuongSuy ? (
                          <div className="ck-lh-vs-phu">
                            <span className={classVuongSuy(h.vuongSuy.muc)}>
                              {chuVuongSuy(h)}
                            </span>
                            {h.nhatThan.map((nt) => (
                              <span key={nt} className={classNhatThan(nt)}>
                                {nt}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </td>

                      <td className="ck-lh-col-vs">
                        {h.vuongSuy ? (
                          <div className="ck-lh-vs-o">
                            <span className={classVuongSuy(h.vuongSuy.muc)}>
                              {h.vuongSuy.muc}
                            </span>
                            {h.vuongSuy.lamNguyetKien || h.vuongSuy.duKhi ? (
                              <span className="ck-lh-vs-chu">
                                {', '}
                                {[
                                  h.vuongSuy.lamNguyetKien ? 'lâm nguyệt kiến' : '',
                                  h.vuongSuy.duKhi ? 'dư khí' : '',
                                ]
                                  .filter(Boolean)
                                  .join(', ')}
                              </span>
                            ) : null}
                          </div>
                        ) : (
                          <span className="ck-lh-tinh">—</span>
                        )}
                      </td>

                      <td className="ck-lh-col-nhat">
                        {h.nhatThan.length > 0 ? (
                          <div className="ck-lh-nt-ds">
                            {h.nhatThan.map((nt) => (
                              <span key={nt} className={classNhatThan(nt)}>
                                {nt}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="ck-lh-tinh">—</span>
                        )}
                      </td>

                      <td className="ck-lh-col-hinh">
                        <div className="ck-lh-hinh-o">
                          <span className="ck-lh-vach" aria-hidden="true">
                            {h.hao === 1 ? (
                              <i className="ck-lh-lien" />
                            ) : (
                              <>
                                <i className="ck-lh-dut" />
                                <i className="ck-lh-dut" />
                              </>
                            )}
                          </span>
                          {h.dong ? (
                            <span className="ck-lh-dau-dong">
                              {kyDong} ({xuHao})
                            </span>
                          ) : (
                            <span className="ck-lh-tinh">{xuHao}</span>
                          )}
                        </div>
                      </td>

                      <td>
                        {h.theUng === 'Thế' ? (
                          <span className="ck-lh-the-ung ck-lh-the">Thế</span>
                        ) : h.theUng === 'Ứng' ? (
                          <span className="ck-lh-the-ung ck-lh-ung">Ứng</span>
                        ) : (
                          <span className="ck-lh-tinh">—</span>
                        )}
                      </td>

                      <td>
                        {h.bien && slugBien ? (
                          <span className="ck-lh-chi-hang">
                            <span className="ck-lh-luc-than">{h.bien.lucThan}</span>
                            <i
                              className={`ck-tq-hanh-cham ck-tq-cham-${slugBien}`}
                              aria-hidden="true"
                            />
                            <span>
                              {h.bien.chi} {h.bien.hanh}
                            </span>
                          </span>
                        ) : (
                          <span className="ck-lh-tinh">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 12 }}>
            <ChuGiaiHanh />
          </div>

          {dsPhuc.length > 0 ? (
            <div className="ck-lh-khoi-phu">
              <p className="ck-lh-phuc-tomtat">
                <strong>Phục thần vắng trong quẻ:</strong>{' '}
                {dsPhuc
                  .map((p) => `${p.lucThan} ${p.chi} ${p.hanh} (dưới hào ${p.viTri} ${p.phiThan.chi})`)
                  .join('; ')}
                .
              </p>
              <TrichNguyenVan {...trichNangCaoProps(TRICH_NANG_CAO.phucThan, 'Phục thần')} />
            </div>
          ) : null}

          {kqDung && tgSo ? (
            <div className="ck-lh-dung-khung">
              <div className="ck-lh-dung-dau">
                <div>
                  <h3 className="ck-lh-dung-tieu">Dụng thần: {kqDung.lucThan}</h3>
                  <p className="ck-lh-dung-viec">Việc hỏi: {kqDung.viec.ten}</p>
                </div>
              </div>

              {kqDung.cacHao.length > 0 ? (
                <p className="ck-lh-dung-dong">
                  <strong>Hào dụng thần trong quẻ:</strong>{' '}
                  {kqDung.cacHao.map((h) => `hào ${h.viTri} (${h.chi} ${h.hanh})`).join(', ')}.
                  {kqDung.haoVuong !== null
                    ? ` Theo sách chọn hào vượng: hào ${kqDung.haoVuong}.`
                    : ''}
                </p>
              ) : (
                <p className="ck-lh-dung-dong">
                  <strong>Dụng thần: {kqDung.lucThan}</strong> — vắng trong quẻ chính, nằm ở phục thần:{' '}
                  {kqDung.phuc.length > 0
                    ? kqDung.phuc
                        .map((p) => `${p.lucThan} ${p.chi} ${p.hanh} (dưới hào ${p.viTri})`)
                        .join('; ')
                    : 'không có trong bản cung'}
                  .
                </p>
              )}

              {kqDung.nguyetKien ? (
                <div className="ck-lh-nguyet-kien-box">
                  <p className="ck-lh-dung-dong">
                    <strong>Nguyệt kiến mang đúng hành dụng thần</strong> — sách lấy nguyệt kiến làm dụng thần, không cần tìm phục.
                  </p>
                  <TrichNguyenVan
                    {...trichNangCaoProps(TRICH_NANG_CAO.nguyetKienDung, 'Nguyệt kiến làm dụng thần')}
                  />
                </div>
              ) : null}

              <div className="ck-lh-nkc-luoi">
                <div className="ck-lh-nkc-the ck-lh-nkc-tot">
                  <span className="ck-lh-nkc-nhan">Nguyên thần</span>
                  <strong>{kqDung.nguyen.lucThan}</strong>
                  <small>
                    {kqDung.nguyen.cacHao.length > 0
                      ? `Hào ${kqDung.nguyen.cacHao.join(', ')}`
                      : 'Vắng trong quẻ chính'}
                  </small>
                </div>
                <div className="ck-lh-nkc-the ck-lh-nkc-hp">
                  <span className="ck-lh-nkc-nhan">Kỵ thần</span>
                  <strong>{kqDung.ky.lucThan}</strong>
                  <small>
                    {kqDung.ky.cacHao.length > 0
                      ? `Hào ${kqDung.ky.cacHao.join(', ')}`
                      : 'Vắng trong quẻ chính'}
                  </small>
                </div>
                <div className="ck-lh-nkc-the ck-lh-nkc-hp">
                  <span className="ck-lh-nkc-nhan">Cừu thần</span>
                  <strong>{kqDung.cuu.lucThan}</strong>
                  <small>
                    {kqDung.cuu.cacHao.length > 0
                      ? `Hào ${kqDung.cuu.cacHao.join(', ')}`
                      : 'Vắng trong quẻ chính'}
                  </small>
                </div>
              </div>

              <div className="ck-lh-trich-ds">
                <TrichNguyenVan
                  {...trichNangCaoProps(TRICH_NANG_CAO[kqDung.viec.trich], 'Dụng thần')}
                />
                <TrichNguyenVan
                  {...trichNangCaoProps(TRICH_NANG_CAO.nguyenKyCuu, 'Nguyên, Kỵ, Cừu thần')}
                />
                {kqDung.cacHao.length > 1 ? (
                  <TrichNguyenVan
                    {...trichNangCaoProps(TRICH_NANG_CAO.chonHaoVuong, 'Nhiều hào dụng thần')}
                  />
                ) : null}
              </div>

              <div style={{ marginTop: 14 }}>
                <details className="ck-lh-details">
                  <summary>Mốc ứng kỳ theo sách</summary>
                  <div className="ck-lh-ung-than">
                    <p className="ck-lh-ung-luu-y">
                      Sách nêu các mốc có thể ứng; trang không chọn mốc nào.
                    </p>
                    {kqDung.cacHao.length > 0 ? (
                      <div className="ck-lh-ung-ds">
                        {kqDung.cacHao.map((h) => {
                          const dsMoc = ungKy(h, tgSo.chiThang, tgSo.chiNgay);
                          return (
                            <div key={h.viTri} className="ck-lh-ung-hao">
                              <h4>
                                Hào {h.viTri} · {h.lucThan} {h.chi} ({h.hanh})
                              </h4>
                              <ul>
                                {dsMoc.map((m, idx) => (
                                  <li key={idx}>
                                    <span>{m.dieuKien}</span> →{' '}
                                    <strong>ngày {m.ngay.join(', ')}</strong>
                                    {m.thang?.length ? (
                                      <>
                                        {' '}
                                        (<strong>tháng {m.thang.join(', ')}</strong>)
                                      </>
                                    ) : null}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="ck-lh-ung-luu-y">
                        Dụng thần vắng trong quẻ chính, nằm ở phục thần (xem phục thần ở bảng trên).
                      </p>
                    )}
                    <div style={{ marginTop: 12 }}>
                      <TrichNguyenVan {...trichNangCaoProps(TRICH_NANG_CAO.ungKy, 'Ứng kỳ')} />
                    </div>
                  </div>
                </details>
              </div>
            </div>
          ) : null}

          <div style={{ marginTop: 16 }}>
            <details className="ck-lh-details">
              <summary>Các bước an quẻ theo sách</summary>
              <div className="ck-lh-trich-ds">
                <TrichNguyenVan {...trichProps(TRICH_LUC_HAO.tamCung, 'Tám cung')} />
                <TrichNguyenVan {...trichProps(TRICH_LUC_HAO.theUng, 'Thế và Ứng')} />
                <TrichNguyenVan {...trichProps(TRICH_LUC_HAO.napChi, 'Nạp chi')} />
                <TrichNguyenVan {...trichProps(TRICH_LUC_HAO.lucThan, 'Lục thân')} />
                <TrichNguyenVan {...trichProps(TRICH_LUC_HAO.haoBien, 'Hào biến')} />
                <TrichNguyenVan {...trichProps(TRICH_LUC_HAO.lucThan6, 'Lục thần')} />
                <TrichNguyenVan {...trichProps(TRICH_LUC_HAO.tuanKhong, 'Tuần không')} />
                <TrichNguyenVan {...trichProps(TRICH_LUC_HAO.lucHop, 'Lục hợp và Lục xung')} />
                <TrichNguyenVan {...trichNangCaoProps(TRICH_NANG_CAO.vuongTuong, 'Vượng tướng bốn mùa')} />
                <TrichNguyenVan {...trichNangCaoProps(TRICH_NANG_CAO.amDong, 'Ám động và Nhật phá')} />
              </div>
            </details>
          </div>
        </section>
      ) : null}

      {/* 4. Bảng 64 quẻ theo tám cung */}
      <section className="ck-td-muc" aria-label="Bảng 64 quẻ theo tám cung">
        <details className="ck-lh-details">
          <summary>64 quẻ theo tám cung</summary>
          <div className="ck-lh-tam-cung">
            {nhom8Cung.map(({ cung, ds }) => (
              <div key={cung.ten} className="ck-lh-cung-cot">
                <h3 className="ck-lh-cung-dau">
                  Cung {cung.ten} ({cung.hanh})
                </h3>
                {ds.map((item) => {
                  const href = duongDanQue(item.que);
                  const tenQue = tenQueHienThi(item.que);
                  return (
                    <LienKetKiem
                      key={item.que.so}
                      href={href}
                      daDung={daDung}
                      className="ck-lh-cung-o"
                    >
                      <strong>{tenQue}</strong>
                      <small>Thế {item.the}</small>
                    </LienKetKiem>
                  );
                })}
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* 5. Ghi chú cuối trang & liên kết */}
      <aside className="ck-lh-ghi-chu-cuoi" aria-label="Phạm vi sử dụng">
        <p>Trang chỉ an quẻ theo sách, không luận việc.</p>
        <div className="ck-lien-quan-ds">
          <Link href="/kinh-dich/gieo-que">Gieo quẻ Kinh Dịch</Link>
          <Link href="/kinh-dich/mai-hoa-dich-so">Mai hoa Dịch số</Link>
          <Link href="/kinh-dich/64-que">Bảng 64 quẻ</Link>
          <Link href="/kinh-dich">Tổng quan Kinh Dịch</Link>
        </div>
      </aside>
    </KhungTrang>
  );
}
