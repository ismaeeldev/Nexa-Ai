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
        <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center ml-32 px-4 z-0">
            {/* Strong dark gradient background with SVG overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgwKSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMTUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-60" />
            </div>
            {/* Card */}
            <div className="relative z-10 w-full max-w-3xl mx-auto rounded-xl border border-white/10 bg-gray-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Gradient stripe inside card */}
                <div
                    className="h-1 w-full"
                    style={{
                        background: "linear-gradient(90deg,#F43F5E,#6366F1)",
                    }}
                />

                <div className="p-6">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h6 className="text-2xl font-semibold text-white">Ready to join</h6>
                        <p className="text-sm text-gray-400 mt-1">
                            Set up your call before joining
                        </p>
                    </div>

                    {/* Video Preview */}
                    <div className="rounded-lg flex justify-center border border-white/8 bg-black/20 overflow-hidden">
                        <VideoPreview
                            DisabledVideoPreview={
                                hasBrowserMediaPermission
                                    ? () => <DisabledVideoPreview name="" image={undefined} />
                                    : AllowBrowserPermission
                            }
                            className="w-full h-[320px] sm:h-[380px] md:h-[420px] rounded-lg"
                        />
                    </div>

                    {/* Controls + Actions */}
                    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Toggle Controls */}
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <ToggleAudioPreviewButton className="rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 px-4 py-2 transition" />
                            <ToggleVideoPreviewButton className="rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 px-4 py-2 transition" />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-center md:justify-end">
                            <Button
                                asChild
                                variant="secondary"
                                className="rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 transition"
                            >
                                <Link href="/meetings">Cancel</Link>
                            </Button>

                            <Button
                                disabled={!hasBrowserMediaPermission}
                                onClick={onJoin}
                                className="rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-md hover:opacity-90 transition"
                            >
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
