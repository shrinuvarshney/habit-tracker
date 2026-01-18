"use client";

import { useState } from "react";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { WeeklyChart } from "@/components/dashboard/WeeklyChart";
import { HabitList } from "@/components/dashboard/HabitList";
import { Modal } from "@/components/ui/Modal";
import { useHabits } from "@/lib/HabitContext";
import { motion } from "framer-motion";
import { AICoach } from "@/components/ai/AICoach";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addHabit } = useHabits();
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitCategory, setNewHabitCategory] = useState("Health");
  const [newHabitDifficulty, setNewHabitDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    addHabit(newHabitTitle, newHabitCategory, newHabitDifficulty);
    setNewHabitTitle("");
    setNewHabitDifficulty("medium");
    setIsModalOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and achieve your goals.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 font-medium transition-all transform hover:scale-105 active:scale-95"
        >
          + New Habit
        </button>
      </div>

      <AICoach />
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <WeeklyChart />
        </div>
        <div className="lg:col-span-1 flex">
          <HabitList />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Habit"
      >
        <form onSubmit={handleAddHabit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Habit Name</label>
            <input
              type="text"
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="e.g. Drink Water"
              className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Category</label>
              <select
                value={newHabitCategory}
                onChange={(e) => setNewHabitCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="Health">Health</option>
                <option value="Mind">Mind</option>
                <option value="Work">Work</option>
                <option value="Social">Social</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Difficulty</label>
              <select
                value={newHabitDifficulty}
                onChange={(e) => setNewHabitDifficulty(e.target.value as "easy" | "medium" | "hard")}
                className="w-full px-4 py-2 rounded-xl border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              >
                <option value="easy">Easy (5 XP)</option>
                <option value="medium">Medium (10 XP)</option>
                <option value="hard">Hard (20 XP)</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
              disabled={!newHabitTitle.trim()}
            >
              Create Habit
            </button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
