"use client";
import { motion } from "framer-motion";

export default function StartupLoader() {
    return (
        <div
            className="fixed inset-0 flex flex-col items-center justify-center z-50"
            style={{
                background: "radial-gradient(circle at center, #0f0f1a, #000000)", // dark futuristic
            }}
        >
            {/* Orbiting dots */}
            <div className="relative w-32 h-32 flex items-center justify-center">
                <motion.div
                    className="absolute w-5 h-5 rounded-full bg-[#F43F5E]"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    style={{ transformOrigin: "60px 0px" }}
                />
                <motion.div
                    className="absolute w-5 h-5 rounded-full bg-[#6366F1]"
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    style={{ transformOrigin: "-60px 0px" }}
                />
                {/* Center core */}
                <motion.div
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F43F5E] to-[#6366F1] shadow-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />
            </div>

            {/* Text */}
            <motion.p
                className="mt-6 text-white text-lg tracking-wider"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                Initializing Nexa AI...
            </motion.p>
        </div>
    );
}
