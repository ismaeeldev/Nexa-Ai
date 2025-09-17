import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Copy, Download, ExternalLink, Users, FileText, Play,
    CheckCircle, Clock, AlertCircle, RefreshCw, Sparkles,
    Calendar, User, MessageSquare, Activity
} from "lucide-react";
import { toast } from "sonner";

// Meeting status constants
export const MEETING_STATUS = {
    UPCOMING: "upcoming",
    ACTIVE: "active",
    COMPLETED: "completed",
    PROCESSING: "processing",
    CANCELLED: "cancelled",
};

// Modern design tokens
const DESIGN_TOKENS = {
    gradients: {
        primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        accent: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        success: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        glass: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
    },
    shadows: {
        card: "0 8px 32px rgba(0,0,0,0.12)",
        button: "0 4px 16px rgba(0,0,0,0.15)",
        glow: "0 0 20px rgba(102, 126, 234, 0.3)",
    }
};

// Utility functions
const formatDateTime = (iso) => {
    if (!iso) return "-";
    try {
        return new Date(iso).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return String(iso);
    }
};

const getStatusConfig = (status) => {
    const configs = {
        upcoming: {
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            icon: Clock,
            gradient: "from-blue-500 to-cyan-500"
        },
        active: {
            color: "text-green-600",
            bg: "bg-green-50 dark:bg-green-900/20",
            icon: CheckCircle,
            gradient: "from-green-500 to-emerald-500"
        },
        completed: {
            color: "text-purple-600",
            bg: "bg-purple-50 dark:bg-purple-900/20",
            icon: CheckCircle,
            gradient: "from-purple-500 to-pink-500"
        },
        processing: {
            color: "text-orange-600",
            bg: "bg-orange-50 dark:bg-orange-900/20",
            icon: RefreshCw,
            gradient: "from-orange-500 to-yellow-500"
        },
        cancelled: {
            color: "text-red-600",
            bg: "bg-red-50 dark:bg-red-900/20",
            icon: AlertCircle,
            gradient: "from-red-500 to-pink-500"
        }
    };
    return configs[status] || configs.completed;
};

// Modern Action Button Component
function ActionButton({
    children,
    onClick,
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    ...props
}) {
    const baseClasses = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
        secondary: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500",
        danger: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
        ghost: "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs rounded-lg",
        md: "px-4 py-2 text-sm rounded-lg",
        lg: "px-6 py-3 text-base rounded-xl"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

// Modern Status Banner Component
function StatusBanner({
    theme = "dark",
    status,
    title,
    description,
    children,
    className = ""
}) {
    const statusConfig = getStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl p-6 mb-6 ${className}`}
            style={{
                background: theme === "dark"
                    ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)"
                    : "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
                backdropFilter: "blur(10px)",
                border: theme === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)"
            }}
        >
            {/* Gradient accent line */}
            <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: DESIGN_TOKENS.gradients.primary }}
            />

            <div className="flex items-center gap-4">
                {/* Status Icon */}
                <div className={`relative flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center shadow-lg`}>
                    <StatusIcon className="w-8 h-8 text-white" />
                    {status === "active" && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} mb-1`}>
                        {title}
                    </h3>
                    <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                        {description}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {children}
                </div>
            </div>
        </motion.div>
    );
}

// Status-specific banner components
export function UpcomingBanner({ meeting, theme, onStart, onCancel }) {


    return (
        <StatusBanner
            theme={theme}
            status="upcoming"
            title={meeting?.name || "Upcoming Meeting"}
            description={`Scheduled for ${formatDateTime(meeting?.startedAt)} with ${meeting?.agentName || meeting?.agent?.name || "Unknown Agent"}`}
        >
            <ActionButton
                onClick={() => onCancel?.(meeting)}
                variant="danger"
                size="sm"
            >
                <X className="w-4 h-4" /> Cancel
            </ActionButton>
            <ActionButton
                onClick={() => onStart?.(meeting.id)}
                variant="primary"
                size="sm"
            >
                <Play className="w-4 h-4" /> Start Meeting
            </ActionButton>
        </StatusBanner>
    );
}

export function ActiveBanner({ meeting, theme, onJoin }) {
    return (
        <StatusBanner
            theme={theme}
            status="active"
            title={meeting?.name || "Live Meeting"}
            description={`In progress with ${meeting?.agentName || meeting?.agent?.name || "Unknown Agent"} • Join to participate`}
        >
            <ActionButton
                onClick={() => onJoin?.(meeting)}
                variant="primary"
                size="sm"
            >
                <Play className="w-4 h-4" /> Join Now
            </ActionButton>
        </StatusBanner>
    );
}

export function CompletedBanner({ meeting, theme, onDownload, onViewRecording }) {
    return (
        <StatusBanner
            theme={theme}
            status="completed"
            title={meeting?.name || "Meeting Completed"}
            description={`Finished ${formatDateTime(meeting?.endedAt)} • Duration: ${meeting?.duration || "—"} • Ready for review`}
        >
            <ActionButton
                onClick={() => onDownload?.(meeting)}
                variant="secondary"
                size="sm"
            >
                <Download className="w-4 h-4" /> Transcript
            </ActionButton>
            <ActionButton
                onClick={() => onViewRecording?.(meeting)}
                variant="primary"
                size="sm"
            >
                <ExternalLink className="w-4 h-4" /> Recording
            </ActionButton>
        </StatusBanner>
    );
}

export function ProcessingBanner({ meeting, theme }) {
    return (
        <StatusBanner
            theme={theme}
            status="processing"
            title={meeting?.name || "Processing Meeting"}
            description="Generating transcript and AI insights. This usually takes 1-2 minutes."
        >
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Processing...
            </div>
        </StatusBanner>
    );
}

export function CancelledBanner({ meeting, theme }) {
    return (
        <StatusBanner
            theme={theme}
            status="cancelled"
            title={meeting?.name || "Meeting Cancelled"}
            description={meeting?.cancelReason || "This meeting was cancelled and is no longer available."}
        >
            <div className="text-sm text-gray-500 font-medium">
                Cancelled
            </div>
        </StatusBanner>
    );
}


export default function MeetingDrawer({
    open,
    meeting,
    onClose,
    onEdit,
    onDelete,
    onStart,
    onCancelMeeting,
    onJoin,
    onDownloadTranscript,
    onViewRecording,
    theme = "dark",
}) {
    const closeRef = useRef(null);

    useEffect(() => {
        if (open) {
            setTimeout(() => closeRef.current?.focus?.(), 80);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open || !meeting) return null;

    const agentName = meeting?.agent?.name || meeting.agentName || meeting.agentId || "Unknown";

    const copyToClipboard = async (text, label = "Copied") => {
        try {
            await navigator.clipboard.writeText(text || "");
            toast.success(`${label}`);
        } catch (err) {
            console.error("copy failed", err);
            toast.error("Failed to copy");
        }
    };

    const handleDownloadText = (filename, content) => {
        try {
            const blob = new Blob([content || ""], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success("Download started");
        } catch (err) {
            console.error(err);
            toast.error("Download failed");
        }
    };

    const handleDownloadTranscript = async () => {
        if (onDownloadTranscript) return onDownloadTranscript(meeting);

        const url = meeting.transcriptUrl;
        if (!url) {
            toast.error("No transcript available");
            return;
        }
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Fetch failed");
            const text = await res.text();
            handleDownloadText(`${meeting.name || "meeting"}-transcript.txt`, text);
        } catch (err) {
            console.warn("fetch transcript failed, falling back to open", err);
            window.open(url, "_blank");
        }
    };

    const openRecording = () => {
        if (onViewRecording) return onViewRecording(meeting);
        if (meeting.recordingUrl) window.open(meeting.recordingUrl, "_blank");
        else toast.error("No recording available");
    };

    const openTranscript = () => {
        if (meeting.transcriptUrl) window.open(meeting.transcriptUrl, "_blank");
        else toast.error("No transcript available");
    };

    const renderBanner = () => {
        switch (meeting.status) {
            case MEETING_STATUS.UPCOMING:
                return <UpcomingBanner meeting={meeting} theme={theme} onStart={onStart} onCancel={onCancelMeeting} />;
            case MEETING_STATUS.ACTIVE:
                return <ActiveBanner meeting={meeting} theme={theme} onJoin={onJoin} />;
            case MEETING_STATUS.COMPLETED:
                return <CompletedBanner meeting={meeting} theme={theme} onDownload={handleDownloadTranscript} onViewRecording={openRecording} />;
            case MEETING_STATUS.PROCESSING:
                return <ProcessingBanner meeting={meeting} theme={theme} />;
            case MEETING_STATUS.CANCELLED:
                return <CancelledBanner meeting={meeting} theme={theme} />;
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                key="meeting-drawer-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex"
                aria-hidden={false}
            >
                {/* Backdrop with blur effect */}
                <motion.div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                    aria-hidden="true"
                    initial={{ backdropFilter: "blur(0px)" }}
                    animate={{ backdropFilter: "blur(4px)" }}
                    exit={{ backdropFilter: "blur(0px)" }}
                />

                <motion.aside
                    key="meeting-drawer"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="meeting-drawer-title"
                    className={`relative ml-auto w-full max-w-2xl h-full overflow-hidden ${theme === "dark"
                        ? "bg-gray-900/95 backdrop-blur-xl border-l border-white/10"
                        : "bg-white/95 backdrop-blur-xl border-l border-gray-200"
                        }`}
                    style={{
                        boxShadow: theme === "dark"
                            ? "-10px 0 40px rgba(0,0,0,0.3)"
                            : "-10px 0 40px rgba(0,0,0,0.1)"
                    }}
                >
                    {/* Header with close button */}
                    <div className="relative">
                        {/* Gradient top bar */}
                        <div
                            className="h-1 w-full"
                            style={{ background: DESIGN_TOKENS.gradients.primary }}
                        />

                        {/* Close button */}
                        <button
                            ref={closeRef}
                            onClick={onClose}
                            className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${theme === "dark"
                                ? "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80"
                                : "bg-white/80 text-gray-600 hover:bg-gray-50/80"
                                }`}
                            aria-label="Close drawer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="h-full overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {/* Status Banner */}
                            {renderBanner()}

                            {/* Meeting Details Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className={`rounded-3xl p-6 ${theme === "dark"
                                    ? "bg-gradient-to-br from-white/5 via-white/3 to-white/5 border border-white/10"
                                    : "bg-white border border-gray-200"
                                    }`}
                                style={{ boxShadow: DESIGN_TOKENS.shadows.card }}
                            >
                                {/* Agent Avatar & Basic Info */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="relative">
                                        <div className={`w-16 h-16 rounded-2xl overflow-hidden ${theme === "dark" ? "bg-white/10" : "bg-gray-100"
                                            }`}>
                                            {meeting.agent?.avatar ? (
                                                <img
                                                    src={meeting.agent.avatar}
                                                    alt={meeting.agent?.name || "agent"}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className={`w-full h-full flex items-center justify-center text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"
                                                    }`}>
                                                    {(meeting.agent?.name || "A").slice(0, 1)}
                                                </div>
                                            )}
                                        </div>
                                        {meeting.status === "active" && (
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className={`text-2xl font-bold truncate ${theme === "dark" ? "text-white" : "text-gray-900"
                                                }`}>
                                                {meeting.name || "Untitled Meeting"}
                                            </h2>
                                            <StatusBadge status={meeting.status} theme={theme} />
                                        </div>

                                        <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                            }`}>
                                            <div className="flex items-center gap-1 mb-1">
                                                <User className="w-4 h-4" />
                                                {meeting.agentName || meeting.agent?.name || "Unknown Agent"}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDateTime(meeting.startedAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <StatCard
                                        icon={<Clock className="w-5 h-5" />}
                                        label="Duration"
                                        value={meeting.duration || "—"}
                                        theme={theme}
                                    />
                                    <StatCard
                                        icon={<Users className="w-5 h-5" />}
                                        label="Participants"
                                        value={Array.isArray(meeting.attendees) ? meeting.attendees.length : meeting.participantCount || "—"}
                                        theme={theme}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    {meeting.status === "upcoming" && (
                                        <>
                                            <ActionButton
                                                onClick={() => onStart?.(meeting)}
                                                variant="primary"
                                                size="md"
                                            >
                                                <Play className="w-4 h-4" /> Start Meeting
                                            </ActionButton>
                                            <ActionButton
                                                onClick={() => onCancelMeeting?.(meeting)}
                                                variant="danger"
                                                size="md"
                                            >
                                                <X className="w-4 h-4" /> Cancel
                                            </ActionButton>
                                        </>
                                    )}

                                    {meeting.status === "active" && (
                                        <ActionButton
                                            onClick={() => onJoin?.(meeting)}
                                            variant="primary"
                                            size="md"
                                        >
                                            <Play className="w-4 h-4" /> Join Meeting
                                        </ActionButton>
                                    )}

                                    {meeting.status === "completed" && (
                                        <>
                                            <ActionButton
                                                onClick={() => handleDownloadTranscript()}
                                                variant="secondary"
                                                size="md"
                                            >
                                                <Download className="w-4 h-4" /> Download Transcript
                                            </ActionButton>
                                            <ActionButton
                                                onClick={() => openRecording()}
                                                variant="primary"
                                                size="md"
                                            >
                                                <ExternalLink className="w-4 h-4" /> View Recording
                                            </ActionButton>
                                        </>
                                    )}

                                    <ActionButton
                                        onClick={() => copyToClipboard(meeting.id, "Meeting ID copied")}
                                        variant="ghost"
                                        size="md"
                                    >
                                        <Copy className="w-4 h-4" /> Copy ID
                                    </ActionButton>
                                </div>
                            </motion.div>

                            {/* AI Insights Card */}
                            {meeting.status === "completed" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <InsightsCard
                                        theme={theme}
                                        summary={meeting.summary}
                                        transcriptUrl={meeting.transcriptUrl}
                                        onCopy={() => copyToClipboard(meeting.summary || "", "Summary copied")}
                                        onOpenTranscript={() => openTranscript()}
                                    />
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.aside>
            </motion.div>
        </AnimatePresence>
    );
};

// Modern Status Badge Component
function StatusBadge({ status, theme }) {
    const statusConfig = getStatusConfig(status);

    return (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${theme === "dark" ? statusConfig.bg : statusConfig.bg
            }`}>
            <div className={`w-2 h-2 rounded-full ${status === "active" ? "bg-green-500 animate-pulse" :
                status === "upcoming" ? "bg-blue-500" :
                    status === "completed" ? "bg-purple-500" :
                        status === "processing" ? "bg-orange-500" :
                            "bg-red-500"
                }`} />
            <span className={statusConfig.color}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        </div>
    );
}

// Modern Stat Card Component
function StatCard({ icon, label, value, theme }) {
    return (
        <div className={`rounded-2xl p-4 ${theme === "dark"
            ? "bg-white/5 border border-white/10"
            : "bg-gray-50 border border-gray-200"
            }`}>
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === "dark" ? "bg-white/10" : "bg-white"
                    }`}>
                    <div className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                        {icon}
                    </div>
                </div>
                <div>
                    <div className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}>
                        {label}
                    </div>
                    <div className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>
                        {value}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Modern AI Insights Card
function InsightsCard({ theme, summary, transcriptUrl, onCopy, onOpenTranscript }) {
    const bullets = getHighlightsFromSummary(summary, 4);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-3xl p-6 ${theme === "dark"
                ? "bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/10 border border-white/10"
                : "bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 border border-gray-200"
                }`}
            style={{ boxShadow: DESIGN_TOKENS.shadows.card }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme === "dark"
                        ? "bg-gradient-to-br from-purple-500 to-pink-500"
                        : "bg-gradient-to-br from-purple-600 to-pink-600"
                        }`}>
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"
                            }`}>
                            AI Insights
                        </h3>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                            }`}>
                            Key takeaways from your meeting
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <ActionButton
                        onClick={onCopy}
                        variant="ghost"
                        size="sm"
                        aria-label="Copy insights"
                    >
                        <Copy className="w-4 h-4" />
                    </ActionButton>
                    {transcriptUrl && (
                        <ActionButton
                            onClick={onOpenTranscript}
                            variant="ghost"
                            size="sm"
                            aria-label="Open transcript"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </ActionButton>
                    )}
                </div>
            </div>

            {/* Insights List */}
            <div className="space-y-4">
                {bullets.length > 0 ? (
                    bullets.map((bullet, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + (index * 0.1) }}
                            className={`flex items-start gap-3 p-4 rounded-2xl ${theme === "dark"
                                ? "bg-white/5 border border-white/10"
                                : "bg-white/80 border border-gray-200"
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${theme === "dark"
                                ? "bg-gradient-to-br from-blue-500 to-purple-500"
                                : "bg-gradient-to-br from-blue-600 to-purple-600"
                                }`}>
                                <span className="text-xs font-bold text-white">{index + 1}</span>
                            </div>
                            <p className={`text-sm leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                                }`}>
                                {bullet}
                            </p>
                        </motion.div>
                    ))
                ) : (
                    <div className={`text-center py-8 ${theme === "dark" ? "text-gray-500" : "text-gray-600"
                        }`}>
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">
                            {summary ? "Processing insights..." : "No insights available yet"}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            {summary && (
                <div className={`mt-6 pt-4 border-t ${theme === "dark" ? "border-white/10" : "border-gray-200"
                    }`}>
                    <div className={`flex items-center gap-2 text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-600"
                        }`}>
                        <Activity className="w-4 h-4" />
                        Generated from meeting transcript using AI analysis
                    </div>
                </div>
            )}
        </motion.div>
    );
}

/* small helper: split summary into short bullets */
function getHighlightsFromSummary(text = "", max = 3) {
    if (!text) return [];
    const parts = text.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
    if (parts.length <= max) return parts;
    return parts.slice(0, max).map((s) => (s.length > 120 ? s.slice(0, 117) + "…" : s));
}
