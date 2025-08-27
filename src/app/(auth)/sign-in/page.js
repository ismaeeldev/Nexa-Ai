"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Facebook, LogIn, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import Link from 'next/link';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Validation schema
const schema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // hook-form setup
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await authClient.signIn.email(
                { email: data.email, password: data.password, callbackURL: "/" },
                {
                    onSuccess: () => {
                        setLoading(false);
                        toast.success("Logged in successfully!");
                        window.location.href = "/";
                    },
                    onError: (ctx) => {
                        setLoading(false);
                        toast.error(ctx.error.message);
                    },
                }
            );
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSocialSignIn = async (provider) => {
        setLoading(true);
        try {
            await authClient.signIn.social({
                provider,
                callbackURL: "/",
                errorCallbackURL: "/error",
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            {/* Animated Gradient Blobs - Darker version */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1.5 }}
                className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-purple-900 blur-3xl"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-blue-900 blur-3xl"
            />

            {/* Stars effect for dark background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgwKSI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-20"></div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10" // Added z-10 here
            >
                <Card className="shadow-2xl rounded-2xl bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-col items-center">
                        {/* Title */}
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-white">
                            <LogIn className="h-6 w-6 mt-1 text-rose-400" />
                            <span>Log in to your account</span>
                        </CardTitle>

                        {/* Tagline */}
                        <p className="text-center text-gray-400 mt-2 text-sm max-w-xs">
                            Continue where you left off 🚀
                        </p>
                    </CardHeader>

                    <CardContent className="relative z-10"> {/* Added z-10 here */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-rose-400 focus:border-rose-400 relative z-20" // Added z-20 here
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-rose-300 text-sm mt-1 relative z-20">{errors.email.message}</p> // Added z-20 here
                                )}
                            </div>

                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-rose-400 focus:border-rose-400 pr-10 relative z-20" // Added z-20 here
                                    {...register("password")}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 z-30" // Added z-30 here
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 cursor-pointer" />
                                    ) : (
                                        <Eye className="h-4 w-4 cursor-pointer" />
                                    )}
                                </button>
                                {errors.password && (
                                    <p className="text-rose-300 text-sm mt-1 relative z-20">{errors.password.message}</p> // Added z-20 here
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full cursor-pointer bg-rose-500 hover:bg-rose-600 text-white transition-colors relative z-20" // Added z-20 here
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        {/* Sign up link */}
                        <p className="text-center text-sm text-gray-400 mt-4 relative z-20"> {/* Added z-20 here */}
                            Don't have an account?{" "}
                            <Link
                                href="/sign-up"
                                className="text-rose-400 font-semibold hover:text-rose-300 transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>

                        {/* Divider */}
                        <div className="flex items-center my-6 relative z-20"> {/* Added z-20 here */}
                            <div className="flex-grow h-px bg-gray-700"></div>
                            <span className="px-3 text-sm text-gray-500">or continue with</span>
                            <div className="flex-grow h-px bg-gray-700"></div>
                        </div>

                        {/* Social Logins */}
                        <div className="grid grid-cols-2 gap-3 relative z-20"> {/* Added z-20 here */}
                            <Button
                                variant="outline"
                                className="flex items-center justify-center gap-2 border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white transition-all cursor-pointer"
                                onClick={() => handleSocialSignIn("google")}
                                disabled={loading}
                            >
                                <FcGoogle className="h-5 w-5" />
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                className="flex items-center justify-center gap-2 border-gray-600 bg-gray-700 text-blue-400 hover:bg-gray-600 hover:text-blue-300 transition-all cursor-pointer"
                                onClick={() => handleSocialSignIn("facebook")}
                                disabled={loading}
                            >
                                <Facebook className="h-5 w-5" />
                                Facebook
                            </Button>
                        </div>

                        {/* Forgot password link */}
                        <div className="mt-4 text-center relative z-20"> {/* Added z-20 here */}
                            <a
                                href="/forgot-password"
                                className="text-sm text-rose-400 hover:text-rose-300 transition-colors"
                            >
                                Forgot your password?
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}