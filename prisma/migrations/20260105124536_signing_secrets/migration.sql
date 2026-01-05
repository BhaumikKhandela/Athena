-- CreateEnum
CREATE TYPE "WebhookProvider" AS ENUM ('STRIPE', 'GOOGLE_FORM');

-- CreateTable
CREATE TABLE "WebhookVerification" (
    "id" TEXT NOT NULL,
    "provider" "WebhookProvider" NOT NULL,
    "name" TEXT NOT NULL,
    "signingSecret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "workflowId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WebhookVerification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WebhookVerification" ADD CONSTRAINT "WebhookVerification_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebhookVerification" ADD CONSTRAINT "WebhookVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
