import type { NodeTypes } from "@xyflow/react";
import { GenericNodeCard } from "@/features/editor/components/generic-node-card";
import { KNOWN_NODE_TYPE_IDS } from "@/plugins/registry";

export const nodeComponents = Object.fromEntries(
  KNOWN_NODE_TYPE_IDS.map((id) => [id, GenericNodeCard]),
) as unknown as NodeTypes;

export type RegisteredNodeType = (typeof KNOWN_NODE_TYPE_IDS)[number];
