import { z } from "zod";
import prisma from "../../lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { inngest } from "@/inngest/client";
export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),

  createWorkflow: protectedProcedure.mutation(() => {
    return prisma.workflow.create({
      data: {
        name: "test-workflow",
      },
    });
  }),

  testAi: protectedProcedure.mutation(async () => {

    await inngest.send({
      name: "execute/ai",
    });

    return { success: true, message: "Job queued" };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
