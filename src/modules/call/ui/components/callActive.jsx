import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { CallControls, SpeakerLayout } from '@stream-io/video-react-sdk'
import { Button } from '@/components/ui/button'

const CallActive = ({ onLeave, meetingName }) => {
    return (
        <div className='flex flex-col h-full justify-between bg-background text-foreground'>
            <div className='p-4 border-b flex items-center justify-between'>
                <Link href="/meetings">
                    <Image src="/logo.png" alt="Nexa Logo" width={120} height={40} />
                </Link>
                <h6 className='text-lg font-semibold'>{meetingName}</h6>
                <Button variant="destructive" onClick={onLeave}>Leave</Button>
            </div>
            <div className='flex-grow'>
                <SpeakerLayout />
            </div>
            <div className='p-4 border-t'>
                <CallControls />
            </div>
        </div>
    )
}

export default CallActive
