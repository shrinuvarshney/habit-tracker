"use client";

import { useHabits } from "@/lib/HabitContext";
import { Trash2, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function HabitsPage() {
    const { habits, deleteHabit } = useHabits();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-3xl font-bold text-foreground">My Habits</h1>
                <p className="text-muted-foreground">Manage your daily routines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habits.map((habit) => (
                    <div key={habit.id} className="bg-card p-6 rounded-2xl shadow-sm border border-border group hover:shadow-md transition-all hover:border-primary/20">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl">
                                <Calendar size={24} />
                            </div>
                            <button
                                onClick={() => deleteHabit(habit.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors p-2"
                                title="Delete Habit"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-foreground mb-1">{habit.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{habit.category}</p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex flex-col">
                                <span className="font-bold text-foreground">{habit.streak}</span>
                                <span className="text-xs">Streak</span>
                            </div>
                            <div className="w-px h-8 bg-border"></div>
                            <div className="flex flex-col">
                                <span className="font-bold text-foreground">{habit.completedDates.length}</span>
                                <span className="text-xs">Total</span>
                            </div>
                        </div>
                    </div>
                ))}

                {habits.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-2xl border border-dashed border-border">
                        <p>No habits found. Create one from the Dashboard!</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
