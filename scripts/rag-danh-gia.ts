// Bộ đánh giá RAG (docs/v2/17 mục 3.4, 12 mục 5.3).
//   npx tsx --env-file=.env scripts/rag-danh-gia.ts [--mo-hinh=bge-m3,qwen3-0.6b,aiteamvn] [--thu] [--bao-cao=docs/v2/bao-cao-danh-gia-rag.md]
// 1. Nạp docs/v2/rag-cau-hoi-chuan.csv vào rag_cau_hoi_chuan (id = mã câu, chạy lại thì cập nhật).
// 2. Nhánh từ khóa: đúng hàm chạy thật (src/lib/rag/tim-lai.ts), có và không có mở rộng thuật ngữ.
// 3. Nhánh vector: tools/rag-may-tram/tim_vector.py (tìm chính xác, không qua HNSW), mỗi mô hình một lần.
// 4. Gộp RRF như chạy thật. Ghi một dòng rag_danh_gia cho mỗi cấu hình (--thu: không ghi) và báo cáo Markdown.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { PrismaClient, Prisma } from '@prisma/client';
import { moRongThuatNgu, tuKhoaViet, timTuKhoa, gopRrf, napBangThuatNgu } from '../src/lib/rag/tim-lai';
import { chiSoCau, tongHop, docCsv, type ChiSoCau } from '../src/lib/rag/danh-gia';

const thamSo = process.argv.slice(2);
const co = (ten: string) => thamSo.find((a) => a.startsWith(`--${ten}=`))?.split('=').slice(1).join('=');
const thu = thamSo.includes('--thu');
const moHinh = (co('mo-hinh') ?? 'bge-m3,qwen3-0.6b,aiteamvn').split(',').filter(Boolean);
const PY = process.env.RAG_PYTHON || 'D:\\VibeCode\\Antigravity\\may-tram\\venv\\Scripts\\python.exe';
const TAT_CA = Prisma.sql`TRUE`; // bộ đo chạy trên toàn kho máy trạm (mọi nguồn đều đã có vector)

type Cau = { ma: string; mang: string; doKho: string; cauHoi: string; dung: bigint[]; nguonDung: string[] };

(async () => {
  const csv = docCsv(fs.readFileSync(path.join(process.cwd(), 'docs/v2/rag-cau-hoi-chuan.csv'), 'utf8'));
  const cau: Cau[] = csv.map((r) => ({
    ma: r.ma, mang: r.mang, doKho: r.do_kho, cauHoi: r.cau_hoi,
    dung: r.doan_dung.split('|').filter(Boolean).map((x) => BigInt(x)), nguonDung: r.nguon_dung_ma.split('|').filter(Boolean),
  }));
  if (!cau.length || cau.some((c) => !c.ma || !c.cauHoi || !c.dung.length)) throw new Error('CSV câu hỏi thiếu ma/cau_hoi/doan_dung');
  const db = new PrismaClient();
  try {
    if (!thu) for (const c of cau) {
      const r = csv.find((x) => x.ma === c.ma)!;
      const du = { cauHoi: c.cauHoi, mang: c.mang, doanDung: c.dung, nguonDungMa: c.nguonDung, viTriDung: r.vi_tri_dung || null, ghiChu: r.ghi_chu || null };
      await db.ragCauHoiChuan.upsert({ where: { id: c.ma }, create: { id: c.ma, ...du }, update: du });
    }
    const bang = await napBangThuatNgu(db);
    const nguonCua = new Map<string, string>();
    const layNguon = async (ids: bigint[]) => {
      const thieu = ids.filter((x) => !nguonCua.has(String(x)));
      if (!thieu.length) return;
      const r = await db.$queryRaw<{ id: bigint; ma: string }[]>`SELECT d.id, n.ma FROM rag_doan d JOIN rag_nguon n ON n.id = d."nguonId" WHERE d.id = ANY(${thieu}::bigint[])`;
      for (const x of r) nguonCua.set(String(x.id), x.ma);
    };

    // Nhánh từ khóa
    const mr = new Map<string, ReturnType<typeof moRongThuatNgu>>();
    const tkMr = new Map<string, bigint[]>(), tkTho = new Map<string, bigint[]>();
    let msTk = 0;
    for (const c of cau) {
      const m = moRongThuatNgu(c.cauHoi, bang);
      mr.set(c.ma, m);
      const t0 = Date.now();
      tkMr.set(c.ma, (await timTuKhoa(db, { tuKhoa: [...m.han, ...tuKhoaViet(m.conLai)], phamVi: TAT_CA, k: 100 })).map((x) => x.id));
      msTk += Date.now() - t0;
      const tho = moRongThuatNgu(c.cauHoi, []);
      tkTho.set(c.ma, (await timTuKhoa(db, { tuKhoa: tuKhoaViet(tho.conLai), phamVi: TAT_CA, k: 100 })).map((x) => x.id));
    }

    // Nhánh vector
    const tam = fs.mkdtempSync(path.join(os.tmpdir(), 'rag-danh-gia-'));
    const vao = path.join(tam, 'cau.json');
    fs.writeFileSync(vao, JSON.stringify(cau.flatMap((c) => [
      { khoa: `${c.ma}|tho`, van_ban: c.cauHoi },
      { khoa: `${c.ma}|mr`, van_ban: [c.cauHoi, ...mr.get(c.ma)!.han].join(' ') },
    ])));
    const vec: Record<string, { phienBan: string; msMoiCau: number; ketQua: Record<string, number[]> }> = {};
    for (const m of moHinh) {
      const ra = path.join(tam, `${m}.json`);
      console.log(`Vector: ${m}…`);
      const p = spawnSync(PY, ['-I', 'tools/rag-may-tram/tim_vector.py', '--mo-hinh', m, '--vao', vao, '--ra', ra, '--k', '100'], { stdio: ['ignore', 'inherit', 'pipe'], encoding: 'utf8', timeout: 3_600_000 });
      if (p.status !== 0) { console.error(p.stderr?.split('\n').slice(-15).join('\n')); throw new Error(`tim_vector.py ${m} lỗi (${p.status})`); }
      vec[m] = JSON.parse(fs.readFileSync(ra, 'utf8'));
    }
    fs.rmSync(tam, { recursive: true, force: true });

    // Cấu hình và chỉ số
    type CauHinh = { ten: string; moHinh: string; cauHinh: Record<string, unknown>; xep: (c: Cau) => bigint[] };
    const v = (m: string, c: Cau, loai: 'tho' | 'mr') => vec[m].ketQua[`${c.ma}|${loai}`].map((x) => BigInt(x));
    const rrf = (a: bigint[], b: bigint[]) => gopRrf([{ ten: 'vector', ketQua: a.map((id) => ({ id })) }, { ten: 'tu_khoa', ketQua: b.map((id) => ({ id })) }]).map((x) => x.id);
    const dsCh: CauHinh[] = [
      { ten: 'từ khóa, không mở rộng', moHinh: 'khong', cauHinh: { nhanh: ['tu_khoa'], moRongThuatNgu: false }, xep: (c) => tkTho.get(c.ma)! },
      { ten: 'từ khóa + mở rộng thuật ngữ', moHinh: 'khong', cauHinh: { nhanh: ['tu_khoa'], moRongThuatNgu: true }, xep: (c) => tkMr.get(c.ma)! },
    ];
    for (const m of moHinh) dsCh.push(
      { ten: 'vector', moHinh: m, cauHinh: { nhanh: ['vector'], moRongThuatNgu: false }, xep: (c) => v(m, c, 'tho') },
      { ten: 'vector + mở rộng', moHinh: m, cauHinh: { nhanh: ['vector'], moRongThuatNgu: true }, xep: (c) => v(m, c, 'mr') },
      { ten: 'lai (vector + từ khóa mở rộng)', moHinh: m, cauHinh: { nhanh: ['vector', 'tu_khoa'], moRongThuatNgu: 'chi_tu_khoa', rrfK: 60 }, xep: (c) => rrf(v(m, c, 'tho'), tkMr.get(c.ma)!) },
      { ten: 'lai + mở rộng cả hai nhánh', moHinh: m, cauHinh: { nhanh: ['vector', 'tu_khoa'], moRongThuatNgu: true, rrfK: 60 }, xep: (c) => rrf(v(m, c, 'mr'), tkMr.get(c.ma)!) },
    );

    const bangKq: { ch: CauHinh; tong: ReturnType<typeof tongHop>; theoMang: Record<string, ReturnType<typeof tongHop>>; theoDoKho: Record<string, ReturnType<typeof tongHop>> }[] = [];
    for (const ch of dsCh) {
      const ds: (ChiSoCau & { c: Cau; top: bigint[] })[] = [];
      for (const c of cau) {
        const xep = ch.xep(c);
        await layNguon(xep.slice(0, 1));
        ds.push({ ...chiSoCau(xep, c.dung, xep[0] != null ? nguonCua.get(String(xep[0])) ?? null : null, c.nguonDung), c, top: xep.slice(0, 5) });
      }
      const nhom = (f: (c: Cau) => string) => Object.fromEntries([...new Set(cau.map(f))].sort().map((k) => [k, tongHop(ds.filter((x) => f(x.c) === k))]));
      const tong = tongHop(ds);
      bangKq.push({ ch, tong, theoMang: nhom((c) => c.mang), theoDoKho: nhom((c) => c.doKho) });
      if (!thu) await db.ragDanhGia.create({ data: {
        moHinhNhung: ch.moHinh === 'khong' ? 'khong' : vec[ch.moHinh].phienBan,
        cauHinh: { ten: ch.ten, k: 10, ...ch.cauHinh, hitAt10: tong.hitAt10, msMoiCauVector: ch.moHinh === 'khong' ? null : vec[ch.moHinh].msMoiCau },
        soCau: tong.soCau, recallAt10: tong.recallAt10, mrr: tong.mrr, tyLeDungNguon: tong.tyLeDungNguon,
        chiTiet: ds.map((x) => ({ ma: x.c.ma, hang: x.hang, recall10: x.recall10, dungNguonTop1: x.dungNguonTop1, top5: x.top.map(String) })),
      } });
      console.log(`${ch.moHinh.padEnd(11)} ${ch.ten.padEnd(32)} recall@10 ${tong.recallAt10.toFixed(3)}  hit@10 ${tong.hitAt10.toFixed(3)}  MRR ${tong.mrr.toFixed(3)}  đúng nguồn ${tong.tyLeDungNguon.toFixed(3)}`);
    }

    const baoCao = co('bao-cao');
    if (baoCao) {
      const pct = (x: number) => `${(x * 100).toFixed(1)}`;
      const dong = (r: (typeof bangKq)[number]) => `| ${r.ch.moHinh} | ${r.ch.ten} | ${pct(r.tong.recallAt10)} | ${pct(r.tong.hitAt10)} | ${r.tong.mrr.toFixed(3)} | ${pct(r.tong.tyLeDungNguon)} |`;
      const tot = [...bangKq].sort((a, b) => b.tong.hitAt10 - a.tong.hitAt10 || b.tong.mrr - a.tong.mrr);
      const nhomBang = (ten: string, f: (r: (typeof bangKq)[number]) => Record<string, ReturnType<typeof tongHop>>) => {
        const khoa = Object.keys(f(bangKq[0]));
        return [`| Cấu hình | ${khoa.map((k) => `${k} (${f(bangKq[0])[k].soCau})`).join(' | ')} |`, `|:--|${khoa.map(() => '--:').join('|')}|`,
          ...bangKq.map((r) => `| ${r.ch.moHinh} · ${r.ch.ten} | ${khoa.map((k) => pct(f(r)[k].hitAt10)).join(' | ')} |`)].join('\n') + `\n\n_${ten}: hit@10 (%)._`;
      };
      const md = `# Đánh giá tìm kiếm RAG: ${cau.length} câu hỏi chuẩn

> Sinh tự động bởi \`scripts/rag-danh-gia.ts\` lúc ${new Date().toISOString()}. Kho: ${Object.values(vec)[0]?.ketQua ? 'mọi đoạn đã có vector bge-m3' : '-'}.
> Chỉ số: **recall@10** = tỷ lệ đoạn đúng lọt top 10 (chia cho min(số đoạn đúng, 10)); **hit@10** = câu có ít nhất một đoạn đúng trong top 10; **MRR** trên top 100; **đúng nguồn** = đoạn đứng đầu thuộc đúng sách.

## Tổng

| Mô hình | Cấu hình | recall@10 (%) | hit@10 (%) | MRR | Đúng nguồn (%) |
|:--|:--|--:|--:|--:|--:|
${bangKq.map(dong).join('\n')}

Tốt nhất theo hit@10: **${tot[0].ch.moHinh} · ${tot[0].ch.ten}**.

Thời gian: nhánh từ khóa trung bình ${Math.round(msTk / cau.length)} ms/câu trên CSDL máy trạm; nhúng câu hỏi trên GPU ${Object.entries(vec).map(([m, x]) => `${m} ${x.msMoiCau} ms`).join(', ')} (theo lô).

## Theo mảng

${nhomBang('Theo mảng', (r) => r.theoMang)}

## Theo độ khó

${nhomBang('Theo độ khó', (r) => r.theoDoKho)}

## Phiên bản mô hình

${Object.entries(vec).map(([m, x]) => `- ${m}: \`${x.phienBan}\``).join('\n')}
`;
      fs.writeFileSync(baoCao, md);
      console.log(`Đã ghi ${baoCao}`);
    }
  } finally {
    await db.$disconnect();
  }
})().catch((e) => { console.error(e); process.exit(1); });
