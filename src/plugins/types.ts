import type { CredentialType } from "@/generated/prisma/enums";

export type NodePropertyType =
  | "string"
  | "number"
  | "boolean"
  | "options"
  | "credential";

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
}
