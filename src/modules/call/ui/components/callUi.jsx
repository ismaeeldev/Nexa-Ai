import React from 'react'
import { useState, useEffect } from "react"
import { StreamTheme, useCall } from "@stream-io/video-react-sdk"
import "@stream-io/video-react-sdk/dist/css/styles.css"
import CallLobby from './callLobby'
import CallActive from './callActive'
import CallEnded from './callEnded'

const CallUi = ({ meetingName }) => {
    const call = useCall();
    const [show, setShow] = useState("lobby"); // "lobby" | "call" | "ended"


    const handleJoin = async () => {

        if (!call) return;

        await call.join();
        setShow("call");
    }

    const handleLeave = async () => {

        if (!call) return;

        await call.endCall();
        setShow("ended");
    }

    return (
        <StreamTheme themeOverrides={{
            colors: {
                static_white: "oklch(0.985 0 0)",
                static_black: "oklch(0.145 0 0)",
                primary: "var(--primary)",
            }
        }} className="h-screen bg-background text-foreground">
            {show === "lobby" && <CallLobby onJoin={handleJoin} />}
            {show === "call" && (
                <CallActive onLeave={handleLeave} meetingName={meetingName} />
            )}
            {show === "ended" && <CallEnded />}
        </StreamTheme>
    )
}

export default CallUi
