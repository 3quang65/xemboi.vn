import type { Metadata } from 'next';
import Link from 'next/link';
import GieoQueClient from '@/components/ck/GieoQueClient';
import KhungTrang from '@/components/ck/KhungTrang';
import { DocNhanh, ThuatNgu } from '@/components/ck/truc-quan';
import {
  daDungKinhDich,
  duongDanQue,
  queChiTiet,
  tenViTriHao,
} from '@/lib/trang/chu-dich';
import {
  gieoDongXu,
  queMaiHoaHienTai,
  type KetQuaGieo,
} from '@/lib/trang/kinh-dich';
import { docNhanhQue } from '@/lib/trang/truc-quan-43';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { khacBanTheoViTri } from '../KinhDichHelpers';
import { DongVanHan, GhiCongChuDich, LienKetKiem } from '../KinhDichUi';
import SoDoGieoQue from './SoDoGieoQue';

export const dynamic = 'force-dynamic';

const MAC_DINH_GIEO_QUE = {
  title: 'Gieo quẻ Kinh Dịch online: 3 đồng xu, quẻ chủ và quẻ biến',
  h1: 'Gieo quẻ Kinh Dịch online',
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

function phanTichXu(xuRaw: string): { giaTri?: number[]; loi?: string } {
  const parts = xuRaw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s !== '');
  if (parts.length !== 6) {
    return { loi: 'Tham số đồng xu cần đúng 6 giá trị cách nhau bởi dấu phẩy (ví dụ 9,7,8,8,7,6).' };
  }
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isInteger(n) || ![6, 7, 8, 9].includes(n))) {
    return { loi: 'Mỗi giá trị hào đồng xu phải là 6, 7, 8 hoặc 9.' };
  }
  return { giaTri: nums };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base, nd] = await Promise.all([
    searchParams,
    metaTrang('/kinh-dich/gieo-que', MAC_DINH_GIEO_QUE),
    noiDungTheoDuongDan('/kinh-dich/gieo-que'),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: 'https://xemboi.vn/kinh-dich/gieo-que' },
      robots: { index: false, follow: true },
    };
  }
  return nd ? base : { ...base, robots: { index: false, follow: true } };
}

export default async function GieoQuePage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/kinh-dich/gieo-que', MAC_DINH_GIEO_QUE),
    searchParams,
  ]);
  const daDung = daDungKinhDich();

  const xuRaw = layMot(sp.xu)?.trim();
  const cachRaw = layMot(sp.cach)?.trim();

  let loi: string | null = null;
  let ketQua: KetQuaGieo | null = null;
  let thoiDiemMaiHoa: string | null = null;
  let giaTriBanDau: number[] | undefined;

  if (xuRaw) {
    const parsed = phanTichXu(xuRaw);
    if (parsed.loi) {
      loi = parsed.loi;
    } else if (parsed.giaTri) {
      giaTriBanDau = parsed.giaTri;
      ketQua = gieoDongXu(parsed.giaTri);
    }
  } else if (cachRaw === 'mai-hoa') {
    const kq = queMaiHoaHienTai();
    ketQua = kq;
    thoiDiemMaiHoa = kq.thoiDiem;
  }

  const chiTietChu = ketQua ? queChiTiet(ketQua.queChu.slug) : null;
  const docNhanh = ketQua ? docNhanhQue(ketQua) : null;
  const haoDongSapXep = ketQua
    ? [...ketQua.haoDong].sort((a, b) => a - b)
    : [];

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/kinh-dich/gieo-que" toi>
      <GieoQueClient
        giaTriBanDau={giaTriBanDau}
        dangLaMaiHoa={cachRaw === 'mai-hoa' && !xuRaw}
      />

      {loi ? (
        <div className="ck-loi" role="alert">
          {loi}
        </div>
      ) : null}

      {ketQua && docNhanh ? (
        <>
          <DocNhanh
            cau={docNhanh.cau}
            the={docNhanh.the}
            tieuDeId="ck-kd-dn-tieu"
            luoiCot={ketQua.queBien ? 4 : 3}
            dongPhu={
              thoiDiemMaiHoa ? (
                <>
                  {ketQua.cach === 'mai-hoa' ? 'Quẻ Mai Hoa · ' : ''}
                  Thời điểm lập quẻ: <strong>{thoiDiemMaiHoa}</strong>
                </>
              ) : ketQua.giaTriHao ? (
                <>
                  Giá trị 6 hào (từ Hào 1 đến Hào 6):{' '}
                  <strong>{ketQua.giaTriHao.join(' · ')}</strong> ·{' '}
                  {ketQua.haoDong.length > 0
                    ? `Hào động: hào ${ketQua.haoDong.join(', ')}`
                    : 'Không có hào động (quẻ tĩnh)'}
                </>
              ) : null
            }
            hienNhan={(muc) => {
              if (muc.ma === 'hao-dong') {
                return (
                  <ThuatNgu
                    ten="Hào động"
                    nghia="Hào có giá trị 6 (lão âm) hoặc 9 (lão dương) khi gieo xu, hoặc hào ứng tổng chia 6 ở phép Mai Hoa; hào này đổi âm dương thành quẻ biến."
                    id="ck-kd-tn-hao-dong"
                  />
                );
              }
              if (muc.ma === 'que-ho') {
                return (
                  <ThuatNgu
                    ten="Quẻ hỗ"
                    nghia="Quẻ dựng từ phần lõi của quẻ chủ: lấy hào 2, 3, 4 làm hạ quái và hào 3, 4, 5 làm thượng quái."
                    id="ck-kd-tn-que-ho"
                  />
                );
              }
              return muc.nhan;
            }}
          />

          <section className="ck-td-muc" aria-labelledby="ck-kd-ket-qua-tieu">
            <h2 id="ck-kd-ket-qua-tieu" className="ck-td-tieu">
              {ketQua.cach === 'mai-hoa'
                ? 'Hình quẻ Mai Hoa (quẻ chủ và quẻ biến)'
                : 'Hình quẻ gieo 3 đồng xu'}
            </h2>

            <SoDoGieoQue ketQua={ketQua} daDung={daDung} />
          </section>

          <section className="ck-td-muc" aria-label="Cách tính quẻ">
            <details className="ck-kd-cach-details">
              <summary>Cách tính quẻ</summary>
              <div className="ck-kd-mota">
                <ul>
                  {ketQua.moTa.map((dong, idx) => (
                    <li key={idx}>{dong}</li>
                  ))}
                </ul>
              </div>
            </details>
          </section>
          {chiTietChu ? (
            <section className="ck-td-muc" aria-labelledby="ck-kd-loi-que-tieu">
              <h2 id="ck-kd-loi-que-tieu" className="ck-td-tieu">
                Nguyên văn quẻ chủ: {ketQua.queChu.ten}{' '}
                <span lang="zh-Hant" className="ck-kd-han-inline">
                  {chiTietChu.han.ten}
                </span>
              </h2>

              <article className="ck-kd-muc-van ck-kd-que-tu">
                <h3>
                  Lời quẻ chủ (<span lang="zh-Hant">卦辭</span>)
                </h3>
                <DongVanHan
                  han={chiTietChu.han.queTu}
                  phienAm={chiTietChu.phienAm?.queTu ?? null}
                  ghiChuKhacBan={khacBanTheoViTri(chiTietChu.khacBan, 'quẻ từ')}
                />
              </article>

              {haoDongSapXep.length > 0 ? (
                <div className="ck-kd-hao-dong-van">
                  <h3 className="ck-kd-muc-phu-tieu">Lời hào động</h3>
                  <ol className="ck-kd-ds-hao">
                    {haoDongSapXep.map((soHao) => {
                      const h = chiTietChu.han.hao[soHao - 1];
                      if (!h) return null;
                      const phienAmHao = chiTietChu.phienAm?.hao[soHao - 1]?.van ?? null;
                      return (
                        <li key={soHao} className="ck-kd-muc-van">
                          <h4>
                            Hào {soHao} · {tenViTriHao(h.viTri)}{' '}
                            <span lang="zh-Hant">{h.viTri}</span>
                          </h4>
                          <DongVanHan
                            han={h.van}
                            phienAm={phienAmHao}
                            ghiChuKhacBan={khacBanTheoViTri(chiTietChu.khacBan, h.viTri)}
                          />
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ) : null}

              <div className="ck-kd-doc-du">
                <LienKetKiem
                  href={duongDanQue(ketQua.queChu)}
                  daDung={daDung}
                  className="ck-nut ck-nut-son"
                >
                  Đọc đủ quẻ {ketQua.queChu.ten}
                </LienKetKiem>
                {ketQua.queBien ? (
                  <LienKetKiem
                    href={duongDanQue(ketQua.queBien)}
                    daDung={daDung}
                    className="ck-nut ck-nut-vien"
                  >
                    Đọc đủ quẻ biến: {ketQua.queBien.ten}
                  </LienKetKiem>
                ) : null}
              </div>

              <GhiCongChuDich hienPhienAm daDung={daDung} />
            </section>
          ) : null}
        </>
      ) : (
        <p className="ck-kd-xem-bang">
          <LienKetKiem
            href="/kinh-dich/64-que"
            daDung={daDung}
            className="ck-nut ck-nut-vien"
          >
            Xem bảng 64 quẻ
          </LienKetKiem>
        </p>
      )}

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Tra cứu liên quan</h2>
        <div className="ck-lien-quan-ds">
          {daDung.has('/kinh-dich/64-que') ? (
            <Link href="/kinh-dich/64-que">Bảng 64 quẻ Kinh Dịch</Link>
          ) : null}
          {daDung.has('/kinh-dich') ? (
            <Link href="/kinh-dich">Tổng quan Kinh Dịch</Link>
          ) : null}
          {daDung.has('/tu-vi/lap-la-so') ? (
            <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          ) : null}
          {daDung.has('/can-chi') ? <Link href="/can-chi">Can chi &amp; mệnh</Link> : null}
          {daDung.has('/lich-am') ? <Link href="/lich-am">Lịch âm hôm nay</Link> : null}
          {daDung.has('/bat-tu/lap-la-so') ? (
            <Link href="/bat-tu/lap-la-so">Lập lá số bát tự</Link>
          ) : null}
        </div>
      </nav>
    </KhungTrang>
  );
}
