// ViewAgentDialog.jsx
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Calendar, Clock, Edit, Trash2 } from "lucide-react";
import NexaAv from "../../../../public/nexaAv.webp";

// Reuse the same styles from NewAgentDialog for consistency
const DIALOG_STYLES = {
    container: {
        background: "linear-gradient(180deg, rgba(7,11,19,0.95) 0%, rgba(10,14,22,0.88) 100%)",
        boxShadow: "0 20px 60px rgba(2,6,23,0.6), 0 0 40px rgba(244,63,94,0.04)",
        transformOrigin: "center center",
        animation: "nexaDialogIn 180ms cubic-bezier(.22,1,.36,1)",
    },
    accentGradient: "linear-gradient(90deg,#F43F5E,#6366F1)",
    buttonGradient: "linear-gradient(90deg,#F43F5E,#6366F1)",
    buttonShadow: "0 6px 20px rgba(99,102,241,0.16)",
};

// Custom hook for keyboard shortcuts
const useKeyboardShortcuts = (open, onClose) => {
    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);
};

// Dialog header component
const DialogHeader = ({ onClose }) => (
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
            <div id="view-agent-title" className="text-sm font-semibold text-gray-100">
                Agent Details
            </div>
            <div className="text-xs text-gray-400">
                View agent information and statistics
            </div>
        </div>

        <button
            onClick={onClose}
            aria-label="Close agent details dialog"
            className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-gray-300 hover:text-white hover:bg-white/6 transition-colors"
        >
            <X className="h-4 w-4 cursor-pointer" />
        </button>
    </div>
);

// Agent information component
const AgentInfo = ({ agent }) => (
    <>
        {/* Avatar + Name */}
        <div className="flex items-start md:items-center gap-4 md:gap-5">
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                <Image
                    src={NexaAv}
                    alt="Agent avatar"
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    unoptimized
                />
            </div>

            <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-100 mb-1">{agent.name}</h3>
                <div className="text-xs text-gray-400">ID: {agent.id}</div>
            </div>
        </div>

        {/* Meeting Statistics */}
        <div className="mt-6 p-4 rounded-md bg-white/5 border border-white/10">
            <h4 className="text-sm font-medium text-gray-200 mb-3">Meeting Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-md bg-white/3">
                    <div className="text-2xl font-bold text-white">{agent.meetingCount || 0}</div>
                    <div className="text-xs text-gray-400 mt-1">Total Meetings</div>
                </div>
                <div className="text-center p-3 rounded-md bg-white/3">
                    <div className="text-2xl font-bold text-white">{(agent.meetingCount || 0) * 23}</div>
                    <div className="text-xs text-gray-400 mt-1">Minutes Scheduled</div>
                </div>
            </div>
        </div>

        {/* Instructions */}
        <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-200 mb-2">Instructions</h4>
            <div className="p-4 rounded-md bg-white/5 border border-white/10 text-gray-300 text-sm leading-relaxed">
                {agent.instructions}
            </div>
        </div>

        {/* Metadata */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created: {new Date(agent.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span>Updated: {new Date(agent.updatedAt).toLocaleDateString()}</span>
            </div>
        </div>
    </>
);

// Dialog footer component
const DialogFooter = ({ onEdit, onDelete, onClose }) => (
    <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
        <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/6 border border-white/10"
        >
            Close (Esc)
        </button>

        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm text-white hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-red-100"
            >
                <Trash2 className="h-4 w-4" />
                Delete
            </button>
            <button
                type="button"
                onClick={onEdit}
                className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm text-white"
                style={{
                    background: DIALOG_STYLES.buttonGradient,
                    boxShadow: DIALOG_STYLES.buttonShadow,
                }}
            >
                <Edit className="h-4 w-4" />
                Edit
            </button>
        </div>
    </div>
);

const ViewAgentDialog = ({
    open,
    setOpen,
    agent,
    onEdit,
    onDelete
}) => {
    useKeyboardShortcuts(open, () => setOpen(false));

    if (!open || !agent) return null;

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = () => {
        onEdit(agent);
        setOpen(false);
    };

    const handleDelete = () => {
        onDelete(agent.id);
        setOpen(false);
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                aria-hidden="true"
                onClick={handleClose}
            />

            {/* Centered panel */}
            <div className="relative mx-auto w-full max-w-lg md:max-w-2xl px-4 py-12">
                <div
                    className="relative rounded-xl overflow-hidden border border-white/5"
                    style={DIALOG_STYLES.container}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="view-agent-title"
                >
                    {/* Accent strip */}
                    <div className="absolute top-0 left-0 right-0 h-1">
                        <div
                            className="h-full w-full"
                            style={{ background: DIALOG_STYLES.accentGradient }}
                        />
                    </div>

                    <DialogHeader onClose={handleClose} />

                    {/* Content */}
                    <div className="p-4 md:p-6">
                        <AgentInfo agent={agent} />

                        <DialogFooter
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onClose={handleClose}
                        />
                    </div>
                </div>
            </div>

            {/* Keyframes */}
            <style>{`
                @keyframes nexaDialogIn {
                    0% { transform: translateY(8px) scale(.985); opacity: 0; }
                    100% { transform: translateY(0) scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ViewAgentDialog;