/*
  Warnings:

  - A unique constraint covering the columns `[workflowId,provider]` on the table `WebhookVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WebhookVerification_workflowId_provider_key" ON "WebhookVerification"("workflowId", "provider");
