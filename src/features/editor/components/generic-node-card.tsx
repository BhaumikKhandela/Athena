"use client";

import { type NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import { InitialNode } from "@/components/initial-node";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPluginIconForBaseNode } from "@/features/editor/lib/node-icon";
import type { NodeRealtimeConfig } from "@/features/editor/lib/node-realtime";
import { getNodeRealtimeConfig } from "@/features/editor/lib/node-realtime";
import { getNodeSummary } from "@/features/editor/lib/node-summary";
import { BaseExecutionNode } from "@/features/executions/components/base-execution-node";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { NODE_TYPE, type NodeTypeId } from "@/plugins/node-type-ids";
import { GoogleFormTrigger } from "@/plugins/nodes/google-form-trigger/ui/node";
import { ManualTriggerNode } from "@/plugins/nodes/manual-trigger/ui/node";
import { StripeTriggerNode } from "@/plugins/nodes/stripe-trigger/ui/node";
import { getNodePlugin } from "@/plugins/registry";
import type { NodePluginDefinition } from "@/plugins/types";
import { DynamicNodeSettings } from "./dynamic-node-settings";

type SchemaInnerProps = NodeProps & {
  plugin: NodePluginDefinition;
  status: React.ComponentProps<typeof BaseExecutionNode>["status"];
};

const SchemaActionNodeInner = memo(
  ({ id, plugin, data, status, ...props }: SchemaInnerProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow();
    const nodeData = (data ?? {}) as Record<string, unknown>;

    const description = getNodeSummary(plugin.id, nodeData);
    const icon = getPluginIconForBaseNode(plugin.icon);

    const handleSubmit = (values: Record<string, unknown>) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                ...values,
              },
            };
          }
          return node;
        }),
      );
      setDialogOpen(false);
    };

    const handleOpenSettings = () => setDialogOpen(true);

    return (
      <>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{plugin.displayName}</DialogTitle>
              <DialogDescription>
                Configure this node. Save the workflow from the toolbar to
                persist.
              </DialogDescription>
            </DialogHeader>
            {plugin.properties.length > 0 ? (
              <DynamicNodeSettings
                open={dialogOpen}
                properties={plugin.properties}
                defaultValues={nodeData}
                onSubmit={handleSubmit}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No settings for this node.
              </p>
            )}
          </DialogContent>
        </Dialog>
        <BaseExecutionNode
          {...props}
          id={id}
          data={data}
          icon={icon}
          name={plugin.displayName}
          description={description}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
          status={status}
        />
      </>
    );
  },
);

SchemaActionNodeInner.displayName = "SchemaActionNodeInner";

const SchemaActionNodeSubscribed = memo(
  (
    props: NodeProps & {
      plugin: NodePluginDefinition;
      rt: NodeRealtimeConfig;
    },
  ) => {
    const nodeStatus = useNodeStatus({
      nodeId: props.id,
      channel: props.rt.channel,
      topic: "status",
      refreshToken: props.rt.refreshToken,
    });

    return (
      <SchemaActionNodeInner
        {...props}
        plugin={props.plugin}
        status={nodeStatus}
      />
    );
  },
);

SchemaActionNodeSubscribed.displayName = "SchemaActionNodeSubscribed";

const SchemaActionNode = memo((props: NodeProps) => {
  const t = props.type as NodeTypeId;
  const plugin = getNodePlugin(t);
  const rt = getNodeRealtimeConfig(t);

  if (!plugin) {
    return null;
  }

  if (rt) {
    return <SchemaActionNodeSubscribed {...props} plugin={plugin} rt={rt} />;
  }

  return <SchemaActionNodeInner {...props} plugin={plugin} status="initial" />;
});

SchemaActionNode.displayName = "SchemaActionNode";

export const GenericNodeCard = memo((props: NodeProps) => {
  const t = props.type as NodeTypeId;

  switch (t) {
    case NODE_TYPE.INITIAL:
      return <InitialNode {...props} />;
    case NODE_TYPE.MANUAL_TRIGGER:
      return <ManualTriggerNode {...props} />;
    case NODE_TYPE.GOOGLE_FORM_TRIGGER:
      return <GoogleFormTrigger {...props} />;
    case NODE_TYPE.STRIPE_TRIGGER:
      return <StripeTriggerNode {...props} />;
    default:
      return <SchemaActionNode {...props} />;
  }
});

GenericNodeCard.displayName = "GenericNodeCard";
