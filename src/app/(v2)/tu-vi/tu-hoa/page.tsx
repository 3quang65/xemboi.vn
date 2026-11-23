import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { DocNhanh, TrichNguyenVan, type TheDocNhanhItem } from '@/components/ck/truc-quan';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  BANG_TU_HOA,
  BON_HOA,
  GHI_CHU_TU_HOA,
  SO_PHAI_TU_HOA,
  TRICH_TU_HOA,
  canCuaNam,
  tuHoaCuaCan,
  type DongTuHoa,
  type MaHoa,
} from '@/lib/trang/tu-hoa';

const MAC_DINH_TU_HOA = {
  title: 'Tứ Hóa tử vi: bảng Hóa Lộc, Quyền, Khoa, Kỵ cho 10 thiên can',
  h1: 'Tứ Hóa (Lộc, Quyền, Khoa, Kỵ)',
  description:
    'Bảng Tứ Hóa theo 10 thiên can năm sinh: bộ sao an lá số, câu phú Tử Vi Đẩu Số toàn thư dịch nghĩa và đối chiếu chỗ khác nhau giữa các phái.',
};

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

function layMot(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function kiemCoThamSo(sp: Record<string, string | string[] | undefined>): boolean {
  return Object.values(sp).some((v) =>
    Array.isArray(v)
      ? v.some((item) => item.trim() !== '')
      : typeof v === 'string' && v.trim() !== '',
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/tu-vi/tu-hoa', MAC_DINH_TU_HOA),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/tu-vi/tu-hoa' },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

const NHAN_TRONG_CAU: Record<MaHoa, string> = {
  loc: 'hóa Lộc',
  quyen: 'hóa Quyền',
  khoa: 'hóa Khoa',
  ky: 'hóa Kỵ',
};

export default async function TuViTuHoaPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/tu-vi/tu-hoa', MAC_DINH_TU_HOA),
    searchParams,
  ]);

  const namRaw = layMot(sp.nam)?.trim() ?? '';
  let loi: string | null = null;
  let namChon: number | null = null;
  let dongChon: DongTuHoa | null = null;

  if (namRaw !== '') {
    const n = Number(namRaw);
    if (!/^\d+$/.test(namRaw) || !Number.isInteger(n) || n < 1900 || n > 2100) {
      loi = 'Năm tra Tứ Hóa hợp lệ nằm trong khoảng 1900–2100.';
    } else {
      namChon = n;
      dongChon = tuHoaCuaCan(canCuaNam(n));
    }
  }

  const cauDocNhanh = dongChon && namChon
    ? `Năm ${namChon} can ${dongChon.can}: ${BON_HOA.map((h) => `${dongChon.sao[h.ma].ten} ${NHAN_TRONG_CAU[h.ma]}`).join(', ')}.`
    : 'Bảng Tứ Hóa theo 10 thiên can năm sinh: mỗi can an bốn sao Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ; riêng Canh và Nhâm có khác nhau giữa các phái.';

  const theDocNhanh: TheDocNhanhItem[] =
    dongChon && namChon
      ? [
          {
            ma: 'loc',
            nhan: 'Hóa Lộc',
            giaTri: dongChon.sao.loc.ten,
            muc: 'tot',
            chiTiet: `Năm ${namChon} (can ${dongChon.can}): ${dongChon.sao.loc.ten} hóa Lộc.`,
          },
          {
            ma: 'quyen',
            nhan: 'Hóa Quyền',
            giaTri: dongChon.sao.quyen.ten,
            chiTiet: `Năm ${namChon} (can ${dongChon.can}): ${dongChon.sao.quyen.ten} hóa Quyền.`,
          },
          {
            ma: 'khoa',
            nhan: 'Hóa Khoa',
            giaTri: dongChon.sao.khoa.ten,
            chiTiet: `Năm ${namChon} (can ${dongChon.can}): ${dongChon.sao.khoa.ten} hóa Khoa.`,
          },
          {
            ma: 'ky',
            nhan: 'Hóa Kỵ',
            giaTri: dongChon.sao.ky.ten,
            muc: 'diu',
            chiTiet: dongChon.khacPhai
              ? `Can ${dongChon.can} có chỗ khác nhau giữa các phái (xem bảng So phái bên dưới).`
              : `Năm ${namChon} (can ${dongChon.can}): ${dongChon.sao.ky.ten} hóa Kỵ.`,
          },
        ]
      : [
          {
            ma: 'tong-can',
            nhan: 'Số dòng bảng',
            giaTri: '10 thiên can',
            chiTiet: 'Từ Giáp đến Quý theo can của năm âm lịch.',
          },
          {
            ma: 'thong-nhat',
            nhan: 'Thống nhất giữa các sách',
            giaTri: '8 can',
            chiTiet: 'Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Tân, Quý ghi giống nhau ở các sách.',
          },
          {
            ma: 'khac-phai',
            nhan: 'Khác nhau theo phái',
            giaTri: 'Canh · Nhâm',
            muc: 'diu',
            chiTiet: 'Chỉ có hai can Canh và Nhâm khác ở Hóa Khoa hoặc Hóa Kỵ.',
          },
        ];

  const dichPhu = [...TRICH_TU_HOA.dich, '', TRICH_TU_HOA.giaiThich].join('\n');

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/tu-vi/tu-hoa"
      tenCuoi="Tứ Hóa"
      toi
    >
      <div className="ck-th-form-khung">
        <form className="ck-to-giay" action="/tu-vi/tu-hoa" method="get">
          <HoaVanGoc4 />
          <div className="ck-form-tit">
            <HoaVanMay />
            <h2>Tra Tứ Hóa theo năm âm lịch</h2>
            <HoaVanMay flipped />
          </div>

          {loi ? (
            <div className="ck-th-loi" role="alert">
              {loi}
            </div>
          ) : null}

          <div className="ck-th-form-hang">
            <label className="ck-o-con" htmlFor="ck-th-nam">
              <span>Năm sinh âm lịch (1900–2100)</span>
              <input
                id="ck-th-nam"
                name="nam"
                type="number"
                min={1900}
                max={2100}
                defaultValue={namChon ?? 1990}
                inputMode="numeric"
                required
              />
            </label>

            <button type="submit" className="ck-nut ck-nut-son">
              Tra Tứ Hóa
            </button>

            {namRaw !== '' ? (
              <Link href="/tu-vi/tu-hoa" className="ck-nut ck-nut-vien">
                Bỏ lọc năm
              </Link>
            ) : null}
          </div>

          <p className="ck-ghi-nho">
            Tính theo năm âm lịch (sinh trước Tết thì lấy năm trước).
          </p>
        </form>
      </div>

      <DocNhanh
        cau={cauDocNhanh}
        the={theDocNhanh}
        luoiCot={dongChon ? 4 : 3}
        tieuDeId="ck-th-dn-tieu"
      />

      <section className="ck-td-muc" aria-labelledby="ck-th-bang-tieu">
        <h2 id="ck-th-bang-tieu" className="ck-td-tieu">
          Bảng Tứ Hóa theo 10 thiên can (bảng an lá số xemboi)
        </h2>

        <div className="ck-th-bang-khung">
          <table className="ck-th-bang ck-th-bang-the">
            <thead>
              <tr>
                <th scope="col">Thiên can</th>
                {BON_HOA.map((h) => (
                  <th key={h.ma} scope="col">
                    {h.ten}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BANG_TU_HOA.map((dong) => {
                const laChon = dongChon?.canSo === dong.canSo;
                return (
                  <tr
                    key={dong.canSo}
                    className={laChon ? 'ck-th-dong-chon' : undefined}
                    data-can={dong.slugCan}
                    data-chon={laChon ? '1' : undefined}
                  >
                    <th scope="row" data-nhan="Thiên can">
                      <span className="ck-th-can-o">
                        <strong>{dong.can}</strong>
                        {laChon && namChon ? (
                          <span className="ck-th-tag-nam">Năm {namChon}</span>
                        ) : null}
                        {dong.khacPhai ? (
                          <a href="#so-phai" className="ck-th-tag-phai">
                            Khác phái *
                          </a>
                        ) : null}
                      </span>
                    </th>

                    {BON_HOA.map((h) => {
                      const sao = dong.sao[h.ma];
                      return (
                        <td key={h.ma} data-nhan={h.ten}>
                          {sao.duongDan ? (
                            <Link href={sao.duongDan} className="ck-th-sao-link">
                              {sao.ten}
                            </Link>
                          ) : (
                            <span className="ck-th-sao-chu">{sao.ten}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-th-phu-tieu">
        <h2 id="ck-th-phu-tieu" className="ck-td-tieu">
          Câu phú Tứ Hóa trong sách gốc
        </h2>
        <div className="ck-th-phu">
          <TrichNguyenVan
            dich={dichPhu}
            viTriViet={TRICH_TU_HOA.viTriViet}
            tenSach={TRICH_TU_HOA.nguon.tenHanViet}
            tacGia={TRICH_TU_HOA.nguon.tacGia}
            doanId={TRICH_TU_HOA.doanId}
            ghiCong={TRICH_TU_HOA.nguon.ghiCong}
            url={TRICH_TU_HOA.nguon.url}
            nhan="Câu phú Toàn thư"
          />
        </div>
      </section>

      <section id="so-phai" className="ck-td-muc" aria-labelledby="ck-th-so-phai-tieu">
        <h2 id="ck-th-so-phai-tieu" className="ck-td-tieu">
          So phái ở can Canh và can Nhâm
        </h2>

        <div className="ck-th-so-phai-luoi">
          {SO_PHAI_TU_HOA.map((nhom) => {
            const chuan = nhom.phai[0];
            return (
              <div key={nhom.can} className="ck-th-sp-khoi" data-so-phai={nhom.can}>
                <h3>Can {nhom.can}</h3>
                <div className="ck-th-bang-khung">
                  <table className="ck-th-bang ck-th-bang-the">
                    <thead>
                      <tr>
                        <th scope="col">Cách ghi</th>
                        <th scope="col">Hóa Lộc</th>
                        <th scope="col">Hóa Quyền</th>
                        <th scope="col">Hóa Khoa</th>
                        <th scope="col">Hóa Kỵ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nhom.phai.map((p) => (
                        <tr key={p.ten}>
                          <th scope="row" data-nhan="Cách ghi">
                            <span className="ck-th-sp-ten">{p.ten}</span>
                            <span className="ck-th-sp-nguon">{p.nguon}</span>
                          </th>
                          {(['loc', 'quyen', 'khoa', 'ky'] as const).map((ma, idx) => {
                            const khac = p[ma] !== chuan[ma];
                            return (
                              <td
                                key={ma}
                                data-nhan={BON_HOA[idx].ten}
                                className={khac ? 'ck-th-sp-khac' : undefined}
                              >
                                {khac ? <strong>{p[ma]}</strong> : p[ma]}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-th-ghi-chu-tieu">
        <h2 id="ck-th-ghi-chu-tieu" className="ck-td-tieu">
          Ghi chú khi đọc Tứ Hóa trên lá số
        </h2>
        <dl className="ck-th-ghi-chu-ds">
          <div className="ck-th-ghi-chu-muc">
            <dt>Vị trí sao Hóa</dt>
            <dd>{GHI_CHU_TU_HOA.viTri}</dd>
          </div>
          <div className="ck-th-ghi-chu-muc">
            <dt>Lưu Tứ Hóa</dt>
            <dd>{GHI_CHU_TU_HOA.luuNien}</dd>
          </div>
          <div className="ck-th-ghi-chu-muc">
            <dt>Phi hóa</dt>
            <dd>{GHI_CHU_TU_HOA.phiHoa}</dd>
          </div>
          <div className="ck-th-ghi-chu-muc">
            <dt>Lá số xemboi</dt>
            <dd>{GHI_CHU_TU_HOA.doiPhai}</dd>
          </div>
        </dl>
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết cùng bộ Tử vi">
        <h2>Công cụ và tra cứu Tử vi</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          <Link href="/tu-vi/sao">Bảng 14 chính tinh</Link>
          <Link href="/phuong-phap/nam-phai-bac-phai">Nam phái và Bắc phái</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}
