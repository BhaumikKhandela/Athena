import {
  SigningSecretsContainer,
  SigningSecretsError,
  SigningSecretsList,
  SigningSecretsLoading,
} from "@/features/webhooks/components/signing-secrets";
import { signingSecretsParamsLoader } from "@/features/webhooks/server/params-loader";
import { prefetchSigningSecrets } from "@/features/webhooks/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  searchParams: Promise<SearchParams>;
};
const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await signingSecretsParamsLoader(searchParams);
  prefetchSigningSecrets(params);
  return (
    <SigningSecretsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<SigningSecretsError />}>
          <Suspense fallback={<SigningSecretsLoading />}>
            <SigningSecretsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </SigningSecretsContainer>
  );
};

export default Page;
