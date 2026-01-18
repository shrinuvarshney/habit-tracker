"use client";

import { useHabits } from "@/lib/HabitContext";
import { Zap, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsCards() {
    const { habits } = useHabits();

    // Calculate stats
    const totalHabits = habits.length;
    const longestStreak = Math.max(...habits.map((h) => h.streak), 0);

    // Example "Completion Rate" calculation (simplified for demo)
    // Let's assume it's just based on today for now or average streaks
    const avgStreak = totalHabits > 0 ? (habits.reduce((acc, h) => acc + h.streak, 0) / totalHabits).toFixed(1) : 0;

    const stats = [
        {
            label: "Longest Streak",
            value: `${longestStreak} Days`,
            icon: Zap,
            color: "text-orange-500 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-500/10",
        },
        {
            label: "Active Habits",
            value: totalHabits,
            icon: Target,
            color: "text-blue-500 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-500/10",
        },
        {
            label: "Avg. Streak",
            value: `${avgStreak} Days`,
            icon: TrendingUp,
            color: "text-green-500 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <div key={i} className="bg-card p-6 rounded-2xl shadow-sm border border-border flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className={cn("p-4 rounded-xl", stat.bg, stat.color)}>
                            <Icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
