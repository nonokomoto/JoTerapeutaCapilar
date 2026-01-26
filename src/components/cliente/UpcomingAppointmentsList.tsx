"use client";

import type { Appointment } from "@/types/database";

// Icons
function CalendarIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

interface UpcomingAppointmentsListProps {
    appointments: Appointment[];
}

export function UpcomingAppointmentsList({ appointments }: UpcomingAppointmentsListProps) {
    if (appointments.length === 0) {
        return null;
    }

    return (
        <div className="upcoming-apt-list">
            <h3 className="upcoming-apt-title">
                Outras marcações agendadas ({appointments.length})
            </h3>

            <div className="upcoming-apt-items">
                {appointments.map((appointment) => {
                    const date = new Date(appointment.appointment_date);

                    const formattedDate = date.toLocaleDateString("pt-PT", {
                        day: "numeric",
                        month: "short",
                    });

                    const formattedTime = date.toLocaleTimeString("pt-PT", {
                        hour: "2-digit",
                        minute: "2-digit",
                    });

                    return (
                        <div key={appointment.id} className="upcoming-apt-item">
                            <div className="upcoming-apt-icon">
                                <CalendarIcon />
                            </div>
                            <div className="upcoming-apt-info">
                                <span className="upcoming-apt-date">
                                    {formattedDate} · {formattedTime}
                                </span>
                                <span className="upcoming-apt-type">
                                    {appointment.appointment_type || "Consulta"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
