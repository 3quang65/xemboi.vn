// Chuyển kho tri thức trợ lý AI cũ (AgentKnowledgeDoc) sang RAG mới (docs/v2/17 mục 6.4, bước 1–4).
// - Mỗi AgentKnowledgeDoc → một RagNguon `XB-<10 hex>`, loaiNguon 'noi_bo_xemboi', phapLy C, chiNoiBo, phạm vi NOI_BO.
//   Mã lấy từ sha256(id) chứ không lấy 8 ký tự đầu id như 6.4 viết: cuid tạo gần nhau trùng phần đầu (dấu thời gian).
// - rawContent ghi ra <thư viện RAG>/noi-bo-xemboi/<ma>.txt, trangThaiTai 'đã tải'. Máy trạm chạy tiếp bước 1–6:
//     python -I tools/rag-may-tram/chay.py xu-ly --nguon XB-...
// - Gắn trợ lý cũ qua quan hệ AiAgent.nguonRag. KHÔNG chép cột embedding 1536 chiều (vector băm giả, 6.4 bước 4).
// - Chạy lại được: nguồn đã có thì chỉ cập nhật tệp khi nội dung đổi. Không xóa hay sửa bảng cũ.
//   npx tsx scripts/chuyen-tri-thuc-cu.ts [--thu] [--thu-vien <thư mục>]
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PrismaClient, type Prisma } from '@prisma/client';

type Db = PrismaClient | Prisma.TransactionClient;
export const THU_MUC_CON = 'noi-bo-xemboi';
const bam = (s: string) => createHash('sha256').update(s).digest('hex');
export const maNguonXb = (docId: string) => `XB-${bam(docId).slice(0, 10)}`;

export async function chuyenTriThuc(db: Db, o: { thuVien: string; thu?: boolean }) {
  const ds = await db.agentKnowledgeDoc.findMany({ select: { id: true, agentId: true, title: true, category: true, sourceType: true, rawContent: true }, orderBy: { createdAt: 'asc' } });
  const kq = { tong: ds.length, moi: 0, capNhatTep: 0, giuNguyen: 0, rong: 0, ma: [] as string[] };
  const thuMuc = path.join(o.thuVien, THU_MUC_CON);
  for (const d of ds) {
    const noiDung = d.rawContent.replace(/\r\n/g, '\n').trim();
    if (!noiDung) { kq.rong++; continue; }
    const ma = maNguonXb(d.id);
    kq.ma.push(ma);
    const tep = path.join(thuMuc, `${ma}.txt`);
    const sha = bam(noiDung);
    const cu = await db.ragNguon.findUnique({ where: { ma }, select: { id: true, sha256: true } });
    if (cu && cu.sha256 === sha && existsSync(tep)) { kq.giuNguyen++; continue; }
    if (o.thu) { cu ? kq.capNhatTep++ : kq.moi++; continue; }
    mkdirSync(thuMuc, { recursive: true });
    if (!existsSync(tep) || readFileSync(tep, 'utf8') !== noiDung) writeFileSync(tep, noiDung, 'utf8');
    const duongDanCucBo = tep.split(path.sep).join('/');
    if (cu) {
      await db.ragNguon.update({ where: { id: cu.id }, data: { sha256: sha, duongDanCucBo, trangThaiTai: 'đã tải' } });
      kq.capNhatTep++;
      continue;
    }
    await db.ragNguon.create({
      data: {
        ma, tenGoc: d.title, ngonNgu: ['vi'], mang: [d.category], loaiNguon: 'noi_bo_xemboi', dinhDang: 'txt',
        phapLy: 'C', chiNoiBo: true, phamVi: 'NOI_BO', duocTrichDai: false,
        ghiChuPhapLy: `Chuyển từ AgentKnowledgeDoc ${d.id} (sourceType ${d.sourceType}). Chưa rõ gốc: biên tập xếp loại lại trước khi cho công khai.`,
        trangThaiTai: 'đã tải', duongDanCucBo, sha256: sha, dungLuongMb: Buffer.byteLength(noiDung) / 1e6,
        tacTu: { connect: { id: d.agentId } },
      },
    });
    kq.moi++;
  }
  return kq;
}

function docCo(ten: string) {
  const i = process.argv.indexOf(ten);
  return i > 0 ? process.argv[i + 1] : undefined;
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/chuyen-tri-thuc-cu.ts')) {
  const p = new PrismaClient();
  const thuVien = docCo('--thu-vien') ?? process.env.RAG_THU_VIEN ?? 'D:/VibeCode/Antigravity/thu-vien-rag';
  chuyenTriThuc(p, { thuVien, thu: process.argv.includes('--thu') })
    .then((kq) => {
      console.log(`${process.argv.includes('--thu') ? '[THỬ] ' : ''}AgentKnowledgeDoc: ${kq.tong}. Mới ${kq.moi}, cập nhật tệp ${kq.capNhatTep}, giữ nguyên ${kq.giuNguyen}, rỗng ${kq.rong}.`);
      if (kq.moi + kq.capNhatTep) console.log(`Chạy tiếp trên máy trạm: python -I tools/rag-may-tram/chay.py xu-ly --nguon ${kq.ma.join(' ')}`);
    })
    .catch((e) => { console.error(e); process.exitCode = 1; })
    .finally(() => p.$disconnect());
}
