"use client";

import { HabitHeatmap } from "@/components/analytics/HabitHeatmap";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { useHabits } from "@/lib/HabitContext";
import { format, subDays } from "date-fns";
import { Trophy, Calendar, Zap, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
    const { habits } = useHabits();

    // -------------------------------------------------------------------------
    // Aggregation Logic
    // -------------------------------------------------------------------------
    const totalHabits = habits.length;

    // Overall completion rate (all time) - Simplified: total completions / (total habits * days since creation)
    // For now, let's just do "Last 30 Days" completion rate
    const last30Days = Array.from({ length: 30 }).map((_, i) => format(subDays(new Date(), i), "yyyy-MM-dd"));

    const totalPossibleCompletions = totalHabits * 30;
    let actualCompletions = 0;

    habits.forEach(h => {
        h.completedDates.forEach(date => {
            if (last30Days.includes(date)) {
                actualCompletions++;
            }
        });
    });

    const completionRate = totalPossibleCompletions > 0
        ? Math.round((actualCompletions / totalPossibleCompletions) * 100)
        : 0;

    // Best Streak across all habits
    const bestStreak = Math.max(...habits.map(h => h.streak), 0);
    const bestHabit = habits.reduce((prev, current) => (prev.streak > current.streak) ? prev : current, habits[0]);

    // "Best Day" - Day of week with most completions
    // Simple frequency map
    const dayFrequency = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    habits.forEach(h => {
        h.completedDates.forEach(date => {
            const dayName = format(new Date(date), "EEE") as keyof typeof dayFrequency;
            if (dayFrequency[dayName] !== undefined) {
                dayFrequency[dayName]++;
            }
        });
    });
    const bestDay = Object.entries(dayFrequency).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
                <p className="text-muted-foreground">Deep dive into your performance.</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-2xl border border-border flex flex-col gap-2">
                    <span className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl w-fit">
                        <Zap size={24} />
                    </span>
                    <p className="text-muted-foreground font-medium">Completion Rate (30d)</p>
                    <h3 className="text-3xl font-bold text-foreground">{completionRate}%</h3>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border flex flex-col gap-2">
                    <span className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 rounded-xl w-fit">
                        <Trophy size={24} />
                    </span>
                    <p className="text-muted-foreground font-medium">Best Habit Streak</p>
                    <h3 className="text-3xl font-bold text-foreground">{bestStreak} <span className="text-sm font-normal text-muted-foreground">days</span></h3>
                    <p className="text-xs text-muted-foreground truncate">{bestHabit?.title || "None"}</p>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border flex flex-col gap-2">
                    <span className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-xl w-fit">
                        <Calendar size={24} />
                    </span>
                    <p className="text-muted-foreground font-medium">Most Productive Day</p>
                    <h3 className="text-3xl font-bold text-foreground">{bestDay}</h3>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border flex flex-col gap-2">
                    <span className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl w-fit">
                        <AlertCircle size={24} />
                    </span>
                    <p className="text-muted-foreground font-medium">Total Completions</p>
                    <h3 className="text-3xl font-bold text-foreground">{actualCompletions}</h3>
                </div>
            </div>

            {/* Heatmap Section */}
            <HabitHeatmap />

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <WeeklyChart />
            </div>
        </motion.div>
    );
}
