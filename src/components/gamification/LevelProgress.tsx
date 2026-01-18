"use client";

import { useGamification } from "@/lib/GamificationContext";
import { motion } from "framer-motion";
import { Trophy, Star } from "lucide-react";

export function LevelProgress() {
    const { level, xp, nextLevelXP, progressToNextLevel } = useGamification();

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Trophy size={64} />
            </div>

            <div className="relative z-10 flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Star size={20} className="text-yellow-300 fill-yellow-300" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-white/80">Current Level</p>
                        <p className="text-2xl font-bold">{level}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-medium text-white/80">Total XP</p>
                    <p className="text-lg font-bold">{xp}</p>
                </div>
            </div>

            <div className="relative z-10 space-y-1">
                <div className="flex justify-between text-xs text-white/90 font-medium">
                    <span>Progress</span>
                    <span>{Math.round(progressToNextLevel)}%</span>
                </div>
                <div className="h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToNextLevel}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full shadow-[0_0_10px_rgba(253,224,71,0.5)]"
                    />
                </div>
                <p className="text-[10px] text-white/60 text-right mt-1">
                    {Math.round(nextLevelXP - xp)} XP to Level {level + 1}
                </p>
            </div>
        </div>
    );
}
