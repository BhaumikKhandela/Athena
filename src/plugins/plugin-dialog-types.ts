/** Client-only trigger dialog contracts (no server / Prisma imports). */

export type PluginDialogId = "manualTrigger" | "googleForm" | "stripe";

export type PluginDialogProps = {
  nodeId: string;
  workflowId: string;
  data: Record<string, unknown>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Record<string, unknown>) => void;
};
