import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const CallEnded = () => {


    return (
        <div className='flex flex-col items-center justify-center gap-4 h-full p-6'>
            <div className='flex flex-col items-center'>
                <h6 className='text-xl font-semibold'>Call ended</h6>
                <p className='text-sm text-muted-foreground'>Summary will appear in a few minutes.</p>
            </div>
            <div>
                <Button asChild>
                    <Link href="/meetings">Back to meetings</Link>
                </Button>
            </div>
        </div>
    )
}

export default CallEnded;
