"use client";

import { Icon } from "@/components/ui";
import { useClientStats, type ClientStats } from "@/lib/queries/admin";

interface ClientStatsBarProps {
    initialData?: ClientStats;
}

export function ClientStatsBar({ initialData }: ClientStatsBarProps) {
    const { data: stats, isLoading } = useClientStats(initialData);

    if (isLoading) {
        return (
            <div className="client-stats-bar">
                <span className="ds-text-muted">A carregar...</span>
            </div>
        );
    }

    const total = stats?.total || 0;
    const comMarcacao = stats?.comMarcacao || 0;
    const semMarcacao = stats?.semMarcacao || 0;

    return (
        <div className="client-stats-bar">
            {/* Total de clientes */}
            <div className="client-stat-item">
                <Icon name="users" size={16} />
                <span className="client-stat-value">{total}</span>
                <span className="client-stat-label">{total !== 1 ? "clientes" : "cliente"}</span>
            </div>

            <span className="client-stat-divider">•</span>

            {/* Com marcação */}
            <div className={`client-stat-item ${comMarcacao > 0 ? "highlight-upcoming" : ""}`}>
                <Icon name="calendar" size={16} />
                <span className="client-stat-value">{comMarcacao}</span>
                <span className="client-stat-label">com marcação</span>
            </div>

            <span className="client-stat-divider">•</span>

            {/* Sem marcação */}
            <div className={`client-stat-item ${semMarcacao > 0 ? "highlight-inactive" : ""}`}>
                <Icon name="calendar-x" size={16} />
                <span className="client-stat-value">{semMarcacao}</span>
                <span className="client-stat-label">sem marcação</span>
            </div>
        </div>
    );
}
