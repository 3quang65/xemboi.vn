'use client';

import { useEffect, useCallback } from 'react';

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let vid = localStorage.getItem('xb_vid');
  if (!vid) {
    vid = 'xb_v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('xb_vid', vid);
  }
  document.cookie = `xb_vid=${vid}; path=/; max-age=31536000; SameSite=Lax`;
  return vid;
}

export function useTracker() {
  const trackEvent = useCallback(
    (eventType: string, metadata: Record<string, any> = {}) => {
      if (typeof window === 'undefined') return;
      const vid = getOrCreateVisitorId();
      const path = window.location.pathname;

      fetch('/api/tracking/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId: vid,
          eventType,
          path,
          metadata,
          referrer: document.referrer || '',
          userAgent: navigator.userAgent || '',
        }),
      }).catch(() => {});
    },
    []
  );

  useEffect(() => {
    const vid = getOrCreateVisitorId();
    trackEvent('PAGE_VIEW', { title: document.title });

    // Send heartbeat every 45s
    const timer = setInterval(() => {
      fetch('/api/tracking/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId: vid }),
      }).catch(() => {});
    }, 45000);

    return () => clearInterval(timer);
  }, [trackEvent]);

  return { trackEvent };
}

export default function TrackerComponent() {
  useTracker();
  return null;
}
