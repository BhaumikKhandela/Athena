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

/** Per-provider field copy for `aiProperties` (dialog title lives on `NodePluginDefinition`). */
type AiNodeFieldCopy = {
  variablePlaceholder: string;
  variableNameHintFallback: string;
  credentialDisplayName: string;
  systemPromptPlaceholder: string;
  systemPromptDescription: string;
  userPromptPlaceholder: string;
  userPromptDescription: string;
  userPromptTextareaClassName?: string;
};

const AI_MODEL_DIALOG_DESCRIPTION =
  "Configure the AI model and prompts for this node.";

const AI_SYSTEM_PROMPT_HELP =
  "Sets the behavior of the assistant. Use {{variable}} for simple values or {{json variable}} to stringify objects";

const AI_USER_PROMPT_HELP =
  "The prompt to send to the AI. Use {{variable}} for simple values or {{json variable}} to stringify objects";

function aiProperties(
  credentialType: CredentialType,
  copy: AiNodeFieldCopy,
): NodeProperty[] {
  return [
    {
      name: "variableName",
      displayName: "Variable Name",
      type: "string",
      required: true,
      pattern: VARIABLE_NAME_PATTERN,
      placeholder: copy.variablePlaceholder,
      variableNameHintFallback: copy.variableNameHintFallback,
    },
    {
      name: "credentialId",
      displayName: copy.credentialDisplayName,
      type: "credential",
      credentialType,
      required: true,
    },
    {
      name: "systemPrompt",
      displayName: "System Prompt (Optional)",
      type: "string",
      multiline: true,
      required: false,
      placeholder: copy.systemPromptPlaceholder,
      description: copy.systemPromptDescription,
    },
    {
      name: "userPrompt",
      displayName: "User Prompt",
      type: "string",
      multiline: true,
      required: true,
      placeholder: copy.userPromptPlaceholder,
      description: copy.userPromptDescription,
      textareaClassName: copy.userPromptTextareaClassName ?? "min-h-[120px]",
    },
  ];
}

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
    settingsDialogTitle: "HTTP Request",
    settingsDialogDescription: "Configure settings for the HTTP Request node.",
    properties: [
      {
        name: "variableName",
        displayName: "Variable Name",
        type: "string",
        required: true,
        pattern: VARIABLE_NAME_PATTERN,
        placeholder: "myApiCall",
        variableNameHintFallback: "myApiCall",
        variableNameReferencePath: "httpResponse.data",
      },
      {
        name: "method",
        displayName: "Method",
        type: "options",
        required: true,
        options: httpMethodOptions,
        description: "The HTTP method to use for this request",
      },
      {
        name: "endpoint",
        displayName: "Endpoint URL",
        type: "string",
        required: true,
        placeholder: "https://api.example.com/users/{{httpResponse.data.id}}",
        description:
          "Static URL or use {{variable}} for simple values or {{json variable}} to stringify objects",
      },
      {
        name: "body",
        displayName: "Request Body",
        type: "string",
        multiline: true,
        required: false,
        visibleWhen: { field: "method", values: ["POST", "PUT", "PATCH"] },
        placeholder: `{
  "userId": "{{httpRequest.data.id}}",
  "name": "{{httpResponse.data.name}}",
  "items": "{{httpResponse.data.items}}"
}`,
        description:
          "JSON with template variables. Use {{variable}} for simple values or {{json variable}} to stringify objects",
        textareaClassName: "min-h-[120px]",
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
    settingsDialogTitle: "Gemini Configurations",
    settingsDialogDescription: AI_MODEL_DIALOG_DESCRIPTION,
    properties: aiProperties(CredentialType.GEMINI, {
      variablePlaceholder: "myGemini",
      variableNameHintFallback: "myGemini",
      credentialDisplayName: "Gemini Credential",
      systemPromptPlaceholder: " You are a helpful assistant.",
      systemPromptDescription: AI_SYSTEM_PROMPT_HELP,
      userPromptPlaceholder: "Summarize this text: {{json httpResponse.data}}",
      userPromptDescription: AI_USER_PROMPT_HELP,
    }),
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
    settingsDialogTitle: "OpenAI Configurations",
    settingsDialogDescription: AI_MODEL_DIALOG_DESCRIPTION,
    properties: aiProperties(CredentialType.OPENAI, {
      variablePlaceholder: "myOpenAI",
      variableNameHintFallback: "myOpenAI",
      credentialDisplayName: "OpenAI Credential",
      systemPromptPlaceholder: " You are a helpful assistant.",
      systemPromptDescription: AI_SYSTEM_PROMPT_HELP,
      userPromptPlaceholder: "Summarize this text: {{json httpResponse.data}}",
      userPromptDescription: AI_USER_PROMPT_HELP,
    }),
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
    settingsDialogTitle: "Anthropic Configurations",
    settingsDialogDescription: AI_MODEL_DIALOG_DESCRIPTION,
    properties: aiProperties(CredentialType.ANTHROPIC, {
      variablePlaceholder: "myAnthropic",
      variableNameHintFallback: "myAnthropic",
      credentialDisplayName: "Anthropic Credential",
      systemPromptPlaceholder: " You are a helpful assistant.",
      systemPromptDescription: AI_SYSTEM_PROMPT_HELP,
      userPromptPlaceholder: "Summarize this text: {{json httpResponse.data}}",
      userPromptDescription: AI_USER_PROMPT_HELP,
    }),
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
    settingsDialogTitle: "Discord Configurations",
    settingsDialogDescription:
      "Configure the Discord webhook settings for this node.",
    properties: [
      {
        name: "variableName",
        displayName: "Variable Name",
        type: "string",
        required: true,
        pattern: VARIABLE_NAME_PATTERN,
        placeholder: "myDiscord",
        variableNameHintFallback: "myDiscord",
      },
      {
        name: "webhookUrl",
        displayName: "Webhook URL",
        type: "string",
        required: true,
        placeholder: "https://discord.com/api/webhooks/...",
        description:
          "Get this from Discord: Channel Settings → Integrations → Webhooks",
      },
      {
        name: "content",
        displayName: "Message Content",
        type: "string",
        multiline: true,
        required: true,
        maxLength: 2000,
        placeholder: "Summary: {{myGemini.text}}",
        description:
          "The message to send. Use {{variable}} for simple values or {{json variable}} to stringify objects",
      },
      {
        name: "username",
        displayName: "Bot Username (Optional)",
        type: "string",
        required: false,
        placeholder: "Workflow Bot",
        description: "Override the webhook's default username.",
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
    settingsDialogTitle: "Slack Configurations",
    settingsDialogDescription:
      "Configure the Slack webhook settings for this node.",
    properties: [
      {
        name: "variableName",
        displayName: "Variable Name",
        type: "string",
        required: true,
        pattern: VARIABLE_NAME_PATTERN,
        placeholder: "mySlack",
        variableNameHintFallback: "mySlack",
      },
      {
        name: "webhookUrl",
        displayName: "Webhook URL",
        type: "string",
        required: true,
        placeholder: "https://hooks.slack.com/services/...",
        description:
          'Get this from Slack: Workspace Settings → Workflows → Webhooks\n\nMake sure you have "content" variable',
      },
      {
        name: "content",
        displayName: "Message Content",
        type: "string",
        multiline: true,
        required: true,
        placeholder: "Summary: {{myGemini.text}}",
        description:
          "The message to send. Use {{variable}} for simple values or {{json variable}} to stringify objects",
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
