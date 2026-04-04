"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useEffect, useMemo } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { NodeProperty } from "@/plugins/types";

const CREDENTIAL_LOGO_BY_TYPE: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/logos/openai.svg",
  [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
  [CredentialType.GEMINI]: "/logos/gemini.svg",
};

function buildZodSchema(properties: NodeProperty[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const p of properties) {
    const label = p.displayName;
    const required = p.required !== false;

    switch (p.type) {
      case "string": {
        if (required) {
          let s = z.string().min(1, { message: `${label} is required` });
          if (p.pattern) {
            s = s.regex(new RegExp(p.pattern), {
              message: `${label} has an invalid format`,
            });
          }
          if (p.minLength != null) {
            s = s.min(p.minLength);
          }
          if (p.maxLength != null) {
            s = s.max(p.maxLength);
          }
          shape[p.name] = s;
        } else {
          let s = z.string();
          if (p.maxLength != null) {
            s = s.max(p.maxLength);
          }
          shape[p.name] = s.optional();
        }
        break;
      }
      case "number": {
        shape[p.name] = required
          ? z.coerce.number().refine((n) => !Number.isNaN(n), {
              message: `${label} is required`,
            })
          : z.coerce.number().optional();
        break;
      }
      case "boolean": {
        shape[p.name] = z.boolean();
        break;
      }
      case "options": {
        const values = p.options.map((o) => o.value);
        const tuple = values as [string, ...string[]];
        shape[p.name] = required
          ? z.enum(tuple, { message: `${label} is required` })
          : z.enum(tuple).optional();
        break;
      }
      case "credential": {
        shape[p.name] = required
          ? z.string().min(1, { message: `${label} is required` })
          : z.string().optional();
        break;
      }
      case "webhook-display":
      case "manual-execution-info":
        break;
      default:
        break;
    }
  }

  return z.object(shape);
}

function defaultValuesForProperties(
  properties: NodeProperty[],
  existing: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const p of properties) {
    const prev = existing?.[p.name];
    switch (p.type) {
      case "string":
        out[p.name] = typeof prev === "string" ? prev : "";
        break;
      case "number":
        out[p.name] =
          typeof prev === "number"
            ? prev
            : prev === undefined || prev === ""
              ? ""
              : Number(prev);
        break;
      case "boolean":
        out[p.name] = typeof prev === "boolean" ? prev : false;
        break;
      case "options":
        out[p.name] =
          typeof prev === "string" && prev ? prev : (p.options[0]?.value ?? "");
        break;
      case "credential":
        out[p.name] = typeof prev === "string" ? prev : "";
        break;
      case "webhook-display":
      case "manual-execution-info":
        break;
      default:
        break;
    }
  }
  return out;
}

function CredentialSelectField({
  property,
  disabled,
}: {
  property: Extract<NodeProperty, { type: "credential" }>;
  disabled?: boolean;
}) {
  const form = useFormContext();
  const { data: credentials, isLoading } = useCredentialsByType(
    property.credentialType,
  );

  const logoSrc = CREDENTIAL_LOGO_BY_TYPE[property.credentialType];

  return (
    <FormField
      control={form.control}
      name={property.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{property.displayName}</FormLabel>
          <Select
            disabled={disabled || isLoading}
            onValueChange={field.onChange}
            value={field.value || ""}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a credential" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {credentials?.map((cred) => (
                <SelectItem key={cred.id} value={cred.id}>
                  <div className="flex min-w-0 items-center gap-2">
                    <Image
                      alt=""
                      className="size-[18px] shrink-0"
                      height={18}
                      src={logoSrc}
                      width={18}
                    />
                    <span className="truncate">{cred.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {property.description && (
            <FormDescription>{property.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function VariableNameReferenceHint({
  fallback,
  referencePath = "text",
}: {
  fallback: string;
  /** Dotted path after the variable name, e.g. `httpResponse.data`. */
  referencePath?: string;
}) {
  const raw = useWatch({ name: "variableName" });
  const safe = typeof raw === "string" && raw.trim() ? raw.trim() : fallback;
  return (
    <FormDescription>
      Use this name to reference the result in other nodes:{" "}
      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{`{{${safe}.${referencePath}}}`}</code>
    </FormDescription>
  );
}

function SchemaFieldVisibleWhen({
  when,
  children,
}: {
  when?: { field: string; values: string[] };
  children: ReactNode;
}) {
  if (!when) {
    return <>{children}</>;
  }
  return (
    <SchemaFieldVisibleWhenInner when={when}>
      {children}
    </SchemaFieldVisibleWhenInner>
  );
}

function SchemaFieldVisibleWhenInner({
  when,
  children,
}: {
  when: { field: string; values: string[] };
  children: ReactNode;
}) {
  const value = useWatch({ name: when.field });
  if (!when.values.includes(String(value ?? ""))) {
    return null;
  }
  return <>{children}</>;
}

function WebhookDisplayWidget({
  provider,
  workflowId,
}: {
  provider: "stripe" | "google-form";
  workflowId?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const displayUrl =
    workflowId != null && workflowId !== ""
      ? `${baseUrl}${provider === "stripe" ? `/api/webhooks/stripe?workflowId=${workflowId}` : `/api/webhooks/google-form?workflowId=${workflowId}`}`
      : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  if (!workflowId) {
    return (
      <p className="text-sm text-muted-foreground">
        Webhook URL is available when this workflow is saved and opened from the
        editor.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <FormLabel>
        {provider === "stripe" ? "Stripe" : "Google Form"} webhook URL
      </FormLabel>
      <div className="flex gap-2">
        <Input readOnly className="font-mono text-sm" value={displayUrl} />
        <Button type="button" size="icon" variant="outline" onClick={copy}>
          <CopyIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export interface DynamicNodeSettingsProps {
  properties: NodeProperty[];
  defaultValues?: Record<string, unknown>;
  /** When true, form resets when defaults change (e.g. dialog reopened). */
  open?: boolean;
  onSubmit: (values: Record<string, unknown>) => void;
  /** Required for webhook-display widgets. */
  workflowId?: string;
}

export function DynamicNodeSettings({
  properties,
  defaultValues,
  open,
  onSubmit,
  workflowId,
}: DynamicNodeSettingsProps) {
  const schema = useMemo(() => buildZodSchema(properties), [properties]);

  const defaults = useMemo(
    () => defaultValuesForProperties(properties, defaultValues),
    [properties, defaultValues],
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValuesForProperties(properties, defaultValues));
    }
  }, [open, properties, defaultValues, form]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values as Record<string, unknown>);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {properties.map((p) => (
          <SchemaFieldVisibleWhen key={p.name} when={p.visibleWhen}>
            {(() => {
              if (p.type === "webhook-display") {
                return (
                  <div>
                    <WebhookDisplayWidget
                      provider={p.provider}
                      workflowId={workflowId}
                    />
                    {p.description && (
                      <FormDescription className="mt-2">
                        {p.description}
                      </FormDescription>
                    )}
                  </div>
                );
              }
              if (p.type === "manual-execution-info") {
                return (
                  <div className="rounded-lg border p-3">
                    <p className="text-sm font-medium">{p.displayName}</p>
                    {p.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {p.description}
                      </p>
                    )}
                  </div>
                );
              }
              if (p.type === "credential") {
                return <CredentialSelectField property={p} />;
              }

              if (p.type === "options") {
                return (
                  <FormField
                    control={form.control}
                    name={p.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{p.displayName}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={String(
                            field.value ?? p.options[0]?.value ?? "",
                          )}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {p.options.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {p.description && (
                          <FormDescription>{p.description}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              if (p.type === "boolean") {
                return (
                  <FormField
                    control={form.control}
                    name={p.name}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>{p.displayName}</FormLabel>
                          {p.description && (
                            <FormDescription>{p.description}</FormDescription>
                          )}
                        </div>
                        <FormControl>
                          <Switch
                            checked={Boolean(field.value)}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                );
              }

              if (p.type === "number") {
                return (
                  <FormField
                    control={form.control}
                    name={p.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{p.displayName}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            name={field.name}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            value={
                              field.value === undefined || field.value === null
                                ? ""
                                : String(field.value)
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                              )
                            }
                          />
                        </FormControl>
                        {p.description && (
                          <FormDescription>{p.description}</FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }

              if (p.type !== "string") {
                return null;
              }
              const multiline = p.multiline;
              const isVariableNameField = p.name === "variableName";
              const descMultiline = p.description?.includes("\n") ?? false;
              return (
                <FormField
                  control={form.control}
                  name={p.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{p.displayName}</FormLabel>
                      <FormControl>
                        {multiline ? (
                          <Textarea
                            className={cn(
                              "min-h-[80px] font-mono text-sm",
                              p.textareaClassName,
                            )}
                            name={field.name}
                            onBlur={field.onBlur}
                            placeholder={p.placeholder}
                            ref={field.ref}
                            onChange={field.onChange}
                            value={
                              field.value === undefined || field.value === null
                                ? ""
                                : String(field.value)
                            }
                          />
                        ) : (
                          <Input
                            name={field.name}
                            onBlur={field.onBlur}
                            placeholder={p.placeholder}
                            ref={field.ref}
                            onChange={field.onChange}
                            value={
                              field.value === undefined || field.value === null
                                ? ""
                                : String(field.value)
                            }
                          />
                        )}
                      </FormControl>
                      {isVariableNameField ? (
                        <VariableNameReferenceHint
                          fallback={p.variableNameHintFallback ?? "myNode"}
                          referencePath={p.variableNameReferencePath}
                        />
                      ) : (
                        p.description && (
                          <FormDescription
                            className={
                              descMultiline ? "whitespace-pre-line" : undefined
                            }
                          >
                            {p.description}
                          </FormDescription>
                        )
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })()}
          </SchemaFieldVisibleWhen>
        ))}

        <Button type="submit" className="w-full sm:w-auto">
          Save
        </Button>
      </form>
    </Form>
  );
}
