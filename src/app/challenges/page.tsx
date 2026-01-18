"use client";

import { BadgesList } from "@/components/gamification/BadgesList";

export default function ChallengesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-foreground">Challenges & Badges</h1>
                <p className="text-muted-foreground">Unlock achievements by staying consistent!</p>
            </div>

            <BadgesList />
        </div>
    );
}
