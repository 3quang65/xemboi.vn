import type { Metadata } from 'next';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  bang64,
  BAT_QUAI_CHI_TIET,
  daDungKinhDich,
  duongDanQuai,
  duongDanQue,
  quaiTheoTenQ,
} from '@/lib/trang/chu-dich';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import {
  MAC_DINH_64_QUE,
  serializeJsonLd,
  taoSchemaDefinedTermSet64,
} from '../KinhDichHelpers';
import { GhiCongChuDich, LienKetKiem } from '../KinhDichUi';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/kinh-dich/64-que', MAC_DINH_64_QUE);
}

export default async function SauMuoiTuQuePage() {
  const tt = await thongTinTrang('/kinh-dich/64-que', MAC_DINH_64_QUE);
  const ds64 = bang64();
  const daDung = daDungKinhDich();
  const schemaTermSet = taoSchemaDefinedTermSet64(tt, ds64);

  const oBang8 = new Map<string, (typeof ds64)[number]>();
  for (const dong of ds64) {
    oBang8.set(`${dong.que.thuong.ten}|${dong.que.ha.ten}`, dong);
  }

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/kinh-dich/64-que"
      toi
      rong
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaTermSet) }}
      />

      <section className="ck-td-muc" aria-labelledby="ck-kd-ds64-tieu">
        <h2 id="ck-kd-ds64-tieu" className="ck-td-tieu">
          Danh sách 64 quẻ theo thứ tự Văn Vương
        </h2>
        <div className="ck-kd-luoi-64">
          {ds64.map(({ que, kyHieu }) => {
            const quaiTren = quaiTheoTenQ(que.thuong.ten);
            const quaiDuoi = quaiTheoTenQ(que.ha.ten);
            return (
              <article key={que.so} className="ck-kd-the-que">
                <LienKetKiem
                  href={duongDanQue(que)}
                  daDung={daDung}
                  className="ck-kd-the-que-chinh"
                >
                  <span className="ck-kd-the-so">#{que.so}</span>
                  <span className="ck-kd-the-ky" aria-hidden="true">
                    {kyHieu}
                  </span>
                  <strong className="ck-kd-the-ten">{que.ten}</strong>
                </LienKetKiem>
                <div className="ck-kd-the-quai">
                  <span>
                    Trên:{' '}
                    <LienKetKiem href={duongDanQuai(quaiTren)} daDung={daDung}>
                      {quaiTren.kyHieu} {quaiTren.ten}
                    </LienKetKiem>
                  </span>
                  <span>
                    Dưới:{' '}
                    <LienKetKiem href={duongDanQuai(quaiDuoi)} daDung={daDung}>
                      {quaiDuoi.kyHieu} {quaiDuoi.ten}
                    </LienKetKiem>
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-kd-bang8-tieu">
        <h2 id="ck-kd-bang8-tieu" className="ck-td-tieu">
          Bảng tra 8 × 8 (Quái trên × Quái dưới)
        </h2>
        <p className="ck-kd-phu-bang">
          Hàng là quái trên (thượng quái), cột là quái dưới (hạ quái).
        </p>
        <div className="ck-kd-bang8-khung">
          <table className="ck-bang ck-kd-bang8">
            <thead>
              <tr>
                <th scope="col">Trên \ Dưới</th>
                {BAT_QUAI_CHI_TIET.map((ha) => (
                  <th key={ha.slug} scope="col">
                    <LienKetKiem
                      href={duongDanQuai(ha)}
                      daDung={daDung}
                      className="ck-kd-bang8-quai"
                    >
                      <span aria-hidden="true">{ha.kyHieu}</span>
                      <span>{ha.ten}</span>
                    </LienKetKiem>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BAT_QUAI_CHI_TIET.map((thuong) => (
                <tr key={thuong.slug}>
                  <th scope="row">
                    <LienKetKiem
                      href={duongDanQuai(thuong)}
                      daDung={daDung}
                      className="ck-kd-bang8-quai"
                    >
                      <span aria-hidden="true">{thuong.kyHieu}</span>
                      <span>{thuong.ten}</span>
                    </LienKetKiem>
                  </th>
                  {BAT_QUAI_CHI_TIET.map((ha) => {
                    const o = oBang8.get(`${thuong.ten}|${ha.ten}`)!;
                    return (
                      <td key={ha.slug}>
                        <LienKetKiem
                          href={duongDanQue(o.que)}
                          daDung={daDung}
                          className="ck-kd-bang8-o"
                          title={`#${o.que.so} ${o.que.ten}`}
                        >
                          <span className="ck-kd-bang8-ky" aria-hidden="true">
                            {o.kyHieu}
                          </span>
                          <span className="ck-kd-bang8-so">#{o.que.so}</span>
                          <span className="ck-kd-bang8-ten">{o.que.tenNgan}</span>
                        </LienKetKiem>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <nav className="ck-lien-quan" aria-label="Liên kết Kinh Dịch">
        <h2>Tra cứu cùng cụm</h2>
        <div className="ck-lien-quan-ds">
          <LienKetKiem href="/kinh-dich/gieo-que" daDung={daDung}>
            Gieo quẻ Kinh Dịch
          </LienKetKiem>
          <LienKetKiem href="/kinh-dich" daDung={daDung}>
            Tổng quan Kinh Dịch
          </LienKetKiem>
        </div>
      </nav>

      <GhiCongChuDich daDung={daDung} />
    </KhungTrang>
  );
}
