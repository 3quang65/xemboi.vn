import type { Metadata } from 'next';
import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { TronDoi } from '@/lib/core/trondoi';

export const metadata: Metadata = {
  title: 'Tử Vi Trọn Đời 60 Hoa Giáp (Nam Mạng & Nữ Mạng) – XemBoi.vn',
  description: 'Tra cứu tử vi trọn đời đầy đủ 60 tuổi Hoa Giáp (Nam mạng và Nữ mạng): tổng quan cuộc đời, tình duyên, gia đạo, công danh, tuổi hợp làm ăn và diễn biến từng năm tại XemBoi.vn.',
  alternates: { canonical: 'https://xemboi.vn/tu-vi-tron-doi' },
};

const CAN_SLUGS = ['giap', 'at', 'binh', 'dinh', 'mau', 'ky', 'canh', 'tan', 'nham', 'quy'];
const CHI_SLUGS = ['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi'];
const CAN_NAMES = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

export default function TuViTronDoiIndexPage() {
  const list60: Array<{ yearSample: number; name: string; slug: string; years: number[] }> = [];
  for (let i = 0; i < 60; i++) {
    const canIdx = (i + 6) % 10;
    const chiIdx = i % 12;
    const yearSample = 1960 + i;
    const name = `${CAN_NAMES[canIdx]} ${CHI_NAMES[chiIdx]}`;
    const slug = `tuoi-${CAN_SLUGS[canIdx]}-${CHI_SLUGS[chiIdx]}`;
    const years = [yearSample];
    if (yearSample - 60 >= 1940) years.unshift(yearSample - 60);
    if (yearSample + 60 <= 2030) years.push(yearSample + 60);
    list60.push({ yearSample, name, slug, years });
  }

  return (
    <>
      <SubpageHeader
        title="Tử Vi Trọn Đời 60 Hoa Giáp (Nam & Nữ Mạng)"
        subtitle="Luận giải chi tiết cuộc đời, công danh, tình duyên, tuổi hợp làm ăn, hướng Bát Trạch và vận hạn từng độ tuổi"
      />
      <main className="wrap">
        <div className="card">
          <h2>Danh Sách 60 Tuổi Hoa Giáp</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 10 }}>
            {list60.map((item) => {
              const td = TronDoi.luan(item.yearSample, 'nam');
              return (
                                <div
                  key={item.slug}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: '1px solid var(--line)',
                    background: 'var(--bg)',
                  }}
                >
                  <Link
                    href={`/tu-vi-tron-doi/${item.slug}`}
                    style={{ fontWeight: 700, fontSize: 16, color: 'var(--red)', textDecoration: 'none' }}
                  >
                    Tuổi {item.name} ({item.years.join(', ')})
                  </Link>
                  <div className="small muted" style={{ marginTop: 4 }}>
                    {td.napAm} ({td.hanh})
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Link
                      href={`/tu-vi-tron-doi/${item.slug}-nam-mang`}
                      className="pill"
                      style={{ textDecoration: 'none', fontSize: 12 }}
                    >
                      Nam mạng
                    </Link>
                    <Link
                      href={`/tu-vi-tron-doi/${item.slug}-nu-mang`}
                      className="pill"
                      style={{ textDecoration: 'none', fontSize: 12 }}
                    >
                      Nữ mạng
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <SubpageFooter currentPath="/tu-vi-tron-doi" />
    </>
  );
}
