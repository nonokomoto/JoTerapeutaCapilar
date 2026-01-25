"use client";

import { ReactionCount, REACTION_EMOJI, REACTION_LABEL } from "@/types/database";

interface ReactionSummaryProps {
    reactions: ReactionCount[];
}

/**
 * Read-only display of reactions (for admin view)
 * Shows aggregated counts without interaction
 */
export function ReactionSummary({ reactions }: ReactionSummaryProps) {
    if (reactions.length === 0) {
        return null;
    }

    return (
        <div className="reaction-summary">
            {reactions.map(({ reaction, count }) => (
                <div
                    key={reaction}
                    className="reaction-summary-item"
                    title={REACTION_LABEL[reaction]}
                >
                    <span className="reaction-emoji">{REACTION_EMOJI[reaction]}</span>
                    <span className="reaction-count">{count}</span>
                </div>
            ))}
        </div>
    );
}
