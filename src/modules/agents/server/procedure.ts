import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { AgentSchema } from "../agentSchema";
import { z } from "zod";
import { eq } from "drizzle-orm";


const agentRouter = createTRPCRouter({

    getMany: baseProcedure.query(async () => {
        const data = await db.select().from(agents);
        return data;

    }),

    getOne: baseProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, input.id));

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

})

export default agentRouter;