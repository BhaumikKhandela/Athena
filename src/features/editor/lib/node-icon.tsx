import type { LucideIcon } from "lucide-react";
import { Globe, MousePointer } from "lucide-react";

const LUCIDE_BY_KEY: Record<string, LucideIcon> = {
  globe: Globe,
  "mouse-pointer": MousePointer,
};

/**
 * Value accepted by [`BaseExecutionNode`](/src/features/executions/components/base-execution-node.tsx):
 * image URL string or Lucide component.
 */
export function getPluginIconForBaseNode(icon: string): LucideIcon | string {
  if (icon.startsWith("/")) {
    return icon;
  }
  if (icon.startsWith("lucide:")) {
    const key = icon.slice("lucide:".length);
    const Lucide = LUCIDE_BY_KEY[key];
    if (Lucide) {
      return Lucide;
    }
  }
  return Globe;
}
