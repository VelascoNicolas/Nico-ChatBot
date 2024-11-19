-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "deletedAt" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "available" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Enterprise" ALTER COLUMN "deletedAt" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "available" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Flow" ALTER COLUMN "deletedAt" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "available" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "deletedAt" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "available" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PricingPlan" ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "available" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "deletedAt" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "available" DROP NOT NULL;
