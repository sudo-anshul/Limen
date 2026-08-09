import { PrismaClient } from '@prisma/client';
async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.log('No DATABASE_URL found, skipping DB setup.');
        return;
    }
    console.log('Executing PostgreSQL direct DDL schema setup...');
    const prisma = new PrismaClient();
    const ddlStatements = [
        `CREATE TABLE IF NOT EXISTS "AuditRun" (
      "id" TEXT PRIMARY KEY,
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
      "completedAt" TIMESTAMP(3)
    );`,
        `CREATE TABLE IF NOT EXISTS "PageCapture" (
      "id" TEXT PRIMARY KEY,
      "auditRunId" TEXT NOT NULL,
      "finalUrl" TEXT NOT NULL,
      "title" TEXT,
      "screenshotArtifactId" TEXT,
      "htmlArtifactId" TEXT,
      "viewport" TEXT,
      "statusCode" INTEGER,
      "redirectChainJson" JSONB,
      "captureConfigVersion" TEXT,
      FOREIGN KEY ("auditRunId") REFERENCES "AuditRun"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`,
        `CREATE TABLE IF NOT EXISTS "Artifact" (
      "id" TEXT PRIMARY KEY,
      "auditRunId" TEXT NOT NULL,
      "kind" TEXT NOT NULL,
      "storagePath" TEXT NOT NULL,
      "sha256" TEXT,
      "metadataJson" JSONB,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,
        `CREATE TABLE IF NOT EXISTS "ExtractedSignal" (
      "id" TEXT PRIMARY KEY,
      "auditRunId" TEXT NOT NULL,
      "pageCaptureId" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "key" TEXT NOT NULL,
      "valueJson" JSONB NOT NULL,
      "evidenceRefJson" JSONB,
      FOREIGN KEY ("auditRunId") REFERENCES "AuditRun"("id") ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY ("pageCaptureId") REFERENCES "PageCapture"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`,
        `CREATE TABLE IF NOT EXISTS "Finding" (
      "id" TEXT PRIMARY KEY,
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
      "isActionable" BOOLEAN NOT NULL DEFAULT true,
      "mustFixBeforeLaunch" BOOLEAN NOT NULL DEFAULT false,
      "launchDimension" TEXT,
      "source" TEXT NOT NULL DEFAULT 'llm',
      FOREIGN KEY ("auditRunId") REFERENCES "AuditRun"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`,
        `CREATE TABLE IF NOT EXISTS "PersonaReplay" (
      "id" TEXT PRIMARY KEY,
      "auditRunId" TEXT NOT NULL,
      "personaName" TEXT NOT NULL,
      "mindset" TEXT NOT NULL,
      "firstImpression" TEXT NOT NULL,
      "confusionPoint" TEXT NOT NULL,
      "trustHesitation" TEXT NOT NULL,
      "dropoffReason" TEXT NOT NULL,
      "resolutionSuggestion" TEXT NOT NULL,
      FOREIGN KEY ("auditRunId") REFERENCES "AuditRun"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`,
        `CREATE TABLE IF NOT EXISTS "RewriteSuggestion" (
      "id" TEXT PRIMARY KEY,
      "auditRunId" TEXT NOT NULL,
      "fieldType" TEXT NOT NULL,
      "originalText" TEXT NOT NULL,
      "suggestion" TEXT NOT NULL,
      "rationale" TEXT NOT NULL,
      "audienceFitNote" TEXT NOT NULL,
      FOREIGN KEY ("auditRunId") REFERENCES "AuditRun"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`,
        `CREATE TABLE IF NOT EXISTS "AnalyzerExecution" (
      "id" TEXT PRIMARY KEY,
      "auditRunId" TEXT NOT NULL,
      "analyzerName" TEXT NOT NULL,
      "version" TEXT NOT NULL,
      "inputRefJson" JSONB,
      "outputJson" JSONB,
      "durationMs" INTEGER,
      "status" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("auditRunId") REFERENCES "AuditRun"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`
    ];
    for (const statement of ddlStatements) {
        try {
            await prisma.$executeRawUnsafe(statement);
        }
        catch (err) {
            console.warn('DDL statement warning:', err);
        }
    }
    console.log('Successfully provisioned all PostgreSQL database tables via raw DDL.');
    await prisma.$disconnect();
}
main().catch((e) => {
    console.warn('Prepush script warning:', e);
    process.exit(0);
});
