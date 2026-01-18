"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (email && password) {
            const success = await login(email, password);
            if (!success) {
                setError("Invalid email or password");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 dark:bg-background p-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-8 rounded-2xl shadow-xl w-full max-w-md border border-border transition-colors duration-300"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground mt-2">Sign in to continue your habit journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm text-center font-medium"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
                            placeholder="alex@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
                            placeholder="••••••••"
                        />
                        <div className="flex justify-end mt-2">
                            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-primary font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
