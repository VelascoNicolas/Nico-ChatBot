-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "deletedAt" SET DEFAULT '9999-12-12 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "Enterprise" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "deletedAt" SET DEFAULT '9999-12-12 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "Flow" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "deletedAt" SET DEFAULT '9999-12-12 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "deletedAt" SET DEFAULT '9999-12-12 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "PricingPlan" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "deletedAt" SET DEFAULT '9999-12-12 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "deletedAt" SET DEFAULT '9999-12-12 00:00:00 +00:00';