"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle, Lock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function ForgotPasswordPage() {
    const { dev_resetPassword, resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState<"email" | "password" | "success">("email");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Check if user exists first (Verify email)
        const exists = await resetPassword(email);

        if (exists) {
            setStep("password");
        } else {
            setError("No account found with this email.");
        }
        setIsLoading(false);
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Actually reset the password
        const success = await dev_resetPassword(email, newPassword);

        if (success) {
            setStep("success");
        } else {
            setError("Failed to reset password. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4 transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#121212] p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-[#262626] transition-colors duration-300"
            >
                <Link href="/login" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Login
                </Link>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary dark:text-white dark:bg-white/10">
                        {step === "success" ? <CheckCircle className="w-8 h-8" /> : (step === "password" ? <Lock className="w-8 h-8" /> : <Mail className="w-8 h-8" />)}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {step === "success" ? "Password Reset" : (step === "password" ? "New Password" : "Forgot Password")}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        {step === "success"
                            ? "Your password has been successfully updated."
                            : (step === "password" ? "Enter your new password below." : "Enter your email to find your account.")}
                    </p>
                </div>

                {step === "email" && (
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                <AlertTriangle size={16} />
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#262626] bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                placeholder="alex@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Checking..." : "Continue"}
                        </button>
                    </form>
                )}

                {step === "password" && (
                    <form onSubmit={handlePasswordReset} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                <AlertTriangle size={16} />
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#262626] bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="••••••••"
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                {step === "success" && (
                    <div className="space-y-4">
                        <Link
                            href="/login"
                            className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/25"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
