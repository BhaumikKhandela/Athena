import { NODE_TYPE } from "@/plugins/node-type-ids";
import { getNodePlugin } from "@/plugins/registry";

function truncate(s: string, max: number): string {
  if (s.length <= max) {
    return s;
  }
  return `${s.slice(0, max)}...`;
}

/**
 * Subtitle text for the workflow node card (mirrors previous per-node copy).
 */
export function getNodeSummary(
  type: string | undefined,
  data: Record<string, unknown> | undefined,
): string {
  if (!type || !data) {
    return "Not configured";
  }

  const plugin = getNodePlugin(type);
  if (plugin?.summaryFields?.length) {
    for (const key of plugin.summaryFields) {
      const v = data[key];
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        if (type === NODE_TYPE.HTTP_REQUEST && key === "endpoint") {
          const method = (data.method as string) || "GET";
          return `${method}: ${String(v)}`;
        }
        if (key === "userPrompt") {
          return `gpt: ${truncate(String(v), 50)}`;
        }
        return truncate(String(v), 80);
      }
    }
  }

  switch (type) {
    case NODE_TYPE.HTTP_REQUEST: {
      const endpoint = data.endpoint;
      if (typeof endpoint === "string" && endpoint) {
        const method = (data.method as string) || "GET";
        return `${method}: ${endpoint}`;
      }
      break;
    }
    case NODE_TYPE.OPENAI:
    case NODE_TYPE.GEMINI:
    case NODE_TYPE.ANTHROPIC: {
      const prompt = data.userPrompt;
      if (typeof prompt === "string" && prompt) {
        return `gpt: ${truncate(prompt, 50)}`;
      }
      break;
    }
    case NODE_TYPE.DISCORD: {
      const c = data.content;
      if (typeof c === "string" && c) {
        return truncate(c, 80);
      }
      break;
    }
    case NODE_TYPE.SLACK: {
      const c = data.content;
      if (typeof c === "string" && c) {
        return truncate(c, 80);
      }
      break;
    }
    case NODE_TYPE.STRIPE_TRIGGER: {
      const sid = data.secretId;
      return sid ? "Configured" : "Not configured";
    }
    default:
      break;
  }

  if (plugin?.cardSubtitle) {
    return plugin.cardSubtitle;
  }

  return "Not configured";
}
