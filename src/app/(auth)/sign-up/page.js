"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Facebook, Mail, User, Lock, Sparkles, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import Link from 'next/link';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// ✅ Validation schema
const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export default function Signup() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await authClient.signUp.email(
                {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    callbackURL: "/",
                },
                {
                    onRequest: () => setLoading(true),
                    onSuccess: () => {
                        toast.success("Account created successfully!");
                        setLoading(false);
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
                newUserCallbackURL: "/welcome",
            });
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            {/* Animated Gradient Blobs - Dark version */}
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

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full max-w-md z-10"
            >
                <Card className="shadow-2xl rounded-2xl bg-gray-800 border-gray-700 backdrop-blur-md">
                    <CardHeader className="flex flex-col items-center">
                        <Sparkles className="h-8 w-8 text-rose-400 mb-3" />
                        <CardTitle className="text-center text-3xl font-bold text-white">
                            Create your account
                        </CardTitle>
                        <p className="text-center text-gray-400 mt-2 text-sm max-w-sm">
                            Simpler workflow — get started now 🚀
                        </p>
                    </CardHeader>

                    <CardContent>
                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Name */}
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                <Input
                                    type="text"
                                    placeholder="Full Name"
                                    {...register("name")}
                                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-rose-400 focus:border-rose-400"
                                />
                                {errors.name && (
                                    <p className="text-rose-300 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    {...register("email")}
                                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-rose-400 focus:border-rose-400"
                                />
                                {errors.email && (
                                    <p className="text-rose-300 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    {...register("password")}
                                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-rose-400 focus:border-rose-400"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 z-20"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                                {errors.password && (
                                    <p className="text-rose-300 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    {...register("confirmPassword")}
                                    className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:ring-rose-400 focus:border-rose-400"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 z-20"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                                {errors.confirmPassword && (
                                    <p className="text-rose-300 text-sm mt-1">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full cursor-pointer bg-rose-500 hover:bg-rose-600 text-white transition-colors hover:scale-[1.02] transition-transform"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        </form>

                        {/* Already have account */}
                        <p className="text-center text-sm text-gray-400 mt-4">
                            Already have an account?{" "}
                            <Link
                                href="/sign-in"
                                className="text-rose-400 font-semibold hover:text-rose-300 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>

                        {/* Divider */}
                        <div className="flex items-center my-6">
                            <div className="flex-grow h-px bg-gray-700"></div>
                            <span className="px-3 text-sm text-gray-500">or continue with</span>
                            <div className="flex-grow h-px bg-gray-700"></div>
                        </div>

                        {/* Social Login */}
                        <div className="grid grid-cols-2 gap-3">
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
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}