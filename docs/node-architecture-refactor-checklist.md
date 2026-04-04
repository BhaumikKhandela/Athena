# Node Architecture Refactor Checklist

This checklist bounds the multi-phase refactoring needed to implement the Schema-Driven "n8n style" paradigm across both Frontend and Backend systems.

- [x] **Phase 1: Backend Registry & Plugin Framework**
  - [x] Define the `INodeType` standard schema interfaces (defining properties, inputs, and UI elements). See [`src/plugins/types.ts`](/src/plugins/types.ts) (`NodePluginDefinition`, `NodeProperty`).
  - [x] Create a Generic Node Registry service that loads integration definitions. See [`src/plugins/registry.ts`](/src/plugins/registry.ts).
  - [x] Refactor Prisma `NodeType` enum to an open string format. See [`prisma/schema.prisma`](/prisma/schema.prisma) (`Node.type String`) and migration `20260404120000_node_type_string`.

- [x] **Phase 2: Frontend Schema-Driven UI Render**
  - [x] Build a generic `DynamicNodeSettings` component capable of converting JSON field schemas (e.g., text, select, auth keys) into interactive React components. See [`src/features/editor/components/dynamic-node-settings.tsx`](/src/features/editor/components/dynamic-node-settings.tsx).
  - [x] Build a single `GenericNodeCard` React Flow component. See [`src/features/editor/components/generic-node-card.tsx`](/src/features/editor/components/generic-node-card.tsx) (legacy canvas nodes: `INITIAL`, manual / Google Form / Stripe triggers delegate to existing components until Phase 3).
  - [x] Update Editor to dynamically hydrate `<Node />` interfaces based purely on loaded metadata. [`src/config/node-components.ts`](/src/config/node-components.ts) registers [`GenericNodeCard`](/src/features/editor/components/generic-node-card.tsx) for every known type id; metadata comes from [`src/plugins/registry.ts`](/src/plugins/registry.ts) plus [`node-realtime`](/src/features/editor/lib/node-realtime.ts) / [`node-summary`](/src/features/editor/lib/node-summary.ts).

- [x] **Phase 3: Migration of Existing Nodes** (execution + realtime + trigger UI isolation)
  - [x] Isolate node **executors**, **Inngest Realtime channels**, and **subscription token** server actions under [`src/plugins/nodes/`](src/plugins/nodes/). [`executor-registry`](src/features/executions/lib/executor-registry.ts), [`node-realtime`](src/features/editor/lib/node-realtime.ts), and [`inngest/functions`](src/inngest/functions.ts) consume them.
  - [x] Schema-driven **metadata** and **UI** for Action nodes: [`registry.ts`](src/plugins/registry.ts), [`DynamicNodeSettings`](src/features/editor/components/dynamic-node-settings.tsx), [`GenericNodeCard`](src/features/editor/components/generic-node-card.tsx).
  - [x] **Trigger** canvas components and dialogs live under [`src/plugins/nodes/`](src/plugins/nodes/) (e.g. [`manual-trigger/ui/`](src/plugins/nodes/manual-trigger/ui/), [`google-form-trigger/ui/`](src/plugins/nodes/google-form-trigger/ui/), [`stripe-trigger/ui/`](src/plugins/nodes/stripe-trigger/ui/)) with shared [`base-trigger-node.tsx`](src/plugins/nodes/shared/base-trigger-node.tsx). [`GenericNodeCard`](src/features/editor/components/generic-node-card.tsx) imports from there.
  - [x] Removed unused schema-duplicate **execution dialogs** from `features/executions/components/*/dialog.tsx` (replaced by `DynamicNodeSettings`).
