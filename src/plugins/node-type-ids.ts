/**
 * Canonical node type IDs stored in `Node.type` and used across the app.
 * Kept aligned with historical Prisma enum values for migration compatibility.
 */
export const NODE_TYPE = {
  INITIAL: "INITIAL",
  MANUAL_TRIGGER: "MANUAL_TRIGGER",
  HTTP_REQUEST: "HTTP_REQUEST",
  GOOGLE_FORM_TRIGGER: "GOOGLE_FORM_TRIGGER",
  STRIPE_TRIGGER: "STRIPE_TRIGGER",
  ANTHROPIC: "ANTHROPIC",
  GEMINI: "GEMINI",
  OPENAI: "OPENAI",
  DISCORD: "DISCORD",
  SLACK: "SLACK",
} as const;

export type NodeTypeId = (typeof NODE_TYPE)[keyof typeof NODE_TYPE];
