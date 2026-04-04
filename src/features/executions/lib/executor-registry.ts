import { NODE_TYPE } from "@/plugins/node-type-ids";
import { anthropicExecutor } from "@/plugins/nodes/anthropic/executor";
import { discordExecutor } from "@/plugins/nodes/discord/executor";
import { geminiExecutor } from "@/plugins/nodes/gemini/executor";
import { googleFormTriggerExecutor } from "@/plugins/nodes/google-form-trigger/executor";
import { httpRequestExecutor } from "@/plugins/nodes/http-request/executor";
import { manualTriggerExecutor } from "@/plugins/nodes/manual-trigger/executor";
import { openAiExecutor } from "@/plugins/nodes/openai/executor";
import { slackExecutor } from "@/plugins/nodes/slack/executor";
import { stripeTriggerExecutor } from "@/plugins/nodes/stripe-trigger/executor";
import type { NodeExecutor } from "../types";

export type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const executorRegistry: Record<string, NodeExecutor> = {
  [NODE_TYPE.MANUAL_TRIGGER]: manualTriggerExecutor as NodeExecutor,
  [NODE_TYPE.INITIAL]: manualTriggerExecutor as NodeExecutor,
  [NODE_TYPE.HTTP_REQUEST]: httpRequestExecutor as NodeExecutor,
  [NODE_TYPE.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor as NodeExecutor,
  [NODE_TYPE.STRIPE_TRIGGER]: stripeTriggerExecutor as NodeExecutor,
  [NODE_TYPE.GEMINI]: geminiExecutor as NodeExecutor,
  [NODE_TYPE.OPENAI]: openAiExecutor as NodeExecutor,
  [NODE_TYPE.ANTHROPIC]: anthropicExecutor as NodeExecutor,
  [NODE_TYPE.DISCORD]: discordExecutor as NodeExecutor,
  [NODE_TYPE.SLACK]: slackExecutor as NodeExecutor,
};

export const getExecutor = (type: string): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};
