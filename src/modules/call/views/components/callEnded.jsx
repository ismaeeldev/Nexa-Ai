import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


const CallEnded = () => {
    return (
        <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center px-4 z-0">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgwKSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMTUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')] opacity-60" />
            </div>
            {/* Card */}
            <div className="relative z-10 w-full max-w-md mx-auto rounded-2xl border border-white/10 bg-gray-900/85 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col items-center justify-center gap-6 p-8">
                <div className="flex flex-col items-center gap-2">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="mb-2 text-pink-500"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.5 15.5 12 12m0 0 3.5-3.5M12 12l3.5 3.5M12 12l-3.5-3.5"/><circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5"/></svg>
                    <h6 className="text-2xl font-bold text-white">Call Ended</h6>
                    <p className="text-sm text-gray-400 text-center max-w-xs">Your call has ended. A summary will appear here in a few minutes.</p>
                </div>
                <Button asChild className="rounded-lg bg-gradient-to-r from-pink-500 to-indigo-500 text-white shadow-md hover:opacity-90 transition px-6 py-2 text-base font-semibold">
                    <Link href="/meetings">Back to Meetings</Link>
                </Button>
            </div>
        </div>
    );
}

export default CallEnded;
