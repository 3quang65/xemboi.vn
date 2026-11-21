-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "NguHanh" AS ENUM ('KIM', 'MOC', 'THUY', 'HOA', 'THO');

-- CreateEnum
CREATE TYPE "AmDuong" AS ENUM ('DUONG', 'AM');

-- CreateEnum
CREATE TYPE "GioiTinh" AS ENUM ('NAM', 'NU');

-- CreateEnum
CREATE TYPE "LoaiSao" AS ENUM ('CHINH_TINH', 'PHU_TINH_TOT', 'PHU_TINH_XAU', 'TU_HOA', 'VONG_TRUONG_SINH', 'VONG_THAI_TUE', 'VONG_LOC_TON', 'LUU_TINH', 'TUAN_TRIET');

-- CreateEnum
CREATE TYPE "TrangThaiSao" AS ENUM ('MIEU_DIA', 'VUONG_DIA', 'DAC_DIA', 'BINH_HOA', 'HAM_DIA', 'KHONG_XAC_DINH');

-- CreateEnum
CREATE TYPE "CungChucNang" AS ENUM ('MENH', 'PHU_MAU', 'PHUC_DUC', 'DIEN_TRACH', 'QUAN_LOC', 'NO_BOC', 'THIEN_DI', 'TAT_ACH', 'TAI_BACH', 'TU_TUC', 'PHU_THE', 'HUYNH_DE', 'THAN');

-- CreateEnum
CREATE TYPE "DiaChi" AS ENUM ('TY', 'SUU', 'DAN', 'MAO', 'THIN', 'TI', 'NGO', 'MUI', 'THAN', 'DAU', 'TUAT', 'HOI');

-- CreateTable
CREATE TABLE "HoroscopeChart" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "gender" "GioiTinh" NOT NULL,
    "isLunarInput" BOOLEAN NOT NULL DEFAULT false,
    "solarDay" INTEGER NOT NULL,
    "solarMonth" INTEGER NOT NULL,
    "solarYear" INTEGER NOT NULL,
    "solarHour" INTEGER NOT NULL,
    "solarMinute" INTEGER NOT NULL DEFAULT 0,
    "lunarDay" INTEGER NOT NULL,
    "lunarMonth" INTEGER NOT NULL,
    "lunarYear" INTEGER NOT NULL,
    "isLeapMonth" BOOLEAN NOT NULL DEFAULT false,
    "canChiYear" TEXT NOT NULL,
    "canChiMonth" TEXT NOT NULL,
    "canChiDay" TEXT NOT NULL,
    "canChiHour" TEXT NOT NULL,
    "gioDiaChi" "DiaChi" NOT NULL,
    "yearViewing" INTEGER NOT NULL,
    "amDuongNamNu" TEXT NOT NULL,
    "banMenh" TEXT NOT NULL,
    "menhNguHanh" "NguHanh" NOT NULL,
    "cucName" TEXT NOT NULL,
    "cucNumber" INTEGER NOT NULL,
    "cungMenhDiaChi" "DiaChi" NOT NULL,
    "cungThanDiaChi" "DiaChi" NOT NULL,
    "menhChu" TEXT NOT NULL,
    "thanChu" TEXT NOT NULL,
    "palacesData" JSONB NOT NULL,
    "interpretation" JSONB,
    "chartImageUrl" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 1,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HoroscopeChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Star" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "loaiSao" "LoaiSao" NOT NULL,
    "nguHanh" "NguHanh" NOT NULL,
    "amDuong" "AmDuong",
    "hoaKhi" TEXT,
    "chuQuan" TEXT,
    "cssColorClass" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Star_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StarInterpretation" (
    "id" TEXT NOT NULL,
    "starId" TEXT NOT NULL,
    "cungChucNang" "CungChucNang" NOT NULL,
    "diaChi" "DiaChi",
    "trangThai" "TrangThaiSao",
    "gender" "GioiTinh",
    "title" TEXT,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StarInterpretation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CachCucInterpretation" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cungApDung" "CungChucNang",
    "conditionRules" JSONB NOT NULL,
    "isGoodPattern" BOOLEAN NOT NULL DEFAULT true,
    "poem" TEXT,
    "content" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "CachCucInterpretation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransitInterpretation" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "cungGoc" "CungChucNang",
    "starCode" TEXT,
    "content" TEXT NOT NULL,

    CONSTRAINT "TransitInterpretation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuxiliaryToolData" (
    "id" TEXT NOT NULL,
    "toolType" TEXT NOT NULL,
    "lookupKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "metadata" JSONB,
    "content" TEXT NOT NULL,

    CONSTRAINT "AuxiliaryToolData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "categoryId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "schemaJsonLd" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultationOrder" (
    "id" TEXT NOT NULL,
    "orderType" TEXT NOT NULL,
    "sessionKey" TEXT,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'cho',
    "isManualUnlock" BOOLEAN NOT NULL DEFAULT false,
    "birthPayload" JSONB NOT NULL,
    "partnerPayload" JSONB,
    "topic" TEXT DEFAULT 'tongquan',
    "readingResult" JSONB,
    "questionsLeft" INTEGER NOT NULL DEFAULT 0,
    "chatHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConsultationOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SectionFeedback" (
    "id" TEXT NOT NULL,
    "kieu" TEXT NOT NULL,
    "muc" TEXT NOT NULL,
    "diem" INTEGER NOT NULL,
    "lyDo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SectionFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisitorSession" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "customerId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceType" TEXT,
    "os" TEXT,
    "browser" TEXT,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageEvent" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT,
    "fullName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "zaloId" TEXT,
    "gender" "GioiTinh",
    "solarBirthDate" TIMESTAMP(3),
    "lunarBirthInfo" JSONB,
    "leadScore" INTEGER NOT NULL DEFAULT 1,
    "tags" TEXT[],
    "adminNotes" TEXT,
    "chartIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAgent" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "modelProvider" TEXT NOT NULL DEFAULT 'openai',
    "modelName" TEXT NOT NULL DEFAULT 'gpt-4o',
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.6,
    "systemPrompt" TEXT NOT NULL,
    "welcomeMessage" TEXT NOT NULL,
    "suggestedQuestions" TEXT[],
    "voiceProvider" TEXT NOT NULL DEFAULT 'edge_or_neural',
    "voiceId" TEXT NOT NULL DEFAULT 'vi-VN-NamMinhNeural',
    "voiceSpeed" DOUBLE PRECISION NOT NULL DEFAULT 0.95,
    "voicePitch" TEXT NOT NULL DEFAULT 'default',
    "ambientTrackUrl" TEXT DEFAULT '/audio/bgm/co-cam-thien-dinh.mp3',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentKnowledgeDoc" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "rawContent" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INDEXED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentKnowledgeDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentKnowledgeChunk" (
    "id" TEXT NOT NULL,
    "docId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "embedding" vector(1536),

    CONSTRAINT "AgentKnowledgeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatConversation" (
    "id" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'SINGLE_AGENT',
    "title" TEXT,
    "agentId" TEXT NOT NULL,
    "participantSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "customerId" TEXT,
    "activeChartId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "senderAgentSlug" TEXT,
    "senderName" TEXT,
    "senderAvatar" TEXT,
    "senderBadge" TEXT,
    "content" TEXT NOT NULL,
    "citedSources" JSONB,
    "tokenUsage" INTEGER,
    "audioUrl" TEXT,
    "audioDuration" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "R1Event" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "coGioSinh" BOOLEAN,
    "utmSource" TEXT NOT NULL DEFAULT '(trực tiếp)',
    "utmMedium" TEXT NOT NULL DEFAULT '',
    "utmCampaign" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "R1Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "R1Lead" (
    "id" TEXT NOT NULL,
    "emailHoacZalo" TEXT NOT NULL,
    "nutGiaDaBam" TEXT NOT NULL,
    "utmSource" TEXT NOT NULL DEFAULT '(trực tiếp)',
    "utmMedium" TEXT NOT NULL DEFAULT '',
    "utmCampaign" TEXT NOT NULL DEFAULT '',
    "dongYLuc" TIMESTAMP(3) NOT NULL,
    "hanXoa" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "R1Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HoroscopeChart_slug_key" ON "HoroscopeChart"("slug");

-- CreateIndex
CREATE INDEX "HoroscopeChart_solarYear_solarMonth_solarDay_gioDiaChi_gend_idx" ON "HoroscopeChart"("solarYear", "solarMonth", "solarDay", "gioDiaChi", "gender");

-- CreateIndex
CREATE INDEX "HoroscopeChart_slug_idx" ON "HoroscopeChart"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Star_code_key" ON "Star"("code");

-- CreateIndex
CREATE INDEX "StarInterpretation_cungChucNang_starId_idx" ON "StarInterpretation"("cungChucNang", "starId");

-- CreateIndex
CREATE UNIQUE INDEX "StarInterpretation_starId_cungChucNang_diaChi_trangThai_gen_key" ON "StarInterpretation"("starId", "cungChucNang", "diaChi", "trangThai", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "CachCucInterpretation_code_key" ON "CachCucInterpretation"("code");

-- CreateIndex
CREATE INDEX "AuxiliaryToolData_toolType_lookupKey_idx" ON "AuxiliaryToolData"("toolType", "lookupKey");

-- CreateIndex
CREATE UNIQUE INDEX "AuxiliaryToolData_toolType_lookupKey_key" ON "AuxiliaryToolData"("toolType", "lookupKey");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_slug_idx" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_categoryId_isPublished_idx" ON "Post"("categoryId", "isPublished");

-- CreateIndex
CREATE INDEX "ConsultationOrder_sessionKey_idx" ON "ConsultationOrder"("sessionKey");

-- CreateIndex
CREATE INDEX "ConsultationOrder_status_idx" ON "ConsultationOrder"("status");

-- CreateIndex
CREATE INDEX "SectionFeedback_kieu_muc_idx" ON "SectionFeedback"("kieu", "muc");

-- CreateIndex
CREATE INDEX "VisitorSession_visitorId_idx" ON "VisitorSession"("visitorId");

-- CreateIndex
CREATE INDEX "VisitorSession_startedAt_idx" ON "VisitorSession"("startedAt");

-- CreateIndex
CREATE INDEX "PageEvent_eventType_createdAt_idx" ON "PageEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "PageEvent_path_idx" ON "PageEvent"("path");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_visitorId_key" ON "CustomerProfile"("visitorId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_phone_key" ON "CustomerProfile"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_email_key" ON "CustomerProfile"("email");

-- CreateIndex
CREATE INDEX "CustomerProfile_phone_email_idx" ON "CustomerProfile"("phone", "email");

-- CreateIndex
CREATE INDEX "CustomerProfile_createdAt_idx" ON "CustomerProfile"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AiAgent_slug_key" ON "AiAgent"("slug");

-- CreateIndex
CREATE INDEX "AgentKnowledgeChunk_docId_idx" ON "AgentKnowledgeChunk"("docId");

-- CreateIndex
CREATE INDEX "ChatConversation_mode_status_updatedAt_idx" ON "ChatConversation"("mode", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "ChatConversation_customerId_updatedAt_idx" ON "ChatConversation"("customerId", "updatedAt");

-- CreateIndex
CREATE INDEX "ChatMessage_conversationId_createdAt_idx" ON "ChatMessage"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "R1Event_eventName_createdAt_idx" ON "R1Event"("eventName", "createdAt");

-- CreateIndex
CREATE INDEX "R1Event_utmSource_eventName_idx" ON "R1Event"("utmSource", "eventName");

-- CreateIndex
CREATE INDEX "R1Event_sessionId_idx" ON "R1Event"("sessionId");

-- CreateIndex
CREATE INDEX "R1Lead_hanXoa_idx" ON "R1Lead"("hanXoa");

-- CreateIndex
CREATE INDEX "R1Lead_utmSource_idx" ON "R1Lead"("utmSource");

-- AddForeignKey
ALTER TABLE "StarInterpretation" ADD CONSTRAINT "StarInterpretation_starId_fkey" FOREIGN KEY ("starId") REFERENCES "Star"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorSession" ADD CONSTRAINT "VisitorSession_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageEvent" ADD CONSTRAINT "PageEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VisitorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentKnowledgeDoc" ADD CONSTRAINT "AgentKnowledgeDoc_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AiAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentKnowledgeChunk" ADD CONSTRAINT "AgentKnowledgeChunk_docId_fkey" FOREIGN KEY ("docId") REFERENCES "AgentKnowledgeDoc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatConversation" ADD CONSTRAINT "ChatConversation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "AiAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatConversation" ADD CONSTRAINT "ChatConversation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ChatConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

