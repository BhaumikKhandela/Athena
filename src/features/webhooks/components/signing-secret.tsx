"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  useCreateSecret,
  useSuspenseSecret,
  useUpdateSecret,
} from "../hooks/use-secrets";
import { WebhookProvider } from "@/generated/prisma/enums";
import { useState } from "react";
import { useWorkflowSearch } from "../hooks/use-workflow-search";
import { Loader2Icon } from "lucide-react";
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  provider: z.enum(WebhookProvider),
  secret: z.string().min(1, "API key is required"),
  workflowId: z.string().min(1, "Workflow ID is required"),
});

type FormValues = z.infer<typeof formSchema>;

const providerOptions = [
  {
    value: WebhookProvider.STRIPE,
    label: "Stripe",
    logo: "/logos/stripe.svg",
  },
];
interface SecretFormProps {
  initialData?: {
    id?: string;
    name: string;
    provider: WebhookProvider;
    secret: string;
    workflowId: string;
  };
}

export const SigningSecretForm = ({ initialData }: SecretFormProps) => {
  const router = useRouter();
  const createSecret = useCreateSecret();
  const updateSecret = useUpdateSecret();
  const { handleError, modal } = useUpgradeModal();

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      provider: WebhookProvider.STRIPE,
      secret: "",
      workflowId: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && initialData?.id) {
      await updateSecret.mutateAsync({
        id: initialData.id,
        ...values,
      });
    } else {
      await createSecret.mutateAsync(values, {
        onSuccess: (data) => {
          router.push(`/webhooks/${data.id}`);
        },
        onError: (error) => {
          handleError(error);
        },
      });
    }
  };

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const {
    data: workflows,
    isFetching,
    isLoading,
  } = useWorkflowSearch({ search, page });

  const handlePageChange = (e: React.MouseEvent, newPage: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      newPage >= 1 &&
      (!workflows?.totalPages || newPage <= workflows.totalPages)
    ) {
      setPage(newPage);
    }
  };

  return (
    <>
      {modal}
      <Card className="shadow-none ">
        <CardHeader>
          <CardTitle>{isEdit ? "Edit Secret" : "Create Signing Secret"}</CardTitle>
          <CardDescription>
            {isEdit
              ? "Update your Signing Secret"
              : "Add a new Signing Secret to your workflow"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`My Signing Secret`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full ">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providerOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2 ">
                              <Image
                                src={option.logo}
                                alt={option.label}
                                width={16}
                                height={16}
                              />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workflowId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workflow</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full ">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <div className="p-2 sticky top-0 bg-background z-10">
                          <Input
                            placeholder="Search Workflows"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                            className="h-8"
                          />
                        </div>
                        {(isLoading || isFetching) && (
                          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </div>
                        )}
                        {workflows &&
                          workflows.items.length >= 1 &&
                          workflows.items.map((workflow) => (
                            <SelectItem key={workflow.id} value={workflow.id}>
                              <div className="flex items-center gap-2 ">
                                {workflow.name}
                              </div>
                            </SelectItem>
                          ))}
                        {!isLoading && workflows?.items.length === 0 && (
                          <div className="p-4 text-sm text-center text-muted-foreground">
                            No workflows found
                          </div>
                        )}
                        {workflows && workflows.totalPages > 1 && (
                          <div className="p-2 sticky bottom-0 bg-background z-10 flex gap-2">
                            <div>
                              Page {workflows.page} of {workflows.totalPages}
                            </div>
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                disabled={page === 1 || isFetching || isLoading}
                                variant={"outline"}
                                size={"sm"}
                                onClick={(e) => handlePageChange(e, page - 1)}
                              >
                                Previous
                              </Button>
                              <Button
                                disabled={
                                  page === workflows.totalPages ||
                                  workflows.totalPages === 0 ||
                                  isFetching ||
                                  isLoading
                                }
                                variant={"outline"}
                                size={"sm"}
                                onClick={(e) => handlePageChange(e, page + 1)}
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signing Secret</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="sk-..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={createSecret.isPending || updateSecret.isPending}
                >
                  {isEdit ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={"/webhooks"} prefetch>
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export const SigningSecretView = ({
  signingSecretId,
}: {
  signingSecretId: string;
}) => {
  const { data } = useSuspenseSecret(signingSecretId);

  const mappedData = {
    id: data.id,
    name: data.name,
    provider: data.provider,
    secret: data.signingSecret,
    workflowId: data.workflowId,
  };
  return <SigningSecretForm initialData={mappedData} />;
};
