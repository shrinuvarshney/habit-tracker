"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { signup, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (email && name && password) {
            const success = await signup(name, email, password);
            if (!success) {
                setError("User already exists with this email.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 dark:bg-background p-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card p-8 rounded-2xl shadow-xl w-full max-w-md border border-border"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="text-muted-foreground mt-2">Join us to build better habits</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">My Name is...</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Alex Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-transform active:scale-95 shadow-lg shadow-primary/25 mt-2 disabled:opacity-70"
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
