"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar, // <-- added
} from "@/components/ui/sidebar";
import Logo from "../../../app/logo";
import Link from "next/link";
import {
    BotIcon,
    StarIcon,
    VideoIcon,
    User,
    Settings,
    LogOut,
    Crown,
    FileText,
    LogIn, Sparkles
} from "lucide-react";
import Progress from "./Progress";
import { useAuth } from "@/context/AuthProvider";
import { cn } from "@/lib/utils"


const firstSection = [
    { icon: VideoIcon, label: "Meetings", href: "/meetings" },
    { icon: BotIcon, label: "Agents", href: "/agents" },
    { icon: FileText, label: "Summaries", href: "/summaries" },
];

const DashboardSidebar = () => {
    const freeTriesUsed = 3;
    const totalFreeTries = 5;
    const usagePercentage = (freeTriesUsed / totalFreeTries) * 100;
    const { handleLogout, user } = useAuth();

    // read sidebar state from UI provider
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";


    return (
        <div
            className={`relative z-10 m-4 h-[calc(100vh-2rem)]
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "opacity-0 pointer-events-none -translate-x-4 scale-[0.995]" : "opacity-100 pointer-events-auto translate-x-0 scale-100"}`}
        >
            <Sidebar className="w-64 h-full flex flex-col rounded-2xl shadow-2xl [&>div]:bg-gray-900/95 backdrop-blur-md ring-1 ring-white/10 border-none overflow-hidden  ">
                <SidebarHeader className="border-b border-gray-700 p-5">
                    <Link href="/" className="items-center ml-12">
                        <Logo />
                    </Link>
                </SidebarHeader>

                <SidebarContent className="p-4 flex-grow overflow-y-auto">
                    <Progress
                        percentage={usagePercentage}
                        used={freeTriesUsed}
                        total={totalFreeTries}
                        className="h-2 bg-gray-700"
                    />

                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {firstSection.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            className="text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 rounded-lg py-3 px-3 mb-1"
                                        >
                                            <Link href={item.href} className="flex items-center">
                                                <item.icon className="mr-3 h-5 w-5 text-blue-400" />
                                                <span className="font-medium">{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="p-4 border-t border-gray-700">
                    <div className="mb-4">
                        <SidebarMenu>
                            {user ? (
                                <>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            className="text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 rounded-lg py-3 px-3"
                                        >
                                            <Link href="/profile" className="flex items-center">
                                                <User className="mr-3 h-5 w-5 text-purple-400" />
                                                <span className="font-medium">Profile</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            className="text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 rounded-lg py-3 px-3"
                                        >
                                            <Link href="/settings" className="flex items-center">
                                                <Settings className="mr-3 h-5 w-5 text-green-400" />
                                                <span className="font-medium">Settings</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            className="text-gray-300 hover:bg-amber-900/30 hover:text-amber-300 transition-all duration-200 rounded-lg py-3 px-3 mb-1"
                                        >
                                            <Link href="/upgrade" className="flex items-center">
                                                <Crown className="mr-3 h-5 w-5 text-amber-400" />
                                                <span className="font-medium">Upgrade</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </>
                            ) : (
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        className="text-gray-300 hover:bg-amber-900/30 hover:text-amber-300 transition-all duration-200 rounded-lg py-3 px-3 mb-1"
                                    >
                                        <Link href="/sign-in" className="flex items-center">
                                            <LogIn className="mr-3 h-5 w-5 text-amber-400" />
                                            <span className="font-medium">Sign In</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            {/* <Sparkles className="h-3 w-3 text-yellow-400" /> */}
                            <span>© {new Date().getFullYear()} Nexa AI</span>
                        </div>


                        {user && (
                            <button
                                onClick={handleLogout}
                                className="group relative p-2 rounded-md text-gray-600 transition-all duration-200 
                 bg-gradient-to-r from-rose-400/70 to-pink-500/70 hover:from-rose-500 hover:to-pink-600
                 active:scale-90 shadow-md hover:shadow-lg"
                            >
                                <LogOut className="h-4 w-4 text-white transition-transform duration-300 group-hover:rotate-12 cursor-pointer" />
                            </button>
                        )}
                    </div>

                </SidebarFooter>
            </Sidebar>
        </div>
    );
};

export default DashboardSidebar;
