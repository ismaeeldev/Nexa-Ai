import React from 'react'
import Link from 'next/link'
import { Crown } from "lucide-react";

const Progress = (props) => {
    return (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-300">Free Plan</span>
                <span className="text-xs text-amber-400 font-medium">{props.used}/{props.total} tries used</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                    className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full"
                    style={{ width: `${props.percentage}%` }}
                ></div>
            </div>
            <div className="mt-2 flex justify-between">
                <span className="text-xs text-gray-400">Free tier</span>
                <Link href="/upgrade" className="text-xs text-amber-400 hover:text-amber-300 flex items-center">
                    <Crown className="h-3 w-3 mr-1" />
                    Upgrade
                </Link>
            </div>
        </div>
    )
}

export default Progress
