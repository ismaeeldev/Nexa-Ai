import React from 'react'
import { getQueryClient, trpc } from '@/trpc/server'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { redirect } from "next/navigation";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers'
import CallView from '@/modules/call/views/callView'

interface Props {
    params: Promise<{
        MeetingId: string
    }>
}

const Page = async ({ params }: Props) => {
    const { MeetingId } = await params;

    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect('/sign-in');
    }

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({ id: MeetingId })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <CallView meetingId={MeetingId} />
        </HydrationBoundary>
    );
}

export default Page;
