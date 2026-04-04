import { CredentialType } from "@/generated/prisma/enums";
import { NODE_TYPE, type NodeTypeId } from "./node-type-ids";
import type { NodePluginDefinition, NodeProperty } from "./types";

/** Shared with dialogs for variable name validation. */
export const VARIABLE_NAME_PATTERN = "^[A-Za-z_$][A-Za-z0-9_$]*$";

const httpMethodOptions = [
  { name: "GET", value: "GET" },
  { name: "POST", value: "POST" },
  { name: "PUT", value: "PUT" },
  { name: "PATCH", value: "PATCH" },
  { name: "DELETE", value: "DELETE" },
];

const aiProperties = (credentialType: CredentialType): NodeProperty[] => [
  {
    name: "variableName",
    displayName: "Variable Name",
    type: "string",
    required: true,
    pattern: VARIABLE_NAME_PATTERN,
    description:
      "Use this name to reference the result in other nodes (e.g. templates).",
  },
  {
    name: "credentialId",
    displayName: "Credential",
    type: "credential",
    credentialType,
    required: true,
  },
  {
    name: "systemPrompt",
    displayName: "System Prompt",
    type: "string",
    multiline: true,
    required: false,
    description: "Optional system instructions for the model.",
  },
  {
    name: "userPrompt",
    displayName: "User Prompt",
    type: "string",
    multiline: true,
    required: true,
  },
];

const definitions: NodePluginDefinition[] = [
  {
    id: NODE_TYPE.INITIAL,
    category: "Action",
    displayName: "Start",
    icon: "initial",
    properties: [],
    inputs: 0,
    outputs: 0,
    shape: "default",
  },
  {
    id: NODE_TYPE.MANUAL_TRIGGER,
    category: "Trigger",
    displayName: "Trigger manually",
    icon: "lucide:mouse-pointer",
    selectorDescription:
      "Runs the flow on clicking a button. Good for getting started quickly",
    properties: [],
    inputs: 0,
    outputs: 1,
    shape: "trigger",
    customDialogId: "manualTrigger",
    cardTitle: "When clicking 'Execute workflow'",
    cardSubtitle: "Runs when you click Execute workflow",
  },
  {
    id: NODE_TYPE.GOOGLE_FORM_TRIGGER,
    category: "Trigger",
    displayName: "Google Form",
    icon: "/logos/googleform.svg",
    selectorDescription: "Runs the flow when a Google Form is submitted",
    properties: [],
    inputs: 0,
    outputs: 1,
    shape: "trigger",
    customDialogId: "googleForm",
    cardSubtitle: "When form is submitted",
  },
  {
    id: NODE_TYPE.STRIPE_TRIGGER,
    category: "Trigger",
    displayName: "Stripe Event",
    icon: "/logos/stripe.svg",
    selectorDescription: "Runs the flow when a Stripe Event is captured",
    properties: [],
    inputs: 0,
    outputs: 1,
    shape: "trigger",
    customDialogId: "stripe",
  },
  {
    id: NODE_TYPE.HTTP_REQUEST,
    category: "Action",
    displayName: "HTTP Request",
    icon: "lucide:globe",
    selectorDescription: "Makes an HTTP request",
    summaryFields: ["endpoint", "method"],
    inputs: 1,
    outputs: 1,
    shape: "default",
    properties: [
      {
        name: "variableName",
        displayName: "Variable Name",
        type: "string",
        required: true,
        pattern: VARIABLE_NAME_PATTERN,
      },
      {
        name: "endpoint",
        displayName: "Endpoint URL",
        type: "string",
        required: true,
      },
      {
        name: "method",
        displayName: "Method",
        type: "options",
        required: true,
        options: httpMethodOptions,
      },
      {
        name: "body",
        displayName: "Body",
        type: "string",
        multiline: true,
        required: false,
      },
    ],
  },
  {
    id: NODE_TYPE.GEMINI,
    category: "Action",
    displayName: "Gemini",
    icon: "/logos/gemini.svg",
    selectorDescription: "Uses Google Gemini to generate text",
    summaryFields: ["userPrompt"],
    inputs: 1,
    outputs: 1,
    shape: "default",
    properties: aiProperties(CredentialType.GEMINI),
  },
  {
    id: NODE_TYPE.OPENAI,
    category: "Action",
    displayName: "OpenAI",
    icon: "/logos/openai.svg",
    selectorDescription: "Uses OpenAI to generate text",
    summaryFields: ["userPrompt"],
    inputs: 1,
    outputs: 1,
    shape: "default",
    properties: aiProperties(CredentialType.OPENAI),
  },
  {
    id: NODE_TYPE.ANTHROPIC,
    category: "Action",
    displayName: "Anthropic",
    icon: "/logos/anthropic.svg",
    selectorDescription: "Uses Anthropic to generate text",
    summaryFields: ["userPrompt"],
    inputs: 1,
    outputs: 1,
    shape: "default",
    properties: aiProperties(CredentialType.ANTHROPIC),
  },
  {
    id: NODE_TYPE.DISCORD,
    category: "Action",
    displayName: "Discord",
    icon: "/logos/discord.svg",
    selectorDescription: "Send a message to Discord",
    summaryFields: ["content"],
    inputs: 1,
    outputs: 1,
    shape: "default",
    properties: [
      {
        name: "variableName",
        displayName: "Variable Name",
        type: "string",
        required: true,
        pattern: VARIABLE_NAME_PATTERN,
      },
      {
        name: "username",
        displayName: "Username",
        type: "string",
        required: false,
      },
      {
        name: "content",
        displayName: "Message Content",
        type: "string",
        multiline: true,
        required: true,
        maxLength: 2000,
      },
      {
        name: "webhookUrl",
        displayName: "Webhook URL",
        type: "string",
        required: true,
      },
    ],
  },
  {
    id: NODE_TYPE.SLACK,
    category: "Action",
    displayName: "Slack",
    icon: "/logos/slack.svg",
    selectorDescription: "Send a message to Slack",
    summaryFields: ["content"],
    inputs: 1,
    outputs: 1,
    shape: "default",
    properties: [
      {
        name: "variableName",
        displayName: "Variable Name",
        type: "string",
        required: true,
        pattern: VARIABLE_NAME_PATTERN,
      },
      {
        name: "webhookUrl",
        displayName: "Webhook URL",
        type: "string",
        required: true,
      },
      {
        name: "content",
        displayName: "Message Content",
        type: "string",
        multiline: true,
        required: true,
      },
    ],
  },
];

export const nodePluginRegistry: Record<string, NodePluginDefinition> =
  Object.fromEntries(definitions.map((d) => [d.id, d]));

export const KNOWN_NODE_TYPE_IDS = definitions.map((d) => d.id) as [
  NodeTypeId,
  ...NodeTypeId[],
];

export function getNodePlugin(id: string): NodePluginDefinition | undefined {
  return nodePluginRegistry[id];
}

export function listNodePlugins(): NodePluginDefinition[] {
  return definitions;
}

export function isKnownNodeType(id: string): id is NodeTypeId {
  return id in nodePluginRegistry;
}
