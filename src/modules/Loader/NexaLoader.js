// 🌌 NexaLoader (reusable, size configurable)
const NexaLoader = ({ size = 10 }) => {
    const dotStyle = {
        width: size,
        height: size,
    };

    return (
        <div className="flex gap-3 items-center justify-center">
            <span
                style={dotStyle}
                className="rounded-full bg-[#F43F5E] animate-bounce [animation-delay:-.25s] shadow-lg shadow-[--primary]/50"
            />
            <span
                style={dotStyle}
                className="rounded-full bg-[#6366F1] animate-bounce [animation-delay:-.1s] shadow-lg shadow-[--secondary]/50"
            />
            <span
                style={dotStyle}
                className="rounded-full bg-[#F43F5E] animate-bounce shadow-lg shadow-[--primary]/50"
            />
        </div>
    );
};

export default NexaLoader;
