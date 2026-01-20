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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
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
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(1, 1fr)', 
                gap: '1.5rem'
            }} className="lg:!grid-cols-[1.5fr_1fr]">
                {/* Recent Clients Section */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Clientes Recentes
                        </h2>
                        <Link 
                            href="/admin/clientes" 
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                color: '#1E3A5F',
                                transition: 'color 0.2s'
                            }}
                        >
                            Ver todos
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </Link>
                    </div>

                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #E5E7EB',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}>
                        {recentClients && recentClients.length > 0 ? (
                            <div>
                                {recentClients.map((client, index) => {
                                    const lastUpdate = client.client_updates?.[0]?.created_at;
                                    return (
                                        <Link
                                            key={client.id}
                                            href={`/admin/clientes/${client.id}`}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '0.875rem 1.25rem',
                                                borderBottom: index < recentClients.length - 1 ? '1px solid #F3F4F6' : 'none',
                                                transition: 'background 0.15s'
                                            }}
                                            className="hover:bg-gray-50"
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                                                <Avatar
                                                    src={client.avatar_url}
                                                    name={client.name}
                                                    size="md"
                                                />
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                                    <span style={{ fontWeight: 500, color: '#111827', fontSize: '0.9375rem' }}>
                                                        {client.name}
                                                    </span>
                                                    <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
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
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '3rem 2rem',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    background: '#F3F4F6',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#9CA3AF',
                                    marginBottom: '1rem'
                                }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                <h3 style={{ 
                                    fontSize: '0.9375rem', 
                                    fontWeight: 600, 
                                    color: '#111827',
                                    marginBottom: '0.25rem'
                                }}>
                                    Ainda sem clientes
                                </h3>
                                <p style={{ 
                                    fontSize: '0.8125rem', 
                                    color: '#9CA3AF', 
                                    marginBottom: '1rem'
                                }}>
                                    Adicione o seu primeiro cliente
                                </p>
                                <Link 
                                    href="/admin/clientes/novo" 
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.8125rem',
                                        fontWeight: 500,
                                        color: 'white',
                                        padding: '0.625rem 1rem',
                                        background: '#C9A080',
                                        borderRadius: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                    className="hover:bg-[#B8926E]"
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
                <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h2 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Ações Rápidas
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link 
                            href="/admin/clientes/novo" 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                background: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #F3F4F6',
                                transition: 'all 0.15s'
                            }}
                            className="hover:bg-gray-50"
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#F3F4F6',
                                color: '#C9A080',
                                borderRadius: '8px',
                            }}>
                                <AddUserIcon />
                            </div>
                            <div style={{ flex: 1 }}>
                                <span style={{ display: 'block', fontWeight: 500, color: '#111827', fontSize: '0.875rem' }}>
                                    Novo Cliente
                                </span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </Link>

                        <Link 
                            href="/admin/posts/novo" 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                background: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #F3F4F6',
                                transition: 'all 0.15s'
                            }}
                            className="hover:bg-gray-50"
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#F3F4F6',
                                color: '#8FA68F',
                                borderRadius: '8px',
                            }}>
                                <AddPostIcon />
                            </div>
                            <div style={{ flex: 1 }}>
                                <span style={{ display: 'block', fontWeight: 500, color: '#111827', fontSize: '0.875rem' }}>
                                    Criar Post
                                </span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </Link>

                        <Link 
                            href="/admin/clientes" 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                background: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #F3F4F6',
                                transition: 'all 0.15s'
                            }}
                            className="hover:bg-gray-50"
                        >
                            <div style={{
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#F3F4F6',
                                color: '#C17B5D',
                                borderRadius: '8px',
                            }}>
                                <UsersIcon />
                            </div>
                            <div style={{ flex: 1 }}>
                                <span style={{ display: 'block', fontWeight: 500, color: '#111827', fontSize: '0.875rem' }}>
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
