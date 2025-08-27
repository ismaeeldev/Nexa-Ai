// DashboardCommand.jsx
"use client";

import React, { useEffect } from "react";
import { CommandDialog, CommandInput, CommandList, CommandItem } from "cmdk";
import { X, Command as CommandIcon } from "lucide-react";


const DashboardCommand = ({ open, setOpen }) => {
    // keyboard shortcuts: ESC to close, Cmd/Ctrl+K to toggle
    useEffect(() => {
        const onKey = (e) => {
            // toggle with cmd/ctrl + k
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setOpen((s) => !s);
            }
            // close with Escape
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [setOpen]);

    // autofocus the CommandInput when dialog opens
    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => {
            const el = document.querySelector(".nexa-cmd-input");
            if (el && typeof el.focus === "function") el.focus();
        }, 80);
        return () => clearTimeout(t);
    }, [open]);

    return (
        <CommandDialog
            open={open}
            onOpenChange={setOpen}
            className="fixed inset-0 z-50"
        >
            {/* backdrop */}
            <div
                className="absolute inset-0 bg-black/55 backdrop-blur-sm"
                aria-hidden="true"
            />




            {/* centered panel */}
            <div className="relative mx-auto w-full max-w-lg px-4 py-12">
                <div
                    className="relative rounded-xl overflow-hidden border border-white/5"
                    style={{
                        // subtle, realistic dark glass + glow
                        background:
                            "linear-gradient(180deg, rgba(7,11,19,0.95) 0%, rgba(10,14,22,0.88) 100%)",
                        boxShadow:
                            "0 20px 60px rgba(2,6,23,0.6), 0 0 40px rgba(244,63,94,0.04)",
                        transformOrigin: "center center",
                        // entrance animation (works consistently)
                        animation: open ? "nexaDialogIn 180ms cubic-bezier(.22,1,.36,1)" : "none",
                    }}
                >
                    {/* top accent gradient strip */}
                    <div className="absolute top-0 left-0 right-0 h-1">
                        <div className="h-full w-full" style={{ background: "linear-gradient(90deg,#F43F5E,#6366F1)" }} />
                    </div>

                    {/* close button */}
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close command palette"
                        className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-gray-300 hover:text-white hover:bg-white/6 transition-colors"
                    >
                        <X className="h-4 w-4 cursor-pointer" />
                    </button>

                    {/* optional small icon + label */}
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
                            <CommandIcon className="h-4 w-4 text-white" />
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-gray-100">Command</div>
                            <div className="text-xs text-gray-400">Find a meeting, agent or action</div>
                        </div>
                    </div>

                    {/* input */}
                    <div className="px-4 pb-3">
                        <CommandInput
                            placeholder="Find a meeting or agent..."
                            className="nexa-cmd-input w-full bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm py-3 px-3 border border-transparent rounded-md focus:border-[#6366F1]/30 focus:ring-0"
                        />
                    </div>

                    {/* results / list */}
                    <div className="p-3">
                        <CommandList className="max-h-72 overflow-y-auto">
                            {/* Example items — replace / map with real data */}
                            <CommandItem
                                onSelect={() => {
                                    // example: close and navigate or run action
                                    setOpen(false);
                                    // navigate(...) if needed
                                }}
                                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-200 hover:bg-[#0f172a]/60 cursor-pointer"
                            >
                                <div className="flex-none text-[#6366F1]">📅</div>
                                <div className="flex-1 leading-tight">
                                    <div className="font-medium">Team Sync — 10:00 AM</div>
                                    <div className="text-xs text-gray-400">Meeting • Zoom</div>
                                </div>
                            </CommandItem>

                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                }}
                                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-200 hover:bg-[#0f172a]/60 cursor-pointer"
                            >
                                <div className="flex-none text-[#F43F5E]">🤖</div>
                                <div className="flex-1 leading-tight">
                                    <div className="font-medium">Open Agent: Sales Assistant</div>
                                    <div className="text-xs text-gray-400">Agent • Agents</div>
                                </div>
                            </CommandItem>

                            {/* fallback / empty state */}
                            <div className="px-3 py-3 text-xs text-gray-400">Type to search…</div>
                        </CommandList>
                    </div>
                </div>
            </div>

            {/* small style block for keyframe (safe inline) */}
            <style>{`
        @keyframes nexaDialogIn {
          0% { transform: translateY(8px) scale(.985); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
        </CommandDialog>
    );
};

export default DashboardCommand;
