"use client";

import { Icon } from "@/components/ui";

interface ClientJourneyStatsProps {
    memberSince: string;
    totalUpdates: number;
    totalVisits: number;
}

function getTimeSince(date: string): string {
    const now = new Date();
    const memberDate = new Date(date);
    const diffTime = now.getTime() - memberDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Handle today
    if (diffDays === 0) {
        return "hoje";
    }

    if (diffDays < 30) {
        return `${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
    }

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
        return `${diffMonths} ${diffMonths === 1 ? 'mês' : 'meses'}`;
    }

    const diffYears = Math.floor(diffMonths / 12);
    const remainingMonths = diffMonths % 12;

    if (remainingMonths === 0) {
        return `${diffYears} ano${diffYears !== 1 ? 's' : ''}`;
    }

    return `${diffYears} ano${diffYears !== 1 ? 's' : ''} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
}

export function ClientJourneyStats({ memberSince, totalUpdates, totalVisits }: ClientJourneyStatsProps) {
    const timeSince = getTimeSince(memberSince);

    return (
        <div className="client-journey-stats">
            <div className="journey-stat-card">
                <div className="journey-stat-icon">
                    <Icon name="calendar" size={20} />
                </div>
                <div className="journey-stat-content">
                    <span className="journey-stat-value">{timeSince}</span>
                    <span className="journey-stat-label">como cliente</span>
                </div>
            </div>

            <div className="journey-stat-card">
                <div className="journey-stat-icon">
                    <Icon name="file-text" size={20} />
                </div>
                <div className="journey-stat-content">
                    <span className="journey-stat-value">{totalUpdates}</span>
                    <span className="journey-stat-label">{totalUpdates === 1 ? 'atualização' : 'atualizações'}</span>
                </div>
            </div>

            <div className="journey-stat-card">
                <div className="journey-stat-icon">
                    <Icon name="check" size={20} />
                </div>
                <div className="journey-stat-content">
                    <span className="journey-stat-value">{totalVisits}</span>
                    <span className="journey-stat-label">{totalVisits === 1 ? 'visita' : 'visitas'}</span>
                </div>
            </div>
        </div>
    );
}
