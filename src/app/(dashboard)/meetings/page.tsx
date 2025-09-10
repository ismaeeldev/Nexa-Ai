import React from 'react'
import Meetings from '@/modules/meetings/views/meetings'
import { getQueryClient, trpc } from '@/trpc/server'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Suspense } from 'react'
import { MeetingsLoading } from '@/modules/meetings/views/meetings'
import { ErrorBoundary } from "react-error-boundary";
import { MeetingsError } from '@/modules/meetings/views/meetings'
import { redirect } from "next/navigation";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers'


const page = async () => {
    const session = await auth.api.getSession({ headers: await headers(), })
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions());


    if (!session) {
        redirect('/sign-in')
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingsLoading />}>
                <ErrorBoundary fallback={<MeetingsError />}>
                    <Meetings />

                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>

    )
}

export default page

