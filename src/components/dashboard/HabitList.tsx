"use client";

import { useHabits } from "@/lib/HabitContext";
import { Check, Activity, GripVertical, ChevronDown, ChevronUp, Save, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import confetti from "canvas-confetti";
import { useState, useEffect } from "react";

export function HabitList() {
    const { habits, toggleHabit, getHabitStatus, reorderHabits, addNote } = useHabits();
    // Initialize with a safe default, then update on client
    const [today, setToday] = useState(format(new Date(), "yyyy-MM-dd"));

    useEffect(() => {
        setToday(format(new Date(), "yyyy-MM-dd"));
    }, []);

    // UI State
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [notes, setNotes] = useState<Record<string, string>>({}); // local edit state
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Filter Logic
    const displayHabits = isFocusMode
        ? habits.filter(h => getHabitStatus(h.id, today) !== "completed")
        : habits;

    const handleToggle = (id: string, isCompleted: boolean) => {
        toggleHabit(id, today);
        if (!isCompleted) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
        // Pre-fill note if existing
        const habit = habits.find(h => h.id === id);
        if (habit?.notes[today]) {
            setNotes(prev => ({ ...prev, [id]: habit.notes[today] }));
        }
    };

    const handleSaveNote = (id: string) => {
        if (notes[id] !== undefined) {
            addNote(id, today, notes[id]);
            // Maybe show toast?
        }
    };

    // Drag & Drop Handlers
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        // Optimistic Reorder (visual only unless we commit)
        // Actually, we should commit to context? 
        // Or wait for drop? "Live" reorder is better UX for lists.
        const newHabits = [...habits];
        const draggedItem = newHabits[draggedIndex];
        newHabits.splice(draggedIndex, 1);
        newHabits.splice(index, 0, draggedItem);

        reorderHabits(newHabits);
        setDraggedIndex(index);
    };

    const handleDrop = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="bg-card p-6 rounded-2xl shadow-sm border border-border flex-1 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        Today&apos;s Habits
                        {isFocusMode && <span className="text-xs font-normal text-primary bg-primary/10 px-2 py-0.5 rounded-full">Focus Mode</span>}
                    </h3>
                </div>

                <button
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    className={cn(
                        "p-2 rounded-lg transition-colors",
                        isFocusMode ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                    title="Toggle Focus Mode (Hide Completed)"
                >
                    <Filter size={18} />
                </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto min-h-[300px]">
                {displayHabits.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        {isFocusMode ? <p>All tasks completed! Great job. 🎉</p> : <p>No habits added yet.</p>}
                    </div>
                ) : (
                    displayHabits.map((habit, index) => {
                        const status = getHabitStatus(habit.id, today);
                        const isCompleted = status === "completed";
                        const isExpanded = expandedIds.includes(habit.id);
                        const currentNote = notes[habit.id] ?? (habit.notes[today] || "");

                        return (
                            <motion.div
                                key={habit.id}
                                layout
                                draggable={!isFocusMode} // Disable drag in filtered mode to avoid index confusion
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDrop}
                                className={cn(
                                    "flex flex-col p-4 rounded-xl border transition-all group",
                                    isCompleted ? "bg-muted/50 border-border" : "bg-card border-border hover:border-primary/30",
                                    draggedIndex === index ? "opacity-50 ring-2 ring-primary/20" : ""
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Drag Handle */}
                                    {!isFocusMode && (
                                        <div className="cursor-grab text-muted-foreground/30 hover:text-muted-foreground active:cursor-grabbing">
                                            <GripVertical size={16} />
                                        </div>
                                    )}

                                    {/* Checkbox/Status */}
                                    <div
                                        onClick={() => handleToggle(habit.id, isCompleted)}
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer shrink-0",
                                            isCompleted ? "bg-green-500 text-white" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                        )}
                                    >
                                        {isCompleted ? <Check size={20} /> : <Activity size={20} />}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 cursor-pointer" onClick={() => toggleExpand(habit.id)}>
                                        <div className="flex items-center gap-2">
                                            <h4 className={cn("font-medium select-none", isCompleted ? "text-muted-foreground line-through" : "text-foreground")}>
                                                {habit.title}
                                            </h4>
                                            {habit.difficulty === "hard" && <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded">Hard</span>}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                            <span className={cn("px-2 py-0.5 rounded-full", isCompleted ? "bg-muted" : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400")}>
                                                {habit.category}
                                            </span>
                                            <span>• {habit.streak} day streak</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <button
                                        onClick={() => toggleExpand(habit.id)}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                </div>

                                {/* Expanded Area: Notes */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-4 border-t border-border mt-4 ml-8">
                                                <div className="flex gap-2">
                                                    <textarea
                                                        value={currentNote}
                                                        onChange={(e) => setNotes(prev => ({ ...prev, [habit.id]: e.target.value }))}
                                                        placeholder="How did it go today? (Notes...)"
                                                        className="flex-1 bg-muted/50 rounded-lg p-3 text-sm text-foreground focus:ring-1 focus:ring-primary/20 outline-none resize-none h-20"
                                                    />
                                                    <button
                                                        onClick={() => handleSaveNote(habit.id)}
                                                        className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-lg h-fit self-end transition-colors"
                                                        title="Save Note"
                                                    >
                                                        <Save size={18} />
                                                    </button>
                                                </div>
                                                {habit.notes[today] && (
                                                    <p className="text-[10px] text-muted-foreground mt-1 text-right">Note saved.</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
