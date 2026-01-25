"use client";

import { Icon } from "@/components/ui";

interface NextAppointmentWidgetProps {
    nextAppointmentDate: string | null;
}

function getDaysUntil(date: string): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);
    const diffTime = appointmentDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function formatRelativeTime(days: number): string {
    if (days === 0) return "Hoje";
    if (days === 1) return "Amanhã";
    if (days < 7) return `Daqui a ${days} dias`;
    if (days < 14) return "Daqui a 1 semana";
    if (days < 30) return `Daqui a ${Math.floor(days / 7)} semanas`;
    return `Daqui a ${Math.floor(days / 30)} mês${Math.floor(days / 30) > 1 ? 'es' : ''}`;
}

export function NextAppointmentWidget({ nextAppointmentDate }: NextAppointmentWidgetProps) {
    // Don't render if no appointment or date is in the past
    if (!nextAppointmentDate) return null;

    const daysUntil = getDaysUntil(nextAppointmentDate);
    if (daysUntil < 0) return null;

    const appointmentDate = new Date(nextAppointmentDate);
    const formattedDate = appointmentDate.toLocaleDateString("pt-PT", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });
    const formattedTime = appointmentDate.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Capitalize first letter
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    const isToday = daysUntil === 0;
    const isSoon = daysUntil <= 3;

    return (
        <div className={`next-appointment-widget ${isToday ? 'is-today' : ''} ${isSoon ? 'is-soon' : ''}`}>
            <div className="next-appointment-icon">
                <Icon name="calendar" size={24} />
            </div>
            <div className="next-appointment-content">
                <span className="next-appointment-label">Próxima Consulta</span>
                <span className="next-appointment-date">{capitalizedDate}</span>
                <span className="next-appointment-time">às {formattedTime}</span>
            </div>
            <div className="next-appointment-badge">
                {formatRelativeTime(daysUntil)}
            </div>
        </div>
    );
}
