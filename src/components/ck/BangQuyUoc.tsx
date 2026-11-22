import Link from 'next/link';
import { trangDaDung } from '@/lib/trang/dieu-huong';
import type { QuyUocTinh } from '@/lib/trang/nen';

const NHOM_MANG = ['Lịch âm', 'Tử vi', 'Bát tự'] as const;

const NHAN_XEM_THEM: Record<string, string> = {
  '/phuong-phap/thang-nhuan': 'Tháng nhuận',
  '/phuong-phap/gio-ty': 'Giờ Tý',
  '/phuong-phap/nam-phai-bac-phai': 'Nam phái & Bắc phái',
  '/tu-vi/sao': '14 chính tinh',
};

function layLienKetXemThem(
  xemThem: string | undefined,
  daDung: Set<string>,
  duongDanHienTai?: string,
): string | null {
  if (!xemThem) return null;
  if (duongDanHienTai && xemThem === duongDanHienTai) return null;
  if (daDung.has(xemThem)) {
    return xemThem;
  }
  return null;
}

function BangNhom({
  danhSach,
  daDung,
  duongDanHienTai,
}: {
  danhSach: QuyUocTinh[];
  daDung: Set<string>;
  duongDanHienTai?: string;
}) {
  const coXemThem = danhSach.some(
    (q) => layLienKetXemThem(q.xemThem, daDung, duongDanHienTai) !== null,
  );

  return (
    <div className="ck-bang-khung">
      <table className="ck-bang ck-bang-the ck-pp-bang">
        <thead>
          <tr>
            <th scope="col" className="ck-pp-cot-chu-de">
              Chủ đề
            </th>
            <th scope="col" className="ck-pp-cot-mac-dinh">
              Cách xemboi tính
            </th>
            <th scope="col" className="ck-pp-cot-khac">
              Cách khác
            </th>
            {coXemThem ? (
              <th scope="col" className="ck-pp-cot-xem-them">
                Xem thêm
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {danhSach.map((q) => {
            const link = layLienKetXemThem(q.xemThem, daDung, duongDanHienTai);
            return (
              <tr key={q.ma}>
                <td data-nhan="Chủ đề">
                  <strong>{q.chuDe}</strong>
                </td>
                <td data-nhan="Cách xemboi tính">{q.macDinh}</td>
                <td data-nhan="Cách khác">
                  {q.khac.length === 0 ? (
                    <span className="ck-pp-trong">—</span>
                  ) : q.khac.length === 1 ? (
                    q.khac[0]
                  ) : (
                    <ul className="ck-pp-khac-ds">
                      {q.khac.map((k, idx) => (
                        <li key={idx}>{k}</li>
                      ))}
                    </ul>
                  )}
                </td>
                {coXemThem ? (
                  <td data-nhan="Xem thêm">
                    {link ? (
                      <Link href={link}>{NHAN_XEM_THEM[link] ?? 'Xem thêm'}</Link>
                    ) : (
                      <span className="ck-pp-trong">—</span>
                    )}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function BangQuyUoc({
  danhSach,
  duongDanHienTai,
  chiaNhom = false,
}: {
  danhSach: QuyUocTinh[];
  duongDanHienTai?: string;
  chiaNhom?: boolean;
}) {
  const daDung = trangDaDung();

  if (!chiaNhom) {
    return (
      <BangNhom
        danhSach={danhSach}
        daDung={daDung}
        duongDanHienTai={duongDanHienTai}
      />
    );
  }

  return (
    <>
      {NHOM_MANG.map((mang) => {
        const muc = danhSach.filter((q) => q.mang === mang);
        if (muc.length === 0) return null;
        return (
          <div key={mang} className="ck-pp-nhom">
            <h3 className="ck-pp-nhom-tieu">
              {mang} ({muc.length})
            </h3>
            <BangNhom
              danhSach={muc}
              daDung={daDung}
              duongDanHienTai={duongDanHienTai}
            />
          </div>
        );
      })}
    </>
  );
}
