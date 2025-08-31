"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import NexaAv from '../../../../public/nexaAv.webp';
import MoreMenu from "@/components/ui/moreMenu";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import NewAgentDialog from "./agentDialog";
import { nexaConfirm } from "@/components/ui/nexaConfirm";

// Types
type Agent = {
    id: string;
    name: string;
    userId: string;
    instructions: string;
    createdAt: string; // ISO
    updatedAt: string; // ISO
};

// Constants for better maintainability
const CARD_STYLES = {
    accentGradient: "linear-gradient(90deg,#F43F5E,#6366F1)",
    cardBg: "linear-gradient(145deg,#0b1220,#071021)",
    borderColor: "rgba(255,255,255,0.03)",
    buttonBg: "bg-gray/20 hover:bg-white/5",
};

const TRUNCATE_LENGTH = 180;

// Utility functions
const timeAgo = (iso?: string): string => {
    if (!iso) return "-";
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    const sec = Math.floor(diff / 1000);
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const days = Math.floor(hr / 24);
    if (days < 30) return `${days}d ago`;
    return d.toLocaleDateString();
};

const truncate = (text = "", length = 140): string => {
    if (text.length <= length) return text;
    return text.slice(0, length).trimEnd() + "…";
};


// Custom hook for agent mutations
const useAgentMutations = (agent: Agent) => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const updateAgent = useMutation(trpc.agents.update.mutationOptions({
        onSuccess: () => {
            toast.success("Agent Updated successfully!");
            queryClient.invalidateQueries({ queryKey: trpc.agents.getMany.queryKey() });
            queryClient.invalidateQueries({
                queryKey: trpc.agents.getOne.queryKey({ id: agent.id }),
            });
        },
        onError: (error) => {
            toast.error(`Error updating agent: ${error.message}`);
        }
    }));

    const deleteAgent = useMutation(trpc.agents.delete.mutationOptions({
        onSuccess: () => {
            toast.success("Agent Deleted successfully!");
            queryClient.invalidateQueries({ queryKey: trpc.agents.getMany.queryKey() });
        },
        onError: (error) => {
            toast.error(`Error deleting agent: ${error.message}`);
        }
    }));

    return { updateAgent, deleteAgent };
};

// Card header component
const CardHeader = ({ agent, onEdit, onDelete }: {
    agent: Agent;
    onEdit: () => void;
    onDelete: () => void;
}) => (
    <header className="flex items-start gap-4">
        <div
            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ background: CARD_STYLES.accentGradient }}
        >
            <Image
                src={NexaAv}
                alt="Agent avatar"
                width={120}
                height={120}
                className="object-cover w-12 h-12 rounded-full"
                unoptimized
            />
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold truncate text-white">
                    {agent.name}
                </h3>

                <Button
                    aria-label="more"
                    className={`p-1 rounded-md ${CARD_STYLES.buttonBg}`}
                    title="More actions"
                >
                    <MoreMenu
                        actions={[
                            { name: "Edit", icon: <Edit size={16} />, onClick: onEdit },
                            { name: "Delete", icon: <Trash size={16} />, onClick: onDelete },
                        ]}
                    />
                </Button>
            </div>

            <div className="mt-1 text-xs text-gray-400 flex items-center gap-2">
                <span className="leading-none">Created</span>
                <span className="font-medium leading-none">{timeAgo(agent.createdAt)}</span>
            </div>
        </div>
    </header>
);

// Card footer component
const CardFooter = ({ agent, dark }: { agent: Agent; dark: boolean }) => (
    <footer className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
            <span
                className="px-2 py-1 rounded-md text-[11px] font-medium"
                style={{
                    background: dark ? "rgba(255,255,255,0.02)" : "rgba(2,6,23,0.02)"
                }}
            >
                {agent.id.slice(0, 6)}
            </span>
            <span className="text-gray-400">Updated {timeAgo(agent.updatedAt)}</span>
        </div>

        <div className="text-gray-400 text-right">
            <button className="text-sm px-3 py-1 rounded-md hover:underline">Open</button>
        </div>
    </footer>
);

export default function AgentCard({ agent, dark }: { agent: Agent; dark: boolean }) {
    const [editOpen, setEditOpen] = useState(false);
    const { updateAgent, deleteAgent } = useAgentMutations(agent);

    const handleUpdate = async ({ id, name, instructions }: {
        id: string;
        name: string;
        instructions: string;
    }) => {
        await updateAgent.mutateAsync({ id, name, instructions });
    };

    const handleDelete = async () => {
        const ok = await nexaConfirm({
            title: "Delete Agent?",
            description: "This action cannot be undone. Are you sure you want to permanently delete this agent?",
            confirmText: "Delete",
            cancelText: "Cancel",
        });

        if (!ok) return;
        await deleteAgent.mutateAsync({ id: agent.id });
    };

    const handleEdit = () => {
        setEditOpen(true);
    };

    return (
        <>
            <motion.article
                layout
                whileHover={{ y: -6 }}
                className="rounded-2xl p-5 shadow-md border overflow-hidden"
                style={{
                    background: CARD_STYLES.cardBg,
                    borderColor: CARD_STYLES.borderColor
                }}
            >
                <CardHeader
                    agent={agent}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <div className="mt-4 text-sm text-gray-300" style={{ minHeight: 64 }}>
                    {truncate(agent.instructions, TRUNCATE_LENGTH)}
                </div>

                <CardFooter agent={agent} dark={dark} />
            </motion.article>

            <NewAgentDialog
                open={editOpen}
                setOpen={setEditOpen}
                initialData={agent as Agent | null}
                onSave={handleUpdate}
            />
        </>
    );
}