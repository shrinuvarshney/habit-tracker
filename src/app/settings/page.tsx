"use client";

import { ModeToggle } from "@/components/ui/ModeToggle";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { User, LogOut } from "lucide-react";

export default function SettingsPage() {
    const { user, updateProfile, updateAvatar, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");

    const handleSave = () => {
        updateProfile(name);
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Customize your experience.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full text-primary">
                            <User size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Profile</h3>
                            <p className="text-sm text-muted-foreground">Manage your account info</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Display Name */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Display Name</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={isEditing ? name : user?.name}
                                    disabled={!isEditing}
                                    onChange={(e) => setName(e.target.value)}
                                    className="flex-1 px-4 py-2 rounded-xl border border-input bg-muted/50 text-foreground focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-70 transition-all"
                                />
                                {isEditing ? (
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Avatar Selection */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">Avatar</label>
                            <div className="flex gap-4 flex-wrap">
                                {[
                                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`, // Default
                                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
                                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Gizmo",
                                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bandit",
                                    "https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow"
                                ].map((url, index) => (
                                    <button
                                        key={index}
                                        onClick={() => updateAvatar(url)}
                                        className={`w-16 h-16 rounded-full border-2 overflow-hidden transition-all relative group ${user?.avatar === url ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-transparent hover:border-border hover:scale-105'}`}
                                        title="Select Avatar"
                                    >
                                        <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                                        {user?.avatar === url && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-full">
                                                <div className="w-2 h-2 bg-primary rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                            <input
                                type="email"
                                value={user?.email}
                                disabled
                                className="w-full px-4 py-2 rounded-xl border border-input bg-muted/50 text-muted-foreground cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="bg-card p-6 rounded-2xl shadow-sm border border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-foreground">Appearance</h3>
                            <p className="text-sm text-muted-foreground">Switch between light and dark mode</p>
                        </div>
                        <ModeToggle />
                    </div>
                </div>

                {/* Account Actions */}
                <div className="bg-destructive/10 p-6 rounded-2xl border border-destructive/20">
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-4">Danger Zone</h3>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 bg-card text-destructive border border-destructive/20 rounded-xl font-medium hover:bg-destructive/10 transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
