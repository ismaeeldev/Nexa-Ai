// modules/Agents/components/agentTable.jsx
"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import NexaAv from "../../../../public/nexaAv.webp";
import NewAgentDialog from "./agentDialog";
import EmptyState from "../../Error/emptyState";
import ViewAgentDialog from "./viewDialog";


// Constants for better maintainability
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

// Reusable PageButton component
const PageButton = ({ disabled, onClick, children }) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className={BUTTON_STYLES.pageButton}
    >
        {children}
    </button>
);

// Agent row component for better organization
const AgentRow = ({ agent, onEdit, onDelete, handleView }) => (
    <tr key={agent.id} className="border-b border-white/5 hover:bg-white/[0.06]">
        <td className="px-6 py-4 align-middle">
            <div className="flex items-center gap-3">
                <div onClick={() => handleView(agent)} className="cursor-pointer w-9 h-9 rounded-md overflow-hidden bg-white/5 border border-white/10 shrink-0">
                    <Image
                        src={NexaAv}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                        width={36}
                        height={36}
                        unoptimized
                    />
                </div>
                <div className="min-w-0">
                    <div className="font-medium truncate text-gray-100 ">{agent.name.split(" ").slice(0, 2).join(" ")}</div>
                    <div className="text-xs text-gray-400 mt-0.5">ID: {agent.id.slice(0, 8)}…</div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4 align-middle">
            <div className="text-gray-300 line-clamp-2 max-w-[540px] text-center" title={agent.instructions}>
                {agent.instructions}
            </div>
        </td>
        <td className="px-6 py-4 text-center align-middle">
            <div className="text-gray-300 font-medium">{agent.meetingCount}</div>
        </td>
        <td className="px-6 py-4 align-middle">
            <div className="flex items-center gap-2 justify-end">
                <button
                    onClick={() => onEdit(agent)}
                    className={BUTTON_STYLES.actionButton}
                    title="Edit"
                >
                    <Pencil className="w-4 h-4" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(agent?.id)}
                    className={BUTTON_STYLES.actionButton}
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </button>
                {/* <button
                    onClick={() => handleView(agent)}
                    className={BUTTON_STYLES.actionButton}
                    title="View Details"
                >
                    <Trash2 className="w-4 h-4" />
                    View
                </button> */}
            </div>
        </td>
    </tr>
);

// Pagination controls component
const PaginationControls = ({
    current,
    pageCount,
    rows,
    sliceLength,
    totalLength,
    onPageChange,
    onRowsChange
}) => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4">
        <div className="text-xs text-gray-400">
            Showing <span className="text-gray-200 font-medium">{sliceLength}</span> of{" "}
            <span className="text-gray-200 font-medium">{totalLength}</span> agents
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
                <PageButton
                    disabled={current === 0}
                    onClick={() => onPageChange(Math.max(0, current - 1))}
                >
                    Previous
                </PageButton>
                <div className="text-xs text-gray-300 mx-2">
                    Page <span className="text-gray-100 font-medium">{current + 1}</span> of{" "}
                    <span className="text-gray-100 font-medium">{pageCount}</span>
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

export default function AgentTable({
    agents = [],
    pageSize = 9,
    onEdit,
    onDelete,
    open,
    setOpen,
}) {
    const [page, setPage] = useState(0);
    const [rows, setRows] = useState(pageSize);
    const [initialEditAgent, setEditAgent] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [viewAgent, setViewAgent] = useState(null);


    const pageCount = Math.max(1, Math.ceil(agents.length / rows));
    const current = Math.min(page, pageCount - 1);

    const slice = useMemo(() => {
        const start = current * rows;
        const end = start + rows;
        return agents.slice(start, end);
    }, [agents, current, rows]);

    const handleEdit = (agent) => {
        setOpen(true);
        setEditAgent(agent);
    };

    const handleViewAgent = (agent) => {
        console.log("Viewing agent:", agent);
        setViewAgent(agent);
        setViewDialogOpen(true);
    }

    const handlePageChange = (newPage) => setPage(newPage);
    const handleRowsChange = (newRows) => setRows(newRows);


    return (
        <>
            {(
                agents.length === 0
            ) ? (
                <EmptyState title="agents" />
            ) :
                (<div
                    className="rounded-xl overflow-hidden border border-white/5"
                    style={TABLE_STYLES.container}
                >
                    {/* Top accent */}
                    <div
                        className="h-1 w-full"
                        style={{ background: TABLE_STYLES.accentGradient }}
                    />

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-gray-300 ">
                                <tr className="border-b border-white/5 ">
                                    <th className="px-26 py-4  font-medium">Agent</th>
                                    <th className="px-6 py-4 font-medium text-center">Instructions</th>
                                    <th className="px-6 py-4 font-medium text-center">Meetings</th>
                                    <th className="px-6 py-4 font-medium text-center w-48">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {slice.map((agent) => (
                                    <AgentRow
                                        key={agent.id}
                                        agent={agent}
                                        onEdit={handleEdit}
                                        onDelete={onDelete}
                                        handleView={handleViewAgent}
                                    />
                                ))}

                                {slice.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
                                            No agents found. Create your first agent to get started.
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
                        totalLength={agents.length}
                        onPageChange={handlePageChange}
                        onRowsChange={handleRowsChange}
                    />
                </div>)}

            <ViewAgentDialog
                open={viewDialogOpen}
                setOpen={setViewDialogOpen}
                agent={viewAgent}
                onEdit={handleEdit}
                onDelete={onDelete}
            />

            <NewAgentDialog
                open={open}
                setOpen={setOpen}
                initialData={initialEditAgent}
                onSave={onEdit}
            />
        </>
    );
}