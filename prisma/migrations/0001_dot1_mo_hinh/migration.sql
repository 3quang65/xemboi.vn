-- CreateEnum
CREATE TYPE "VaiTro" AS ENUM ('QUAN_TRI', 'BIEN_TAP', 'CHUYEN_GIA_DUYET', 'XEM_SO_LIEU');

-- CreateEnum
CREATE TYPE "YDinh" AS ENUM ('CONG_CU', 'TRA_CUU', 'SO_SANH', 'THUONG_HIEU', 'GIAO_DICH', 'CHUA_RO');

-- CreateEnum
CREATE TYPE "TrangThaiTuKhoa" AS ENUM ('MOI', 'GIU', 'NHIEU', 'LOAI_DINH_VI', 'THUONG_HIEU_DOI_THU', 'GO_SAI');

-- CreateEnum
CREATE TYPE "CachGan" AS ENUM ('QUY_TAC', 'TAY');

-- CreateEnum
CREATE TYPE "LoaiTrang" AS ENUM ('TRANG_CHU', 'HUB', 'CONG_CU', 'TU_DIEN', 'BAI', 'NGUON', 'PHUONG_PHAP', 'SAN_PHAM', 'LICH', 'THEO_NAM', 'TAC_GIA', 'KHAC', 'LANDING');

-- CreateEnum
CREATE TYPE "TrangThaiTrang" AS ENUM ('NHAP', 'XUAT_BAN', 'AN', 'DA_CHUYEN');

-- CreateEnum
CREATE TYPE "NguonLienKet" AS ENUM ('QUET', 'QUY_TAC', 'NGU_NGHIA', 'TAY');

-- CreateEnum
CREATE TYPE "TrangThaiLienKet" AS ENUM ('DANG_CO', 'DE_XUAT', 'DA_DUYET', 'BO_QUA');

-- CreateEnum
CREATE TYPE "TrangThaiCanhBao" AS ENUM ('MO', 'DA_XU_LY', 'BO_QUA');

-- CreateEnum
CREATE TYPE "LoaiNoiDung" AS ENUM ('MUC_TU_DIEN', 'BAI', 'CONG_CU', 'NGUON_SACH', 'PHUONG_PHAP', 'HUB');

-- CreateEnum
CREATE TYPE "TrangThaiNoiDung" AS ENUM ('NHAP', 'AI_SOAN', 'BIEN_TAP', 'CHO_CHUYEN_GIA', 'CAN_SUA', 'DA_DUYET', 'DA_XUAT_BAN', 'CAN_CAP_NHAT', 'LUU_TRU');

-- CreateEnum
CREATE TYPE "VaiTroDuyet" AS ENUM ('BIEN_TAP', 'CHUYEN_GIA', 'PHAP_LY');

-- CreateEnum
CREATE TYPE "KetLuanDuyet" AS ENUM ('DONG_Y', 'YEU_CAU_SUA', 'TU_CHOI');

-- CreateEnum
CREATE TYPE "KieuTrich" AS ENUM ('NGUYEN_VAN', 'DICH', 'TOM_Y', 'THAM_KHAO');

-- CreateEnum
CREATE TYPE "PhapLy" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "TrangThaiXinPhep" AS ENUM ('KHONG_CAN', 'CHUA_XIN', 'DA_GUI', 'DONG_Y', 'TU_CHOI', 'CAN_TRA_PHI');

-- CreateEnum
CREATE TYPE "PhamVi" AS ENUM ('CONG_KHAI', 'NOI_BO');

-- CreateEnum
CREATE TYPE "KieuTep" AS ENUM ('TXT', 'WIKITEXT', 'JSON', 'CSV', 'PDF_CHU', 'PDF_ANH', 'ANH', 'MP3', 'KHAC');

-- CreateEnum
CREATE TYPE "LoaiViecRag" AS ENUM ('PHAT_HIEN', 'TRICH', 'OCR', 'PHIEN_AM', 'LAM_SACH', 'CAT_DOAN', 'NHUNG', 'NAP_DB', 'TAO_CHI_MUC', 'NHUNG_TRANG_SEO');

-- CreateEnum
CREATE TYPE "NoiChay" AS ENUM ('VPS', 'MAY_TRAM');

-- CreateEnum
CREATE TYPE "TrangThaiViec" AS ENUM ('CHO', 'DANG_CHAY', 'XONG', 'LOI', 'HUY');

-- CreateEnum
CREATE TYPE "ChinhSachLoai" AS ENUM ('LOAI_VINH_VIEN', 'DE_DANH_LANDING', 'CHO_QUYET');

-- CreateTable
CREATE TABLE "TaiKhoan" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hoTen" TEXT NOT NULL,
    "matKhauBam" TEXT NOT NULL,
    "vaiTro" "VaiTro"[],
    "mangDuyet" TEXT[],
    "totpBiMat" TEXT,
    "dangHoatDong" BOOLEAN NOT NULL DEFAULT true,
    "lanDangNhapCuoi" TIMESTAMP(3),
    "soLanSai" INTEGER NOT NULL DEFAULT 0,
    "khoaDen" TIMESTAMP(3),
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capNhatLuc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaiKhoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhienDangNhap" (
    "id" TEXT NOT NULL,
    "maBam" TEXT NOT NULL,
    "taiKhoanId" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hetHan" TIMESTAMP(3) NOT NULL,
    "thuHoiLuc" TIMESTAMP(3),

    CONSTRAINT "PhienDangNhap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NhatKyThaoTac" (
    "id" BIGSERIAL NOT NULL,
    "taiKhoanId" TEXT,
    "hanhDong" TEXT NOT NULL,
    "doiTuong" TEXT NOT NULL,
    "doiTuongId" TEXT,
    "truoc" JSONB,
    "sau" JSONB,
    "ip" TEXT,
    "luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NhatKyThaoTac_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaiDat" (
    "khoa" TEXT NOT NULL,
    "giaTri" JSONB NOT NULL,
    "suaBoiId" TEXT,
    "suaLuc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaiDat_pkey" PRIMARY KEY ("khoa")
);

-- CreateTable
CREATE TABLE "SeoLoNhap" (
    "id" TEXT NOT NULL,
    "tenTep" TEXT NOT NULL,
    "loai" TEXT NOT NULL,
    "khoangThoiGian" TEXT,
    "soDong" INTEGER NOT NULL,
    "soMoi" INTEGER NOT NULL,
    "soCapNhat" INTEGER NOT NULL,
    "nhapBoiId" TEXT,
    "nhapLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeoLoNhap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoTuKhoa" (
    "id" TEXT NOT NULL,
    "chuoi" TEXT NOT NULL,
    "chuoiKhongDau" TEXT NOT NULL,
    "luongTim" INTEGER,
    "luongTheoThang" JSONB,
    "thangCaoNhat" INTEGER,
    "heSoMuaVu" DOUBLE PRECISION,
    "canhTranh" TEXT,
    "chiSoCanhTranh" INTEGER,
    "doKho" INTEGER,
    "doKhoNguon" TEXT,
    "nguon" TEXT[],
    "yDinh" "YDinh" NOT NULL DEFAULT 'CHUA_RO',
    "mang" TEXT[],
    "trangThai" "TrangThaiTuKhoa" NOT NULL DEFAULT 'MOI',
    "cumId" TEXT,
    "trangDichId" TEXT,
    "cachGan" "CachGan",
    "quyTacId" TEXT,
    "ghiChu" TEXT,
    "nhomLoaiId" TEXT,
    "laGoSai" BOOLEAN NOT NULL DEFAULT false,
    "tuGocId" TEXT,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capNhatLuc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoTuKhoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoCum" (
    "id" TEXT NOT NULL,
    "ma" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "tuKhoaChinh" TEXT,
    "yDinh" "YDinh" NOT NULL DEFAULT 'CHUA_RO',
    "congCuTrang" TEXT,
    "diem" DOUBLE PRECISION,
    "tang" TEXT,
    "muaVu" TEXT,
    "trangDichId" TEXT,

    CONSTRAINT "SeoCum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoQuyTacGan" (
    "id" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "bieuThuc" TEXT NOT NULL,
    "ketQua" JSONB NOT NULL,
    "uuTien" INTEGER NOT NULL DEFAULT 50,
    "batTat" BOOLEAN NOT NULL DEFAULT true,
    "soKhop" INTEGER NOT NULL DEFAULT 0,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeoQuyTacGan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoMauTrang" (
    "id" TEXT NOT NULL,
    "ma" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "loaiTrang" "LoaiTrang" NOT NULL,
    "mauDuongDan" TEXT NOT NULL,
    "mauTitle" TEXT NOT NULL,
    "mauMeta" TEXT NOT NULL,
    "mauH1" TEXT NOT NULL,
    "mauSchema" JSONB,
    "nguonDuLieu" TEXT NOT NULL,
    "dieuKienIndex" JSONB,
    "nhomSitemap" TEXT NOT NULL,
    "capNhatLuc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoMauTrang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoTrang" (
    "id" TEXT NOT NULL,
    "maTrang" TEXT,
    "duongDan" TEXT NOT NULL,
    "loai" "LoaiTrang" NOT NULL,
    "mauTrangId" TEXT,
    "thamSoMau" JSONB,
    "ghiDeMau" BOOLEAN NOT NULL DEFAULT false,
    "noiDungId" TEXT,
    "title" TEXT NOT NULL,
    "metaDescription" TEXT,
    "h1" TEXT,
    "canonical" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,
    "nofollow" BOOLEAN NOT NULL DEFAULT false,
    "schemaJsonLd" JSONB,
    "anhChiaSe" TEXT,
    "nhomSitemap" TEXT NOT NULL,
    "trangThai" "TrangThaiTrang" NOT NULL DEFAULT 'NHAP',
    "ngayXuatBan" TIMESTAMP(3),
    "ngayCapNhatNoiDung" TIMESTAMP(3),
    "tuKhoaChinhId" TEXT,
    "diemOnpage" INTEGER,
    "chiTietDiem" JSONB,
    "chamLuc" TIMESTAMP(3),
    "doSau" INTEGER,
    "soLienKetVao" INTEGER NOT NULL DEFAULT 0,
    "soLienKetRa" INTEGER NOT NULL DEFAULT 0,
    "maHttpLanQuet" INTEGER,
    "quetLuc" TIMESTAMP(3),
    "embedding" vector(1024),
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capNhatLuc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoTrang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoLienKet" (
    "id" TEXT NOT NULL,
    "tuTrangId" TEXT NOT NULL,
    "denTrangId" TEXT NOT NULL,
    "anchor" TEXT NOT NULL,
    "nguon" "NguonLienKet" NOT NULL,
    "trangThai" "TrangThaiLienKet" NOT NULL,
    "doGan" DOUBLE PRECISION,
    "quyTacId" TEXT,
    "quetLuc" TIMESTAMP(3),
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeoLienKet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoQuyTacLienKet" (
    "id" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "tuLoai" "LoaiTrang",
    "tuMauTrangMa" TEXT,
    "dieuKien" JSONB,
    "denMau" TEXT NOT NULL,
    "mauAnchor" TEXT[],
    "soToiThieu" INTEGER NOT NULL DEFAULT 0,
    "soToiDa" INTEGER NOT NULL DEFAULT 5,
    "batBuoc" BOOLEAN NOT NULL DEFAULT false,
    "batTat" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "SeoQuyTacLienKet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoChuyenHuong" (
    "id" TEXT NOT NULL,
    "tuMien" TEXT NOT NULL DEFAULT 'xemboi.vn',
    "tuDuongDan" TEXT NOT NULL,
    "denUrl" TEXT NOT NULL,
    "ma" INTEGER NOT NULL DEFAULT 301,
    "laBieuThuc" BOOLEAN NOT NULL DEFAULT false,
    "nguon" TEXT NOT NULL,
    "batTat" BOOLEAN NOT NULL DEFAULT true,
    "soLanTruy" INTEGER NOT NULL DEFAULT 0,
    "lanTruyCuoi" TIMESTAMP(3),
    "ghiChu" TEXT,
    "taoBoiId" TEXT,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeoChuyenHuong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoGscNgay" (
    "id" BIGSERIAL NOT NULL,
    "ngay" DATE NOT NULL,
    "url" TEXT NOT NULL,
    "trangId" TEXT,
    "truyVan" TEXT NOT NULL,
    "thietBi" TEXT NOT NULL,
    "hienThi" INTEGER NOT NULL,
    "nhap" INTEGER NOT NULL,
    "viTriTB" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SeoGscNgay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoGscTrangNgay" (
    "id" BIGSERIAL NOT NULL,
    "ngay" DATE NOT NULL,
    "url" TEXT NOT NULL,
    "trangId" TEXT,
    "thietBi" TEXT NOT NULL,
    "hienThi" INTEGER NOT NULL,
    "nhap" INTEGER NOT NULL,
    "viTriTB" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SeoGscTrangNgay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoCanhBao" (
    "id" TEXT NOT NULL,
    "loai" TEXT NOT NULL,
    "trangId" TEXT,
    "tuKhoaId" TEXT,
    "mucDo" INTEGER NOT NULL DEFAULT 2,
    "chiTiet" JSONB NOT NULL,
    "trangThai" "TrangThaiCanhBao" NOT NULL DEFAULT 'MO',
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xuLyLuc" TIMESTAMP(3),
    "xuLyBoiId" TEXT,

    CONSTRAINT "SeoCanhBao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoLichMua" (
    "id" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "dinhTu" DATE NOT NULL,
    "dinhDen" DATE NOT NULL,
    "hanLenTrang" DATE NOT NULL,
    "trangThai" TEXT NOT NULL DEFAULT 'CHUA_LAM',
    "ghiChu" TEXT,

    CONSTRAINT "SeoLichMua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TuCam" (
    "id" TEXT NOT NULL,
    "cum" TEXT NOT NULL,
    "nhom" TEXT NOT NULL,
    "xuLy" TEXT NOT NULL,
    "thayBang" TEXT,
    "phamVi" TEXT[],
    "nguon" TEXT NOT NULL,
    "batTat" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TuCam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HoSoTacGia" (
    "id" TEXT NOT NULL,
    "taiKhoanId" TEXT,
    "tenHienThi" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "gioiThieu" TEXT,
    "vaiTroHienThi" TEXT,
    "lienKet" TEXT[],
    "anh" TEXT,

    CONSTRAINT "HoSoTacGia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoiDung" (
    "id" TEXT NOT NULL,
    "loai" "LoaiNoiDung" NOT NULL,
    "tieuDe" TEXT NOT NULL,
    "mang" TEXT[],
    "trangThai" "TrangThaiNoiDung" NOT NULL DEFAULT 'NHAP',
    "tacGiaId" TEXT,
    "bienTapId" TEXT,
    "chuyenGiaId" TEXT,
    "phienBanXuatBanId" TEXT,
    "ngayDuyetChuyenGia" TIMESTAMP(3),
    "ngayXuatBan" TIMESTAMP(3),
    "hanCapNhat" TIMESTAMP(3),
    "chuKyCapNhatNgay" INTEGER,
    "canDuyetPhapLy" BOOLEAN NOT NULL DEFAULT false,
    "postCuId" TEXT,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capNhatLuc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NoiDung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoiDungPhienBan" (
    "id" TEXT NOT NULL,
    "noiDungId" TEXT NOT NULL,
    "so" INTEGER NOT NULL,
    "khoi" JSONB,
    "than" TEXT,
    "tomTat" TEXT,
    "nguonTao" TEXT NOT NULL,
    "taoBoiId" TEXT,
    "aiViecId" TEXT,
    "kiemTra" JSONB,
    "ghiChu" TEXT,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NoiDungPhienBan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoiDungTrichDan" (
    "id" TEXT NOT NULL,
    "phienBanId" TEXT NOT NULL,
    "khoi" INTEGER,
    "doanId" BIGINT,
    "nguonId" INTEGER,
    "kieu" "KieuTrich" NOT NULL,
    "cauTrich" TEXT,
    "viTri" TEXT,
    "daDoiChieu" BOOLEAN NOT NULL DEFAULT false,
    "nguoiDoiChieuId" TEXT,
    "maCauKho" TEXT,

    CONSTRAINT "NoiDungTrichDan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoiDungDuyet" (
    "id" TEXT NOT NULL,
    "noiDungId" TEXT NOT NULL,
    "phienBanId" TEXT NOT NULL,
    "vaiTro" "VaiTroDuyet" NOT NULL,
    "nguoiDuyetId" TEXT NOT NULL,
    "ketLuan" "KetLuanDuyet" NOT NULL,
    "nhanXet" TEXT,
    "luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NoiDungDuyet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiSoanViec" (
    "id" TEXT NOT NULL,
    "noiDungId" TEXT NOT NULL,
    "yeuCau" JSONB NOT NULL,
    "doanDaGui" BIGINT[],
    "nhaCungCap" TEXT NOT NULL,
    "moHinh" TEXT NOT NULL,
    "tokenVao" INTEGER,
    "tokenRa" INTEGER,
    "chiPhiUocVnd" INTEGER,
    "trangThai" TEXT NOT NULL,
    "loi" TEXT,
    "taoBoiId" TEXT,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xongLuc" TIMESTAMP(3),

    CONSTRAINT "AiSoanViec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_nguon" (
    "id" SERIAL NOT NULL,
    "ma" TEXT NOT NULL,
    "tenGoc" TEXT NOT NULL,
    "tenHanViet" TEXT,
    "tacGia" TEXT,
    "nienDai" TEXT,
    "banIn" TEXT,
    "ngonNgu" TEXT[],
    "mang" TEXT[],
    "loaiNguon" TEXT NOT NULL,
    "noiCoBanSo" TEXT,
    "url" TEXT,
    "dinhDang" TEXT,
    "phapLy" "PhapLy" NOT NULL,
    "ghiChuPhapLy" TEXT,
    "giayPhep" TEXT,
    "ghiCong" TEXT,
    "uuTien" INTEGER,
    "daKiemUrl" BOOLEAN NOT NULL DEFAULT false,
    "trangThaiTai" TEXT,
    "dungLuongMb" DOUBLE PRECISION,
    "duongDanCucBo" TEXT,
    "xinPhep" "TrangThaiXinPhep" NOT NULL DEFAULT 'CHUA_XIN',
    "chiNoiBo" BOOLEAN NOT NULL DEFAULT true,
    "duocTrichDai" BOOLEAN NOT NULL DEFAULT false,
    "phamVi" "PhamVi" NOT NULL DEFAULT 'NOI_BO',
    "sha256" TEXT,
    "trangThai" TEXT NOT NULL DEFAULT 'DANH_MUC',
    "ngayNap" TIMESTAMP(3),
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capNhatLuc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rag_nguon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_tep" (
    "id" TEXT NOT NULL,
    "nguonId" INTEGER NOT NULL,
    "duongDan" TEXT NOT NULL,
    "kieu" "KieuTep" NOT NULL,
    "kichThuoc" BIGINT NOT NULL,
    "sha256" TEXT NOT NULL,
    "soTrang" INTEGER,
    "trangThai" TEXT NOT NULL DEFAULT 'MOI',
    "phatHienLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rag_tep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_van_ban" (
    "id" TEXT NOT NULL,
    "tepId" TEXT NOT NULL,
    "trang" INTEGER,
    "vanBanTho" TEXT NOT NULL,
    "vanBanSach" TEXT,
    "ocrTinCay" REAL,
    "phienBanCongCu" TEXT NOT NULL,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rag_van_ban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_viec" (
    "id" BIGSERIAL NOT NULL,
    "loai" "LoaiViecRag" NOT NULL,
    "noiChay" "NoiChay" NOT NULL,
    "nguonId" INTEGER,
    "tepId" TEXT,
    "thamSo" JSONB,
    "trangThai" "TrangThaiViec" NOT NULL DEFAULT 'CHO',
    "uuTien" INTEGER NOT NULL DEFAULT 50,
    "soLanThu" INTEGER NOT NULL DEFAULT 0,
    "toiDaThu" INTEGER NOT NULL DEFAULT 3,
    "loi" TEXT,
    "nhanBoi" TEXT,
    "ketQua" JSONB,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "batDauLuc" TIMESTAMP(3),
    "ketThucLuc" TIMESTAMP(3),

    CONSTRAINT "rag_viec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_may_xu_ly" (
    "id" TEXT NOT NULL,
    "moTa" TEXT,
    "noiChay" "NoiChay" NOT NULL,
    "phienBan" JSONB,
    "nhipTimLuc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rag_may_xu_ly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_doan" (
    "id" BIGSERIAL NOT NULL,
    "nguonId" INTEGER NOT NULL,
    "tepId" TEXT,
    "duongDan" TEXT[],
    "thuTu" INTEGER NOT NULL,
    "loai" TEXT NOT NULL,
    "chaId" BIGINT,
    "vanBan" TEXT NOT NULL,
    "vanBanChuan" TEXT,
    "hanViet" TEXT,
    "dichVi" TEXT,
    "dichViNguonId" INTEGER,
    "trangAnh" TEXT,
    "ocrTinCay" REAL,
    "daSoat" BOOLEAN NOT NULL DEFAULT false,
    "phamVi" "PhamVi" NOT NULL DEFAULT 'NOI_BO',
    "bamNoiDung" TEXT NOT NULL,
    "phienBan" INTEGER NOT NULL DEFAULT 1,
    "embedding" vector(1024),
    "moHinhNhung" TEXT,
    "nhungLuc" TIMESTAMP(3),
    "tsv" tsvector,
    "meta" JSONB,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capNhatLuc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rag_doan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_doan_sua" (
    "id" TEXT NOT NULL,
    "doanId" BIGINT NOT NULL,
    "truong" TEXT NOT NULL,
    "truoc" TEXT NOT NULL,
    "sau" TEXT NOT NULL,
    "nguoiSuaId" TEXT NOT NULL,
    "luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rag_doan_sua_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_nhan" (
    "id" TEXT NOT NULL,
    "loai" TEXT NOT NULL,
    "ma" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "tenHan" TEXT,

    CONSTRAINT "rag_nhan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_doan_nhan" (
    "doanId" BIGINT NOT NULL,
    "nhanId" TEXT NOT NULL,
    "nguonGan" TEXT NOT NULL,
    "nguoiGanId" TEXT,
    "luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rag_doan_nhan_pkey" PRIMARY KEY ("doanId","nhanId")
);

-- CreateTable
CREATE TABLE "thuat_ngu" (
    "han" TEXT NOT NULL,
    "hanViet" TEXT NOT NULL,
    "bienThe" TEXT[],
    "mang" TEXT NOT NULL,

    CONSTRAINT "thuat_ngu_pkey" PRIMARY KEY ("han","mang")
);

-- CreateTable
CREATE TABLE "rag_cau_hoi_chuan" (
    "id" TEXT NOT NULL,
    "cauHoi" TEXT NOT NULL,
    "mang" TEXT,
    "doanDung" BIGINT[],
    "nguonDungMa" TEXT[],
    "viTriDung" TEXT,
    "ghiChu" TEXT,
    "taoBoiId" TEXT,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rag_cau_hoi_chuan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_danh_gia" (
    "id" TEXT NOT NULL,
    "moHinhNhung" TEXT NOT NULL,
    "cauHinh" JSONB NOT NULL,
    "soCau" INTEGER NOT NULL,
    "recallAt10" DOUBLE PRECISION NOT NULL,
    "mrr" DOUBLE PRECISION NOT NULL,
    "tyLeDungNguon" DOUBLE PRECISION NOT NULL,
    "chiTiet" JSONB NOT NULL,
    "chayBoiId" TEXT,
    "luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rag_danh_gia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rag_truy_van_log" (
    "id" BIGSERIAL NOT NULL,
    "nguCanh" "PhamVi" NOT NULL,
    "taiKhoanId" TEXT,
    "truyVan" TEXT NOT NULL,
    "soKetQua" INTEGER NOT NULL,
    "coNoiBo" BOOLEAN NOT NULL DEFAULT false,
    "ms" INTEGER NOT NULL,
    "luc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rag_truy_van_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GpMaNgoai" (
    "id" TEXT NOT NULL,
    "ma" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "giayPhepTep" TEXT,
    "giayPhepKhaoSat" TEXT,
    "nhom" TEXT NOT NULL,
    "xinPhep" "TrangThaiXinPhep" NOT NULL DEFAULT 'CHUA_XIN',
    "ghiChu" TEXT,

    CONSTRAINT "GpMaNgoai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GpMaNgoaiSuDung" (
    "id" TEXT NOT NULL,
    "maNgoaiId" TEXT NOT NULL,
    "ngay" DATE NOT NULL,
    "commit" TEXT,
    "tepDaDung" TEXT NOT NULL,
    "dungODau" TEXT NOT NULL,
    "chayTrenWeb" BOOLEAN NOT NULL,
    "daGhiNotice" BOOLEAN NOT NULL DEFAULT false,
    "ghiCong" TEXT,
    "ghiChu" TEXT,

    CONSTRAINT "GpMaNgoaiSuDung_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GpXinPhep" (
    "id" TEXT NOT NULL,
    "doiTuong" TEXT NOT NULL,
    "nguonId" INTEGER,
    "maNgoaiId" TEXT,
    "nguoiNhan" TEXT NOT NULL,
    "kenh" TEXT NOT NULL,
    "ngayGui" TIMESTAMP(3),
    "ngayTraLoi" TIMESTAMP(3),
    "ketQua" "TrangThaiXinPhep" NOT NULL DEFAULT 'DA_GUI',
    "dieuKien" TEXT,
    "chiPhiVnd" INTEGER,
    "hetHan" TIMESTAMP(3),
    "tepBangChung" TEXT,
    "ghiChu" TEXT,
    "taoBoiId" TEXT,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GpXinPhep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeoNhomLoai" (
    "id" TEXT NOT NULL,
    "ma" TEXT NOT NULL,
    "lyDo" TEXT NOT NULL,
    "chinhSach" "ChinhSachLoai" NOT NULL DEFAULT 'CHO_QUYET',
    "nguonQuyet" TEXT,
    "trangDichId" TEXT,
    "ghiChu" TEXT,
    "capNhatBoi" TEXT,
    "taoLuc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "capNhatLuc" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeoNhomLoai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AiAgentToRagNguon" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_SeoCumToSeoLichMua" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SeoLichMuaToSeoTrang" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TaiKhoan_email_key" ON "TaiKhoan"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PhienDangNhap_maBam_key" ON "PhienDangNhap"("maBam");

-- CreateIndex
CREATE INDEX "PhienDangNhap_taiKhoanId_idx" ON "PhienDangNhap"("taiKhoanId");

-- CreateIndex
CREATE INDEX "PhienDangNhap_hetHan_idx" ON "PhienDangNhap"("hetHan");

-- CreateIndex
CREATE INDEX "NhatKyThaoTac_doiTuong_doiTuongId_idx" ON "NhatKyThaoTac"("doiTuong", "doiTuongId");

-- CreateIndex
CREATE INDEX "NhatKyThaoTac_taiKhoanId_luc_idx" ON "NhatKyThaoTac"("taiKhoanId", "luc");

-- CreateIndex
CREATE INDEX "NhatKyThaoTac_hanhDong_luc_idx" ON "NhatKyThaoTac"("hanhDong", "luc");

-- CreateIndex
CREATE UNIQUE INDEX "SeoTuKhoa_chuoi_key" ON "SeoTuKhoa"("chuoi");

-- CreateIndex
CREATE INDEX "SeoTuKhoa_nhomLoaiId_idx" ON "SeoTuKhoa"("nhomLoaiId");

-- CreateIndex
CREATE INDEX "SeoTuKhoa_cumId_idx" ON "SeoTuKhoa"("cumId");

-- CreateIndex
CREATE INDEX "SeoTuKhoa_trangDichId_idx" ON "SeoTuKhoa"("trangDichId");

-- CreateIndex
CREATE INDEX "SeoTuKhoa_trangThai_luongTim_idx" ON "SeoTuKhoa"("trangThai", "luongTim");

-- CreateIndex
CREATE INDEX "SeoTuKhoa_chuoiKhongDau_idx" ON "SeoTuKhoa"("chuoiKhongDau");

-- CreateIndex
CREATE UNIQUE INDEX "SeoCum_ma_key" ON "SeoCum"("ma");

-- CreateIndex
CREATE UNIQUE INDEX "SeoMauTrang_ma_key" ON "SeoMauTrang"("ma");

-- CreateIndex
CREATE UNIQUE INDEX "SeoTrang_maTrang_key" ON "SeoTrang"("maTrang");

-- CreateIndex
CREATE UNIQUE INDEX "SeoTrang_duongDan_key" ON "SeoTrang"("duongDan");

-- CreateIndex
CREATE UNIQUE INDEX "SeoTrang_noiDungId_key" ON "SeoTrang"("noiDungId");

-- CreateIndex
CREATE INDEX "SeoTrang_loai_trangThai_idx" ON "SeoTrang"("loai", "trangThai");

-- CreateIndex
CREATE INDEX "SeoTrang_nhomSitemap_trangThai_noindex_idx" ON "SeoTrang"("nhomSitemap", "trangThai", "noindex");

-- CreateIndex
CREATE INDEX "SeoTrang_mauTrangId_idx" ON "SeoTrang"("mauTrangId");

-- CreateIndex
CREATE INDEX "SeoLienKet_tuTrangId_idx" ON "SeoLienKet"("tuTrangId");

-- CreateIndex
CREATE INDEX "SeoLienKet_denTrangId_trangThai_idx" ON "SeoLienKet"("denTrangId", "trangThai");

-- CreateIndex
CREATE UNIQUE INDEX "SeoChuyenHuong_tuMien_tuDuongDan_key" ON "SeoChuyenHuong"("tuMien", "tuDuongDan");

-- CreateIndex
CREATE INDEX "SeoGscNgay_trangId_ngay_idx" ON "SeoGscNgay"("trangId", "ngay");

-- CreateIndex
CREATE INDEX "SeoGscNgay_truyVan_ngay_idx" ON "SeoGscNgay"("truyVan", "ngay");

-- CreateIndex
CREATE UNIQUE INDEX "SeoGscNgay_ngay_url_truyVan_thietBi_key" ON "SeoGscNgay"("ngay", "url", "truyVan", "thietBi");

-- CreateIndex
CREATE INDEX "SeoGscTrangNgay_trangId_ngay_idx" ON "SeoGscTrangNgay"("trangId", "ngay");

-- CreateIndex
CREATE UNIQUE INDEX "SeoGscTrangNgay_ngay_url_thietBi_key" ON "SeoGscTrangNgay"("ngay", "url", "thietBi");

-- CreateIndex
CREATE INDEX "SeoCanhBao_trangThai_loai_idx" ON "SeoCanhBao"("trangThai", "loai");

-- CreateIndex
CREATE UNIQUE INDEX "TuCam_cum_key" ON "TuCam"("cum");

-- CreateIndex
CREATE UNIQUE INDEX "HoSoTacGia_taiKhoanId_key" ON "HoSoTacGia"("taiKhoanId");

-- CreateIndex
CREATE UNIQUE INDEX "HoSoTacGia_slug_key" ON "HoSoTacGia"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NoiDung_phienBanXuatBanId_key" ON "NoiDung"("phienBanXuatBanId");

-- CreateIndex
CREATE UNIQUE INDEX "NoiDung_postCuId_key" ON "NoiDung"("postCuId");

-- CreateIndex
CREATE INDEX "NoiDung_loai_trangThai_idx" ON "NoiDung"("loai", "trangThai");

-- CreateIndex
CREATE INDEX "NoiDung_hanCapNhat_idx" ON "NoiDung"("hanCapNhat");

-- CreateIndex
CREATE UNIQUE INDEX "NoiDungPhienBan_noiDungId_so_key" ON "NoiDungPhienBan"("noiDungId", "so");

-- CreateIndex
CREATE INDEX "NoiDungTrichDan_doanId_idx" ON "NoiDungTrichDan"("doanId");

-- CreateIndex
CREATE INDEX "NoiDungTrichDan_nguonId_idx" ON "NoiDungTrichDan"("nguonId");

-- CreateIndex
CREATE INDEX "NoiDungDuyet_noiDungId_luc_idx" ON "NoiDungDuyet"("noiDungId", "luc");

-- CreateIndex
CREATE UNIQUE INDEX "rag_nguon_ma_key" ON "rag_nguon"("ma");

-- CreateIndex
CREATE INDEX "rag_nguon_phapLy_phamVi_idx" ON "rag_nguon"("phapLy", "phamVi");

-- CreateIndex
CREATE INDEX "rag_tep_sha256_idx" ON "rag_tep"("sha256");

-- CreateIndex
CREATE UNIQUE INDEX "rag_tep_nguonId_duongDan_key" ON "rag_tep"("nguonId", "duongDan");

-- CreateIndex
CREATE INDEX "rag_van_ban_tepId_trang_idx" ON "rag_van_ban"("tepId", "trang");

-- CreateIndex
CREATE INDEX "rag_viec_trangThai_noiChay_uuTien_taoLuc_idx" ON "rag_viec"("trangThai", "noiChay", "uuTien", "taoLuc");

-- CreateIndex
CREATE INDEX "rag_viec_nguonId_loai_idx" ON "rag_viec"("nguonId", "loai");

-- CreateIndex
CREATE INDEX "rag_doan_nguonId_thuTu_idx" ON "rag_doan"("nguonId", "thuTu");

-- CreateIndex
CREATE INDEX "rag_doan_phamVi_idx" ON "rag_doan"("phamVi");

-- CreateIndex
CREATE INDEX "rag_doan_bamNoiDung_idx" ON "rag_doan"("bamNoiDung");

-- CreateIndex
CREATE INDEX "rag_doan_sua_doanId_idx" ON "rag_doan_sua"("doanId");

-- CreateIndex
CREATE UNIQUE INDEX "rag_nhan_loai_ma_key" ON "rag_nhan"("loai", "ma");

-- CreateIndex
CREATE INDEX "rag_doan_nhan_nhanId_idx" ON "rag_doan_nhan"("nhanId");

-- CreateIndex
CREATE INDEX "thuat_ngu_hanViet_idx" ON "thuat_ngu"("hanViet");

-- CreateIndex
CREATE INDEX "rag_truy_van_log_nguCanh_luc_idx" ON "rag_truy_van_log"("nguCanh", "luc");

-- CreateIndex
CREATE UNIQUE INDEX "GpMaNgoai_ma_key" ON "GpMaNgoai"("ma");

-- CreateIndex
CREATE UNIQUE INDEX "SeoNhomLoai_ma_key" ON "SeoNhomLoai"("ma");

-- CreateIndex
CREATE UNIQUE INDEX "_AiAgentToRagNguon_AB_unique" ON "_AiAgentToRagNguon"("A", "B");

-- CreateIndex
CREATE INDEX "_AiAgentToRagNguon_B_index" ON "_AiAgentToRagNguon"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SeoCumToSeoLichMua_AB_unique" ON "_SeoCumToSeoLichMua"("A", "B");

-- CreateIndex
CREATE INDEX "_SeoCumToSeoLichMua_B_index" ON "_SeoCumToSeoLichMua"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SeoLichMuaToSeoTrang_AB_unique" ON "_SeoLichMuaToSeoTrang"("A", "B");

-- CreateIndex
CREATE INDEX "_SeoLichMuaToSeoTrang_B_index" ON "_SeoLichMuaToSeoTrang"("B");

-- AddForeignKey
ALTER TABLE "PhienDangNhap" ADD CONSTRAINT "PhienDangNhap_taiKhoanId_fkey" FOREIGN KEY ("taiKhoanId") REFERENCES "TaiKhoan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NhatKyThaoTac" ADD CONSTRAINT "NhatKyThaoTac_taiKhoanId_fkey" FOREIGN KEY ("taiKhoanId") REFERENCES "TaiKhoan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoTuKhoa" ADD CONSTRAINT "SeoTuKhoa_cumId_fkey" FOREIGN KEY ("cumId") REFERENCES "SeoCum"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoTuKhoa" ADD CONSTRAINT "SeoTuKhoa_trangDichId_fkey" FOREIGN KEY ("trangDichId") REFERENCES "SeoTrang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoTuKhoa" ADD CONSTRAINT "SeoTuKhoa_quyTacId_fkey" FOREIGN KEY ("quyTacId") REFERENCES "SeoQuyTacGan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoTuKhoa" ADD CONSTRAINT "SeoTuKhoa_nhomLoaiId_fkey" FOREIGN KEY ("nhomLoaiId") REFERENCES "SeoNhomLoai"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoTuKhoa" ADD CONSTRAINT "SeoTuKhoa_tuGocId_fkey" FOREIGN KEY ("tuGocId") REFERENCES "SeoTuKhoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoCum" ADD CONSTRAINT "SeoCum_trangDichId_fkey" FOREIGN KEY ("trangDichId") REFERENCES "SeoTrang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoTrang" ADD CONSTRAINT "SeoTrang_mauTrangId_fkey" FOREIGN KEY ("mauTrangId") REFERENCES "SeoMauTrang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoTrang" ADD CONSTRAINT "SeoTrang_noiDungId_fkey" FOREIGN KEY ("noiDungId") REFERENCES "NoiDung"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoTrang" ADD CONSTRAINT "SeoTrang_tuKhoaChinhId_fkey" FOREIGN KEY ("tuKhoaChinhId") REFERENCES "SeoTuKhoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoLienKet" ADD CONSTRAINT "SeoLienKet_tuTrangId_fkey" FOREIGN KEY ("tuTrangId") REFERENCES "SeoTrang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoLienKet" ADD CONSTRAINT "SeoLienKet_denTrangId_fkey" FOREIGN KEY ("denTrangId") REFERENCES "SeoTrang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoGscNgay" ADD CONSTRAINT "SeoGscNgay_trangId_fkey" FOREIGN KEY ("trangId") REFERENCES "SeoTrang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoGscTrangNgay" ADD CONSTRAINT "SeoGscTrangNgay_trangId_fkey" FOREIGN KEY ("trangId") REFERENCES "SeoTrang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeoCanhBao" ADD CONSTRAINT "SeoCanhBao_trangId_fkey" FOREIGN KEY ("trangId") REFERENCES "SeoTrang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HoSoTacGia" ADD CONSTRAINT "HoSoTacGia_taiKhoanId_fkey" FOREIGN KEY ("taiKhoanId") REFERENCES "TaiKhoan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoiDungPhienBan" ADD CONSTRAINT "NoiDungPhienBan_noiDungId_fkey" FOREIGN KEY ("noiDungId") REFERENCES "NoiDung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoiDungTrichDan" ADD CONSTRAINT "NoiDungTrichDan_phienBanId_fkey" FOREIGN KEY ("phienBanId") REFERENCES "NoiDungPhienBan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoiDungTrichDan" ADD CONSTRAINT "NoiDungTrichDan_doanId_fkey" FOREIGN KEY ("doanId") REFERENCES "rag_doan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoiDungTrichDan" ADD CONSTRAINT "NoiDungTrichDan_nguonId_fkey" FOREIGN KEY ("nguonId") REFERENCES "rag_nguon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoiDungDuyet" ADD CONSTRAINT "NoiDungDuyet_noiDungId_fkey" FOREIGN KEY ("noiDungId") REFERENCES "NoiDung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoiDungDuyet" ADD CONSTRAINT "NoiDungDuyet_phienBanId_fkey" FOREIGN KEY ("phienBanId") REFERENCES "NoiDungPhienBan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiSoanViec" ADD CONSTRAINT "AiSoanViec_noiDungId_fkey" FOREIGN KEY ("noiDungId") REFERENCES "NoiDung"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rag_tep" ADD CONSTRAINT "rag_tep_nguonId_fkey" FOREIGN KEY ("nguonId") REFERENCES "rag_nguon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rag_van_ban" ADD CONSTRAINT "rag_van_ban_tepId_fkey" FOREIGN KEY ("tepId") REFERENCES "rag_tep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rag_viec" ADD CONSTRAINT "rag_viec_tepId_fkey" FOREIGN KEY ("tepId") REFERENCES "rag_tep"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rag_doan" ADD CONSTRAINT "rag_doan_nguonId_fkey" FOREIGN KEY ("nguonId") REFERENCES "rag_nguon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rag_doan" ADD CONSTRAINT "rag_doan_tepId_fkey" FOREIGN KEY ("tepId") REFERENCES "rag_tep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rag_doan" ADD CONSTRAINT "rag_doan_dichViNguonId_fkey" FOREIGN KEY ("dichViNguonId") REFERENCES "rag_nguon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rag_doan_sua" ADD CONSTRAINT "rag_doan_sua_doanId_fkey" FOREIGN KEY ("doanId") REFERENCES "rag_doan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rag_doan_nhan" ADD CONSTRAINT "rag_doan_nhan_doanId_fkey" FOREIGN KEY ("doanId") REFERENCES "rag_doan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rag_doan_nhan" ADD CONSTRAINT "rag_doan_nhan_nhanId_fkey" FOREIGN KEY ("nhanId") REFERENCES "rag_nhan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GpMaNgoaiSuDung" ADD CONSTRAINT "GpMaNgoaiSuDung_maNgoaiId_fkey" FOREIGN KEY ("maNgoaiId") REFERENCES "GpMaNgoai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GpXinPhep" ADD CONSTRAINT "GpXinPhep_nguonId_fkey" FOREIGN KEY ("nguonId") REFERENCES "rag_nguon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GpXinPhep" ADD CONSTRAINT "GpXinPhep_maNgoaiId_fkey" FOREIGN KEY ("maNgoaiId") REFERENCES "GpMaNgoai"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AiAgentToRagNguon" ADD CONSTRAINT "_AiAgentToRagNguon_A_fkey" FOREIGN KEY ("A") REFERENCES "AiAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AiAgentToRagNguon" ADD CONSTRAINT "_AiAgentToRagNguon_B_fkey" FOREIGN KEY ("B") REFERENCES "rag_nguon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeoCumToSeoLichMua" ADD CONSTRAINT "_SeoCumToSeoLichMua_A_fkey" FOREIGN KEY ("A") REFERENCES "SeoCum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeoCumToSeoLichMua" ADD CONSTRAINT "_SeoCumToSeoLichMua_B_fkey" FOREIGN KEY ("B") REFERENCES "SeoLichMua"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeoLichMuaToSeoTrang" ADD CONSTRAINT "_SeoLichMuaToSeoTrang_A_fkey" FOREIGN KEY ("A") REFERENCES "SeoLichMua"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SeoLichMuaToSeoTrang" ADD CONSTRAINT "_SeoLichMuaToSeoTrang_B_fkey" FOREIGN KEY ("B") REFERENCES "SeoTrang"("id") ON DELETE CASCADE ON UPDATE CASCADE;

