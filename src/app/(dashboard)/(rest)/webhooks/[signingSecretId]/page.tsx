import { SigningSecretView } from "@/features/webhooks/components/signing-secret";
import {
  SigningSecretsError,
  SigningSecretsLoading,
} from "@/features/webhooks/components/signing-secrets";
import { prefetchSigningSecret } from "@/features/webhooks/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
  params: Promise<{
    signingSecretId: string;
  }>;
}
const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { signingSecretId } = await params;
  prefetchSigningSecret(signingSecretId);
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary fallback={<SigningSecretsError />}>
            <Suspense fallback={<SigningSecretsLoading />}>
              <SigningSecretView signingSecretId={signingSecretId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
};

export default Page;
