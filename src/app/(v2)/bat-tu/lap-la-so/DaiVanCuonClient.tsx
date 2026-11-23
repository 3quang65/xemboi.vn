'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export function DaiVanCuonClient({
  children,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || el.scrollWidth <= el.clientWidth + 2) return;

    const active = el.querySelector<HTMLElement>('[data-dang-chay="true"]');
    if (!active) return;

    const elRect = el.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const targetLeft = Math.max(
      0,
      el.scrollLeft +
        (activeRect.left - elRect.left) -
        (el.clientWidth - activeRect.width) / 2,
    );

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({
      left: targetLeft,
      behavior: reduce ? 'auto' : 'smooth',
    });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
