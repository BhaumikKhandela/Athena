"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, useFormContext } from "react-hook-form";
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
import type { NodeProperty } from "@/plugins/types";

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
              <SelectTrigger>
                <SelectValue placeholder="Select a credential" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {credentials?.map((cred) => (
                <SelectItem key={cred.id} value={cred.id}>
                  {cred.name}
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

export interface DynamicNodeSettingsProps {
  properties: NodeProperty[];
  defaultValues?: Record<string, unknown>;
  /** When true, form resets when defaults change (e.g. dialog reopened). */
  open?: boolean;
  onSubmit: (values: Record<string, unknown>) => void;
}

export function DynamicNodeSettings({
  properties,
  defaultValues,
  open,
  onSubmit,
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
        {properties.map((p) => {
          if (p.type === "credential") {
            return <CredentialSelectField key={p.name} property={p} />;
          }

          if (p.type === "options") {
            return (
              <FormField
                key={p.name}
                control={form.control}
                name={p.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{p.displayName}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={String(field.value ?? p.options[0]?.value ?? "")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
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
                key={p.name}
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
                key={p.name}
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

          const multiline = p.type === "string" && p.multiline;
          return (
            <FormField
              key={p.name}
              control={form.control}
              name={p.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{p.displayName}</FormLabel>
                  <FormControl>
                    {multiline ? (
                      <Textarea
                        className="min-h-[80px] font-mono text-sm"
                        name={field.name}
                        onBlur={field.onBlur}
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
                  {p.description && (
                    <FormDescription>{p.description}</FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        <Button type="submit" className="w-full sm:w-auto">
          Save
        </Button>
      </form>
    </Form>
  );
}
