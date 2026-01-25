"use client";

import { useEffect, useRef } from "react";
import { markUpdateAsRead } from "@/app/cliente/actions";

interface UpdateReadTrackerProps {
    updateId: string;
    isUnread: boolean;
}

/**
 * Componente que marca update como lida quando scroll passa 50% do card
 * Usa IntersectionObserver para eficiência
 */
export function UpdateReadTracker({ updateId, isUnread }: UpdateReadTrackerProps) {
    const hasMarked = useRef(false);

    useEffect(() => {
        // Skip if already read or already marked
        if (!isUnread || hasMarked.current) return;

        const element = document.getElementById(`update-${updateId}`);
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Mark as read when 50% of the card is visible
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        if (!hasMarked.current) {
                            hasMarked.current = true;

                            // Debounce: wait 500ms before marking as read
                            setTimeout(() => {
                                markUpdateAsRead(updateId);
                            }, 500);

                            // Disconnect observer after marking
                            observer.disconnect();
                        }
                    }
                });
            },
            {
                threshold: [0.5], // Trigger at 50% visibility
                rootMargin: "0px"
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [updateId, isUnread]);

    return null; // This component doesn't render anything
}
