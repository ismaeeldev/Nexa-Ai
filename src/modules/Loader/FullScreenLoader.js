// 🌌 NexaAI styled full screen loader (reusable)
const FullScreenLoader = () => (
    <div className="fixed inset-0 z-[1000]">
        {/* background layer (frosted, semi-transparent) */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        {/* content layer */}
        <div className="relative flex h-full items-center justify-center">
            <div className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#F43F5E] animate-bounce [animation-delay:-.25s] shadow-lg shadow-[--primary]/50" />
                <span className="w-5 h-5 rounded-full bg-[#6366F1] animate-bounce [animation-delay:-.1s] shadow-lg shadow-[--secondary]/50" />
                <span className="w-5 h-5 rounded-full bg-[#F43F5E] animate-bounce shadow-lg shadow-[--primary]/50" />
            </div>
        </div>
    </div>
);

export default FullScreenLoader;
