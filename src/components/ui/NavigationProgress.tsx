"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Navigation progress bar that shows during page transitions.
 * Similar to YouTube/GitHub's top loading bar.
 */
export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);
    const [progress, setProgress] = useState(0);

    // Reset progress when navigation completes (pathname/searchParams change)
    useEffect(() => {
        setIsNavigating(false);
        setProgress(0);
    }, [pathname, searchParams]);

    // Listen for navigation start via link clicks
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (!href) return;

            // Only track internal navigation
            if (href.startsWith("/") && !href.startsWith("//")) {
                // Don't show for same-page navigation
                if (href === pathname) return;

                setIsNavigating(true);
                setProgress(20);
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [pathname]);

    // Animate progress while navigating
    useEffect(() => {
        if (!isNavigating) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                // Slow down as we approach 90%
                if (prev >= 90) return prev;
                if (prev >= 70) return prev + 1;
                if (prev >= 50) return prev + 2;
                return prev + 5;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isNavigating]);

    if (!isNavigating && progress === 0) return null;

    return (
        <div className="navigation-progress-container">
            <div
                className="navigation-progress-bar"
                style={{
                    width: `${progress}%`,
                    opacity: isNavigating ? 1 : 0,
                }}
            />
        </div>
    );
}
