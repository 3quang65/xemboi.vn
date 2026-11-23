import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import {
  NGUON_CHU_DICH,
  NGUON_DICH,
  bang64,
  daDungKinhDich,
  duongDanQuai,
  duongDanQue,
  quaiTheoTenQ,
  queChiTiet,
  tenViTriHao,
} from '@/lib/trang/chu-dich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import {
  khacBanTheoViTri,
  macDinhQue,
  MAU_SEO_QUE,
  serializeJsonLd,
  taoSchemaDefinedTerm,
  taoSchemaWebPage,
  thamSoQue,
  thongTinNganTheoSo,
} from '../../KinhDichHelpers';
import {
  DongLoiDich,
  GhiCongChuDich,
  HinhHao,
  LienKetKiem,
} from '../../KinhDichUi';

export const revalidate = 3600;

export function generateStaticParams() {
  return bang64().map(({ que }) => ({ slug: que.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ct = queChiTiet(slug);
  if (!ct) notFound();

  const duongDan = duongDanQue(ct.que);
  return metaTrang(
    duongDan,
    macDinhQue(ct.que),
    MAU_SEO_QUE,
    thamSoQue(ct.que),
  );
}

export default async function QueChiTietPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ct = queChiTiet(slug);
  if (!ct) notFound();

  const duongDan = duongDanQue(ct.que);
  const [tt, nd] = await Promise.all([
    thongTinTrang(duongDan, macDinhQue(ct.que), MAU_SEO_QUE, thamSoQue(ct.que)),
    noiDungTheoDuongDan(duongDan),
  ]);
  const daDung = daDungKinhDich();
  const thuongCt = quaiTheoTenQ(ct.que.thuong.ten);
  const haCt = quaiTheoTenQ(ct.que.ha.ten);
  const doiXung = ct.dao.so === ct.que.so;

  const schemaTerm = taoSchemaDefinedTerm(ct.que.ten, tt.canonical);
  const schemaWebPage = taoSchemaWebPage(tt);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan={duongDan}
      tenCuoi={`Quẻ ${ct.que.ten}`}
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

      {/* 1. Đầu trang: ký hiệu lớn, số, tên, quái trên/dưới, hình 6 hào */}
      <section className="ck-kd-que-dau" aria-label={`Tổng quan quẻ ${ct.que.ten}`}>
        <div className="ck-kd-que-tong">
          <div className="ck-kd-dau-chinh">
            <span className="ck-kd-ky-lon" aria-hidden="true">
              {ct.kyHieu}
            </span>
            <div>
              <span className="ck-nhan-nho">Quẻ số {ct.que.so}</span>
              <h2 className="ck-kd-que-ten-phu">{ct.que.ten}</h2>
            </div>
          </div>

          <div className="ck-kd-quai-cap">
            <LienKetKiem
              href={duongDanQuai(thuongCt)}
              daDung={daDung}
              className="ck-kd-quai-chip"
            >
              <span>Quái trên</span>
              <strong>
                {thuongCt.kyHieu} {thuongCt.ten}
              </strong>
              <small>{thuongCt.tuong}</small>
            </LienKetKiem>

            <LienKetKiem
              href={duongDanQuai(haCt)}
              daDung={daDung}
              className="ck-kd-quai-chip"
            >
              <span>Quái dưới</span>
              <strong>
                {haCt.kyHieu} {haCt.ten}
              </strong>
              <small>{haCt.tuong}</small>
            </LienKetKiem>
          </div>
        </div>

        <HinhHao
          hao={ct.que.hao}
          moTa={`Hình 6 hào quẻ ${ct.que.ten}, từ hào 1 (Sơ) lên hào 6 (Thượng)`}
          tachQuai
        />
      </section>

      {/* 2. Bản dịch lời quẻ, lời hào */}
      <section className="ck-td-muc" aria-labelledby="ck-kd-nguyen-van-tieu">
        <h2 id="ck-kd-nguyen-van-tieu" className="ck-td-tieu">
          Lời quẻ và lời hào
        </h2>

        <article className="ck-kd-muc-van ck-kd-que-tu">
          <h3>Lời quẻ</h3>
          <DongLoiDich
            dich={ct.dich.queTu}
            ghiChuKhacBan={khacBanTheoViTri(ct.khacBan, 'quẻ từ')}
          />
        </article>

        <ol className="ck-kd-ds-hao">
          {ct.dich.hao.map((loiDich, idx) => {
            const viTriHan = ct.han.hao[idx].viTri;
            return (
              <li key={idx} className="ck-kd-muc-van">
                <h3>
                  Hào {idx + 1} · {tenViTriHao(viTriHan)}
                </h3>
                <DongLoiDich
                  dich={loiDich}
                  ghiChuKhacBan={khacBanTheoViTri(ct.khacBan, viTriHan)}
                />
              </li>
            );
          })}
        </ol>

        {ct.dich.dung && ct.han.dung ? (
          <article className="ck-kd-muc-van ck-kd-hao-dung">
            <h3>{tenViTriHao(ct.han.dung.viTri)}</h3>
            <DongLoiDich
              dich={ct.dich.dung}
              ghiChuKhacBan={khacBanTheoViTri(ct.khacBan, ct.han.dung.viTri)}
            />
          </article>
        ) : null}

        <p className="ck-kd-nguon-dich">
          Sách ghi · Chu Dịch (Kanripo {NGUON_CHU_DICH.ma}) ·{' '}
          <strong>{NGUON_DICH[ct.dich.nguon].nhan}</strong>
        </p>

        {nd ? (
          <KhoiDienGiai
            noiDung={nd}
            tieuDe={`Lời bình quẻ ${ct.que.ten}`}
          />
        ) : (
          <p className="ck-kd-dang-bien-tap">
            Lời bình chi tiết đang biên tập.
          </p>
        )}
      </section>

      {/* 3. Quẻ liên quan */}
      <section className="ck-td-muc" aria-labelledby="ck-kd-lq-tieu">
        <h2 id="ck-kd-lq-tieu" className="ck-td-tieu">
          Quẻ liên quan
        </h2>
        <div className="ck-kd-lien-quan-luoi">
          <article className="ck-kd-lq-the">
            <h3>Quẻ hỗ</h3>
            <p className="ck-kd-lq-giai">
              Lấy hào 2-3-4 làm quái dưới, hào 3-4-5 làm quái trên.
            </p>
            <LienKetKiem
              href={duongDanQue(ct.ho)}
              daDung={daDung}
              className="ck-kd-que-nho"
            >
              <span className="ck-kd-que-nho-ky" aria-hidden="true">
                {thongTinNganTheoSo(ct.ho.so)?.kyHieu}
              </span>
              <div>
                <b>
                  #{ct.ho.so} {ct.ho.ten}
                </b>
              </div>
            </LienKetKiem>
          </article>

          <article className="ck-kd-lq-the">
            <h3>Quẻ đảo</h3>
            <p className="ck-kd-lq-giai">
              Lật ngược 6 hào.
              {doiXung ? ' Quẻ đối xứng: lật ngược vẫn là chính nó.' : ''}
            </p>
            {doiXung ? (
              <div className="ck-kd-que-nho ck-kd-que-nho-tinh">
                <span className="ck-kd-que-nho-ky" aria-hidden="true">
                  {thongTinNganTheoSo(ct.dao.so)?.kyHieu}
                </span>
                <div>
                  <b>
                    #{ct.dao.so} {ct.dao.ten}
                  </b>
                </div>
              </div>
            ) : (
              <LienKetKiem
                href={duongDanQue(ct.dao)}
                daDung={daDung}
                className="ck-kd-que-nho"
              >
                <span className="ck-kd-que-nho-ky" aria-hidden="true">
                  {thongTinNganTheoSo(ct.dao.so)?.kyHieu}
                </span>
                <div>
                  <b>
                    #{ct.dao.so} {ct.dao.ten}
                  </b>
                </div>
              </LienKetKiem>
            )}
          </article>

          <article className="ck-kd-lq-the">
            <h3>Quẻ đối</h3>
            <p className="ck-kd-lq-giai">
              Đổi âm thành dương, dương thành âm cả 6 hào.
            </p>
            <LienKetKiem
              href={duongDanQue(ct.doi)}
              daDung={daDung}
              className="ck-kd-que-nho"
            >
              <span className="ck-kd-que-nho-ky" aria-hidden="true">
                {thongTinNganTheoSo(ct.doi.so)?.kyHieu}
              </span>
              <div>
                <b>
                  #{ct.doi.so} {ct.doi.ten}
                </b>
              </div>
            </LienKetKiem>
          </article>
        </div>
      </section>

      {/* 4. Trước / sau */}
      <nav className="ck-dieu-huong ck-kd-truoc-sau" aria-label="Quẻ trước và quẻ sau">
        {ct.truoc && daDung.has(duongDanQue(ct.truoc)) ? (
          <Link href={duongDanQue(ct.truoc)} className="ck-nut ck-nut-vien">
            ← #{ct.truoc.so} {ct.truoc.ten}
          </Link>
        ) : (
          <span />
        )}
        {ct.sau && daDung.has(duongDanQue(ct.sau)) ? (
          <Link href={duongDanQue(ct.sau)} className="ck-nut ck-nut-vien">
            #{ct.sau.so} {ct.sau.ten} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      {/* 5. Liên kết */}
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

      {/* 6. Ghi công */}
      <GhiCongChuDich nguonDich={ct.dich.nguon} daDung={daDung} />
    </KhungTrang>
  );
}
