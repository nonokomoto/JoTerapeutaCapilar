"use client";

import type { Appointment } from "@/types/database";

// Icons
function CalendarIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

function NoteIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    );
}

interface NextAppointmentCardProps {
    appointment: Appointment;
}

function calculateDaysUntil(dateStr: string): number {
    const appointmentDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);
    const diffTime = appointmentDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getCountdownText(days: number): string {
    if (days === 0) return "Hoje";
    if (days === 1) return "Amanhã";
    if (days < 7) return `Faltam ${days} dias`;
    if (days < 14) return "Falta 1 semana";
    if (days < 30) return `Faltam ${Math.floor(days / 7)} semanas`;
    return `Falta ${Math.floor(days / 30)} mês`;
}

export function NextAppointmentCard({ appointment }: NextAppointmentCardProps) {
    const date = new Date(appointment.appointment_date);
    const daysUntil = calculateDaysUntil(appointment.appointment_date);
    const isToday = daysUntil === 0;
    const isTomorrow = daysUntil === 1;
    const isSoon = daysUntil <= 3 && daysUntil > 0;

    const formattedDate = date.toLocaleDateString("pt-PT", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    const formattedTime = date.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Capitalize first letter
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return (
        <div className={`next-apt-card ${isToday ? 'is-today' : ''} ${isSoon ? 'is-soon' : ''}`}>
            <div className="next-apt-header">
                <div className="next-apt-icon">
                    <CalendarIcon />
                </div>
                <span className="next-apt-label">Próxima Marcação</span>
            </div>

            <div className="next-apt-body">
                <p className="next-apt-date">{capitalizedDate}</p>
                <p className="next-apt-time">às {formattedTime}</p>

                {appointment.appointment_type && (
                    <p className="next-apt-type">{appointment.appointment_type}</p>
                )}

                <div className={`next-apt-countdown ${isToday ? 'today' : ''} ${isTomorrow ? 'tomorrow' : ''}`}>
                    <ClockIcon />
                    <span>{getCountdownText(daysUntil)}</span>
                </div>

                {appointment.notes && (
                    <div className="next-apt-notes">
                        <NoteIcon />
                        <span>{appointment.notes}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
