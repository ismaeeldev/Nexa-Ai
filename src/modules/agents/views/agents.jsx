"use client";

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import StateLoader from "../../Loader/LoadingState";
import StateError from "../../Error/ErrorState";
import AgentCard from "./agentCard";
import NewAgentDialog from "./agentDialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";


export default function Agents() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const [query, setQuery] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());
    const createAgent = useMutation(trpc.agents.create.mutationOptions({
        onSuccess: () => {
            toast.success("Agent created successfully!");
            queryClient.invalidateQueries(trpc.agents.getMany.queryKey());
        },
        onError: (error) => {
            toast.error(`Error creating agent: ${error.message}`);
        }
    }));

    const filtered = useMemo(() => {
        if (!data) return [];
        const q = query.trim().toLowerCase();
        if (!q) return data;
        return (data).filter(
            (a) =>
                a.name.toLowerCase().includes(q) ||
                a.instructions.toLowerCase().includes(q)
        );
    }, [data, query]);

    const handleSave = async ({ name, instructions }) => {
        await createAgent.mutateAsync({ name, instructions });

    };

    return (
        <>
            <section className="w-full">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Agents</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {data?.length ?? 0} agents · organized for quick access
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <label className="relative block">
                            <span className="sr-only">Search agents</span>
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="text-gray-400" />
                            </span>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-10 pr-3 py-2 rounded-lg w-64 text-sm bg-transparent border border-gray-700/40 placeholder-gray-500 text-white "
                                placeholder="Search by name or instruction..."
                            />
                        </label>

                        {/* New Button */}
                        <button
                            className="px-4 py-2 rounded-lg font-medium shadow-sm text-white"
                            style={{
                                background: "linear-gradient(90deg,#6366F1,#F43F5E)",
                            }}
                            onClick={() => {
                                setOpenDialog(true);
                            }}
                        >
                            New
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} dark />
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="mt-10 text-center text-gray-400">
                        No agents found. Try creating a new one.
                    </div>
                )}
            </section>
            <NewAgentDialog open={openDialog} setOpen={setOpenDialog} onSave={handleSave} />
        </>
    );
}

// ----- Loading and Error states -----

export const AgentLoading = () => (
    <StateLoader
        title="Fetching Agents..."
        description="Please wait while we load the agents."
    />
);

export const AgentError = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <StateError
            title="Something went wrong"
            description="Please try again later."
        />
    </div>
);
