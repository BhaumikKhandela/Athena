import { credentialsRouter } from "@/features/credentials/server/routers";
import { createTRPCRouter, protectedProcedure } from "../init";
import { workflowsRouter } from "@/features/workflows/server/routers";
import { executionsRouter } from "@/features/executions/server/routers";
import { webhooksRouter } from "@/features/webhooks/server/routers";
export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  executions: executionsRouter,
  webhooks: webhooksRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
