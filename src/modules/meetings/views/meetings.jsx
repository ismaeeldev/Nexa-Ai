// modules/Meetings/components/meetings.jsx
"use client";

import React, { useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { nexaConfirm } from "@/components/ui/nexaConfirm";

import StateLoader from "../../Loader/LoadingState";
import StateError from "../../Error/ErrorState";
import EmptyState from "../../Error/emptyState";

import MeetingCard from "./components/MeetingCard";
import MeetingTable from "./components/MeetingTable";
import SearchHeader from "./components/searchHeader";
import MeetingDialog from "./components/MeetingDialog";
import MeetingDrawer from "./components/MeetingDrawer";
import StateDrawer from "./components/StateDrawer"
import { useRouter } from "next/navigation";



/* simplified persisted view hook */
const VIEW_MODES = { CARD: "card", TABLE: "table" };
const STORAGE_KEY = "meetings:view";
function useViewMode(defaultMode = VIEW_MODES.CARD) {
    const [viewMode, setViewMode] = useState(() => {
        try {
            const s = localStorage.getItem(STORAGE_KEY);
            return s === VIEW_MODES.TABLE ? VIEW_MODES.TABLE : VIEW_MODES.CARD;
        } catch {
            return defaultMode;
        }
    });
    React.useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, viewMode);
        } catch { }
    }, [viewMode]);
    return [viewMode, setViewMode];
}

export default function Meetings() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    // state
    const [query, setQuery] = useState("");
    const [viewMode, setViewMode] = useViewMode();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingMeeting, setEditingMeeting] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [viewMeeting, setViewMeeting] = useState(null);
    const router = useRouter();

    // fetch data (suspense)
    const { data: meetings } = useSuspenseQuery(trpc.meetings.getMany.queryOptions());
    const { data: agents } = useSuspenseQuery(trpc.agents.getMany.queryOptions());


    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
            onSuccess: () => {
                toast.success("Meeting created");
                queryClient.invalidateQueries({ queryKey: trpc.meetings.getMany.queryKey() });
            },
            onError: (err) => toast.error(`Create failed: ${err.message || err}`),
        })
    );

    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
            onSuccess: () => {
                toast.success("Meeting updated");
                queryClient.invalidateQueries({ queryKey: trpc.meetings.getMany.queryKey() });
            },
            onError: (err) => toast.error(`Update failed: ${err.message || err}`),
        })
    );

    const deleteMeeting = useMutation(
        trpc.meetings.delete.mutationOptions({
            onSuccess: () => {
                toast.success("Meeting deleted");
                queryClient.invalidateQueries({ queryKey: trpc.meetings.getMany.queryKey() });
            },
            onError: (err) => toast.error(`Delete failed: ${err.message || err}`),
        })
    );

    // Filtering
    const filtered = useMemo(() => {
        if (!meetings) return [];
        const q = query.trim().toLowerCase();
        if (!q) return meetings;
        return meetings.filter((m) => {
            const agentName = m?.agent?.name || m.agentName || "";
            return (
                (m.name || "").toLowerCase().includes(q) ||
                agentName.toLowerCase().includes(q) ||
                (m.id || "").toLowerCase().includes(q)
            );
        });
    }, [meetings, query]);

    // Handlers
    const openNew = () => {
        setEditingMeeting(null);
        setDialogOpen(true);
    };

    const openEdit = (meeting) => {
        setEditingMeeting(meeting);
        setDialogOpen(true);
        setDrawerOpen(false);
    };

    const handleView = (meeting) => {
        setViewMeeting(meeting);
        setDrawerOpen(true);
    };

    const handleSave = async (payload) => {
        // payload: { id?, name, status, agentId, startedAt, endedAt, summary }
        if (payload.id) {
            await updateMeeting.mutateAsync(payload);
        } else {
            await createMeeting.mutateAsync(payload);
        }
        setDialogOpen(false);
        setEditingMeeting(null);
    };

    const handleDelete = async (id) => {
        const ok = await nexaConfirm({
            title: "Delete meeting?",
            description: "This action cannot be undone.",
            confirmText: "Delete",
            cancelText: "Cancel",
        });
        if (!ok) return;
        await deleteMeeting.mutateAsync({ id });
        if (viewMeeting?.id === id) {
            setDrawerOpen(false);
            setViewMeeting(null);
        }
    };

    const onStart = (id) => {
        router.push(`/call/${id}`);
    };
    const onJoin = (id) => {
        router.push(`/call/${id}`);
    };


    if (!meetings) return <StateLoader title="Fetching meetings..." description="Loading..." />;

    return (
        <>
            <section className="w-full">
                <SearchHeader
                    query={query}
                    setQuery={setQuery}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    onCreateNew={openNew}
                />

                <div className="mb-6">
                    <p className="text-sm text-gray-400 mt-1">
                        {meetings?.length ?? 0} meetings · organized for quick access
                    </p>
                </div>

                {viewMode === VIEW_MODES.CARD ? (
                    <>
                        {filtered.length ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filtered.map((m) => (
                                    <MeetingCard
                                        key={m.id}
                                        meeting={m}
                                        onView={handleView}
                                        onEdit={openEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-10 text-center text-gray-400">
                                <EmptyState title="meetings" />
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {filtered.length === 0 ? (
                            <div className="mt-6">
                                <EmptyState title="meetings" />
                            </div>
                        ) : (
                            <MeetingTable meetings={filtered} onView={handleView} onEdit={openEdit} onDelete={handleDelete} />
                        )}
                    </>
                )}
            </section>


            <StateDrawer
                open={drawerOpen}
                meeting={viewMeeting}
                onClose={() => setDrawerOpen(false)}
                onEdit={openEdit}
                onDelete={handleDelete}
                onStart={onStart}
                onCancelMeeting={() => { }}
                onJoin={onJoin}
                onDownloadTranscript={() => { }}
                onViewRecording={() => { }}

            />


            {/* Create / Edit dialog */}
            <MeetingDialog
                open={dialogOpen}
                setOpen={setDialogOpen}
                meeting={editingMeeting}
                agents={agents || []}
                onSave={handleSave}
            />
        </>
    );
}

/* Optional Suspense boundaries exports */
export const MeetingsLoading = () => <StateLoader title="Fetching meetings..." description="Please wait while we load meetings." />;
export const MeetingsError = ({ error }) => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <StateError title="Something went wrong" description={error?.message || "Please try again later."} />
    </div>
);
