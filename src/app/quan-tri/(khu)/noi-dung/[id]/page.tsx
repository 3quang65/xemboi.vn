import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { TrangThaiNoiDung } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import { coQuyen } from '@/lib/quan-tri/quyen';
import { KHOI, type KhoiMuc, type LoiNoiDung } from '@/lib/noi-dung/khoi';
import { uocBeRong } from '@/lib/noi-dung/onpage';
import { dongYTren, kiemChuyen, type Duyet, type NguCanhChuyen } from '@/lib/noi-dung/quy-trinh';
import ChonSeoTrang from '../ChonSeoTrang';
import {
  capNhatThongTinNoiDung,
  chuyenTrangThai,
  duyetNoiDung,
  duyetPhapLy,
  giaoChuyenGia,
  khoiPhucPhienBan,
  luuPhienBan,
} from '../hanh-dong';
import {
  catMeta,
  catTitleTheoBeRong,
  demLoiChan,
  docKiemTra,
  MA_MANG_HOP_LE,
  ngayGio,
  ngayNgan,
  nhanDiemOnpage,
  nhanTrangThaiNd,
  SAU_TRANG_THAI,
  TEN_KET_LUAN_DUYET,
  TEN_KIEU_TRICH,
  TEN_LOAI_NOI_DUNG,
  TEN_MANG,
  TEN_NGUON_TAO,
  TEN_NUT_CHUYEN,
  TEN_VAI_TRO_DUYET,
  ThongBao,
} from '../HienThi';
import { DUOC_AI_SOAN } from '@/lib/noi-dung/ai-soan';
import { docCauHinhLlm, tomTatKhoa } from '@/lib/ai/cau-hinh-llm';
import NutAiSoan from './NutAiSoan';
import SoSanhPhienBan from './SoSanhPhienBan';
import XemTruocGoogle from './XemTruocGoogle';

export const metadata: Metadata = { title: 'Chi tiết nội dung' };
export const dynamic = 'force-dynamic';

function docKhoi(raw: unknown): KhoiMuc {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return raw as KhoiMuc;
}

export default async function ChiTietNoiDung({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pb?: string; bao?: string; loi?: string }>;
}) {
  const nd = await yeuCauQuyen('noi_dung.xem');
  const [{ id }, sp] = await Promise.all([params, searchParams]);

  const noiDung = await prisma.noiDung.findUnique({
    where: { id },
    include: {
      trang: {
        include: { tuKhoaChinh: { select: { chuoi: true } } },
      },
      phienBan: {
        orderBy: { so: 'desc' },
        include: {
          trichDan: {
            orderBy: [{ khoi: 'asc' }, { id: 'asc' }],
            include: {
              doan: {
                select: {
                  id: true,
                  duongDan: true,
                  nguon: { select: { ma: true, tenGoc: true } },
                },
              },
              nguon: { select: { ma: true, tenGoc: true } },
            },
          },
        },
      },
      duyet: { orderBy: { luc: 'desc' } },
      aiViec: { orderBy: { taoLuc: 'desc' }, take: 1, select: { trangThai: true } },
    },
  });
  if (!noiDung) notFound();

  const duocSoan = coQuyen(nd.vaiTro, 'noi_dung.soan');
  const duocDuyet = coQuyen(nd.vaiTro, 'noi_dung.duyet');
  const laQuanTri = nd.vaiTro.includes('QUAN_TRI');

  const [dsChuyenGia, dsTrangTrong, tatCaTk] = await Promise.all([
    duocSoan && noiDung.mang.length > 0
      ? prisma.taiKhoan.findMany({
          where: {
            dangHoatDong: true,
            vaiTro: { has: 'CHUYEN_GIA_DUYET' },
            mangDuyet: { hasSome: noiDung.mang },
          },
          orderBy: { hoTen: 'asc' },
          select: { id: true, hoTen: true, email: true, mangDuyet: true },
        })
      : Promise.resolve([]),
    duocSoan
      ? prisma.seoTrang.findMany({
          where: { OR: [{ noiDungId: null }, { noiDungId: noiDung.id }] },
          orderBy: [{ maTrang: 'asc' }, { duongDan: 'asc' }],
          take: 1000,
          select: { id: true, maTrang: true, duongDan: true, title: true, loai: true },
        })
      : Promise.resolve([]),
    prisma.taiKhoan.findMany({
      select: { id: true, hoTen: true, email: true },
    }),
  ]);

  const mapTk = new Map(tatCaTk.map((t) => [t.id, t]));
  const pbMoiNhat = noiDung.phienBan[0] ?? null;
  const soChon = sp.pb ? Number(sp.pb) : pbMoiNhat?.so;
  const pbDangXem = noiDung.phienBan.find((p) => p.so === soChon) ?? pbMoiNhat;

  const duyetHopLe: Duyet[] = noiDung.duyet.map((d) => ({
    phienBanId: d.phienBanId,
    vaiTro: d.vaiTro,
    ketLuan: d.ketLuan,
    nguoiDuyetId: d.nguoiDuyetId,
  }));

  const nguCanhChuyen: NguCanhChuyen = {
    nguoiId: nd.id,
    coQuyen: (q) => coQuyen(nd.vaiTro, q),
    phienBan: pbMoiNhat
      ? {
          id: pbMoiNhat.id,
          nguonTao: (pbMoiNhat.nguonTao as 'TAY' | 'AI' | 'NHAP_CU') || 'TAY',
          soLoiChan: demLoiChan(noiDung.loai, pbMoiNhat.kiemTra),
        }
      : null,
    aiDatTrichDan: noiDung.aiViec[0]?.trangThai === 'XONG',
    chuyenGiaId: noiDung.chuyenGiaId,
    canDuyetPhapLy: noiDung.canDuyetPhapLy,
    duyet: duyetHopLe,
  };

  // Các nút chuyển trạng thái (trừ AI_SOAN có nút riêng; DA_DUYET/CAN_SUA qua Form duyệt).
  const dichUngVien: TrangThaiNoiDung[] = SAU_TRANG_THAI[noiDung.trangThai].filter(
    (d) => d !== 'AI_SOAN' && !(noiDung.trangThai === 'CHO_CHUYEN_GIA' && (d === 'DA_DUYET' || d === 'CAN_SUA')),
  );
  const cacNutChuyen = dichUngVien.map((den) => ({
    den,
    ten: TEN_NUT_CHUYEN[den],
    ketQua: kiemChuyen(noiDung.trangThai, den, nguCanhChuyen),
  }));

  const laTuDien = noiDung.loai === 'MUC_TU_DIEN';
  const khoiDangXem = docKhoi(pbDangXem?.khoi);
  const thanDangXem = pbDangXem?.than ?? '';
  const ktDangXem = docKiemTra(pbDangXem?.kiemTra);

  const loiOnpage = ktDangXem.onpage?.loi ?? [];
  const loiTrichDan = ktDangXem.trichDan?.loi ?? [];
  const tatCaLoi: LoiNoiDung[] =
    noiDung.loai === 'MUC_TU_DIEN' || noiDung.loai === 'BAI'
      ? loiOnpage
      : [...loiOnpage, ...loiTrichDan];

  const nhomLoi = {
    CHAN: tatCaLoi.filter((l) => l.muc === 'CHAN'),
    CHAN_INDEX: tatCaLoi.filter((l) => l.muc === 'CHAN_INDEX'),
    CANH_BAO: tatCaLoi.filter((l) => l.muc === 'CANH_BAO'),
    CONG: tatCaLoi.filter((l) => l.muc === 'CONG'),
  };

  const trang = noiDung.trang;
  const titleGoc = trang?.title ?? '';
  const metaGoc = trang?.metaDescription ?? '';
  const titlePx = uocBeRong(titleGoc);
  const { chu: titleCat, biCat: titleBiCat } = catTitleTheoBeRong(titleGoc, uocBeRong, 580);
  const { chu: metaCat, biCat: metaBiCat } = catMeta(metaGoc, 158);

  const coDuyetChuyenGia = dongYTren(duyetHopLe, pbMoiNhat?.id, 'CHUYEN_GIA');
  const coDuyetPhapLy = dongYTren(duyetHopLe, pbMoiNhat?.id, 'PHAP_LY');
  const laChuyenGiaDuocGiao = duocDuyet && nd.id === noiDung.chuyenGiaId;
  const khoiTheoTang = {
    nhanh: KHOI.filter((k) => k.tang === 'nhanh'),
    sau: KHOI.filter((k) => k.tang === 'sau'),
    cuoi: KHOI.filter((k) => k.tang === 'cuoi'),
  };

  const hanMacDinh = noiDung.hanCapNhat ? noiDung.hanCapNhat.toISOString().slice(0, 10) : '';
  const khoaAi = tomTatKhoa();
  const cauHinhAi = await docCauHinhLlm();
  const duocAiSoan = duocSoan && khoaAi.co && DUOC_AI_SOAN.includes(noiDung.trangThai);

  return (
    <>
      <p className="qt-phu">
        <Link href="/quan-tri/noi-dung">← Danh sách nội dung</Link>
      </p>

      <div className="qt-loc" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>{noiDung.tieuDe}</h1>
          <p className="qt-phu" style={{ marginBottom: 8 }}>
            {TEN_LOAI_NOI_DUNG[noiDung.loai]} · {nhanTrangThaiNd(noiDung.trangThai)} · Mảng:{' '}
            <b>{noiDung.mang.length ? noiDung.mang.map((m) => `${m} (${TEN_MANG[m] ?? m})`).join(', ') : 'Chưa gắn'}</b>
            {noiDung.canDuyetPhapLy && <> · <span className="qt-nhan vua">Cần duyệt pháp lý</span></>}
            {noiDung.hanCapNhat && <> · Hạn cập nhật: {ngayNgan(noiDung.hanCapNhat)}</>}
          </p>
          {trang && (
            <p className="qt-phu" style={{ marginBottom: 8 }}>
              Trang SEO:{' '}
              <Link href={`/quan-tri/seo/trang/${trang.id}`}>
                {trang.maTrang ?? trang.duongDan}
              </Link>{' '}
              ({trang.duongDan} · {trang.trangThai} · {trang.noindex ? 'noindex' : 'index'})
            </p>
          )}
        </div>
      </div>

      <ThongBao bao={sp.bao} loi={sp.loi} />

      {/* Thanh chuyển trạng thái + AI soạn */}
      <div className="qt-the">
        <h2 style={{ marginBottom: 8 }}>Chuyển trạng thái</h2>
        <div className="qt-chuyen-hang">
          {cacNutChuyen.map((n) => (
            <div key={n.den} className="qt-chuyen-muc">
              {n.ketQua.duoc ? (
                <form action={chuyenTrangThai}>
                  <input type="hidden" name="id" value={noiDung.id} />
                  <input type="hidden" name="den" value={n.den} />
                  <button className="qt-nut" type="submit">
                    {n.ten}
                  </button>
                </form>
              ) : (
                <>
                  <button className="qt-nut phu" type="button" disabled>
                    {n.ten}
                  </button>
                  <span className="qt-ly-do">{n.ketQua.lyDo}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {duocSoan && (
        <details className="qt-the" open={noiDung.trangThai === 'NHAP' || !pbMoiNhat}>
          <summary><b>AI soạn bản nháp</b></summary>
          <NutAiSoan
            id={noiDung.id}
            duoc={duocAiSoan}
            lyDo={!khoaAi.co ? 'Chưa có khóa 9router (NINEROUTER_API_KEY).' : `Trạng thái ${noiDung.trangThai} không cho AI soạn.`}
            moHinh={cauHinhAi.moHinh.soan}
          />
        </details>
      )}

      <div className="qt-nd-luoi">
        {/* CỘT TRÁI: SOẠN THẢO, TRÍCH DẪN, PHIÊN BẢN, DIFF */}
        <div>
          <form className="qt-the" action={luuPhienBan} style={{ display: 'grid', gap: 12 }}>
            <input type="hidden" name="id" value={noiDung.id} />
            <div className="qt-loc" style={{ justifyContent: 'space-between', marginBottom: 0 }}>
              <h2 style={{ margin: 0 }}>
                {pbDangXem ? `Nội dung (đang nạp từ phiên bản v${pbDangXem.so})` : 'Soạn nội dung (chưa có phiên bản)'}
              </h2>
              {pbDangXem && pbMoiNhat && pbDangXem.id !== pbMoiNhat.id && (
                <span className="qt-nhan vua">Đang xem bản cũ v{pbDangXem.so}; bản mới nhất là v{pbMoiNhat.so}</span>
              )}
            </div>

            <fieldset
              key={pbDangXem?.id ?? 'moi'}
              disabled={!duocSoan}
              style={{ border: 0, padding: 0, margin: 0, display: 'grid', gap: 12 }}
            >
              {laTuDien ? (
                <>
                  <div className="qt-nd-tang">Tầng 1 · Đọc nhanh (khối 1–3)</div>
                  {khoiTheoTang.nhanh.map((k) => (
                    <div key={k.ma} className="qt-nd-khoi">
                      <label htmlFor={`khoi-${k.ma}`}>
                        <b>
                          Khối {k.ma.slice(1)}: {k.ten}
                        </b>
                        {k.ma === 'k3' && (
                          <small style={{ color: 'var(--muted)', marginLeft: 8 }}>
                            (Mỗi đoạn văn cần ít nhất một mã [D:số])
                          </small>
                        )}
                      </label>
                      <textarea
                        id={`khoi-${k.ma}`}
                        className="qt-o qt-nd-o"
                        name={k.ma}
                        rows={k.ma === 'k3' ? 7 : 3}
                        defaultValue={khoiDangXem[k.ma] ?? ''}
                      />
                    </div>
                  ))}

                  <div className="qt-nd-tang">Tầng 2 · Đọc sâu (khối 4–8)</div>
                  {khoiTheoTang.sau.map((k) => (
                    <div key={k.ma} className="qt-nd-khoi">
                      <div className="qt-nd-khoi-dau">
                        <label htmlFor={`khoi-${k.ma}`}>
                          <b>
                            Khối {k.ma.slice(1)}: {k.ten}
                          </b>
                        </label>
                        {k.ma === 'k5' && (
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
                            <input
                              type="checkbox"
                              name="k5KhongApDung"
                              defaultChecked={Boolean(khoiDangXem.k5KhongApDung)}
                            />
                            Không áp dụng (mục không tất định)
                          </label>
                        )}
                      </div>
                      <textarea
                        id={`khoi-${k.ma}`}
                        className="qt-o qt-nd-o"
                        name={k.ma}
                        rows={k.ma === 'k4' || k.ma === 'k5' ? 4 : 3}
                        defaultValue={khoiDangXem[k.ma] ?? ''}
                      />
                    </div>
                  ))}

                  <div className="qt-nd-tang">Cuối mục (khối 9)</div>
                  {khoiTheoTang.cuoi.map((k) => (
                    <div key={k.ma} className="qt-nd-khoi">
                      <label htmlFor={`khoi-${k.ma}`}>
                        <b>
                          Khối {k.ma.slice(1)}: {k.ten}
                        </b>
                      </label>
                      <textarea
                        id={`khoi-${k.ma}`}
                        className="qt-o qt-nd-o"
                        name={k.ma}
                        rows={3}
                        defaultValue={khoiDangXem[k.ma] ?? ''}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div className="qt-nd-khoi">
                  <label htmlFor="noi-dung-than">
                    <b>Thân bài (Markdown)</b>
                  </label>
                  <textarea
                    id="noi-dung-than"
                    className="qt-o qt-nd-o"
                    name="than"
                    rows={16}
                    defaultValue={thanDangXem}
                  />
                </div>
              )}

              <label style={{ display: 'grid', gap: 4 }}>
                <span>Ghi chú phiên bản</span>
                <input
                  className="qt-o"
                  name="ghiChu"
                  maxLength={300}
                  placeholder="Tóm tắt điểm vừa sửa hoặc bổ sung…"
                />
              </label>

              {duocSoan && (
                <div className="qt-loc" style={{ marginBottom: 0 }}>
                  <button className="qt-nut" type="submit">
                    Lưu phiên bản
                  </button>
                </div>
              )}
            </fieldset>
          </form>

          {/* Trích dẫn của phiên bản đang xem */}
          <div className="qt-the">
            <h2>
              Trích dẫn của phiên bản {pbDangXem ? `v${pbDangXem.so}` : ''} ({pbDangXem?.trichDan.length ?? 0})
            </h2>
            {!pbDangXem || pbDangXem.trichDan.length === 0 ? (
              <p style={{ color: 'var(--muted)', margin: 0 }}>Chưa có trích dẫn hợp lệ nào trong phiên bản này.</p>
            ) : (
              <table className="qt-bang">
                <thead>
                  <tr>
                    <th>Mã đoạn</th>
                    <th>Nguồn</th>
                    <th>Khối</th>
                    <th>Vị trí / Kiểu</th>
                  </tr>
                </thead>
                <tbody>
                  {pbDangXem.trichDan.map((td) => {
                    const nguon = td.doan?.nguon ?? td.nguon;
                    return (
                      <tr key={td.id}>
                        <td>
                          {td.doanId != null ? (
                            <Link href={`/quan-tri/rag/doan/${String(td.doanId)}`}>
                              <code>[D:{String(td.doanId)}]</code>
                            </Link>
                          ) : (
                            '–'
                          )}
                        </td>
                        <td>{nguon ? `${nguon.ma} · ${nguon.tenGoc}` : '–'}</td>
                        <td>{td.khoi != null ? `Khối ${td.khoi}` : 'Thân bài'}</td>
                        <td>
                          {td.viTri ?? '–'} ({TEN_KIEU_TRICH[td.kieu] ?? td.kieu})
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Lịch sử phiên bản */}
          <div className="qt-the">
            <h2>Lịch sử phiên bản ({noiDung.phienBan.length})</h2>
            {noiDung.phienBan.length === 0 ? (
              <p style={{ color: 'var(--muted)', margin: 0 }}>Chưa có phiên bản nào.</p>
            ) : (
              <table className="qt-bang">
                <thead>
                  <tr>
                    <th>Phiên bản</th>
                    <th>Người tạo / Nguồn</th>
                    <th>Lúc</th>
                    <th className="qt-cot-so">Điểm</th>
                    <th>Ghi chú</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {noiDung.phienBan.map((pb) => {
                    const kt = docKiemTra(pb.kiemTra);
                    const nguoi = pb.taoBoiId ? mapTk.get(pb.taoBoiId) : undefined;
                    const dangChonXem = pbDangXem?.id === pb.id;
                    return (
                      <tr key={pb.id}>
                        <td>
                          <b>v{pb.so}</b>
                          {noiDung.phienBanXuatBanId === pb.id && (
                            <>
                              {' '}
                              <span className="qt-nhan tot">Xuất bản</span>
                            </>
                          )}
                        </td>
                        <td>
                          {TEN_NGUON_TAO[pb.nguonTao] ?? pb.nguonTao}
                          {nguoi && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{nguoi.hoTen}</div>}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>{ngayGio(pb.taoLuc)}</td>
                        <td className="qt-cot-so">{nhanDiemOnpage(kt.onpage?.diem)}</td>
                        <td>{pb.ghiChu ?? '–'}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <div className="qt-loc" style={{ marginBottom: 0 }}>
                            {!dangChonXem ? (
                              <Link className="qt-nut phu" href={`/quan-tri/noi-dung/${noiDung.id}?pb=${pb.so}`}>
                                Xem
                              </Link>
                            ) : (
                              <span className="qt-nhan">Đang xem</span>
                            )}
                            {duocSoan && pbMoiNhat && pb.id !== pbMoiNhat.id && (
                              <form action={khoiPhucPhienBan}>
                                <input type="hidden" name="id" value={noiDung.id} />
                                <input type="hidden" name="phienBanId" value={pb.id} />
                                <button className="qt-nut phu" type="submit">
                                  Khôi phục
                                </button>
                              </form>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <SoSanhPhienBan
            laTuDien={laTuDien}
            dsPhienBan={noiDung.phienBan.map((pb) => ({
              id: pb.id,
              so: pb.so,
              nguonTao: pb.nguonTao,
              khoi: laTuDien ? docKhoi(pb.khoi) : null,
              than: pb.than,
            }))}
          />

          {duocSoan && (
            <details className="qt-the">
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Cài đặt thông tin chung &amp; trang SEO gắn kèm</summary>
              <form
                key={noiDung.capNhatLuc.toISOString()}
                action={capNhatThongTinNoiDung}
                style={{ display: 'grid', gap: 10, marginTop: 12 }}
              >
                <input type="hidden" name="id" value={noiDung.id} />
                <label style={{ display: 'grid', gap: 4 }}>
                  <span>Tiêu đề</span>
                  <input className="qt-o" name="tieuDe" defaultValue={noiDung.tieuDe} required maxLength={250} />
                </label>
                <div className="qt-mang-luoi">
                  {MA_MANG_HOP_LE.map((m) => (
                    <label key={m} className="qt-mang-muc">
                      <input type="checkbox" name="mang" value={m} defaultChecked={noiDung.mang.includes(m)} />
                      <span>
                        <b>{m}</b> · {TEN_MANG[m]}
                      </span>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'grid', gap: 4 }}>
                  <span>Trang SEO gắn kèm</span>
                  <ChonSeoTrang dsTrang={dsTrangTrong} macDinhId={trang?.id ?? ''} />
                </div>
                <div className="qt-loc" style={{ marginBottom: 0 }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <input type="checkbox" name="canDuyetPhapLy" defaultChecked={noiDung.canDuyetPhapLy} />
                    Cần duyệt pháp lý
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    Hạn cập nhật
                    <input className="qt-o" type="date" name="hanCapNhat" defaultValue={hanMacDinh} />
                  </label>
                  <button className="qt-nut phu" type="submit">
                    Lưu thông tin
                  </button>
                </div>
              </form>
            </details>
          )}
        </div>

        {/* CỘT PHẢI: ONPAGE, XEM TRƯỚC GOOGLE, GIAO CHUYÊN GIA, DUYỆT */}
        <div>
          {/* Điểm onpage và lỗi */}
          <div className="qt-the">
            <h2>Điểm onpage {pbDangXem ? `(v${pbDangXem.so})` : ''}</h2>
            <div className="qt-luoi" style={{ marginBottom: 10 }}>
              <div className="qt-so">
                <div className="qt-so-nhan">Điểm onpage</div>
                <div className="qt-so-gt">{ktDangXem.onpage ? `${ktDangXem.onpage.diem}/100` : '–'}</div>
              </div>
              <div className="qt-so">
                <div className="qt-so-nhan">Trạng thái duyệt (bản mới nhất)</div>
                <div className="qt-so-gt" style={{ fontSize: 15, marginTop: 6 }}>
                  {coDuyetChuyenGia ? (
                    <span className="qt-nhan tot">Chuyên gia đã đồng ý</span>
                  ) : (
                    <span className="qt-nhan vua">Chưa duyệt → noindex</span>
                  )}
                  {noiDung.canDuyetPhapLy && (
                    <div style={{ marginTop: 4 }}>
                      {coDuyetPhapLy ? (
                        <span className="qt-nhan tot">Đã duyệt pháp lý</span>
                      ) : (
                        <span className="qt-nhan xau">Thiếu duyệt pháp lý</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {ktDangXem.onpage && (
              <div className="qt-thanh" style={{ marginBottom: 12 }}>
                <span style={{ width: `${ktDangXem.onpage.diem}%` }} />
              </div>
            )}

            {!pbDangXem ? (
              <p style={{ color: 'var(--muted)', margin: 0 }}>Lưu phiên bản đầu tiên để chấm điểm onpage và trích dẫn.</p>
            ) : tatCaLoi.length === 0 ? (
              <p style={{ color: 'var(--good)', margin: 0 }}>Không có lỗi onpage nào.</p>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {nhomLoi.CHAN.length > 0 && (
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--bad)', marginBottom: 4 }}>
                      Chặn ({nhomLoi.CHAN.length}) — không gửi duyệt / không xuất bản được
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {nhomLoi.CHAN.map((l, idx) => (
                        <li key={idx}>
                          <code>{l.ma}</code>: {l.thongBao}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {nhomLoi.CHAN_INDEX.length > 0 && (
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--mid)', marginBottom: 4 }}>
                      Chặn index ({nhomLoi.CHAN_INDEX.length})
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {nhomLoi.CHAN_INDEX.map((l, idx) => (
                        <li key={idx}>
                          <code>{l.ma}</code>: {l.thongBao}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {nhomLoi.CANH_BAO.length > 0 && (
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--muted)', marginBottom: 4 }}>
                      Cảnh báo ({nhomLoi.CANH_BAO.length})
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {nhomLoi.CANH_BAO.map((l, idx) => (
                        <li key={idx}>
                          <code>{l.ma}</code>: {l.thongBao}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {nhomLoi.CONG.length > 0 && (
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--good)', marginBottom: 4 }}>
                      Cộng ({nhomLoi.CONG.length})
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {nhomLoi.CONG.map((l, idx) => (
                        <li key={idx}>
                          <code>{l.ma}</code>: {l.thongBao}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <XemTruocGoogle
            coTrang={Boolean(trang)}
            duongDan={trang?.duongDan ?? ''}
            titleGoc={titleGoc}
            titleCat={titleCat}
            titleBiCat={titleBiCat}
            titlePx={titlePx}
            metaCat={metaCat}
            metaBiCat={metaBiCat}
            h1={trang?.h1 ?? ''}
            tuKhoaChinh={trang?.tuKhoaChinh?.chuoi ?? ''}
          />

          {/* Giao chuyên gia */}
          {duocSoan && (
            <div className="qt-the">
              <h2>Giao chuyên gia duyệt</h2>
              {noiDung.mang.length === 0 ? (
                <p style={{ color: 'var(--muted)', margin: 0 }}>
                  Cần gắn ít nhất một mảng cho mục này trước khi giao chuyên gia.
                </p>
              ) : (
                <form action={giaoChuyenGia} className="qt-loc" style={{ marginBottom: 0 }}>
                  <input type="hidden" name="id" value={noiDung.id} />
                  <select className="qt-o" name="chuyenGiaId" defaultValue={noiDung.chuyenGiaId ?? ''}>
                    <option value="">-- Chưa giao chuyên gia --</option>
                    {dsChuyenGia.map((cg) => (
                      <option key={cg.id} value={cg.id}>
                        {cg.hoTen} ({cg.email}) · mảng: {cg.mangDuyet.join(', ')}
                      </option>
                    ))}
                  </select>
                  <button className="qt-nut" type="submit">
                    Lưu phân công
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Form duyệt chuyên môn */}
          {laChuyenGiaDuocGiao && (
            <div className="qt-the">
              <h2>Duyệt chuyên môn {pbMoiNhat ? `(phiên bản mới nhất v${pbMoiNhat.so})` : ''}</h2>
              {!pbMoiNhat ? (
                <p style={{ color: 'var(--muted)', margin: 0 }}>Chưa có phiên bản nào để duyệt.</p>
              ) : (
                <form action={duyetNoiDung} style={{ display: 'grid', gap: 10 }}>
                  <input type="hidden" name="id" value={noiDung.id} />
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span>Kết luận</span>
                    <select className="qt-o" name="ketLuan" defaultValue="DONG_Y">
                      <option value="DONG_Y">Đồng ý (→ Đã duyệt)</option>
                      <option value="YEU_CAU_SUA">Yêu cầu sửa (→ Cần sửa)</option>
                      <option value="TU_CHOI">Từ chối (→ Cần sửa)</option>
                    </select>
                  </label>
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span>Nhận xét chuyên môn</span>
                    <textarea
                      className="qt-o qt-nd-o"
                      name="nhanXet"
                      rows={3}
                      placeholder="Ghi rõ lý do nếu yêu cầu sửa hoặc từ chối…"
                    />
                  </label>
                  <div>
                    <button className="qt-nut" type="submit">
                      Gửi kết quả duyệt
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Form duyệt pháp lý cho Quản trị */}
          {noiDung.canDuyetPhapLy && laQuanTri && (
            <div className="qt-the">
              <h2>Duyệt pháp lý {pbMoiNhat ? `(v${pbMoiNhat.so})` : ''}</h2>
              {!pbMoiNhat ? (
                <p style={{ color: 'var(--muted)', margin: 0 }}>Chưa có phiên bản nào.</p>
              ) : (
                <form action={duyetPhapLy} style={{ display: 'grid', gap: 10 }}>
                  <input type="hidden" name="id" value={noiDung.id} />
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span>Kết luận pháp lý</span>
                    <select className="qt-o" name="ketLuan" defaultValue="DONG_Y">
                      <option value="DONG_Y">Đồng ý</option>
                      <option value="YEU_CAU_SUA">Yêu cầu sửa</option>
                      <option value="TU_CHOI">Từ chối</option>
                    </select>
                  </label>
                  <label style={{ display: 'grid', gap: 4 }}>
                    <span>Ghi chú pháp lý</span>
                    <textarea className="qt-o qt-nd-o" name="nhanXet" rows={2} />
                  </label>
                  <div>
                    <button className="qt-nut phu" type="submit">
                      Ghi duyệt pháp lý
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Lịch sử duyệt */}
          <div className="qt-the">
            <h2>Lịch sử duyệt ({noiDung.duyet.length})</h2>
            {noiDung.duyet.length === 0 ? (
              <p style={{ color: 'var(--muted)', margin: 0 }}>Chưa có lượt duyệt nào.</p>
            ) : (
              <table className="qt-bang">
                <thead>
                  <tr>
                    <th>Lúc</th>
                    <th>Vai trò</th>
                    <th>Người duyệt</th>
                    <th>Kết luận</th>
                    <th>Nhận xét</th>
                  </tr>
                </thead>
                <tbody>
                  {noiDung.duyet.map((d) => {
                    const nguoi = mapTk.get(d.nguoiDuyetId);
                    const pb = noiDung.phienBan.find((x) => x.id === d.phienBanId);
                    const lop = d.ketLuan === 'DONG_Y' ? 'tot' : 'xau';
                    return (
                      <tr key={d.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {ngayGio(d.luc)}
                          {pb && <div style={{ fontSize: 11, color: 'var(--muted)' }}>v{pb.so}</div>}
                        </td>
                        <td>{TEN_VAI_TRO_DUYET[d.vaiTro] ?? d.vaiTro}</td>
                        <td>{nguoi ? nguoi.hoTen : d.nguoiDuyetId}</td>
                        <td>
                          <span className={`qt-nhan ${lop}`}>{TEN_KET_LUAN_DUYET[d.ketLuan] ?? d.ketLuan}</span>
                        </td>
                        <td>{d.nhanXet ?? '–'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
