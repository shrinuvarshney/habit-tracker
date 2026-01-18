"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, BarChart2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "Habits", href: "/habits", icon: CheckSquare },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "More", href: "/settings", icon: MoreHorizontal },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe transition-colors duration-300">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium mt-1">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
