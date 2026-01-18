"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CheckSquare,
    BarChart2,
    Trophy,
    Settings,
    LogOut
} from "lucide-react";
import { LevelProgress } from "@/components/gamification/LevelProgress";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "My Habits", href: "/habits", icon: CheckSquare },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Challenges", href: "/challenges", icon: Trophy },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-card hidden md:flex flex-col border-r border-border h-full fixed left-0 top-0 z-10 shadow-sm transition-colors duration-300">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Habit Tracker
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <div className="bg-gradient-pastel dark:bg-muted dark:bg-none p-4 rounded-xl">
                    <p className="text-sm font-medium text-slate-700 dark:text-foreground">Daily Tip</p>
                    <p className="text-xs text-slate-500 mt-1">Consistency is key!</p>
                </div>
            </div>
            <div className="p-4 border-t border-border">
                <LevelProgress />
            </div>
        </aside>
    );
}
