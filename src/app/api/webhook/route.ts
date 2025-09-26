import { and, eq, not } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { meetings, agents } from "@/db/schema";
import streamVideo from "@/lib/stream-video";
import { generateAvatar } from "@/lib/avatar";

import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent,
} from "@stream-io/node-sdk";
import { unknown } from "zod";

function verifySignatureWithSdk(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(request: NextRequest) {
    const signature = request.headers.get("x-signature") || "";
    if (!signature) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.text();

    if (!verifySignatureWithSdk(body, signature)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let payload: unknown;

    try {
        payload = JSON.parse(body);
    } catch (e) {
        return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const eventType = (payload as any).type;

    if (eventType === "call.session.started") {
        console.log("🚀 Call session started event received");

        try {
            const event = payload as CallSessionStartedEvent;
            const meetingId = event.call.custom?.meetingId;

            console.log("📋 Event details:", {
                callId: event.call.id,
                meetingId,
                custom: event.call.custom
            });

            if (!meetingId) {
                console.error("❌ Meeting ID not found in call metadata");
                return NextResponse.json(
                    { message: "Meeting ID not found in call metadata" },
                    { status: 400 }
                );
            }

            // Find the meeting
            const [existingMeeting] = await db
                .select()
                .from(meetings)
                .where(
                    and(
                        eq(meetings.id, meetingId),
                        not(eq(meetings.status, "completed")),
                        not(eq(meetings.status, "cancelled"))
                    )
                );

            console.log("📊 Existing Meeting:", existingMeeting);

            if (!existingMeeting) {
                console.error("❌ Meeting not found or already completed/cancelled");
                return NextResponse.json(
                    { message: "Meeting not found or already completed/cancelled" },
                    { status: 404 }
                );
            }

            // Update meeting status to active
            await db
                .update(meetings)
                .set({ status: "active", startedAt: new Date() })
                .where(eq(meetings.id, existingMeeting.id));

            console.log("✅ Meeting status updated to active");

            // Get the agent details
            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, existingMeeting.agentId));

            console.log("🤖 Agent details:", {
                id: existingAgent?.id,
                name: existingAgent?.name,
                hasInstructions: !!existingAgent?.instructions
            });

            if (!existingAgent) {
                console.error("❌ Agent not found");
                return NextResponse.json({ message: "Agent not found" }, { status: 404 });
            }

            // Check if OpenAI API key is available
            if (!process.env.OPENAI_API_KEY) {
                console.error("❌ OpenAI API key not configured");
                return NextResponse.json(
                    { message: "OpenAI API key not configured" },
                    { status: 500 }
                );
            }

            // Create agent user in Stream if it doesn't exist
            console.log("👤 Creating/updating agent user in Stream");
            await streamVideo.upsertUsers([
                {
                    id: existingAgent.id,
                    name: existingAgent.name,
                    role: "admin",
                    image: generateAvatar({ seed: existingAgent.id, variant: 'initials' }),
                },
            ]);

            console.log("✅ Agent user created/updated in Stream");

            // Get the call instance
            const call = streamVideo.video.call("default", meetingId);

            // Connect OpenAI integration (this automatically joins the agent to the call)
            console.log("🔗 Connecting OpenAI integration");
            const realTimeClient = await streamVideo.video.connectOpenAi({
                call,
                openAiApiKey: process.env.OPENAI_API_KEY,
                agentUserId: existingAgent.id,
            });

            // Update session with agent instructions
            console.log("📝 Updating session with agent instructions");
            realTimeClient.updateSession({
                instructions: existingAgent.instructions,
            });

            console.log("✅ Agent successfully connected and configured");

        } catch (error) {
            console.error("❌ Error in call.session.started handler:", error);
            return NextResponse.json(
                {
                    message: "Internal server error",
                    error: error instanceof Error ? error.message : "Unknown error"
                },
                { status: 500 }
            );
        }
    } else if (eventType === "call.session.participant_left" || eventType === "call.session_participant_left") {
        console.log("👋 Participant left event received");

        try {
            const event = payload as CallSessionParticipantLeftEvent;
            const meetingId = event.call_cid.split(":")[1];

            console.log("📋 Participant left details:", {
                callCid: event.call_cid,
                meetingId,
                participantId: event.participant?.user_id
            });

            if (!meetingId) {
                console.error("❌ Meeting ID not found in call_cid");
                return NextResponse.json(
                    { message: "Meeting ID not found in call metadata" },
                    { status: 400 }
                );
            }

            // Check if this was the last participant leaving
            const call = streamVideo.video.call("default", meetingId);
            const callState = await call.get();

            console.log("📊 Call state:", {
                participantCount: callState.participants?.length || 0,
                participants: callState.participants?.map(p => ({
                    id: p.user_id,
                    name: p.user?.name
                }))
            });

            // If no participants left, end the call
            if (!callState.participants || callState.participants.length === 0) {
                console.log("🏁 No participants left, ending call");
                await call.end();

                // Update meeting status to completed
                await db
                    .update(meetings)
                    .set({
                        status: "completed",
                        endedAt: new Date()
                    })
                    .where(eq(meetings.id, meetingId));

                console.log("✅ Meeting marked as completed");
            }

        } catch (error) {
            console.error("❌ Error in participant_left handler:", error);
            return NextResponse.json(
                {
                    message: "Internal server error",
                    error: error instanceof Error ? error.message : "Unknown error"
                },
                { status: 500 }
            );
        }
    } else {
        console.log("ℹ️ Unhandled event type:", eventType);
        console.log("📋 Event payload:", JSON.stringify(payload, null, 2));
    }

    return NextResponse.json({ message: "Event received" }, { status: 200 });
}
