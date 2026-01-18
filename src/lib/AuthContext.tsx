"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    name: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateProfile: (name: string) => void;
    updateAvatar: (url: string) => void;
    resetPassword: (email: string) => Promise<boolean>;
    dev_resetPassword: (email: string, newPass: string) => Promise<boolean>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const getDB = () => {
        if (typeof window === "undefined") return {};
        try {
            return JSON.parse(localStorage.getItem("habit_users_db") || "{}");
        } catch (e) {
            console.error("Auth DB Error:", e);
            return {};
        }
    };

    useEffect(() => {
        // Check active session
        if (typeof window === "undefined") return;

        const sessionEmail = localStorage.getItem("habit_session_user");
        if (sessionEmail) {
            const users = getDB();
            if (users[sessionEmail]) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(users[sessionEmail]);
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getDB();
        const storedUser = users[email];

        if (storedUser && storedUser.password === password) {
            const { password: _, ...safeUser } = storedUser;
            setUser(safeUser);
            localStorage.setItem("habit_session_user", email);
            router.push("/");
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };

    const signup = async (name: string, email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = getDB();

        if (users[email]) {
            setIsLoading(false);
            return false;
        }

        const newUser = {
            name,
            email,
            password,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };

        users[email] = newUser;
        localStorage.setItem("habit_users_db", JSON.stringify(users));

        const { password: _, ...safeUser } = newUser;
        setUser(safeUser);
        localStorage.setItem("habit_session_user", email);

        router.push("/");
        setIsLoading(false);
        return true;
    };

    const resetPassword = async (email: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const users = getDB();
        return !!users[email];
    };

    const dev_resetPassword = async (email: string, newPass: string): Promise<boolean> => {
        const users = getDB();
        if (users[email]) {
            users[email].password = newPass;
            localStorage.setItem("habit_users_db", JSON.stringify(users));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("habit_session_user");
        router.push("/login");
    };

    const updateProfile = (name: string) => {
        if (!user) return;
        const updatedUser = { ...user, name };
        setUser(updatedUser);
        const users = getDB();
        if (users[user.email]) {
            users[user.email] = { ...users[user.email], name };
            localStorage.setItem("habit_users_db", JSON.stringify(users));
        }
    };

    const updateAvatar = (url: string) => {
        if (!user) return;
        const updatedUser = { ...user, avatar: url };
        setUser(updatedUser);
        const users = getDB();
        if (users[user.email]) {
            users[user.email] = { ...users[user.email], avatar: url };
            localStorage.setItem("habit_users_db", JSON.stringify(users));
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, updateAvatar, resetPassword, dev_resetPassword, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
