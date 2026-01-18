"use client";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AuthProvider } from "@/lib/AuthContext";
import { GamificationProvider } from "@/lib/GamificationContext";
import { HabitProvider } from "@/lib/HabitContext";
import { RouteGuard } from "@/components/layout/RouteGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { NotificationProvider } from "@/lib/NotificationContext";

import { usePathname } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = ["/login", "/signup"].includes(pathname);

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                <NotificationProvider>
                    <GamificationProvider>
                        <HabitProvider>
                            <RouteGuard>
                                {isAuthPage ? (
                                    children
                                ) : (
                                    <div className="flex h-screen w-full">
                                        <Sidebar />
                                        <div className="flex-1 flex flex-col h-full relative md:ml-64 transition-all duration-300">
                                            <Header />
                                            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50 dark:bg-background pb-24 md:pb-8">
                                                <div className="max-w-6xl mx-auto space-y-8">
                                                    {children}
                                                </div>
                                            </main>
                                            <MobileNav />
                                        </div>
                                    </div>
                                )}
                            </RouteGuard>
                        </HabitProvider>
                    </GamificationProvider>
                </NotificationProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
