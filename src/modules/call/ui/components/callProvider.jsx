"use client"
import { useEffect, useState } from "react"
import { generateAvatar } from "@/lib/avatar"
import NexaLoader from "../../../Loader/NexaLoader"
import { authClient } from "@/lib/auth-client"
import CallConnect from "./callConnect"

const CallProvider = ({ meetingId, meetingName }) => {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSession = async () => {
            const res = await authClient.getSession()
            setSession(res?.data ?? null)
            setLoading(false)
        }
        fetchSession()
    }, [])

    if (loading || !session) {
        return <NexaLoader size={15} />
    }

    return (
        <CallConnect
            meetingId={meetingId}
            meetingName={meetingName}
            userId={session.user?.id}
            userName={session.user?.name}
            userImage={
                session.user?.image ??
                generateAvatar({ seed: session.user?.name, variant: "initials" })
            }
        />
    )
}

export default CallProvider
