'use client';

import React from 'react';
import {
  type DialogueMessage,
  MASTER_THEMES,
  resolveMasterForTopic,
  DEFAULT_MASTER_THEME,
  type MasterThemeConfig,
} from '@/lib/ai/dialogue-simulation';

function InlineFormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong
              key={i}
              style={{
                color: '#ffffff',
                fontWeight: 700,
                textShadow: '0 0 2px rgba(255,255,255,0.3)',
              }}
            >
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
    </>
  );
}

function RenderTableBlock({ lines }: { lines: string[] }) {
  if (lines.length < 2) return null;
  const headerRow = lines[0];
  const dataRows = lines.slice(2);

  const parseCells = (row: string) =>
    row
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());

  const headers = parseCells(headerRow);

  return (
    <div style={{ overflowX: 'auto', margin: '8px 0' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 12,
          border: '1px solid rgba(234, 179, 8, 0.35)',
          borderRadius: 8,
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.25)',
        }}
      >
        <thead style={{ background: 'rgba(234, 179, 8, 0.2)', color: '#fde047' }}>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ padding: '7px 10px', textAlign: 'left', borderBottom: '1px solid rgba(234, 179, 8, 0.3)' }}>
                {h.replace(/\*\*/g, '')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((r, rIdx) => {
            const cells = parseCells(r);
            return (
              <tr key={rIdx} style={{ background: rIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                {cells.map((c, cIdx) => (
                  <td key={cIdx} style={{ padding: '7px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#f1f5f9' }}>
                    <InlineFormattedText text={c} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RenderParagraph({ text, theme, isMinh }: { text: string; theme?: MasterThemeConfig; isMinh?: boolean }) {
  if (!text) return null;

  if (text.startsWith('### ')) {
    return (
      <h4
        style={{
          margin: '10px 0 4px',
          fontSize: 14.5,
          fontFamily: "'Noto Serif', serif",
          color: theme?.nameColor || (isMinh ? '#38bdf8' : '#fde047'),
          borderBottom: `1px dashed ${theme?.borderColor || 'rgba(255,255,255,0.2)'}`,
          paddingBottom: 4,
          letterSpacing: 0.3,
        }}
      >
        {text.replace(/^###\s+/, '')}
      </h4>
    );
  }

  if (text.startsWith('## ') || text.startsWith('# ')) {
    return (
      <h3
        style={{
          margin: '12px 0 6px',
          fontSize: 15.5,
          fontFamily: "'Noto Serif', serif",
          color: theme?.nameColor || (isMinh ? '#38bdf8' : '#fde047'),
        }}
      >
        {text.replace(/^#+\s+/, '')}
      </h3>
    );
  }

  if (text.startsWith('> ')) {
    return (
      <blockquote
        style={{
          margin: '8px 0',
          padding: '6px 12px',
          borderLeft: `3px solid ${theme?.borderColor || '#fde047'}`,
          background: 'rgba(234, 179, 8, 0.08)',
          color: '#fde047',
          fontStyle: 'italic',
          borderRadius: '0 6px 6px 0',
        }}
      >
        <InlineFormattedText text={text.replace(/^>\s*/, '')} />
      </blockquote>
    );
  }

  const lines = text.split('\n');
  const isBulletList = lines.every((line) => line.trim().startsWith('- ') || line.trim().startsWith('* '));

  if (isBulletList && lines.length > 1) {
    return (
      <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {lines.map((l, lIdx) => (
          <li key={lIdx} style={{ lineHeight: 1.65 }}>
            <InlineFormattedText text={l.trim().replace(/^[-*]\s+/, '')} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
      <InlineFormattedText text={text} />
    </p>
  );
}

export function RenderMessageContent({
  content,
  theme,
  isMinh,
}: {
  content: string;
  theme?: MasterThemeConfig;
  isMinh?: boolean;
}) {
  if (content.includes('|') && content.includes('\n|')) {
    const lines = content.split('\n');
    const tableLines: string[] = [];
    let inTable = false;
    const components: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        inTable = true;
        tableLines.push(trimmed);
      } else {
        if (inTable && tableLines.length > 0) {
          components.push(<RenderTableBlock key={`tbl_${idx}`} lines={[...tableLines]} />);
          tableLines.length = 0;
          inTable = false;
        }
        if (trimmed) {
          components.push(<RenderParagraph key={`p_${idx}`} text={trimmed} theme={theme} isMinh={isMinh} />);
        }
      }
    });

    if (inTable && tableLines.length > 0) {
      components.push(<RenderTableBlock key="tbl_end" lines={[...tableLines]} />);
    }

    return <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, lineHeight: 1.7 }}>{components}</div>;
  }

  const paragraphs = content.split('\n\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13.5, lineHeight: 1.7 }}>
      {paragraphs.map((para, pIdx) => (
        <RenderParagraph key={pIdx} text={para.trim()} theme={theme} isMinh={isMinh} />
      ))}
    </div>
  );
}

export function resolveThemeForMessage(m: DialogueMessage): MasterThemeConfig {
  if (m.masterSlug && MASTER_THEMES[m.masterSlug]) {
    return MASTER_THEMES[m.masterSlug];
  }
  const fallback = resolveMasterForTopic({ topicKey: m.topicKey, questionText: m.content });
  return MASTER_THEMES[fallback.slug] || DEFAULT_MASTER_THEME;
}
