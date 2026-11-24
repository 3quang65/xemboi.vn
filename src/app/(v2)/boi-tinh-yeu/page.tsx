import type { Metadata } from 'next';
import Link from 'next/link';
import KhungTrang from '@/components/ck/KhungTrang';
import { DocNhanh, type TheDocNhanhItem } from '@/components/ck/truc-quan';
import {
  GHI_CHU_TINH_YEU,
  TEN_GOC,
  TRICH_HOANG_DAO,
  boiTinhYeu,
  type KetQuaTinhYeu,
  type NguoiTinhYeu,
} from '@/lib/trang/boi-tinh-yeu';
import {
  NGUON_TETRABIBLOS,
  duongDanCung,
  viTriTrich,
  type TrichAnh,
} from '@/lib/trang/chiem-tinh';
import { metaTrang, thongTinTrang, type MacDinhTrang } from '@/lib/trang/meta';
import { docNgay, isoNgay, vietNgay } from '@/lib/trang/than-so-hoc';
import { canChiNam } from '@/lib/tuvi-v2/am-lich';

export const dynamic = 'force-dynamic';

type SearchParamsInput = Promise<Record<string, string | string[] | undefined>>;

const GOC_SITE = 'https://xemboi.vn';

const MAC_DINH_BOI_TINH_YEU: MacDinhTrang = {
  title: 'Bói tình yêu theo ngày sinh: địa chi, cung hoàng đạo, thần số học',
  h1: 'Bói tình yêu theo ngày sinh',
  description:
    'Nhập ngày sinh hai người để đặt cạnh nhau ba hệ có sách dẫn: địa chi năm sinh, cung hoàng đạo và thần số học. Không cộng điểm.',
};

const CAU_DOC_NHANH =
  'Nhập ngày sinh hai người. Trang đặt cạnh nhau ba hệ: địa chi năm sinh, cung hoàng đạo và thần số học; mỗi hệ ghi rõ sách. Trang không cộng điểm và không kết luận hai người có hợp hay không.';

const THE_HE: TheDocNhanhItem[] = [
  {
    ma: 'chi',
    nhan: 'Địa chi năm sinh',
    giaTri: 'Tam mệnh thông hội',
    muc: 'binh',
    chiTiet: 'Đối chiếu quan hệ tam hợp, lục hợp, xung, hình, hại giữa hai chi năm sinh âm lịch.',
  },
  {
    ma: 'hoang-dao',
    nhan: 'Cung hoàng đạo',
    giaTri: 'Tetrabiblos',
    muc: 'binh',
    chiTiet: 'Góc chiếu giữa hai cung Mặt Trời, tam hợp và âm dương theo quyển I.',
  },
  {
    ma: 'than-so',
    nhan: 'Thần số học',
    giaTri: 'Nhật Nguyệt',
    muc: 'binh',
    chiTiet: 'Đặt cạnh nhau số chủ đạo và đoạn tình cảm của từng người.',
  },
];

const LUA_CHON_GIO = Array.from({ length: 24 }, (_, h) => ({
  giaTri: String(h),
  nhan: `${String(h).padStart(2, '0')}:00 – ${String(h).padStart(2, '0')}:59`,
}));

function layMot(val: string | string[] | undefined): string | undefined {
  return Array.isArray(val) ? val[0] : val;
}

function kiemCoThamSo(sp: Record<string, string | string[] | undefined>): boolean {
  return Object.values(sp).some((v) =>
    Array.isArray(v)
      ? v.some((x) => x.trim() !== '')
      : typeof v === 'string' && v.trim() !== '',
  );
}

function docGio(s: string | undefined): { gio?: number; loi?: string } {
  if (!s || s.trim() === '') return {};
  const t = s.trim();
  if (!/^\d{1,2}$/.test(t)) return { loi: 'Giờ sinh phải là số nguyên từ 0 đến 23.' };
  const n = Number(t);
  if (n < 0 || n > 23) return { loi: 'Giờ sinh phải nằm trong khoảng 0 đến 23.' };
  return { gio: n };
}

function kyHieuChu(s: string): string {
  return s.endsWith('\uFE0E') ? s : `${s}\uFE0E`;
}

function classQuanHeChi(nhom: string): string {
  if (nhom === 'hop') return 'ck-bty-nhan ck-bty-nhan-tot';
  if (nhom === 'xung' || nhom === 'hinh' || nhom === 'hai') {
    return 'ck-bty-nhan ck-bty-nhan-hp';
  }
  return 'ck-bty-nhan ck-bty-nhan-binh';
}

function TrichHoangDaoVi({ t }: { t: TrichAnh }) {
  return (
    <figure className="ck-bty-trich">
      <blockquote>{t.vi}</blockquote>
      <figcaption>
        {viTriTrich(t)} · Dịch nghĩa: xemboi (
        <a
          href={NGUON_TETRABIBLOS.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {NGUON_TETRABIBLOS.ten}
        </a>
        )
      </figcaption>
    </figure>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}): Promise<Metadata> {
  const [sp, base] = await Promise.all([
    searchParams,
    metaTrang('/boi-tinh-yeu', MAC_DINH_BOI_TINH_YEU),
  ]);
  if (kiemCoThamSo(sp)) {
    return {
      ...base,
      alternates: { canonical: `${GOC_SITE}/boi-tinh-yeu` },
      robots: { index: false, follow: true },
    };
  }
  return base;
}

export default async function BoiTinhYeuPage({
  searchParams,
}: {
  searchParams: SearchParamsInput;
}) {
  const [tt, sp] = await Promise.all([
    thongTinTrang('/boi-tinh-yeu', MAC_DINH_BOI_TINH_YEU),
    searchParams,
  ]);

  const aRaw = layMot(sp.a)?.trim() ?? '';
  const bRaw = layMot(sp.b)?.trim() ?? '';
  const gaRaw = layMot(sp.ga)?.trim() ?? '';
  const gbRaw = layMot(sp.gb)?.trim() ?? '';
  const coNhap = aRaw !== '' || bRaw !== '' || gaRaw !== '' || gbRaw !== '';

  let loi: string | null = null;
  let kq: KetQuaTinhYeu | null = null;

  if (coNhap) {
    if (!aRaw || !bRaw) {
      loi = 'Vui lòng nhập đủ ngày sinh dương lịch của cả hai người (1900–2100).';
    } else {
      const ngayA = docNgay(aRaw);
      const ngayB = docNgay(bRaw);
      const gioA = docGio(gaRaw);
      const gioB = docGio(gbRaw);

      if (!ngayA || !ngayB) {
        loi = 'Ngày sinh không hợp lệ hoặc ngoài khoảng 1900–2100. Vui lòng kiểm tra lại.';
      } else if (gioA.loi || gioB.loi) {
        loi = gioA.loi ?? gioB.loi ?? 'Giờ sinh không hợp lệ.';
      } else {
        kq = boiTinhYeu(ngayA, ngayB, gioA.gio, gioB.gio);
      }
    }
  }

  const gocInfo = kq ? TEN_GOC[kq.hoangDao.goc.loai] : null;
  const haiNguoi: { vai: string; nguoi: NguoiTinhYeu }[] = kq
    ? [
        { vai: 'Người thứ nhất', nguoi: kq.a },
        { vai: 'Người thứ hai', nguoi: kq.b },
      ]
    : [];

  return (
    <KhungTrang
      tieuDe={tt.h1}
      phu={tt.description}
      duongDan="/boi-tinh-yeu"
      tenCuoi="Bói tình yêu"
      toi
    >
      {/* 1. Đọc nhanh */}
      <DocNhanh
        cau={CAU_DOC_NHANH}
        the={THE_HE}
        tieuDeId="ck-bty-dn-tieu"
        luoiCot={3}
        dongPhu="Tam mệnh thông hội · Tetrabiblos · Nhật Nguyệt"
      />

      {/* 2. Form nhập ngày sinh hai người */}
      <section className="ck-td-muc" aria-labelledby="ck-bty-form-tieu">
        <h2 id="ck-bty-form-tieu" className="ck-td-tieu">
          Nhập ngày sinh hai người
        </h2>

        <form
          key={`${aRaw}-${bRaw}-${gaRaw}-${gbRaw}`}
          className="ck-bty-form-khung"
          action="/boi-tinh-yeu"
          method="get"
        >
          <div className="ck-bty-form-luoi">
            <div className="ck-bty-nhom-nhap">
              <h3>Người thứ nhất</h3>
              <label className="ck-bty-o" htmlFor="ck-bty-a">
                <span>Ngày sinh dương lịch (1900–2100)</span>
                <input
                  id="ck-bty-a"
                  name="a"
                  type="date"
                  min="1900-01-01"
                  max="2100-12-31"
                  defaultValue={aRaw}
                  required
                />
              </label>

              <label className="ck-bty-o" htmlFor="ck-bty-ga">
                <span>Giờ sinh (không bắt buộc)</span>
                <select id="ck-bty-ga" name="ga" defaultValue={gaRaw}>
                  <option value="">Không rõ giờ sinh</option>
                  {LUA_CHON_GIO.map((g) => (
                    <option key={g.giaTri} value={g.giaTri}>
                      {g.nhan}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="ck-bty-nhom-nhap">
              <h3>Người thứ hai</h3>
              <label className="ck-bty-o" htmlFor="ck-bty-b">
                <span>Ngày sinh dương lịch (1900–2100)</span>
                <input
                  id="ck-bty-b"
                  name="b"
                  type="date"
                  min="1900-01-01"
                  max="2100-12-31"
                  defaultValue={bRaw}
                  required
                />
              </label>

              <label className="ck-bty-o" htmlFor="ck-bty-gb">
                <span>Giờ sinh (không bắt buộc)</span>
                <select id="ck-bty-gb" name="gb" defaultValue={gbRaw}>
                  <option value="">Không rõ giờ sinh</option>
                  {LUA_CHON_GIO.map((g) => (
                    <option key={g.giaTri} value={g.giaTri}>
                      {g.nhan}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="ck-bty-form-chan">
            <button type="submit" className="ck-nut ck-nut-son ck-bty-nut">
              Xem theo ba hệ
            </button>
            <p className="ck-bty-form-ghi">
              Không hỏi tên hay giới tính. Giờ sinh chỉ dùng khi một trong hai người sinh đúng ngày Mặt Trời đổi cung.
            </p>
          </div>

          {loi ? (
            <div className="ck-bty-loi" role="alert">
              {loi}
            </div>
          ) : null}
        </form>
      </section>

      {/* 3. Kết quả ba hệ đặt cạnh nhau */}
      {kq && gocInfo ? (
        <div className="ck-td-muc" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <aside className="ck-bty-ghi-chu" aria-label="Ghi chú phương pháp">
            {GHI_CHU_TINH_YEU}
          </aside>

          {/* Khối 1: Địa chi năm sinh */}
          <section className="ck-bty-khoi" aria-labelledby="ck-bty-chi-tieu">
            <div className="ck-bty-khoi-dau">
              <h2 id="ck-bty-chi-tieu">Địa chi năm sinh</h2>
              <span className="ck-bty-he">Hệ can chi · Tam mệnh thông hội, Hiệp kỷ</span>
            </div>

            <div className="ck-bty-hai-cot">
              {haiNguoi.map(({ vai, nguoi }) => (
                <div key={vai} className="ck-bty-the-con">
                  <span className="ck-bty-vai">{vai}</span>
                  <p className="ck-bty-dong">
                    Sinh <strong>{vietNgay(nguoi.ngay)}</strong> · năm âm{' '}
                    <strong>{canChiNam(nguoi.namAm).ten}</strong>
                  </p>
                  {nguoi.truocTet ? (
                    <span className="ck-bty-nhan ck-bty-nhan-hp">
                      sinh trước Tết, tính theo năm âm trước
                    </span>
                  ) : null}
                </div>
              ))}
            </div>

            <p className="ck-bty-tomtat">{kq.conGiap.tomTat}</p>

            {kq.conGiap.quanHe.length > 0 ? (
              <ul className="ck-bty-qh-ds">
                {kq.conGiap.quanHe.map((q) => (
                  <li key={`${q.loai}-${q.ten}`} className="ck-bty-qh-item">
                    <span className={classQuanHeChi(q.nhom)}>{q.ten}</span>
                    <p>{q.cau}</p>
                  </li>
                ))}
              </ul>
            ) : null}

            <div>
              <Link href={kq.conGiap.duongDan} className="ck-nut ck-nut-vien ck-bty-nut">
                Xem đủ cặp này
              </Link>
            </div>
          </section>

          {/* Khối 2: Cung hoàng đạo */}
          <section className="ck-bty-khoi" aria-labelledby="ck-bty-hd-tieu">
            <div className="ck-bty-khoi-dau">
              <h2 id="ck-bty-hd-tieu">Cung hoàng đạo</h2>
              <span className="ck-bty-he">Hệ Tetrabiblos (Ptolemy, quyển I)</span>
            </div>

            <div className="ck-bty-hai-cot">
              {haiNguoi.map(({ vai, nguoi }) => {
                const c = nguoi.cung.cung;
                return (
                  <div key={vai} className="ck-bty-the-con">
                    <span className="ck-bty-vai">{vai}</span>
                    <Link href={duongDanCung(c)} className="ck-bty-chip">
                      <span className="ck-bty-ky" aria-hidden="true">
                        {kyHieuChu(c.kyHieu)}
                      </span>
                      <span>{c.ten}</span>
                    </Link>
                    <p className="ck-bty-dong">
                      {c.duong ? 'Dương (thuộc ngày)' : 'Âm (thuộc đêm)'} · Tam hợp thứ {c.tamHop}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="ck-bty-goc-hop">
              <div className="ck-bty-goc-dong">
                <strong>{gocInfo.ten}</strong>
                {gocInfo.hoa === true ? (
                  <span className="ck-bty-nhan ck-bty-nhan-tot">Ptolemy gọi là hòa</span>
                ) : gocInfo.hoa === false ? (
                  <span className="ck-bty-nhan ck-bty-nhan-hp">Ptolemy gọi là không hòa</span>
                ) : null}
              </div>

              <div className="ck-bty-co-khong">
                <div>
                  Cùng một tam hợp:{' '}
                  <strong>{kq.hoangDao.cungTamHop ? 'Có' : 'Không'}</strong>
                </div>
                <div>
                  Cùng dương hoặc cùng âm:{' '}
                  <strong>
                    {kq.hoangDao.cungAmDuong
                      ? kq.a.cung.cung.duong
                        ? 'Có (cùng dương)'
                        : 'Có (cùng âm)'
                      : 'Không'}
                  </strong>
                </div>
              </div>
            </div>

            {!kq.hoangDao.chacChan ? (
              <div className="ck-bty-canh-bao" role="status">
                Một người sinh đúng ngày Mặt Trời đổi cung; nhập giờ sinh để biết chắc cung.
              </div>
            ) : null}

            <details className="ck-bty-details">
              <summary>Sách nói gì</summary>
              <div className="ck-bty-trich-ds">
                <p className="ck-bty-dong">
                  Chương này nói về các phần của vòng hoàng đạo, không nói về hai người.
                </p>
                <TrichHoangDaoVi t={TRICH_HOANG_DAO.gocChieu} />
                <TrichHoangDaoVi t={TRICH_HOANG_DAO.amDuong} />
              </div>
            </details>
          </section>

          {/* Khối 3: Thần số học */}
          <section className="ck-bty-khoi" aria-labelledby="ck-bty-tsh-tieu">
            <div className="ck-bty-khoi-dau">
              <h2 id="ck-bty-tsh-tieu">Thần số học</h2>
              <span className="ck-bty-he">Nguồn: {kq.thanSo.nguon.ten}</span>
            </div>

            <div className="ck-bty-hai-cot">
              {haiNguoi.map(({ vai, nguoi }) => (
                <div key={vai} className="ck-bty-the-con">
                  <span className="ck-bty-vai">{vai}</span>
                  <Link
                    href={`/than-so-hoc/so-chu-dao?ngay=${isoNgay(nguoi.ngay)}`}
                    className="ck-bty-chip"
                  >
                    {`Số chủ đạo ${nguoi.soChuDao}`}
                  </Link>
                  {nguoi.soChuDaoCach2 !== null ? (
                    <span className="ck-bty-cach2">
                      (cách rút từng phần ra {nguoi.soChuDaoCach2})
                    </span>
                  ) : null}
                  {nguoi.tinhCam ? (
                    <>
                      <span className="ck-bty-tinh-cam-nhan">
                        Tình cảm, theo Nhật Nguyệt
                      </span>
                      <p className="ck-bty-tinh-cam">{nguoi.tinhCam}</p>
                    </>
                  ) : null}
                </div>
              ))}
            </div>

            <p className="ck-bty-chan-khoi">
              Không có sách nào trong kho ghép hai số chủ đạo thành một kết quả, nên trang chỉ đặt hai số cạnh nhau.{' '}
              <a
                href={kq.thanSo.nguon.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                {kq.thanSo.nguon.ghiCong}
              </a>
              .
            </p>
          </section>
        </div>
      ) : null}

      {/* 4. Đọc thêm */}
      <nav className="ck-lien-quan" aria-label="Đọc thêm">
        <h2>Đọc thêm</h2>
        <div className="ck-lien-quan-ds">
          <Link href="/xem-tuoi/vo-chong">Xem tuổi vợ chồng theo năm sinh</Link>
          <Link href="/xem-tuoi/con-giap">78 cặp 12 con giáp</Link>
          <Link href="/chiem-tinh/cung-hoang-dao">12 cung hoàng đạo</Link>
          <Link href="/than-so-hoc">Thần số học</Link>
        </div>
      </nav>
    </KhungTrang>
  );
}
