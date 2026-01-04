
import { WebhookProvider } from "@/generated/prisma/enums";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch signing secret by type
 */

export const useWebhookSecretByProvider = (provider: WebhookProvider, workflowId: string) => {
  const trpc = useTRPC();

  return useQuery(trpc.webhooks.getByProvider.queryOptions({ provider, workflowId }));
};
