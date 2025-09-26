"use client"
import { useEffect, useState } from "react"
import {
    Call,
    CallingState,
    StreamVideo,
    StreamCall,
    StreamVideoClient,
} from "@stream-io/video-react-sdk"
import { useTRPC } from "@/trpc/client"

import "@stream-io/video-react-sdk/dist/css/styles.css"
import { useMutation } from "@tanstack/react-query"
import NexaLoader from "../../../Loader/NexaLoader"
import CallUi from "./callUi"


const CallConnect = ({ meetingId, meetingName, userId, userName, userImage }) => {

    const trpc = useTRPC();

    const { mutateAsync: generateToken } = useMutation(trpc.meetings.generateToken.mutationOptions())

    const [client, setClient] = useState(null)
    const [call, setCall] = useState(null)

    useEffect(() => {

        // 1. Create a new Stream Video client
        const videoClient = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY,
            user: {
                id: userId,
                name: userName,
                image: userImage
            },

            tokenProvider: generateToken
        })

        setClient(videoClient)

        // 3. Cleanup on unmount
        return () => {
            videoClient.disconnectUser()
            setClient(undefined)
        }
    }, [userId, userName, generateToken, meetingId])


    useEffect(() => {
        if (!client) return;

        const videoCall = client.call("default", meetingId);
        videoCall.camera.disable();
        videoCall.microphone.disable();
        setCall(videoCall);

        return () => {

            if (videoCall.state.callingState !== CallingState.LEFT) {
                videoCall.leave();
                videoCall.endCall();
                setCall(undefined);
            }
        };
    }, [client, meetingId]);

    // 4. Loader state
    if (!client || !call) {
        return <NexaLoader size={15} />
    }

    return (
        <StreamVideo client={client}>
            <StreamCall call={call}>
                <CallUi meetingName={meetingName} />
            </StreamCall>
        </StreamVideo>
    )
}

export default CallConnect
