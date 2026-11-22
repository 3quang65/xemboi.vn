import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { dieuKienPhamVi, duocXemNoiBo, phanTichBigInt } from '@/lib/rag/pham-vi';
import { catVanBan, ngayGio, nhanPhamVi, so, ThongBao } from '../HienThi';
import { docDoKhoCsv } from './du-lieu';
import { suaGhiChuCauHoi } from './hanh-dong';
import {
  boTienToGx,
  dinhDangPhanTram,
  docCauHinh,
  docChiTiet,
  DS_MANG,
  LA_MA_CHINH_THUC,
  laDangDungVps,
  soThapPhan,
  TEN_DO_KHO,
  TEN_MANG,
  type CauHinhDg,
  type ChiTietCauDg,
} from './HienThi';
import { NutXoaCauHoi } from './NutXoaCauHoi';

export const metadata: Metadata = { title: 'Đánh giá RAG' };
export const dynamic = 'force-dynamic';

const CO = 50;

const TABS = [
  { id: 'bang', ten: 'Bảng so sánh' },
  { id: 'so-sanh', ten: 'So sánh A / B' },
  { id: 'cau', ten: 'Từng câu' },
  { id: 'cau-hoi', ten: 'Bộ câu hỏi chuẩn' },
] as const;

type TabId = (typeof TABS)[number]['id'] | 'lan';

type Tham = {
  tab?: string;
  sap?: string;
  chieu?: string;
  ten?: string;
  mh?: string;
  a?: string;
  b?: string;
  mang?: string;
  ma?: string;
  ch?: string;
  p?: string;
  bao?: string;
  loi?: string;
};

type DongDanhGia = {
  id: string;
  moHinhNhung: string;
  cauHinh: CauHinhDg;
  soCau: number;
  recallAt10: number;
  mrr: number;
  tyLeDungNguon: number;
  luc: Date;
  soLan: number;
  dangDungVps: boolean;
  chiTiet: ChiTietCauDg[];
};

function layTab(raw?: string): TabId {
  if (raw === 'lan') return 'lan';
  return TABS.some((t) => t.id === raw) ? (raw as TabId) : 'bang';
}

function layMang(raw?: string): string {
  return DS_MANG.includes(raw as (typeof DS_MANG)[number]) ? String(raw) : '';
}

function nhomMoiNhat(
  rawList: {
    id: string;
    moHinhNhung: string;
    cauHinh: unknown;
    soCau: number;
    recallAt10: number;
    mrr: number;
    tyLeDungNguon: number;
    chiTiet: unknown;
    luc: Date;
  }[],
): DongDanhGia[] {
  const theoKhoa = new Map<string, DongDanhGia>();
  for (const r of rawList) {
    const chiTiet = docChiTiet(r.chiTiet);
    const ch = docCauHinh(r.cauHinh, chiTiet);
    const khoa = `${r.moHinhNhung}::${ch.ten}`;
    const daCo = theoKhoa.get(khoa);
    if (!daCo) {
      theoKhoa.set(khoa, {
        id: r.id,
        moHinhNhung: r.moHinhNhung,
        cauHinh: ch,
        soCau: r.soCau,
        recallAt10: r.recallAt10,
        mrr: r.mrr,
        tyLeDungNguon: r.tyLeDungNguon,
        luc: r.luc,
        soLan: 1,
        dangDungVps: laDangDungVps(r.moHinhNhung, ch),
        chiTiet,
      });
    } else {
      daCo.soLan += 1;
    }
  }
  return Array.from(theoKhoa.values());
}

function chonTotNhat(ds: DongDanhGia[]): DongDanhGia | undefined {
  return [...ds].sort(
    (x, y) => y.cauHinh.hitAt10 - x.cauHinh.hitAt10 || y.mrr - x.mrr || y.recallAt10 - x.recallAt10,
  )[0];
}

export default async function TrangDanhGiaRag({ searchParams }: { searchParams: Promise<Tham> }) {
  const nd = await yeuCauQuyen('rag.xem_cong_khai');
  const sp = await searchParams;
  const tab = layTab(sp.tab);
  const xemNoiBo = duocXemNoiBo(nd);
  const sua = coQuyen(nd.vaiTro, 'rag.sua_doan');
  const p = Math.max(1, Number(sp.p) || 1);

  const rawDg = await prisma.ragDanhGia.findMany({
    orderBy: [{ luc: 'desc' }, { id: 'desc' }],
  });
  const dsMoiNhat = nhomMoiNhat(rawDg);

  const qs = (thay: Partial<Tham>) => {
    const u = new URLSearchParams();
    const gop: Record<string, string | undefined> = {
      tab: tab === 'lan' ? 'lan' : tab,
      sap: sp.sap,
      chieu: sp.chieu,
      ten: sp.ten,
      mh: sp.mh,
      a: sp.a,
      b: sp.b,
      mang: sp.mang,
      ma: sp.ma,
      ch: sp.ch,
      p: sp.p,
      ...thay,
    };
    for (const [k, v] of Object.entries(gop)) {
      if (v) u.set(k, String(v));
    }
    const s = u.toString();
    return s ? `/quan-tri/rag/danh-gia?${s}` : '/quan-tri/rag/danh-gia';
  };

  const quayVe = qs({ bao: undefined, loi: undefined });

  return (
    <>
      <h1>Đánh giá tìm kiếm RAG</h1>
      <p className="qt-phu">
        Tổng hợp kết quả đo từ CSDL trên bộ câu hỏi chuẩn (không gọi mô hình ngôn ngữ khi xem trang).
      </p>
      <ThongBao bao={sp.bao} loi={sp.loi} />

      <nav className="qt-tab-thanh" aria-label="Phân mục đánh giá RAG">
        {TABS.map((t) => {
          const active = t.id === tab || (tab === 'lan' && t.id === 'bang');
          return (
            <Link
              key={t.id}
              href={`/quan-tri/rag/danh-gia?tab=${t.id}`}
              className="qt-tab qt-lk-tab"
              aria-current={active ? 'page' : undefined}
            >
              <span>{t.ten}</span>
            </Link>
          );
        })}
      </nav>

      {tab === 'bang' && <TabBang dsMoiNhat={dsMoiNhat} sp={sp} qs={qs} />}
      {tab === 'lan' && <TabLichSu rawDg={rawDg} sp={sp} />}
      {tab === 'so-sanh' && <TabSoSanh dsMoiNhat={dsMoiNhat} rawDg={rawDg} sp={sp} />}
      {tab === 'cau' && (
        <TabCau dsMoiNhat={dsMoiNhat} rawDg={rawDg} sp={sp} nd={nd} xemNoiBo={xemNoiBo} />
      )}
      {tab === 'cau-hoi' && <TabCauHoi sp={sp} p={p} sua={sua} quayVe={quayVe} qs={qs} />}
    </>
  );
}

type SapBang = 'hit_at_10' | 'recall_at_10' | 'mrr' | 'ty_le_dung_nguon' | 'ms_vector' | 'luc' | 'ten' | 'mo_hinh';

function laySapBang(raw?: string): SapBang {
  if (
    raw === 'recall_at_10' ||
    raw === 'mrr' ||
    raw === 'ty_le_dung_nguon' ||
    raw === 'ms_vector' ||
    raw === 'luc' ||
    raw === 'ten' ||
    raw === 'mo_hinh'
  ) {
    return raw;
  }
  return 'hit_at_10';
}

function TabBang({
  dsMoiNhat,
  sp,
  qs,
}: {
  dsMoiNhat: DongDanhGia[];
  sp: Tham;
  qs: (thay: Partial<Tham>) => string;
}) {
  const sap = laySapBang(sp.sap);
  const chieu: 'asc' | 'desc' = sp.chieu === 'asc' || sp.chieu === 'desc'
    ? sp.chieu
    : sap === 'ms_vector' || sap === 'ten' || sap === 'mo_hinh'
      ? 'asc'
      : 'desc';

  const maxHit = dsMoiNhat.reduce((m, x) => Math.max(m, x.cauHinh.hitAt10), 0);

  const dsSap = [...dsMoiNhat].sort((a, b) => {
    let cmp = 0;
    switch (sap) {
      case 'recall_at_10':
        cmp = a.recallAt10 - b.recallAt10;
        break;
      case 'mrr':
        cmp = a.mrr - b.mrr;
        break;
      case 'ty_le_dung_nguon':
        cmp = a.tyLeDungNguon - b.tyLeDungNguon;
        break;
      case 'ms_vector':
        cmp = (a.cauHinh.msMoiCauVector ?? Infinity) - (b.cauHinh.msMoiCauVector ?? Infinity);
        break;
      case 'luc':
        cmp = a.luc.getTime() - b.luc.getTime();
        break;
      case 'ten':
        cmp = a.cauHinh.ten.localeCompare(b.cauHinh.ten, 'vi');
        break;
      case 'mo_hinh':
        cmp = a.moHinhNhung.localeCompare(b.moHinhNhung, 'vi');
        break;
      case 'hit_at_10':
      default:
        cmp = a.cauHinh.hitAt10 - b.cauHinh.hitAt10 || a.mrr - b.mrr;
        break;
    }
    return chieu === 'asc' ? cmp : -cmp;
  });

  const tieuDeCot = (cot: SapBang, nhan: string, soCot = true) => {
    const dangSap = sap === cot;
    const chieuMoi = dangSap && chieu === 'desc' ? 'asc' : 'desc';
    const muiTen = dangSap ? (chieu === 'desc' ? ' ↓' : ' ↑') : '';
    return (
      <th className={soCot ? 'qt-cot-so' : undefined}>
        <Link href={qs({ sap: cot, chieu: chieuMoi })} style={{ color: 'inherit', textDecoration: 'none' }}>
          {nhan}
          {muiTen}
        </Link>
      </th>
    );
  };

  return (
    <>
      <form className="qt-loc" method="get">
        <input type="hidden" name="tab" value="bang" />
        <select className="qt-o" name="sap" defaultValue={sap} aria-label="Sắp xếp theo">
          <option value="hit_at_10">Sắp theo: hit@10</option>
          <option value="recall_at_10">Sắp theo: recall@10</option>
          <option value="mrr">Sắp theo: MRR</option>
          <option value="ty_le_dung_nguon">Sắp theo: Đúng nguồn</option>
          <option value="ms_vector">Sắp theo: ms/câu vector</option>
          <option value="mo_hinh">Sắp theo: Mô hình nhúng</option>
          <option value="ten">Sắp theo: Tên cấu hình</option>
          <option value="luc">Sắp theo: Lúc chạy</option>
        </select>
        <select className="qt-o" name="chieu" defaultValue={chieu} aria-label="Thứ tự">
          <option value="desc">Giảm dần</option>
          <option value="asc">Tăng dần</option>
        </select>
        <button className="qt-nut" type="submit">
          Sắp xếp
        </button>
        <span className="qt-phu" style={{ margin: 0 }}>
          {so(dsSap.length)} cấu hình (mỗi cấu hình lấy lần chạy mới nhất)
        </span>
      </form>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              {tieuDeCot('ten', 'Tên cấu hình', false)}
              {tieuDeCot('mo_hinh', 'Mô hình nhúng', false)}
              <th>Viết lại</th>
              {tieuDeCot('hit_at_10', 'hit@10')}
              {tieuDeCot('recall_at_10', 'recall@10')}
              {tieuDeCot('mrr', 'MRR')}
              {tieuDeCot('ty_le_dung_nguon', 'Đúng nguồn')}
              {tieuDeCot('ms_vector', 'ms/câu vector')}
              {tieuDeCot('luc', 'Lúc chạy', false)}
            </tr>
          </thead>
          <tbody>
            {dsSap.length === 0 && (
              <tr>
                <td colSpan={9} style={{ color: 'var(--muted)' }}>
                  Chưa có kết quả đánh giá nào.
                </td>
              </tr>
            )}
            {dsSap.map((r) => {
              const totNhat = maxHit > 0 && r.cauHinh.hitAt10 === maxHit;
              return (
                <tr key={r.id} className={totNhat ? 'qt-dg-tot-nhat' : undefined}>
                  <td style={{ minWidth: 260 }}>
                    <div>
                      <b>{r.cauHinh.ten}</b>{' '}
                      {totNhat && <span className="qt-nhan tot">Cao nhất</span>}{' '}
                      {r.dangDungVps && <span className="qt-nhan vua">đang dùng trên VPS</span>}
                    </div>
                    <div style={{ fontSize: 12, marginTop: 2 }}>
                      <Link
                        href={`/quan-tri/rag/danh-gia?tab=lan&ten=${encodeURIComponent(r.cauHinh.ten)}&mh=${encodeURIComponent(r.moHinhNhung)}`}
                      >
                        {so(r.soLan)} lần chạy
                      </Link>
                      {' · '}
                      <Link href={`/quan-tri/rag/danh-gia?tab=cau&ma=Q001&ch=${r.id}`}>Xem từng câu</Link>
                    </div>
                  </td>
                  <td style={{ maxWidth: 180, wordBreak: 'break-all' }}>
                    <code>{r.moHinhNhung}</code>
                  </td>
                  <td>{boTienToGx(r.cauHinh.vietLai)}</td>
                  <td className="qt-cot-so">
                    <b>{soThapPhan(r.cauHinh.hitAt10, 2)}</b>{' '}
                    <span style={{ color: 'var(--muted)', fontSize: 11 }}>
                      ({dinhDangPhanTram(r.cauHinh.hitAt10, 1)})
                    </span>
                  </td>
                  <td className="qt-cot-so">{dinhDangPhanTram(r.recallAt10, 1)}</td>
                  <td className="qt-cot-so">{soThapPhan(r.mrr, 3)}</td>
                  <td className="qt-cot-so">{dinhDangPhanTram(r.tyLeDungNguon, 1)}</td>
                  <td className="qt-cot-so">
                    {r.cauHinh.msMoiCauVector != null ? `${soThapPhan(r.cauHinh.msMoiCauVector, 1)} ms` : '–'}
                  </td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>{ngayGio(r.luc)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="qt-dg-chu-thich">
        <li>
          <b>hit@10</b>: tỷ lệ câu có ít nhất một đoạn đúng trong 10 đoạn đầu
        </li>
        <li>
          <b>recall@10</b>: số đoạn đúng tìm được trong top 10 chia cho min(số đoạn đúng, 10)
        </li>
        <li>
          <b>MRR</b>: trung bình 1/hạng của đoạn đúng đầu tiên (top 100)
        </li>
        <li>
          <b>đúng nguồn</b>: đoạn top 1 thuộc đúng sách
        </li>
      </ul>
    </>
  );
}

function TabLichSu({
  rawDg,
  sp,
}: {
  rawDg: {
    id: string;
    moHinhNhung: string;
    cauHinh: unknown;
    soCau: number;
    recallAt10: number;
    mrr: number;
    tyLeDungNguon: number;
    chiTiet: unknown;
    luc: Date;
  }[];
  sp: Tham;
}) {
  const ten = (sp.ten ?? '').trim();
  const mh = (sp.mh ?? '').trim();
  const ds = rawDg
    .map((r) => {
      const chiTiet = docChiTiet(r.chiTiet);
      const ch = docCauHinh(r.cauHinh, chiTiet);
      return { ...r, ch };
    })
    .filter((r) => (!ten || r.ch.ten === ten) && (!mh || r.moHinhNhung === mh));

  return (
    <>
      <div className="qt-loc" style={{ justifyContent: 'space-between' }}>
        <div>
          <b>Lịch sử các lần chạy:</b> {ten || 'Tất cả'}
          {mh ? (
            <>
              {' · '}
              <code>{mh}</code>
            </>
          ) : null}{' '}
          ({so(ds.length)} lần)
        </div>
        <Link className="qt-nut phu qt-lk-nut-nho" href="/quan-tri/rag/danh-gia?tab=bang">
          ← Về bảng so sánh
        </Link>
      </div>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Lúc chạy</th>
              <th>Mô hình nhúng</th>
              <th>Viết lại</th>
              <th className="qt-cot-so">Số câu</th>
              <th className="qt-cot-so">hit@10</th>
              <th className="qt-cot-so">recall@10</th>
              <th className="qt-cot-so">MRR</th>
              <th className="qt-cot-so">Đúng nguồn</th>
              <th className="qt-cot-so">ms/câu vector</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 && (
              <tr>
                <td colSpan={10} style={{ color: 'var(--muted)' }}>
                  Không có lần chạy nào khớp cấu hình này.
                </td>
              </tr>
            )}
            {ds.map((r) => (
              <tr key={r.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{ngayGio(r.luc)}</td>
                <td>
                  <code>{r.moHinhNhung}</code>
                </td>
                <td>{boTienToGx(r.ch.vietLai)}</td>
                <td className="qt-cot-so">{so(r.soCau)}</td>
                <td className="qt-cot-so">
                  <b>{soThapPhan(r.ch.hitAt10, 2)}</b> ({dinhDangPhanTram(r.ch.hitAt10, 1)})
                </td>
                <td className="qt-cot-so">{dinhDangPhanTram(r.recallAt10, 1)}</td>
                <td className="qt-cot-so">{soThapPhan(r.mrr, 3)}</td>
                <td className="qt-cot-so">{dinhDangPhanTram(r.tyLeDungNguon, 1)}</td>
                <td className="qt-cot-so">
                  {r.ch.msMoiCauVector != null ? `${soThapPhan(r.ch.msMoiCauVector, 1)} ms` : '–'}
                </td>
                <td>
                  <Link href={`/quan-tri/rag/danh-gia?tab=cau&ma=Q001&ch=${r.id}`}>Xem từng câu</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

async function TabSoSanh({
  dsMoiNhat,
  rawDg,
  sp,
}: {
  dsMoiNhat: DongDanhGia[];
  rawDg: {
    id: string;
    moHinhNhung: string;
    cauHinh: unknown;
    soCau: number;
    recallAt10: number;
    mrr: number;
    tyLeDungNguon: number;
    chiTiet: unknown;
    luc: Date;
  }[];
  sp: Tham;
}) {
  const mangLoc = layMang(sp.mang);
  const vpsMacDinh = dsMoiNhat.find((x) => x.dangDungVps);
  const totNhatMacDinh = chonTotNhat(dsMoiNhat);

  const idA = sp.a && rawDg.some((x) => x.id === sp.a) ? sp.a : (vpsMacDinh?.id ?? dsMoiNhat[0]?.id ?? '');
  const idB = sp.b && rawDg.some((x) => x.id === sp.b) ? sp.b : (totNhatMacDinh?.id ?? dsMoiNhat[0]?.id ?? '');

  const rowA = rawDg.find((x) => x.id === idA);
  const rowB = rawDg.find((x) => x.id === idB);

  const [dsCauHoi, doKhoMap] = await Promise.all([
    prisma.ragCauHoiChuan.findMany({
      select: { id: true, cauHoi: true, mang: true },
    }),
    Promise.resolve(docDoKhoCsv()),
  ]);

  const mapCau = new Map(dsCauHoi.map((c) => [c.id, c]));
  const ctA = rowA ? docChiTiet(rowA.chiTiet) : [];
  const ctB = rowB ? docChiTiet(rowB.chiTiet) : [];
  const mapA = new Map(ctA.map((x) => [x.ma, x]));
  const mapB = new Map(ctB.map((x) => [x.ma, x]));
  const tatCaMa = Array.from(new Set([...ctA.map((x) => x.ma), ...ctB.map((x) => x.ma)])).sort();

  let bHon = 0;
  let aHon = 0;
  let bangNhau = 0;
  const khacNhau: {
    ma: string;
    mang: string | null;
    doKho: string;
    cauHoi: string;
    hangA: number | null;
    hangB: number | null;
  }[] = [];

  for (const ma of tatCaMa) {
    const ch = mapCau.get(ma);
    if (mangLoc && ch?.mang !== mangLoc) continue;
    const ha = mapA.get(ma)?.hang ?? null;
    const hb = mapB.get(ma)?.hang ?? null;
    const va = ha ?? Infinity;
    const vb = hb ?? Infinity;
    if (vb < va) {
      bHon += 1;
      khacNhau.push({
        ma,
        mang: ch?.mang ?? null,
        doKho: doKhoMap.get(ma) ?? '',
        cauHoi: ch?.cauHoi ?? ma,
        hangA: ha,
        hangB: hb,
      });
    } else if (va < vb) {
      aHon += 1;
      khacNhau.push({
        ma,
        mang: ch?.mang ?? null,
        doKho: doKhoMap.get(ma) ?? '',
        cauHoi: ch?.cauHoi ?? ma,
        hangA: ha,
        hangB: hb,
      });
    } else {
      bangNhau += 1;
    }
  }

  const labelDong = (r: { id: string; moHinhNhung: string; cauHinh: unknown; luc: Date; chiTiet: unknown }) => {
    const ch = docCauHinh(r.cauHinh, docChiTiet(r.chiTiet));
    const vps = laDangDungVps(r.moHinhNhung, ch) ? ' [VPS]' : '';
    return `${r.moHinhNhung} · ${ch.ten} (hit@10 ${soThapPhan(ch.hitAt10, 2)})${vps} — ${ngayGio(r.luc)}`;
  };

  return (
    <>
      <form className="qt-loc" method="get">
        <input type="hidden" name="tab" value="so-sanh" />
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span>A:</span>
          <select className="qt-o" name="a" defaultValue={idA} style={{ maxWidth: 420 }}>
            {rawDg.map((r) => (
              <option key={r.id} value={r.id}>
                {labelDong(r)}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span>B:</span>
          <select className="qt-o" name="b" defaultValue={idB} style={{ maxWidth: 420 }}>
            {rawDg.map((r) => (
              <option key={r.id} value={r.id}>
                {labelDong(r)}
              </option>
            ))}
          </select>
        </label>
        <select className="qt-o" name="mang" defaultValue={mangLoc} aria-label="Lọc theo mảng">
          <option value="">Mọi mảng</option>
          {DS_MANG.map((m) => (
            <option key={m} value={m}>
              {TEN_MANG[m] ?? m} ({m})
            </option>
          ))}
        </select>
        <button className="qt-nut" type="submit">
          So sánh
        </button>
      </form>

      <div className="qt-luoi">
        <div className="qt-so">
          <div className="qt-so-nhan">Tổng câu đối chiếu</div>
          <div className="qt-so-gt">{so(bHon + aHon + bangNhau)}</div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">B hơn A (hạng B nhỏ hơn)</div>
          <div className="qt-so-gt" style={{ color: 'var(--good)' }}>
            {so(bHon)}
          </div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">A hơn B (hạng A nhỏ hơn)</div>
          <div className="qt-so-gt" style={{ color: 'var(--bad)' }}>
            {so(aHon)}
          </div>
        </div>
        <div className="qt-so">
          <div className="qt-so-nhan">Bằng nhau</div>
          <div className="qt-so-gt">{so(bangNhau)}</div>
        </div>
      </div>

      <div className="qt-the qt-the-cuon">
        <h2>Các câu khác hạng ({so(khacNhau.length)})</h2>
        <p className="qt-phu">Hạng nhỏ hơn là tốt hơn; “Không thấy” (null trong top 100) là tệ nhất.</p>
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Mảng</th>
              <th>Độ khó</th>
              <th>Câu hỏi</th>
              <th className="qt-cot-so">Hạng A</th>
              <th className="qt-cot-so">Hạng B</th>
            </tr>
          </thead>
          <tbody>
            {khacNhau.length === 0 && (
              <tr>
                <td colSpan={6} style={{ color: 'var(--muted)' }}>
                  Không có câu nào khác hạng trong bộ lọc này.
                </td>
              </tr>
            )}
            {khacNhau.map((k) => {
              const va = k.hangA ?? Infinity;
              const vb = k.hangB ?? Infinity;
              const bTotHon = vb < va;
              return (
                <tr key={k.ma}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link href={`/quan-tri/rag/danh-gia?tab=cau&ma=${encodeURIComponent(k.ma)}&ch=${idB}`}>
                      <b>{k.ma}</b>
                    </Link>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{k.mang ? TEN_MANG[k.mang] ?? k.mang : '–'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {k.doKho ? TEN_DO_KHO[k.doKho] ?? k.doKho : '–'}
                  </td>
                  <td>{k.cauHoi}</td>
                  <td className="qt-cot-so">
                    <span className={!bTotHon ? 'qt-xg-tot' : 'qt-xg-xau'}>
                      {k.hangA != null ? `#${k.hangA}` : 'Không thấy'}
                    </span>
                  </td>
                  <td className="qt-cot-so">
                    <span className={bTotHon ? 'qt-xg-tot' : 'qt-xg-xau'}>
                      {k.hangB != null ? `#${k.hangB}` : 'Không thấy'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

async function TabCau({
  dsMoiNhat,
  rawDg,
  sp,
  nd,
  xemNoiBo,
}: {
  dsMoiNhat: DongDanhGia[];
  rawDg: {
    id: string;
    moHinhNhung: string;
    cauHinh: unknown;
    soCau: number;
    recallAt10: number;
    mrr: number;
    tyLeDungNguon: number;
    chiTiet: unknown;
    luc: Date;
  }[];
  sp: Tham;
  nd: Awaited<ReturnType<typeof yeuCauQuyen>>;
  xemNoiBo: boolean;
}) {
  const [dsCau, doKhoMap] = await Promise.all([
    prisma.ragCauHoiChuan.findMany({
      orderBy: { id: 'asc' },
      select: { id: true, cauHoi: true, mang: true },
    }),
    Promise.resolve(docDoKhoCsv()),
  ]);

  const maChon =
    sp.ma && dsCau.some((c) => c.id === sp.ma)
      ? sp.ma
      : dsCau.some((c) => c.id === 'Q001')
        ? 'Q001'
        : (dsCau[0]?.id ?? '');

  const totNhat = chonTotNhat(dsMoiNhat);
  const chId = sp.ch && rawDg.some((x) => x.id === sp.ch) ? sp.ch : (totNhat?.id ?? dsMoiNhat[0]?.id ?? '');
  const cauHinhChon = rawDg.find((x) => x.id === chId);
  const chiTietChon = cauHinhChon ? docChiTiet(cauHinhChon.chiTiet) : [];
  const thongTinChon = cauHinhChon ? docCauHinh(cauHinhChon.cauHinh, chiTietChon) : null;

  const cauHoi = maChon ? await prisma.ragCauHoiChuan.findUnique({ where: { id: maChon } }) : null;
  const chiTietCauChon = chiTietChon.find((x) => x.ma === maChon) ?? null;

  const top5Ids: bigint[] = [];
  for (const s of chiTietCauChon?.top5 ?? []) {
    const idBig = phanTichBigInt(s);
    if (idBig !== null) top5Ids.push(idBig);
  }
  const tatCaDoanIds = Array.from(
    new Map(
      [...(cauHoi?.doanDung ?? []), ...top5Ids].map((id) => [String(id), id]),
    ).values(),
  );

  // Chặn phạm vi ở tầng truy vấn giống rag/doan: thiếu rag.xem_noi_bo thì câu lệnh chỉ đọc đoạn CONG_KHAI.
  const doanRows = tatCaDoanIds.length
    ? await prisma.ragDoan.findMany({
        where: { AND: [{ id: { in: tatCaDoanIds } }, dieuKienPhamVi(nd)] },
        select: {
          id: true,
          vanBan: true,
          phamVi: true,
          duongDan: true,
          nguon: { select: { ma: true, tenGoc: true } },
        },
      })
    : [];
  const mapDoan = new Map(doanRows.map((d) => [String(d.id), d]));
  const tapDung = new Set((cauHoi?.doanDung ?? []).map((x) => String(x)));

  return (
    <>
      <form className="qt-loc" method="get">
        <input type="hidden" name="tab" value="cau" />
        <select className="qt-o" name="ma" defaultValue={maChon} style={{ maxWidth: 460 }} aria-label="Câu hỏi">
          {dsCau.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} · {catVanBan(c.cauHoi, 80)}
            </option>
          ))}
        </select>
        <select className="qt-o" name="ch" defaultValue={chId} style={{ maxWidth: 400 }} aria-label="Cấu hình">
          {dsMoiNhat.map((d) => (
            <option key={d.id} value={d.id}>
              {d.moHinhNhung} · {d.cauHinh.ten} (hit@10 {soThapPhan(d.cauHinh.hitAt10, 2)})
            </option>
          ))}
        </select>
        <button className="qt-nut" type="submit">
          Xem
        </button>
      </form>

      {!cauHoi ? (
        <div className="qt-the">Chưa có câu hỏi chuẩn nào.</div>
      ) : (
        <>
          <div className="qt-the">
            <h2>
              {cauHoi.id}: {cauHoi.cauHoi}
            </h2>
            <div className="qt-lk-tom-tat" style={{ marginBottom: 12 }}>
              <span>
                <b>Mảng:</b> {cauHoi.mang ? `${TEN_MANG[cauHoi.mang] ?? cauHoi.mang} (${cauHoi.mang})` : '–'}
              </span>
              <span>
                <b>Độ khó:</b> {doKhoMap.get(cauHoi.id) ? TEN_DO_KHO[doKhoMap.get(cauHoi.id)!] ?? doKhoMap.get(cauHoi.id) : '–'}
              </span>
              <span>
                <b>Nguồn đúng:</b> {cauHoi.nguonDungMa.join(', ') || '–'}
              </span>
              <span>
                <b>Vị trí đúng:</b> {cauHoi.viTriDung || '–'}
              </span>
            </div>
            {cauHoi.ghiChu && (
              <p className="qt-phu" style={{ marginBottom: 12 }}>
                <b>Ghi chú:</b> {cauHoi.ghiChu}
              </p>
            )}

            <h3 style={{ fontSize: 14, margin: '0 0 8px' }}>
              Đoạn đúng ({so(cauHoi.doanDung.length)} đoạn)
            </h3>
            <table className="qt-bang">
              <thead>
                <tr>
                  <th>Mã đoạn</th>
                  <th>Nguồn</th>
                  <th>200 chữ đầu</th>
                </tr>
              </thead>
              <tbody>
                {cauHoi.doanDung.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ color: 'var(--muted)' }}>
                      Chưa gắn đoạn đúng.
                    </td>
                  </tr>
                )}
                {cauHoi.doanDung.map((idBig) => {
                  const idStr = String(idBig);
                  const d = mapDoan.get(idStr);
                  const anNoiBo = !d || (d.phamVi === 'NOI_BO' && !xemNoiBo);
                  return (
                    <tr key={idStr}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <Link href={`/quan-tri/rag/doan/${idStr}`}>
                          <b>#{idStr}</b>
                        </Link>
                        {d && <div style={{ marginTop: 4 }}>{nhanPhamVi(d.phamVi)}</div>}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{anNoiBo ? '(nội bộ)' : d.nguon.ma}</td>
                      <td>
                        {anNoiBo ? (
                          <span style={{ color: 'var(--muted)' }}>(nội bộ)</span>
                        ) : (
                          <span>{catVanBan(d.vanBan, 200)}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="qt-the qt-the-cuon">
            <h2>
              Top 5 của cấu hình:{' '}
              {cauHinhChon && thongTinChon ? `${cauHinhChon.moHinhNhung} · ${thongTinChon.ten}` : '–'}
            </h2>
            {chiTietCauChon && (
              <p className="qt-phu" style={{ marginBottom: 10 }}>
                Hạng đoạn đúng đầu tiên:{' '}
                <b>{chiTietCauChon.hang != null ? `#${chiTietCauChon.hang}` : 'Không thấy (top 100)'}</b> · recall@10:{' '}
                <b>{dinhDangPhanTram(chiTietCauChon.recall10, 1)}</b> · đúng nguồn top 1:{' '}
                <b>{chiTietCauChon.dungNguonTop1 ? 'Có' : 'Không'}</b>
              </p>
            )}
            <table className="qt-bang">
              <thead>
                <tr>
                  <th className="qt-cot-so">Hạng</th>
                  <th>Mã đoạn</th>
                  <th>Nguồn</th>
                  <th>120 chữ đầu</th>
                </tr>
              </thead>
              <tbody>
                {(!chiTietCauChon || chiTietCauChon.top5.length === 0) && (
                  <tr>
                    <td colSpan={4} style={{ color: 'var(--muted)' }}>
                      Cấu hình này không có dữ liệu top 5 cho câu {cauHoi.id}.
                    </td>
                  </tr>
                )}
                {(chiTietCauChon?.top5 ?? []).map((idStr, idx) => {
                  const d = mapDoan.get(idStr);
                  const dung = tapDung.has(idStr);
                  const anNoiBo = !d || (d.phamVi === 'NOI_BO' && !xemNoiBo);
                  return (
                    <tr key={`${idx}-${idStr}`} className={dung ? 'qt-dg-dung' : undefined}>
                      <td className="qt-cot-so">#{idx + 1}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <Link href={`/quan-tri/rag/doan/${idStr}`}>
                          <b>#{idStr}</b>
                        </Link>
                        {dung && (
                          <span className="qt-nhan tot" style={{ marginLeft: 6 }}>
                            Đoạn đúng
                          </span>
                        )}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{anNoiBo ? '(nội bộ)' : d.nguon.ma}</td>
                      <td>
                        {anNoiBo ? (
                          <span style={{ color: 'var(--muted)' }}>(nội bộ)</span>
                        ) : (
                          <span>{catVanBan(d.vanBan, 120)}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="qt-the qt-the-cuon">
            <h2>Hạng của câu {cauHoi.id} qua mọi cấu hình mới nhất</h2>
            <p className="qt-phu">Bấm vào tên cấu hình để xem top 5 của cấu hình đó.</p>
            <table className="qt-bang">
              <thead>
                <tr>
                  <th>Cấu hình</th>
                  <th>Mô hình nhúng</th>
                  <th className="qt-cot-so">Hạng đầu tiên</th>
                  <th className="qt-cot-so">recall@10</th>
                  <th>Đúng nguồn top 1</th>
                </tr>
              </thead>
              <tbody>
                {dsMoiNhat.map((d) => {
                  const ct = d.chiTiet.find((x) => x.ma === cauHoi.id);
                  const dangChon = d.id === chId;
                  return (
                    <tr key={d.id} className={dangChon ? 'qt-dg-chon' : undefined}>
                      <td>
                        <Link href={`/quan-tri/rag/danh-gia?tab=cau&ma=${encodeURIComponent(cauHoi.id)}&ch=${d.id}`}>
                          <b>{d.cauHinh.ten}</b>
                        </Link>{' '}
                        {d.dangDungVps && <span className="qt-nhan vua">đang dùng trên VPS</span>}
                      </td>
                      <td>
                        <code>{d.moHinhNhung}</code>
                      </td>
                      <td className="qt-cot-so">
                        {ct?.hang != null ? (
                          <span className={ct.hang <= 10 ? 'qt-xg-tot' : undefined}>
                            <b>#{ct.hang}</b>
                          </span>
                        ) : (
                          <span style={{ color: 'var(--muted)' }}>Không thấy</span>
                        )}
                      </td>
                      <td className="qt-cot-so">{ct ? dinhDangPhanTram(ct.recall10, 1) : '–'}</td>
                      <td>
                        {ct ? (
                          ct.dungNguonTop1 ? (
                            <span className="qt-nhan tot">Đúng nguồn</span>
                          ) : (
                            <span className="qt-nhan">Khác nguồn</span>
                          )
                        ) : (
                          '–'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

async function TabCauHoi({
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
  const mangLoc = layMang(sp.mang);
  const where = mangLoc ? { mang: mangLoc } : {};

  const [tong, ds, doKhoMap] = await Promise.all([
    prisma.ragCauHoiChuan.count({ where }),
    prisma.ragCauHoiChuan.findMany({
      where,
      orderBy: { id: 'asc' },
      skip: (p - 1) * CO,
      take: CO,
    }),
    Promise.resolve(docDoKhoCsv()),
  ]);

  const soTrang = Math.max(1, Math.ceil(tong / CO));

  return (
    <>
      <div className="qt-bao" role="note">
        Bộ đo chính thức là <code>docs/v2/rag-cau-hoi-chuan.csv</code>; script <code>rag-danh-gia.ts</code> nạp lại từ
        tệp đó và ghi đè các mã Q001–Q100. Câu thêm từ giao diện có mã khác và <b>không</b> vào bộ đo cho tới khi
        Claude Code chép vào CSV.
      </div>

      <form className="qt-loc" method="get">
        <input type="hidden" name="tab" value="cau-hoi" />
        <select className="qt-o" name="mang" defaultValue={mangLoc} aria-label="Lọc theo mảng">
          <option value="">Mọi mảng</option>
          {DS_MANG.map((m) => (
            <option key={m} value={m}>
              {TEN_MANG[m] ?? m} ({m})
            </option>
          ))}
        </select>
        <button className="qt-nut" type="submit">
          Lọc
        </button>
        <Link className="qt-nut phu" href="/quan-tri/rag/danh-gia?tab=cau-hoi">
          Xóa lọc
        </Link>
        <span className="qt-phu" style={{ margin: 0 }}>
          {so(tong)} câu hỏi · {CO} dòng/trang
        </span>
      </form>

      <div className="qt-the qt-the-cuon">
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Mảng</th>
              <th>Độ khó</th>
              <th>Câu hỏi</th>
              <th className="qt-cot-so">Số đoạn đúng</th>
              <th>Nguồn đúng</th>
              <th>Ghi chú</th>
              {sua && <th>Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 && (
              <tr>
                <td colSpan={sua ? 8 : 7} style={{ color: 'var(--muted)' }}>
                  Chưa có câu hỏi chuẩn nào khớp bộ lọc.
                </td>
              </tr>
            )}
            {ds.map((c) => {
              const laChinhThuc = LA_MA_CHINH_THUC.test(c.id);
              const doKho = doKhoMap.get(c.id) ?? '';
              return (
                <tr key={c.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link href={`/quan-tri/rag/danh-gia?tab=cau&ma=${encodeURIComponent(c.id)}`}>
                      <b>{c.id}</b>
                    </Link>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{c.mang ? TEN_MANG[c.mang] ?? c.mang : '–'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{doKho ? TEN_DO_KHO[doKho] ?? doKho : '–'}</td>
                  <td style={{ minWidth: 240 }}>
                    <div>{c.cauHoi}</div>
                    {c.viTriDung && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{c.viTriDung}</div>
                    )}
                  </td>
                  <td className="qt-cot-so">{so(c.doanDung.length)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{c.nguonDungMa.join(', ') || '–'}</td>
                  <td style={{ minWidth: 220 }}>
                    {sua && !laChinhThuc ? (
                      <form action={suaGhiChuCauHoi} className="qt-lk-form">
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="quayVe" value={quayVe} />
                        <input
                          className="qt-o"
                          name="ghiChu"
                          defaultValue={c.ghiChu ?? ''}
                          maxLength={1000}
                          aria-label={`Ghi chú câu ${c.id}`}
                          placeholder="Ghi chú..."
                          style={{ minWidth: 160, padding: '4px 8px', flex: '1 1 160px' }}
                        />
                        <button className="qt-nut qt-lk-nut-nho" type="submit">
                          Lưu
                        </button>
                      </form>
                    ) : (
                      <span style={{ color: c.ghiChu ? undefined : 'var(--muted)' }}>{c.ghiChu || '–'}</span>
                    )}
                  </td>
                  {sua && (
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {!laChinhThuc ? (
                        <NutXoaCauHoi id={c.id} quayVe={quayVe} />
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Bộ đo gốc</span>
                      )}
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
