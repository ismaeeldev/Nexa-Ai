// modules/Meetings/components/MeetingDrawer.jsx
"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Pencil, Trash2, Copy, Download, ExternalLink } from "lucide-react";
import { nexaConfirm } from "@/components/ui/nexaConfirm";
import { toast } from "sonner";

const ACCENT_GRADIENT = "linear-gradient(90deg,#F43F5E,#6366F1)";
const PANEL_BG = "#07121a";

/* helpers */
const shortId = (id = "") => (id && id.length > 8 ? `${id.slice(0, 8)}…` : id || "-");
const formatDateTime = (iso) => {
    if (!iso) return "-";
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return String(iso);
    }
};
const durationText = (startIso, endIso) => {
    if (!startIso) return "-";
    const s = new Date(startIso).getTime();
    const e = endIso ? new Date(endIso).getTime() : Date.now();
    const diff = Math.max(0, e - s);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem ? `${hrs}h ${rem}m` : `${hrs}h`;
};
const statusBadgeClass = (status) => {
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
};

/**
 * MeetingDrawer
 * Props:
 *  - open: boolean
 *  - meeting: object (meeting) | null
 *  - onClose: () => void
 *  - onEdit: (meeting) => void
 *  - onDelete: async (id) => void
 */
export default function MeetingDrawer({ open, meeting, onClose, onEdit, onDelete }) {
    const closeRef = useRef(null);

    // focus close button on open and handle Escape
    useEffect(() => {
        if (open) {
            setTimeout(() => closeRef.current?.focus?.(), 80);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // short-circuit render
    if (!open || !meeting) return null;

    const agentName = meeting?.agent?.name || meeting.agentName || meeting.agentId || "Unknown";

    // copy helpers
    const copyToClipboard = async (text, label = "Copied") => {
        try {
            await navigator.clipboard.writeText(text || "");
            toast.success(`${label}`);
        } catch (err) {
            console.error("copy failed", err);
            toast.error("Failed to copy");
        }
    };

    const handleDownloadText = (filename, content) => {
        try {
            const blob = new Blob([content || ""], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success("Download started");
        } catch (err) {
            console.error(err);
            toast.error("Download failed");
        }
    };

    const handleDownloadTranscript = async () => {
        const url = meeting.transcriptUrl;
        if (!url) {
            toast.error("No transcript available");
            return;
        }
        // try fetching then download; if CORS blocks, open in new tab as fallback
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Fetch failed");
            const text = await res.text();
            handleDownloadText(`${meeting.name || "meeting"}-transcript.txt`, text);
        } catch (err) {
            console.warn("fetch transcript failed, falling back to open", err);
            window.open(url, "_blank");
        }
    };

    const handleDeleteClick = async () => {

        try {
            await onDelete(meeting.id);
        } catch (err) {
            console.error(err);
            toast.error("Delete failed");
        }
    };

    const openRecording = () => {
        if (meeting.recordingUrl) window.open(meeting.recordingUrl, "_blank");
        else toast.error("No recording available");
    };

    const openTranscript = () => {
        if (meeting.transcriptUrl) window.open(meeting.transcriptUrl, "_blank");
        else toast.error("No transcript available");
    };

    return (
        <AnimatePresence>
            <motion.div
                key="meeting-drawer-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex"
                aria-hidden={false}
            >
                {/* backdrop */}
                <div
                    className="absolute inset-0 bg-black/60"
                    onClick={onClose}
                    aria-hidden="true"
                />

                {/* Panel */}
                <motion.aside
                    key="meeting-drawer"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.2 }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="meeting-drawer-title"
                    className="relative ml-auto w-full max-w-2xl h-full bg-[#07121a] border-l border-white/5 overflow-auto"
                >
                    {/* top accent bar */}
                    <div style={{ height: 6, background: ACCENT_GRADIENT }} />

                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <h2 id="meeting-drawer-title" className="text-2xl font-semibold text-white">
                                    {meeting.name}
                                </h2>
                                <div className="mt-2 flex items-center gap-3 text-sm text-gray-400">
                                    <div>ID: <span className="font-mono text-xs text-gray-200 ml-1">{shortId(meeting.id)}</span></div>
                                    <button
                                        onClick={() => copyToClipboard(meeting.id, "ID copied")}
                                        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white"
                                        title="Copy full ID"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <div className="ml-2">•</div>
                                    <div>Agent: <span className="text-white ml-1">{agentName}</span></div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    ref={closeRef}
                                    onClick={() => onEdit?.(meeting)}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm border border-white/10 hover:bg-white/5"
                                    title="Edit"
                                >
                                    <Pencil className="w-4 h-4" /> Edit
                                </button>

                                <button
                                    onClick={handleDeleteClick}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm border border-white/10 hover:bg-white/5"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>

                                <button
                                    onClick={onClose}
                                    className="ml-2 rounded-md p-2 text-gray-300 hover:text-white hover:bg-white/6"
                                    title="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Meta row */}
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div>
                                <div className="text-xs text-gray-400">Status</div>
                                <div className={`inline-block px-2 py-1 mt-1 rounded ${statusBadgeClass(meeting.status)}`}>{meeting.status}</div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400">Start</div>
                                <div className="text-gray-200 mt-1">{formatDateTime(meeting.startedAt)}</div>
                            </div>

                            <div>
                                <div className="text-xs text-gray-400">End • Duration</div>
                                <div className="text-gray-200 mt-1">{formatDateTime(meeting.endedAt)} • {durationText(meeting.startedAt, meeting.endedAt)}</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <button
                                onClick={openRecording}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-white/10 hover:bg-white/5"
                            >
                                <ExternalLink className="w-4 h-4" /> Open Recording
                            </button>

                            <button
                                onClick={openTranscript}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-white/10 hover:bg-white/5"
                            >
                                <ExternalLink className="w-4 h-4" /> Open Transcript
                            </button>

                            <button
                                onClick={() => copyToClipboard(meeting.summary || "", "Summary copied")}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-white/10 hover:bg-white/5"
                                title="Copy summary"
                            >
                                <Copy className="w-4 h-4" /> Copy Summary
                            </button>

                            <button
                                onClick={() => handleDownloadTranscript()}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm border border-white/10 hover:bg-white/5"
                                title="Download transcript"
                            >
                                <Download className="w-4 h-4" /> Download Transcript
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="mt-6 h-px bg-white/3" />

                        {/* Summary */}
                        <div className="mt-4">
                            <div className="text-xs text-gray-400">Summary</div>
                            <div className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">{meeting.summary || <span className="text-gray-500">No summary available.</span>}</div>

                            {/* transcript quick preview */}
                            {meeting.transcriptUrl && (
                                <div className="mt-4">
                                    <div className="text-xs text-gray-400">Transcript</div>
                                    <div className="mt-2">
                                        <a href={meeting.transcriptUrl} target="_blank" rel="noreferrer" className="text-blue-300 underline inline-flex items-center gap-2">
                                            View full transcript <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* recording quick */}
                            {meeting.recordingUrl && (
                                <div className="mt-4">
                                    <div className="text-xs text-gray-400">Recording</div>
                                    <div className="mt-2">
                                        <a href={meeting.recordingUrl} target="_blank" rel="noreferrer" className="text-blue-300 underline inline-flex items-center gap-2">
                                            Open recording <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer meta */}
                        <div className="mt-6 text-xs text-gray-400">
                            <div>Created: {formatDateTime(meeting.createdAt)}</div>
                            <div className="mt-1">Updated: {formatDateTime(meeting.updatedAt)}</div>
                        </div>
                    </div>
                </motion.aside>
            </motion.div>
        </AnimatePresence>
    );
}
