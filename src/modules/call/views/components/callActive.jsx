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
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgwKSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMTUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-60" />
            </div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-6xl h-[92vh] flex flex-col rounded-2xl border border-white/10 bg-gray-900/90 backdrop-blur-2xl shadow-2xl overflow-hidden ml-72">
                {/* Top Bar */}
                <div className="flex items-center justify-between px-4 sm:px-8 py-3 border-b border-white/10 bg-black/40 backdrop-blur">
                    <div className="flex items-center gap-2">
                        <Link href="/meetings" className="flex items-center gap-2">
                            <Image src="/logo.png" alt="Nexa Logo" width={110} height={36} className="object-contain" />
                        </Link>
                        <span className="hidden sm:inline-block text-xs text-gray-400 font-medium tracking-wide">Active Call</span>
                    </div>
                    <h6 className="text-base sm:text-lg font-semibold text-white truncate max-w-[60vw] text-center">
                        {meetingName}
                    </h6>
                    <Button
                        variant="destructive"
                        onClick={onLeave}
                        className="rounded-lg shadow-md hover:opacity-90 transition px-4 py-2 text-sm font-semibold"
                        aria-label="Leave call"
                    >
                        Leave
                    </Button>
                </div>

                {/* Video/Participants Area */}
                <div className="flex-grow flex flex-col md:flex-row bg-black/30">
                    {/* Main Speaker/Screen */}
                    <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
                        <div className="w-full h-full rounded-xl border border-white/10 bg-gray-800/60 shadow-inner flex items-center justify-center overflow-hidden">
                            <SpeakerLayout />
                        </div>
                    </div>
                    {/* Sidebar: Participants (optional, for SaaS feel) */}
                    <div className="hidden md:flex flex-col w-64 bg-gray-900/80 border-l border-white/10 p-4 gap-4">
                        <h6 className="text-sm font-semibold text-gray-200 mb-2">Participants</h6>
                        <div className="flex flex-col gap-3">
                            {participants.map((p) => (
                                <div key={p.id} className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                        {p.name?.[0] || "?"}
                                    </div>
                                    <span className="text-gray-100 text-sm">{p.name || "Unknown"}</span>
                                </div>
                            ))}`
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="px-4 sm:px-8 py-3 border-t border-white/10 bg-black/40 backdrop-blur flex items-center justify-center">
                    <CallControls className="w-full max-w-2xl mx-auto" />
                </div>
            </div>
        </div>
    );
};

export default CallActive;