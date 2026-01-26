import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminStats, RecentClientsList } from "@/components/admin/DashboardContent";

// Icons for quick actions
function AddUserIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
    );
}

function AddPostIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

// Calendar icon for date display
function CalendarIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

// Get current time greeting
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
}

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Get admin profile name
    const { data: { user } } = await supabase.auth.getUser();
    const adminClient = await import("@/lib/supabase/admin").then(m => m.createAdminClient());
    const { data: profile } = await adminClient
        .from("profiles")
        .select("name")
        .eq("id", user?.id)
        .single();

    const firstName = profile?.name?.split(" ")[0] || "Jo";
    const greeting = getGreeting();

    // Today's date range
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // Get initial stats for SSR (hydration)
    const [clientsResult, updatesResult, postsResult, todayAppointmentsResult] = await Promise.all([
        adminClient.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
        adminClient.from("client_updates").select("*", { count: "exact", head: true }),
        adminClient.from("posts").select("*", { count: "exact", head: true }).eq("published", true),
        adminClient.from("appointments")
            .select("id, appointment_date, appointment_type, client_id, profiles!appointments_client_id_fkey(name, avatar_url)")
            .gte("appointment_date", startOfToday.toISOString())
            .lte("appointment_date", endOfToday.toISOString())
            .eq("completed", false)
            .order("appointment_date", { ascending: true }),
    ]);

    const initialStats = {
        clientsCount: clientsResult.count || 0,
        postsCount: postsResult.count || 0,
        updatesCount: updatesResult.count || 0,
    };

    const todayAppointments = todayAppointmentsResult.data || [];

    // Get initial recent clients for SSR
    const { data: recentClients } = await adminClient
        .from("profiles")
        .select(`
            id, 
            name, 
            avatar_url,
            created_at,
            client_updates!client_updates_client_id_fkey (
                created_at
            )
        `)
        .eq("role", "client")
        .order("created_at", { ascending: false })
        .limit(5);

    const initialClients = recentClients?.map((client) => ({
        id: client.id,
        name: client.name,
        avatar_url: client.avatar_url,
        lastUpdate: client.client_updates?.[0]?.created_at || null,
    })) || [];

    // Format today's date
    const today = new Date().toLocaleDateString("pt-PT", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    return (
        <div className="admin-container">
            {/* Welcome Banner */}
            <div className="welcome-banner">
                <div>
                    <p className="welcome-banner-greeting">{greeting}</p>
                    <h1 className="welcome-banner-title">
                        Bem-vinda, {firstName}!
                    </h1>
                    <p className="welcome-banner-subtitle">
                        Gerencie sua clínica de forma simples
                    </p>
                </div>
                <div className="welcome-banner-date">
                    <CalendarIcon />
                    <span>{today}</span>
                </div>
            </div>

            {/* Stats Section - Now reactive with TanStack Query */}
            <AdminStats initialStats={initialStats} />

            {/* Today's Appointments */}
            {todayAppointments.length > 0 && (
                <section className="admin-section admin-today-section">
                    <div className="admin-section-header-row">
                        <h2 className="section-label">
                            <span className="admin-today-badge">Hoje</span>
                            Marcações
                        </h2>
                    </div>
                    <div className="admin-today-list">
                        {todayAppointments.map((apt: any) => (
                            <Link
                                key={apt.id}
                                href={`/admin/clientes/${apt.client_id}`}
                                className="admin-today-item"
                            >
                                <div className="admin-today-time">
                                    {new Date(apt.appointment_date).toLocaleTimeString("pt-PT", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </div>
                                <div className="admin-today-info">
                                    <span className="admin-today-name">{apt.profiles?.name}</span>
                                    {apt.appointment_type && (
                                        <span className="admin-today-type">{apt.appointment_type}</span>
                                    )}
                                </div>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="admin-today-arrow">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Content Grid - Two columns on large screens */}
            <div className="admin-content-grid lg:!grid-cols-[1.5fr_1fr]">
                {/* Recent Clients Section - Now reactive */}
                <section className="admin-section">
                    <div className="admin-section-header-row">
                        <h2 className="section-label">
                            Clientes Recentes
                        </h2>
                        <Link
                            href="/admin/clientes"
                            className="admin-view-all"
                        >
                            Ver todos
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </Link>
                    </div>

                    <div className="admin-card-container">
                        <RecentClientsList initialClients={initialClients} />
                    </div>
                </section>

                {/* Quick Actions Section */}
                <section className="admin-section">
                    <h2 className="section-label">
                        Ações Rápidas
                    </h2>

                    <div className="admin-quick-actions-list">
                        <Link
                            href="/admin/clientes/novo"
                            className="admin-quick-action-item hover:bg-gray-50"
                        >
                            <div className="admin-quick-action-icon-box text-rose-gold">
                                <AddUserIcon />
                            </div>
                            <div className="admin-quick-action-info">
                                <span className="admin-quick-action-label">
                                    Novo Cliente
                                </span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </Link>

                        <Link
                            href="/admin/posts/novo"
                            className="admin-quick-action-item hover:bg-gray-50"
                        >
                            <div className="admin-quick-action-icon-box text-sage">
                                <AddPostIcon />
                            </div>
                            <div className="admin-quick-action-info">
                                <span className="admin-quick-action-label">
                                    Nova Publicação
                                </span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </Link>

                        <Link
                            href="/admin/clientes"
                            className="admin-quick-action-item hover:bg-gray-50"
                        >
                            <div className="admin-quick-action-icon-box text-terracotta">
                                <UsersIcon />
                            </div>
                            <div className="admin-quick-action-info">
                                <span className="admin-quick-action-label">
                                    Ver Clientes
                                </span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
