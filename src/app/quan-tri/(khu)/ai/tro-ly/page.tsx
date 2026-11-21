import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { yeuCauQuyen } from '@/lib/quan-tri/phien';
import ThongBao, { so } from '../../seo/ThongBao';
import { suaTroLy } from './hanh-dong';

export const metadata: Metadata = { title: 'Trợ lý AI' };
export const dynamic = 'force-dynamic';

type MauFewShot = {
  agentSlug?: string;
  agentName?: string;
  userQuestion?: string;
  goldenAnswer?: string;
};

function docFewShotChiDoc(): MauFewShot[] {
  try {
    const tep = path.join(process.cwd(), 'src/lib/ai/few-shot-dialogues.json');
    const raw = fs.readFileSync(tep, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function TrangTroLyAi({
  searchParams,
}: {
  searchParams: Promise<{ chon?: string; bao?: string; loi?: string }>;
}) {
  await yeuCauQuyen('ai.tro_ly');

  const sp = await searchParams;
  const agents = await prisma.aiAgent.findMany({
    include: {
      _count: { select: { conversations: true, nguonRag: true } },
    },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  });

  const dangChon = agents.find((a) => a.id === sp.chon) ?? agents[0] ?? null;
  const fewShots = docFewShotChiDoc();

  return (
    <>
      <div className="qt-dau-trang">
        <div>
          <h1>Trợ lý AI</h1>
          <p className="qt-phu" style={{ marginBottom: 0 }}>
            Quản lý nhân cách, lời chào, câu hỏi gợi ý và giọng đọc của trợ lý trong bảng <code>AiAgent</code>.
          </p>
        </div>
        <div className="qt-dau-nut">
          <Link className="qt-nut phu" href="/quan-tri/ai/mo-hinh">
            Mô hình AI
          </Link>
          <Link className="qt-nut phu" href="/quan-tri/rag/nguon?q=XB-">
            Nguồn RAG của trợ lý
          </Link>
        </div>
      </div>

      <ThongBao bao={sp.bao} loi={sp.loi} />

      <div className="qt-the qt-the-cuon">
        <h2>Danh sách trợ lý ({so(agents.length)})</h2>
        <table className="qt-bang">
          <thead>
            <tr>
              <th>Trợ lý</th>
              <th>Chức danh</th>
              <th>Giọng đọc</th>
              <th className="qt-cot-so">Hội thoại</th>
              <th className="qt-cot-so">Nguồn RAG</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {agents.length === 0 && (
              <tr>
                <td colSpan={7} style={{ color: 'var(--muted)' }}>
                  Chưa có bản ghi trợ lý nào trong bảng <code>AiAgent</code> của cơ sở dữ liệu.
                </td>
              </tr>
            )}
            {agents.map((a) => {
              const chon = dangChon?.id === a.id;
              return (
                <tr key={a.id} style={chon ? { background: 'var(--line)' } : undefined}>
                  <td>
                    <b>{a.name}</b>
                    {a.isDefault && (
                      <>
                        {' '}
                        <span className="qt-nhan vua">Mặc định</span>
                      </>
                    )}
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      <code>{a.slug}</code>
                    </div>
                  </td>
                  <td>{a.title}</td>
                  <td>
                    <div>{a.voiceProvider}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {a.voiceId} ({a.voiceSpeed}x · {a.voicePitch})
                    </div>
                  </td>
                  <td className="qt-cot-so">{so(a._count.conversations)}</td>
                  <td className="qt-cot-so">{so(a._count.nguonRag)}</td>
                  <td>
                    <span className={`qt-nhan ${a.isActive ? 'tot' : 'xau'}`}>
                      {a.isActive ? 'Đang bật' : 'Tạm tắt'}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link className="qt-nut phu" href={`/quan-tri/ai/tro-ly?chon=${encodeURIComponent(a.id)}`}>
                      {chon ? 'Đang sửa' : 'Chọn sửa'}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {dangChon && (
        <div className="qt-the">
          <h2>
            Sửa cấu hình: {dangChon.name} (<code>{dangChon.slug}</code>)
          </h2>
          <p className="qt-phu">
            Cấu hình mô hình LLM nằm riêng tại <Link href="/quan-tri/ai/mo-hinh">Mô hình AI</Link>; mọi thay đổi ở đây ghi nhật ký <code>ai.sua_tro_ly</code> (riêng <code>systemPrompt</code> chỉ lưu độ dài và sha256).
          </p>
          <form action={suaTroLy} style={{ display: 'grid', gap: 12 }}>
            <input type="hidden" name="id" value={dangChon.id} />

            <div className="qt-tl-luoi-form">
              <label className="qt-tl-truong">
                <span>Tên trợ lý</span>
                <input className="qt-o" name="name" defaultValue={dangChon.name} required />
              </label>
              <label className="qt-tl-truong">
                <span>Chức danh</span>
                <input className="qt-o" name="title" defaultValue={dangChon.title} required />
              </label>
              <label className="qt-tl-truong" style={{ alignContent: 'end' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
                  <input type="checkbox" name="isActive" defaultChecked={dangChon.isActive} />
                  <span>Đang kích hoạt (`isActive`)</span>
                </span>
              </label>
            </div>

            <div className="qt-tl-luoi-form">
              <label className="qt-tl-truong">
                <span>Nhà cung cấp giọng (`voiceProvider`)</span>
                <input
                  className="qt-o"
                  name="voiceProvider"
                  list="ds-voice-provider"
                  defaultValue={dangChon.voiceProvider}
                  required
                />
              </label>
              <label className="qt-tl-truong">
                <span>Mã giọng (`voiceId`)</span>
                <input
                  className="qt-o"
                  name="voiceId"
                  list="ds-voice-id"
                  defaultValue={dangChon.voiceId}
                  required
                />
              </label>
              <label className="qt-tl-truong">
                <span>Tốc độ đọc (`voiceSpeed`, 0.5–2.0)</span>
                <input
                  className="qt-o"
                  type="number"
                  name="voiceSpeed"
                  min={0.5}
                  max={2.0}
                  step={0.05}
                  defaultValue={dangChon.voiceSpeed}
                  required
                />
              </label>
              <label className="qt-tl-truong">
                <span>Cao độ (`voicePitch`)</span>
                <input className="qt-o" name="voicePitch" defaultValue={dangChon.voicePitch} required />
              </label>
            </div>

            <datalist id="ds-voice-provider">
              <option value="edge_or_neural" />
              <option value="edge_neural" />
              <option value="openai_tts" />
              <option value="elevenlabs" />
            </datalist>
            <datalist id="ds-voice-id">
              <option value="vi-VN-NamMinhNeural" />
              <option value="vi-VN-HoaiMyNeural" />
            </datalist>

            <label className="qt-tl-truong">
              <span>Lời chào mở đầu (`welcomeMessage`)</span>
              <textarea
                className="qt-o qt-nd-o"
                name="welcomeMessage"
                rows={3}
                defaultValue={dangChon.welcomeMessage}
                required
              />
            </label>

            <label className="qt-tl-truong">
              <span>Câu hỏi gợi ý (`suggestedQuestions`, mỗi dòng một câu)</span>
              <textarea
                className="qt-o qt-nd-o"
                name="suggestedQuestions"
                rows={4}
                defaultValue={(dangChon.suggestedQuestions ?? []).join('\n')}
              />
            </label>

            <label className="qt-tl-truong">
              <span>Chỉ dẫn hệ thống (`systemPrompt`)</span>
              <textarea
                className="qt-o qt-nd-o"
                name="systemPrompt"
                rows={10}
                defaultValue={dangChon.systemPrompt}
                style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 12 }}
                required
              />
            </label>

            <div>
              <button className="qt-nut" type="submit">
                Lưu trợ lý
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="qt-the">
        <h2>Mẫu đối thoại few-shot (chỉ đọc · {so(fewShots.length)} mẫu)</h2>
        <p className="qt-phu">
          Đọc trực tiếp từ <code>src/lib/ai/few-shot-dialogues.json</code>. Khu mới không cho ghi đè tệp mã nguồn lúc chạy; việc chuyển sang lưu cơ sở dữ liệu đã ghi trong mục đề nghị sửa lõi.
        </p>
        {fewShots.length === 0 ? (
          <p className="qt-phu" style={{ marginBottom: 0 }}>
            Không có mẫu đối thoại nào trong tệp cấu hình.
          </p>
        ) : (
          <div>
            {fewShots.map((m, idx) => (
              <div key={`${m.agentSlug ?? 'fs'}-${idx}`} className="qt-fs-the">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
                  <b>{m.agentName || m.agentSlug || `Mẫu #${idx + 1}`}</b>
                  {m.agentSlug && (
                    <span className="qt-nhan">
                      <code>{m.agentSlug}</code>
                    </span>
                  )}
                </div>
                <div style={{ marginBottom: 6 }}>
                  <b>Khách hỏi:</b> {m.userQuestion || '–'}
                </div>
                <details>
                  <summary style={{ cursor: 'pointer', color: 'var(--red)', fontWeight: 600 }}>
                    Xem câu trả lời mẫu
                  </summary>
                  <div style={{ marginTop: 8, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {m.goldenAnswer || '–'}
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
