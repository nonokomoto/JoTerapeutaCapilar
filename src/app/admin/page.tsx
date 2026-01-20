import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, Button, StatCard, Avatar } from "@/components/ui";

// Icons for stats
function UsersIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function TreatmentIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}

function PostsIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

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

// Get current time greeting
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
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

    // Get stats
    const { count: clientsCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "client");

    const { count: updatesCount } = await supabase
        .from("client_updates")
        .select("*", { count: "exact", head: true });

    const { count: postsCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("published", true);

    // Get recent clients with last update (using adminClient to bypass RLS)
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

            {/* Stats Section - Clean cards */}
            <div className="admin-stats-grid">
                <StatCard
                    label="Total Clientes"
                    value={clientsCount || 0}
                    icon={<UsersIcon />}
                    accentColor="rose"
                />
                <StatCard
                    label="Em tratamento"
                    value={clientsCount || 0}
                    icon={<TreatmentIcon />}
                    accentColor="sage"
                />
                <StatCard
                    label="Posts publicados"
                    value={postsCount || 0}
                    icon={<PostsIcon />}
                    accentColor="terracotta"
                />
            </div>

            {/* Content Grid - Two columns on large screens */}
            <div className="admin-content-grid lg:!grid-cols-[1.5fr_1fr]">
                {/* Recent Clients Section */}
                <section className="admin-section">
                    <div className="admin-section-header-row">
                        <h2 className="section-header">
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
                        {recentClients && recentClients.length > 0 ? (
                            <div>
                                {recentClients.map((client, index) => {
                                    const lastUpdate = client.client_updates?.[0]?.created_at;
                                    return (
                                        <Link
                                            key={client.id}
                                            href={`/admin/clientes/${client.id}`}
                                            className="admin-client-item hover:bg-gray-50"
                                        >
                                            <div className="admin-client-info">
                                                <Avatar
                                                    src={client.avatar_url}
                                                    name={client.name}
                                                    size="md"
                                                />
                                                <div className="admin-client-text-stack">
                                                    <span className="admin-client-name">
                                                        {client.name}
                                                    </span>
                                                    <span className="admin-client-date">
                                                        {lastUpdate
                                                            ? `Última atualização: ${new Date(lastUpdate).toLocaleDateString("pt-PT", {
                                                                day: "numeric",
                                                                month: "short"
                                                            })}`
                                                            : "Sem atualizações"
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8ABA0" strokeWidth="2">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="admin-empty-state">
                                <div className="admin-empty-icon-box">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <h3 className="admin-empty-title">
                                    Ainda sem clientes
                                </h3>
                                <p className="admin-empty-desc">
                                    Adicione o seu primeiro cliente
                                </p>
                                <Link
                                    href="/admin/clientes/novo"
                                    className="admin-btn-inline-add"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="12" y1="5" x2="12" y2="19" />
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                    </svg>
                                    Adicionar
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Quick Actions Section */}
                <section className="admin-section">
                    <h2 className="section-header">
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
                                    Criar Post
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
