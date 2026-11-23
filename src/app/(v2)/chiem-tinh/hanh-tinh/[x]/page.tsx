import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import KhungTrang from '@/components/ck/KhungTrang';
import { DocNhanh, type TheDocNhanhItem } from '@/components/ck/truc-quan';
import { duongDanCung, viTriTrich, type HanhTinh, type TrichAnh } from '@/lib/trang/chiem-tinh';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import {
  GHI_CHU_NGOAI,
  HANH_TINH_CHI_TIET,
  TEN_CAT,
  TEN_GIOI,
  TEN_NGAY_DEM,
  TRICH_NHA_VUONG,
  cungHienTai,
  hanhTinhTheoSlug,
  type HanhTinhChiTiet,
} from '@/lib/trang/hanh-tinh';
import { ngayHienTaiVN } from '@/lib/trang/lich';
import { metaTrang, thongTinTrang, type MacDinhTrang, type ThamSoMau } from '@/lib/trang/meta';
import {
  kyHieuChu,
  lamSachChuAnhMeta,
  lamSachMetaChiemTinh,
  lamSachThongTinChiemTinh,
  serializeJsonLd,
  taoSchemaWebPage,
  trichChoHam,
} from '../../ChiemTinhHelpers';
import {
  KhoiGhiChuHoangDao,
  KhoiNguonVaGioiHan,
  TrichTetrabiblos,
  Vong12CungSvg,
} from '../../ChiemTinhUi';
import '../../hanh-tinh.css';

export const revalidate = 3600;

const MAU_SEO_HANH_TINH = '/chiem-tinh/hanh-tinh/{x}';

function lamSachTenAnhHanhTinh(s: string): string {
  return lamSachChuAnhMeta(s)
    .replace(
      /\s*\((?:Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Sol|Luna)\)/gi,
      '',
    )
    .replace(
      /\b(?:Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|benefic|malefic|diurnal|nocturnal|masculine|feminine)\b/gi,
      '',
    )
    .replace(/\(\s*\)/g, '')
    .replace(/\s+([,.:;])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function moTaCho(h: HanhTinhChiTiet): string {
  if (h.coDien) {
    return 'tính chất, cát hay hung, cung chủ quản, cung vượng và hãm theo Tetrabiblos của Ptolemy';
  }
  return `tìm ra năm ${h.phatHien}, không có trong Tetrabiblos`;
}

function macDinhHanhTinh(h: HanhTinhChiTiet, moTa: string): MacDinhTrang {
  return {
    title: `${h.ten} trong chiêm tinh: ${moTa}`,
    h1: `${h.ten} trong chiêm tinh`,
    description: `${h.ten} trong chiêm tinh: ${moTa}. Xem vị trí cung hoàng đạo hôm nay và liên kết lập bản đồ sao.`,
  };
}

function thamSoHanhTinh(h: HanhTinhChiTiet, moTa: string): ThamSoMau {
  return {
    x: h.slug,
    'Hành tinh': h.ten,
    'hành tinh': h.ten.toLowerCase(),
    moTa,
  };
}

function trichDuyNhat(ds: TrichAnh[]): TrichAnh[] {
  const seen = new Set<string>();
  return ds.filter((t) => {
    if (seen.has(t.vi)) return false;
    seen.add(t.vi);
    return true;
  });
}

export function generateStaticParams() {
  return HANH_TINH_CHI_TIET.map((h) => ({ x: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ x: string }>;
}): Promise<Metadata> {
  const { x } = await params;
  const h = hanhTinhTheoSlug(x);
  if (!h) notFound();

  const moTa = moTaCho(h);
  const raw = await metaTrang(
    h.duongDan,
    macDinhHanhTinh(h, moTa),
    MAU_SEO_HANH_TINH,
    thamSoHanhTinh(h, moTa),
  );
  const clean = lamSachMetaChiemTinh(raw);
  const titleStr =
    typeof clean.title === 'string'
      ? lamSachTenAnhHanhTinh(clean.title)
      : clean.title && typeof clean.title === 'object' && 'absolute' in clean.title
        ? { ...clean.title, absolute: lamSachTenAnhHanhTinh(String(clean.title.absolute)) }
        : clean.title;
  const descStr =
    typeof clean.description === 'string'
      ? lamSachTenAnhHanhTinh(clean.description)
      : clean.description;
  const og = clean.openGraph
    ? {
        ...clean.openGraph,
        title:
          typeof clean.openGraph.title === 'string'
            ? lamSachTenAnhHanhTinh(clean.openGraph.title)
            : clean.openGraph.title,
        description:
          typeof clean.openGraph.description === 'string'
            ? lamSachTenAnhHanhTinh(clean.openGraph.description)
            : clean.openGraph.description,
      }
    : clean.openGraph;

  return { ...clean, title: titleStr, description: descStr, openGraph: og };
}

export default async function ChiTietHanhTinhPage({
  params,
}: {
  params: Promise<{ x: string }>;
}) {
  const { x } = await params;
  const h = hanhTinhTheoSlug(x);
  if (!h) notFound();

  const moTa = moTaCho(h);
  const ttRaw = lamSachThongTinChiemTinh(
    await thongTinTrang(
      h.duongDan,
      macDinhHanhTinh(h, moTa),
      MAU_SEO_HANH_TINH,
      thamSoHanhTinh(h, moTa),
    ),
  );
  const tt = {
    ...ttRaw,
    title: lamSachTenAnhHanhTinh(ttRaw.title),
    h1: lamSachTenAnhHanhTinh(ttRaw.h1),
    description: ttRaw.description ? lamSachTenAnhHanhTinh(ttRaw.description) : null,
  };

  const daDung = trangDaDung();
  const luc = new Date();
  const namNay = ngayHienTaiVN(luc).nam;
  const viTri = cungHienTai(h.slug, luc);
  const cd = h.coDienChiTiet;
  const ky = kyHieuChu(h.kyHieu);
  const h1Chuan = tt.h1.includes(h.kyHieu) ? tt.h1 : `${ky} ${tt.h1}`;

  const theDocNhanh: TheDocNhanhItem[] = cd
    ? [
        {
          ma: 'cat',
          nhan: 'Cát hay hung',
          giaTri: TEN_CAT[cd.cat],
          muc: cd.cat === 'cat' ? 'tot' : cd.cat === 'hung' ? 'diu' : 'binh',
          chiTiet: 'Phân loại theo Tetrabiblos, quyển I, chương V.',
        },
        {
          ma: 'gioi',
          nhan: 'Dương hay âm',
          giaTri: TEN_GIOI[cd.gioi],
          muc: 'binh',
          chiTiet: 'Phân loại theo Tetrabiblos, quyển I, chương VI.',
        },
        {
          ma: 'ngay-dem',
          nhan: 'Ngày hay đêm',
          giaTri: TEN_NGAY_DEM[cd.ngayDem],
          muc: 'binh',
          chiTiet: 'Phân loại theo Tetrabiblos, quyển I, chương VII.',
        },
      ]
    : [
        {
          ma: 'phat-hien',
          nhan: 'Phát hiện',
          giaTri: `Tìm ra năm ${h.phatHien}`,
          muc: 'binh',
          chiTiet: 'Không có trong 7 thiên thể cổ của Tetrabiblos.',
        },
        {
          ma: 'vi-tri',
          nhan: 'Hôm nay',
          giaTri: viTri ? `${viTri.cung.ten} · ${viTri.doTrongCung}°` : 'Đang tính',
          muc: 'binh',
          chiTiet: 'Kinh độ hoàng đạo nhiệt đới tính theo lịch thiên văn.',
        },
      ];

  const trichNha = cd ? trichDuyNhat(cd.nha.map((c) => TRICH_NHA_VUONG.nha(c))) : [];
  const trichVuong = cd?.vuong ? TRICH_NHA_VUONG.vuong(cd.vuong) : null;
  const trichHam = cd?.ham ? trichChoHam(h.ten as HanhTinh) : null;
  const conLai = HANH_TINH_CHI_TIET.filter((item) => item.slug !== h.slug);
  const jsonLd = taoSchemaWebPage(tt);

  return (
    <KhungTrang
      tieuDe={h1Chuan}
      phu={tt.description}
      duongDan={h.duongDan}
      tenCuoi={h.ten}
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1. Đọc nhanh */}
      <DocNhanh
        cau={cd ? cd.tinhChat.vi : GHI_CHU_NGOAI}
        the={theDocNhanh}
        tieuDeId="ck-ht-dn-tieu"
        luoiCot={3}
        dongPhu={
          cd
            ? `${viTriTrich(cd.tinhChat)} · Dịch nghĩa: xemboi`
            : `Phát hiện năm ${h.phatHien}`
        }
      />

      {/* 2. Hôm nay ở đâu */}
      <section className="ck-td-muc" aria-labelledby="ck-ht-hom-nay-tieu">
        <h2 id="ck-ht-hom-nay-tieu" className="ck-td-tieu">
          Hôm nay ở đâu
        </h2>

        <div className="ck-ht-hom-nay">
          <div className="ck-ht-hom-nay-trai">
            <div className="ck-ht-hom-nay-dau">
              <span className="ck-ct-ky-trien" aria-hidden="true">
                {ky}
              </span>
              <div>
                {viTri ? (
                  <p className="ck-ht-hom-nay-cau">
                    Hôm nay <strong>{h.ten}</strong> ở cung{' '}
                    <Link href={duongDanCung(viTri.cung)}>{viTri.cung.ten}</Link>, khoảng{' '}
                    <strong>{viTri.doTrongCung}°</strong>.
                  </p>
                ) : null}
                <p className="ck-ht-hom-nay-phu">
                  Kinh độ hoàng đạo nhiệt đới tính theo giờ máy chủ.
                </p>
              </div>
            </div>

            <Link href="/chiem-tinh/ban-do-sao" className="ck-nut ck-nut-son ck-ht-nut">
              Lập bản đồ sao
            </Link>
          </div>

          <div className="ck-ht-vong">
            <Vong12CungSvg namNay={namNay} cungChon={viTri?.cung.slug} nho />
          </div>
        </div>
      </section>

      {/* 3 & 4. Chỉ thiên thể cổ mới có Cung trong sách và Sách ghi */}
      {cd ? (
        <>
          <section className="ck-td-muc" aria-labelledby="ck-ht-cung-tieu">
            <h2 id="ck-ht-cung-tieu" className="ck-td-tieu">
              Cung trong sách
            </h2>

            <div className="ck-ht-cung-luoi">
              <article className="ck-ht-the">
                <h3>Nhà</h3>
                {cd.nha.length > 0 ? (
                  <>
                    <div className="ck-ht-chip-ds">
                      {cd.nha.map((c) => (
                        <Link key={c.slug} href={duongDanCung(c)} className="ck-ht-chip">
                          <span className="ck-ct-ky" aria-hidden="true">
                            {kyHieuChu(c.kyHieu)}
                          </span>
                          <span>{c.ten}</span>
                        </Link>
                      ))}
                    </div>
                    {trichNha.map((t, idx) => (
                      <TrichTetrabiblos key={idx} trich={t} />
                    ))}
                  </>
                ) : (
                  <p className="ck-ht-khong-ghi">Tetrabiblos không ghi</p>
                )}
              </article>

              <article className="ck-ht-the">
                <h3>Vượng</h3>
                {cd.vuong ? (
                  <>
                    <div className="ck-ht-chip-ds">
                      <Link href={duongDanCung(cd.vuong)} className="ck-ht-chip">
                        <span className="ck-ct-ky" aria-hidden="true">
                          {kyHieuChu(cd.vuong.kyHieu)}
                        </span>
                        <span>{cd.vuong.ten}</span>
                      </Link>
                    </div>
                    {trichVuong ? <TrichTetrabiblos trich={trichVuong} /> : null}
                  </>
                ) : (
                  <p className="ck-ht-khong-ghi">Tetrabiblos không ghi</p>
                )}
              </article>

              <article className="ck-ht-the">
                <h3>Hãm</h3>
                {cd.ham ? (
                  <>
                    <div className="ck-ht-chip-ds">
                      <Link href={duongDanCung(cd.ham)} className="ck-ht-chip">
                        <span className="ck-ct-ky" aria-hidden="true">
                          {kyHieuChu(cd.ham.kyHieu)}
                        </span>
                        <span>{cd.ham.ten}</span>
                      </Link>
                    </div>
                    {trichHam ? <TrichTetrabiblos trich={trichHam} /> : null}
                  </>
                ) : (
                  <p className="ck-ht-khong-ghi">Tetrabiblos không ghi</p>
                )}
              </article>
            </div>
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-ht-sach-tieu">
            <h2 id="ck-ht-sach-tieu" className="ck-td-tieu">
              Sách ghi
            </h2>
            <div className="ck-ht-trich-ds">
              {cd.trich.map((t, idx) => (
                <TrichTetrabiblos key={idx} trich={t} />
              ))}
            </div>
          </section>
        </>
      ) : null}

      {/* 5. 9 thiên thể còn lại */}
      <section className="ck-td-muc" aria-labelledby="ck-ht-khac-tieu">
        <h2 id="ck-ht-khac-tieu" className="ck-td-tieu">
          9 thiên thể còn lại
        </h2>
        <div className="ck-ht-chip-ds">
          {conLai.map((item) => (
            <Link key={item.slug} href={item.duongDan} className="ck-ht-chip">
              <span className="ck-ct-ky" aria-hidden="true">
                {kyHieuChu(item.kyHieu)}
              </span>
              <span>{item.ten}</span>
            </Link>
          ))}
        </div>
      </section>

      <KhoiGhiChuHoangDao />

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/chiem-tinh">Tổng quan Chiêm tinh</Link>
          <Link href="/chiem-tinh/cung-hoang-dao">12 cung hoàng đạo</Link>
          <Link href="/chiem-tinh/ban-do-sao">Bản đồ sao</Link>
        </div>
      </nav>

      <KhoiNguonVaGioiHan daDung={daDung} />
    </KhungTrang>
  );
}
