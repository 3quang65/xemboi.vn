import type { Metadata } from 'next';
import Link from 'next/link';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { danhGiaAnchor, NGUONG_MAC_DINH } from '@/lib/seo/anchor';
import type { BaoCaoQuet } from '@/lib/seo/quet';
import type { DieuKien } from '@/lib/seo/quy-tac-lien-ket';
import ThongBao, { so } from '../ThongBao';
import { batTatQuyTacLienKet, boQuaGoiYLienKet, chapNhanGoiYLienKet, xuLyCanhBao } from './hanh-dong';
import {
  CanhBaoAnchorBadges,
  dinhDangGioVn,
  docChiTietCanhBao,
  DS_LOAI_CANH_BAO,
  DS_LOAI_CANH_BAO_QUET,
  nhanMucDo,
  TEN_KIEU_QUY_TAC,
  TEN_LOAI_CANH_BAO,
  TEN_NGUON_LK,
} from './HienThi';

export const metadata: Metadata = { title: 'Liên kết nội bộ' };
export const dynamic = 'force-dynamic';

const CO = 50;

const TABS = [
  { id: 'tong-quan', ten: 'Tổng quan' },
  { id: 'canh-bao', ten: 'Cảnh báo' },
  { id: 'trang', ten: 'Mồ côi & quá sâu' },
  { id: 'goi-y', ten: 'Gợi ý' },
  { id: 'anchor', ten: 'Phân bố anchor' },
  { id: 'quy-tac', ten: 'Quy tắc' },
] as const;

type TabId = (typeof TABS)[number]['id'];

type Tham = {
  tab?: string;
  loai?: string;
  mucDo?: string;
  quyTacId?: string;
  q?: string;
  p?: string;
  bao?: string;
  loi?: string;
};

type BaoCaoQuetLuu = BaoCaoQuet & { goc?: string };

function layTab(raw?: string): TabId {
  return TABS.some((t) => t.id === raw) ? (raw as TabId) : 'tong-quan';
}

export default async function TrangLienKet({ searchParams }: { searchParams: Promise<Tham> }) {
  const nd = await yeuCauQuyen('seo.xem');
  const sp = await searchParams;
  const tab = layTab(sp.tab);
  const sua = coQuyen(nd.vaiTro, 'seo.sua');
  const p = Math.max(1, Number(sp.p) || 1);

  const [soCanhBaoMo, soGoiY] = await Promise.all([
    prisma.seoCanhBao.count({ where: { trangThai: 'MO' } }),
    prisma.seoLienKet.count({ where: { trangThai: 'DE_XUAT' } }),
  ]);

  const qs = (thay: Partial<Tham>) => {
    const u = new URLSearchParams();
    const gop: Record<string, string | undefined> = {
      tab,
      loai: sp.loai,
      mucDo: sp.mucDo,
      quyTacId: sp.quyTacId,
      q: sp.q,
      p: sp.p,
      ...thay,
    };
    for (const [k, v] of Object.entries(gop)) {
      if (v) u.set(k, String(v));
    }
    const s = u.toString();
    return s ? `/quan-tri/seo/lien-ket?${s}` : '/quan-tri/seo/lien-ket';
  };

  const quayVe = qs({});

  return (
    <>
      <h1>Liên kết nội bộ</h1>
      <p className="qt-phu">
        Theo dõi đồ thị liên kết từ lần quét gần nhất, xử lý cảnh báo, duyệt gợi ý và kiểm soát phân bố anchor text.
      </p>
      <ThongBao bao={sp.bao} loi={sp.loi} />

      <nav className="qt-tab-thanh" aria-label="Phân mục liên kết nội bộ">
        {TABS.map((t) => {
          const active = t.id === tab;
          const dem = t.id === 'canh-bao' ? soCanhBaoMo : t.id === 'goi-y' ? soGoiY : null;
          return (
            <Link
              key={t.id}
              href={`/quan-tri/seo/lien-ket?tab=${t.id}`}
              className="qt-tab qt-lk-tab"
              aria-current={active ? 'page' : undefined}
            >
              <span>{t.ten}</span>
              {dem !== null && <span className="qt-nhan">{so(dem)}</span>}
            </Link>
          );
        })}
      </nav>

      {tab === 'tong-quan' && <TabTongQuan soCanhBaoMo={soCanhBaoMo} />}
      {tab === 'canh-bao' && <TabCanhBao sp={sp} p={p} sua={sua} quayVe={quayVe} qs={qs} />}
      {tab === 'trang' && <TabTrang />}
      {tab === 'goi-y' && <TabGoiY sp={sp} p={p} sua={sua} quayVe={quayVe} qs={qs} />}
      {tab === 'anchor' && <TabAnchor />}
      {tab === 'quy-tac' && <TabQuyTac sua={sua} quayVe={quayVe} />}
    </>
  );
}

async function TabTongQuan({ soCanhBaoMo }: { soCanhBaoMo: number }) {
  const [caiDat, nhomCb] = await Promise.all([
    prisma.caiDat.findUnique({ where: { khoa: 'SEO_QUET_LAN_CUOI' } }),
    prisma.seoCanhBao.groupBy({ by: ['loai'], where: { trangThai: 'MO' }, _count: true }),
  ]);

  const bc = (caiDat?.giaTri ?? null) as BaoCaoQuetLuu | null;
  const demTheoLoai = new Map<string, number>();
  for (const r of nhomCb) demTheoLoai.set(r.loai, r._count);

  const cacLoaiHien = Array.from(new Set([...DS_LOAI_CANH_BAO_QUET, ...demTheoLoai.keys()]));
  const theoMaEntries = bc?.theoMa ? Object.entries(bc.theoMa).sort(([a], [b]) => a.localeCompare(b)) : [];

  return (
    <>
      {!bc && (
        <div className="qt-bao">
          Chưa có dữ liệu lần quét nào (khóa <code>SEO_QUET_LAN_CUOI</code> chưa có trong <code>CaiDat</code>).
        </div>
      )}

      {bc?.catNgang && (
        <div className="qt-bao loi" role="alert">
          Cảnh báo: Lần quét gần nhất bị cắt ngang — quét dở, chưa tính mồ côi.
        </div>
      )}

      {bc && (
        <div className="qt-luoi">
          <div className="qt-so">
            <div className="qt-so-nhan">Lúc quét</div>
            <div className="qt-so-gt" style={{ fontSize: 16 }}>
              {dinhDangGioVn(bc.xong ?? bc.batDau)}
            </div>
            <div className="qt-so-nhan">{bc.goc ?? '–'}</div>
          </div>
          <div className="qt-so">
            <div className="qt-so-nhan">Thời gian quét</div>
            <div className="qt-so-gt">{so(bc.giay)} giây</div>
            <div className="qt-so-nhan">Trong CSDL: {so(bc.trangCsdlDaQuet)} trang</div>
          </div>
          <div className="qt-so">
            <div className="qt-so-nhan">Số trang đã tải</div>
            <div className="qt-so-gt">{so(bc.daTai)}</div>
            <div className="qt-so-nhan">Lỗi tải: {so(bc.loiTai)}</div>
          </div>
          <div className="qt-so">
            <div className="qt-so-nhan">Theo mã HTTP</div>
            <div className="qt-so-gt" style={{ fontSize: 16 }}>
              {theoMaEntries.length ? theoMaEntries.map(([ma, dem]) => `${ma}: ${so(dem)}`).join(' · ') : '–'}
            </div>
            <div className="qt-so-nhan">Liên kết hỏng: {so(bc.lienKetHong)} · 3xx: {so(bc.lienKetChuyenHuong)}</div>
          </div>
          <div className="qt-so">
            <div className="qt-so-nhan">Liên kết nội bộ</div>
            <div className="qt-so-gt">{so(bc.lienKetNoiBo)}</div>
            <div className="qt-so-nhan">Ghi CSDL (2 đầu là SeoTrang): {so(bc.lienKetGhiCsdl)}</div>
          </div>
          <div className="qt-so">
            <div className="qt-so-nhan">Trang ngoài CSDL</div>
            <div className="qt-so-gt">{so(bc.trangNgoaiCsdl)}</div>
            <div className="qt-so-nhan">Quét thấy nhưng chưa có trong SeoTrang</div>
          </div>
          <div className="qt-so">
            <div className="qt-so-nhan">Cờ cắt ngang</div>
            <div className="qt-so-gt" style={{ color: bc.catNgang ? 'var(--bad)' : 'var(--good)', fontSize: 18 }}>
              {bc.catNgang ? 'Có — quét dở, chưa tính mồ côi' : 'Không (quét đủ)'}
            </div>
            <div className="qt-so-nhan">
              Mới: {so(bc.canhBaoMoi)} · Tự đóng: {so(bc.canhBaoDong)}
            </div>
          </div>
        </div>
      )}

      <div className="qt-the">
        <h2>Cảnh báo mở theo loại ({so(soCanhBaoMo)} cảnh báo đang mở)</h2>
        <p className="qt-phu">Bấm vào từng ô để chuyển sang tab cảnh báo đã lọc theo loại tương ứng.</p>
        <div className="qt-luoi" style={{ marginBottom: 0 }}>
          <Link
            href="/quan-tri/seo/lien-ket?tab=canh-bao"
            className="qt-so"
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            <div className="qt-so-nhan">Tất cả cảnh báo mở</div>
            <div className="qt-so-gt">{so(soCanhBaoMo)}</div>
          </Link>
          {cacLoaiHien.map((loai) => {
            const dem = demTheoLoai.get(loai) ?? 0;
            return (
              <Link
                key={loai}
                href={`/quan-tri/seo/lien-ket?tab=canh-bao&loai=${encodeURIComponent(loai)}`}
                className="qt-so"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                <div className="qt-so-nhan">{TEN_LOAI_CANH_BAO[loai] ?? loai}</div>
                <div className="qt-so-gt" style={dem > 0 ? { color: 'var(--bad)' } : undefined}>
                  {so(dem)}
                </div>
                <div className="qt-so-nhan">{loai}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

async function TabCanhBao({
  sp,
  p,
  sua,
  quayVe,
  qs,
}: {
  sp: Tham;
  p: number;
  sua: boolean;
  quayVe: string;
  qs: (thay: Partial<Tham>) => string;
}) {
  const where: Prisma.SeoCanhBaoWhereInput = { trangThai: 'MO' };
  if (sp.loai) where.loai = sp.loai;
  const mucDoNum = Number(sp.mucDo);
  if ([1, 2, 3].includes(mucDoNum)) where.mucDo = mucDoNum;

  const [tong, ds] = await Promise.all([
    prisma.seoCanhBao.count({ where }),
    prisma.seoCanhBao.findMany({
      where,
      orderBy: [{ mucDo: 'asc' }, { taoLuc: 'desc' }, { id: 'desc' }],
      skip: (p - 1) * CO,
      take: CO,
      include: {
        trang: { select: { id: true, duongDan: true, maTrang: true } },
      },
    }),
  ]);

  const soTrang = Math.max(1, Math.ceil(tong / CO));

  return (
    <>
      <form className="qt-loc" method="get">
        <input type="hidden" name="tab" value="canh-bao" />
        <select className="qt-o" name="loai" defaultValue={sp.loai ?? ''} aria-label="Loại cảnh báo">
          <option value="">Mọi loại cảnh báo</option>
          {DS_LOAI_CANH_BAO.map((l) => (
            <option key={l} value={l}>
              {TEN_LOAI_CANH_BAO[l] ?? l} ({l})
            </option>
          ))}
        </select>
        <select className="qt-o" name="mucDo" defaultValue={sp.mucDo ?? ''} aria-label="Mức độ">
          <option value="">Mọi mức độ</option>
          <option value="1">Mức 1 — Cao</option>
          <option value="2">Mức 2 — Trung bình</option>
          <option value="3">Mức 3 — Thấp</option>
        </select>
        <button className="qt-nut" type="submit">
          Lọc
        </button>
        <Link className="qt-nut phu" href="/quan-tri/seo/lien-ket?tab=canh-bao">
          Xóa lọc
        </Link>
        <span className="qt-phu" style={{ margin: 0 }}>
          {so(tong)} cảnh báo mở khớp bộ lọc · {CO} dòng/trang
        </span>
      </form>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Loại</th>
              <th>Mức</th>
              <th>Đường dẫn</th>
              <th className="qt-cot-so">Mã HTTP</th>
              <th>Anchor</th>
              <th>Lúc tạo</th>
              {sua && <th>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 && (
              <tr>
                <td colSpan={sua ? 7 : 6} style={{ color: 'var(--muted)' }}>
                  Không có cảnh báo mở nào khớp bộ lọc.
                </td>
              </tr>
            )}
            {ds.map((c) => {
              const ct = docChiTietCanhBao(c.chiTiet);
              const duong =
                c.loai === 'LOI_HTTP'
                  ? `${ct.tu ?? '?'} → ${ct.den ?? '?'}`
                  : ct.duong ?? c.trang?.duongDan ?? '–';
              return (
                <tr key={c.id}>
                  <td>
                    <div>
                      <b>{TEN_LOAI_CANH_BAO[c.loai] ?? c.loai}</b>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.loai}</div>
                  </td>
                  <td>{nhanMucDo(c.mucDo)}</td>
                  <td>
                    {c.trangId ? (
                      <Link href={`/quan-tri/seo/trang/${c.trangId}`}>{duong}</Link>
                    ) : (
                      <span>{duong}</span>
                    )}
                    {ct.doSau != null && (
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>Độ sâu: {ct.doSau}</div>
                    )}
                    {ct.robots && (
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>Robots: {ct.robots}</div>
                    )}
                    {ct.kieu && (
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                        {ct.kieu}: thực tế {ct.thucTe ?? 'trống'} · mong đợi {ct.mongDoi ?? '–'}
                      </div>
                    )}
                    {ct.viTri && (
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>Location: {ct.viTri}</div>
                    )}
                  </td>
                  <td className="qt-cot-so">{ct.ma != null ? ct.ma : '–'}</td>
                  <td>{ct.anchor || '–'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{dinhDangGioVn(c.taoLuc)}</td>
                  {sua && (
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div className="qt-lk-form">
                        <form action={xuLyCanhBao}>
                          <input type="hidden" name="id" value={c.id} />
                          <input type="hidden" name="trangThai" value="DA_XU_LY" />
                          <input type="hidden" name="quayVe" value={quayVe} />
                          <button className="qt-nut qt-lk-nut-nho" type="submit">
                            Đã xử lý
                          </button>
                        </form>
                        <form action={xuLyCanhBao}>
                          <input type="hidden" name="id" value={c.id} />
                          <input type="hidden" name="trangThai" value="BO_QUA" />
                          <input type="hidden" name="quayVe" value={quayVe} />
                          <button className="qt-nut phu qt-lk-nut-nho" type="submit">
                            Bỏ qua
                          </button>
                        </form>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="qt-loc">
        {p > 1 && (
          <Link className="qt-nut phu" href={qs({ p: String(p - 1) })}>
            ← Trước
          </Link>
        )}
        <span>
          Trang {p}/{soTrang}
        </span>
        {p < soTrang && (
          <Link className="qt-nut phu" href={qs({ p: String(p + 1) })}>
            Sau →
          </Link>
        )}
      </div>
    </>
  );
}

async function TabTrang() {
  const [moCoi, quaSau] = await Promise.all([
    prisma.seoTrang.findMany({
      where: { trangThai: 'XUAT_BAN', soLienKetVao: 0 },
      orderBy: { duongDan: 'asc' },
      select: {
        id: true,
        maTrang: true,
        duongDan: true,
        doSau: true,
        soLienKetVao: true,
        soLienKetRa: true,
        maHttpLanQuet: true,
        quetLuc: true,
      },
    }),
    prisma.seoTrang.findMany({
      where: { doSau: { gt: 3 } },
      orderBy: [{ doSau: 'desc' }, { duongDan: 'asc' }],
      select: {
        id: true,
        maTrang: true,
        duongDan: true,
        doSau: true,
        soLienKetVao: true,
        soLienKetRa: true,
        maHttpLanQuet: true,
        quetLuc: true,
      },
    }),
  ]);

  const bangTrang = (
    ds: typeof moCoi,
    rongText: string,
  ) => (
    <table className="qt-bang">
      <thead>
        <tr>
          <th>Đường dẫn</th>
          <th className="qt-cot-so">Độ sâu</th>
          <th className="qt-cot-so">Vào</th>
          <th className="qt-cot-so">Ra</th>
          <th className="qt-cot-so">Mã HTTP</th>
          <th>Lúc quét</th>
        </tr>
      </thead>
      <tbody>
        {ds.length === 0 && (
          <tr>
            <td colSpan={6} style={{ color: 'var(--muted)' }}>
              {rongText}
            </td>
          </tr>
        )}
        {ds.map((t) => (
          <tr key={t.id}>
            <td>
              <Link href={`/quan-tri/seo/trang/${t.id}`}>{t.duongDan}</Link>
              {t.maTrang && (
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{t.maTrang}</div>
              )}
            </td>
            <td className="qt-cot-so">{t.doSau ?? '–'}</td>
            <td className="qt-cot-so">{so(t.soLienKetVao)}</td>
            <td className="qt-cot-so">{so(t.soLienKetRa)}</td>
            <td className="qt-cot-so">{t.maHttpLanQuet ?? '–'}</td>
            <td style={{ whiteSpace: 'nowrap' }}>{dinhDangGioVn(t.quetLuc)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <div className="qt-the qt-the-cuon">
        <h2>Trang xuất bản mồ côi theo CSDL ({so(moCoi.length)})</h2>
        <p className="qt-phu">Các trang có trạng thái XUAT_BAN và soLienKetVao = 0.</p>
        {bangTrang(moCoi, 'Không có trang xuất bản nào bị mồ côi.')}
      </div>

      <div className="qt-the qt-the-cuon">
        <h2>Trang quá sâu: độ sâu &gt; 3 ({so(quaSau.length)})</h2>
        <p className="qt-phu">Các trang cần quá 3 lần nhấp từ trang chủ trong đồ thị quét.</p>
        {bangTrang(quaSau, 'Không có trang nào có độ sâu lớn hơn 3.')}
      </div>
    </>
  );
}

async function TabGoiY({
  sp,
  p,
  sua,
  quayVe,
  qs,
}: {
  sp: Tham;
  p: number;
  sua: boolean;
  quayVe: string;
  qs: (thay: Partial<Tham>) => string;
}) {
  const where: Prisma.SeoLienKetWhereInput = { trangThai: 'DE_XUAT' };
  if (sp.quyTacId) where.quyTacId = sp.quyTacId;
  if (sp.q?.trim()) {
    where.tuTrang = { duongDan: { contains: sp.q.trim(), mode: 'insensitive' } };
  }

  const [dsQuyTac, tong, ds] = await Promise.all([
    prisma.seoQuyTacLienKet.findMany({ orderBy: { ten: 'asc' }, select: { id: true, ten: true } }),
    prisma.seoLienKet.count({ where }),
    prisma.seoLienKet.findMany({
      where,
      orderBy: [{ doGan: { sort: 'desc', nulls: 'last' } }, { taoLuc: 'desc' }, { id: 'asc' }],
      skip: (p - 1) * CO,
      take: CO,
      include: {
        tuTrang: { select: { id: true, duongDan: true, maTrang: true } },
        denTrang: { select: { id: true, duongDan: true, maTrang: true } },
      },
    }),
  ]);

  const mapQuyTac = new Map(dsQuyTac.map((q) => [q.id, q.ten]));
  const soTrang = Math.max(1, Math.ceil(tong / CO));

  return (
    <>
      <form className="qt-loc" method="get">
        <input type="hidden" name="tab" value="goi-y" />
        <select className="qt-o" name="quyTacId" defaultValue={sp.quyTacId ?? ''} aria-label="Lọc theo quy tắc">
          <option value="">Mọi quy tắc</option>
          {dsQuyTac.map((q) => (
            <option key={q.id} value={q.id}>
              {q.ten}
            </option>
          ))}
        </select>
        <input
          className="qt-o"
          name="q"
          defaultValue={sp.q}
          placeholder="Tìm đường dẫn trang nguồn"
          style={{ minWidth: 230 }}
        />
        <button className="qt-nut" type="submit">
          Lọc
        </button>
        <Link className="qt-nut phu" href="/quan-tri/seo/lien-ket?tab=goi-y">
          Xóa lọc
        </Link>
        <span className="qt-phu" style={{ margin: 0 }}>
          {so(tong)} gợi ý đề xuất khớp bộ lọc · {CO} dòng/trang
        </span>
      </form>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Từ trang → Đến trang</th>
              <th>Anchor{sua ? ' & thao tác' : ''}</th>
              <th>Quy tắc</th>
              <th>Nguồn</th>
              <th className="qt-cot-so">Độ gần</th>
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: 'var(--muted)' }}>
                  Không có gợi ý liên kết nào khớp bộ lọc.
                </td>
              </tr>
            )}
            {ds.map((l) => (
              <tr key={l.id}>
                <td>
                  <div>
                    <Link href={`/quan-tri/seo/trang/${l.tuTrang.id}`}>{l.tuTrang.duongDan}</Link>
                    {' → '}
                    <Link href={`/quan-tri/seo/trang/${l.denTrang.id}`}>{l.denTrang.duongDan}</Link>
                  </div>
                  {(l.tuTrang.maTrang || l.denTrang.maTrang) && (
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {l.tuTrang.maTrang ?? '–'} → {l.denTrang.maTrang ?? '–'}
                    </div>
                  )}
                </td>
                <td>
                  {sua ? (
                    <form action={chapNhanGoiYLienKet} className="qt-lk-form">
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="quayVe" value={quayVe} />
                      <input
                        className="qt-o"
                        name="anchor"
                        defaultValue={l.anchor}
                        maxLength={200}
                        required
                        aria-label={`Anchor gợi ý từ ${l.tuTrang.duongDan} tới ${l.denTrang.duongDan}`}
                        style={{ minWidth: 230, flex: '1 1 230px', padding: '4px 8px' }}
                      />
                      <button className="qt-nut qt-lk-nut-nho" type="submit">
                        Chấp nhận
                      </button>
                      <button
                        className="qt-nut phu qt-lk-nut-nho"
                        type="submit"
                        formAction={boQuaGoiYLienKet}
                        formNoValidate
                      >
                        Bỏ qua
                      </button>
                    </form>
                  ) : (
                    <span>{l.anchor}</span>
                  )}
                </td>
                <td style={{ maxWidth: 240 }}>
                  {l.quyTacId ? mapQuyTac.get(l.quyTacId) ?? l.quyTacId : '–'}
                </td>
                <td>
                  <span className="qt-nhan">{TEN_NGUON_LK[l.nguon] ?? l.nguon}</span>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{l.nguon}</div>
                </td>
                <td className="qt-cot-so">{l.doGan != null ? l.doGan.toFixed(3) : '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="qt-loc">
        {p > 1 && (
          <Link className="qt-nut phu" href={qs({ p: String(p - 1) })}>
            ← Trước
          </Link>
        )}
        <span>
          Trang {p}/{soTrang}
        </span>
        {p < soTrang && (
          <Link className="qt-nut phu" href={qs({ p: String(p + 1) })}>
            Sau →
          </Link>
        )}
      </div>
    </>
  );
}

async function TabAnchor() {
  const topDen = await prisma.seoLienKet.groupBy({
    by: ['denTrangId'],
    where: { trangThai: 'DANG_CO' },
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 30,
  });

  const ids = topDen.map((x) => x.denTrangId);
  const [dsTrang, dsLienKet] = ids.length
    ? await Promise.all([
        prisma.seoTrang.findMany({
          where: { id: { in: ids } },
          select: {
            id: true,
            duongDan: true,
            maTrang: true,
            soLienKetVao: true,
            tuKhoaChinh: { select: { chuoi: true } },
          },
        }),
        prisma.seoLienKet.findMany({
          where: { denTrangId: { in: ids }, trangThai: 'DANG_CO' },
          select: { denTrangId: true, anchor: true },
        }),
      ])
    : [[], []];

  const anchorsTheoTrang = new Map<string, string[]>();
  for (const lk of dsLienKet) {
    const ds = anchorsTheoTrang.get(lk.denTrangId) ?? [];
    ds.push(lk.anchor);
    anchorsTheoTrang.set(lk.denTrangId, ds);
  }

  const dong = dsTrang
    .map((t) => {
      const anchors = anchorsTheoTrang.get(t.id) ?? [];
      const dg = danhGiaAnchor(anchors, t.tuKhoaChinh?.chuoi);
      return { trang: t, dg };
    })
    .sort(
      (a, b) =>
        b.dg.tong - a.dg.tong ||
        b.trang.soLienKetVao - a.trang.soLienKetVao ||
        a.trang.duongDan.localeCompare(b.trang.duongDan),
    );

  return (
    <>
      <div className="qt-the qt-the-cuon">
        <h2>Phân bố anchor của {dong.length} trang đích có nhiều liên kết vào nhất</h2>
        <p className="qt-phu">
          Lưu ý: ngưỡng cảnh báo là giả định (khớp chính xác &gt; {Math.round(NGUONG_MAC_DINH.chinhXac * 100)}%,
          một anchor áp đảo &gt; {Math.round(NGUONG_MAC_DINH.motAnchor * 100)}%, chung chung &gt;{' '}
          {Math.round(NGUONG_MAC_DINH.chungChung * 100)}%; chỉ bật cảnh báo khi có ít nhất {NGUONG_MAC_DINH.toiThieu}{' '}
          liên kết <code>DANG_CO</code> trong CSDL).
        </p>
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Trang đích</th>
              <th className="qt-cot-so">Liên kết (CSDL / Quét)</th>
              <th className="qt-cot-so">Chính xác</th>
              <th className="qt-cot-so">Một phần</th>
              <th className="qt-cot-so">Thương hiệu</th>
              <th className="qt-cot-so">Chung chung</th>
              <th className="qt-cot-so">Khác</th>
              <th>Anchor hay gặp nhất</th>
              <th>Cảnh báo</th>
            </tr>
          </thead>
          <tbody>
            {dong.length === 0 && (
              <tr>
                <td colSpan={9} style={{ color: 'var(--muted)' }}>
                  Chưa có liên kết DANG_CO nào trong CSDL để phân tích anchor.
                </td>
              </tr>
            )}
            {dong.map(({ trang: t, dg }) => (
              <tr key={t.id}>
                <td>
                  <Link href={`/quan-tri/seo/trang/${t.id}`}>{t.duongDan}</Link>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    Từ khóa chính: {t.tuKhoaChinh?.chuoi ?? 'chưa gán'}
                  </div>
                </td>
                <td className="qt-cot-so">
                  {so(dg.tong)} / {so(t.soLienKetVao)}
                </td>
                <td className="qt-cot-so">{so(dg.theoLoai.CHINH_XAC)}</td>
                <td className="qt-cot-so">{so(dg.theoLoai.MOT_PHAN)}</td>
                <td className="qt-cot-so">{so(dg.theoLoai.THUONG_HIEU)}</td>
                <td className="qt-cot-so">{so(dg.theoLoai.CHUNG_CHUNG)}</td>
                <td className="qt-cot-so">{so(dg.theoLoai.KHAC)}</td>
                <td style={{ maxWidth: 260 }}>
                  {dg.hayGapNhat ? (
                    <>
                      <span>{dg.hayGapNhat.anchor || '(trống)'}</span>{' '}
                      <span className="qt-nhan">{so(dg.hayGapNhat.so)}</span>
                    </>
                  ) : (
                    '–'
                  )}
                </td>
                <td>
                  <CanhBaoAnchorBadges dg={dg} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

async function TabQuyTac({ sua, quayVe }: { sua: boolean; quayVe: string }) {
  const ds = await prisma.seoQuyTacLienKet.findMany({ orderBy: { ten: 'asc' } });

  return (
    <div className="qt-the qt-the-cuon">
      <h2>Quy tắc liên kết ({so(ds.length)})</h2>
      <p className="qt-phu">Chỉ hỗ trợ bật/tắt quy tắc ở đợt này; nội dung quy tắc giữ nguyên theo bộ chuẩn.</p>
      <table className="qt-bang">
        <thead>
          <tr>
            <th>Tên quy tắc</th>
            <th>Kiểu</th>
            <th>Đích</th>
            <th className="qt-cot-so">Tối thiểu / Tối đa</th>
            <th>Bắt buộc</th>
            <th>Bật / tắt</th>
          </tr>
        </thead>
        <tbody>
          {ds.length === 0 && (
            <tr>
              <td colSpan={6} style={{ color: 'var(--muted)' }}>
                Chưa có quy tắc liên kết nào.
              </td>
            </tr>
          )}
          {ds.map((q) => {
            const dk = (q.dieuKien ?? {}) as Partial<DieuKien>;
            const kieu = dk.kieu ?? '–';
            return (
              <tr key={q.id}>
                <td>
                  <div>
                    <b>{q.ten}</b>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {q.tuLoai ? `Loại: ${q.tuLoai}` : 'Mọi loại'}
                    {dk.mang?.length ? ` · Mảng: ${dk.mang.join(', ')}` : ''}
                    {dk.tienTo?.length ? ` · Tiền tố: ${dk.tienTo.join(', ')}` : ''}
                  </div>
                </td>
                <td>
                  <span className="qt-nhan">{TEN_KIEU_QUY_TAC[kieu] ?? kieu}</span>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{kieu}</div>
                </td>
                <td>{q.denMau}</td>
                <td className="qt-cot-so">
                  {q.soToiThieu} / {q.soToiDa}
                </td>
                <td>
                  {q.batBuoc ? <span className="qt-nhan vua">Bắt buộc</span> : <span style={{ color: 'var(--muted)' }}>Không</span>}
                </td>
                <td>
                  {sua ? (
                    <form action={batTatQuyTacLienKet}>
                      <input type="hidden" name="id" value={q.id} />
                      <input type="hidden" name="quayVe" value={quayVe} />
                      <button className="qt-nut phu qt-lk-nut-nho" type="submit">
                        {q.batTat ? 'Đang bật · Tắt' : 'Đang tắt · Bật'}
                      </button>
                    </form>
                  ) : (
                    <span className={`qt-nhan ${q.batTat ? 'tot' : ''}`}>
                      {q.batTat ? 'Đang bật' : 'Đang tắt'}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
