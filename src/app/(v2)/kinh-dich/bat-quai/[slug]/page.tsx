import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  BAT_QUAI_CHI_TIET,
  DICH_THUYET_QUAI,
  NGUON_CHU_DICH,
  daDungKinhDich,
  duongDanQuai,
  duongDanQue,
  quaiTheoSlug,
  queCoQuai,
} from '@/lib/trang/chu-dich';
import type { Que } from '@/lib/trang/kinh-dich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  macDinhQuai,
  MAU_SEO_QUAI,
  serializeJsonLd,
  taoSchemaDefinedTerm,
  taoSchemaWebPage,
  thamSoQuai,
  thongTinNganTheoSo,
} from '../../KinhDichHelpers';
import { HinhHao, LienKetKiem } from '../../KinhDichUi';

export const revalidate = 3600;

export function generateStaticParams() {
  return BAT_QUAI_CHI_TIET.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const quai = quaiTheoSlug(slug);
  if (!quai) notFound();

  const duongDan = duongDanQuai(quai);
  return metaTrang(
    duongDan,
    macDinhQuai(quai),
    MAU_SEO_QUAI,
    thamSoQuai(quai),
  );
}

function NhomQueTheoQuai({
  tieuDe,
  danhSach,
  daDung,
}: {
  tieuDe: string;
  danhSach: Que[];
  daDung: Set<string>;
}) {
  return (
    <div className="ck-kd-quai-nhom">
      <h3>{tieuDe}</h3>
      <div className="ck-kd-quai-que-luoi">
        {danhSach.map((q) => {
          const info = thongTinNganTheoSo(q.so);
          return (
            <LienKetKiem
              key={q.so}
              href={duongDanQue(q)}
              daDung={daDung}
              className="ck-kd-que-nho"
            >
              <span className="ck-kd-que-nho-ky" aria-hidden="true">
                {info.kyHieu}
              </span>
              <div>
                <b>
                  #{q.so} {q.ten}
                </b>
              </div>
            </LienKetKiem>
          );
        })}
      </div>
    </div>
  );
}

export default async function BatQuaiChiTietPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quai = quaiTheoSlug(slug);
  if (!quai) notFound();

  const duongDan = duongDanQuai(quai);
  const tt = await thongTinTrang(
    duongDan,
    macDinhQuai(quai),
    MAU_SEO_QUAI,
    thamSoQuai(quai),
  );
  const daDung = daDungKinhDich();
  const { tren, duoi } = queCoQuai(quai.ten);

  const schemaTerm = taoSchemaDefinedTerm(quai.ten, tt.canonical);
  const schemaWebPage = taoSchemaWebPage(tt);

  const cacMucThuyetQuai = [
    { nhan: 'Tính', cau: quai.thuyetQuai.tinh },
    { nhan: 'Vật', cau: quai.thuyetQuai.vat },
    { nhan: 'Thân thể', cau: quai.thuyetQuai.thanThe },
    { nhan: 'Gia đình', cau: quai.thuyetQuai.giaDinh },
  ];

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan={duongDan}
      tenCuoi={`Quái ${quai.ten}`}
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaTerm) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaWebPage) }}
      />

      {/* 1. Đầu trang: ký hiệu lớn, tên, tượng, hình 3 hào */}
      <section className="ck-kd-que-dau" aria-label={`Tổng quan quái ${quai.ten}`}>
        <div className="ck-kd-que-tong">
          <div className="ck-kd-dau-chinh">
            <span className="ck-kd-ky-lon" aria-hidden="true">
              {quai.kyHieu}
            </span>
            <div>
              <span className="ck-nhan-nho">
                Bát quái · Số Tiên thiên {quai.soTienThien}
              </span>
              <h2 className="ck-kd-que-ten-phu">Quái {quai.ten}</h2>
              <p className="ck-kd-tuong-dong">
                Tượng: <strong>{quai.tuong}</strong> · {DICH_THUYET_QUAI[quai.tuongHan]}
              </p>
            </div>
          </div>
        </div>

        <HinhHao
          hao={quai.hao}
          moTa={`Hình 3 hào quái ${quai.ten}, từ dưới lên`}
        />
      </section>

      {/* 2. Theo Thuyết quái */}
      <section className="ck-td-muc" aria-labelledby="ck-kd-tq-tieu">
        <h2 id="ck-kd-tq-tieu" className="ck-td-tieu">
          Theo thiên Thuyết quái
        </h2>
        <div className="ck-bang-khung">
          <table className="ck-bang ck-kd-bang-tq">
            <thead>
              <tr>
                <th scope="col">Mục</th>
                <th scope="col">Bản dịch Thuyết quái</th>
              </tr>
            </thead>
            <tbody>
              {cacMucThuyetQuai.map((m) => (
                <tr key={m.nhan}>
                  <th scope="row">{m.nhan}</th>
                  <td>
                    <span className="ck-kd-tq-dich">{DICH_THUYET_QUAI[m.cau]}</span>
                  </td>
                </tr>
              ))}
              <tr>
                <th scope="row">Phương</th>
                <td>
                  {quai.thuyetQuai.phuong === null ? (
                    <span className="ck-kd-tq-ghi-chu">
                      Thuyết quái không ghi phương của Khôn.
                    </span>
                  ) : (
                    <>
                      <span className="ck-kd-tq-dich">
                        {DICH_THUYET_QUAI[quai.thuyetQuai.phuong]}
                        {quai.phuongSachGhi ? ` → ${quai.phuongSachGhi}` : ''}
                      </span>
                      {quai.phuongSachGhi === null ? (
                        <span className="ck-kd-tq-ghi-chu">
                          Thuyết quái ghi Đoài theo mùa (chính thu), không ghi phương.
                        </span>
                      ) : null}
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="ck-nguon-nho">
          Trích thiên Thuyết quái, bản Chu Dịch Kanripo {NGUON_CHU_DICH.ma}.{' '}
          {NGUON_CHU_DICH.ghiCong} (
          <a
            href={NGUON_CHU_DICH.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Kanripo {NGUON_CHU_DICH.ma}
          </a>
          ). Dịch nghĩa: xemboi.
        </p>

        {/* 3. Ngũ hành */}
        <p className="ck-kd-ngu-hanh">
          <strong>Ngũ hành:</strong> {quai.hanh}.{' '}
          <span>
            Ngũ hành của quái là cách quy thông dụng đời sau, Thuyết quái không ghi.
          </span>
        </p>
      </section>

      {/* 4. Các quẻ có quái {ten} */}
      <section className="ck-td-muc" aria-labelledby="ck-kd-quai-que-tieu">
        <h2 id="ck-kd-quai-que-tieu" className="ck-td-tieu">
          Các quẻ có quái {quai.ten}
        </h2>
        <NhomQueTheoQuai
          tieuDe={`Quái ${quai.ten} ở trên (thượng quái)`}
          danhSach={tren}
          daDung={daDung}
        />
        <NhomQueTheoQuai
          tieuDe={`Quái ${quai.ten} ở dưới (hạ quái)`}
          danhSach={duoi}
          daDung={daDung}
        />
      </section>

      {/* 5. Thanh 8 quái + liên kết bảng 64 quẻ */}
      <section className="ck-td-muc" aria-label="Chuyển nhanh 8 quái">
        <h2 className="ck-td-tieu">Chuyển nhanh 8 quái</h2>
        <div className="ck-kd-thanh-quai">
          {BAT_QUAI_CHI_TIET.map((item) => {
            const hienTai = item.slug === quai.slug;
            return hienTai ? (
              <span
                key={item.slug}
                className="ck-kd-thanh-quai-muc ck-kd-thanh-quai-hien-tai"
                aria-current="page"
              >
                {item.kyHieu} {item.ten}
              </span>
            ) : (
              <LienKetKiem
                key={item.slug}
                href={duongDanQuai(item)}
                daDung={daDung}
                className="ck-kd-thanh-quai-muc"
              >
                {item.kyHieu} {item.ten}
              </LienKetKiem>
            );
          })}
        </div>
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết Kinh Dịch">
        <h2>Tra cứu cùng cụm</h2>
        <div className="ck-lien-quan-ds">
          <LienKetKiem href="/kinh-dich/64-que" daDung={daDung}>
            Bảng 64 quẻ
          </LienKetKiem>
          <LienKetKiem href="/kinh-dich/gieo-que" daDung={daDung}>
            Gieo quẻ Kinh Dịch
          </LienKetKiem>
          <LienKetKiem href="/kinh-dich" daDung={daDung}>
            Tổng quan Kinh Dịch
          </LienKetKiem>
        </div>
      </nav>
    </KhungTrang>
  );
}
