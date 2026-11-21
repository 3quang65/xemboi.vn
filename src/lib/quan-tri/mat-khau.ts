// Băm mật khẩu tài khoản quản trị (docs/v2/17 mục 5.1).
// Dùng argon2id có sẵn trong Node ≥ 24.7. Máy chạy Node cũ hơn thì rơi về scrypt; tiền tố cho biết thuật toán.
import crypto from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(crypto.scrypt) as (
  pw: crypto.BinaryLike, salt: crypto.BinaryLike, keylen: number, opt: crypto.ScryptOptions,
) => Promise<Buffer>;

// Tham số theo khuyến nghị OWASP cho argon2id: 19 MiB, 2 lượt, 1 luồng.
const A2 = { memory: 19456, passes: 2, parallelism: 1, tagLength: 32 } as const;
const SC = { N: 1 << 15, r: 8, p: 1, maxmem: 64 * 1024 * 1024 } as const;

type Argon2Fn = (
  algo: 'argon2id',
  opt: { message: Buffer | string; nonce: Buffer; memory: number; passes: number; parallelism: number; tagLength: number },
  cb: (err: Error | null, key: Buffer) => void,
) => void;

function layArgon2(): Argon2Fn | null {
  const f = (crypto as unknown as { argon2?: Argon2Fn }).argon2;
  return typeof f === 'function' ? f : null;
}

function argon2(message: string, nonce: Buffer, p: { memory: number; passes: number; parallelism: number; tagLength: number }): Promise<Buffer> {
  const f = layArgon2();
  if (!f) throw new Error('Node này không có argon2id');
  return new Promise((res, rej) => f('argon2id', { message, nonce, ...p }, (e, k) => (e ? rej(e) : res(k))));
}

const b64 = (b: Buffer) => b.toString('base64url');
const tuB64 = (s: string) => Buffer.from(s, 'base64url');

export async function bamMatKhau(matKhau: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  if (layArgon2()) {
    const k = await argon2(matKhau, salt, A2);
    return `$argon2id$v=19$m=${A2.memory},t=${A2.passes},p=${A2.parallelism}$${b64(salt)}$${b64(k)}`;
  }
  const k = await scryptAsync(matKhau, salt, 32, SC);
  return `$scrypt$N=${SC.N},r=${SC.r},p=${SC.p}$${b64(salt)}$${b64(k)}`;
}

export async function kiemMatKhau(matKhau: string, ban: string): Promise<boolean> {
  const phan = ban.split('$'); // ['', 'argon2id', 'v=19', 'm=..,t=..,p=..', salt, hash]
  try {
    if (phan[1] === 'argon2id') {
      const ts = Object.fromEntries(phan[3].split(',').map((x) => x.split('='))) as Record<string, string>;
      const goc = tuB64(phan[5]);
      const k = await argon2(matKhau, tuB64(phan[4]), {
        memory: Number(ts.m), passes: Number(ts.t), parallelism: Number(ts.p), tagLength: goc.length,
      });
      return k.length === goc.length && crypto.timingSafeEqual(k, goc);
    }
    if (phan[1] === 'scrypt') {
      const ts = Object.fromEntries(phan[2].split(',').map((x) => x.split('='))) as Record<string, string>;
      const goc = tuB64(phan[4]);
      const k = await scryptAsync(matKhau, tuB64(phan[3]), goc.length, {
        N: Number(ts.N), r: Number(ts.r), p: Number(ts.p), maxmem: SC.maxmem,
      });
      return crypto.timingSafeEqual(k, goc);
    }
  } catch {
    return false;
  }
  return false;
}

/** Mật khẩu tối thiểu 12 ký tự, không toàn chữ số. */
export function kiemDoManhMatKhau(matKhau: string): string | null {
  if (matKhau.length < 12) return 'Mật khẩu cần ít nhất 12 ký tự.';
  if (/^\d+$/.test(matKhau)) return 'Mật khẩu không được chỉ có chữ số.';
  return null;
}
