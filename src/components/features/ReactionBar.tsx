"use client";

import { useState, useTransition } from "react";
import { toggleReaction } from "@/app/cliente/actions";
import { ReactionType, REACTION_EMOJI, REACTION_LABEL, ReactionCount } from "@/types/database";

interface ReactionBarProps {
    updateId: string;
    reactions: ReactionCount[];
}

const ALL_REACTIONS: ReactionType[] = ['like', 'celebrate', 'helpful', 'question'];

export function ReactionBar({ updateId, reactions }: ReactionBarProps) {
    const [isPending, startTransition] = useTransition();
    const [optimisticReactions, setOptimisticReactions] = useState<ReactionCount[]>(reactions);

    const handleReaction = (reaction: ReactionType) => {
        // Optimistic update
        setOptimisticReactions(prev => {
            const existing = prev.find(r => r.reaction === reaction);

            if (existing?.user_reacted) {
                // Remove reaction
                return prev.map(r =>
                    r.reaction === reaction
                        ? { ...r, count: Math.max(0, r.count - 1), user_reacted: false }
                        : r
                ).filter(r => r.count > 0);
            } else {
                // Add reaction
                if (existing) {
                    return prev.map(r =>
                        r.reaction === reaction
                            ? { ...r, count: r.count + 1, user_reacted: true }
                            : r
                    );
                } else {
                    return [...prev, { reaction, count: 1, user_reacted: true }];
                }
            }
        });

        // Server action
        startTransition(async () => {
            await toggleReaction(updateId, reaction);
        });
    };

    return (
        <div className="reaction-bar">
            {ALL_REACTIONS.map(reaction => {
                const reactionData = optimisticReactions.find(r => r.reaction === reaction);
                const count = reactionData?.count || 0;
                const isActive = reactionData?.user_reacted || false;

                return (
                    <button
                        key={reaction}
                        type="button"
                        onClick={() => handleReaction(reaction)}
                        disabled={isPending}
                        className={`reaction-button ${isActive ? 'active' : ''}`}
                        title={REACTION_LABEL[reaction]}
                        aria-label={`${REACTION_LABEL[reaction]} (${count})`}
                    >
                        <span className="reaction-emoji">{REACTION_EMOJI[reaction]}</span>
                        {count > 0 && (
                            <span className="reaction-count">{count}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
