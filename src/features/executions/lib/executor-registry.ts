import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";

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
}

export const executorRegistry: {
  [K in NodeType]: NodeExecutor<NodeDataMap[K]>;
} = {
  [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
  [NodeType.INITIAL]: manualTriggerExecutor,
  [NodeType.HTTP_REQUEST]: httpRequestExecutor,
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
