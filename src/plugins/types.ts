import type { CredentialType } from "@/generated/prisma/enums";

export type NodePropertyType =
  | "string"
  | "number"
  | "boolean"
  | "options"
  | "credential"
  | "webhook-display"
  | "manual-execution-info";

export type NodeCanvasShape = "default" | "trigger";

/** Serializable id for client-only `plugin-dialogs` map (no React in registry.ts). */
export type PluginDialogId = "manualTrigger" | "googleForm" | "stripe";

export type PluginDialogProps = {
  nodeId: string;
  workflowId: string;
  data: Record<string, unknown>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Record<string, unknown>) => void;
};

type NodePropertyBase = {
  name: string;
  displayName: string;
  required?: boolean;
  description?: string;
  /** ECMAScript regex pattern (no leading/trailing slashes). */
  pattern?: string;
  minLength?: number;
  maxLength?: number;
};

export type NodeProperty =
  | (NodePropertyBase & {
      type: "string";
      multiline?: boolean;
    })
  | (NodePropertyBase & {
      type: "number";
    })
  | (NodePropertyBase & {
      type: "boolean";
    })
  | (NodePropertyBase & {
      type: "credential";
      credentialType: CredentialType;
    })
  | (NodePropertyBase & {
      type: "options";
      options: { name: string; value: string }[];
    })
  | (NodePropertyBase & {
      type: "webhook-display";
      provider: "stripe" | "google-form";
    })
  | (NodePropertyBase & {
      type: "manual-execution-info";
    });

export type NodePluginCategory = "Trigger" | "Action";

export interface NodePluginDefinition {
  id: string;
  category: NodePluginCategory;
  displayName: string;
  /** Icon path (`/logos/...`) or `lucide:iconName` for known Lucide icons. */
  icon: string;
  properties: NodeProperty[];
  /** Field names used to build the subtitle on the node card (first non-empty wins). */
  summaryFields?: string[];
  /** Short blurb for the add-node sidebar (node selector). */
  selectorDescription?: string;
  /** Target handles (left). Default 1 for actions. */
  inputs?: number;
  /** Source handles (right). Default 1 for actions. */
  outputs?: number;
  /** Card silhouette; trigger uses left-rounded pill. */
  shape?: NodeCanvasShape;
  /** Full dialog replacement; resolved in client `plugin-dialogs`. */
  customDialogId?: PluginDialogId;
  /** Canvas title override (e.g. manual trigger copy). */
  cardTitle?: string;
  /** Canvas subtitle when summary fields are empty. */
  cardSubtitle?: string;
}
