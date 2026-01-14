import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";

/**
 * Prefetch all Signing Secrets
 */

type Input = inferInput<typeof trpc.webhooks.getMany>;
export const prefetchSigningSecrets = (params: Input) => {
  return prefetch(trpc.webhooks.getMany.queryOptions(params));
};

/**
 * Prefetch a single Signing Secret
 */

export const prefetchSigningSecret = (id: string) => {
  return prefetch(trpc.webhooks.getOne.queryOptions({ id }));
};
