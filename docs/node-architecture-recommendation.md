# Hybrid Schema-Driven Node Architecture Plan

This document outlines the strategy for migrating the `n8n` clone to an industry-standard, massively scalable "Schema-Driven / Configuration-Driven" integration paradigm used by platforms like n8n and Zapier. 

By offloading UI logic into JSON schemas, this paradigm solves two critical scale limits:
1. **Frontend JS Bundle Protection**: Zero new UI components need to be downloaded per node. 
2. **Backend Modularity**: Developers only write pure data/config logic without meddling in React execution.

---

## 1. Universal Plugin Manifest (`INodeType`)

Every integration will be placed in its own isolated folder (e.g., `src/plugins/nodes/slack/`). 
Inside each folder, an integration defines itself entirely via a standard JSON/TypeScript Object schema:

```typescript
// src/plugins/types.ts
export interface NodeProperty {
  name: string;        // The variable key (e.g., 'channelId')
  displayName: string; // The UI Label (e.g., 'Target Channel')
  type: 'string' | 'number' | 'boolean' | 'options' | 'credential';
  required?: boolean;
  options?: { name: string; value: string }[]; // For dropdowns
  description?: string;
}

export interface INodeType {
  type: string;             // e.g., 'communication.slack'
  category: 'Trigger' | 'Action';
  displayName: string;
  icon: string;             // SVG string or icon identifier
  properties: NodeProperty[]; // UI Schema
  
  // The backend function
  execute: (context: ExecutionContext, inputs: Record<string, any>) => Promise<any>;
}
```

---

## 2. The Frontend Optimization: Generic Schema Renderer

With the schema structure in place, the frontend deletes 100% of all node-specific custom React files (`DiscordNode.tsx`, `OpenAiNode.tsx`, etc.). 

Instead, we construct **ONE** generic Node component for the React Flow canvas, combined with **ONE** generic unified Settings/Properties Panel.

### The Generic Settings Renderer
When a user clicks on the "Slack" node in the editor, the frontend loads the `properties` array from the `INodeType` schema. A generic loop constructs the form automatically:

```tsx
// src/features/editor/components/generic-node-settings.tsx
export function GenericNodeSettings({ nodeType, localData }) {
  const schema = nodeRegistry.get(nodeType);

  return (
    <form>
      {schema.properties.map((prop) => {
        switch (prop.type) {
          case 'string':
            return <TextInput label={prop.displayName} required={prop.required} />;
          case 'options':
            return <Dropdown options={prop.options} label={prop.displayName} />;
          case 'boolean':
            return <Toggle label={prop.displayName} />;
          case 'credential':
            return <CredentialSelector provider={nodeType} />;
        }
      })}
    </form>
  )
}
```
**Impact:** Going from 10 nodes to 10,000 nodes adds **zero** kilobytes to your React chunk bundle sizes.

---

## 3. Standardized Database & Inngest Execution Model

### Remove [NodeType](file:///Users/bhaumikkhandela/Documents/n8n/src/config/node-components.ts#27-28) Enum Constraints
To allow the system to load dynamically without migrations, update [schema.prisma](file:///Users/bhaumikkhandela/Documents/n8n/prisma/schema.prisma):
```prisma
model Node {
  id      String   @id @default(cuid())
  type    String   // Changed from Enum to string -> 'ai.openai', 'communication.slack'
  data    Json     // The stored values from the UI scheme mapped out above
  // ...
}
```

### Centralized Execution Wrapper
All manual logging and Inngest status tracking steps (e.g., `publish('loading')`, `try/catch`, `publish('error')`) exist exactly **once** inside the centralized Node Engine. The engine extracts the raw inputs payload from the database `Json` field, automatically passes it downstream to the Node's `.execute()` callback, handles the errors, and securely manages the return boundaries.

## 4. Execution Workflow

When a node developer wants to add an integration to your system, they only follow one action:
1. Create `src/plugins/nodes/foobar-integration/index.ts`.
2. Map out `INodeType` config (what UI fields to show).
3. Write standard JavaScript logic in `.execute()`.

By standardizing integrations as JSON config wrappers, your system architecture will gracefully withstand thousands of future modules.
