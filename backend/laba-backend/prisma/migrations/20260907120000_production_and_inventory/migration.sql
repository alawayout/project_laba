-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'DONE', 'CANCELED');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('QUEUED', 'IN_PROGRESS', 'AT_CLINIC', 'DONE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "TaskEventType" AS ENUM ('CREATED', 'ASSIGNED', 'REASSIGNED', 'STARTED', 'COMPLETED', 'REOPENED', 'BLOCKED', 'UNBLOCKED');

-- CreateEnum
CREATE TYPE "ConsumableEventType" AS ENUM ('CREATED', 'UPDATED', 'ARCHIVED', 'RESTORED', 'RESTOCKED', 'ADJUSTED');

-- CreateTable
CREATE TABLE "patients" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "externalRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "clinicName" TEXT,
    "phone" TEXT,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_types" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stage_templates" (
    "id" TEXT NOT NULL,
    "workTypeId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slaHours" INTEGER,

    CONSTRAINT "stage_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "workTypeId" TEXT NOT NULL,
    "shade" TEXT,
    "teeth" INTEGER[],
    "comment" TEXT,
    "priority" BOOLEAN NOT NULL DEFAULT false,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fittings" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "note" TEXT,

    CONSTRAINT "fittings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "stepIndex" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" "TaskStatus" NOT NULL DEFAULT 'QUEUED',
    "assigneeId" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "reportComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_events" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "type" "TaskEventType" NOT NULL,
    "actorId" TEXT,
    "toUserId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "uploadedById" TEXT,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumable_items" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitLabel" TEXT NOT NULL,
    "usesPerUnit" INTEGER NOT NULL DEFAULT 1,
    "lowStockThreshold" INTEGER,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "archivedById" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consumable_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumable_stock" (
    "consumableItemId" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "usesRemaining" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consumable_stock_pkey" PRIMARY KEY ("consumableItemId")
);

-- CreateTable
CREATE TABLE "consumable_usage_events" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "consumableItemId" TEXT NOT NULL,
    "taskId" TEXT,
    "usedById" TEXT,
    "quantityUses" INTEGER NOT NULL DEFAULT 1,
    "usesRemainingAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consumable_usage_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consumable_events" (
    "id" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "consumableItemId" TEXT NOT NULL,
    "type" "ConsumableEventType" NOT NULL,
    "actorId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consumable_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "patients_labId_idx" ON "patients"("labId");

-- CreateIndex
CREATE INDEX "doctors_labId_idx" ON "doctors"("labId");

-- CreateIndex
CREATE INDEX "work_types_labId_idx" ON "work_types"("labId");

-- CreateIndex
CREATE UNIQUE INDEX "work_types_labId_name_key" ON "work_types"("labId", "name");

-- CreateIndex
CREATE INDEX "stage_templates_labId_idx" ON "stage_templates"("labId");

-- CreateIndex
CREATE UNIQUE INDEX "stage_templates_workTypeId_stepIndex_key" ON "stage_templates"("workTypeId", "stepIndex");

-- CreateIndex
CREATE INDEX "orders_labId_idx" ON "orders"("labId");

-- CreateIndex
CREATE INDEX "orders_labId_status_idx" ON "orders"("labId", "status");

-- CreateIndex
CREATE INDEX "orders_labId_dueAt_idx" ON "orders"("labId", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "orders_labId_number_key" ON "orders"("labId", "number");

-- CreateIndex
CREATE INDEX "fittings_orderId_idx" ON "fittings"("orderId");

-- CreateIndex
CREATE INDEX "fittings_labId_scheduledAt_idx" ON "fittings"("labId", "scheduledAt");

-- CreateIndex
CREATE INDEX "tasks_orderId_idx" ON "tasks"("orderId");

-- CreateIndex
CREATE INDEX "tasks_labId_assigneeId_idx" ON "tasks"("labId", "assigneeId");

-- CreateIndex
CREATE INDEX "tasks_labId_status_idx" ON "tasks"("labId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_orderId_stepIndex_key" ON "tasks"("orderId", "stepIndex");

-- CreateIndex
CREATE INDEX "task_events_taskId_createdAt_idx" ON "task_events"("taskId", "createdAt");

-- CreateIndex
CREATE INDEX "task_events_labId_idx" ON "task_events"("labId");

-- CreateIndex
CREATE UNIQUE INDEX "photos_storageKey_key" ON "photos"("storageKey");

-- CreateIndex
CREATE INDEX "photos_orderId_idx" ON "photos"("orderId");

-- CreateIndex
CREATE INDEX "photos_labId_idx" ON "photos"("labId");

-- CreateIndex
CREATE INDEX "consumable_items_labId_idx" ON "consumable_items"("labId");

-- CreateIndex
CREATE INDEX "consumable_items_labId_isArchived_idx" ON "consumable_items"("labId", "isArchived");

-- CreateIndex
CREATE UNIQUE INDEX "consumable_items_labId_name_key" ON "consumable_items"("labId", "name");

-- CreateIndex
CREATE INDEX "consumable_stock_labId_idx" ON "consumable_stock"("labId");

-- CreateIndex
CREATE INDEX "consumable_usage_events_consumableItemId_createdAt_idx" ON "consumable_usage_events"("consumableItemId", "createdAt");

-- CreateIndex
CREATE INDEX "consumable_usage_events_labId_createdAt_idx" ON "consumable_usage_events"("labId", "createdAt");

-- CreateIndex
CREATE INDEX "consumable_usage_events_taskId_idx" ON "consumable_usage_events"("taskId");

-- CreateIndex
CREATE INDEX "consumable_events_consumableItemId_createdAt_idx" ON "consumable_events"("consumableItemId", "createdAt");

-- CreateIndex
CREATE INDEX "consumable_events_labId_idx" ON "consumable_events"("labId");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_types" ADD CONSTRAINT "work_types_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_templates" ADD CONSTRAINT "stage_templates_workTypeId_fkey" FOREIGN KEY ("workTypeId") REFERENCES "work_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_templates" ADD CONSTRAINT "stage_templates_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_workTypeId_fkey" FOREIGN KEY ("workTypeId") REFERENCES "work_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fittings" ADD CONSTRAINT "fittings_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fittings" ADD CONSTRAINT "fittings_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_events" ADD CONSTRAINT "task_events_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_events" ADD CONSTRAINT "task_events_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_events" ADD CONSTRAINT "task_events_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_events" ADD CONSTRAINT "task_events_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumable_items" ADD CONSTRAINT "consumable_items_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumable_items" ADD CONSTRAINT "consumable_items_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumable_items" ADD CONSTRAINT "consumable_items_archivedById_fkey" FOREIGN KEY ("archivedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumable_stock" ADD CONSTRAINT "consumable_stock_consumableItemId_fkey" FOREIGN KEY ("consumableItemId") REFERENCES "consumable_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumable_stock" ADD CONSTRAINT "consumable_stock_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumable_usage_events" ADD CONSTRAINT "consumable_usage_events_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumable_usage_events" ADD CONSTRAINT "consumable_usage_events_consumableItemId_fkey" FOREIGN KEY ("consumableItemId") REFERENCES "consumable_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumable_usage_events" ADD CONSTRAINT "consumable_usage_events_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumable_usage_events" ADD CONSTRAINT "consumable_usage_events_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumable_events" ADD CONSTRAINT "consumable_events_labId_fkey" FOREIGN KEY ("labId") REFERENCES "labs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumable_events" ADD CONSTRAINT "consumable_events_consumableItemId_fkey" FOREIGN KEY ("consumableItemId") REFERENCES "consumable_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consumable_events" ADD CONSTRAINT "consumable_events_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Страховка на уровне БД: остаток расходника не может уйти в минус, даже
-- если какой-то будущий код забудет условие `WHERE usesRemaining >= N`.
-- Prisma не описывает CHECK-констрейнты в schema.prisma, но и не трогает их:
-- миграция создаёт его, shadow-БД при проверке дрейфа получает такой же.
ALTER TABLE "consumable_stock" ADD CONSTRAINT "consumable_stock_uses_remaining_non_negative" CHECK ("usesRemaining" >= 0);
