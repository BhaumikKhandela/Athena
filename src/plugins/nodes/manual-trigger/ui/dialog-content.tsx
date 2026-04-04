"use client";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PluginDialogProps } from "@/plugins/plugin-dialog-types";

/** Body only: parent `GenericNodeCard` owns `Dialog` / `DialogContent`. */
export function ManualTriggerDialogContent({
  onOpenChange,
  nodeId: _nodeId,
  workflowId: _workflowId,
  data: _data,
  open: _open,
}: PluginDialogProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Manual Trigger</DialogTitle>
        <DialogDescription>
          Configure settings for the manual trigger node.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <p className="text-sm text-muted-foreground">
          Used to manually execute a workflow; no configuration required.
        </p>
        <button
          type="button"
          className="mt-4 text-sm text-primary underline"
          onClick={() => onOpenChange(false)}
        >
          Close
        </button>
      </div>
    </>
  );
}
