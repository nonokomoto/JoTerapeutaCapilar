import { createClient } from "@/lib/supabase/server";
import {
    NextAppointmentCard,
    UpcomingAppointmentsList,
    ContactCard,
    AppointmentHistory
} from "@/components/cliente";

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

export default async function ClienteMarcacoes() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: appointments } = await supabase
        .from("appointments")
        .select("id, appointment_date, appointment_type, notes, completed, created_at, updated_at, client_id")
        .eq("client_id", user?.id)
        .order("appointment_date", { ascending: true });

    // Separate upcoming and past appointments
    const now = new Date();

    const upcoming = appointments?.filter(
        apt => new Date(apt.appointment_date) >= now && !apt.completed
    ) || [];

    const past = appointments?.filter(
        apt => new Date(apt.appointment_date) < now || apt.completed
    ) || [];

    // Sort upcoming by date ascending (nearest first)
    upcoming.sort((a, b) =>
        new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
    );

    // Sort past by date descending (most recent first)
    past.sort((a, b) =>
        new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime()
    );

    // Get the next appointment (first upcoming)
    const nextAppointment = upcoming[0] || null;

    // Get other upcoming appointments (excluding the next one)
    const otherUpcoming = upcoming.slice(1);

    return (
        <div className="cliente-dashboard-content cliente-page-container">
            {/* Page Header */}
            <div className="cliente-page-header">
                <h1 className="cliente-page-title">As minhas marcações</h1>
                <p className="cliente-page-subtitle">Consulte as suas consultas e tratamentos</p>
            </div>

            {/* Next Appointment - Highlighted */}
            {nextAppointment && (
                <NextAppointmentCard appointment={nextAppointment} />
            )}

            {/* Contact Card - Show when there are appointments */}
            {(nextAppointment || past.length > 0) && (
                <ContactCard />
            )}

            {/* Other Upcoming Appointments */}
            {otherUpcoming.length > 0 && (
                <UpcomingAppointmentsList appointments={otherUpcoming} />
            )}

            {/* Past Appointments History */}
            {past.length > 0 && (
                <AppointmentHistory appointments={past} />
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

                    {/* Contact even without appointments */}
                    <div className="mt-6">
                        <ContactCard />
                    </div>
                </div>
            )}
        </div>
    );
}
