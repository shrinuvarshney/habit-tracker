"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, subDays } from "date-fns";
import { useHabits } from "@/lib/HabitContext";
import { useState, useEffect } from "react";

export function WeeklyChart() {
    const { habits } = useHabits();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Generate data only on client
    const data = isMounted ? Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dateStr = format(date, "yyyy-MM-dd");
        const dayName = format(date, "EEE d");

        // Calculate completion % for this day
        const totalHabits = habits.length;
        if (totalHabits === 0) return { name: dayName, progress: 0 };

        const completedCount = habits.filter((h) => h.completedDates.includes(dateStr)).length;
        const progress = Math.round((completedCount / totalHabits) * 100);

        return { name: dayName, progress };
    }) : [];

    if (!isMounted) return <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[350px] animate-pulse" />;

    return (
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border h-[350px]">
            <h3 className="text-lg font-bold text-foreground mb-6">Weekly Progress</h3>
            <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            hide
                            domain={[0, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-popover)',
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-popover-foreground)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            itemStyle={{ color: 'var(--color-popover-foreground)' }}
                            labelStyle={{ color: 'var(--color-muted-foreground)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="progress"
                            stroke="#0ea5e9"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorProgress)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
