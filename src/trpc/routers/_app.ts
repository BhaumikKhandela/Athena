import { z } from "zod";
import prisma from "../../lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
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
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: "Write a vegetarian lasgna recipe for 4 people",
    });

    return text;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
