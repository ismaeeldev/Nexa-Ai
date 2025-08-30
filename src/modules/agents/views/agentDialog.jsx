// NewAgentDialog.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { X, ImagePlus, Loader2 } from "lucide-react";
import NexaAv from "../../../../public/nexaAv.webp";


const NewAgentDialog = ({ open, setOpen, onSave, initialData = null }) => {
    const [name, setName] = useState("");
    const [instructions, setInstructions] = useState("");
    const [saving, setSaving] = useState(false);

    const inputRef = useRef(null);

    // Determine mode by presence of initialData.id
    const isEdit = Boolean(initialData && initialData.id);

    // Prefill inputs whenever dialog opens or initialData changes
    useEffect(() => {
        if (!open) return;
        setName(initialData?.name ?? "");
        setInstructions(initialData?.instructions ?? "");
        // focus after a short delay (keeps previous behavior)
        const t = setTimeout(() => inputRef.current?.focus?.(), 80);
        return () => clearTimeout(t);
    }, [open, initialData]);

    // keyboard: Esc to close, Cmd/Ctrl+S to save
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, name, instructions]); // handleSave is recreated each render; this matches previous behavior

    const canSave = useMemo(() => {
        return name.trim().length > 1 && instructions.trim().length > 3 && !saving;
    }, [name, instructions, saving]);

    const reset = () => {
        setName("");
        setInstructions("");
        setSaving(false);
    };

    const close = () => {
        setOpen(false);
    };

    const handleSave = async () => {
        if (!canSave) return;
        const payload = isEdit
            ? { id: initialData.id, name: name.trim(), instructions: instructions.trim() }
            : { name: name.trim(), instructions: instructions.trim() };

        try {
            setSaving(true);
            await onSave(payload); // caller decides create or update
            setSaving(false);
            setOpen(false);

            // keep behavior same as create: reset fields after saved
            reset();
        } catch (err) {
            setSaving(false);
            console.error("Save failed:", err);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                aria-hidden="true"
                onClick={close}
            />

            {/* Centered panel */}
            <div className="relative mx-auto w-full max-w-lg md:max-w-2xl px-4 py-12">
                <div
                    className="relative rounded-xl overflow-hidden border border-white/5"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(7,11,19,0.95) 0%, rgba(10,14,22,0.88) 100%)",
                        boxShadow: "0 20px 60px rgba(2,6,23,0.6), 0 0 40px rgba(244,63,94,0.04)",
                        transformOrigin: "center center",
                        animation: "nexaDialogIn 180ms cubic-bezier(.22,1,.36,1)",
                    }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="new-agent-title"
                >
                    {/* Accent strip */}
                    <div className="absolute top-0 left-0 right-0 h-1">
                        <div
                            className="h-full w-full"
                            style={{ background: "linear-gradient(90deg,#F43F5E,#6366F1)" }}
                        />
                    </div>

                    {/* Close button */}
                    <button
                        onClick={close}
                        aria-label="Close new agent dialog"
                        className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-gray-300 hover:text-white hover:bg-white/6 transition-colors"
                    >
                        <X className="h-4 w-4 cursor-pointer" />
                    </button>

                    {/* Header */}
                    <div className="px-4 pt-4 pb-2 flex items-center gap-3">
                        <div
                            className="flex items-center justify-center rounded-md"
                            style={{
                                width: 36,
                                height: 36,
                                background: "linear-gradient(90deg,#F43F5E,#6366F1)",
                                boxShadow: "0 6px 20px rgba(99,102,241,0.12)",
                            }}
                        >
                            <ImagePlus className="h-4 w-4 text-white" />
                        </div>

                        <div>
                            <div id="new-agent-title" className="text-sm font-semibold text-gray-100">
                                {isEdit ? "Edit Agent" : "New Agent"}
                            </div>
                            <div className="text-xs text-gray-400">
                                {isEdit ? "Update agent details" : "Create a new agent with name and instructions"}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-6">
                        {/* Avatar + Name */}
                        <div className="flex items-start md:items-center gap-4 md:gap-5">
                            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                                <Image
                                    src={initialData?.avatar ?? NexaAv}
                                    alt="Agent avatar"
                                    width={160}
                                    height={160}
                                    className="object-cover w-full h-full"
                                    unoptimized
                                />
                            </div>

                            <div className="flex-1">
                                <label className="block text-xs text-gray-400 mb-1">Agent Name</label>
                                <input
                                    ref={inputRef}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Sales Assistant"
                                    className="w-full bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm py-3 px-3 border border-transparent rounded-md focus:border-[#6366F1]/30 focus:ring-0"
                                />
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="mt-4">
                            <label className="block text-xs text-gray-400 mb-1">Instructions</label>
                            <textarea
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Describe what this agent should do…"
                                rows={5}
                                className="w-full resize-y bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm py-3 px-3 border border-transparent rounded-md focus:border-[#6366F1]/30 focus:ring-0"
                            />
                            <div className="mt-1 text-[11px] text-gray-500">
                                Tip: Keep it concise and action-oriented.
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
                                    background: "linear-gradient(90deg,#F43F5E,#6366F1)",
                                    boxShadow: "0 6px 20px rgba(99,102,241,0.16)",
                                }}
                            >
                                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isEdit ? "Update" : "Save"} {isEdit ? "" : "(⌘/Ctrl+S)"}
                            </button>
                        </div>
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

export default NewAgentDialog;
