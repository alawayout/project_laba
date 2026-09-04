-- CreateEnum
CREATE TYPE "MembershipEventType" AS ENUM ('CREATED', 'ROLE_CHANGED', 'BLOCKED', 'UNBLOCKED', 'REMOVED', 'RESTORED');

-- AlterTable
ALTER TABLE "lab_memberships" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedById" TEXT;

-- CreateTable
CREATE TABLE "membership_events" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "targetUserId" TEXT NOT NULL,
    "type" "MembershipEventType" NOT NULL,
    "actorId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "membership_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lab_memberships_labId_deletedAt_idx" ON "lab_memberships"("labId", "deletedAt");

-- CreateIndex
CREATE INDEX "membership_events_membershipId_createdAt_idx" ON "membership_events"("membershipId", "createdAt");

-- CreateIndex
CREATE INDEX "membership_events_labId_idx" ON "membership_events"("labId");

-- AddForeignKey
ALTER TABLE "lab_memberships" ADD CONSTRAINT "lab_memberships_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_events" ADD CONSTRAINT "membership_events_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "lab_memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_events" ADD CONSTRAINT "membership_events_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_events" ADD CONSTRAINT "membership_events_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_events" ADD CONSTRAINT "membership_events_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
