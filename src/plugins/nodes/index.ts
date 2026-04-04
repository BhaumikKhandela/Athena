/**
 * Node integrations live here: each folder owns Realtime `channel.ts`, Inngest
 * `executor.ts`, subscription `actions.ts` (server actions for editor tokens),
 * and trigger canvas UI under `ui/` where applicable.
 *
 * Action-node settings use schema-driven `DynamicNodeSettings` in the editor feature;
 * legacy per-integration dialogs under `features/executions` were removed.
 */

export { anthropicExecutor } from "./anthropic/executor";
export { discordExecutor } from "./discord/executor";
export { geminiExecutor } from "./gemini/executor";
export { googleFormTriggerExecutor } from "./google-form-trigger/executor";
export { httpRequestExecutor } from "./http-request/executor";
export { manualTriggerExecutor } from "./manual-trigger/executor";
export { openAiExecutor } from "./openai/executor";
export { slackExecutor } from "./slack/executor";
export { stripeTriggerExecutor } from "./stripe-trigger/executor";
