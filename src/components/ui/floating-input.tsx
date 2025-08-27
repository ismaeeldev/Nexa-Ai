"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function FloatingInput({ label, className, ...props }: FloatingInputProps) {
    return (
        <div className="relative w-full">
            <input
                {...props}
                placeholder=" "
                className={cn(
                    "peer block w-full rounded-md border border-gray-300 px-3 pt-5 pb-2 text-sm text-gray-900 placeholder-transparent focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none",
                    className
                )}
            />
            <label
                className="absolute left-3 top-2 text-gray-500 text-sm transition-all 
        peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
        peer-focus:top-2 peer-focus:text-pink-500 peer-focus:text-sm"
            >
                {label}
            </label>
        </div>
    );
}
