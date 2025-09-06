import React from 'react'
import emptyStateImage from '../../../public/emptyState.svg'
import Image from 'next/image'

const emptyState = (props) => {
    return (
        <div>
            <Image src={emptyStateImage} alt="No data" className='mx-auto mt-20 mb-4' width={250} height={250} unoptimized unselectable='' />
            <h2 className='text-center text-gray-400'>No {props.title} available</h2>
            <p className='text-center text-gray-500 mt-2'>Please add some {props.title} to see it here.</p>
        </div>
    )
}

export default emptyState
