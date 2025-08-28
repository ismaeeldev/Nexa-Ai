"use client";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react"; // nice free icon

export default function StateError({
    title = "Something went wrong",
    description = "Please try again later.",
}) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] w-full px-4">
            <div
                className="rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center"
                style={{
                    background: "linear-gradient(145deg, #1a0f0f, #0f0f0f)", // dark red theme
                    border: "1px solid rgba(255,0,0,0.15)",
                }}
            >
                {/* Error Icon */}
                <motion.div
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-red-900/30 border border-red-500"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </motion.div>

                {/* Title */}
                <h2 className="mt-6 text-red-400 font-semibold text-lg text-center">
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
