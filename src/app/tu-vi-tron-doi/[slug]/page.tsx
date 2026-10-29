import type { Metadata } from 'next';
import Link from 'next/link';
import SubpageHeader from '@/components/SubpageHeader';
import SubpageFooter from '@/components/SubpageFooter';
import { TronDoi } from '@/lib/core/trondoi';

const CAN_SLUGS = ['giap', 'at', 'binh', 'dinh', 'mau', 'ky', 'canh', 'tan', 'nham', 'quy'];
const CHI_SLUGS = ['ty', 'suu', 'dan', 'mao', 'thin', 'ti', 'ngo', 'mui', 'than', 'dau', 'tuat', 'hoi'];
const CAN_NAMES = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

function parseTronDoiSlug(slug: string) {
  let clean = slug.replace(/^tuoi-/, '');
  let gender: 'nam' | 'nu' = 'nam';
  if (clean.endsWith('-nam-mang')) {
    gender = 'nam';
    clean = clean.replace(/-nam-mang$/, '');
  } else if (clean.endsWith('-nu-mang')) {
    gender = 'nu';
    clean = clean.replace(/-nu-mang$/, '');
  }
  const parts = clean.split('-');
  const canIdx = Math.max(0, CAN_SLUGS.indexOf(parts[0]));
  const chiIdx = Math.max(0, CHI_SLUGS.indexOf(parts[1]));
  let yearSample = 1960;
  for (let y = 1960; y < 2020; y++) {
    if ((y + 6) % 10 === canIdx && (y + 8) % 12 === chiIdx) {
      yearSample = y;
      break;
    }
  }
  return {
    canIdx,
    chiIdx,
    yearSample,
    gender,
    canChiName: `${CAN_NAMES[canIdx]} ${CHI_NAMES[chiIdx]}`,
    baseSlug: `tuoi-${CAN_SLUGS[canIdx]}-${CHI_SLUGS[chiIdx]}`,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = parseTronDoiSlug(slug);
  const info = TronDoi.luan(p.yearSample, p.gender);
  return {
    title: `${info.tieuDe} – XemBoi.vn`,
    description: info.moTa,
    alternates: { canonical: `https://xemboi.vn/tu-vi-tron-doi/${slug}` },
  };
}

export default async function TuViTronDoiDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = parseTronDoiSlug(slug);
  const info = TronDoi.luan(p.yearSample, p.gender);

  return (
    <>
      <SubpageHeader
        title={info.tieuDe}
        subtitle={`Nạp âm: ${info.napAm} (${info.hanh}) · Cung phi: ${info.cungPhi} · Con giáp: ${info.conGiap}`}
      />
      <main className="wrap">
        <div className="card">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <Link href={`/tu-vi-tron-doi/${p.baseSlug}-nam-mang`} className="btn gold" style={{ width: 'auto', textDecoration: 'none' }}>
              Nam mạng {p.canChiName}
            </Link>
            <Link href={`/tu-vi-tron-doi/${p.baseSlug}-nu-mang`} className="btn red" style={{ width: 'auto', textDecoration: 'none' }}>
              Nữ mạng {p.canChiName}
            </Link>
          </div>
          <div className="reading" dangerouslySetInnerHTML={{ __html: info.text }} />
        </div>
      </main>
      <SubpageFooter currentPath="/tu-vi-tron-doi" />
    </>
  );
}
