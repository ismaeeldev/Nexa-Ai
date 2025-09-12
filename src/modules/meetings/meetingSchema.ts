import { z } from "zod";

export const MeetingSchema = z.object({
    id: z.string().optional(), // only for update
    name: z.string().min(1, "Meeting name is required"),
    agentId: z.string().min(1, "Agent ID is required"),
    summary: z.string("Agent ID is required"),
    status: z.enum(["upcoming", "active", "completed", "processing", "cancelled"]),
    startedAt: z.string().min(1, "Start time is required")
        .transform((val) => new Date(val)),
    endedAt: z.string().min(1, "End time is required")
        .transform((val) => new Date(val)),
});
