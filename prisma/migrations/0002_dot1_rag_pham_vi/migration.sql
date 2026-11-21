-- Đợt 1 (docs/v2/17 mục 6.3): chặn nguồn C / nội bộ ở tầng cơ sở dữ liệu, không dựa vào giao diện.
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- (1) Ràng buộc phạm vi: chỉ nguồn A (hoặc đã được đồng ý) và không gắn cờ nội bộ mới được CONG_KHAI.
ALTER TABLE rag_nguon ADD CONSTRAINT rag_nguon_pham_vi_hop_le CHECK (
  "phamVi" = 'NOI_BO'
  OR ("chiNoiBo" = false AND ("phapLy" = 'A' OR "xinPhep" = 'DONG_Y'))
);

-- (2) Tự tính phạm vi nguồn mỗi khi chèn hoặc sửa. Giá trị "phamVi" gửi lên bị bỏ qua.
CREATE OR REPLACE FUNCTION rag_nguon_tinh_pham_vi() RETURNS trigger AS $$
DECLARE
  hop_le boolean := NEW."chiNoiBo" = false AND (NEW."phapLy" = 'A' OR NEW."xinPhep" = 'DONG_Y');
BEGIN
  -- Ai cố ý đặt CONG_KHAI cho nguồn không đủ điều kiện thì bị từ chối, không lặng lẽ sửa.
  IF NEW."phamVi" = 'CONG_KHAI' AND NOT hop_le
     AND (TG_OP = 'INSERT' OR OLD."phamVi" IS DISTINCT FROM 'CONG_KHAI') THEN
    RAISE EXCEPTION 'Nguồn % (pháp lý %, xin phép %, chỉ nội bộ %) không được để CONG_KHAI',
      NEW.ma, NEW."phapLy", NEW."xinPhep", NEW."chiNoiBo" USING ERRCODE = 'check_violation';
  END IF;
  NEW."phamVi" := CASE WHEN hop_le THEN 'CONG_KHAI'::"PhamVi" ELSE 'NOI_BO'::"PhamVi" END;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rag_nguon_pham_vi BEFORE INSERT OR UPDATE ON rag_nguon
  FOR EACH ROW EXECUTE FUNCTION rag_nguon_tinh_pham_vi();

-- (3a) Khi chèn hoặc sửa đoạn: phạm vi lấy từ nguồn (và nguồn bản dịch nếu có), không tin máy trạm.
--      Đồng thời dựng tsv từ văn bản chuẩn.
CREATE OR REPLACE FUNCTION rag_doan_dat_pham_vi() RETURNS trigger AS $$
DECLARE
  pv_nguon "PhamVi";
  pv_dich  "PhamVi";
BEGIN
  SELECT "phamVi" INTO pv_nguon FROM rag_nguon WHERE id = NEW."nguonId";
  IF NEW."dichViNguonId" IS NOT NULL THEN
    SELECT "phamVi" INTO pv_dich FROM rag_nguon WHERE id = NEW."dichViNguonId";
  END IF;
  NEW."phamVi" := CASE
    WHEN pv_nguon = 'CONG_KHAI' AND (NEW."dichViNguonId" IS NULL OR pv_dich = 'CONG_KHAI')
    THEN 'CONG_KHAI'::"PhamVi" ELSE 'NOI_BO'::"PhamVi" END;
  NEW.tsv := to_tsvector('simple', coalesce(NEW."vanBanChuan", NEW."vanBan") || ' ' || coalesce(NEW."hanViet", '') || ' ' || coalesce(NEW."dichVi", ''));
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rag_doan_pham_vi BEFORE INSERT OR UPDATE ON rag_doan
  FOR EACH ROW EXECUTE FUNCTION rag_doan_dat_pham_vi();

-- (3b) Đổi phạm vi nguồn thì đồng bộ xuống mọi đoạn của nguồn và đoạn dùng bản dịch của nguồn.
CREATE OR REPLACE FUNCTION rag_dong_bo_pham_vi_doan() RETURNS trigger AS $$
BEGIN
  IF NEW."phamVi" IS DISTINCT FROM OLD."phamVi" THEN
    -- Chạm vào đoạn để trigger (3a) tính lại phạm vi.
    UPDATE rag_doan SET "nguonId" = "nguonId"
     WHERE "nguonId" = NEW.id OR "dichViNguonId" = NEW.id;
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rag_nguon_dong_bo AFTER UPDATE OF "phamVi", "phapLy", "xinPhep", "chiNoiBo" ON rag_nguon
  FOR EACH ROW EXECUTE FUNCTION rag_dong_bo_pham_vi_doan();

-- (4) Chỉ mục: HNSW đầy đủ (quản trị) + HNSW một phần (công khai), toàn văn, trigram.
CREATE INDEX rag_doan_hnsw_tat_ca    ON rag_doan USING hnsw (embedding vector_cosine_ops);
CREATE INDEX rag_doan_hnsw_cong_khai ON rag_doan USING hnsw (embedding vector_cosine_ops) WHERE "phamVi" = 'CONG_KHAI';
CREATE INDEX rag_doan_tsv            ON rag_doan USING gin (tsv);
CREATE INDEX rag_doan_trgm           ON rag_doan USING gin ("vanBanChuan" gin_trgm_ops);
CREATE INDEX seo_trang_hnsw          ON "SeoTrang" USING hnsw (embedding vector_cosine_ops);

-- (5) View công khai: chỉ đây là đường mà trang công khai được đọc.
CREATE VIEW rag_nguon_cong_khai AS
  SELECT id, ma, "tenGoc", "tenHanViet", "tacGia", "nienDai", "banIn", mang, url, "giayPhep", "ghiCong", "duocTrichDai"
  FROM rag_nguon WHERE "phamVi" = 'CONG_KHAI';

CREATE VIEW rag_doan_cong_khai WITH (security_barrier = true) AS
  SELECT id, "nguonId", "duongDan", "thuTu", loai, "chaId", "vanBan", "vanBanChuan", "hanViet",
         CASE WHEN "dichViNguonId" IS NULL THEN NULL ELSE "dichVi" END AS "dichVi",
         embedding, tsv, meta
  FROM rag_doan WHERE "phamVi" = 'CONG_KHAI'
    AND ("ocrTinCay" IS NULL OR "daSoat" = true OR "ocrTinCay" >= 0.9);

-- (6) Vai trò. Tạo NOLOGIN ở đây; mật khẩu và LOGIN đặt riêng trên từng máy (scripts/db-vai-tro.mjs), không nằm trong mã.
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'xemboi_web')     THEN CREATE ROLE xemboi_web NOLOGIN;     END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'xemboi_quantri') THEN CREATE ROLE xemboi_quantri NOLOGIN; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'xemboi_worker')  THEN CREATE ROLE xemboi_worker NOLOGIN;  END IF;
END $$;

GRANT USAGE ON SCHEMA public TO xemboi_web, xemboi_quantri, xemboi_worker;

-- Trang công khai: chỉ đọc view, không bao giờ chạm bảng gốc của RAG.
REVOKE ALL ON rag_doan, rag_nguon, rag_doan_sua, rag_van_ban, rag_tep, rag_viec, rag_may_xu_ly FROM xemboi_web;
GRANT SELECT ON rag_doan_cong_khai, rag_nguon_cong_khai, thuat_ngu TO xemboi_web;

-- Máy trạm xử lý: ghi đoạn, tệp, văn bản, việc; chỉ đọc nguồn (không đổi được pháp lý).
GRANT SELECT, INSERT, UPDATE ON rag_doan, rag_tep, rag_van_ban, rag_viec, rag_may_xu_ly, thuat_ngu TO xemboi_worker;
GRANT SELECT ON rag_nguon TO xemboi_worker;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO xemboi_worker;

-- Quản trị: đọc ghi bảng RAG, nhật ký chỉ được thêm.
GRANT SELECT, INSERT, UPDATE, DELETE ON rag_doan, rag_nguon, rag_doan_sua, rag_van_ban, rag_tep, rag_viec, rag_may_xu_ly, thuat_ngu TO xemboi_quantri;
GRANT SELECT, INSERT ON "NhatKyThaoTac" TO xemboi_quantri;
REVOKE UPDATE, DELETE ON "NhatKyThaoTac" FROM xemboi_quantri;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO xemboi_quantri;

-- (7) Row-Level Security: lớp phòng hờ nếu ai đó lỡ cấp quyền bảng gốc cho xemboi_web.
ALTER TABLE rag_doan ENABLE ROW LEVEL SECURITY;
CREATE POLICY p_web     ON rag_doan FOR SELECT TO xemboi_web     USING ("phamVi" = 'CONG_KHAI');
CREATE POLICY p_quantri ON rag_doan FOR ALL    TO xemboi_quantri USING (true) WITH CHECK (true);
CREATE POLICY p_worker  ON rag_doan FOR ALL    TO xemboi_worker  USING (true) WITH CHECK (true);
