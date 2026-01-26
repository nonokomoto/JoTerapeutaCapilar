"use client";

import { useEffect, useRef, useState } from "react";

interface MonthNavigationProps {
    months: string[]; // Array of month labels like "Janeiro 2026"
}

function ChevronLeftIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
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

export function MonthNavigation({ months }: MonthNavigationProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [activeMonth, setActiveMonth] = useState<string | null>(months[0] || null);

    // Check scroll position
    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener("scroll", checkScroll);
            return () => scrollElement.removeEventListener("scroll", checkScroll);
        }
    }, [months]);

    // Track which month section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const monthLabel = entry.target.getAttribute("data-month");
                        if (monthLabel) {
                            setActiveMonth(monthLabel);
                        }
                    }
                });
            },
            { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
        );

        months.forEach((month) => {
            const element = document.getElementById(`month-${month.replace(/\s+/g, "-")}`);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [months]);

    const scrollTo = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 150;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    const scrollToMonth = (monthLabel: string) => {
        const element = document.getElementById(`month-${monthLabel.replace(/\s+/g, "-")}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveMonth(monthLabel);
        }
    };

    if (months.length <= 1) {
        return null;
    }

    return (
        <div className="month-navigation">
            {canScrollLeft && (
                <button
                    type="button"
                    className="month-nav-arrow month-nav-arrow-left"
                    onClick={() => scrollTo("left")}
                    aria-label="Scroll left"
                >
                    <ChevronLeftIcon />
                </button>
            )}

            <div className="month-nav-scroll" ref={scrollRef}>
                {months.map((month) => {
                    // Shorten month name for display
                    const shortMonth = month.replace(
                        /^(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro)/,
                        (match) => match.substring(0, 3)
                    );

                    return (
                        <button
                            key={month}
                            type="button"
                            className={`month-nav-item ${activeMonth === month ? 'active' : ''}`}
                            onClick={() => scrollToMonth(month)}
                        >
                            {shortMonth}
                        </button>
                    );
                })}
            </div>

            {canScrollRight && (
                <button
                    type="button"
                    className="month-nav-arrow month-nav-arrow-right"
                    onClick={() => scrollTo("right")}
                    aria-label="Scroll right"
                >
                    <ChevronRightIcon />
                </button>
            )}
        </div>
    );
}
