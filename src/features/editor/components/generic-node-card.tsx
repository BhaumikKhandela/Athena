"use client";

import { type NodeProps, useReactFlow } from "@xyflow/react";
import { useParams } from "next/navigation";
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
import { getPluginDialogOverride } from "@/plugins/plugin-dialogs";
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
    const params = useParams();
    const workflowId = (params?.workflowId as string) ?? "";
    const nodeData = (data ?? {}) as Record<string, unknown>;

    const description = getNodeSummary(plugin.id, nodeData);
    const icon = getPluginIconForBaseNode(plugin.icon);
    const cardName = plugin.cardTitle ?? plugin.displayName;

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

    const DialogOverride = getPluginDialogOverride(plugin.customDialogId);

    return (
      <>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            {DialogOverride ? (
              <DialogOverride
                nodeId={id}
                workflowId={workflowId}
                data={nodeData}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
              />
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>
                    {plugin.settingsDialogTitle ?? plugin.displayName}
                  </DialogTitle>
                  <DialogDescription>
                    {plugin.settingsDialogDescription ??
                      "Configure this node. Save the workflow from the toolbar to persist."}
                  </DialogDescription>
                </DialogHeader>
                {plugin.properties.length > 0 ? (
                  <DynamicNodeSettings
                    open={dialogOpen}
                    properties={plugin.properties}
                    defaultValues={nodeData}
                    onSubmit={handleSubmit}
                    workflowId={workflowId}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No settings for this node.
                  </p>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
        <BaseExecutionNode
          {...props}
          id={id}
          data={data}
          icon={icon}
          name={cardName}
          description={description}
          onSettings={handleOpenSettings}
          onDoubleClick={handleOpenSettings}
          status={status}
          inputs={plugin.inputs ?? 1}
          outputs={plugin.outputs ?? 1}
          shape={plugin.shape ?? "default"}
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
    default:
      return <SchemaActionNode {...props} />;
  }
});

GenericNodeCard.displayName = "GenericNodeCard";
