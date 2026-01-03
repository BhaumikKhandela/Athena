import { credentialsRouter } from "@/features/credentials/server/routers";
import { createTRPCRouter, protectedProcedure } from "../init";
import { workflowsRouter } from "@/features/workflows/server/routers";
import { executionsRouter } from "@/features/executions/server/routers";
import { triggersRouter } from "@/features/triggers/server/routers";
export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  executions: executionsRouter,
  triggers: triggersRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
