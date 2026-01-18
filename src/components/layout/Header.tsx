"use client";

import { Search } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { NotificationDropdown } from "@/components/ui/Notifications";
import { useState, useEffect } from "react";

export function Header() {
    const { user } = useAuth();

    // Get greeting based on time of day
    const [greeting, setGreeting] = useState("Welcome");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, []);

    return (
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-20 px-8 flex items-center justify-between transition-colors duration-300">
            <div>
                <h2 className="text-xl font-semibold text-foreground">
                    {greeting}, {user?.name?.split(" ")[0] || "User"}! 👋
                </h2>
                <p className="text-sm text-muted-foreground">Ready for another productive day?</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 rounded-full bg-muted border-none text-sm text-foreground focus:ring-2 focus:ring-primary/20 outline-none w-64 transition-colors"
                    />
                </div>

                <NotificationDropdown />

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-green-400 p-[2px]">
                        <div className="w-full h-full rounded-full bg-card flex items-center justify-center font-bold text-muted-foreground overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="User" />
                            ) : (
                                <div className="text-sm dark:text-white">
                                    {user?.name?.charAt(0) || "U"}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="hidden md:block text-sm">
                        <p className="font-medium text-foreground">
                            {user?.name || "Guest User"}
                        </p>
                        <p className="text-xs text-muted-foreground">Free Plan</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
