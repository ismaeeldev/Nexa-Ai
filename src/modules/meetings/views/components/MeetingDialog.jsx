// modules/Meetings/components/MeetingDialog.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Calendar, Loader2 } from "lucide-react";
import MeetingStatusSelect from "@/components/ui/meetingStatusSelect";
import MeetingAgentSelect from "@/components/ui/meetingAgentSelect";

/* Minimal theme constants (kept from your agent dialog) */
const DIALOG_STYLES = {
    container: {
        background:
            "linear-gradient(180deg, rgba(7,11,19,0.95) 0%, rgba(10,14,22,0.88) 100%)",
        boxShadow: "0 20px 60px rgba(2,6,23,0.6), 0 0 40px rgba(244,63,94,0.04)",
        transformOrigin: "center center",
        animation: "nexaDialogIn 180ms cubic-bezier(.22,1,.36,1)",
    },
    accentGradient: "linear-gradient(90deg,#F43F5E,#6366F1)",
    buttonGradient: "linear-gradient(90deg,#F43F5E,#6366F1)",
    buttonShadow: "0 6px 20px rgba(99,102,241,0.16)",
};

const INPUT_BASE =
    "w-full bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm py-3 px-3 border border-transparent rounded-md focus:border-[#6366F1]/30 focus:ring-0";
const TEXTAREA_BASE = INPUT_BASE + " resize-y";

/* small helpers */
function toInputDatetime(iso) {
    if (!iso) return "";
    const dt = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(
        dt.getHours()
    )}:${pad(dt.getMinutes())}`;
}

/* keyboard shortcuts: Esc close, ⌘/Ctrl+S save */
const useKeyboardShortcuts = (open, onClose, onSave) => {
    useEffect(() => {
        if (!open) return;
        const handler = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                onSave();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose, onSave]);
};

/**
 * MeetingDialog
 * Props:
 *  - open: boolean
 *  - setOpen: (v:boolean) => void
 *  - meeting: object|null  (if null → create)
 *  - agents: [{id,name,avatarUrl?}, ...]
 *  - onSave: async (payload) => void   (payload contains agentId, name, status, startedAt, endedAt, summary, id?)
 */
export default function MeetingDialog({
    open,
    setOpen,
    meeting = null,
    agents = [],
    onSave,
}) {
    const isEdit = Boolean(meeting && meeting.id);
    const inputRef = useRef(null);

    // form state
    const [name, setName] = useState(meeting?.name ?? "");
    const [status, setStatus] = useState(meeting?.status ?? "upcoming");
    const [startedAt, setStartedAt] = useState(
        meeting?.startedAt ? toInputDatetime(meeting.startedAt) : ""
    );
    const [endedAt, setEndedAt] = useState(
        meeting?.endedAt ? toInputDatetime(meeting.endedAt) : ""
    );
    const [summary, setSummary] = useState(meeting?.summary ?? "");
    const [selectedAgentId, setSelectedAgentId] = useState(
        meeting?.agent?.id ?? meeting?.agentId ?? (agents[0]?.id ?? null)
    );
    const [saving, setSaving] = useState(false);

    // pre-fill when dialog opens or meeting changes
    useEffect(() => {
        if (!open) return;
        setName(meeting?.name ?? "");
        setStatus(meeting?.status ?? "upcoming");
        setStartedAt(meeting?.startedAt ? toInputDatetime(meeting.startedAt) : "");
        setEndedAt(meeting?.endedAt ? toInputDatetime(meeting.endedAt) : "");
        setSummary(meeting?.summary ?? "");
        setSelectedAgentId(meeting?.agent?.id ?? meeting?.agentId ?? agents[0]?.id ?? null);

        const t = setTimeout(() => inputRef.current?.focus?.(), 60);
        return () => clearTimeout(t);
    }, [open, meeting, agents]);

    const canSave = useMemo(() => name.trim().length > 0 && !saving, [name, saving]);

    const close = () => setOpen(false);

    const handleSave = async () => {
        if (!canSave) return;
        const payload = {
            id: meeting?.id,
            name: name.trim(),
            status,
            agentId: selectedAgentId ?? null,
            startedAt: startedAt ? new Date(startedAt).toISOString() : null,
            endedAt: endedAt ? new Date(endedAt).toISOString() : null,
            summary: summary?.trim() || null,
        };

        try {
            setSaving(true);
            await onSave(payload);
            setSaving(false);
            setOpen(false);
        } catch (err) {
            setSaving(false);
            console.error("Meeting save failed", err);
        }
    };

    useKeyboardShortcuts(open, close, handleSave);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                aria-hidden
                onClick={close}
            />

            {/* Panel */}
            <div className="relative mx-auto w-full max-w-lg md:max-w-2xl px-4 py-12">
                <div
                    className="relative rounded-xl overflow-hidden border border-white/5"
                    style={DIALOG_STYLES.container}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="meeting-dialog-title"
                >
                    {/* Accent strip */}
                    <div className="absolute top-0 left-0 right-0 h-1">
                        <div className="h-full w-full" style={{ background: DIALOG_STYLES.accentGradient }} />
                    </div>

                    {/* Header */}
                    <div className="px-4 pt-4 pb-2 flex items-center gap-3">
                        <div
                            className="flex items-center justify-center rounded-md"
                            style={{
                                width: 36,
                                height: 36,
                                background: DIALOG_STYLES.accentGradient,
                                boxShadow: "0 6px 20px rgba(99,102,241,0.12)",
                            }}
                        >
                            <Calendar className="h-4 w-4 text-white" />
                        </div>

                        <div>
                            <div id="meeting-dialog-title" className="text-sm font-semibold text-gray-100">
                                {isEdit ? "Edit Meeting" : "New Meeting"}
                            </div>
                            <div className="text-xs text-gray-400">
                                {isEdit ? "Update meeting details" : "Create a new meeting"}
                            </div>
                        </div>

                        <button
                            onClick={close}
                            aria-label="Close meeting dialog"
                            className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-gray-300 hover:text-white hover:bg-white/6 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-6">
                        {/* Title + status + agent row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-xs text-gray-400 mb-1">Title</label>
                                <input
                                    ref={inputRef}
                                    className={INPUT_BASE}
                                    placeholder="Weekly Sync"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Status</label>
                                <MeetingStatusSelect value={status} onChange={setStatus} />
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Agent</label>
                                <MeetingAgentSelect
                                    agents={agents}
                                    value={selectedAgentId}
                                    onChange={setSelectedAgentId}
                                />
                            </div>
                        </div>

                        {/* Start / End */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="text-sm text-gray-300 block mb-1">Start</label>
                                <input
                                    type="datetime-local"
                                    className={INPUT_BASE}
                                    value={startedAt}
                                    onChange={(e) => setStartedAt(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-1">End</label>
                                <input
                                    type="datetime-local"
                                    className={INPUT_BASE}
                                    value={endedAt}
                                    onChange={(e) => setEndedAt(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="mt-4">
                            <label className="block text-xs text-gray-400 mb-1">Summary (optional)</label>
                            <textarea
                                rows={4}
                                className={TEXTAREA_BASE}
                                placeholder="Short summary or notes…"
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                            />
                            <div className="mt-1 text-[11px] text-gray-500">
                                Tip: a short summary helps the team quickly understand outcomes.
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                            <button
                                type="button"
                                onClick={close}
                                className="rounded-md px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/6 border border-white/10"
                            >
                                Cancel (Esc)
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={!canSave}
                                className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm text-white disabled:opacity-60"
                                style={{
                                    background: DIALOG_STYLES.buttonGradient,
                                    boxShadow: DIALOG_STYLES.buttonShadow,
                                }}
                            >
                                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isEdit ? "Update" : "Create"} {isEdit ? "" : "(⌘/Ctrl+S)"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes nexaDialogIn {
          0% { transform: translateY(8px) scale(.985); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
