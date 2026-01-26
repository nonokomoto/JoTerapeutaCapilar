"use client";

import { useEffect, useState } from "react";

interface UnreadBannerProps {
    unreadCount: number;
    firstUnreadId?: string;
}

function BellIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
        </svg>
    );
}

export function UnreadBanner({ unreadCount, firstUnreadId }: UnreadBannerProps) {
    const [isVisible, setIsVisible] = useState(true);

    // Hide banner if no unread
    useEffect(() => {
        if (unreadCount === 0) {
            setIsVisible(false);
        }
    }, [unreadCount]);

    if (!isVisible || unreadCount === 0) {
        return null;
    }

    const scrollToUnread = () => {
        if (firstUnreadId) {
            const element = document.getElementById(`update-${firstUnreadId}`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
                // Trigger click to expand the card
                const button = element.querySelector("button");
                if (button) {
                    setTimeout(() => button.click(), 500);
                }
            }
        }
    };

    return (
        <div className="unread-banner">
            <div className="unread-banner-icon">
                <BellIcon />
            </div>
            <div className="unread-banner-content">
                <p className="unread-banner-title">
                    {unreadCount} {unreadCount === 1 ? "nova atualização" : "novas atualizações"}
                </p>
                <p className="unread-banner-subtitle">
                    A Jo deixou {unreadCount === 1 ? "uma nova nota" : "novas notas"} para si
                </p>
            </div>
            <button
                type="button"
                className="unread-banner-btn"
                onClick={scrollToUnread}
            >
                Ver {unreadCount === 1 ? "nova" : "novas"}
                <ChevronRightIcon />
            </button>
        </div>
    );
}
