import { motion } from "framer-motion";
import Image from "next/image";
import NexaAv from '../../../../public/nexaAv.webp';
import MoreMenu from "@/components/ui/moreMenu";
import { Edit, Trash } from "lucide-react";

type Agent = {
    id: string;
    name: string;
    userId: string;
    instructions: string;
    createdAt: string; // ISO
    updatedAt: string; // ISO
};

// ----- small util: relative-ish time -----
function timeAgo(iso?: string) {
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
}

// ----- truncate helper (keeps UI predictable without relying on CSS line-clamp) -----
function truncate(text = "", length = 140) {
    if (text.length <= length) return text;
    return text.slice(0, length).trimEnd() + "…";
}


export default function AgentCard({ agent, dark }: { agent: Agent; dark: boolean }) {
    const initials = agent.name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("");

    // subtle gradients that match your app: pink <-> indigo accents
    const accentGradient = "linear-gradient(90deg,#F43F5E,#6366F1)";
    const cardBg = "linear-gradient(145deg,#0b1220,#071021)";

    return (
        <motion.article
            layout
            whileHover={{ y: -6 }}
            className="rounded-2xl p-5 shadow-md border overflow-hidden"
            style={{
                background: cardBg,
                borderColor: "rgba(255,255,255,0.03)"
            }}
        >
            <header className="flex items-start gap-4">
                <div
                    className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ background: accentGradient }}
                >
                    <Image
                        src={NexaAv}
                        alt="Agent avatar"
                        width={120}
                        height={120}
                        className="object-cover w-12 h-12 rounded-full"
                        unoptimized
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                        <h3
                            className={`text-sm font-semibold truncate  text-white`}
                        >
                            {agent.name}
                        </h3>

                        <button
                            aria-label="more"
                            className="p-1 rounded-md hover:bg-white/5"
                            title="More actions"
                        >
                            {/* <MoreHorizontal className='text-gray-300' /> */}
                            <MoreMenu
                                actions={[
                                    { name: "Edit", icon: <Edit size={16} />, onClick: () => alert("Edit clicked") },
                                    { name: "Delete", icon: <Trash size={16} />, onClick: () => alert("Delete clicked") },

                                ]} />
                        </button>
                    </div>

                    <div className="mt-1 text-xs text-gray-400 flex items-center gap-2">
                        <span className="leading-none">Created</span>
                        <span className="font-medium leading-none">{timeAgo(agent.createdAt)}</span>
                    </div>
                </div>
            </header>

            <div className="mt-4 text-sm text-gray-300" style={{ minHeight: 64 }}>
                {truncate(agent.instructions, 180)}
            </div>

            <footer className="mt-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-md text-[11px] font-medium" style={{ background: dark ? "rgba(255,255,255,0.02)" : "rgba(2,6,23,0.02)" }}>
                        {agent.id.slice(0, 6)}
                    </span>
                    <span className="text-gray-400">Updated {timeAgo(agent.updatedAt)}</span>
                </div>

                <div className="text-gray-400 text-right">
                    <button className="text-sm px-3 py-1 rounded-md hover:underline">Open</button>
                </div>
            </footer>
        </motion.article>
    );
}