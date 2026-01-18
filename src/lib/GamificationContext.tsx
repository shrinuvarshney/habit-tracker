"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { useNotifications } from "@/lib/NotificationContext";

export interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string; // emoji or lucide icon name
}

export const BADGES: Record<string, Badge> = {
    "first_step": { id: "first_step", title: "First Step", description: "Completed your first habit", icon: "🌱" },
    "streak_7": { id: "streak_7", title: "Week Warrior", description: "Reached a 7-day streak", icon: "🔥" },
    "streak_30": { id: "streak_30", title: "Unstoppable", description: "Reached a 30-day streak", icon: "🚀" },
    "xp_100": { id: "xp_100", title: "Novice", description: "Earned 100 XP", icon: "🥉" },
    "xp_500": { id: "xp_500", title: "Apprentice", description: "Earned 500 XP", icon: "🥈" },
    "xp_1000": { id: "xp_1000", title: "Master", description: "Earned 1000 XP", icon: "🥇" },
    "hard_worker": { id: "hard_worker", title: "Hard Worker", description: "Completed a Hard difficulty habit", icon: "💪" },
};

interface GamificationState {
    xp: number;
    level: number;
    badges: string[];
    addXP: (amount: number) => void;
    unlockBadge: (badgeId: string) => void;
    nextLevelXP: number;
    progressToNextLevel: number;
}

const GamificationContext = createContext<GamificationState | undefined>(undefined);

// Leveling formula
const calculateLevel = (xp: number) => Math.floor(0.1 * Math.sqrt(xp)) + 1;
const calculateXPForLevel = (level: number) => 100 * Math.pow(level - 1, 2);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [xp, setXP] = useState(0);
    const [badges, setBadges] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from storage
    useEffect(() => {
        if (user) {
            const storedData = localStorage.getItem(`habit_gamification_${user.email}`);
            if (storedData) {
                try {
                    const parsed = JSON.parse(storedData);
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setXP(parsed.xp || 0);
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setBadges(parsed.badges || []);
                } catch (e) { console.error(e); }
            } else {
                setXP(0);
                setBadges([]);
            }
            setIsLoaded(true);
        }
    }, [user]);

    // Save to storage
    useEffect(() => {
        if (isLoaded && user) {
            localStorage.setItem(`habit_gamification_${user.email}`, JSON.stringify({ xp, badges }));
        }
    }, [xp, badges, isLoaded, user]);

    const level = calculateLevel(xp);
    const currentLevelBaseXP = calculateXPForLevel(level);
    const nextLevelBaseXP = calculateXPForLevel(level + 1);
    const xpInCurrentLevel = xp - currentLevelBaseXP;
    const xpNeededForNextLevel = nextLevelBaseXP - currentLevelBaseXP;
    const progressToNextLevel = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

    const addXP = (amount: number) => {
        if (!isLoaded) return;

        const newXP = xp + amount;
        setXP(newXP);

        // Check for level up
        const oldLevel = calculateLevel(xp);
        const newLevel = calculateLevel(newXP);
        if (newLevel > oldLevel) {
            addNotification("Level Up!", `Congratulations! You reached Level ${newLevel}.`, "success");
        }

        // Check for XP badges automatically
        const newBadges = [...badges];
        const checkAndAdd = (id: string, condition: boolean) => {
            if (condition && !newBadges.includes(id)) {
                newBadges.push(id);
                const badge = BADGES[id];
                addNotification("Badge Unlocked!", `You earned: ${badge.title} ${badge.icon}`, "success");
            }
        };

        checkAndAdd("xp_100", newXP >= 100);
        checkAndAdd("xp_500", newXP >= 500);
        checkAndAdd("xp_1000", newXP >= 1000);
        checkAndAdd("first_step", newXP > 0);

        if (newBadges.length > badges.length) {
            setBadges(newBadges);
        }
    };

    const unlockBadge = (badgeId: string) => {
        if (!badges.includes(badgeId)) {
            setBadges(prev => [...prev, badgeId]);
            const badge = BADGES[badgeId];
            if (badge) {
                addNotification("Badge Unlocked!", `You earned: ${badge.title} ${badge.icon}`, "success");
            }
        }
    };

    return (
        <GamificationContext.Provider value={{ xp, level, badges, addXP, unlockBadge, nextLevelXP: nextLevelBaseXP, progressToNextLevel }}>
            {children}
        </GamificationContext.Provider>
    );
}

export function useGamification() {
    const context = useContext(GamificationContext);
    if (!context) throw new Error("useGamification must be used within a GamificationProvider");
    return context;
}
