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
        .select("id, title, created_at, content, image_url")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);

    const firstName = profile?.name?.split(" ")[0] || "Cliente";
    const greeting = getGreeting();
    const initials = profile?.name?.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() || "CL";

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
                        <div className="absolute bottom-1 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-rose-gold shadow-sm border-2 border-primary lg:bottom-0">
                            <SparklesIcon />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <p className="cliente-hero-greeting">{greeting},</p>
                        <h1 className="cliente-hero-name">{firstName}!</h1>

                        <div className="cliente-status-pill self-center lg:self-start">
                            <UpdatesIcon />
                            <span>A sua saúde capilar em dia</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cliente-dashboard-content">
                {/* Treatments Section */}
                <section className="mb-10">
                    <div className="cliente-feed-header">
                        <h2 className="cliente-section-label">Os meus tratamentos</h2>
                        <Link href="/cliente/atualizacoes" className="text-sm font-medium text-rose-gold hover:opacity-80 transition-opacity">
                            Ver histórico
                        </Link>
                    </div>

                    {recentUpdates && recentUpdates.length > 0 ? (
                        <div className="cliente-treatments-grid">
                            {recentUpdates.map((update, index) => (
                                <Link
                                    href="/cliente/atualizacoes"
                                    key={update.id}
                                    className="cliente-feed-card"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="cliente-feed-icon">
                                        <UpdatesIcon />
                                    </div>
                                    <div className="cliente-feed-info">
                                        <h3 className="cliente-feed-title">{update.title}</h3>
                                        <p className="cliente-feed-date">
                                            {new Date(update.created_at).toLocaleDateString("pt-PT", {
                                                day: "numeric",
                                                month: "long"
                                            })}
                                        </p>
                                    </div>
                                    <div className="cliente-feed-arrow">
                                        <ChevronRightIcon />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="cliente-empty-state">
                            <div className="cliente-empty-icon">
                                <UpdatesIcon />
                            </div>
                            <p className="cliente-empty-text">Ainda não tem tratamentos registados</p>
                        </div>
                    )}
                </section>

                {/* News & Tips Section - Full Width Grid */}
                <section>
                    <div className="cliente-feed-header">
                        <h2 className="cliente-section-label">Novidades e Dicas</h2>
                        <Link href="/cliente/conteudos" className="text-sm font-medium text-rose-gold hover:opacity-80 transition-opacity">
                            Ver todos
                        </Link>
                    </div>

                    {recentPosts && recentPosts.length > 0 ? (
                        <div className="cliente-news-grid">
                            {recentPosts.map((post, index) => (
                                <Link
                                    href={`/cliente/conteudos/${post.id}`}
                                    key={post.id}
                                    className="cliente-post-card cliente-post-card-link"
                                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                                >
                                    {post.image_url && (
                                        <div className="cliente-post-image">
                                            <img src={post.image_url} alt={post.title} />
                                        </div>
                                    )}
                                    <div className="cliente-post-content">
                                        <div className="cliente-post-badge">Novo</div>
                                        <h3 className="cliente-post-title">{post.title}</h3>
                                        {post.content && (
                                            <p className="cliente-post-excerpt">
                                                {post.content.substring(0, 80)}...
                                            </p>
                                        )}
                                        <p className="cliente-post-date">
                                            {new Date(post.created_at).toLocaleDateString("pt-PT", {
                                                day: "numeric",
                                                month: "short"
                                            })}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="cliente-empty-state">
                            <p className="cliente-empty-text">Fique atenta às novidades!</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
