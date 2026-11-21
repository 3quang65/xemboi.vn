'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCouncilAudioEngine } from '@/hooks/useCouncilAudioEngine';
import PhongHoiChan, { type TabHoiThoai } from './PhongHoiChan';
import GiaLapToaDam from './GiaLapToaDam';

type Tab = TabHoiThoai | 'simulation';

const TABS: { key: Tab; label: string }[] = [
  { key: 'council', label: 'Phòng Hội Chẩn' },
  { key: 'live', label: 'Đang trực tuyến' },
  { key: 'takeover', label: 'Cần hỗ trợ' },
  { key: 'all', label: 'Tất cả hội thoại' },
  { key: 'simulation', label: 'Giả lập tọa đàm' },
];

export default function HoiThoaiClient({ tenQuanTri }: { tenQuanTri: string }) {
  const [activeTab, setActiveTab] = useState<Tab>('council');
  const [refreshSignal, setRefreshSignal] = useState<number>(0);
  const audioEngine = useCouncilAudioEngine();

  return (
    <>
      <div className="qt-dau-trang">
        <div>
          <h1>Hội thoại &amp; Hội chẩn</h1>
          <p className="qt-phu" style={{ marginBottom: 0 }}>
            Theo dõi phiên chat trực tuyến, triệu tập trợ lý vào phòng hội chẩn và tiếp quản trả lời trực tiếp với tư cách <b>{tenQuanTri}</b>.
          </p>
        </div>
        <div className="qt-dau-nut">
          {activeTab !== 'simulation' && (
            <button
              type="button"
              className="qt-nut phu"
              onClick={() => setRefreshSignal((n) => n + 1)}
            >
              Làm mới
            </button>
          )}
          <Link className="qt-nut phu" href="/quan-tri/ai/tro-ly">
            Trợ lý AI
          </Link>
        </div>
      </div>

      <div className="qt-tab-thanh" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            className="qt-tab"
            aria-selected={activeTab === t.key}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'simulation' ? (
        <GiaLapToaDam tenQuanTri={tenQuanTri} audioEngine={audioEngine} />
      ) : (
        <PhongHoiChan
          activeTab={activeTab}
          tenQuanTri={tenQuanTri}
          audioEngine={audioEngine}
          refreshSignal={refreshSignal}
        />
      )}
    </>
  );
}
