import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { kiemTuCam } from '@/lib/seo/tu-cam';
import { danhGiaAnchor, NGUONG_MAC_DINH } from '@/lib/seo/anchor';
import { luuTrang } from '../../hanh-dong';
import ThongBao, { nhanTrangThai, so } from '../../ThongBao';
import {
  CanhBaoAnchorBadges,
  dinhDangGioVn,
  docChiTietCanhBao,
  nhanMucDo,
  nhanTrangThaiLk,
  TEN_LOAI_CANH_BAO,
  TEN_NGUON_LK,
} from '../../lien-ket/HienThi';

export const metadata: Metadata = { title: 'Sửa trang SEO' };
export const dynamic = 'force-dynamic';

const dem = (s: string | null | undefined) => (s ?? '').length;

export default async function SuaTrang({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ bao?: string; loi?: string }> }) {
  const nd = await yeuCauQuyen('seo.xem');
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const t = await prisma.seoTrang.findUnique({
    where: { id },
    include: {
      mauTrang: { select: { ma: true, mauDuongDan: true } },
      tuKhoaChinh: { select: { chuoi: true } },
    },
  });
  if (!t) notFound();
  const sua = coQuyen(nd.vaiTro, 'seo.sua');
  const [tuKhoa, chuyenDen, camTitle, camMeta, camH1, lienKetVao, lienKetRa, anchorsDangCo, canhBaoMo] = await Promise.all([
    prisma.seoTuKhoa.findMany({ where: { trangDichId: id }, orderBy: { luongTim: { sort: 'desc', nulls: 'last' } }, take: 30, select: { chuoi: true, luongTim: true, cachGan: true } }),
    prisma.seoChuyenHuong.findMany({ where: { denUrl: t.duongDan }, select: { tuMien: true, tuDuongDan: true, ma: true, batTat: true } }),
    kiemTuCam(prisma, t.title, 'TIEU_DE'), kiemTuCam(prisma, t.metaDescription ?? '', 'META'), kiemTuCam(prisma, t.h1 ?? '', 'H1'),
    prisma.seoLienKet.findMany({
      where: { denTrangId: id, trangThai: { in: ['DANG_CO', 'DE_XUAT'] } },
      orderBy: [{ trangThai: 'asc' }, { taoLuc: 'desc' }],
      take: 100,
      include: { tuTrang: { select: { id: true, duongDan: true, maTrang: true } } },
    }),
    prisma.seoLienKet.findMany({
      where: { tuTrangId: id, trangThai: { in: ['DANG_CO', 'DE_XUAT'] } },
      orderBy: [{ trangThai: 'asc' }, { taoLuc: 'desc' }],
      take: 100,
      include: { denTrang: { select: { id: true, duongDan: true, maTrang: true } } },
    }),
    prisma.seoLienKet.findMany({
      where: { denTrangId: id, trangThai: 'DANG_CO' },
      select: { anchor: true },
    }),
    prisma.seoCanhBao.findMany({
      where: { trangId: id, trangThai: 'MO' },
      orderBy: [{ mucDo: 'asc' }, { taoLuc: 'desc' }],
    }),
  ]);
  const cam = [...camTitle.viPham, ...camMeta.viPham, ...camH1.viPham];
  const tongTk = await prisma.seoTuKhoa.aggregate({ where: { trangDichId: id }, _count: true, _sum: { luongTim: true } });
  const dgAnchor = danhGiaAnchor(
    anchorsDangCo.map((x) => x.anchor),
    t.tuKhoaChinh?.chuoi,
  );

  return (
    <>
      <p className="qt-phu"><Link href="/quan-tri/seo/trang">← Danh sách trang</Link></p>
      <h1>{t.maTrang ?? t.duongDan}</h1>
      <p className="qt-phu">{t.loai} · {nhanTrangThai(t.trangThai)} · sitemap “{t.nhomSitemap}”{t.mauTrang && <> · mẫu {t.mauTrang.ma}</>}{t.ghiDeMau && <> · đã sửa tay (nạp lại từ 16 không ghi đè)</>}</p>
      <ThongBao bao={sp.bao} loi={sp.loi} />
      {cam.length > 0 && <div className="qt-bao loi">Có từ cấm: {cam.map((v) => `“${v.cum}” (${v.xuLy}${v.thayBang ? ` → ${v.thayBang}` : ''})`).join(', ')}</div>}
      <form className="qt-the" action={luuTrang} style={{ display: 'grid', gap: 10, maxWidth: 760 }}>
        <input type="hidden" name="id" value={t.id} />
        <fieldset disabled={!sua} style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 10 }}>
          <label style={{ display: 'grid', gap: 4 }}>Đường dẫn {t.trangThai === 'XUAT_BAN' && <small style={{ color: 'var(--muted)' }}>Đổi đường dẫn của trang đã xuất bản sẽ tự tạo 301 từ đường cũ.</small>}
            <input className="qt-o" name="duongDan" defaultValue={t.duongDan} required />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>Title <small style={{ color: 'var(--muted)' }}>{dem(t.title)} ký tự (nên 50–60)</small>
            <input className="qt-o" name="title" defaultValue={t.title} required maxLength={200} />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>Meta description <small style={{ color: 'var(--muted)' }}>{dem(t.metaDescription)} ký tự (nên 120–160)</small>
            <textarea className="qt-o" name="metaDescription" defaultValue={t.metaDescription ?? ''} rows={3} maxLength={400} />
          </label>
          <label style={{ display: 'grid', gap: 4 }}>H1<input className="qt-o" name="h1" defaultValue={t.h1 ?? ''} maxLength={200} /></label>
          <label style={{ display: 'grid', gap: 4 }}>Canonical (để trống = chính nó)<input className="qt-o" name="canonical" defaultValue={t.canonical ?? ''} placeholder="/duong-dan hoặc https://xemboi.vn/..." /></label>
          <div className="qt-loc">
            <label>Trạng thái{' '}
              <select className="qt-o" name="trangThai" defaultValue={t.trangThai}>
                <option value="NHAP">Nháp</option><option value="XUAT_BAN">Xuất bản</option><option value="AN">Ẩn</option><option value="DA_CHUYEN">Đã chuyển</option>
              </select>
            </label>
            <label><input type="checkbox" name="noindex" defaultChecked={t.noindex} /> noindex</label>
          </div>
          {sua && <div><button className="qt-nut" type="submit">Lưu</button></div>}
        </fieldset>
      </form>
      <div className="qt-the">
        <h2>Từ khóa đích: {so(tongTk._count)} từ, {so(tongTk._sum.luongTim)} lượt/tháng</h2>
        <table className="qt-bang">
          <tbody>{tuKhoa.map((k) => <tr key={k.chuoi}><td>{k.chuoi}{k.cachGan === 'TAY' && <> <span className="qt-nhan vua">tay</span></>}</td><td className="qt-cot-so">{so(k.luongTim)}</td></tr>)}</tbody>
        </table>
        {tongTk._count > 30 && <p><Link href={`/quan-tri/seo/tu-khoa?trang=${encodeURIComponent(t.maTrang ?? '')}`}>Xem đủ {so(tongTk._count)} từ khóa →</Link></p>}
      </div>
      {chuyenDen.length > 0 && (
        <div className="qt-the">
          <h2>Chuyển hướng về trang này</h2>
          <ul>{chuyenDen.map((c) => <li key={c.tuMien + c.tuDuongDan}>{c.tuMien}{c.tuDuongDan} ({c.ma}){!c.batTat && ' (đang tắt)'}</li>)}</ul>
        </div>
      )}
      <div className="qt-the">
        <div className="qt-dau-trang">
          <h2 style={{ margin: 0 }}>Liên kết</h2>
          <Link className="qt-nut phu qt-lk-nut-nho" href="/quan-tri/seo/lien-ket">
            Tổng quan liên kết →
          </Link>
        </div>

        <div className="qt-lk-tom-tat">
          <span>
            Độ sâu: <b>{t.doSau ?? '–'}</b>
          </span>
          <span>
            Số vào (lần quét): <b>{so(t.soLienKetVao)}</b>
          </span>
          <span>
            Số ra (lần quét): <b>{so(t.soLienKetRa)}</b>
          </span>
          <span>
            Mã HTTP lần quét: <b>{t.maHttpLanQuet ?? '–'}</b>
          </span>
          <span>
            Lúc quét: <b>{t.quetLuc ? dinhDangGioVn(t.quetLuc) : 'Chưa quét'}</b>
          </span>
        </div>
        <p className="qt-phu" style={{ marginTop: -6 }}>
          Số vào/ra trên thanh tóm tắt tính theo mọi trang tải được khi quét; hai bảng dưới liệt kê các liên kết giữa
          những trang đã khai báo trong <code>SeoTrang</code> (tối đa 100 dòng mỗi bảng, gồm trạng thái <code>DANG_CO</code>{' '}
          và <code>DE_XUAT</code>).
        </p>

        {canhBaoMo.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <h3>Cảnh báo mở gắn với trang này ({so(canhBaoMo.length)})</h3>
            <table className="qt-bang">
              <thead>
                <tr>
                  <th>Loại</th>
                  <th>Mức</th>
                  <th>Chi tiết</th>
                  <th>Lúc tạo</th>
                  <th>Xử lý</th>
                </tr>
              </thead>
              <tbody>
                {canhBaoMo.map((cb) => {
                  const ct = docChiTietCanhBao(cb.chiTiet);
                  const moTa =
                    cb.loai === 'LOI_HTTP'
                      ? `${ct.tu ?? '?'} → ${ct.den ?? '?'} (HTTP ${ct.ma ?? '?'}${ct.anchor ? `, anchor: “${ct.anchor}”` : ''})`
                      : ct.duong ?? t.duongDan;
                  return (
                    <tr key={cb.id}>
                      <td>
                        <b>{TEN_LOAI_CANH_BAO[cb.loai] ?? cb.loai}</b>
                      </td>
                      <td>{nhanMucDo(cb.mucDo)}</td>
                      <td>{moTa}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{dinhDangGioVn(cb.taoLuc)}</td>
                      <td>
                        <Link href={`/quan-tri/seo/lien-ket?tab=canh-bao&loai=${encodeURIComponent(cb.loai)}`}>
                          Mở tab cảnh báo →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <h3>Phân bố anchor (khi làm trang đích)</h3>
          <p className="qt-phu" style={{ marginBottom: 8 }}>
            Từ khóa chính: <b>{t.tuKhoaChinh?.chuoi ?? 'chưa gán'}</b> · Tổng liên kết đang có:{' '}
            <b>{so(dgAnchor.tong)}</b>
            {dgAnchor.hayGapNhat && (
              <>
                {' '}
                · Hay gặp nhất: <b>{dgAnchor.hayGapNhat.anchor || '(trống)'}</b> ({so(dgAnchor.hayGapNhat.so)} lần)
              </>
            )}{' '}
            · Đánh giá: <CanhBaoAnchorBadges dg={dgAnchor} />
          </p>
          <div className="qt-luoi" style={{ marginBottom: 6 }}>
            <div className="qt-so">
              <div className="qt-so-nhan">Chính xác</div>
              <div className="qt-so-gt">{so(dgAnchor.theoLoai.CHINH_XAC)}</div>
            </div>
            <div className="qt-so">
              <div className="qt-so-nhan">Một phần</div>
              <div className="qt-so-gt">{so(dgAnchor.theoLoai.MOT_PHAN)}</div>
            </div>
            <div className="qt-so">
              <div className="qt-so-nhan">Thương hiệu</div>
              <div className="qt-so-gt">{so(dgAnchor.theoLoai.THUONG_HIEU)}</div>
            </div>
            <div className="qt-so">
              <div className="qt-so-nhan">Chung chung</div>
              <div className="qt-so-gt">{so(dgAnchor.theoLoai.CHUNG_CHUNG)}</div>
            </div>
            <div className="qt-so">
              <div className="qt-so-nhan">Khác</div>
              <div className="qt-so-gt">{so(dgAnchor.theoLoai.KHAC)}</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
            Ngưỡng cảnh báo là giả định: chính xác &gt; {Math.round(NGUONG_MAC_DINH.chinhXac * 100)}%, một anchor &gt;{' '}
            {Math.round(NGUONG_MAC_DINH.motAnchor * 100)}%, chung chung &gt;{' '}
            {Math.round(NGUONG_MAC_DINH.chungChung * 100)}% (từ {NGUONG_MAC_DINH.toiThieu} liên kết trở lên).
          </p>
        </div>

        <div className="qt-lk-luoi-2">
          <div className="qt-the-cuon">
            <h3>
              Liên kết vào ({so(lienKetVao.length)}
              {lienKetVao.length === 100 ? '+' : ''})
            </h3>
            <table className="qt-bang">
              <thead>
                <tr>
                  <th>Từ trang</th>
                  <th>Anchor</th>
                  <th>Trạng thái</th>
                  <th>Nguồn</th>
                </tr>
              </thead>
              <tbody>
                {lienKetVao.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ color: 'var(--muted)' }}>
                      Chưa có liên kết vào (đang có / đề xuất).
                    </td>
                  </tr>
                )}
                {lienKetVao.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <Link href={`/quan-tri/seo/trang/${l.tuTrang.id}`}>{l.tuTrang.duongDan}</Link>
                    </td>
                    <td>{l.anchor || '–'}</td>
                    <td>{nhanTrangThaiLk(l.trangThai)}</td>
                    <td>{TEN_NGUON_LK[l.nguon] ?? l.nguon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="qt-the-cuon">
            <h3>
              Liên kết ra ({so(lienKetRa.length)}
              {lienKetRa.length === 100 ? '+' : ''})
            </h3>
            <table className="qt-bang">
              <thead>
                <tr>
                  <th>Đến trang</th>
                  <th>Anchor</th>
                  <th>Trạng thái</th>
                  <th>Nguồn</th>
                </tr>
              </thead>
              <tbody>
                {lienKetRa.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ color: 'var(--muted)' }}>
                      Chưa có liên kết ra (đang có / đề xuất).
                    </td>
                  </tr>
                )}
                {lienKetRa.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <Link href={`/quan-tri/seo/trang/${l.denTrang.id}`}>{l.denTrang.duongDan}</Link>
                    </td>
                    <td>{l.anchor || '–'}</td>
                    <td>{nhanTrangThaiLk(l.trangThai)}</td>
                    <td>{TEN_NGUON_LK[l.nguon] ?? l.nguon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
