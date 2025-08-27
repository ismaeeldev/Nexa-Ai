"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import FullScreenLoader from "@/modules/Loader/FullScreenLoader";
import StartupLoader from "@/modules/Loader/StartUpLoader";
import { TrendingUpIcon } from "lucide-react";
import { nexaConfirm } from "@/components/ui/nexaConfirm";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); // session check
    const [logoutLoading, setLogoutLoading] = useState(false); // logout only
    const router = useRouter();

    // Initial session check
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data: session } = await authClient.getSession();
                setUser(session?.user || null);
            } catch (err) {
                console.error("Auth session error:", err);
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        fetchSession();
    }, []);

    // Logout handler
    const handleLogout = async () => {
        const ok = await nexaConfirm({
            title: "Sign out of Nexa AI?",
            description: "You’ll need to sign in again to access your agents and meetings.",
            confirmText: "Log out",
            cancelText: "Stay",
        });

        if (!ok) return;

        setLogoutLoading(true);
        try {
            await authClient.signOut();
            setUser(null);
            router.push("/sign-in");
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setLogoutLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, authLoading, handleLogout }}>
            {/* Initial auth loading */}
            {authLoading ? (
                <StartupLoader />
            ) : (
                <>
                    {children}
                    {/* Logout loader */}
                    {logoutLoading && <FullScreenLoader />}
                </>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


