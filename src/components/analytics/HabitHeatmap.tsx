"use client";

import { useHabits } from "@/lib/HabitContext";
import { format, subDays, eachDayOfInterval } from "date-fns";

export function HabitHeatmap() {
    const { habits } = useHabits();

    // Generate last 365 days or just current year? 
    // Let's do last 365 days for rolling window like GitHub
    const today = new Date();
    const startDate = subDays(today, 364); // 52 weeks * 7 = 364

    const days = eachDayOfInterval({
        start: startDate,
        end: today
    });

    // Calculate intensity for each day
    // Map: dateString -> count of completed habits
    const activityMap = new Map<string, number>();
    const totalHabits = habits.length;

    habits.forEach(habit => {
        habit.completedDates.forEach(date => {
            const current = activityMap.get(date) || 0;
            activityMap.set(date, current + 1);
        });
    });

    const getColor = (count: number) => {
        if (count === 0) return "bg-gray-100 dark:bg-slate-800";
        // Calculate percentage of habits done that day
        // Logic: if you did 1 habit out of 5, it's low intensity. 
        // If you did 5/5, it's high.
        // If totalHabits is 0, avoid division by zero.
        if (totalHabits === 0) return "bg-gray-100 dark:bg-slate-800";

        const percentage = count / totalHabits;

        if (percentage <= 0.25) return "bg-green-200 dark:bg-green-900/40";
        if (percentage <= 0.50) return "bg-green-300 dark:bg-green-800/60";
        if (percentage <= 0.75) return "bg-green-400 dark:bg-green-600";
        return "bg-green-500 dark:bg-green-500";
    };

    return (
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border overflow-x-auto">
            <h3 className="text-lg font-bold text-foreground mb-4">Consistency Heatmap</h3>

            <div className="flex gap-1 min-w-max">
                {/* Organize by weeks (columns) */}
                {/* We need to group days by week. simple approach: just render squares wrapping? 
                    Grid with 7 rows (days of week) is standard.
                */}
                <div className="grid grid-rows-7 grid-flow-col gap-1">
                    {days.map((day) => {
                        const dateStr = format(day, "yyyy-MM-dd");
                        const count = activityMap.get(dateStr) || 0;
                        const colorClass = getColor(count);

                        return (
                            <div
                                key={dateStr}
                                className={`w-3 h-3 rounded-sm ${colorClass} transition-colors`}
                                title={`${dateStr}: ${count} habits completed`}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-slate-800" />
                    <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40" />
                    <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600" />
                    <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-500" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}
