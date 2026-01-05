import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useSecretsParams } from "./use-secrets-params";
import { toast } from "sonner";

/**
 * Hook to fetch secrets using suspense
 */
export const useSuspenseSecrets = () => {
  const trpc = useTRPC();
  const [params] = useSecretsParams();
  return useSuspenseQuery(trpc.webhooks.getMany.queryOptions(params));
};

/**
 * Hook to create a new Secret
 */
export const useCreateSecret = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.webhooks.create.mutationOptions({
      onSuccess: (data, variables) => {
        const { provider, workflowId } = variables;
        toast.success(`${data.name} secret created for ${data.provider}`);
        queryClient.invalidateQueries(trpc.webhooks.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.webhooks.getByProvider.queryOptions({ provider, workflowId })
        );
      },
      onError: (error) => {
        toast.error(`Failed to create secret: ${error?.message}`);
      },
    })
  );
};

/**
 * Hook to remove a secret
 */

export const useRemoveSecret = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.webhooks.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`${data.name} removed successfully`);
        queryClient.invalidateQueries(trpc.webhooks.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.webhooks.getOne.queryFilter({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove secret: ${error?.message}`);
      },
    })
  );
};
/**
 * Hook to update a secret
 */

export const useUpdateSecret = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.webhooks.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Secret ${data.name} saved`);
        queryClient.invalidateQueries(trpc.webhooks.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.webhooks.getOne.queryFilter({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to update the secret: ${error?.message}`);
      },
    })
  );
};

/**
 * Hook to fetch a single credential using suspense
 */

export const useSuspenseSecret = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.webhooks.getOne.queryOptions({ id }));
};
