// components/MoreMenu.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

export type ActionButton = {
    name: string;
    onClick?: () => void | Promise<void>;
    icon?: React.ReactNode;
    disabled?: boolean;
    preventClose?: boolean;
};

type MoreMenuProps = {
    actions: ActionButton[];
    align?: "start" | "end"; // default "end"
    width?: number; // default 200
};

const MoreMenu: React.FC<MoreMenuProps> = ({
    actions,
    align = "end",
    width = 200,
}) => {
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
    const [open, setOpen] = useState(false);
    const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
        null
    );
    const [mounted, setMounted] = useState(false);
    const isSmallScreen = useRef(false);

    // mount flag for portal safety (Next.js)
    useEffect(() => {
        setMounted(true);
    }, []);

    // compute desktop position
    useEffect(() => {
        if (!open) return;

        const compute = () => {
            const btn = triggerRef.current;
            if (!btn) return;

            const rect = btn.getBoundingClientRect();
            isSmallScreen.current = window.innerWidth < 640; // sm breakpoint

            if (isSmallScreen.current) {
                setMenuPos(null);
                return;
            }

            const leftBase = align === "end" ? rect.right - width : rect.left;
            const left = Math.max(
                8,
                Math.min(leftBase, window.innerWidth - width - 8)
            );
            const top = rect.bottom + window.scrollY + 8;

            setMenuPos({ left: left + window.scrollX, top });
        };

        compute();
        window.addEventListener("resize", compute);
        window.addEventListener("scroll", compute, true);
        return () => {
            window.removeEventListener("resize", compute);
            window.removeEventListener("scroll", compute, true);
        };
    }, [open, align, width]);

    // Close on outside click
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            const t = triggerRef.current;
            const m = menuRef.current;
            if (!t || !m) return;
            if (t.contains(e.target as Node)) return;
            if (m.contains(e.target as Node)) return;
            setOpen(false);
        };
        if (open) {
            document.addEventListener("mousedown", onDocClick);
        }
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    // keyboard navigation
    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (!menuRef.current) return;

            const enabledIndexes = actions
                .map((a, i) => (!a.disabled ? i : -1))
                .filter((i) => i >= 0);

            if (e.key === "Escape") {
                setOpen(false);
                triggerRef.current?.focus();
            }

            if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
                e.preventDefault();
            } else {
                return;
            }

            const activeIndex = itemsRef.current.findIndex(
                (el) => el === document.activeElement
            );

            if (e.key === "ArrowDown") {
                const next =
                    enabledIndexes.find((i) => i > activeIndex) ?? enabledIndexes[0];
                itemsRef.current[next]?.focus();
            }
            if (e.key === "ArrowUp") {
                const prevList = enabledIndexes.filter((i) => i < activeIndex);
                const prev = prevList.length
                    ? prevList[prevList.length - 1]
                    : enabledIndexes[enabledIndexes.length - 1];
                itemsRef.current[prev]?.focus();
            }
            if (e.key === "Enter") {
                const focused = document.activeElement as HTMLElement | null;
                if (!focused) return;
                focused.click();
            }
        };

        // focus first enabled item when open
        const firstEnabled = actions.findIndex((a) => !a.disabled);
        setTimeout(() => {
            itemsRef.current[firstEnabled]?.focus();
        }, 0);

        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, actions]);

    const handleAction = async (action: ActionButton) => {
        if (action.disabled) return;
        try {
            if (action.onClick) await action.onClick();
        } catch (err) {
            console.error("Action error:", err);
        } finally {
            if (!action.preventClose) setOpen(false);
        }
    };

    // Desktop popover
    const popover = (
        <div
            ref={menuRef}
            role="menu"
            aria-orientation="vertical"
            className="z-50 rounded-lg shadow-2xl bg-[#192232] text-white border border-white/10"
            style={{
                position: "absolute",
                width,
                top: menuPos ? `${menuPos.top}px` : undefined,
                left: menuPos ? `${menuPos.left}px` : undefined,
                transformOrigin: "top right",
            }}
        >
            <div
                className="max-h-[60vh] overflow-y-auto py-1"
                style={{ overscrollBehavior: "contain" }}
            >
                {actions.map((action, i) => {
                    const commonClasses =
                        "flex items-center gap-3 px-4 py-2 text-sm w-full text-left rounded-md focus:outline-none";
                    const disabledCls = action.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-white/10";
                    return (
                        <button
                            key={i}
                            onClick={() => handleAction(action)}
                            className={`${commonClasses} ${disabledCls}`}
                            role="menuitem"
                            tabIndex={-1}
                            ref={(el) => (itemsRef.current[i] = el)}
                            disabled={action.disabled}
                        >
                            {action.icon && <span className="shrink-0">{action.icon}</span>}
                            <span className="truncate">{action.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    // Mobile bottom sheet
    const sheet = (
        <div
            ref={menuRef}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-lg bg-[#192232] text-white border-t border-white/10 p-3 sm:hidden"
            role="dialog"
            aria-modal="true"
        >
            <div className="mx-auto max-w-2xl">
                <div className="w-full flex items-center justify-between pb-2">
                    <div className="text-sm font-medium">Actions</div>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close actions"
                        className="p-1 rounded hover:bg-white/10"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-col gap-2">
                    {actions.map((action, i) => (
                        <button
                            key={i}
                            onClick={() => handleAction(action)}
                            className={`flex items-center gap-3 px-4 py-3 text-sm rounded-md ${action.disabled
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-white/10"
                                }`}
                            ref={(el) => (itemsRef.current[i] = el)}
                        >
                            {action.icon}
                            <span>{action.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="relative inline-block text-left">
                <button
                    ref={triggerRef}
                    aria-haspopup="true"
                    aria-expanded={open}
                    onClick={() => setOpen((s) => !s)}
                    className="p-1 rounded-md hover:bg-white/5"
                    title="More actions"
                >
                    <MoreHorizontal className="text-gray-300" />
                </button>
            </div>

            {/* Desktop Popover (portal) */}
            {mounted && menuPos && open &&
                createPortal(
                    <div
                        className="pointer-events-none"
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <div
                            style={{ position: "absolute", top: 0, left: 0 }}
                            className="pointer-events-auto transition-all duration-200 ease-out transform opacity-0 scale-95"
                            ref={(el) => {
                                if (!el) return;
                                requestAnimationFrame(() => {
                                    el.className =
                                        "pointer-events-auto transition-all duration-200 ease-out transform opacity-100 scale-100";
                                });
                            }}
                        >
                            {popover}
                        </div>
                    </div>,
                    document.body
                )}

            {/* Mobile bottom sheet */}
            {open && (
                <div className="sm:hidden">
                    <div
                        className="fixed inset-0 z-40 bg-black/45"
                        onClick={() => setOpen(false)}
                        aria-hidden
                    />
                    {sheet}
                </div>
            )}
        </>
    );
};

export default MoreMenu;
