import React from 'react'
import Link from 'next/link'
import { DefaultVideoPlaceholder, ToggleAudioPreviewButton, ToggleVideoPreviewButton, useCallStateHooks, VideoPreview } from "@stream-io/video-react-sdk"
import "@stream-io/video-react-sdk/dist/css/styles.css"

import { authClient } from '@/lib/auth-client'
import { generateAvatar } from '@/lib/avatar'
import { Button } from '@/components/ui/button'

const DisabledVideoPreview = ({ name, image }) => (
    <DefaultVideoPlaceholder
        participant={{ name: name || "Unknown", image }}
    />
)

const AllowBrowserPermission = () => {

    return (
        <div className='flex flex-col items-center justify-center h-full'>
            <h6 className='text-lg font-semibold'> Allow Camera and Microphone </h6>
            <p className='text-sm text-gray-500'> Please allow access to your camera and microphone to join the call. </p>
        </div>
    )
}


const CallLobby = ({ onJoin }) => {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();
    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCameraPermission } = useCameraState();

    const hasBrowserMediaPermission = hasMicPermission && hasCameraPermission;

    return (
        <div className='flex flex-col gap-4 p-6 max-w-5xl mx-auto w-full'>
            <div className='flex flex-col'>
                <h6 className='text-xl font-semibold'>Ready to join</h6>
                <p className='text-sm text-muted-foreground'>Set up your call before joining</p>
            </div>
            <VideoPreview
                DisabledVideoPreview={
                    hasBrowserMediaPermission
                        ? () => (
                            <DisabledVideoPreview
                                name={""}
                                image={undefined}
                            />
                        )
                        : AllowBrowserPermission
                }
                className="rounded-xl border bg-background/60 backdrop-blur"
            />
            <div className='flex gap-2'>
                <ToggleAudioPreviewButton />
                <ToggleVideoPreviewButton />
            </div>
            <div className='mt-2 flex gap-2'>
                <Button asChild variant="secondary">
                    <Link href="/meetings">Cancel</Link>
                </Button>
                <Button disabled={!hasBrowserMediaPermission} onClick={onJoin}>Join call</Button>
            </div>
        </div>
    )
}

export default CallLobby
