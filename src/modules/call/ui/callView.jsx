"use client"

import React from 'react'
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import NexaError from '../../Error/NexaError'
import StateError from '../../Error/ErrorState';
import CallProvider from './components/callProvider';



const callView = ({ meetingId }) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

    if (data.status == 'completed') {
        return (
            <StateError title=" Meeting Ended " description=" This meeting has already ended. You can view the summary and recording below. " />

        )
    }

    return (
        <CallProvider meetingId={meetingId} meetingName={data.name} />
    )
}

export default callView
