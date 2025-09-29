import { and, eq, not } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/db";
import { meetings, agents } from "@/db/schema";
import StreamVideo from "@/lib/stream-video";

import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent,
} from "@stream-io/node-sdk";
import { unknown } from "zod";

function verifySignatureWithSdk(body: string, signature: string): boolean {
    return StreamVideo.verifyWebhook(body, signature);
}

export async function POST(request: NextRequest) {
    const signature = request.headers.get("x-signature") || "";
    const apikey = request.headers.get("x-api-key") || "";

    if (!signature || !apikey) {
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

    if (eventType === "call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json(
                { message: "Meeting ID not found in call metadata" },
                { status: 400 }
            );
        }

        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, meetingId),
                    not(eq(meetings.status, "completed")),
                    not(eq(meetings.status, "active")),
                    not(eq(meetings.status, "cancelled")),
                    not(eq(meetings.status, "processing"))
                )
            );

        if (!existingMeeting) {
            return NextResponse.json(
                { message: "Meeting not found or already completed/cancelled" },
                { status: 404 }
            );
        }

        await db
            .update(meetings)
            .set({ status: "active", startedAt: new Date() })
            .where(eq(meetings.id, existingMeeting.id));

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json({ message: "Agent not found" }, { status: 404 });
        }

        const call = StreamVideo.video.call("default", meetingId);
        console.log("Connecting to call with meeting ID:", meetingId);

        const realtimeClient = await StreamVideo.video.connectOpenAi({
            call,
            openAiApiKey: process.env.OPENAI_API_KEY!,
            agentUserId: existingMeeting.agentId,
            model: "gpt-4o-realtime-preview",
        });

        console.log("Connected to call:", call);

        realtimeClient.updateSession({
            instructions: existingAgent.instructions,
        });

        realtimeClient.updateSession({ voice: "alloy" });


    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json(
                { message: "Meeting ID not found in call metadata" },
                { status: 400 }
            );
        }

        const call = StreamVideo.video.call("default", meetingId);
        await call.end();
    } else if (eventType === "call.session_ended") {
        const event = payload as CallEndedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json(
                { message: "Meeting ID not found in call metadata" },
                { status: 400 }
            );
        }

        await db.update(meetings).set({ status: "processing", endedAt: new Date() }).where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));

    } else if (eventType === "call.transcription_ready") {
        const event = payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        const [updateMeeting] = await db.update(meetings).set({ transcriptUrl: event.call_transcription.url }).where(eq(meetings.id, meetingId)).returning();

        if (!updateMeeting) {
            return NextResponse.json({ message: "Meeting not found" }, { status: 404 });
        }

        //todo ingest summary
    } else if (eventType === "call.recording_ready") {
        const event = payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        await db.update(meetings).set({ recordingUrl: event.call_recording.url }).where(eq(meetings.id, meetingId))

    }

    return NextResponse.json({ message: "Event received" }, { status: 200 });
}
