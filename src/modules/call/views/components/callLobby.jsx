"use client";
import React from "react";
import Link from "next/link";
import {
    DefaultVideoPlaceholder,
    ToggleAudioPreviewButton,
    ToggleVideoPreviewButton,
    useCallStateHooks,
    VideoPreview,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { Button } from "@/components/ui/button";

// ---- Helpers ---- //
const DisabledVideoPreview = ({ name, image }) => (
    <DefaultVideoPlaceholder participant={{ name: name || "Unknown", image }} />
);

const AllowBrowserPermission = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <h6 className="text-lg font-semibold text-white">
            Allow Camera and Microphone
        </h6>
        <p className="text-sm text-gray-400 mt-2 max-w-md">
            Please allow access to your camera and microphone to join the call.
        </p>
    </div>
);

// ---- Main Component ---- //
const CallLobby = ({ onJoin }) => {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();
    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCameraPermission } = useCameraState();

    const hasBrowserMediaPermission = hasMicPermission && hasCameraPermission;

    return (
        <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center px-4 z-0">
            {/* ✅ Improved dark gradient background with better contrast */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-900 to-slate-800" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgwKSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMTUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-40" />
                {/* ✅ Added subtle animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 animate-pulse" />
            </div>
            {/* ✅ Enhanced Card with better styling */}
            <div className="relative z-10 w-full max-w-4xl mx-auto rounded-2xl border border-white/20 bg-slate-900/90 backdrop-blur-2xl shadow-2xl overflow-hidden">
                {/* ✅ Improved gradient stripe */}
                <div
                    className="h-1.5 w-full"
                    style={{
                        background: "linear-gradient(90deg,#F43F5E,#8B5CF6,#6366F1)",
                    }}
                />

                <div className="p-6 sm:p-8">
                    {/* ✅ Enhanced Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h6 className="text-3xl font-bold text-white mb-2">Ready to join</h6>
                        <p className="text-base text-gray-300 max-w-md mx-auto">
                            Set up your camera and microphone before joining the meeting
                        </p>
                    </div>

                    {/* ✅ Enhanced Video Preview */}
                    <div className="rounded-xl flex justify-center border border-white/20 bg-black/30 overflow-hidden shadow-xl">
                        <VideoPreview
                            DisabledVideoPreview={
                                hasBrowserMediaPermission
                                    ? () => <DisabledVideoPreview name="" image={undefined} />
                                    : AllowBrowserPermission
                            }
                            className="w-full h-[360px] sm:h-[420px] md:h-[480px] rounded-xl"
                        />
                    </div>

                    {/* ✅ Enhanced Controls + Actions */}
                    <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        {/* ✅ Improved Toggle Controls */}
                        <div className="flex items-center gap-4 justify-center lg:justify-start">
                            <div className="flex flex-col items-center gap-2">
                                <ToggleAudioPreviewButton className="rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 px-6 py-3 transition-all duration-200 hover:scale-105 shadow-lg" />
                                <span className="text-xs text-gray-400 font-medium">Microphone</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <ToggleVideoPreviewButton className="rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 px-6 py-3 transition-all duration-200 hover:scale-105 shadow-lg" />
                                <span className="text-xs text-gray-400 font-medium">Camera</span>
                            </div>
                        </div>

                        {/* ✅ Enhanced Actions */}
                        <div className="flex gap-4 justify-center lg:justify-end">
                            <Button
                                asChild
                                variant="secondary"
                                className="rounded-xl border border-white/20 bg-white/10 text-gray-300 hover:bg-white/20 transition-all duration-200 hover:scale-105 px-6 py-3 shadow-lg"
                            >
                                <Link href="/meetings">Cancel</Link>
                            </Button>

                            <Button
                                disabled={!hasBrowserMediaPermission}
                                onClick={onJoin}
                                className="rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg hover:opacity-90 transition-all duration-200 hover:scale-105 px-8 py-3 font-semibold"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-9v3" />
                                </svg>
                                Join Call
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallLobby;
