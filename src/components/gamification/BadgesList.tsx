"use client";

import { useGamification } from "@/lib/GamificationContext";
import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";

// Badge Definitions
export const BADGES_DATA = [
    { id: "first_step", name: "First Step", description: "Complete your first habit", icon: "🌱" },
    { id: "streak_3", name: "Consistency is Key", description: "Reach a 3-day streak", icon: "🔥" },
    { id: "streak_7", name: "Habit Master", description: "Reach a 7-day streak", icon: "🚀" },
    { id: "xp_100", name: "Centurion", description: "Earn 100 XP", icon: "💯" },
    { id: "xp_500", name: "Half K", description: "Earn 500 XP", icon: "🛡️" },
    { id: "xp_1000", name: "Legend", description: "Earn 1000 XP", icon: "👑" },
];

export function BadgesList() {
    const { badges } = useGamification();

    return (
        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="text-primary" />
                Achievements
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {BADGES_DATA.map((badge) => {
                    const isUnlocked = badges.includes(badge.id);

                    return (
                        <motion.div
                            key={badge.id}
                            whileHover={{ scale: 1.05 }}
                            className={`relative p-4 rounded-xl border-2 flex flex-col items-center text-center transition-colors ${isUnlocked
                                ? "border-primary/20 bg-primary/5"
                                : "border-border bg-muted/50 grayscale opacity-70"
                                }`}
                        >
                            <div className="text-4xl mb-2">
                                {isUnlocked ? badge.icon : <Lock size={32} className="text-muted-foreground p-1" />}
                            </div>
                            <h4 className={`font-bold text-sm ${isUnlocked ? "text-foreground" : "text-muted-foreground"}`}>
                                {badge.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                                {badge.description}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
