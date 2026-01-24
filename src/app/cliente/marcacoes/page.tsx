import { createClient } from "@/lib/supabase/server";

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

function CheckIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

// Type labels in PT-PT


export default async function ClienteMarcacoes() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: appointments } = await supabase
        .from("appointments")
        .select("id, appointment_date, appointment_type, notes, completed")
        .eq("client_id", user?.id)
        .order("appointment_date", { ascending: false });

    // Separate upcoming and past appointments
    const now = new Date();
    const upcoming = appointments?.filter(
        apt => new Date(apt.appointment_date) >= now && !apt.completed
    ) || [];
    const past = appointments?.filter(
        apt => new Date(apt.appointment_date) < now || apt.completed
    ) || [];

    // Check if appointment is within next 7 days
    const isWithinSevenDays = (dateStr: string) => {
        const date = new Date(dateStr);
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return date >= now && date <= sevenDaysFromNow;
    };

    return (
        <div className="cliente-dashboard-content cliente-page-container">
            {/* Page Header */}
            <div className="cliente-page-header">
                <h1 className="cliente-page-title">As minhas marcações</h1>
                <p className="cliente-page-subtitle">Consulte as suas consultas e tratamentos</p>
            </div>

            {/* Upcoming Appointments */}
            {upcoming.length > 0 && (
                <section className="cliente-section">
                    <h2 className="cliente-section-title">Próximas marcações</h2>
                    <div className="cliente-updates-list">
                        {upcoming.map((appointment, index) => {
                            const date = new Date(appointment.appointment_date);
                            const isSoon = isWithinSevenDays(appointment.appointment_date);

                            return (
                                <article
                                    key={appointment.id}
                                    className={`cliente-update-card ${isSoon ? "cliente-appointment-soon" : ""}`}
                                    style={{ animationDelay: `${index * 80}ms` }}
                                >
                                    <div className="cliente-update-header">
                                        <div className={`cliente-update-icon ${isSoon ? "cliente-icon-success" : ""}`}>
                                            <CalendarIcon />
                                        </div>
                                        <div className="cliente-update-meta">
                                            <h3 className="cliente-update-title">
                                                {appointment.appointment_type || "Consulta"}
                                            </h3>
                                            <p className="cliente-update-date">
                                                {date.toLocaleDateString("pt-PT", {
                                                    weekday: "long",
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                                {" às "}
                                                {date.toLocaleTimeString("pt-PT", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="cliente-appointment-status">
                                        <span className="cliente-status-badge cliente-status-pending">
                                            <ClockIcon />
                                            Agendada
                                        </span>
                                        {isSoon && (
                                            <span className="cliente-status-badge cliente-status-soon">
                                                Em breve
                                            </span>
                                        )}
                                    </div>

                                    {appointment.notes && (
                                        <div className="cliente-update-content cliente-appointment-notes">
                                            {appointment.notes}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Past Appointments */}
            {past.length > 0 && (
                <section className="cliente-section">
                    <h2 className="cliente-section-title">Histórico</h2>
                    <div className="cliente-updates-list">
                        {past.map((appointment, index) => {
                            const date = new Date(appointment.appointment_date);

                            return (
                                <article
                                    key={appointment.id}
                                    className="cliente-update-card cliente-appointment-past"
                                    style={{ animationDelay: `${index * 80}ms` }}
                                >
                                    <div className="cliente-update-header">
                                        <div className="cliente-update-icon cliente-icon-muted">
                                            <CalendarIcon />
                                        </div>
                                        <div className="cliente-update-meta">
                                            <h3 className="cliente-update-title">
                                                {appointment.appointment_type || "Consulta"}
                                            </h3>
                                            <p className="cliente-update-date">
                                                {date.toLocaleDateString("pt-PT", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="cliente-appointment-status">
                                        {appointment.completed ? (
                                            <span className="cliente-status-badge cliente-status-completed">
                                                <CheckIcon />
                                                Realizada
                                            </span>
                                        ) : (
                                            <span className="cliente-status-badge cliente-status-missed">
                                                Não realizada
                                            </span>
                                        )}
                                    </div>

                                    {appointment.notes && (
                                        <div className="cliente-update-content cliente-appointment-notes">
                                            {appointment.notes}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Empty State */}
            {(!appointments || appointments.length === 0) && (
                <div className="cliente-empty-state">
                    <div className="cliente-empty-icon">
                        <CalendarIcon />
                    </div>
                    <h3 className="cliente-empty-title">Sem marcações</h3>
                    <p className="cliente-empty-text">
                        Ainda não tem marcações registadas
                    </p>
                </div>
            )}
        </div>
    );
}
