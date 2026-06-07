-- CreateTable
CREATE TABLE "Collaborator" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Professional" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WorkflowPhase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workflowId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "technicalKey" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "color" TEXT,
    "isInitial" BOOLEAN NOT NULL DEFAULT false,
    "isFinal" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkflowPhase_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkflowTransition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workflowId" TEXT NOT NULL,
    "fromPhaseId" TEXT NOT NULL,
    "toPhaseId" TEXT NOT NULL,
    "actionLabel" TEXT NOT NULL,
    "technicalKey" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkflowTransition_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkflowTransition_fromPhaseId_fkey" FOREIGN KEY ("fromPhaseId") REFERENCES "WorkflowPhase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkflowTransition_toPhaseId_fkey" FOREIGN KEY ("toPhaseId") REFERENCES "WorkflowPhase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ConfigurableField" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scope" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "phaseId" TEXT,
    "label" TEXT NOT NULL,
    "technicalKey" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "showInTable" BOOLEAN NOT NULL DEFAULT false,
    "useInFilters" BOOLEAN NOT NULL DEFAULT false,
    "includeInExport" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "dropdownMenuId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ConfigurableField_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "WorkflowPhase" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ConfigurableField_dropdownMenuId_fkey" FOREIGN KEY ("dropdownMenuId") REFERENCES "DropdownMenu" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DropdownMenu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "technicalKey" TEXT NOT NULL,
    "scope" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DropdownOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menuId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "triggersPecBlock" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DropdownOption_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "DropdownMenu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Practice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collaboratorId" TEXT,
    "professionalId" TEXT,
    "workflowId" TEXT NOT NULL,
    "currentPhaseId" TEXT NOT NULL,
    "activityType" TEXT,
    "hearingDate" DATETIME,
    "depositDate" DATETIME,
    "office" TEXT,
    "judicialAuthority" TEXT,
    "requestedAmount" DECIMAL,
    "grantedAmount" DECIMAL,
    "invoicedAmount" DECIMAL,
    "liquidatedAmount" DECIMAL,
    "notes" TEXT,
    "customData" JSONB,
    "deletedAt" DATETIME,
    "deletedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Practice_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "Collaborator" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Practice_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Practice_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Practice_currentPhaseId_fkey" FOREIGN KEY ("currentPhaseId") REFERENCES "WorkflowPhase" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PracticeHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "practiceId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fromPhaseId" TEXT,
    "toPhaseId" TEXT,
    "data" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PracticeHistory_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PracticeHistory_fromPhaseId_fkey" FOREIGN KEY ("fromPhaseId") REFERENCES "WorkflowPhase" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PracticeHistory_toPhaseId_fkey" FOREIGN KEY ("toPhaseId") REFERENCES "WorkflowPhase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PracticeDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "practiceId" TEXT NOT NULL,
    "phaseId" TEXT,
    "documentType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER,
    "storagePath" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "PracticeDocument_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PracticeDocument_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "WorkflowPhase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PecRecipient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "practiceId" TEXT NOT NULL,
    "phaseId" TEXT,
    "contextKey" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "sentAt" DATETIME,
    "subject" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PecRecipient_practiceId_fkey" FOREIGN KEY ("practiceId") REFERENCES "Practice" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PecRecipient_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "WorkflowPhase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Collaborator_deletedAt_idx" ON "Collaborator"("deletedAt");

-- CreateIndex
CREATE INDEX "Collaborator_isActive_idx" ON "Collaborator"("isActive");

-- CreateIndex
CREATE INDEX "Professional_deletedAt_idx" ON "Professional"("deletedAt");

-- CreateIndex
CREATE INDEX "Professional_isActive_idx" ON "Professional"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_name_key" ON "Workflow"("name");

-- CreateIndex
CREATE INDEX "Workflow_isActive_idx" ON "Workflow"("isActive");

-- CreateIndex
CREATE INDEX "Workflow_isDefault_idx" ON "Workflow"("isDefault");

-- CreateIndex
CREATE INDEX "WorkflowPhase_workflowId_order_idx" ON "WorkflowPhase"("workflowId", "order");

-- CreateIndex
CREATE INDEX "WorkflowPhase_deletedAt_idx" ON "WorkflowPhase"("deletedAt");

-- CreateIndex
CREATE INDEX "WorkflowPhase_isActive_idx" ON "WorkflowPhase"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowPhase_workflowId_technicalKey_key" ON "WorkflowPhase"("workflowId", "technicalKey");

-- CreateIndex
CREATE INDEX "WorkflowTransition_workflowId_order_idx" ON "WorkflowTransition"("workflowId", "order");

-- CreateIndex
CREATE INDEX "WorkflowTransition_fromPhaseId_idx" ON "WorkflowTransition"("fromPhaseId");

-- CreateIndex
CREATE INDEX "WorkflowTransition_toPhaseId_idx" ON "WorkflowTransition"("toPhaseId");

-- CreateIndex
CREATE INDEX "WorkflowTransition_isActive_idx" ON "WorkflowTransition"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowTransition_workflowId_technicalKey_key" ON "WorkflowTransition"("workflowId", "technicalKey");

-- CreateIndex
CREATE INDEX "ConfigurableField_scope_idx" ON "ConfigurableField"("scope");

-- CreateIndex
CREATE INDEX "ConfigurableField_phaseId_idx" ON "ConfigurableField"("phaseId");

-- CreateIndex
CREATE INDEX "ConfigurableField_dropdownMenuId_idx" ON "ConfigurableField"("dropdownMenuId");

-- CreateIndex
CREATE INDEX "ConfigurableField_sectionKey_order_idx" ON "ConfigurableField"("sectionKey", "order");

-- CreateIndex
CREATE INDEX "ConfigurableField_deletedAt_idx" ON "ConfigurableField"("deletedAt");

-- CreateIndex
CREATE INDEX "ConfigurableField_isActive_idx" ON "ConfigurableField"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "DropdownMenu_technicalKey_key" ON "DropdownMenu"("technicalKey");

-- CreateIndex
CREATE INDEX "DropdownMenu_isActive_idx" ON "DropdownMenu"("isActive");

-- CreateIndex
CREATE INDEX "DropdownMenu_isSystem_idx" ON "DropdownMenu"("isSystem");

-- CreateIndex
CREATE INDEX "DropdownOption_menuId_order_idx" ON "DropdownOption"("menuId", "order");

-- CreateIndex
CREATE INDEX "DropdownOption_deletedAt_idx" ON "DropdownOption"("deletedAt");

-- CreateIndex
CREATE INDEX "DropdownOption_isActive_idx" ON "DropdownOption"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "DropdownOption_menuId_value_key" ON "DropdownOption"("menuId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "Practice_code_key" ON "Practice"("code");

-- CreateIndex
CREATE INDEX "Practice_collaboratorId_idx" ON "Practice"("collaboratorId");

-- CreateIndex
CREATE INDEX "Practice_professionalId_idx" ON "Practice"("professionalId");

-- CreateIndex
CREATE INDEX "Practice_workflowId_idx" ON "Practice"("workflowId");

-- CreateIndex
CREATE INDEX "Practice_currentPhaseId_idx" ON "Practice"("currentPhaseId");

-- CreateIndex
CREATE INDEX "Practice_deletedAt_idx" ON "Practice"("deletedAt");

-- CreateIndex
CREATE INDEX "Practice_depositDate_idx" ON "Practice"("depositDate");

-- CreateIndex
CREATE INDEX "Practice_hearingDate_idx" ON "Practice"("hearingDate");

-- CreateIndex
CREATE INDEX "PracticeHistory_practiceId_idx" ON "PracticeHistory"("practiceId");

-- CreateIndex
CREATE INDEX "PracticeHistory_eventType_idx" ON "PracticeHistory"("eventType");

-- CreateIndex
CREATE INDEX "PracticeHistory_createdAt_idx" ON "PracticeHistory"("createdAt");

-- CreateIndex
CREATE INDEX "PracticeHistory_fromPhaseId_idx" ON "PracticeHistory"("fromPhaseId");

-- CreateIndex
CREATE INDEX "PracticeHistory_toPhaseId_idx" ON "PracticeHistory"("toPhaseId");

-- CreateIndex
CREATE INDEX "PracticeDocument_practiceId_idx" ON "PracticeDocument"("practiceId");

-- CreateIndex
CREATE INDEX "PracticeDocument_phaseId_idx" ON "PracticeDocument"("phaseId");

-- CreateIndex
CREATE INDEX "PracticeDocument_documentType_idx" ON "PracticeDocument"("documentType");

-- CreateIndex
CREATE INDEX "PracticeDocument_deletedAt_idx" ON "PracticeDocument"("deletedAt");

-- CreateIndex
CREATE INDEX "PecRecipient_practiceId_idx" ON "PecRecipient"("practiceId");

-- CreateIndex
CREATE INDEX "PecRecipient_phaseId_idx" ON "PecRecipient"("phaseId");

-- CreateIndex
CREATE INDEX "PecRecipient_contextKey_idx" ON "PecRecipient"("contextKey");

-- CreateIndex
CREATE INDEX "PecRecipient_sentAt_idx" ON "PecRecipient"("sentAt");
