import { createClient } from "@/lib/supabase/server";
import { TreatmentsSection, NewsSection, NextAppointmentWidget, ClientJourneyStats } from "@/components/cliente";

// Get time-based greeting
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
}

// Icons
function SparklesIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
            <path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z" />
            <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" />
        </svg>
    );
}

// Calculate months as client
function calculateMonthsAsClient(createdAt: string): number {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMonths = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
    return Math.max(0, diffMonths);
}

export default async function ClienteDashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Use admin client for profile to bypass RLS
    const adminClient = await import("@/lib/supabase/admin").then(m => m.createAdminClient());

    const { data: profile } = await adminClient
        .from("profiles")
        .select("name, avatar_url, next_appointment_date, created_at")
        .eq("id", user?.id)
        .single();

    // Get initial updates for SSR
    const { data: recentUpdates, count: updatesCount } = await supabase
        .from("client_updates")
        .select("id, title, created_at, client_read_at", { count: "exact" })
        .eq("client_id", user?.id)
        // Filter out automated appointment updates
        .not("title", "ilike", "%Agendamento%")
        .not("title", "ilike", "%Consulta Realizada%")
        .not("title", "ilike", "%Marcação%")
        .not("title", "ilike", "%Visita realizada%")
        .order("created_at", { ascending: false })
        .limit(3);

    // Count unread updates
    const { count: unreadCount } = await supabase
        .from("client_updates")
        .select("id", { count: "exact", head: true })
        .eq("client_id", user?.id)
        .is("client_read_at", null)
        .not("title", "ilike", "%Agendamento%")
        .not("title", "ilike", "%Consulta Realizada%")
        .not("title", "ilike", "%Marcação%")
        .not("title", "ilike", "%Visita realizada%");

    // Count total visits (completed appointments)
    const { count: totalVisits } = await supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("client_id", user?.id)
        .eq("completed", true);

    // Get initial posts for SSR
    const { data: recentPosts } = await supabase
        .from("posts")
        .select("id, title, created_at, content, image_url")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);

    const firstName = profile?.name?.split(" ")[0] || "Cliente";
    const greeting = getGreeting();
    const initials = profile?.name?.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() || "CL";
    const monthsAsClient = profile?.created_at ? calculateMonthsAsClient(profile.created_at) : 0;

    return (
        <div className="cliente-dash-container">
            {/* Hero Section v2 - Desktop Optimized */}
            <div className="cliente-hero-glass cliente-hero-glass-desktop">
                <div className="cliente-glass-card">
                    <div className="relative flex-shrink-0">
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.name}
                                className="cliente-avatar-premium"
                            />
                        ) : (
                            <div className="cliente-avatar-premium cliente-avatar-initials">
                                {initials}
                            </div>
                        )}
                        <div className="absolute bottom-1 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border-2 border-white lg:bottom-0" style={{ color: 'var(--color-rose-gold)' }}>
                            <SparklesIcon />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <p className="cliente-hero-greeting">{greeting},</p>
                        <h1 className="cliente-hero-name">{firstName}!</h1>
                    </div>
                </div>
            </div>

            <div className="cliente-dashboard-content">
                {/* Next Appointment Widget */}
                <NextAppointmentWidget nextAppointmentDate={profile?.next_appointment_date || null} />

                {/* Client Journey Stats */}
                <ClientJourneyStats
                    memberSince={profile?.created_at || new Date().toISOString()}
                    totalUpdates={updatesCount || 0}
                    totalVisits={totalVisits || 0}
                />

                {/* Treatments Section - Now reactive with TanStack Query */}
                <TreatmentsSection
                    initialUpdates={recentUpdates || []}
                    initialCount={updatesCount || 0}
                />

                {/* News & Tips Section - Now reactive with TanStack Query */}
                <NewsSection initialPosts={recentPosts || []} />
            </div>
        </div>
    );
}
