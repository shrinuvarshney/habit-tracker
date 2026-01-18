"use client";

import { useNotifications } from "@/lib/NotificationContext";
import { Bell, Check, Trash2, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

export function NotificationDropdown() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case "success": return <CheckCircle size={16} className="text-green-500" />;
            case "warning": return <AlertTriangle size={16} className="text-yellow-500" />;
            case "error": return <XCircle size={16} className="text-red-500" />;
            default: return <Info size={16} className="text-blue-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border border-background animate-pulse"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                            <h3 className="font-semibold text-foreground">Notifications</h3>
                            <div className="flex gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                                    >
                                        <Check size={12} /> Mark all read
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAll}
                                        className="text-xs text-muted-foreground hover:text-destructive font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-destructive/10 transition-colors"
                                    >
                                        <Trash2 size={12} /> Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                                    <Bell size={32} className="opacity-20" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <ul>
                                    {notifications.map((notification) => (
                                        <li
                                            key={notification.id}
                                            className={`p-4 border-b border-border last:border-none hover:bg-muted/50 transition-colors cursor-pointer relative ${!notification.isRead ? "bg-primary/5" : ""}`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex gap-3 items-start">
                                                <div className="mt-1 shrink-0">
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`text-sm font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <span className="text-[10px] text-muted-foreground/60 mt-2 block">
                                                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                                    </span>
                                                </div>
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2"></div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
