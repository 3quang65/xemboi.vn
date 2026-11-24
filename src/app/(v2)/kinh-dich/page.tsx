import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import {
  BAT_QUAI_CHI_TIET,
  DICH_THUYET_QUAI,
  NGUON_CHU_DICH,
  NGUON_DICH,
  daDungKinhDich,
  duongDanQuai,
} from '@/lib/trang/chu-dich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import {
  MAC_DINH_HUB,
  serializeJsonLd,
  taoSchemaWebPage,
} from './KinhDichHelpers';
import { LienKetKiem } from './KinhDichUi';
import './mai-hoa.css';
import './luc-hao.css';

export const revalidate = 3600;

const CAU_DAN_HUB =
  '64 quẻ, mỗi quẻ 6 hào, ghép từ 2 trong 8 quái; bản dịch lời quẻ, lời hào theo Chu Dịch Kanripo.';

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/kinh-dich', MAC_DINH_HUB);
}

export default async function KinhDichHubPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/kinh-dich', MAC_DINH_HUB),
    noiDungTheoDuongDan('/kinh-dich'),
  ]);
  const daDung = daDungKinhDich();
  const jsonLd = taoSchemaWebPage(tt);

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={CAU_DAN_HUB}
      duongDan="/kinh-dich"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <section className="ck-td-muc" aria-label="Công cụ và bảng tra Kinh Dịch">
        <div className="ck-kd-hub-bon">
          <LienKetKiem
            href="/kinh-dich/64-que"
            daDung={daDung}
            className="ck-kd-hub-the"
          >
            <span className="ck-kd-hub-ky" aria-hidden="true">
              ䷀ … ䷿
            </span>
            <h2>64 quẻ</h2>
            <p>
              Bảng 64 quẻ theo thứ tự Văn Vương và bảng tra 8 × 8 theo quái trên, quái dưới.
            </p>
            <span className="ck-nut ck-nut-vien">Xem bảng 64 quẻ</span>
          </LienKetKiem>

          <LienKetKiem
            href="/kinh-dich/gieo-que"
            daDung={daDung}
            className="ck-kd-hub-the"
          >
            <span className="ck-kd-hub-ky" aria-hidden="true">
              ☰ · ☷
            </span>
            <h2>Gieo quẻ</h2>
            <p>
              Gieo quẻ 3 đồng xu (6 lần) hoặc lập quẻ Mai Hoa theo giờ hiện tại.
            </p>
            <span className="ck-nut ck-nut-son">Mở trang gieo quẻ</span>
          </LienKetKiem>

          <Link href="/kinh-dich/mai-hoa-dich-so" className="ck-kd-hub-the">
            <span className="ck-kd-hub-ky" aria-hidden="true">
              ☷ · ☰
            </span>
            <h2>Mai hoa Dịch số</h2>
            <p>
              Lập quẻ theo ngày giờ âm lịch hoặc số đếm được; xét thể, dụng, hỗ, biến theo sách.
            </p>
            <span className="ck-nut ck-nut-vien">Mở Mai hoa Dịch số</span>
          </Link>

          <Link href="/kinh-dich/luc-hao" className="ck-kd-hub-the">
            <span className="ck-kd-hub-ky" aria-hidden="true">
              ☰ · ☵
            </span>
            <h2>Lục hào</h2>
            <p>
              Gieo 3 đồng xu an tám cung, thế ứng, nạp chi, lục thân, lục thần và tuần không theo Tăng san bốc Dịch.
            </p>
            <span className="ck-nut ck-nut-vien">An quẻ Lục hào</span>
          </Link>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-kd-bat-quai-tieu">
        <h2 id="ck-kd-bat-quai-tieu" className="ck-td-tieu">
          Bát quái (8 quái)
        </h2>
        <div className="ck-kd-quai-luoi">
          {BAT_QUAI_CHI_TIET.map((q) => (
            <LienKetKiem
              key={q.slug}
              href={duongDanQuai(q)}
              daDung={daDung}
              className="ck-kd-quai-the"
            >
              <span className="ck-kd-quai-ky" aria-hidden="true">
                {q.kyHieu}
              </span>
              <strong className="ck-kd-quai-ten">{q.ten}</strong>
              <span className="ck-kd-quai-tuong">
                {q.tuong} · {DICH_THUYET_QUAI[q.tuongHan]}
              </span>
            </LienKetKiem>
          ))}
        </div>
      </section>

      {nd ? <KhoiDienGiai noiDung={nd} /> : null}

      <section className="ck-td-muc" aria-labelledby="ck-kd-nguon-tieu">
        <h2 id="ck-kd-nguon-tieu" className="ck-td-tieu">
          Nguồn văn bản
        </h2>
        <div className="ck-kd-nguon-khoi">
          <p>
            <strong>{NGUON_CHU_DICH.tenHanViet}</strong> (mã {NGUON_CHU_DICH.ma}):{' '}
            {NGUON_CHU_DICH.ghiCong} (
            <a
              href={NGUON_CHU_DICH.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {NGUON_CHU_DICH.url}
            </a>
            ).
          </p>
          <p>{NGUON_CHU_DICH.doiChieu}</p>
          <p>
            <strong>{NGUON_DICH['ngo-tat-to'].nhan}:</strong>{' '}
            {NGUON_DICH['ngo-tat-to'].ghiCong}.
          </p>
          <p>
            <strong>{NGUON_DICH.xemboi.nhan}:</strong> {NGUON_DICH.xemboi.ghiCong}.
          </p>
          {daDung.has('/nguon') ? (
            <p className="ck-kd-nguon-link">
              <Link href="/nguon" className="ck-nut ck-nut-vien">
                Xem danh mục nguồn sách
              </Link>
            </p>
          ) : null}
        </div>
      </section>
    </KhungTrang>
  );
}
