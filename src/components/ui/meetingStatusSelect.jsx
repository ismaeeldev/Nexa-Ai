"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

/**
 * MeetingStatusSelect
 * Props:
 *  - value: string
 *  - onChange: (newValue: string) => void
 *
 * Uses the same dark theme as your dialogs and agent card.
 */

// small shared input style (matches your dialog INPUT_STYLES.base)
const INPUT_BASE =
    "w-full bg-transparent text-gray-100 placeholder-gray-500 outline-none text-sm py-3 px-3 border border-transparent rounded-md focus:border-[#6366F1]/30 focus:ring-0";

// options + color tokens (keeps theme consistent)
const STATUS_OPTIONS = ["upcoming", "active", "processing", "completed", "cancelled"];
const STATUS_STYLES = {
    upcoming: { dot: "bg-blue-400", text: "text-blue-300" },
    active: { dot: "bg-green-400", text: "text-green-300" },
    processing: { dot: "bg-yellow-400", text: "text-yellow-300" },
    completed: { dot: "bg-gray-400", text: "text-gray-300" },
    cancelled: { dot: "bg-red-400", text: "text-red-300" },
};

export default function MeetingStatusSelect({ value, onChange }) {
    const pretty = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    return (
        <Select value={value} onValueChange={onChange}>
            {/* Trigger: transparent + subtle border + value + colored dot */}
            <SelectTrigger className={`${INPUT_BASE} bg-transparent pr-10`}>
                <div className="flex items-center gap-3">
                    <span
                        className={`w-2.5 h-2.5 rounded-full ${STATUS_STYLES[value]?.dot || "bg-gray-400"}`}
                        aria-hidden
                    />
                    <SelectValue placeholder="Status" />
                </div>
            </SelectTrigger>

            <SelectContent className="bg-[#07121a] border border-white/6 text-white w-[220px] p-1 rounded-md shadow-lg">
                {STATUS_OPTIONS.map((s) => (
                    <SelectItem
                        key={s}
                        value={s}
                        className={
                            // nice spacing + hover + selected state. Radix sets data-[state="checked"] and data-[highlighted]
                            "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer " +
                            "data-[highlighted=true]:bg-white/5 data-[state=checked]:bg-white/6"
                        }
                    >
                        <span className={`w-2.5 h-2.5 rounded-full ${STATUS_STYLES[s].dot}`} aria-hidden />
                        <span className={`truncate ${STATUS_STYLES[s].text}`}>{pretty(s)}</span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
