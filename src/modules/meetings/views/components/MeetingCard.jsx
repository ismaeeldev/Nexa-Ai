"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import NexaAv from "../../../../../public/nexaAv.webp";
import MoreMenu from "@/components/ui/moreMenu";
import { Edit, Trash, Eye, Video, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";


const CARD_STYLES = {
    accentGradient: "linear-gradient(90deg,#F43F5E,#6366F1)",
    cardBg: "linear-gradient(145deg,#0b1220,#071021)",
    borderColor: "rgba(255,255,255,0.03)",
};

const statusColors = {
    upcoming: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    active: "bg-green-500/10 text-green-400 border border-green-500/20",
    completed: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
    processing: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
};


const TRUNCATE_LENGTH = 140;

const timeAgo = (iso) => {
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

const truncate = (text = "", length = TRUNCATE_LENGTH) => {
    if (!text) return "";
    if (text.length <= length) return text;
    return text.slice(0, length).trimEnd() + "…";
};

const shortId = (id = "") => (id && id.length > 8 ? `${id.slice(0, 8)}…` : id || "-");

function durationText(startIso, endIso) {
    if (!startIso) return "-";
    if (!endIso) return new Date(startIso).toLocaleString();
    const s = new Date(startIso).getTime();
    const e = new Date(endIso).getTime();
    const diff = Math.max(0, e - s);
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remMin = mins % 60;
    return remMin ? `${hours}h ${remMin}m` : `${hours}h`;
}

export default function MeetingCard({ meeting, onView = () => { }, onEdit = () => { }, onDelete = () => { }, dark = true }) {
    const agentName = meeting?.agent?.name || "Unknown";

    return (
        <>
            <motion.article
                layout
                whileHover={{ y: -6 }}
                className="rounded-2xl p-5 shadow-md border overflow-hidden"
                style={{
                    background: CARD_STYLES.cardBg,
                    borderColor: CARD_STYLES.borderColor,
                }}
            >
                {/* Header: avatar + title + actions */}
                <header className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => onView(meeting)}
                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden focus:outline-none"
                        aria-label={`View ${meeting.name}`}
                        title="View details"
                        style={{ background: CARD_STYLES.accentGradient }}
                    >
                        <Image
                            src={meeting?.agent?.avatarUrl || NexaAv}
                            alt={agentName}
                            width={48}
                            height={48}
                            className="object-cover w-12 h-12 rounded-full"
                            unoptimized
                        />
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div className="min-w-0">
                                <h3 className="text-sm font-semibold truncate text-white">
                                    {meeting.name}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    {agentName} • {timeAgo(meeting.createdAt)}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <MoreMenu
                                    actions={[
                                        { name: "Edit", icon: <Edit size={16} className="hover:text-green-500 cursor-pointer" />, onClick: () => onEdit(meeting) },
                                        { name: "Delete", icon: <Trash size={16} className="hover:text-red-500 cursor-pointer" />, onClick: () => onDelete(meeting.id) },
                                        { name: "View", icon: <Eye size={16} className="hover:text-blue-500 cursor-pointer" />, onClick: () => onView(meeting) },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Body: summary/excerpt */}
                <div className="mt-4 text-sm text-gray-300" style={{ minHeight: 64 }}>
                    {truncate(meeting.summary || meeting.name, TRUNCATE_LENGTH)}
                </div>

                {/* Footer: id + badges */}
                <footer className="mt-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <span
                            className="px-2 py-1 rounded-md text-[11px] font-medium"
                            style={{
                                background: dark ? "rgba(255,255,255,0.02)" : "rgba(2,6,23,0.02)",
                            }}
                        >
                            {shortId(meeting.id)}
                        </span>
                        <span className="text-gray-400">Updated {timeAgo(meeting.updatedAt)}</span>
                    </div>

                    <div className="text-gray-400 text-right flex items-center gap-2">
                        {/* status badge */}
                        <Badge className={statusColors[meeting.status] || "bg-gray-500/10 text-gray-400"}>
                            {meeting.status}
                        </Badge>


                        {/* recording/transcript icons */}
                        {meeting.recordingUrl ? (
                            <span className="flex items-center gap-1 text-xs">
                                <Video size={14} /> <span className="sr-only">Recording available</span>
                            </span>
                        ) : null}

                        {meeting.transcriptUrl ? (
                            <span className="flex items-center gap-1 text-xs">
                                <FileText size={14} /> <span className="sr-only">Transcript available</span>
                            </span>
                        ) : null}

                        {/* duration or start */}
                        <span className="text-xs text-gray-400">{durationText(meeting.startedAt, meeting.endedAt)}</span>
                    </div>
                </footer>
            </motion.article>
        </>
    );
}
