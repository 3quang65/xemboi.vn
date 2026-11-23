// Thập thần (trang /bat-tu/thap-than/{than}, Lệnh 49).
// Phép tính dùng thapThan() của bat-tu.ts (đang chạy ở trang lập lá số). Câu trích: Tam mệnh thông hội (Kanripo KR3g0042),
// chủ yếu quyển 5 "Luận cổ nhân lập Ấn Thực Quan Tài danh nghĩa" và các thiên luận từng thần ngay sau đó.
// Nguyên văn chỉ lưu để đối chiếu, không hiển thị. Không viết luận tính cách hay "tốt/xấu" ngoài câu sách.
import { THIEN_CAN } from '@/lib/tuvi-v2/am-lich';
import { HANH_CAN, THAP_THAN, thapThan, type ThapThan } from './bat-tu';
import { GIAI_NGHIA_BAT_TU, type TrichDoan } from './bat-tu-truc-quan';
import { slugViet, type Hanh } from './can-chi';

const tm = (doanId: number, viTriViet: string, nguyenVan: string, dich: string): TrichDoan =>
  ({ nguon: 'tamMenh', doanId, viTri: '', nguyenVan, viTriViet, dich });

const Q5 = 'Quyển 5 · Luận cổ nhân lập Ấn, Thực, Quan, Tài danh nghĩa';

export const TRICH_THAP_THAN = {
  goc: tm(4608, Q5, '今指甲乙為例以日干論甲乙在五行屬木甲陽而乙隂也如人命得甲乙生謂之日主屬我生我者壬癸水我生者丙丁火尅我者庚辛金我尅者戊巳土而十干盡之矣',
    'Nay lấy Giáp Ất làm ví dụ, luận theo can ngày. Giáp Ất thuộc Mộc, Giáp là dương, Ất là âm. Người sinh ngày Giáp Ất thì gọi là nhật chủ, thuộc về ta. Cái sinh ta là Nhâm Quý Thủy, cái ta sinh là Bính Đinh Hỏa, cái khắc ta là Canh Tân Kim, cái ta khắc là Mậu Kỷ Thổ; mười can gồm đủ trong đó.'),
  tenAn: tm(4608, Q5, '生我者有父母之義故立名印綬印䕃也綬受也', 'Cái sinh ra ta có nghĩa như cha mẹ, nên đặt tên là Ấn thụ: ấn là che chở, thụ là nhận lấy.'),
  tenThuc: tm(4608, Q5, '我生者有子孫之義故立名食神', 'Cái ta sinh ra có nghĩa như con cháu, nên đặt tên là Thực thần.'),
  tenQuan: tm(4608, Q5, '尅我者我受制於人之義故立名官煞', 'Cái khắc ta mang nghĩa ta chịu người khác chế ngự, nên đặt tên là Quan sát.'),
  tenTai: tm(4609, Q5, '我尅者是人受制於我之義故立名妻財', 'Cái ta khắc mang nghĩa người khác chịu ta chế ngự, nên đặt tên là Thê tài.'),
  chinhThien: tm(4609, Q5, '甲見辛為正官見庚為偏官…甲見己為正妻見戊為偏妻',
    'Giáp gặp Tân là Chính quan, gặp Canh là Thiên quan. Giáp gặp Kỷ là vợ chính (Chính tài), gặp Mậu là vợ lẽ (Thiên tài).'),
  kieng: tm(4609, Q5, '官怕傷被傷則禍財怕刼被刼則分印怕財貪財則壊食怕梟逢梟則奪',
    'Quan sợ Thương, bị thương thì có họa; Tài sợ Kiếp, bị kiếp thì bị chia; Ấn sợ Tài, tham tài thì hỏng; Thực sợ Kiêu, gặp Kiêu thì bị đoạt.'),
  tenGoi: tm(4611, Q5, '其名為印為梟為食為傷為官為煞為財為刼', 'Tên gọi của chúng là Ấn, là Kiêu, là Thực, là Thương, là Quan, là Sát, là Tài, là Kiếp.'),
  chinhQuan: tm(4613, 'Quyển 5 · Luận Chính quan', '正官者乃甲見辛乙見庚之例隂陽配合相制有用成其道也',
    'Chính quan là như Giáp gặp Tân, Ất gặp Canh: âm dương phối hợp, chế nhau mà thành dụng.'),
  thienQuan: tm(4631, 'Quyển 5 · Luận Thiên quan', '偏官者乃甲見庚乙見辛之例猶二男不同處二女不同居不成配偶故謂之偏以其隔七位而相克戰故謂之七煞…故有制謂之偏官無制謂之七煞',
    'Thiên quan là như Giáp gặp Canh, Ất gặp Tân; như hai người nam không ở chung, hai người nữ không ở chung, không thành đôi, nên gọi là "thiên" (lệch). Vì cách nhau bảy vị mà khắc nhau, nên gọi là Thất sát. Có chế thì gọi là Thiên quan, không có chế thì gọi là Thất sát.'),
  chinhTai: tm(4661, 'Quyển 5 · Luận Chính tài', '正財者乃甲見巳乙見戊之例受我克制為我之妻',
    'Chính tài là như Giáp gặp Kỷ, Ất gặp Mậu: chịu ta khắc chế, là vợ của ta.'),
  thienTai: tm(4672, 'Quyển 5 · Luận Thiên tài', '何謂偏財乃甲見戊乙見巳之例非妻所帶乃衆人之財也',
    'Thế nào là Thiên tài? Như Giáp gặp Mậu, Ất gặp Kỷ: không phải của vợ mang theo, mà là của chung mọi người.'),
  an: tm(4681, 'Quyển 5 · Luận Ấn thụ', '印綬者乃五行生我之名…乃我氣之源為生氣為父母',
    'Ấn thụ là tên gọi hành sinh ra ta; là nguồn khí của ta, là sinh khí, là cha mẹ.'),
  chinhThienAn: tm(4682, 'Quyển 5 · Luận Ấn thụ', '如甲日遇子月為正印亥月為偏印',
    'Như ngày Giáp gặp tháng Tý là Chính ấn, gặp tháng Hợi là Thiên ấn.'),
  kieu: tm(4698, 'Quyển 5 · Luận Đảo thực', '倒食者名為偏印號曰梟神', 'Đảo thực tức là Thiên ấn, còn gọi là Kiêu thần.'),
  kieuKhongVoi: tm(4698, 'Quyển 5 · Luận Đảo thực', '切不可一見倒食便以㓙論', 'Tuyệt đối không được hễ thấy Đảo thực là luận xấu.'),
  thuongQuan: tm(4709, 'Quyển 5 · Luận Thương quan', '傷官者我生彼之謂乃甲見丁乙見丙之類甲用辛為官丁火乗旺盗我之氣尅制辛金使不輔甲為貴故名傷官',
    'Thương quan là cái ta sinh ra, như Giáp gặp Đinh, Ất gặp Bính. Giáp dùng Tân làm quan; Đinh Hỏa gặp lúc vượng thì rút khí của ta, khắc chế Tân Kim, không cho giúp Giáp thành quý, nên gọi là Thương quan (làm tổn quan).'),
  thucThan: tm(4720, 'Quyển 5 · Luận Thực thần', '食神者日干所生順數第三位乃甲食丙乙食丁之例',
    'Thực thần là cái can ngày sinh ra, đếm thuận tới vị thứ ba, như Giáp thực Bính, Ất thực Đinh.'),
  tyKiep: tm(4745, 'Quyển 5', '陽見陽陰見陰為比與陽見陰陰見陽為刼為敗',
    'Dương gặp dương, âm gặp âm là Tỷ; dương gặp âm, âm gặp dương là Kiếp, là Bại.'),
  kiepBai: tm(5537, 'Quyển 11 · Lục thần thiên', '五陽干見五陰｜為刼財五陰干見五陽為敗財',
    'Năm can dương gặp năm can âm là Kiếp tài; năm can âm gặp năm can dương là Bại tài.'),
  lucThan: tm(5051, 'Quyển 7 · Luận lục thân', '尅我者為官為子我尅者為財為妻比和者為兄弟娣妹',
    'Cái khắc ta là Quan, là con; cái ta khắc là Tài, là vợ; cái ngang hòa với ta là anh em, chị em.'),
} as const satisfies Record<string, TrichDoan>;
export type MaTrichThapThan = keyof typeof TRICH_THAP_THAN;

export type QuanHeVoiNhatChu = 'cùng hành' | 'ta sinh' | 'ta khắc' | 'khắc ta' | 'sinh ta';
export const NHOM_THAP_THAN: { ten: string; quanHe: QuanHeVoiNhatChu; than: [ThapThan, ThapThan] }[] = [
  { ten: 'Tỷ kiếp', quanHe: 'cùng hành', than: ['Tỷ kiên', 'Kiếp tài'] },
  { ten: 'Thực thương', quanHe: 'ta sinh', than: ['Thực thần', 'Thương quan'] },
  { ten: 'Tài', quanHe: 'ta khắc', than: ['Thiên tài', 'Chính tài'] },
  { ten: 'Quan sát', quanHe: 'khắc ta', than: ['Thất sát', 'Chính quan'] },
  { ten: 'Ấn', quanHe: 'sinh ta', than: ['Thiên ấn', 'Chính ấn'] },
];

/** Tên khác chỉ ghi khi Tam mệnh thông hội có nêu. */
const TEN_KHAC: Partial<Record<ThapThan, string[]>> = {
  'Thất sát': ['Thiên quan'],
  'Thiên ấn': ['Kiêu thần', 'Đảo thực'],
  'Chính ấn': ['Ấn thụ'],
  'Kiếp tài': ['Bại tài (can âm gặp can dương)'],
};

const TRICH_CUA: Record<ThapThan, MaTrichThapThan[]> = {
  'Tỷ kiên': ['tyKiep', 'lucThan'],
  'Kiếp tài': ['tyKiep', 'kiepBai', 'kieng'],
  'Thực thần': ['tenThuc', 'thucThan', 'kieng'],
  'Thương quan': ['tenThuc', 'thuongQuan', 'kieng'],
  'Thiên tài': ['tenTai', 'thienTai', 'chinhThien'],
  'Chính tài': ['tenTai', 'chinhTai', 'chinhThien'],
  'Thất sát': ['tenQuan', 'thienQuan'],
  'Chính quan': ['tenQuan', 'chinhQuan', 'chinhThien', 'kieng'],
  'Thiên ấn': ['tenAn', 'kieu', 'kieuKhongVoi', 'chinhThienAn'],
  'Chính ấn': ['tenAn', 'an', 'chinhThienAn', 'kieng'],
};

export type ThapThanChiTiet = {
  ten: ThapThan;
  slug: string;
  duongDan: string;
  thuTu: number;
  tenKhac: string[];
  nhom: string;
  quanHe: QuanHeVoiNhatChu;
  cungAmDuong: boolean;
  dinhNghia: string;
  trich: MaTrichThapThan[];
  /** 10 dòng: với mỗi nhật chủ, can nào là thần này. */
  bang: { nhatChu: string; hanhNhatChu: Hanh; can: string; hanhCan: Hanh }[];
};

export const THAP_THAN_CHI_TIET: ThapThanChiTiet[] = THAP_THAN.map((ten, i) => {
  const nhom = NHOM_THAP_THAN.find((n) => n.than.includes(ten))!;
  const bang = THIEN_CAN.map((nhatChu, a) => {
    const b = THIEN_CAN.findIndex((_, x) => thapThan(a, x) === ten);
    return { nhatChu, hanhNhatChu: HANH_CAN[a], can: THIEN_CAN[b], hanhCan: HANH_CAN[b] };
  });
  const slug = slugViet(ten);
  return {
    ten, slug, duongDan: `/bat-tu/thap-than/${slug}`, thuTu: i + 1, tenKhac: TEN_KHAC[ten] ?? [], nhom: nhom.ten, quanHe: nhom.quanHe,
    cungAmDuong: nhom.than[0] === ten, dinhNghia: GIAI_NGHIA_BAT_TU[ten], trich: TRICH_CUA[ten], bang,
  };
});

export const thapThanTheoSlug = (slug: string) => THAP_THAN_CHI_TIET.find((t) => t.slug === slug);

/** Bảng 10 × 10: hàng là nhật chủ, cột là can gặp. */
export const bangThapThan = (): { can: string[]; o: ThapThan[][] } =>
  ({ can: [...THIEN_CAN], o: THIEN_CAN.map((_, a) => THIEN_CAN.map((__, b) => thapThan(a, b))) });

export const GHI_CHU_THAP_THAN =
  'Thập thần chỉ là tên gọi quan hệ giữa một can với can ngày (nhật chủ). Cùng một thần, sách luận tốt hay xấu còn tùy nhật chủ mạnh yếu, có chế hay không, đứng ở trụ nào; không đọc riêng một thần để kết luận.';
