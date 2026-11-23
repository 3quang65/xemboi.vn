import type { Metadata } from 'next';
import Link from 'next/link';
import { HoaVanGoc4, HoaVanMay } from '@/components/r1/HoaVanE3';
import KhungTrang from '@/components/ck/KhungTrang';
import { KhoiDienGiai } from '@/components/ck/NoiDungMd';
import { DIA_CHI, chiCanhGio } from '@/lib/tuvi-v2/am-lich';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';
import { KhongRoGioClient } from './lap-la-so/KhongRoGioClient';

const MAC_DINH_BAT_TU = {
  title: 'Bát tự là gì? Tứ trụ năm, tháng, ngày, giờ giải thích',
  h1: 'Bát tự (tứ trụ) là gì',
};

export async function generateMetadata(): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang('/bat-tu', MAC_DINH_BAT_TU),
    noiDungTheoDuongDan('/bat-tu'),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function BatTuHubPage() {
  const [tt, nd] = await Promise.all([
    thongTinTrang('/bat-tu', MAC_DINH_BAT_TU),
    noiDungTheoDuongDan('/bat-tu'),
  ]);
  const daDung = trangDaDung();

  return (
    <KhungTrang tieuDe={tt.h1} phu={tt.description} duongDan="/bat-tu" toi>
      <section className="ck-td-muc" aria-label="Lập nhanh lá số Bát tự">
        <div className="ck-bt-ngan-khung">
          <form className="ck-to-giay ck-bt-form" action="/bat-tu/lap-la-so" method="get">
            <HoaVanGoc4 />
            <div className="ck-form-tit">
              <HoaVanMay />
              <h2>Lập nhanh lá số Bát tự (Tứ trụ)</h2>
              <HoaVanMay flipped />
            </div>

            <div className="ck-o-nhap">
              <span className="ck-nhan-o" id="ck-bt-hub-gt">
                Giới tính
              </span>
              <div className="ck-chon" role="radiogroup" aria-labelledby="ck-bt-hub-gt">
                <label>
                  <input type="radio" name="gioiTinh" value="nam" defaultChecked />
                  Nam
                </label>
                <label>
                  <input type="radio" name="gioiTinh" value="nu" />
                  Nữ
                </label>
              </div>
            </div>

            <div className="ck-bt-hang-4">
              <label className="ck-o-con" htmlFor="ck-bt-hub-ngay">
                <span>Ngày dương</span>
                <select id="ck-bt-hub-ngay" name="ngay" defaultValue="1">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              <label className="ck-o-con" htmlFor="ck-bt-hub-thang">
                <span>Tháng</span>
                <select id="ck-bt-hub-thang" name="thang" defaultValue="1">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <label className="ck-o-con" htmlFor="ck-bt-hub-nam">
                <span>Năm</span>
                <input
                  id="ck-bt-hub-nam"
                  name="nam"
                  type="number"
                  min={1900}
                  max={2100}
                  defaultValue="2000"
                  inputMode="numeric"
                  required
                />
              </label>

              <label className="ck-o-con" htmlFor="ck-bt-hub-gio">
                <span>Giờ (0–23)</span>
                <select id="ck-bt-hub-gio" name="gio" defaultValue="12">
                  {Array.from({ length: 24 }, (_, i) => i).map((h) => (
                    <option key={h} value={h}>
                      {String(h).padStart(2, '0')} giờ ({DIA_CHI[chiCanhGio(h)]})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="ck-tick" htmlFor="ck-bt-hub-khong-ro-gio">
              <input
                id="ck-bt-hub-khong-ro-gio"
                type="checkbox"
                name="khongRoGio"
                value="1"
              />
              <span>Không rõ giờ sinh (lập tam trụ)</span>
            </label>

            <KhongRoGioClient
              checkboxId="ck-bt-hub-khong-ro-gio"
              targetIds={['ck-bt-hub-gio']}
            />

            <input type="hidden" name="phut" value="0" />

            <button type="submit" className="ck-nut ck-nut-son ck-nut-lon">
              Lập lá số Bát tự
            </button>

            <p className="ck-ghi-nho">
              Trụ năm đổi tại Lập xuân, trụ tháng đổi theo 12 tiết khí.{' '}
              <Link href="/bat-tu/lap-la-so">Mở biểu mẫu đầy đủ (có phút &amp; tùy chọn 23h)</Link>
            </p>
          </form>
        </div>
      </section>

      <KhoiDienGiai noiDung={nd} tieuDe="Giới thiệu Bát tự (Tứ trụ)" />

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Tra cứu liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/bat-tu/lap-la-so">Lập lá số bát tự đầy đủ</Link>
          {daDung.has('/tu-vi/lap-la-so') ? (
            <Link href="/tu-vi/lap-la-so">Lập lá số tử vi</Link>
          ) : null}
          {daDung.has('/can-chi') ? <Link href="/can-chi">Can chi &amp; mệnh</Link> : null}
          {daDung.has('/ngu-hanh') ? <Link href="/ngu-hanh">Ngũ hành sinh khắc</Link> : null}
          {daDung.has('/lich-am') ? <Link href="/lich-am">Lịch âm hôm nay</Link> : null}
        </div>
      </nav>
    </KhungTrang>
  );
}
