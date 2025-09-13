import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { agents } from "@/db/schema"
import { MeetingSchema } from "../meetingSchema";
import { z } from "zod";
import { eq, getTableColumns, sql, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const meetingRouter = createTRPCRouter({

    getMany: protectedProcedure.query(async ({ ctx }) => {
        if (!ctx.auth?.user?.id) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "User not logged in" });
        }

        const data = await db
            .select({
                meeting: meetings,
                agent: {
                    id: agents.id,
                    name: agents.name,
                },
                duration: sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))`.as("duration"),
            })
            .from(meetings)
            .leftJoin(agents, eq(meetings.agentId, agents.id))
            .where(eq(meetings.userId, ctx.auth.user.id));

        return data.map((row) => ({
            ...row.meeting,
            agent: row.agent,
        }));
    }),

    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingMeeting] = await db
                .select({
                    ...getTableColumns(meetings),
                })
                .from(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id)
                    )
                );

            if (!existingMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found" });
            }

            return existingMeeting ?? null;
        }),

    create: protectedProcedure
        .input(MeetingSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdMeeting] = await db
                .insert(meetings)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();

            return createdMeeting;
        }),

    update: protectedProcedure
        .input(MeetingSchema)
        .mutation(async ({ input, ctx }) => {
            const { id, ...updates } = input;

            const [updatedMeeting] = await db
                .update(meetings)
                .set({
                    ...updates,
                    userId: ctx.auth.user.id,
                    updatedAt: new Date(),
                })
                .where(
                    and(
                        eq(meetings.id, id),
                        eq(meetings.userId, ctx.auth.user.id)
                    )
                )
                .returning();

            if (!updatedMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found or not authorized" });
            }

            return updatedMeeting;
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const [deletedMeeting] = await db
                .delete(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id)
                    )
                )
                .returning();

            if (!deletedMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Meeting not found or not authorized" });
            }

            return deletedMeeting;
        }),

});

export default meetingRouter;