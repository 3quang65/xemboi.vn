import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import {
  DocNhanh,
  MauNetTraCuuSvg,
  VongConGiap,
  type TheDocNhanhItem,
} from '@/components/ck/truc-quan';
import { CON_GIAP } from '@/lib/trang/can-chi';
import { GHI_CHU_CAP, capKhacCua, maTranCap } from '@/lib/trang/cap-con-giap';
import { metaTrang, thongTinTrang } from '@/lib/trang/meta';
import { slugConGiap } from '@/components/ck/canChiHelpers';
import { LocTuoiCapClient, type NhomTuoiLoc } from './LocTuoiCapClient';

const MAC_DINH_CON_GIAP_CAP = {
  title: '12 con giáp hợp nhau: ma trận 78 cặp tuổi và sách dẫn',
  h1: '12 con giáp hợp, xung, hình, hại theo cặp',
  description:
    'Bảng 12 × 12 con giáp theo địa chi năm sinh: tam hợp, lục hợp, lục xung, tương hình, tự hình và lục hại kèm trích dẫn sách.',
};

const CAU_DOC_NHANH =
  'Bảng 12 × 12 con giáp theo năm sinh: mỗi ô là quan hệ địa chi giữa hai tuổi (tam hợp, lục hợp, lục xung, hình, hại). Bấm ô để xem cặp.';

const THE_DOC_NHANH: TheDocNhanhItem[] = [
  {
    ma: 'tong-cap',
    nhan: 'Số trang cặp',
    giaTri: '78 cặp tuổi',
    chiTiet: 'Gồm 66 cặp khác chi và 12 cặp cùng chi từ Tý đến Hợi; bấm từng ô để đọc trích sách.',
  },
  {
    ma: 'nhom-quan-he',
    nhan: 'Quan hệ địa chi',
    giaTri: 'Hợp · Xung · Hình · Hại',
    chiTiet: 'Hợp tô vàng nhũ nhạt; xung, hình, hại dùng hổ phách hoặc xám dịu kèm kiểu nét riêng.',
  },
  {
    ma: 'da-quan-he',
    nhan: 'Cặp nhiều quan hệ',
    giaTri: 'Có cặp kiêm hai nhóm',
    chiTiet: 'Ví dụ Sửu–Mùi vừa lục xung vừa tương hình; Dần–Tỵ vừa lục hại vừa tương hình.',
  },
];

function nhanNganQuanHe(ten: string): { kyHieu: string; chu: string } {
  switch (ten) {
    case 'Tam hợp':
      return { kyHieu: '●', chu: 'Tam hợp' };
    case 'Lục hợp':
      return { kyHieu: '●', chu: 'Lục hợp' };
    case 'Lục xung':
      return { kyHieu: '⇄', chu: 'Xung' };
    case 'Tương hình':
      return { kyHieu: '△', chu: 'Hình' };
    case 'Tự hình':
      return { kyHieu: '◎', chu: 'Tự hình' };
    case 'Lục hại':
      return { kyHieu: '◇', chu: 'Hại' };
    default:
      return { kyHieu: '', chu: ten };
  }
}

function sapXepNhanO(tenDs: string[]): string[] {
  const loc = tenDs.filter((t) => t !== 'Tam hội');
  if (loc.includes('Lục hại') && loc.includes('Tương hình')) {
    return ['Lục hại', 'Tương hình', ...loc.filter((t) => t !== 'Lục hại' && t !== 'Tương hình')];
  }
  return loc;
}

export async function generateMetadata(): Promise<Metadata> {
  return metaTrang('/xem-tuoi/con-giap', MAC_DINH_CON_GIAP_CAP);
}

export default async function XemTuoiConGiapMaTranPage() {
  const tt = await thongTinTrang('/xem-tuoi/con-giap', MAC_DINH_CON_GIAP_CAP);
  const maTran = maTranCap();

  const dsLoc: NhomTuoiLoc[] = CON_GIAP.map((cg, idx) => {
    const capDs = capKhacCua(idx).map((c) => {
      const khac = c.a.chi === cg.chi ? c.b : c.a;
      const nhanNhom = sapXepNhanO(c.quanHe.map((q) => q.ten));
      return {
        slug: c.slug,
        duongDan: c.duongDan,
        chiKhac: khac.chi,
        tenConKhac: khac.ten,
        hanhKhac: khac.hanhChi,
        nhomChinh: c.nhomChinh,
        nhanNhom,
        tomTat: c.tomTat,
      };
    });
    return {
      thuTu: idx,
      chi: cg.chi,
      tenCon: cg.ten,
      slug: cg.slug,
      hanhChi: cg.hanhChi,
      cap: capDs,
    };
  });

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/xem-tuoi/con-giap"
      tenCuoi="Con giáp hợp nhau"
      toi
      rong
    >
      <DocNhanh cau={CAU_DOC_NHANH} the={THE_DOC_NHANH} tieuDeId="ck-xt-cg-dn" />

      <section className="ck-td-muc" aria-labelledby="ck-xt-mt-tieu">
        <h2 id="ck-xt-mt-tieu" className="ck-td-tieu">
          Ma trận 12 × 12 con giáp
        </h2>

        <div className="ck-xt-mt-layout">
          <div className="ck-xt-mt-trai">
            <div className="ck-xt-mt-khung" role="region" aria-label="Bảng ma trận 12 × 12 con giáp">
              <table className="ck-xt-mt-bang">
                <thead>
                  <tr>
                    <th scope="col">Tuổi</th>
                    {CON_GIAP.map((cot) => (
                      <th key={cot.chi} scope="col">
                        <span className="ck-xt-mt-chi">{cot.chi}</span>
                        <span className="ck-xt-mt-con">{cot.ten}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CON_GIAP.map((hang, a) => (
                    <tr key={hang.chi}>
                      <th scope="row">
                        <span className="ck-xt-mt-chi">{hang.chi}</span>
                        <span className="ck-xt-mt-con">{hang.ten}</span>
                      </th>
                      {CON_GIAP.map((cot, b) => {
                        const o = maTran.o[a][b];
                        const cungChi = a === b;
                        const tenLoc = sapXepNhanO(o.ten);
                        const chinh = tenLoc[0] ? nhanNganQuanHe(tenLoc[0]) : null;
                        const phu = tenLoc[1] ? nhanNganQuanHe(tenLoc[1]) : null;
                        const nhanAria = `${hang.chi} và ${cot.chi}: ${tenLoc.length > 0 ? tenLoc.join(', ') : 'không có quan hệ hợp, xung, hình, hại'}`;

                        return (
                          <td
                            key={`${hang.chi}-${cot.chi}`}
                            className={cungChi ? 'ck-xt-mt-o-cheo' : undefined}
                          >
                            <Link
                              href={o.duongDan}
                              className={`ck-xt-mt-o ck-xt-mt-nen-${o.nhom}${cungChi ? ' ck-xt-mt-cheo' : ''}`}
                              data-nhom={o.nhom}
                              data-cap={`${hang.chi}-${cot.chi}`}
                              data-ten={tenLoc.join(', ')}
                              aria-label={nhanAria}
                              title={nhanAria}
                            >
                              {chinh ? (
                                <>
                                  <span className="ck-xt-mt-chinh">
                                    <span aria-hidden="true">{chinh.kyHieu}</span> {chinh.chu}
                                  </span>
                                  {phu ? (
                                    <span className="ck-xt-mt-phu">
                                      +{phu.kyHieu} {phu.chu}
                                    </span>
                                  ) : null}
                                </>
                              ) : cungChi ? (
                                <span className="ck-xt-mt-trong" aria-hidden="true">
                                  ·
                                </span>
                              ) : (
                                <span className="ck-xt-mt-trong" aria-hidden="true" />
                              )}
                            </Link>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="ck-xt-mt-chu-giai" aria-label="Chú giải ký hiệu và màu trên ma trận">
              <li>
                <MauNetTraCuuSvg loai="tamHop" />
                <span className="ck-xt-mt-mau ck-xt-mt-nen-hop">●</span>
                <span>Tam hợp</span>
              </li>
              <li>
                <MauNetTraCuuSvg loai="lucHop" />
                <span className="ck-xt-mt-mau ck-xt-mt-nen-hop">●</span>
                <span>Lục hợp</span>
              </li>
              <li>
                <MauNetTraCuuSvg loai="xung" />
                <span className="ck-xt-mt-mau ck-xt-mt-nen-xung">⇄</span>
                <span>Lục xung</span>
              </li>
              <li>
                <MauNetTraCuuSvg loai="hinh" />
                <span className="ck-xt-mt-mau ck-xt-mt-nen-hinh">△</span>
                <span>Hình / Tự hình</span>
              </li>
              <li>
                <MauNetTraCuuSvg loai="hai" />
                <span className="ck-xt-mt-mau ck-xt-mt-nen-hai">◇</span>
                <span>Lục hại</span>
              </li>
              <li>
                <span className="ck-xt-mt-mau ck-xt-mt-nen-khong" />
                <span>Không thuộc nhóm nào</span>
              </li>
              <li>
                <span className="ck-xt-mt-mau ck-xt-mt-nen-khong ck-xt-mt-cheo">·</span>
                <span>Cùng chi (viền chấm)</span>
              </li>
            </ul>
          </div>

          <aside className="ck-xt-mt-phai" aria-label="Sơ đồ vòng 12 con giáp">
            <VongConGiap hienNetTongQuan />
          </aside>
        </div>
      </section>

      <section className="ck-td-muc" aria-labelledby="ck-xt-loc-tieu">
        <h2 id="ck-xt-loc-tieu" className="ck-td-tieu">
          Danh sách từng cặp theo tuổi của bạn
        </h2>
        <LocTuoiCapClient ds={dsLoc} />
      </section>

      <aside className="ck-xt-cap-gioi-han" aria-label="Giới hạn và cách xem theo năm sinh">
        <p>{GHI_CHU_CAP}</p>
        <div className="ck-xt-cap-hanh-dong">
          <Link href="/xem-tuoi/vo-chong" className="ck-nut ck-nut-son">
            Xem theo năm sinh cụ thể
          </Link>
          <Link href="/con-giap" className="ck-nut ck-nut-vien">
            Xem 12 con giáp
          </Link>
        </div>
      </aside>

      <nav className="ck-lien-quan" aria-label="Liên kết liên quan">
        <h2>Tra cứu theo từng con giáp</h2>
        <div className="ck-lien-quan-ds">
          {CON_GIAP.map((c) => (
            <Link key={c.slug} href={`/con-giap/${slugConGiap(c.chi)}`}>
              Tuổi {c.chi} ({c.ten})
            </Link>
          ))}
        </div>
      </nav>
    </KhungTrang>
  );
}
