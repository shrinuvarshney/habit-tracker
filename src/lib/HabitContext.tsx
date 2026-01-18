"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { format, subDays, differenceInCalendarDays } from "date-fns";
import { useAuth } from "./AuthContext";
import { useGamification } from "./GamificationContext";
import { useNotifications } from "./NotificationContext";
import { Habit, HabitStatus, HabitDifficulty } from "./types";

interface HabitContextType {
    habits: Habit[];
    addHabit: (title: string, category: string, difficulty?: HabitDifficulty, reminders?: string[]) => void;
    updateHabit: (id: string, updates: Partial<Habit>) => void;
    reorderHabits: (habits: Habit[]) => void;
    deleteHabit: (id: string) => void;
    toggleHabit: (id: string, date?: string) => void;
    getHabitStatus: (id: string, date?: string) => HabitStatus;
    addNote: (id: string, date: string, note: string) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { user } = useAuth();
    const { addXP } = useGamification();
    const { addNotification } = useNotifications();

    // -------------------------------------------------------------------------
    // Helper: Migration & streak calc
    // -------------------------------------------------------------------------
    const migrateHabits = (rawHabits: unknown[]): Habit[] => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (rawHabits as any[]).map((h) => ({
            ...h,
            difficulty: h.difficulty || "medium",
            reminders: h.reminders || [],
            streakFreeze: h.streakFreeze !== undefined ? h.streakFreeze : 0,
            notes: h.notes || {},
            archived: h.archived || false,
            createdAt: h.createdAt || new Date().toISOString(),
            streak: h.streak || 0,
        }));
    };

    const calculateStreak = (completedDates: string[], today: string): number => {
        if (!completedDates.length) return 0;
        const sorted = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        const lastCompleted = sorted[0];
        const daysDiff = differenceInCalendarDays(new Date(today), new Date(lastCompleted));

        if (daysDiff > 1) return 0;

        let streak = 0;
        let currentCheck = new Date(lastCompleted);
        for (let i = 0; i < sorted.length; i++) {
            const dateStr = sorted[i];
            if (dateStr === format(currentCheck, "yyyy-MM-dd")) {
                streak++;
                currentCheck = subDays(currentCheck, 1);
            } else {
                break;
            }
        }
        return streak;
    };

    // -------------------------------------------------------------------------
    // Load & Save
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (user) {
            const saved = localStorage.getItem(`habits_${user.email}`) || localStorage.getItem("habits");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        const migrated = migrateHabits(parsed);
                        setHabits(migrated);
                    } else {
                        throw new Error("Invalid habit data format");
                    }
                } catch (e) {
                    console.error("Failed to parse habits, resetting:", e);
                    setHabits([]); // Fail safe
                }
            } else {
                setHabits([
                    {
                        id: "1", title: "Morning Run", category: "Health",
                        completedDates: [format(new Date(), "yyyy-MM-dd")],
                        streak: 1, goal: 1, difficulty: "hard", reminders: ["07:00"], streakFreeze: 0, notes: {}, archived: false, createdAt: new Date().toISOString()
                    },
                    {
                        id: "2", title: "Read 30 mins", category: "Mind",
                        completedDates: [],
                        streak: 0, goal: 1, difficulty: "medium", reminders: [], streakFreeze: 2, notes: {}, archived: false, createdAt: new Date().toISOString()
                    },
                ]);
            }
            setIsLoaded(true);
        }
    }, [user]);

    useEffect(() => {
        if (isLoaded && user) {
            localStorage.setItem(`habits_${user.email}`, JSON.stringify(habits));
        }
    }, [habits, isLoaded, user]);

    // -------------------------------------------------------------------------
    // Reminder Logic (Browser Notifications + In-App)
    // -------------------------------------------------------------------------
    useEffect(() => {
        if (!isLoaded) return;

        if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }

        const checkReminders = () => {
            const now = new Date();
            const currentTime = format(now, "HH:mm");
            const currentDay = format(now, "yyyy-MM-dd");

            habits.forEach(habit => {
                if (habit.archived) return;
                if (habit.completedDates.includes(currentDay)) return;

                if (habit.reminders.includes(currentTime)) {
                    // Browser Notification
                    if ("Notification" in window && Notification.permission === "granted") {
                        new Notification(`Time for ${habit.title}!`, {
                            body: `Keep your streak alive! 🚀`,
                            icon: "/icon-192x192.png"
                        });
                    }
                    // In-App Notification
                    addNotification(`Reminder: ${habit.title}`, "It's time to work on your habit!", "warning");
                }
            });
        };

        const interval = setInterval(checkReminders, 60000);
        return () => clearInterval(interval);
    }, [habits, isLoaded, addNotification]);

    // -------------------------------------------------------------------------
    // Actions
    // -------------------------------------------------------------------------
    const addHabit = (title: string, category: string, difficulty: HabitDifficulty = "medium", reminders: string[] = []) => {
        const newHabit: Habit = {
            id: crypto.randomUUID(),
            title, category,
            completedDates: [], streak: 0, goal: 1, difficulty, reminders, streakFreeze: 0, notes: {}, archived: false, createdAt: new Date().toISOString()
        };
        setHabits((prev) => [...prev, newHabit]);
    };

    const updateHabit = (id: string, updates: Partial<Habit>) => {
        setHabits((prev) => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    };

    const reorderHabits = (newOrder: Habit[]) => {
        setHabits(newOrder);
    };

    const deleteHabit = (id: string) => {
        setHabits((prev) => prev.filter((h) => h.id !== id));
    };

    const addNote = (id: string, date: string, note: string) => {
        setHabits((prev) => prev.map(h => {
            if (h.id !== id) return h;
            return { ...h, notes: { ...h.notes, [date]: note } };
        }));
    };

    const toggleHabit = (id: string, dateStr: string = format(new Date(), "yyyy-MM-dd")) => {
        setHabits((prev) =>
            prev.map((h) => {
                if (h.id !== id) return h;

                const isCompleted = h.completedDates.includes(dateStr);
                let newDates = h.completedDates;

                if (isCompleted) {
                    newDates = newDates.filter((d) => d !== dateStr);
                } else {
                    newDates = [...newDates, dateStr];
                    let xpAmount = 10;
                    if (h.difficulty === "easy") xpAmount = 5;
                    if (h.difficulty === "hard") xpAmount = 20;
                    addXP(xpAmount);
                }

                const newStreak = calculateStreak(newDates, format(new Date(), "yyyy-MM-dd"));
                return { ...h, completedDates: newDates, streak: newStreak };
            })
        );
    };

    const getHabitStatus = (id: string, dateStr: string = format(new Date(), "yyyy-MM-dd")): HabitStatus => {
        const habit = habits.find((h) => h.id === id);
        if (!habit) return "not-started";
        return habit.completedDates.includes(dateStr) ? "completed" : "not-started";
    };

    return (
        <HabitContext.Provider value={{ habits, addHabit, updateHabit, reorderHabits, deleteHabit, toggleHabit, getHabitStatus, addNote }}>
            {children}
        </HabitContext.Provider>
    );
}

export function useHabits() {
    const context = useContext(HabitContext);
    if (!context) throw new Error("useHabits must be used within a HabitProvider");
    return context;
}
