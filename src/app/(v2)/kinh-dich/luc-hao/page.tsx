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
      const tg = thoiGianAnQue(
        ngayOk.ngay,
        ngayOk.thang,
        ngayOk.nam,
        gioOk.gio,
        gioOk.phut,
      );
      qa = anQue(hao, dongHaoSo, tg);
    }
  } else if (ngayRaw && !ngayRaw.match(/^\d{4}-\d{2}-\d{2}$/)) {
    loi = 'Ngày gieo không hợp lệ (cần dạng YYYY-MM-DD trong khoảng 1900–2100).';
  }

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

  const cacHaoTuTren = qa ? [...qa.hao].reverse() : [];

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

        <div key={`${giaTri?.join('') ?? ''}-${ngayForm}-${gioForm}`}>
          <GieoLucHaoClient
            xuMacDinh={giaTri ? giaTri.join('') : xuRaw ?? ''}
            ngayMacDinh={ngayForm}
            gioMacDinh={gioForm}
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

                  return (
                    <tr
                      key={h.viTri}
                      className={h.dong ? 'ck-lh-hang-dong' : undefined}
                    >
                      <td className="ck-lh-col-than6">{h.lucThan6 ?? '—'}</td>

                      <td>
                        <span className="ck-lh-hao-vi">H{h.viTri}</span>
                        <span className="ck-lh-luc-than">{h.lucThan}</span>
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
