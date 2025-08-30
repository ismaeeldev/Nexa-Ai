import React from 'react'
import Agents from '@/modules/agents/views/agents'
import { getQueryClient, trpc } from '@/trpc/server'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Suspense } from 'react'
import { AgentLoading } from '@/modules/agents/views/agents'
import { ErrorBoundary } from "react-error-boundary";
import { AgentError } from '@/modules/agents/views/agents'
import { redirect } from "next/navigation";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers'


const page = async () => {
    const session = await auth.api.getSession({ headers: await headers(), })
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());


    if (!session) {
        redirect('/sign-in')
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentLoading />}>
                <ErrorBoundary fallback={<AgentError />}>
                    <Agents />

                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>

    )
}

export default page

