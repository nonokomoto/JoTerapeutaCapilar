import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

// Get time-based greeting
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
}

// Icons
function UpdatesIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 14l2 2 4-4" />
        </svg>
    );
}

function ProfileIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 00-16 0" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
        </svg>
    );
}

function SparklesIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
            <path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z" />
            <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" />
        </svg>
    );
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
        .select("name, avatar_url")
        .eq("id", user?.id)
        .single();

    // Get recent updates
    const { data: recentUpdates, count: updatesCount } = await supabase
        .from("client_updates")
        .select("id, title, created_at", { count: "exact" })
        .eq("client_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(3);

    // Get recent posts
    const { data: recentPosts } = await supabase
        .from("posts")
        .select("id, title, created_at, excerpt")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

    const firstName = profile?.name?.split(" ")[0] || "Cliente";
    const greeting = getGreeting();
    const initials = profile?.name?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "CL";

    return (
        <div className="cliente-dashboard">
            {/* Hero Section */}
            <div className="cliente-hero">
                <div className="cliente-hero-content">
                    <div className="cliente-avatar-section">
                        {profile?.avatar_url ? (
                            <img 
                                src={profile.avatar_url} 
                                alt={profile.name} 
                                className="cliente-avatar-img"
                            />
                        ) : (
                            <div className="cliente-avatar-placeholder">
                                {initials}
                            </div>
                        )}
                        <div className="cliente-avatar-badge">
                            <SparklesIcon />
                        </div>
                    </div>
                    <div className="cliente-welcome">
                        <p className="cliente-greeting">{greeting},</p>
                        <h1 className="cliente-name">{firstName}!</h1>
                        <p className="cliente-subtitle">Bem-vinda à sua área pessoal</p>
                    </div>
                </div>
                <div className="cliente-hero-decoration" />
            </div>

            {/* Quick Actions */}
            <section className="cliente-section">
                <h2 className="cliente-section-title">Acesso Rápido</h2>
                <div className="cliente-quick-actions">
                    <Link href="/cliente/atualizacoes" className="cliente-action-card cliente-action-primary">
                        <div className="cliente-action-icon">
                            <UpdatesIcon />
                        </div>
                        <div className="cliente-action-content">
                            <span className="cliente-action-title">As minhas atualizações</span>
                            <span className="cliente-action-count">{updatesCount || 0} registos</span>
                        </div>
                        <ChevronRightIcon />
                    </Link>
                    <Link href="/cliente/perfil" className="cliente-action-card cliente-action-secondary">
                        <div className="cliente-action-icon">
                            <ProfileIcon />
                        </div>
                        <div className="cliente-action-content">
                            <span className="cliente-action-title">O meu perfil</span>
                            <span className="cliente-action-count">Dados pessoais</span>
                        </div>
                        <ChevronRightIcon />
                    </Link>
                </div>
            </section>

            {/* Recent Updates */}
            <section className="cliente-section">
                <div className="cliente-section-header">
                    <h2 className="cliente-section-title">Últimas Atualizações</h2>
                    <Link href="/cliente/atualizacoes" className="cliente-section-link">
                        Ver tudo
                    </Link>
                </div>

                {recentUpdates && recentUpdates.length > 0 ? (
                    <div className="cliente-updates-list">
                        {recentUpdates.map((update, index) => (
                            <div 
                                key={update.id} 
                                className="cliente-update-card"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="cliente-update-dot" />
                                <div className="cliente-update-content">
                                    <h3 className="cliente-update-title">{update.title}</h3>
                                    <p className="cliente-update-date">
                                        {new Date(update.created_at).toLocaleDateString("pt-PT", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="cliente-empty-state">
                        <div className="cliente-empty-icon">
                            <UpdatesIcon />
                        </div>
                        <p className="cliente-empty-text">Ainda não tem atualizações</p>
                        <p className="cliente-empty-subtext">As suas atualizações de tratamento aparecerão aqui</p>
                    </div>
                )}
            </section>

            {/* News Section */}
            <section className="cliente-section">
                <div className="cliente-section-header">
                    <h2 className="cliente-section-title">Novidades & Dicas</h2>
                </div>

                {recentPosts && recentPosts.length > 0 ? (
                    <div className="cliente-posts-grid">
                        {recentPosts.map((post, index) => (
                            <div 
                                key={post.id} 
                                className="cliente-post-card"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="cliente-post-badge">Novo</div>
                                <h3 className="cliente-post-title">{post.title}</h3>
                                {post.excerpt && (
                                    <p className="cliente-post-excerpt">{post.excerpt}</p>
                                )}
                                <p className="cliente-post-date">
                                    {new Date(post.created_at).toLocaleDateString("pt-PT", {
                                        day: "numeric",
                                        month: "short"
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="cliente-empty-state">
                        <p className="cliente-empty-text">Sem novidades de momento</p>
                        <p className="cliente-empty-subtext">Fique atenta às próximas dicas!</p>
                    </div>
                )}
            </section>
        </div>
    );
}
