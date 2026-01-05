import { PAGINATION } from "@/config/constants";
import { WebhookProvider } from "@/generated/prisma/enums";
import prisma from "@/lib/db";
import { encrypt } from "@/lib/encryption";
import {
  baseProcedure,
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";

export const webhooksRouter = createTRPCRouter({
  getByProvider: protectedProcedure
    .input(
      z.object({
        provider: z.enum(WebhookProvider),
        workflowId: z.string().min(1, "Workflow ID is required"),
      })
    )
    .query(({ ctx, input }) => {
      const { provider, workflowId } = input;

      return prisma.webhookVerification.findMany({
        where: {
          provider,
          userId: ctx.auth.user.id,
          workflowId,
        },
        select: {
          id: true,
          name: true,
          workflow: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  create: premiumProcedure
    .input(
      z.object({
        secret: z.string().min(1, "Secret is required"),
        name: z.string().min(1, "Name is required"),
        provider: z.enum(WebhookProvider),
        workflowId: z.string().min(1, "workflow ID is required"),
      })
    )
    .mutation(({ ctx, input }) => {
      const { secret, name, provider, workflowId } = input;

      return prisma.webhookVerification.create({
        data: {
          userId: ctx.auth.user.id,
          name,
          provider,
          signingSecret: encrypt(secret),
          workflowId,
        },
      });
    }),

  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "secret ID is required"),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id } = input;

      return prisma.webhookVerification.delete({
        where: {
          id,
          userId: ctx.auth.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "ID is required"),
        name: z.string().min(1, "Name is required"),
        secret: z.string().min(1, "Secret is required"),
        provider: z.enum(WebhookProvider),
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, name, secret, provider } = input;

      return prisma.webhookVerification.update({
        where: {
          id,
          userId: ctx.auth.user.id,
        },
        data: {
          name,
          signingSecret: encrypt(secret),
          provider,
        },
      });
    }),

  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "ID is required"),
      })
    )
    .query(({ ctx, input }) => {
      const { id } = input;

      return prisma.webhookVerification.findUniqueOrThrow({
        where: {
          id,
          userId: ctx.auth.user.id,
        },
      });
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.webhookVerification.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.webhookVerification.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),

  getOneByWorkflowId: baseProcedure
    .input(
      z.object({
        workflowId: z.string().min(1, "Workflow ID is required"),
        provider: z.enum(WebhookProvider),
      })
    )
    .query(({ input }) => {
      const { workflowId, provider } = input;

      return prisma.webhookVerification.findUnique({
        where: {
          workflowId_provider: {
            workflowId,
            provider,
          },
        },
      });
    }),
});
