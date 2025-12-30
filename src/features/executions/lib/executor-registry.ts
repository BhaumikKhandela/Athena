import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { googleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import { geminiExecutor } from "../components/gemini/executor";
import { openAiExecutor } from "../components/openai/executor";
import { anthropicExecutor } from "../components/anthropic/executor";

export type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

interface NodeDataMap {
  [NodeType.HTTP_REQUEST]: HttpRequestData;
  [NodeType.MANUAL_TRIGGER]: Record<string, unknown>;
  [NodeType.INITIAL]: Record<string, unknown>;
  [NodeType.GOOGLE_FORM_TRIGGER]: Record<string, unknown>;
  [NodeType.STRIPE_TRIGGER]: Record<string, any>;
  [NodeType.GEMINI]: Record<string, any>;
  [NodeType.OPENAI]: Record<string, any>;
  [NodeType.ANTHROPIC]: Record<string, any>;
}

export const executorRegistry: {
  [K in NodeType]: NodeExecutor<NodeDataMap[K]>;
} = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
  [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
  [NodeType.GEMINI]: geminiExecutor,
  [NodeType.OPENAI]: openAiExecutor,
  [NodeType.ANTHROPIC]: anthropicExecutor,
};

export const getExecutor = <T extends NodeType>(
  type: T
): NodeExecutor<NodeDataMap[T]> => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for node type: ${type}`);
  }

  return executor;
};
