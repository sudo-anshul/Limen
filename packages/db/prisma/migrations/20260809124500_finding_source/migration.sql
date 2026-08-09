-- AlterTable
ALTER TABLE "Finding" ADD COLUMN     "source" TEXT NOT NULL DEFAULT 'llm';

-- Backfill provenance for rows written before this column existed.
-- The pipeline milestone marker was the only non-actionable finding.
UPDATE "Finding" SET "source" = 'system' WHERE "isActionable" = false;

-- Findings carrying the heuristic hero evidence hint came from the rule engine.
UPDATE "Finding"
SET "source" = 'heuristic'
WHERE "isActionable" = true
  AND "evidenceRefsJson"::text LIKE '%"screenshotRegionHint":"hero"%';
