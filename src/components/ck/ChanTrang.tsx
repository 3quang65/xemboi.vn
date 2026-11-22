import Link from 'next/link';
import { TrienXemBoi } from '@/components/r1/HoaVanE3';
import { trangDaDung, type CotChanTrang } from '@/lib/trang/dieu-huong';

export interface ChanTrangProps {
  cotChan: CotChanTrang[];
}

export default function ChanTrang({ cotChan }: ChanTrangProps) {
  const daDung = trangDaDung();

  return (
    <footer className="ck-chan ck-toi">
      <div className="ck-dai-may" aria-hidden="true" />
      <div className="ck-w ck-chan-in">
        <div>
          <Link href="/" className="ck-logo" aria-label="xemboi.vn, trang chủ">
            <TrienXemBoi className="ck-trien-o" />
            <span className="ck-logo-chu">
              <b className="ck-chu-vang">xemboi.vn</b>
            </span>
          </Link>
          <p className="ck-chan-mo-ta">
            Lá số tử vi theo quy ước Nam phái và lịch âm Việt Nam.
          </p>
        </div>

        {cotChan.map((cot) => (
          <div key={cot.tieuDe}>
            <h4 className="ck-chu-vang">{cot.tieuDe}</h4>
            <ul>
              {cot.muc.map((m) => (
                <li key={m.href}>
                  {daDung.has(m.href) ? (
                    <Link href={m.href}>{m.ten}</Link>
                  ) : (
                    <span>{m.ten} (Sắp có)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="ck-hoi-van" aria-hidden="true" />
      <div className="ck-w ck-chan-duoi">
        <span>© 2026 xemboi.vn</span>
        <span>Kết quả tra cứu chỉ để tham khảo</span>
      </div>
    </footer>
  );
}
