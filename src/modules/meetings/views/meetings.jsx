// modules/Meetings/components/meetings.jsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Search, LayoutGrid, Rows3, Pencil, Trash2 } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import StateLoader from "../../Loader/LoadingState";
import StateError from "../../Error/ErrorState";
import EmptyState from "../../Error/emptyState";
import { toast } from "sonner";
import { nexaConfirm } from "@/components/ui/nexaConfirm";
import MeetingCard from "./components/MeetingCard";
import MeetingTable from "./components/MeetingTable"

// -- View modes
const VIEW_MODES = { CARD: "card", TABLE: "table" };
const STORAGE_KEYS = { VIEW_MODE: "meetings:view" };

// Reuse button styles like your agents file
const BUTTON_STYLES = {
    newButton: "px-4 py-2 rounded-lg font-medium shadow-sm text-white",
    newButtonGradient: "linear-gradient(90deg,#6366F1,#F43F5E)",
    viewToggle: "px-3 py-2 text-sm flex items-center gap-2",
    viewToggleActive: "bg-white/10 text-white",
    viewToggleInactive: "text-gray-300 hover:bg-white/5",
};

// small date helpers
const formatDateTime = (d) => {
    if (!d) return "-";
    try {
        return new Date(d).toLocaleString();
    } catch {
        return String(d);
    }
};
const shortId = (id = "") => (id.length > 8 ? `${id.slice(0, 8)}…` : id);

// Persisted view mode hook
const useViewMode = () => {
    const [viewMode, setViewMode] = useState(VIEW_MODES.CARD);
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
        if (saved === VIEW_MODES.TABLE || saved === VIEW_MODES.CARD) setViewMode(saved);
    }, []);
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
    }, [viewMode]);
    return [viewMode, setViewMode];
};

// mutations for meetings
const useMeetingMutations = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

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

    return { updateMeeting, deleteMeeting };
};

// Search / header
const SearchHeader = ({ query, setQuery, viewMode, setViewMode }) => (
    <div className="mb-6 flex items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-semibold text-white">Meetings</h1>
            <p className="text-sm text-gray-400 mt-1">Schedule and transcripts — quick access</p>
        </div>

        <div className="flex items-center gap-3">
            <label className="relative block">
                <span className="sr-only">Search meetings</span>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="text-gray-400" />
                </span>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 pr-3 py-2 rounded-lg w-64 text-sm bg-transparent border border-gray-700/40 placeholder-gray-500 text-white"
                    placeholder="Search by meeting or agent..."
                />
            </label>

            <div className="flex items-center rounded-lg border border-white/10 overflow-hidden">
                <button
                    onClick={() => setViewMode(VIEW_MODES.CARD)}
                    className={`${BUTTON_STYLES.viewToggle} ${viewMode === VIEW_MODES.CARD ? BUTTON_STYLES.viewToggleActive : BUTTON_STYLES.viewToggleInactive}`}
                    title="Card view"
                >
                    <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                    onClick={() => setViewMode(VIEW_MODES.TABLE)}
                    className={`${BUTTON_STYLES.viewToggle} border-l border-white/10 ${viewMode === VIEW_MODES.TABLE ? BUTTON_STYLES.viewToggleActive : BUTTON_STYLES.viewToggleInactive}`}
                    title="Table view"
                >
                    <Rows3 className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);

// Simple card for mobile/dashboard
// const MeetingCard = ({ meeting, onView, onEdit, onDelete }) => {
//     const agentName = meeting?.agent?.name || meeting.agentName || meeting.agentId || "Unknown";
//     return (
//         <div className="p-4 rounded-lg border border-white/5 bg-gradient-to-br from-[#071118]/80 to-[#051019]/60">
//             <div className="flex items-start gap-3">
//                 <div className="flex-1">
//                     <div className="text-sm text-gray-300">{agentName}</div>
//                     <button onClick={() => onView(meeting)} className="text-white text-lg font-semibold mt-1 block text-left">
//                         {meeting.name}
//                     </button>
//                     <div className="text-xs text-gray-400 mt-2">{shortId(meeting.id)}</div>
//                 </div>

//                 <div className="flex flex-col items-end gap-2">
//                     <div className="text-xs text-gray-300">{meeting.status}</div>
//                     <div className="text-xs text-gray-400">{formatDateTime(meeting.startedAt)}</div>
//                     <div className="flex gap-2 mt-2">
//                         <button onClick={() => onEdit(meeting)} className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm border border-white/10 hover:bg-white/5">
//                             <Pencil className="w-4 h-4" /> Edit
//                         </button>
//                         <button onClick={() => onDelete(meeting.id)} className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm border border-white/10 hover:bg-white/5">
//                             <Trash2 className="w-4 h-4" /> Delete
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// Table view, concise columns
// const MeetingTable = ({ meetings, onView, onEdit, onDelete }) => (
//     <div className="rounded-xl overflow-hidden border border-white/5">
//         <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//                 <thead className="text-left text-gray-300 ">
//                     <tr className="border-b border-white/5 ">
//                         <th className="px-6 py-4 font-medium">ID</th>
//                         <th className="px-6 py-4 font-medium">Meeting</th>
//                         <th className="px-6 py-4 font-medium">Agent</th>
//                         <th className="px-6 py-4 font-medium">Status</th>
//                         <th className="px-6 py-4 font-medium">Started</th>
//                         <th className="px-6 py-4 font-medium">Ended</th>
//                         <th className="px-6 py-4 font-medium text-right">Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {meetings.map((m) => {
//                         const agentName = m?.agent?.name || m.agentName || m.agentId || "Unknown";
//                         return (
//                             <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.03]">
//                                 <td className="px-6 py-4 align-middle text-gray-400">{shortId(m.id)}</td>
//                                 <td className="px-6 py-4 align-middle">
//                                     <button onClick={() => onView(m)} className="text-left text-white font-medium hover:underline">
//                                         {m.name}
//                                     </button>
//                                 </td>
//                                 <td className="px-6 py-4 align-middle text-gray-300">{agentName}</td>
//                                 <td className="px-6 py-4 align-middle">
//                                     <span className={`inline-block px-2 py-0.5 rounded text-xs ${statusBadgeClass(m.status)}`}>
//                                         {m.status}
//                                     </span>
//                                 </td>
//                                 <td className="px-6 py-4 align-middle text-gray-300">{formatDateTime(m.startedAt)}</td>
//                                 <td className="px-6 py-4 align-middle text-gray-300">{formatDateTime(m.endedAt)}</td>
//                                 <td className="px-6 py-4 align-middle text-right">
//                                     <div className="inline-flex items-center gap-2">
//                                         <button onClick={() => onEdit(m)} className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm border border-white/10 hover:bg-white/5">
//                                             <Pencil className="w-4 h-4" /> Edit
//                                         </button>
//                                         <button onClick={() => onDelete(m.id)} className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm border border-white/10 hover:bg-white/5">
//                                             <Trash2 className="w-4 h-4" /> Delete
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>
//         </div>
//     </div>
// );

// small helper that returns badge classes based on status
function statusBadgeClass(status) {
    switch (status) {
        case "upcoming":
            return "bg-blue-900 text-blue-200";
        case "active":
            return "bg-green-900 text-green-200";
        case "processing":
            return "bg-yellow-900 text-yellow-200";
        case "completed":
            return "bg-gray-800 text-gray-200";
        case "cancelled":
            return "bg-red-900 text-red-200";
        default:
            return "bg-gray-800 text-gray-200";
    }
}

// Simple Edit modal (name + status + start/end)
function EditMeetingModal({ open, setOpen, meeting, onSave }) {
    const [name, setName] = useState(meeting?.name || "");
    const [status, setStatus] = useState(meeting?.status || "upcoming");
    const [startedAt, setStartedAt] = useState(meeting?.startedAt ? toInputDatetime(meeting.startedAt) : "");
    const [endedAt, setEndedAt] = useState(meeting?.endedAt ? toInputDatetime(meeting.endedAt) : "");

    useEffect(() => {
        setName(meeting?.name || "");
        setStatus(meeting?.status || "upcoming");
        setStartedAt(meeting?.startedAt ? toInputDatetime(meeting.startedAt) : "");
        setEndedAt(meeting?.endedAt ? toInputDatetime(meeting.endedAt) : "");
    }, [meeting, open]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
            <div className="relative bg-[#07121a] border border-white/5 rounded-lg p-6 w-full max-w-lg z-10">
                <h3 className="text-lg font-semibold text-white mb-4">Edit Meeting</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-sm text-gray-300 block mb-1">Name</label>
                        <input className="w-full rounded px-3 py-2 bg-transparent border border-white/10 text-white" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-sm text-gray-300 block mb-1">Status</label>
                        <select className="w-full rounded px-3 py-2 bg-transparent border border-white/10 text-white" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="upcoming">upcoming</option>
                            <option value="active">active</option>
                            <option value="processing">processing</option>
                            <option value="completed">completed</option>
                            <option value="cancelled">cancelled</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm text-gray-300 block mb-1">Start</label>
                            <input type="datetime-local" value={startedAt} onChange={(e) => setStartedAt(e.target.value)} className="w-full rounded px-3 py-2 bg-transparent border border-white/10 text-white" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-300 block mb-1">End</label>
                            <input type="datetime-local" value={endedAt} onChange={(e) => setEndedAt(e.target.value)} className="w-full rounded px-3 py-2 bg-transparent border border-white/10 text-white" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={() => setOpen(false)} className="px-3 py-1 rounded border border-white/10">Cancel</button>
                        <button
                            onClick={() =>
                                onSave({
                                    id: meeting.id,
                                    name: name.trim() || meeting.name,
                                    status,
                                    startedAt: startedAt ? new Date(startedAt).toISOString() : null,
                                    endedAt: endedAt ? new Date(endedAt).toISOString() : null,
                                })
                            }
                            className="px-4 py-2 rounded bg-[#6366F1] text-white"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function toInputDatetime(iso) {
    if (!iso) return "";
    const dt = new Date(iso);
    // produce yyyy-MM-ddTHH:mm
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = dt.getFullYear();
    const mm = pad(dt.getMonth() + 1);
    const dd = pad(dt.getDate());
    const hh = pad(dt.getHours());
    const mi = pad(dt.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

// Simple drawer for meeting details
function MeetingDrawer({ meeting, open, setOpen, onEdit, onDelete }) {
    if (!open || !meeting) return null;
    const agentName = meeting?.agent?.name || meeting.agentName || meeting.agentId || "Unknown";
    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
            <aside className="relative ml-auto w-full max-w-2xl bg-[#07121a] border-l border-white/5 p-6 overflow-auto">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-white">{meeting.name}</h2>
                        <div className="text-sm text-gray-400 mt-1">ID: {shortId(meeting.id)}</div>
                        <div className="mt-2 text-xs text-gray-300">Agent: {agentName}</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(meeting)} className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm border border-white/10 hover:bg-white/5">
                            <Pencil className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => onDelete(meeting.id)} className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm border border-white/10 hover:bg-white/5">
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                        <button onClick={() => setOpen(false)} className="px-3 py-1 rounded border border-white/10">Close</button>
                    </div>
                </div>

                <div className="mt-6 space-y-4 text-sm text-gray-300">
                    <div><strong>Status:</strong> <span className={statusBadgeClass(meeting.status)} style={{ padding: "2px 6px", borderRadius: 6 }}>{meeting.status}</span></div>
                    <div><strong>Start:</strong> {formatDateTime(meeting.startedAt)}</div>
                    <div><strong>End:</strong> {formatDateTime(meeting.endedAt)}</div>
                    <div><strong>Created:</strong> {formatDateTime(meeting.createdAt)}</div>
                    <div><strong>Updated:</strong> {formatDateTime(meeting.updatedAt)}</div>
                    <div className="pt-3">
                        <strong>Summary:</strong>
                        <p className="mt-2 text-gray-300">{meeting.summary || <span className="text-gray-500">No summary available.</span>}</p>
                    </div>
                    <div className="pt-3">
                        <strong>Recording:</strong> {meeting.recordingUrl ? <a className="text-blue-300 underline" href={meeting.recordingUrl} target="_blank" rel="noreferrer">Open</a> : <span className="text-gray-500">No recording</span>}
                    </div>
                    <div>
                        <strong>Transcript:</strong> {meeting.transcriptUrl ? <a className="text-blue-300 underline" href={meeting.transcriptUrl} target="_blank" rel="noreferrer">Open</a> : <span className="text-gray-500">No transcript</span>}
                    </div>
                </div>
            </aside>
        </div>
    );
}

// -------------------- Main Meetings component --------------------
export default function Meetings() {
    const trpc = useTRPC();
    const [query, setQuery] = useState("");
    const [viewMode, setViewMode] = useViewMode();

    // drawer & edit modal
    const [viewOpen, setViewOpen] = useState(false);
    const [viewMeeting, setViewMeeting] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editMeeting, setEditMeeting] = useState(null);

    const { updateMeeting, deleteMeeting } = useMeetingMutations();

    // fetch meetings (suspense)
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions());
    console.log({ "Meetings Data": data });

    const filtered = useMemo(() => {
        if (!data) return [];
        const q = query.trim().toLowerCase();
        if (!q) return data;
        return data.filter((m) => {
            const agentName = m?.agent?.name || m.agentName || "";
            return (
                (m.name || "").toLowerCase().includes(q) ||
                agentName.toLowerCase().includes(q) ||
                (m.id || "").toLowerCase().includes(q)
            );
        });
    }, [data, query]);

    // handlers
    const handleView = (meeting) => {
        setViewMeeting(meeting);
        setViewOpen(true);
    };

    const handleEdit = (meeting) => {
        setEditMeeting(meeting);
        setEditOpen(true);
        // close drawer if open
        setViewOpen(false);
    };

    const handleSaveEdit = async (payload) => {
        await updateMeeting.mutateAsync(payload);
        setEditOpen(false);
    };

    const handleDelete = async (id) => {
        const ok = await nexaConfirm({
            title: "Delete meeting?",
            description: "This action cannot be undone. Are you sure you want to delete this meeting?",
            confirmText: "Delete",
            cancelText: "Cancel",
        });
        if (!ok) return;
        await deleteMeeting.mutateAsync({ id });
        // close drawer if the same meeting was open
        if (viewMeeting?.id === id) {
            setViewOpen(false);
            setViewMeeting(null);
        }
    };

    return (
        <>
            <section className="w-full">
                <SearchHeader query={query} setQuery={setQuery} viewMode={viewMode} setViewMode={setViewMode} />

                <div className="mb-6">
                    <p className="text-sm text-gray-400 mt-1">{data?.length ?? 0} meetings · organized for quick access</p>
                </div>

                {viewMode === VIEW_MODES.CARD ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map((m) => (
                                <MeetingCard

                                    meeting={m}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                        {filtered.length === 0 && (
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
                            <MeetingTable meetings={filtered} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
                        )}
                    </>
                )}
            </section>

            {/* Drawer / detail */}
            <MeetingDrawer meeting={viewMeeting} open={viewOpen} setOpen={setViewOpen} onEdit={handleEdit} onDelete={handleDelete} />

            {/* Edit modal */}
            <EditMeetingModal open={editOpen} setOpen={setEditOpen} meeting={editMeeting} onSave={handleSaveEdit} />
        </>
    );
}

// Loading / Error exports for Suspense boundaries
export const MeetingsLoading = () => <StateLoader title="Fetching meetings..." description="Please wait while we load meetings." />;
export const MeetingsError = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <StateError title="Something went wrong" description="Please try again later." />
    </div>
);
