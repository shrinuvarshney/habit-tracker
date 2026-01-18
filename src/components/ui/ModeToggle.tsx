"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-full transition-all ${theme === "light"
                        ? "bg-white text-yellow-500 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
            >
                <Sun size={18} />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-full transition-all ${theme === "dark"
                        ? "bg-slate-700 text-blue-400 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
            >
                <Moon size={18} />
            </button>
        </div>
    );
}
