"use client"
import { useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PanelLeftOpen, PanelLeftClose, Search } from "lucide-react"
import { useEffect, useState } from "react"
import DashboardCommand from "./dashCommand"

const DashboardNavbar = () => {
    const { isMobile, state, toggleSidebar } = useSidebar()
    const [CommandOpen, setCommandOpen] = useState(false)

    const isCollapsed = state === "collapsed"

    useEffect(() => {
        console.log(CommandOpen)
    }, [])

    return (
        <>

            <DashboardCommand open={CommandOpen} setOpen={setCommandOpen} />
            <nav className="flex items-center gap-3 px-4 py-3 w-full bg-transparent">
                {/* Sidebar toggle */}
                <Button
                    variant="ghost"
                    onClick={toggleSidebar}
                    aria-label={isCollapsed || isMobile ? "Open sidebar" : "Close sidebar"}
                    className="relative flex items-center justify-center h-10 w-10 rounded-xl 
             bg-gradient-to-r from-[#F43F5E] to-[#6366F1]
             text-white shadow-lg shadow-[#6366F1]/40
             transition-all duration-300 ease-in-out 
             hover:scale-110 hover:rotate-6 hover:shadow-[#F43F5E]/60 cursor-pointer"
                >
                    {isCollapsed || isMobile ? (
                        <PanelLeftOpen
                            size={22}
                            className="transition-transform duration-300"
                        />
                    ) : (
                        <PanelLeftClose
                            size={22}
                            className="transition-transform duration-300"
                        />
                    )}
                </Button>


                {/* Search (collapses to icon on very small screens) */}
                <div className="flex-1 max-w-3xs">
                    <Button
                        variant="outline"
                        size="default"
                        aria-label="Search"
                        onClick={() => setCommandOpen(!CommandOpen)}
                        className="w-full justify-start gap-3 px-3 
               bg-gray-800/40 text-gray-200 
               hover:bg-gray-800/60 hover:text-white 
               active:scale-95 transition-all duration-150 
               cursor-pointer rounded-lg border-[#6366F1]"
                    >
                        <Search className="h-4 w-4 text-gray-300 group-hover:text-white" />
                        <span className="truncate text-sm text-gray-200 hidden sm:inline">
                            Search
                        </span>
                        <kbd
                            className="ml-auto hidden sm:inline-flex items-center rounded-md 
                 border border-gray-500 bg-gray-100 px-2 py-0.5 
                 text-xs font-mono font-semibold text-gray-800 shadow-inner"
                        >
                            ⌘K
                        </kbd>
                    </Button>
                </div>

            </nav>
        </>
    )
}

export default DashboardNavbar
