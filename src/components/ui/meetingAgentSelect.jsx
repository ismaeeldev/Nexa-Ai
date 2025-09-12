"use client";

import React from "react";
import Image from "next/image";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

// shared input base (matches your dialog INPUT_STYLES.base)
const INPUT_BASE =
    "w-full bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm py-3 px-3 border border-transparent rounded-md focus:border-[#6366F1]/30 focus:ring-0";

// visual accent (same as agent card)
const ACCENT_GRADIENT = "linear-gradient(90deg,#F43F5E,#6366F1)";

// helper: make initials from name
const initials = (name = "") =>
    name
        .split(" ")
        .map((p) => p[0] || "")
        .slice(0, 2)
        .join("")
        .toUpperCase();

// safe short id
const shortId = (id = "") => (id && id.length > 8 ? `${id.slice(0, 8)}…` : id || "-");

/**
 * MeetingAgentSelect
 * Props:
 *  - agents: Array<{ id, name, avatarUrl? }>
 *  - value: selected agent id (string|null)
 *  - onChange: (id: string|null) => void
 *  - placeholder?: string
 */
export default function MeetingAgentSelect({
    agents = [],
    value = "",
    onChange = () => { },
    placeholder = "Select agent",
}) {
    const selected = agents.find((a) => a.id === value) ?? null;

    return (
        <Select value={value ?? ""} onValueChange={(v) => onChange(v || null)}>
            {/* Trigger */}
            <SelectTrigger className={`${INPUT_BASE} bg-transparent pr-10`} aria-label="Select agent">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar / initials */}
                    {selected ? (
                        selected.avatarUrl ? (
                            <Image
                                src={selected.avatarUrl}
                                alt={selected.name}
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                unoptimized
                            />
                        ) : (
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                                style={{ background: ACCENT_GRADIENT }}
                            >
                                {initials(selected.name)}
                            </div>
                        )
                    ) : (
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-gray-300 flex-shrink-0"
                            style={{ background: "rgba(255,255,255,0.02)" }}
                        >
                            {/** placeholder user icon (SVG) */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    )}

                    {/* Label */}
                    <div className="min-w-0">
                        {selected ? (
                            <div className="text-sm text-white truncate">{selected.name}</div>
                        ) : (
                            <SelectValue placeholder={placeholder} className="text-sm text-gray-400 truncate" />
                        )}
                        {selected && <div className="text-xs text-gray-500">{shortId(selected.id)}</div>}
                    </div>
                </div>
            </SelectTrigger>

            {/* Content: dark panel matching your theme */}
            <SelectContent className="bg-[#07121a] border border-white/6 text-white w-[320px] p-1 rounded-md shadow-lg">
                {agents.map((agent) => (
                    <SelectItem
                        key={agent.id}
                        value={agent.id}
                        className={
                            "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer " +
                            "data-[highlighted=true]:bg-white/5 data-[state=checked]:bg-white/6"
                        }
                    >
                        {agent.avatarUrl ? (
                            <Image
                                src={agent.avatarUrl}
                                alt={agent.name}
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                unoptimized
                            />
                        ) : (
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                                style={{ background: ACCENT_GRADIENT }}
                            >
                                {initials(agent.name)}
                            </div>
                        )}

                        <div className="min-w-0">
                            <div className="text-sm truncate">{agent.name}</div>
                            <div className="text-xs text-gray-500 truncate">{shortId(agent.id)}</div>
                        </div>
                    </SelectItem>
                ))}

                {agents.length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-400">No agents available</div>
                )}
            </SelectContent>
        </Select>
    );
}
