"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWebhookSecretByProvider } from "@/features/triggers/hooks/use-signing-secret";
import { WebhookProvider } from "@/generated/prisma/enums";
import type { PluginDialogProps } from "@/plugins/plugin-dialog-types";

const formSchema = z.object({
  secretId: z.string().min(1, "Credential is required"),
});

export type StripeFormValues = z.infer<typeof formSchema>;

/** Body only: parent owns `Dialog` / `DialogContent`. */
export function StripeTriggerDialogContent({
  open,
  onOpenChange,
  data,
  onSubmit,
  workflowId,
}: PluginDialogProps) {
  const defaultSecretId =
    typeof data.secretId === "string" ? data.secretId : "";

  const { data: signingSecrets, isLoading } = useWebhookSecretByProvider(
    WebhookProvider.STRIPE,
    workflowId,
  );

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      secretId: defaultSecretId,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        secretId: defaultSecretId,
      });
    }
  }, [open, defaultSecretId, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Stripe Trigger Configuration</DialogTitle>
        <DialogDescription>
          Configure this webhook URL in your Stripe Dashboard to trigger this
          workflow on payment events.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <div className="flex gap-2">
            <Input
              id="webhook-url"
              value={webhookUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={copyToClipboard}
            >
              <CopyIcon className="size-4" />
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="secretId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stripe Signing Secret</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading || !signingSecrets?.length}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a secret" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {signingSecrets?.map((secret) => (
                        <SelectItem key={secret.id} value={secret.id}>
                          <div className="flex items-center gap-2">
                            <Image
                              src="/logos/stripe.svg"
                              alt="Stripe"
                              width={16}
                              height={16}
                            />
                            {secret.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="font-medium text-sm">Setup instructions:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Open your Stripe Dashboard</li>
                <li>Go to Developer → Webhooks</li>
                <li>Click &quot;Add endpoint&quot;</li>
                <li>Paste the above webhook URL</li>
                <li>
                  Select events to listen for (e.g., payment_intent_succeeded)
                </li>
                <li>Save and Copy the signing secret</li>
                <li>
                  If this is a new webhook, create a new Stripe Secret
                  credential by pasting the signing secret in Webhooks tab.
                  Otherwise, select an existing one.
                </li>
              </ol>
            </div>

            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="font-medium text-sm">Available Variables</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ">
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{stripe.amount}}"}
                  </code>
                  Payment Amount
                </li>
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{stripe.currency}}"}
                  </code>
                  Currency code
                </li>
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{stripe.customerId}}"}
                  </code>
                  Customer ID
                </li>
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{json stripe}}"}
                  </code>
                  Full Event Data as JSON
                </li>
                <li>
                  <code className="bg-background px-1 py-0.5 rounded">
                    {"{{stripe.eventType}}"}
                  </code>
                  Event Type (e.g., payment_intent_succeeded)
                </li>
              </ul>
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </>
  );
}
