// Khai báo tối thiểu cho lunar-javascript 1.7.8 (thư viện không kèm kiểu). Chỉ những gì src/lib/trang/xem-ngay.ts dùng.
declare module 'lunar-javascript' {
  export const LunarUtil: {
    YI_JI: string[];
    SHEN_SHA: string[];
    getDayYi(monthGanZhi: string, dayGanZhi: string): string[];
    getDayJi(monthGanZhi: string, dayGanZhi: string): string[];
    getDayJiShen(monthZhiIndex: number, dayGanZhi: string): string[];
    getDayXiongSha(monthZhiIndex: number, dayGanZhi: string): string[];
  };
  const L: { LunarUtil: typeof LunarUtil };
  export default L;
}
