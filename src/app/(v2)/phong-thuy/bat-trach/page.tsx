import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { LaBan } from '@/components/ck/truc-quan';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { laBanCaNhan } from '@/lib/trang/phan-truc-quan';
import {
  BAT_CUNG,
  DU_NIEN_8,
  TRICH,
  duNienGiua,
  duongDanCungPhi,
  phienQuai,
} from '@/lib/trang/phong-thuy';
import {
  CUNG_DONG_TU,
  CUNG_TAY_TU,
  MAC_DINH_BAT_TRACH,
  serializeJsonLd,
  taoSchemaDefinedTermSetBatTrach,
} from '../PhongThuyHelpers';
import {
  GhiCongHiepKy,
  HinhBaHaoBien,
  HuyHieuCatHung,
  KhoiTrichDan,
  ThanhTamCung,
} from '../PhongThuyUi';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/phong-thuy/bat-trach', MAC_DINH_BAT_TRACH);
}

export default async function BatTrachPage() {
  const tt = await thongTinTrang('/phong-thuy/bat-trach', MAC_DINH_BAT_TRACH);
  const daDung = trangDaDung();
  const jsonLd = taoSchemaDefinedTermSetBatTrach(tt);
  const buocPhienQuai = phienQuai('Càn');

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/phong-thuy/bat-trach"
      toi
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      {/* 1. 8 du niên (4 cát trước, 4 hung sau) */}
      <section className="ck-td-muc" aria-labelledby="ck-bt-8dn-tieu">
        <h2 id="ck-bt-8dn-tieu" className="ck-td-tieu">
          8 du niên trong Bát trạch
        </h2>
        <div className="ck-pt-du-nien-luoi">
          {DU_NIEN_8.map((d) => (
            <article
              key={d.ten}
              className={`ck-pt-du-nien-the ${d.cat ? 'ck-pt-the-cat' : 'ck-pt-the-hung'}`}
            >
              <div className="ck-pt-du-nien-dau">
                <h3>{d.ten}</h3>
                <HuyHieuCatHung cat={d.cat} />
              </div>

              <p className="ck-pt-du-nien-sao">
                Sao: <b>{d.sao}</b> · Cách lập: <b>{d.moTaBien}</b>
              </p>

              <HinhBaHaoBien
                bien={d.bien}
                moTa={`${d.ten}: ${d.moTaBien}`}
              />

              <KhoiTrichDan trich={d.trich} />
            </article>
          ))}
        </div>
      </section>

      {/* 1b. La bàn mẫu 24 sơn và 8 quái */}
      <section className="ck-td-muc" aria-labelledby="ck-bt-la-ban-tieu">
        <h2 id="ck-bt-la-ban-tieu" className="ck-td-tieu">
          Cách chia 8 quái và 24 sơn trên la bàn
        </h2>
        <LaBan laBan={laBanCaNhan()} idPrefix="ck-bt-mau" />
      </section>

      {/* 2. Bảng 8 × 8 */}
      <section className="ck-td-muc" aria-labelledby="ck-bt-bang8-tieu">
        <h2 id="ck-bt-bang8-tieu" className="ck-td-tieu">
          Bảng 8 × 8 du niên theo cung phi và phương
        </h2>
        <p className="ck-pt-cach-tinh-dong">
          Hàng là cung phi của người; cột là quái của phương (kèm tên phương). Ô giao nhau là du niên tương ứng.
        </p>

        <div className="ck-pt-bang8-khung">
          <table className="ck-pt-bang8">
            <thead>
              <tr>
                <th scope="col">Cung phi \ Phương</th>
                {BAT_CUNG.map((cot) => (
                  <th key={cot.slug} scope="col">
                    <span aria-hidden="true">{cot.kyHieu}</span> {cot.ten}
                    <small>{cot.phuong}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BAT_CUNG.map((hang) => (
                <tr key={hang.slug}>
                  <th scope="row">
                    <Link href={duongDanCungPhi(hang)} className="ck-pt-quai-link">
                      <span aria-hidden="true">{hang.kyHieu}</span> {hang.ten}
                    </Link>
                  </th>
                  {BAT_CUNG.map((cot) => {
                    const dn = duNienGiua(hang.ten, cot.ten);
                    return (
                      <td
                        key={cot.slug}
                        className={dn.cat ? 'ck-pt-bang8-o-cat' : 'ck-pt-bang8-o-hung'}
                      >
                        <span className="ck-pt-bang8-ten">{dn.ten}</span>
                        <span className="ck-pt-bang8-loai">
                          ({dn.cat ? 'cát' : 'hung'})
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Cách lập: phiên quái & thứ tự sao */}
      <section className="ck-td-muc" aria-labelledby="ck-bt-cach-lap-tieu">
        <h2 id="ck-bt-cach-lap-tieu" className="ck-td-tieu">
          Cách lập du niên bằng phiên quái
        </h2>
        <KhoiTrichDan trich={TRICH.phienQuai} />
        <KhoiTrichDan trich={TRICH.thuTuSao} />

        <div className="ck-pt-phien-quai-chuoi">
          <h3>Chuỗi 8 bước phiên quái khởi từ Càn</h3>
          <ol className="ck-pt-phien-quai-ds">
            <li className="ck-pt-phien-quai-buoc">
              <b>Càn (bản cung)</b>
              <span>Khởi điểm</span>
            </li>
            {buocPhienQuai.map((b, i) => (
              <React.Fragment key={`${b.cung}-${i}`}>
                <li className="ck-pt-mui-ten" aria-hidden="true">
                  →
                </li>
                <li className="ck-pt-phien-quai-buoc">
                  <b>
                    {i + 1}. {b.cung}
                  </b>
                  <span>{b.sao}</span>
                </li>
              </React.Fragment>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Đông tứ, Tây tứ */}
      <section className="ck-td-muc" aria-labelledby="ck-bt-dong-tay-tieu">
        <h2 id="ck-bt-dong-tay-tieu" className="ck-td-tieu">
          Đông tứ và Tây tứ
        </h2>
        <KhoiTrichDan trich={TRICH.dongTayTuTrach} />

        <div className="ck-pt-nhom-luoi" style={{ marginTop: 14 }}>
          <div className="ck-pt-nhom-khoi">
            <h3>Đông tứ</h3>
            <div className="ck-pt-thanh-cung">
              {CUNG_DONG_TU.map((c) => (
                <Link
                  key={c.slug}
                  href={duongDanCungPhi(c)}
                  className="ck-pt-thanh-cung-muc"
                >
                  {c.kyHieu} {c.ten} ({c.loai})
                </Link>
              ))}
            </div>
          </div>

          <div className="ck-pt-nhom-khoi">
            <h3>Tây tứ</h3>
            <div className="ck-pt-thanh-cung">
              {CUNG_TAY_TU.map((c) => (
                <Link
                  key={c.slug}
                  href={duongDanCungPhi(c)}
                  className="ck-pt-thanh-cung-muc"
                >
                  {c.kyHieu} {c.ten} ({c.loai})
                </Link>
              ))}
            </div>
          </div>
        </div>

        <p className="ck-pt-cach-tinh-dong">
          Hai cung cùng nhóm thì du niên là một trong 4 cát; khác nhóm thì là một trong 4 hung.
        </p>
      </section>

      {/* 5. Liên kết 8 cung & công cụ */}
      <section className="ck-td-muc" aria-labelledby="ck-bt-cung-tieu">
        <h2 id="ck-bt-cung-tieu" className="ck-td-tieu">
          8 trang cung Bát trạch
        </h2>
        <ThanhTamCung />
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Trang liên quan</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/phong-thuy/cung-phi">Tra cung phi theo năm sinh</Link>
          <Link href="/phong-thuy/huong-nha">Xem hướng nhà theo độ la bàn</Link>
          <Link href="/phong-thuy">Tổng quan Phong thủy</Link>
        </div>
      </nav>

      <GhiCongHiepKy daDung={daDung} />
    </KhungTrang>
  );
}
