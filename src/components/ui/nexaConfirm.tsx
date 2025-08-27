"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { X, LogOut } from "lucide-react";

type ConfirmOpts = {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
};

export function nexaConfirm({
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
}: ConfirmOpts = {}): Promise<boolean> {
    if (typeof window === "undefined") return Promise.resolve(false);

    return new Promise((resolve) => {
        const mount = document.createElement("div");
        document.body.appendChild(mount);
        const root = createRoot(mount);

        const close = (result: boolean) => {
            root.unmount();
            mount.remove();
            resolve(result);
        };

        function Dialog() {
            // close on ESC
            React.useEffect(() => {
                const onKey = (e: KeyboardEvent) => {
                    if (e.key === "Escape") close(false);
                };
                window.addEventListener("keydown", onKey);
                return () => window.removeEventListener("keydown", onKey);
            }, []);

            return (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="nexa-confirm-title"
                    className="fixed inset-0 z-[1000]"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

                    {/* Panel */}
                    <div className="relative mx-auto w-full max-w-md px-4 py-16">
                        <div
                            className="relative rounded-xl overflow-hidden border border-white/5"
                            style={{
                                background:
                                    "linear-gradient(180deg, rgba(7,11,19,0.95) 0%, rgba(10,14,22,0.88) 100%)",
                                boxShadow:
                                    "0 20px 60px rgba(2,6,23,0.6), 0 0 40px rgba(244,63,94,0.06)",
                                animation: "nexaConfirmIn 180ms cubic-bezier(.22,1,.36,1)",
                            }}
                        >
                            {/* Accent bar */}
                            <div className="absolute top-0 left-0 right-0 h-1">
                                <div
                                    className="h-full w-full"
                                    style={{ background: "linear-gradient(90deg,#F43F5E,#6366F1)" }}
                                />
                            </div>

                            {/* Close */}
                            <button
                                onClick={() => close(false)}
                                aria-label="Close"
                                className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Content */}
                            <div className="px-5 pt-6 pb-4">
                                <div className="flex items-start gap-3">
                                    <div
                                        className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md"
                                        style={{
                                            background: "linear-gradient(90deg,#F43F5E,#6366F1)",
                                            boxShadow: "0 8px 26px rgba(99,102,241,0.18)",
                                        }}
                                    >
                                        <LogOut className="h-4 w-4 text-white" />
                                    </div>

                                    <div>
                                        <h2
                                            id="nexa-confirm-title"
                                            className="text-sm font-semibold text-gray-100"
                                        >
                                            {title}
                                        </h2>
                                        {description && (
                                            <p className="mt-1 text-xs text-gray-400">{description}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-5 flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => close(false)}
                                        className="px-3.5 py-2 rounded-md text-sm text-gray-200 border border-white/10 hover:bg-white/5 transition-colors"
                                    >
                                        {cancelText}
                                    </button>

                                    <button
                                        onClick={() => close(true)}
                                        className="px-3.5 py-2 rounded-md text-sm text-white shadow-md transition-transform active:scale-[0.98] cursor-pointer"
                                        style={{
                                            background:
                                                "linear-gradient(90deg,#F43F5E 0%, #6366F1 100%)",
                                            boxShadow:
                                                "0 8px 28px rgba(244,63,94,0.18), 0 2px 10px rgba(99,102,241,0.2)",
                                        }}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* keyframes */}
                        <style>{`
              @keyframes nexaConfirmIn {
                0% { transform: translateY(8px) scale(.985); opacity: 0; }
                100% { transform: translateY(0) scale(1); opacity: 1; }
              }
            `}</style>
                    </div>
                </div>
            );
        }

        root.render(<Dialog />);
    });
}
