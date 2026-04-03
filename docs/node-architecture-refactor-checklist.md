# Node Architecture Refactor Checklist

This checklist bounds the multi-phase refactoring needed to implement the Schema-Driven "n8n style" paradigm across both Frontend and Backend systems.

- [ ] **Phase 1: Backend Registry & Plugin Framework**
  - [ ] Define the `INodeType` standard schema interfaces (defining properties, inputs, and UI elements).
  - [ ] Create a Generic Node Registry service that loads integration definitions.
  - [ ] Refactor Prisma [NodeType](file:///Users/bhaumikkhandela/Documents/n8n/src/config/node-components.ts#27-28) enum to an open string format.

- [ ] **Phase 2: Frontend Schema-Driven UI Render**
  - [ ] Build a generic `DynamicNodeSettings` component capable of converting JSON field schemas (e.g., text, select, auth keys) into interactive React components.
  - [ ] Build a single `GenericNodeCard` React Flow component.
  - [ ] Update Editor to dynamically hydrate `<Node />` interfaces based purely on loaded metadata.

- [ ] **Phase 3: Migration of Existing Nodes**
  - [ ] Migrate `HTTP Request` node to Schema.
  - [ ] Migrate AI nodes (`OpenAI`, [Anthropic](file:///Users/bhaumikkhandela/Documents/n8n/src/features/executions/components/anthropic/executor.ts#24-30), `Gemini`) to Schema.
  - [ ] Migrate Communication nodes ([Discord](file:///Users/bhaumikkhandela/Documents/n8n/src/features/executions/components/discord/executor.ts#22-28), `Slack`) to Schema.
  - [ ] Migrate Triggers (`Manual`, `Stripe`, `Google Form`) to Schema.
  - [ ] Delete all redundant node-specific React Flow [.tsx](file:///Users/bhaumikkhandela/Documents/n8n/src/app/layout.tsx) files.
