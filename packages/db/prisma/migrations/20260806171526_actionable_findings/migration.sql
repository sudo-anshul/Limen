-- AlterTable
ALTER TABLE "Finding" ADD COLUMN     "isActionable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "launchDimension" TEXT,
ADD COLUMN     "mustFixBeforeLaunch" BOOLEAN NOT NULL DEFAULT false;
