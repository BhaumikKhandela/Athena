"use client";

import { formatDistanceToNow } from "date-fns";
import {
  EmptyView,
  EntityContainer,
  EntityHeaders,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import React from "react";
import { useRouter } from "next/navigation";
import { useEntitySearch } from "@/hooks/use-entity-search";
import Image from "next/image";
import {
  WebhookProvider,
  type WebhookVerification,
} from "@/generated/prisma/browser";
import { useSecretsParams } from "../hooks/use-secrets-params";
import { useRemoveSecret, useSuspenseSecrets } from "../hooks/use-secrets";

export const SigningSecretsSearch = () => {
  const [params, setParams] = useSecretsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search signing secrets"
    />
  );
};
export const SigningSecretsList = () => {
  const secrets = useSuspenseSecrets();

  return (
    <EntityList
      items={secrets.data.items}
      getKey={(secret) => secret.id}
      renderItem={(secret) => <SigningSecretItem data={secret} />}
      emptyView={<SigningSecretsEmpty />}
    />
  );
};

export const SigningSecretsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <>
      <EntityHeaders
        title="Signing Secrets"
        description="Create and manage your signing secrets"
        newButtonHref={"/webhooks/new"}
        newButtonLabel="New secret"
        disabled={disabled}
      />
    </>
  );
};

export const SigningSecretsPagination = () => {
  const secrets = useSuspenseSecrets();
  const [params, setParams] = useSecretsParams();

  return (
    <EntityPagination
      disabled={secrets.isFetching}
      totalPages={secrets.data.totalPages}
      page={secrets.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const SigningSecretsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<SigningSecretsHeader />}
      search={<SigningSecretsSearch />}
      pagination={<SigningSecretsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const SigningSecretsLoading = () => {
  return <LoadingView message="Loading Signing Secrets" />;
};

export const SigningSecretsError = () => {
  return <ErrorView message="Error loading Signing Secrets" />;
};

export const SigningSecretsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
    router.push(`/webhooks/new`);
  };
  return (
    <EmptyView
      onNew={handleCreate}
      message="You do not have any Signing Secret."
    />
  );
};

const providerLogos: Record<WebhookProvider, string> = {
  [WebhookProvider.STRIPE]: "/logos/stripe.svg",
  [WebhookProvider.GOOGLE_FORM]: "/logos/googleform.svg",
};

export const SigningSecretItem = ({ data }: { data: WebhookVerification }) => {
  const removeSecret = useRemoveSecret();

  const handleRemove = () => {
    removeSecret.mutate({ id: data.id });
  };

  const logo = providerLogos[data.provider] || "/logos/stripe.svg";

  return (
    <EntityItem
      href={`/webhooks/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image src={logo} alt={data.provider} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeSecret.isPending}
    />
  );
};
