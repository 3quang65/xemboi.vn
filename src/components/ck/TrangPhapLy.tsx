import type { Metadata } from 'next';
import KhungTrang from '@/components/ck/KhungTrang';
import NoiDungMd from '@/components/ck/NoiDungMd';
import { metaTrang, thongTinTrang, type MacDinhTrang } from '@/lib/trang/meta';
import { noiDungTheoDuongDan } from '@/lib/trang/noi-dung';

export async function taoMetadataPhapLy(
  duongDan: string,
  macDinh: MacDinhTrang,
): Promise<Metadata> {
  const [meta, nd] = await Promise.all([
    metaTrang(duongDan, macDinh),
    noiDungTheoDuongDan(duongDan),
  ]);
  return nd ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function TrangPhapLy({
  duongDan,
  macDinh,
  choGiu,
}: {
  duongDan: string;
  macDinh: MacDinhTrang;
  choGiu: string;
}) {
  const [tt, nd] = await Promise.all([
    thongTinTrang(duongDan, macDinh),
    noiDungTheoDuongDan(duongDan),
  ]);

  return (
    <KhungTrang tieuDe={tt.h1} phu={null} duongDan={duongDan} tenCuoi={tt.h1} toi>
      {nd ? (
        <article className="ck-bai-doc">
          {nd.than.length > 0 ? <NoiDungMd khoi={nd.than} capGoc={2} /> : null}
          {nd.khoi.length > 0 ? (
            <div className="ck-nd-cac-khoi">
              {nd.khoi.map((k) => (
                <section key={k.ma} className="ck-nd-khoi">
                  <h2>{k.ten}</h2>
                  <NoiDungMd khoi={k.noi} capGoc={3} />
                </section>
              ))}
            </div>
          ) : null}
        </article>
      ) : (
        <div className="ck-cho-noi-dung">
          <p>{choGiu}</p>
        </div>
      )}
    </KhungTrang>
  );
}
