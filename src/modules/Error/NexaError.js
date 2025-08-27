// 🌌 NexaError – production-level error feedback
const NexaError = ({ message = "Something went wrong" }) => {
    // normalize error message (string / object / api error)
    const errorMessage =
        typeof message === "string"
            ? message
            : message?.response?.data?.error || message?.message || "Unexpected error";

    return (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 shadow-sm animate-in fade-in-50 slide-in-from-top-2">
            {/* icon */}
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-600 font-bold">
                ⚠️
            </span>

            {/* error message */}
            <p className="flex-1 text-sm font-medium">{errorMessage}</p>

            {/* optional retry */}
            {/* {onRetry && (
                <button
                    onClick={onRetry}
                    className="ml-2 px-3 py-1 text-sm font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                    Retry
                </button>
            )} */}
        </div>
    );
};

export default NexaError;
