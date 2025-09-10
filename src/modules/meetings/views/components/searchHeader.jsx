import { Search, LayoutGrid, Rows3 } from "lucide-react";

const BUTTON_STYLES = {
    viewToggle: "px-3 py-2 text-sm flex items-center gap-2",
    viewToggleActive: "bg-white/10 text-white",
    viewToggleInactive: "text-gray-300 hover:bg-white/5",
};

const VIEW_MODES = { CARD: "card", TABLE: "table" };

export default function SearchHeader({ query, setQuery, viewMode, setViewMode }) {
    return (
        <div className="mb-6 flex items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-semibold text-white">Meetings</h1>
                <p className="text-sm text-gray-400 mt-1">Schedule and transcripts — quick access</p>
            </div>

            <div className="flex items-center gap-3">
                <label className="relative block">
                    <span className="sr-only">Search meetings</span>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="text-gray-400" />
                    </span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 pr-3 py-2 rounded-lg w-64 text-sm bg-transparent border border-gray-700/40 placeholder-gray-500 text-white"
                        placeholder="Search by meeting or agent..."
                    />
                </label>

                <div className="flex items-center rounded-lg border border-white/10 overflow-hidden">
                    <button
                        onClick={() => setViewMode(VIEW_MODES.CARD)}
                        className={`${BUTTON_STYLES.viewToggle} ${viewMode === VIEW_MODES.CARD ? BUTTON_STYLES.viewToggleActive : BUTTON_STYLES.viewToggleInactive}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode(VIEW_MODES.TABLE)}
                        className={`${BUTTON_STYLES.viewToggle} border-l border-white/10 ${viewMode === VIEW_MODES.TABLE ? BUTTON_STYLES.viewToggleActive : BUTTON_STYLES.viewToggleInactive}`}
                    >
                        <Rows3 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
