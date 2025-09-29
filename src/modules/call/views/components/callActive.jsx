"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout, useCallStateHooks } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Button } from "@/components/ui/button";

const CallActive = ({ onLeave, meetingName }) => {
    // Example: get participants for avatars (customize as needed)
    const { useParticipants } = useCallStateHooks();
    const participants = useParticipants();

    return (
        <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center px-2 sm:px-4 z-0">
            {/* ✅ Enhanced Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-800" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgwKSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMTUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-40" />
                {/* ✅ Added subtle animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-indigo-500/5 animate-pulse" />
            </div>

            {/* ✅ Enhanced Main Card */}
            <div className="relative z-10 w-full max-w-7xl h-[94vh] flex flex-col rounded-2xl border border-white/20 bg-slate-900/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
                {/* ✅ Enhanced Top Bar */}
                <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/20 bg-black/50 backdrop-blur">
                    <div className="flex items-center gap-3">
                        <Link href="/meetings" className="flex items-center gap-2 hover:opacity-80 transition">
                            <Image src="/logo.png" alt="Nexa Logo" width={110} height={36} className="object-contain" />
                        </Link>
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-gray-300 font-medium tracking-wide">Active Call</span>
                        </div>
                    </div>
                    <h6 className="text-lg sm:text-xl font-bold truncate max-w-[50vw] text-center bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
                        {meetingName}
                    </h6>
                    <Button
                        variant="destructive"
                        onClick={onLeave}
                        className="rounded-xl shadow-lg hover:opacity-90 transition-all duration-200 hover:scale-105 px-6 py-2 text-sm font-semibold bg-gradient-to-r from-red-500 to-pink-500"
                        aria-label="Leave call"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l-8 8m0-8l8 8" />
                        </svg>
                        Leave
                    </Button>
                </div>

                {/* ✅ Enhanced Video/Participants Area */}
                <div className="flex-grow flex flex-col lg:flex-row bg-black/20">
                    {/* ✅ Enhanced Main Speaker/Screen */}
                    <div className="flex-1 flex items-center justify-center p-3 sm:p-6">
                        <div className="w-full h-full rounded-2xl border border-white/20 bg-slate-800/70 shadow-2xl flex items-center justify-center overflow-hidden backdrop-blur">
                            <SpeakerLayout />
                        </div>
                    </div>
                    {/* ✅ Enhanced Sidebar: Participants */}
                    <div className="hidden lg:flex flex-col w-80 bg-slate-900/90 border-l border-white/20 p-6 gap-6 backdrop-blur">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                            <h6 className="text-lg font-bold text-white">Participants ({participants.length})</h6>
                        </div>
                        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                            {participants.map((p, index) => (
                                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200">
                                    <div className="relative">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                            index === 0 ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-gradient-to-r from-indigo-500 to-blue-500'
                                        }`}>
                                            {p.name?.[0] || "?"}
                                        </div>
                                        {index === 0 && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-white font-medium truncate">{p.name || "Unknown"}</div>
                                        <div className="text-xs text-gray-400">
                                            {index === 0 ? "Host" : "Participant"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ✅ Enhanced Footer Controls */}
                <div className="px-4 sm:px-8 py-4 border-t border-white/20 bg-black/50 backdrop-blur flex items-center justify-center">
                    <div className="w-full max-w-3xl mx-auto">
                        <CallControls className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallActive;