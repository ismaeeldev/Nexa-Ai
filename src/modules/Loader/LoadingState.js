"use client";
import { motion } from "framer-motion";

export default function StateLoader({
    title = "Loading...",
    description = "Please wait",
}) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] w-full px-4">
            <div
                className="rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center"
                style={{
                    background: "linear-gradient(145deg, #111827, #0f0f1a)",
                    border: "1px solid rgba(255,255,255,0.08)",
                }}
            >
                {/* Spinner */}
                <motion.div
                    className="w-10 h-10 border-4 border-transparent border-t-[#6366F1] border-r-[#F43F5E] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />

                {/* Title */}
                <h2 className="mt-6 text-white font-semibold text-lg text-center">
                    {title}
                </h2>

                {/* Description */}
                <p className="mt-2 text-gray-400 text-sm text-center">
                    {description}
                </p>
            </div>
        </div>
    );
}
