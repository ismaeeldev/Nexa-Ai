// modules/Meetings/components/MeetingTable.jsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import NexaAv from "../../../../../public/nexaAv.webp";
import EmptyState from "../../../Error/emptyState";

const TABLE_STYLES = {
    container: {
        background: "linear-gradient(180deg, rgba(7,11,19,0.95) 0%, rgba(10,14,22,0.88) 100%)",
        boxShadow: "0 20px 60px rgba(2,6,23,0.6), 0 0 40px rgba(244,63,94,0.04)",
    },
    accentGradient: "linear-gradient(90deg,#F43F5E,#6366F1)",
    pageSizeOptions: [5, 9, 15, 25, 50],
};

const BUTTON_STYLES = {
    pageButton: "px-3 py-1 rounded-md text-sm border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50",
    actionButton: "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-white/10 hover:bg-white/10",
    selectButton: "bg-transparent border border-white/10 rounded-md px-2 py-1 text-xs outline-none",
};

// Small helpers
const shortId = (id = "") => (id && id.length > 8 ? `${id.slice(0, 8)}…` : id || "-");
const formatDateTime = (d) => {
    if (!d) return "-";
    try {
        return new Date(d).toLocaleString();
    } catch {
        return String(d);
    }
};
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

// PageButton
const PageButton = ({ disabled, onClick, children }) => (
    <button type="button" disabled={disabled} onClick={onClick} className={BUTTON_STYLES.pageButton}>
        {children}
    </button>
);

// Row component
const MeetingRow = ({ meeting, onView, onEdit, onDelete }) => {
    const agentName = meeting?.agent?.name || meeting.agentName || "Unknown";
    return (
        <tr key={meeting.id} className="border-b border-white/5 hover:bg-white/[0.06]">
            <td className="px-6 py-4 align-middle">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => onView(meeting)}
                        className="cursor-pointer w-9 h-9 rounded-md overflow-hidden bg-white/5 border border-white/10 shrink-0 focus:outline-none"
                        title={`View ${meeting.name}`}
                        aria-label={`View ${meeting.name}`}
                    >

                        <Image
                            src={meeting?.agent?.avatarUrl || NexaAv}
                            alt={agentName}
                            className="w-full h-full object-cover"
                            width={36}
                            height={36}
                            unoptimized
                        />
                    </button>

                    <div className="min-w-0">
                        <div className="font-medium truncate text-gray-100">{meeting.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">ID: {shortId(meeting.id)}</div>
                    </div>
                </div>
            </td>

            <td className="px-6 py-4 align-middle text-gray-300">{agentName}</td>

            <td className="px-6 py-4 align-middle">
                <span className={`inline-block px-2 py-0.5 rounded text-xs ${statusBadgeClass(meeting.status)}`}>
                    {meeting.status}
                </span>
            </td>

            <td className="px-6 py-4 align-middle text-gray-300">{formatDateTime(meeting.startedAt)}</td>

            <td className="px-6 py-4 align-middle text-gray-300">{formatDateTime(meeting.endedAt)}</td>

            <td className="px-6 py-4 align-middle">
                <div className="flex items-center gap-2 justify-end">
                    <button type="button" onClick={() => onEdit(meeting)} className={BUTTON_STYLES.actionButton} title="Edit">
                        <Pencil className="w-4 h-4" />
                        Edit
                    </button>

                    <button type="button" onClick={() => onDelete(meeting?.id)} className={BUTTON_STYLES.actionButton} title="Delete">
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

// Pagination controls
const PaginationControls = ({ current, pageCount, rows, sliceLength, totalLength, onPageChange, onRowsChange }) => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
        <div className="text-xs text-gray-400">
            Showing <span className="text-gray-200 font-medium">{sliceLength}</span> of{" "}
            <span className="text-gray-200 font-medium">{totalLength}</span> meetings
        </div>

        <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-gray-300">
                Rows per page
                <select
                    className={BUTTON_STYLES.selectButton}
                    value={rows}
                    onChange={(e) => {
                        onRowsChange(Number(e.target.value));
                        onPageChange(0);
                    }}
                >
                    {TABLE_STYLES.pageSizeOptions.map((n) => (
                        <option key={n} value={n} className="bg-[#0b0f17]">
                            {n}
                        </option>
                    ))}
                </select>
            </label>

            <div className="flex items-center gap-2">
                <PageButton disabled={current === 0} onClick={() => onPageChange(Math.max(0, current - 1))}>
                    Previous
                </PageButton>
                <div className="text-xs text-gray-300 mx-2">
                    Page <span className="text-gray-100 font-medium">{current + 1}</span> of{" "}
                    <span className="text-gray-100 font-medium">{pageCount}</span>
                </div>
                <PageButton disabled={current >= pageCount - 1} onClick={() => onPageChange(Math.min(pageCount - 1, current + 1))}>
                    Next
                </PageButton>
            </div>
        </div>
    </div>
);

// Main export
export default function MeetingTable({ meetings = [], pageSize = 9, onEdit = () => { }, onDelete = () => { }, onView = () => { } }) {
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(pageSize);

    const pageCount = Math.max(1, Math.ceil(meetings.length / rows));
    const current = Math.min(page, pageCount - 1);

    const slice = useMemo(() => {
        const start = current * rows;
        const end = start + rows;
        return meetings.slice(start, end);
    }, [meetings, current, rows]);

    const handlePageChange = (newPage) => setPage(newPage);
    const handleRowsChange = (newRows) => setRows(newRows);

    return (
        <>
            {meetings.length === 0 ? (
                <EmptyState title="meetings" />
            ) : (
                <div className="rounded-xl overflow-hidden border border-white/5" style={TABLE_STYLES.container}>
                    {/* Top accent */}
                    <div className="h-1 w-full" style={{ background: TABLE_STYLES.accentGradient }} />

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-gray-300 ">
                                <tr className="border-b border-white/5 text-center ">
                                    <th className="px-6 py-4 font-medium">Meeting</th>
                                    <th className="px-6 py-4 font-medium">Agent</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Started</th>
                                    <th className="px-6 py-4 font-medium">Ended</th>
                                    <th className="px-6 py-4 font-medium text-center w-48">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {slice.map((m) => (
                                    <MeetingRow key={m.id} meeting={m} onView={onView} onEdit={onEdit} onDelete={onDelete} />
                                ))}

                                {slice.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                            No meetings found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <PaginationControls
                        current={current}
                        pageCount={pageCount}
                        rows={rows}
                        sliceLength={slice.length}
                        totalLength={meetings.length}
                        onPageChange={handlePageChange}
                        onRowsChange={handleRowsChange}
                    />
                </div>
            )}
        </>
    );
}
