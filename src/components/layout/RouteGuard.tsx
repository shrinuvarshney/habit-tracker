"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const publicRoutes = ["/login", "/signup"];

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !user && !publicRoutes.includes(pathname)) {
            router.push("/login");
        }
        // If user is logged in and tries to go to login/signup, redirect to dashboard
        if (!isLoading && user && publicRoutes.includes(pathname)) {
            router.push("/");
        }
    }, [user, isLoading, pathname, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
