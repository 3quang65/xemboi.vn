import type { Metadata } from 'next';
import Link from 'next/link';
import GieoQueClient from '@/components/ck/GieoQueClient';
import HinhQue from '@/components/ck/HinhQue';
import KhungTrang from '@/components/ck/KhungTrang';
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
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { khacBanTheoViTri } from '../KinhDichHelpers';
import { DongVanHan, GhiCongChuDich, LienKetKiem } from '../KinhDichUi';

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

      {ketQua ? (
        <>
          <section className="ck-td-muc" aria-labelledby="ck-kd-ket-qua-tieu">
            <h2 id="ck-kd-ket-qua-tieu" className="ck-td-tieu">
              {ketQua.cach === 'mai-hoa'
                ? 'Quẻ Mai Hoa theo giờ hiện tại'
                : 'Kết quả quẻ gieo 3 đồng xu'}
            </h2>

            {thoiDiemMaiHoa ? (
              <p className="ck-kd-thoi-diem">
                Thời điểm lập quẻ: <strong>{thoiDiemMaiHoa}</strong>
              </p>
            ) : ketQua.giaTriHao ? (
              <p className="ck-kd-thoi-diem">
                Giá trị 6 hào (từ Hào 1 đến Hào 6):{' '}
                <strong>{ketQua.giaTriHao.join(' · ')}</strong> ·{' '}
                {ketQua.haoDong.length > 0
                  ? `Hào động: hào ${ketQua.haoDong.join(', ')}`
                  : 'Không có hào động (quẻ tĩnh)'}
              </p>
            ) : null}

            <div className="ck-que-bo-ba">
              <HinhQue
                que={ketQua.queChu}
                nhan="Quẻ Chủ"
                haoDong={ketQua.haoDong}
                giaTriHao={ketQua.giaTriHao}
                daDung={daDung}
              />

              <HinhQue que={ketQua.queHo} nhan="Quẻ Hỗ" daDung={daDung} />

              {ketQua.queBien ? (
                <HinhQue
                  que={ketQua.queBien}
                  nhan="Quẻ Biến"
                  haoDong={ketQua.haoDong}
                  daDung={daDung}
                />
              ) : (
                <article className="ck-que-the ck-que-rong" aria-label="Không có quẻ biến">
                  <span className="ck-que-nhan">Quẻ Biến</span>
                  <h3 className="ck-que-ten">Không có quẻ biến</h3>
                  <p>Cả 6 hào đều tĩnh (không có hào 6 hoặc 9), nên giữ nguyên quẻ chủ.</p>
                </article>
              )}
            </div>
          </section>

          <section className="ck-td-muc" aria-labelledby="ck-kd-cach-tinh-tieu">
            <h2 id="ck-kd-cach-tinh-tieu" className="ck-td-tieu">
              Cách tính quẻ
            </h2>
            <div className="ck-kd-mota">
              <ul>
                {ketQua.moTa.map((dong, idx) => (
                  <li key={idx}>{dong}</li>
                ))}
              </ul>
            </div>
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
