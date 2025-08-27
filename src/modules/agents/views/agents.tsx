"use client";

import React from 'react'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'
import NexaLoader from '../../Loader/NexaLoader'
import NexaError from '../../Error/NexaError';

const Agents = () => {

    const trpc = useTRPC();
    const { data, isLoading, isError, error } = useQuery(trpc.agents.getMany.queryOptions());


    if (isLoading) {
        return (
            <div className='flex items-center justify-center'>
                <NexaLoader size={15} />
            </div>
        )
    }

    if (isError) {
        return (
            <div>
                <NexaError message={error.message || 'Something went Wrong'} />
            </div>
        )

    }

    return (
        <div>
            <h1>Agents</h1>
            <ul>
                {data?.map(agent => (
                    <li key={agent.id}>{agent.name}</li>
                ))}
            </ul>
        </div>
    )

}

export default Agents

