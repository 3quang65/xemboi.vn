// Cache luận giải: bộ nhớ + file trong .cache/luan-giai/ (đã nằm trong .gitignore).
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const bo = new Map<string, unknown>();
const dem = { trung: 0, truot: 0 };
const thuMuc = () => path.join(process.cwd(), '.cache', 'luan-giai');

export const bam = (s: string) => createHash('sha256').update(s).digest('hex');

export function doc<T>(khoa: string): T | undefined {
  if (bo.has(khoa)) { dem.trung++; return bo.get(khoa) as T; }
  try {
    const v = JSON.parse(fs.readFileSync(path.join(thuMuc(), `${khoa}.json`), 'utf8')) as T;
    bo.set(khoa, v); dem.trung++;
    return v;
  } catch {
    dem.truot++;
    return undefined;
  }
}

export function ghi(khoa: string, v: unknown): void {
  bo.set(khoa, v);
  try {
    fs.mkdirSync(thuMuc(), { recursive: true });
    fs.writeFileSync(path.join(thuMuc(), `${khoa}.json`), JSON.stringify(v));
  } catch {
    // Môi trường chỉ đọc: vẫn dùng cache bộ nhớ.
  }
}

export const xoaBoNho = () => bo.clear();
export const thongKe = () => ({ ...dem });
