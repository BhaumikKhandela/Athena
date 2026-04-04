"use client";

import type { ComponentType } from "react";
import { GoogleFormTriggerDialogContent } from "@/plugins/nodes/google-form-trigger/ui/dialog-content";
import { ManualTriggerDialogContent } from "@/plugins/nodes/manual-trigger/ui/dialog-content";
import { StripeTriggerDialogContent } from "@/plugins/nodes/stripe-trigger/ui/dialog-content";
import type { PluginDialogId, PluginDialogProps } from "@/plugins/types";

export const pluginDialogOverrides: Record<
  PluginDialogId,
  ComponentType<PluginDialogProps>
> = {
  manualTrigger: ManualTriggerDialogContent,
  googleForm: GoogleFormTriggerDialogContent,
  stripe: StripeTriggerDialogContent,
};

export function getPluginDialogOverride(
  id: PluginDialogId | undefined,
): ComponentType<PluginDialogProps> | undefined {
  if (!id) {
    return undefined;
  }
  return pluginDialogOverrides[id];
}
