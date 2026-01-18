"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type NotificationType = "info" | "success" | "warning" | "error";

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    timestamp: number;
}

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    addNotification: (title: string, message: string, type?: NotificationType) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    // Determine unread count
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const addNotification = (title: string, message: string, type: NotificationType = "info") => {
        const newNotification: AppNotification = {
            id: crypto.randomUUID(),
            title,
            message,
            type,
            isRead: false,
            timestamp: Date.now()
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
    return context;
}
