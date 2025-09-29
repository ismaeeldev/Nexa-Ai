import { z } from "zod";

export const MeetingSchema = z.object({
    id: z.string().optional(), // only for update
    name: z.string().min(1, "Meeting name is required"),
    agentId: z.string().min(1, "Agent ID is required"),
});
