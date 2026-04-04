import type { Realtime } from "@inngest/realtime";
import { NODE_TYPE, type NodeTypeId } from "@/plugins/node-type-ids";
import { fetchAnthropicRealtimeToken } from "@/plugins/nodes/anthropic/actions";
import { ANTHROPIC_CHANNEL_NAME } from "@/plugins/nodes/anthropic/channel";
import { fetchDiscordRealtimeToken } from "@/plugins/nodes/discord/actions";
import { DISCORD_CHANNEL_NAME } from "@/plugins/nodes/discord/channel";
import { fetchGeminiRealtimeToken } from "@/plugins/nodes/gemini/actions";
import { GEMINI_CHANNEL_NAME } from "@/plugins/nodes/gemini/channel";
import { fetchGoogleFormTriggerRealtimeToken } from "@/plugins/nodes/google-form-trigger/actions";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/plugins/nodes/google-form-trigger/channel";
import { fetchHttpRequestRealtimeToken } from "@/plugins/nodes/http-request/actions";
import { HTTP_REQUEST_CHANNEL_NAME } from "@/plugins/nodes/http-request/channel";
import { fetchManualTriggerRealtimeToken } from "@/plugins/nodes/manual-trigger/actions";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/plugins/nodes/manual-trigger/channel";
import { fetchOpenAiRealtimeToken } from "@/plugins/nodes/openai/actions";
import { OPENAI_CHANNEL_NAME } from "@/plugins/nodes/openai/channel";
import { fetchSlackRealtimeToken } from "@/plugins/nodes/slack/actions";
import { SLACK_CHANNEL_NAME } from "@/plugins/nodes/slack/channel";
import { fetchStripeTriggerRealtimeToken } from "@/plugins/nodes/stripe-trigger/actions";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/plugins/nodes/stripe-trigger/channel";

export interface NodeRealtimeConfig {
  channel: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

const realtimeByType: Partial<Record<NodeTypeId, NodeRealtimeConfig>> = {
  [NODE_TYPE.HTTP_REQUEST]: {
    channel: HTTP_REQUEST_CHANNEL_NAME,
    refreshToken: fetchHttpRequestRealtimeToken,
  },
  [NODE_TYPE.GEMINI]: {
    channel: GEMINI_CHANNEL_NAME,
    refreshToken: fetchGeminiRealtimeToken,
  },
  [NODE_TYPE.OPENAI]: {
    channel: OPENAI_CHANNEL_NAME,
    refreshToken: fetchOpenAiRealtimeToken,
  },
  [NODE_TYPE.ANTHROPIC]: {
    channel: ANTHROPIC_CHANNEL_NAME,
    refreshToken: fetchAnthropicRealtimeToken,
  },
  [NODE_TYPE.DISCORD]: {
    channel: DISCORD_CHANNEL_NAME,
    refreshToken: fetchDiscordRealtimeToken,
  },
  [NODE_TYPE.SLACK]: {
    channel: SLACK_CHANNEL_NAME,
    refreshToken: fetchSlackRealtimeToken,
  },
  [NODE_TYPE.MANUAL_TRIGGER]: {
    channel: MANUAL_TRIGGER_CHANNEL_NAME,
    refreshToken: fetchManualTriggerRealtimeToken,
  },
  [NODE_TYPE.GOOGLE_FORM_TRIGGER]: {
    channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
    refreshToken: fetchGoogleFormTriggerRealtimeToken,
  },
  [NODE_TYPE.STRIPE_TRIGGER]: {
    channel: STRIPE_TRIGGER_CHANNEL_NAME,
    refreshToken: fetchStripeTriggerRealtimeToken,
  },
};

export function getNodeRealtimeConfig(
  type: string,
): NodeRealtimeConfig | undefined {
  return realtimeByType[type as NodeTypeId];
}
