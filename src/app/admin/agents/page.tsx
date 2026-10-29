'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { THAY_MINH_TRIET, DEFAULT_AGENTS } from '@/lib/ai/agent-persona';

interface LlmConfigState {
  provider: 'gemini' | 'openai' | 'deepseek' | 'offline';
  modelName: string;
  temperature: number;
  hasApiKey: boolean;
  maskedApiKey: string;
  apiKeyInput?: string;
}

interface FewShotItem {
  agentSlug: string;
  agentName?: string;
  userQuestion: string;
  goldenAnswer: string;
  createdAt?: string;
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<any[]>(DEFAULT_AGENTS);
  const [selectedAgentSlug, setSelectedAgentSlug] = useState<string>('thay-minh-triet');
  const [knowledgeDocs, setKnowledgeDocs] = useState<any[]>([]);
  const [fewShotDialogues, setFewShotDialogues] = useState<FewShotItem[]>([]);
  const [activeTab, setActiveTab] = useState<'config' | 'knowledge' | 'fewshot' | 'playground'>('config');

  // LLM Config state
  const [llmConfig, setLlmConfig] = useState<LlmConfigState>({
    provider: 'offline',
    modelName: 'offline-natural-synthesis',
    temperature: 0.65,
    hasApiKey: false,
    maskedApiKey: '',
    apiKeyInput: '',
  });
  const [showLlmSettings, setShowLlmSettings] = useState(false);
  const [llmStatusMsg, setLlmStatusMsg] = useState('');
  const [agentSaveStatus, setAgentSaveStatus] = useState('');

  // New Doc Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('TU_VI');
  const [newContent, setNewContent] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  // Few Shot Form
  const [newFewShotQuestion, setNewFewShotQuestion] = useState('');
  const [newFewShotAnswer, setNewFewShotAnswer] = useState('');
  const [fewShotStatus, setFewShotStatus] = useState('');

  // Knowledge Filter & Expand
  const [knowledgeCategoryFilter, setKnowledgeCategoryFilter] = useState<string>('ALL');
  const [knowledgeSearchQuery, setKnowledgeSearchQuery] = useState<string>('');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  // Playground
  const [testInput, setTestInput] = useState('');
  const [testMessages, setTestMessages] = useState<Array<{ role: string; content: string }>>([
    { role: 'assistant', content: THAY_MINH_TRIET.welcomeMessage },
  ]);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/agents')
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) {
          if (json.agents && json.agents.length > 0) {
            setAgents(json.agents);
          }
          if (json.activeLlmConfig) {
            setLlmConfig((prev) => ({
              ...prev,
              ...json.activeLlmConfig,
            }));
          }
          if (json.fewShotDialogues) {
            setFewShotDialogues(json.fewShotDialogues);
          }
        }
      })
      .catch(() => {});

    // Fetch knowledge
    fetch('/api/admin/agents/agent_thay_boi_id/knowledge')
      .then((r) => r.json())
      .then((kJson) => {
        if (kJson.ok) setKnowledgeDocs(kJson.docs || []);
      })
      .catch(() => {});
  }, []);

  const currentAgent = agents.find((a) => a.slug === selectedAgentSlug) || agents[0] || THAY_MINH_TRIET;

  const handleUpdateCurrentAgent = (field: string, value: any) => {
    setAgents((prev) =>
      prev.map((a) => (a.slug === currentAgent.slug ? { ...a, [field]: value } : a))
    );
  };

  const handleSaveLlmConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLlmStatusMsg('Đang cập nhật cấu hình LLM...');
    try {
      const res = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_LLM_CONFIG',
          provider: llmConfig.provider,
          modelName: llmConfig.modelName,
          apiKey: llmConfig.apiKeyInput || undefined,
          temperature: llmConfig.temperature,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setLlmConfig((prev) => ({
          ...prev,
          ...data.activeLlmConfig,
          apiKeyInput: '',
        }));
        setLlmStatusMsg('✓ Đã cập nhật thành công Cổng LLM Engine!');
        setTimeout(() => setLlmStatusMsg(''), 4000);
      } else {
        setLlmStatusMsg('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      setLlmStatusMsg('Lỗi: ' + err.message);
    }
  };

  const handleSaveAgent = async () => {
    setAgentSaveStatus('Đang lưu...');
    try {
      const res = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentAgent),
      });
      const data = await res.json();
      if (data.ok) {
        setAgentSaveStatus(`✓ Đã lưu cấu hình Agent "${currentAgent.name}"!`);
        setTimeout(() => setAgentSaveStatus(''), 4000);
      } else {
        setAgentSaveStatus('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      setAgentSaveStatus('Lỗi: ' + err.message);
    }
  };

  const handleAddFewShot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFewShotQuestion.trim() || !newFewShotAnswer.trim()) return;
    setFewShotStatus('Đang nạp mẫu đối thoại huấn luyện...');
    try {
      const res = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_FEW_SHOT',
          agentSlug: currentAgent.slug,
          agentName: currentAgent.name,
          userQuestion: newFewShotQuestion.trim(),
          goldenAnswer: newFewShotAnswer.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setFewShotDialogues(data.fewShotDialogues || []);
        setNewFewShotQuestion('');
        setNewFewShotAnswer('');
        setFewShotStatus('✓ Đã nạp mẫu đối thoại vàng vào kho huấn luyện Few-Shot!');
        setTimeout(() => setFewShotStatus(''), 4000);
      } else {
        setFewShotStatus('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      setFewShotStatus('Lỗi: ' + err.message);
    }
  };

  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setUploadStatus('Đang nạp tri thức và tạo vector embedding (1536 dims)...');

    try {
      const res = await fetch(`/api/admin/agents/${currentAgent.id || 'agent_thay_boi_id'}/knowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          rawContent: newContent,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setUploadStatus('✓ Nạp thành công tài liệu vào kho tri thức pgvector!');
        setKnowledgeDocs([data.data, ...knowledgeDocs]);
        setNewTitle('');
        setNewContent('');
        setTimeout(() => setUploadStatus(''), 4000);
      } else {
        setUploadStatus('Lỗi: ' + data.error);
      }
    } catch (err: any) {
      setUploadStatus('Lỗi: ' + err.message);
    }
  };

  const handleTestChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim() || isTesting) return;

    const userText = testInput;
    setTestInput('');
    setTestMessages((prev) => [...prev, { role: 'user', content: userText }, { role: 'assistant', content: '' }]);
    setIsTesting(true);

    try {
      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          conversationHistory: testMessages,
          agentSlug: currentAgent.slug,
        }),
      });

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamed = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        for (const line of text.split('\n')) {
          if (line.startsWith('data: ')) {
            try {
              const d = JSON.parse(line.slice(6));
              if (d.chunk) {
                streamed += d.chunk;
                setTestMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1].content = streamed;
                  return copy;
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      setTestMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Lỗi kiểm thử chat.' },
      ]);
    } finally {
      setIsTesting(false);
    }
  };

  const providerLabel = {
    gemini: 'Google Gemini AI (Cloud API)',
    openai: 'OpenAI (GPT-4o)',
    deepseek: 'DeepSeek Chat',
    offline: 'Offline Natural Synthesis (Đàm Đạo Tự Nhiên Nội Bộ)',
  }[llmConfig.provider];

  const providerColor = {
    gemini: '#10b981',
    openai: '#0284c7',
    deepseek: '#8b5cf6',
    offline: '#f59e0b',
  }[llmConfig.provider];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 60 }}>
      {/* Page Title & Fast CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, margin: 0, fontFamily: "'Noto Serif', serif", color: 'var(--red)' }}>
            Trung Tâm Huấn Luyện &amp; Quản Trị Bát Đại Danh Sư
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>
            Hệ thống Multi-LLM Bridge, huấn luyện Few-Shot ngôn ngữ tự nhiên và kho tri thức pgvector 1536-dim
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setShowLlmSettings(!showLlmSettings)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'var(--card)',
              border: `1px solid ${providerColor}`,
              borderRadius: 30,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--ink)',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: providerColor }}></span>
            <span>Cổng LLM: <strong>{llmConfig.provider.toUpperCase()}</strong></span>
            <span style={{ fontSize: 10, color: 'var(--muted)' }}>({showLlmSettings ? '▲ Đóng' : '▼ Cấu hình'})</span>
          </button>

          <Link
            href="/admin/inquiries"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              background: 'rgba(179, 54, 31, 0.08)',
              color: 'var(--red)',
              borderRadius: 30,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 13,
              border: '1px solid rgba(179, 54, 31, 0.25)',
            }}
          >
            <span>📥 Ngân Hàng Câu Hỏi Khách Hàng</span>
          </Link>
        </div>
      </div>

      {/* Global LLM Provider Configuration Drawer */}
      {showLlmSettings && (
        <form
          onSubmit={handleSaveLlmConfig}
          style={{
            background: 'linear-gradient(135deg, rgba(29, 23, 41, 0.04) 0%, rgba(212, 160, 23, 0.05) 100%)',
            border: '1px solid var(--gold)',
            borderRadius: 14,
            padding: 20,
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ fontSize: 15, color: 'var(--ink)' }}>Cấu Hình Cổng Kết Nối LLM (Gemini / OpenAI / DeepSeek / Offline)</strong>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                Động cơ đang hoạt động: <strong style={{ color: providerColor }}>{providerLabel}</strong>
              </div>
            </div>
            {llmConfig.hasApiKey && (
              <span className="pill ok" style={{ fontSize: 11 }}>
                API Key: {llmConfig.maskedApiKey}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Nhà cung cấp LLM:</label>
              <select
                value={llmConfig.provider}
                onChange={(e) => {
                  const p = e.target.value as any;
                  let defModel = 'offline-natural-synthesis';
                  if (p === 'gemini') defModel = 'gemini-2.0-flash';
                  if (p === 'openai') defModel = 'gpt-4o-mini';
                  if (p === 'deepseek') defModel = 'deepseek-chat';
                  setLlmConfig({ ...llmConfig, provider: p, modelName: defModel });
                }}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)', background: 'var(--card)' }}
              >
                <option value="gemini">Google Gemini API (Gemini 2.0 / 1.5 Flash - Khuyến nghị)</option>
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="deepseek">DeepSeek (DeepSeek Chat V3)</option>
                <option value="offline">Offline Natural Synthesis (Đàm đạo tự nhiên nội bộ không cần Key)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Tên Model / Model ID:</label>
              <input
                type="text"
                value={llmConfig.modelName}
                onChange={(e) => setLlmConfig({ ...llmConfig, modelName: e.target.value })}
                placeholder="VD: gemini-2.0-flash, gemini-1.5-flash..."
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)', background: 'var(--card)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>API Key (Bảo mật):</label>
              <input
                type="password"
                value={llmConfig.apiKeyInput || ''}
                onChange={(e) => setLlmConfig({ ...llmConfig, apiKeyInput: e.target.value })}
                placeholder={llmConfig.hasApiKey ? 'Nhập key mới nếu muốn thay đổi...' : 'Dán GEMINI_API_KEY hoặc OPENAI_API_KEY...'}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)', background: 'var(--card)' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                Độ Sáng Tạo (Temperature: {llmConfig.temperature}):
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={llmConfig.temperature}
                onChange={(e) => setLlmConfig({ ...llmConfig, temperature: parseFloat(e.target.value) })}
                style={{ width: '100%', marginTop: 8 }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="submit"
              style={{
                padding: '8px 20px',
                background: 'var(--red)',
                color: '#fff',
                border: 0,
                borderRadius: 6,
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Lưu Cấu Hình Cổng LLM
            </button>
            {llmStatusMsg && (
              <span style={{ fontSize: 12, color: llmStatusMsg.includes('✓') ? '#10b981' : 'var(--red)', fontWeight: 600 }}>
                {llmStatusMsg}
              </span>
            )}
          </div>
        </form>
      )}

      {/* Agent Selector Cards */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Danh Sách Bát Đại Danh Sư &amp; Khách Hàng Persona:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {agents.map((ag) => {
            const isSelected = ag.slug === selectedAgentSlug;
            const isCustomer = ag.role === 'CUSTOMER_SIMULATION' || ag.slug === 'khach-hang-minh';

            return (
              <div
                key={ag.slug}
                onClick={() => {
                  setSelectedAgentSlug(ag.slug);
                  setTestMessages([{ role: 'assistant', content: ag.welcomeMessage }]);
                }}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: isSelected ? '2px solid var(--red)' : '1px solid var(--line)',
                  background: isSelected ? 'rgba(179, 54, 31, 0.05)' : 'var(--card)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 10,
                    background: isCustomer ? '#1e293b' : '#1d1729',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--gold)',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ag.avatarUrl || '/icons/icon.svg'}
                    alt={ag.name}
                    style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <strong style={{ fontSize: 14, color: 'var(--ink)' }}>{ag.name}</strong>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ag.title}
                  </div>
                  <div style={{ fontSize: 10, color: isSelected ? 'var(--red)' : 'var(--muted)', marginTop: 4, fontWeight: isSelected ? 700 : 400 }}>
                    {isSelected ? '● Đang chọn huấn luyện' : 'Nhấp để chọn'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--line)', marginBottom: 20, overflowX: 'auto' }}>
        {[
          { key: 'config', label: `⚙️ Cấu Hình Nhân Cách (${currentAgent.name})` },
          { key: 'fewshot', label: `💬 Mẫu Huấn Luyện Few-Shot (${fewShotDialogues.filter((f) => f.agentSlug === currentAgent.slug).length} mẫu)` },
          { key: 'knowledge', label: `📚 Kho Tri Thức RAG (${knowledgeDocs.length} tài liệu)` },
          { key: 'playground', label: '🧪 Test Playground (Thử Nghiệm Chat)' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key as any)}
            style={{
              padding: '10px 16px',
              border: 0,
              background: 'transparent',
              borderBottom: activeTab === t.key ? '3px solid var(--red)' : '3px solid transparent',
              color: activeTab === t.key ? 'var(--red)' : 'var(--ink)',
              fontWeight: activeTab === t.key ? 700 : 500,
              cursor: 'pointer',
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Config */}
      {activeTab === 'config' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--card)', padding: 24, borderRadius: 12, border: '1px solid var(--line)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Tên Danh Sư / Agent:</label>
                <input
                  type="text"
                  value={currentAgent.name}
                  onChange={(e) => handleUpdateCurrentAgent('name', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Danh Xưng / Pháp Hiệu / Chuyên Khoa:</label>
                <input
                  type="text"
                  value={currentAgent.title}
                  onChange={(e) => handleUpdateCurrentAgent('title', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Độ Sáng Tạo Riêng (Temperature):</label>
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="1"
                  value={currentAgent.temperature || 0.65}
                  onChange={(e) => handleUpdateCurrentAgent('temperature', parseFloat(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                />
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Lời Chào Mở Đầu Khi Đương Số Thỉnh Giáo:</label>
              <input
                type="text"
                value={currentAgent.welcomeMessage || ''}
                onChange={(e) => handleUpdateCurrentAgent('welcomeMessage', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label style={{ fontSize: 13, fontWeight: 700 }}>System Instruction (Định hình giọng điệu, xưng hô, cấm header máy móc):</label>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>Đã chuẩn hóa không dùng header cứng nhắc</span>
              </div>
              <textarea
                value={currentAgent.systemPrompt || ''}
                onChange={(e) => handleUpdateCurrentAgent('systemPrompt', e.target.value)}
                rows={12}
                style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--line)', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.5 }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
              <button
                type="button"
                onClick={handleSaveAgent}
                style={{ padding: '10px 24px', background: 'var(--red)', color: '#fff', border: 0, borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
              >
                Lưu Cấu Hình Agent Này
              </button>
              {agentSaveStatus && (
                <span style={{ fontSize: 12, color: agentSaveStatus.includes('✓') ? '#10b981' : 'var(--red)', fontWeight: 600 }}>
                  {agentSaveStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Few-Shot Dialogues Training */}
      {activeTab === 'fewshot' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: 'var(--card)', padding: 20, borderRadius: 12, border: '1px solid var(--line)' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>
              Bộ Mẫu Huấn Luyện Ngôn Ngữ Tự Nhiên (Few-Shot Prompting) Cho {currentAgent.name}
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--muted)' }}>
              Các mẫu đối thoại vàng giúp LLM học phong thái nói chuyện như người thật: lắng nghe thấu cảm, ẩn dụ dân gian và đưa lời khuyên hành động thực tiễn.
            </p>

            {/* List existing few-shot dialogues */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              {fewShotDialogues
                .filter((d) => d.agentSlug === currentAgent.slug)
                .map((d, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg)',
                      border: '1px solid var(--line)',
                      borderRadius: 10,
                      padding: 16,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span className="pill ok" style={{ fontSize: 10 }}>MẪU ĐỐI THOẠI VÀNG #{idx + 1}</span>
                      <strong style={{ fontSize: 13, color: 'var(--ink)' }}>{currentAgent.name}</strong>
                    </div>
                    <div style={{ background: 'rgba(179, 54, 31, 0.05)', padding: 10, borderRadius: 6, marginBottom: 10, fontSize: 13 }}>
                      <strong>Khách hàng hỏi:</strong> &ldquo;{d.userQuestion}&rdquo;
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--ink)' }}>
                      <strong>Thầy luận giải mẫu:</strong><br />
                      {d.goldenAnswer}
                    </div>
                  </div>
                ))}

              {fewShotDialogues.filter((d) => d.agentSlug === currentAgent.slug).length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                  Chưa có mẫu đối thoại riêng nào được thêm cho Danh Sư này. Hãy thêm mẫu đối thoại vàng bên dưới để huấn luyện!
                </div>
              )}
            </div>

            {/* Add New Few Shot Form */}
            <form onSubmit={handleAddFewShot} style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h4 style={{ margin: 0, fontSize: 14 }}>Thêm Mẫu Đối Thoại Huấn Luyện Mới:</h4>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Câu hỏi của Khách Hàng (Tình huống giả định):</label>
                <input
                  type="text"
                  placeholder="VD: Thầy ơi, dạo này con đầu tư chứng khoán lỗ quá, có nên cắt lỗ không?"
                  value={newFewShotQuestion}
                  onChange={(e) => setNewFewShotQuestion(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                  Lời Đáp Mẫu Chuẩn Phong Thái Của Thầy (Ấm áp, tự nhiên, không header máy móc):
                </label>
                <textarea
                  rows={6}
                  placeholder="Viết lời đáp theo đúng phong cách xưng hô và chuyên môn của Thầy..."
                  value={newFewShotAnswer}
                  onChange={(e) => setNewFewShotAnswer(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', background: 'var(--red)', color: '#fff', border: 0, borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}
                >
                  Nạp Vào Bộ Huấn Luyện Few-Shot
                </button>
                {fewShotStatus && (
                  <span style={{ fontSize: 12, color: fewShotStatus.includes('✓') ? '#10b981' : 'var(--red)', fontWeight: 600 }}>
                    {fewShotStatus}
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Knowledge Base */}
      {activeTab === 'knowledge' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Category Filter Pills & Search */}
          <div
            style={{
              background: 'var(--card)',
              padding: 16,
              borderRadius: 12,
              border: '1px solid var(--line)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[
                  { key: 'ALL', label: `Tất cả (${knowledgeDocs.length})` },
                  { key: 'TU_VI', label: `Tử Vi Đẩu Số (${knowledgeDocs.filter((d) => d.category === 'TU_VI').length})` },
                  { key: 'KINH_DICH', label: `Kinh Dịch (${knowledgeDocs.filter((d) => d.category === 'KINH_DICH').length})` },
                  { key: 'TU_TRU', label: `Tứ Trụ Bát Tự (${knowledgeDocs.filter((d) => d.category === 'TU_TRU').length})` },
                  { key: 'PHONG_THUY', label: `Phong Thủy (${knowledgeDocs.filter((d) => d.category === 'PHONG_THUY').length})` },
                  { key: 'TAM_LINH', label: `Tâm Linh & Nhân Quả (${knowledgeDocs.filter((d) => d.category === 'TAM_LINH').length})` },
                  { key: 'XEM_NGAY', label: `Lịch & Trạch Cát (${knowledgeDocs.filter((d) => d.category === 'XEM_NGAY').length})` },
                  { key: 'NHAN_TUONG', label: `Nhân Tướng Học (${knowledgeDocs.filter((d) => d.category === 'NHAN_TUONG').length})` },
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setKnowledgeCategoryFilter(c.key)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      border: knowledgeCategoryFilter === c.key ? '1px solid var(--red)' : '1px solid var(--line)',
                      background: knowledgeCategoryFilter === c.key ? 'var(--red)' : 'var(--bg)',
                      color: knowledgeCategoryFilter === c.key ? '#fff' : 'var(--ink)',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Tìm kiếm tài liệu theo từ khóa..."
                value={knowledgeSearchQuery}
                onChange={(e) => setKnowledgeSearchQuery(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 20,
                  border: '1px solid var(--line)',
                  fontSize: 12,
                  minWidth: 260,
                  background: 'var(--bg)',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {/* Add Doc Form */}
            <div style={{ background: 'var(--card)', padding: 20, borderRadius: 12, border: '1px solid var(--line)', height: 'fit-content' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 16 }}>Nạp Thêm Tài Liệu Mới Vào Kho Tri Thức</h3>
              <form onSubmit={handleAddKnowledge} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Tiêu đề tài liệu:</label>
                  <input
                    type="text"
                    placeholder="VD: Ý nghĩa sao Vũ Khúc hãm địa và cách hóa giải..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Chuyên mục:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                  >
                    <option value="TU_VI">Tử Vi Đẩu Số (Chính/Phụ tinh, Cung vị)</option>
                    <option value="KINH_DICH">Kinh Dịch (64 Quẻ, Hào từ, Biến dịch)</option>
                    <option value="TU_TRU">Tứ Trụ Bát Tự (Thần sát, Dụng thần)</option>
                    <option value="PHONG_THUY">Phong Thủy &amp; Bát Trạch</option>
                    <option value="TAM_LINH">Tâm Linh &amp; Nhân Quả (Đức năng thắng số)</option>
                    <option value="XEM_NGAY">Lịch Vạn Niên &amp; Trạch Cát (12 Trực, 28 Tú)</option>
                    <option value="NHAN_TUONG">Nhân Tướng Học (12 Cung, Ngũ Quan)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Nội dung chi tiết (Markdown / Văn bản):</label>
                  <textarea
                    rows={8}
                    placeholder="Dán nội dung sách vở, khẩu quyết, phú đoán..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--line)' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ padding: '10px 16px', background: 'var(--red)', color: '#fff', border: 0, borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
                >
                  Nạp Vào Vector Database
                </button>

                {uploadStatus && (
                  <div style={{ fontSize: 12, color: uploadStatus.includes('✓') ? '#2e7d32' : 'var(--red)', fontWeight: 600 }}>
                    {uploadStatus}
                  </div>
                )}
              </form>
            </div>

            {/* Docs List */}
            <div style={{ background: 'var(--card)', padding: 20, borderRadius: 12, border: '1px solid var(--line)', maxHeight: 680, overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>
                  Tài Liệu Đã Nạp ({knowledgeDocs.filter((d) => (knowledgeCategoryFilter === 'ALL' || d.category === knowledgeCategoryFilter) && (!knowledgeSearchQuery || d.title?.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()) || d.rawContent?.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()))).length} / {knowledgeDocs.length})
                </h3>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>pgvector 1536-dim Indexed</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {knowledgeDocs
                  .filter((d) => {
                    const matchCat = knowledgeCategoryFilter === 'ALL' || d.category === knowledgeCategoryFilter;
                    const matchQ =
                      !knowledgeSearchQuery ||
                      d.title?.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()) ||
                      d.rawContent?.toLowerCase().includes(knowledgeSearchQuery.toLowerCase());
                    return matchCat && matchQ;
                  })
                  .map((doc, idx) => {
                    const isExpanded = expandedDocId === (doc.id || idx.toString());

                    return (
                      <div
                        key={doc.id || idx}
                        style={{
                          padding: 14,
                          borderRadius: 8,
                          border: isExpanded ? '1px solid var(--gold)' : '1px solid var(--line)',
                          background: 'var(--bg)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onClick={() => setExpandedDocId(isExpanded ? null : (doc.id || idx.toString()))}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                          <strong style={{ fontSize: 13, color: 'var(--red)' }}>{doc.title}</strong>
                          <span className="pill ok" style={{ fontSize: 10, flexShrink: 0 }}>
                            {doc.category}
                          </span>
                        </div>

                        {/* Expanded Content Preview */}
                        {isExpanded ? (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--line)' }}>
                            <div style={{ fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--ink)' }}>
                              {doc.rawContent}
                            </div>
                            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
                              <span>1536-dim Vector Embeddings</span>
                              <span style={{ color: 'var(--red)', fontWeight: 600 }}>Thu gọn ▲</span>
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                              {doc.rawContent?.slice(0, 75)}...
                            </span>
                            <span style={{ color: 'var(--gold)', fontWeight: 600, flexShrink: 0 }}>Đọc thêm ▼</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Playground */}
      {activeTab === 'playground' && (
        <div style={{ background: 'var(--card)', borderRadius: 12, border: '1px solid var(--line)', maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 580 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: providerColor }}></span>
              <strong style={{ fontSize: 14 }}>Thử Nghiệm Đối Thoại Trực Tiếp: &ldquo;{currentAgent.name}&rdquo;</strong>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>({providerLabel})</span>
            </div>
            <button
              type="button"
              onClick={() => setTestMessages([{ role: 'assistant', content: currentAgent.welcomeMessage }])}
              style={{ fontSize: 11, padding: '4px 10px', background: 'transparent', border: '1px solid var(--line)', borderRadius: 4, cursor: 'pointer' }}
            >
              Làm mới hộp chat
            </button>
          </div>

          <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--bg)' }}>
            {testMessages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  fontSize: 13,
                  lineHeight: 1.6,
                  background: m.role === 'user' ? 'var(--red)' : 'var(--card)',
                  color: m.role === 'user' ? '#fff' : 'var(--ink)',
                  border: m.role === 'user' ? 'none' : '1px solid var(--line)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.content}
              </div>
            ))}
            {isTesting && testMessages[testMessages.length - 1]?.content === '' && (
              <div style={{ alignSelf: 'flex-start', fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="spin" style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid var(--muted)', borderTopColor: 'transparent', borderRadius: '50%' }}></span>
                <span>{currentAgent.name} đang lắng nghe và suy ngẫm quẻ số...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleTestChat} style={{ padding: 14, borderTop: '1px solid var(--line)', display: 'flex', gap: 10 }}>
            <input
              type="text"
              placeholder={`Hỏi ${currentAgent.name} bất kỳ câu hỏi nào về tình duyên, tiền tài, vận hạn...`}
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              disabled={isTesting}
              style={{ flex: 1, padding: '10px 14px', borderRadius: 6, border: '1px solid var(--line)', fontSize: 13 }}
            />
            <button
              type="submit"
              disabled={isTesting}
              style={{ padding: '10px 20px', background: 'var(--red)', color: '#fff', border: 0, borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
            >
              {isTesting ? 'Đang gửi...' : 'Gửi Thử'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
