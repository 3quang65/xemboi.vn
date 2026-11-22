'use client';

import { xoaCauHoiChuan } from './hanh-dong';

export function NutXoaCauHoi({ id, quayVe }: { id: string; quayVe: string }) {
  return (
    <form
      action={xoaCauHoiChuan}
      onSubmit={(e) => {
        if (!window.confirm(`Xóa câu hỏi chuẩn ${id}?`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="quayVe" value={quayVe} />
      <button className="qt-nut phu qt-lk-nut-nho" type="submit" style={{ color: 'var(--bad)', borderColor: 'var(--bad)' }}>
        Xóa
      </button>
    </form>
  );
}
