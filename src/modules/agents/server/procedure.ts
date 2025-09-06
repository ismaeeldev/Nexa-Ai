import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { AgentSchema } from "../agentSchema";
import { z } from "zod";
import { eq, getTableColumns, sql, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";


const agentRouter = createTRPCRouter({

    getMany: protectedProcedure.query(async ({ ctx, input }) => {
        const data = await db.select({
            meetingCount: sql<number>`3`,
            ...getTableColumns(agents),
        }).from(agents).where(and(eq(agents.userId, ctx.auth.user.id)));
        return data;

    }),

    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingAgent] = await db
                .select({
                    meetingCount: sql<number>`5`,
                    ...getTableColumns(agents),
                })
                .from(agents)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id)
                    )
                );

            if (!existingAgent) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" });
            }

            return existingAgent ?? null;
        }),

    create: protectedProcedure
        .input(AgentSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();

            return createdAgent;
        }),


    update: protectedProcedure
        .input(
            AgentSchema.extend({
                id: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id, ...updates } = input;

            const [updatedAgent] = await db
                .update(agents)
                .set({
                    ...updates,
                    userId: ctx.auth.user.id,
                })
                .where(eq(agents.id, id))
                .returning();

            return updatedAgent ?? null;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            const [deletedAgent] = await db
                .delete(agents)
                .where(eq(agents.id, input.id))
                .returning();

            return deletedAgent ?? null;
        })


})

export default agentRouter;