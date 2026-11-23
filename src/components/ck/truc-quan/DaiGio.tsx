import type { DaiGio as DaiGioData } from '@/lib/trang/xem-ngay-truc-quan';
import './truc-quan.css';

const MOC_GIO = ['23:00', '05:00', '11:00', '17:00', '23:00'] as const;

export interface ChuGiaiDaiGioProps {
  soHoangDao: number;
  laHomNay?: boolean;
}

export function ChuGiaiDaiGio({
  soHoangDao,
  laHomNay = false,
}: ChuGiaiDaiGioProps) {
  return (
    <ul className="ck-tq-gio-cg" aria-label="Chú giải dải giờ">
      <li>
        <span className="ck-tq-gio-mau ck-tq-gio-mau-hd" aria-hidden="true" />
        Hoàng đạo ({soHoangDao} giờ)
      </li>
      <li>
        <span className="ck-tq-gio-mau ck-tq-gio-mau-hac" aria-hidden="true" />
        Hắc đạo
      </li>
      {laHomNay ? (
        <li>
          <span className="ck-tq-gio-mau ck-tq-gio-mau-nay" aria-hidden="true" />
          Bây giờ
        </li>
      ) : null}
    </ul>
  );
}

export interface DaiGioProps {
  dai: DaiGioData;
  tieuDe?: string;
  hienChuGiai?: boolean;
  hienGhiChu?: boolean;
  gon?: boolean;
  tenThan?: readonly string[];
  className?: string;
}

function tachKhungGio(khung: string): [string, string | null] {
  const idx = khung.indexOf('–');
  if (idx === -1) return [khung, null];
  return [khung.slice(0, idx), khung.slice(idx + 1)];
}

export function DaiGio({
  dai,
  tieuDe = '12 giờ trong ngày',
  hienChuGiai = true,
  hienGhiChu = true,
  gon = false,
  tenThan,
  className,
}: DaiGioProps) {
  const coTieuDe = tieuDe.trim().length > 0;
  const wrapCls = [gon ? 'ck-tq-gio ck-tq-gio-gon' : 'ck-tq-gio', className]
    .filter(Boolean)
    .join(' ');

  const noiDung = (
    <>
      {coTieuDe || hienChuGiai ? (
        <div className="ck-tq-gio-dau">
          {coTieuDe ? <h3 className="ck-tq-gio-tieu">{tieuDe}</h3> : null}
          {hienChuGiai ? (
            <ChuGiaiDaiGio
              soHoangDao={dai.soHoangDao}
              laHomNay={dai.laHomNay}
            />
          ) : null}
        </div>
      ) : null}

      <ol className="ck-tq-gio-luoi">
        {dai.gio.map((g) => {
          const [tu, den] = tachKhungGio(g.khung);
          const than = tenThan?.[g.chiSo];
          const nhanAria = [
            `Giờ ${g.chi} ${g.khung}`,
            than ? `thần ${than}` : null,
            g.hoangDao ? 'hoàng đạo' : 'hắc đạo',
            g.hienTai ? 'bây giờ' : g.daQua ? 'đã qua' : null,
          ]
            .filter(Boolean)
            .join(', ');

          const oCls = [
            'ck-tq-gio-o',
            g.hoangDao ? 'ck-tq-gio-hd' : 'ck-tq-gio-hac',
            g.daQua ? 'ck-tq-gio-qua' : '',
            g.hienTai ? 'ck-tq-gio-nay' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <li
              key={g.chi}
              className={oCls}
              aria-label={nhanAria}
              data-hoang-dao={g.hoangDao ? 'true' : 'false'}
              data-hien-tai={g.hienTai ? 'true' : undefined}
              data-da-qua={g.daQua ? 'true' : undefined}
              data-than={than}
            >
              {g.hienTai ? (
                <span className="ck-tq-gio-tag">Bây giờ</span>
              ) : null}
              <strong className="ck-tq-gio-chi">{g.chi}</strong>
              <span className="ck-tq-gio-khung">
                {den !== null ? (
                  <>
                    {tu}–<wbr />
                    {den}
                  </>
                ) : (
                  tu
                )}
              </span>
              <span className="ck-tq-gio-cc">{g.canChi}</span>
              {than ? <span className="ck-tq-gio-than">{than}</span> : null}
            </li>
          );
        })}
      </ol>

      <div className="ck-tq-gio-truc" aria-hidden="true">
        {MOC_GIO.map((moc, idx) => (
          <span key={`${moc}-${idx}`} className="ck-tq-gio-truc-phan">
            {idx > 0 ? <span className="ck-tq-gio-truc-cham"> · </span> : null}
            <span className={`ck-tq-gio-truc-moc ck-tq-gio-moc-${idx}`}>
              {moc}
            </span>
          </span>
        ))}
      </div>

      {hienGhiChu ? (
        <p className="ck-tq-gio-ghi-chu">{dai.ghiChuTy}</p>
      ) : null}
    </>
  );

  if (coTieuDe) {
    return (
      <section className={wrapCls} aria-label={tieuDe}>
        {noiDung}
      </section>
    );
  }

  return <div className={wrapCls}>{noiDung}</div>;
}
