-- CreateTable
CREATE TABLE "AuditRun" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "trafficChannel" TEXT NOT NULL,
    "desiredAction" TEXT NOT NULL,
    "offer" TEXT NOT NULL,
    "objectionsJson" JSONB NOT NULL,
    "competitorsJson" JSONB,
    "brandVoice" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "verdict" TEXT,
    "confidence" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AuditRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageCapture" (
    "id" TEXT NOT NULL,
    "auditRunId" TEXT NOT NULL,
    "finalUrl" TEXT NOT NULL,
    "title" TEXT,
    "screenshotArtifactId" TEXT,
    "htmlArtifactId" TEXT,
    "viewport" TEXT,
    "statusCode" INTEGER,
    "redirectChainJson" JSONB,
    "captureConfigVersion" TEXT,

    CONSTRAINT "PageCapture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" TEXT NOT NULL,
    "auditRunId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "sha256" TEXT,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Artifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtractedSignal" (
    "id" TEXT NOT NULL,
    "auditRunId" TEXT NOT NULL,
    "pageCaptureId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "valueJson" JSONB NOT NULL,
    "evidenceRefJson" JSONB,

    CONSTRAINT "ExtractedSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Finding" (
    "id" TEXT NOT NULL,
    "auditRunId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "confidence" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "whyItMatters" TEXT NOT NULL,
    "likelyReaction" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "evidenceRefsJson" JSONB NOT NULL,
    "priorityRank" INTEGER NOT NULL,

    CONSTRAINT "Finding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonaReplay" (
    "id" TEXT NOT NULL,
    "auditRunId" TEXT NOT NULL,
    "personaName" TEXT NOT NULL,
    "mindset" TEXT NOT NULL,
    "firstImpression" TEXT NOT NULL,
    "confusionPoint" TEXT NOT NULL,
    "trustHesitation" TEXT NOT NULL,
    "dropoffReason" TEXT NOT NULL,
    "resolutionSuggestion" TEXT NOT NULL,

    CONSTRAINT "PersonaReplay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewriteSuggestion" (
    "id" TEXT NOT NULL,
    "auditRunId" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "originalText" TEXT NOT NULL,
    "suggestion" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "audienceFitNote" TEXT NOT NULL,

    CONSTRAINT "RewriteSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyzerExecution" (
    "id" TEXT NOT NULL,
    "auditRunId" TEXT NOT NULL,
    "analyzerName" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "inputRefJson" JSONB,
    "outputJson" JSONB,
    "durationMs" INTEGER,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyzerExecution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PageCapture" ADD CONSTRAINT "PageCapture_auditRunId_fkey" FOREIGN KEY ("auditRunId") REFERENCES "AuditRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtractedSignal" ADD CONSTRAINT "ExtractedSignal_pageCaptureId_fkey" FOREIGN KEY ("pageCaptureId") REFERENCES "PageCapture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Finding" ADD CONSTRAINT "Finding_auditRunId_fkey" FOREIGN KEY ("auditRunId") REFERENCES "AuditRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonaReplay" ADD CONSTRAINT "PersonaReplay_auditRunId_fkey" FOREIGN KEY ("auditRunId") REFERENCES "AuditRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewriteSuggestion" ADD CONSTRAINT "RewriteSuggestion_auditRunId_fkey" FOREIGN KEY ("auditRunId") REFERENCES "AuditRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyzerExecution" ADD CONSTRAINT "AnalyzerExecution_auditRunId_fkey" FOREIGN KEY ("auditRunId") REFERENCES "AuditRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
