import React from 'react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

const CallEnded = () => {


    return (
        <>
            <div className='flex flex-col '>
                <h6> Call Ended </h6>
                <p>Summary will appear in a few minutes</p>
            </div>

            <div className='mt-4'>
                <Button>
                    <Link href="/meetings">Back to meetings</Link>
                </Button>


            </div>
        </>
    )
}

export default CallEnded;
