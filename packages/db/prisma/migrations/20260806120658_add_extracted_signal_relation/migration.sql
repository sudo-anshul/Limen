-- AddForeignKey
ALTER TABLE "ExtractedSignal" ADD CONSTRAINT "ExtractedSignal_auditRunId_fkey" FOREIGN KEY ("auditRunId") REFERENCES "AuditRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
