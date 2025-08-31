// modules/Agents/components/agentTable.jsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import NexaAv from "../../../../public/nexaAv.webp";
import NewAgentDialog from "./agentDialog";

// Constants
const TABLE_STYLES = {
    container: {
        background: "linear-gradient(180deg, rgba(7,11,19,0.95) 0%, rgba(10,14,22,0.88) 100%)",
        boxShadow: "0 20px 60px rgba(2,6,23,0.6), 0 0 40px rgba(244,63,94,0.04)",
    },
    accentGradient: "linear-gradient(90deg,#F43F5E,#6366F1)",
};

const ROWS_PER_PAGE_OPTIONS = [5, 9, 15, 25, 50];

// Components
const PageButton = ({ disabled, onClick, children }) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className="px-3 py-1 rounded-md text-sm border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
    >
        {children}
    </button>
);

const AgentAvatar = ({ agent }) => (
    <div className="w-9 h-9 rounded-md overflow-hidden bg-white/5 border border-white/10">
        <Image
            src={NexaAv}
            alt={agent.name}
            className="w-full h-full object-cover"
            width={36}
            height={36}
            unoptimized
        />
    </div>
);

const AgentInfo = ({ agent }) => (
    <div className="min-w-0">
        <div className="font-medium truncate">{agent.name}</div>
        <div className="text-xs text-gray-400">ID: {agent.id.slice(0, 8)}…</div>
    </div>
);

const ActionButtons = ({ agent, onEdit, onDelete }) => (
    <div className="flex items-center gap-2">
        <button
            onClick={() => onEdit(agent)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-white/10 hover:bg-white/10"
            title="Edit"
        >
            <Pencil className="w-4 h-4" />
            Edit
        </button>
        <button
            onClick={() => onDelete(agent?.id)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-white/10 hover:bg-white/10"
            title="Delete"
        >
            <Trash2 className="w-4 h-4" />
            Delete
        </button>
    </div>
);

const TableRow = ({ agent, onEdit, onDelete }) => (
    <tr key={agent.id} className="border-b border-white/5 hover:bg-white/[0.06]">
        <td className="px-4 py-3">
            <div className="flex items-center gap-3">
                <AgentAvatar agent={agent} />
                <AgentInfo agent={agent} />
            </div>
        </td>
        <td className="px-4 py-3">
            <div className="text-gray-300 truncate max-w-[540px]">{agent.instructions}</div>
        </td>
        <td className="px-4 py-3">
            <ActionButtons agent={agent} onEdit={onEdit} onDelete={onDelete} />
        </td>
    </tr>
);

const EmptyState = () => (
    <tr>
        <td colSpan={3} className="px-4 py-10 text-center text-gray-400">
            No agents to display.
        </td>
    </tr>
);

const PaginationControls = ({ 
    current, 
    pageCount, 
    rows, 
    sliceLength, 
    totalLength, 
    onPageChange, 
    onRowsChange 
}) => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3">
        <div className="text-xs text-gray-400">
            Showing <span className="text-gray-200">{sliceLength}</span> of{" "}
            <span className="text-gray-200">{totalLength}</span>
        </div>

        <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-gray-300">
                Rows
                <select
                    className="bg-transparent border border-white/10 rounded-md px-2 py-1 text-xs outline-none"
                    value={rows}
                    onChange={(e) => {
                        onRowsChange(Number(e.target.value));
                        onPageChange(0);
                    }}
                >
                    {ROWS_PER_PAGE_OPTIONS.map((n) => (
                        <option key={n} value={n} className="bg-[#0b0f17]">
                            {n}
                        </option>
                    ))}
                </select>
            </label>

            <div className="flex items-center gap-2">
                <PageButton 
                    disabled={current === 0} 
                    onClick={() => onPageChange(Math.max(0, current - 1))}
                >
                    Prev
                </PageButton>
                <div className="text-xs text-gray-300">
                    Page <span className="text-gray-100">{current + 1}</span> /{" "}
                    <span className="text-gray-100">{pageCount}</span>
                </div>
                <PageButton
                    disabled={current >= pageCount - 1}
                    onClick={() => onPageChange(Math.min(pageCount - 1, current + 1))}
                >
                    Next
                </PageButton>
            </div>
        </div>
    </div>
);

// Custom hooks
const usePagination = (agents, initialPageSize) => {
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(initialPageSize);

    const pageCount = Math.max(1, Math.ceil(agents.length / rows));
    const current = Math.min(page, pageCount - 1);

    const slice = useMemo(() => {
        const start = current * rows;
        const end = start + rows;
        return agents.slice(start, end);
    }, [agents, current, rows]);

    const handlePageChange = (newPage) => setPage(newPage);
    const handleRowsChange = (newRows) => setRows(newRows);

    return {
        current,
        pageCount,
        rows,
        slice,
        handlePageChange,
        handleRowsChange,
    };
};

export default function AgentTable({
    agents = [],
    pageSize = 9,
    onEdit,
    onDelete,
    open,
    setOpen,
}) {
    const [editAgent, setEditAgent] = useState(null);
    const { current, pageCount, rows, slice, handlePageChange, handleRowsChange } = usePagination(agents, pageSize);

    const handleEdit = (agent) => {
        setOpen(true);
        setEditAgent(agent);
    };

    return (
        <>
            <div
                className="rounded-xl overflow-hidden border border-white/5"
                style={TABLE_STYLES.container}
            >
                {/* Top accent */}
                <div className="h-1 w-full" style={{ background: TABLE_STYLES.accentGradient }} />

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-gray-300">
                            <tr className="border-b border-white/5">
                                <th className="px-4 py-3 font-medium">Agent</th>
                                <th className="px-4 py-3 font-medium">Instructions</th>
                                <th className="px-4 py-3 font-medium w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-100">
                            {slice.map((agent) => (
                                <TableRow 
                                    key={agent.id} 
                                    agent={agent} 
                                    onEdit={handleEdit} 
                                    onDelete={onDelete} 
                                />
                            ))}
                            {slice.length === 0 && <EmptyState />}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <PaginationControls
                    current={current}
                    pageCount={pageCount}
                    rows={rows}
                    sliceLength={slice.length}
                    totalLength={agents.length}
                    onPageChange={handlePageChange}
                    onRowsChange={handleRowsChange}
                />
            </div>
            
            <NewAgentDialog
                open={open}
                setOpen={setOpen}
                initialData={editAgent}
                onSave={onEdit}
            />
        </>
    );
}
