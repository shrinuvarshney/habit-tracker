"use client";

import { useHabits } from "@/lib/HabitContext";
import { useGamification } from "@/lib/GamificationContext";
import { Sparkles, Brain, Zap, AlertTriangle, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";

export function AICoach() {
    const { habits } = useHabits();
    const { xp, badges } = useGamification();
    const [suggestion, setSuggestion] = useState<{ text: string; type: "motivation" | "correction" | "insight"; icon: LucideIcon } | null>(null);

    // AI Heuristic Engine
    useEffect(() => {
        const analyzeHabits = () => {
            if (habits.length === 0) {
                setSuggestion({
                    text: "Welcome! Start by adding a small habit you can do today. Maybe 'Drink Water'?",
                    type: "insight",
                    icon: Sparkles
                });
                return;
            }

            const today = format(new Date(), "yyyy-MM-dd");

            // 1. Check for immediate wins (today completed?)
            const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
            const totalToday = habits.length;

            if (completedToday === totalToday && totalToday > 0) {
                setSuggestion({
                    text: "All habits crushed today! You're unstoppable. 🚀",
                    type: "motivation",
                    icon: Zap
                });
                return;
            }

            // 2. Check for broken streaks
            const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
            const brokenStreaks = habits.filter(h =>
                h.streak === 0 && h.completedDates.length > 0 && !h.completedDates.includes(today) && !h.completedDates.includes(yesterday)
            );

            if (brokenStreaks.length > 0) {
                setSuggestion({
                    text: `Don't let ${brokenStreaks[0].title} fade away! One checkmark today can restart your momentum.`,
                    type: "correction",
                    icon: AlertTriangle
                });
                return;
            }

            // 3. XP / Level Motivation
            if (xp > 0 && xp % 100 < 20) {
                setSuggestion({
                    text: "You're close to the next big milestone! Keep going for that next Level.",
                    type: "motivation",
                    icon: Brain
                });
                return;
            }

            // 4. Time of day specific
            const hours = new Date().getHours();
            if (hours < 10 && completedToday === 0) {
                setSuggestion({
                    text: "Good morning! Tackling the hardest habit first creates a productivity snowball.",
                    type: "insight",
                    icon: Sparkles
                });
                return;
            }

            if (hours > 20 && completedToday < totalToday) {
                setSuggestion({
                    text: "It's late, but not too late. Just 5 minutes on a remaining habit keeps the streak alive.",
                    type: "motivation",
                    icon: Zap
                });
                return;
            }

            // Default
            setSuggestion({
                text: "Consistency eats intensity for breakfast. Just show up.",
                type: "insight",
                icon: Brain
            });
        };

        analyzeHabits();
    }, [habits, xp, badges]);

    if (!suggestion) return null;

    const Icon = suggestion.icon;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={suggestion.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Brain size={100} />
                </div>

                <div className="relative z-10 flex gap-4 items-start">
                    <div className="bg-white/20 p-3 rounded-xl mt-1">
                        <Icon size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                            AI Coach
                            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium tracking-wider uppercase">Beta</span>
                        </h3>
                        <p className="text-white/90 leading-relaxed font-medium">
                            &quot;{suggestion.text}&quot;
                        </p>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
