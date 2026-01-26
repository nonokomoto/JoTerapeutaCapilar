import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Icons
function ClockIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    );
}

// Helper functions
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content?.trim().split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function isNewPost(createdAt: string): boolean {
    const postDate = new Date(createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
}

export default async function ClienteConteudos() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Fetch posts with reaction counts
    const { data: posts } = await supabase
        .from("posts")
        .select("id, title, content, image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

    // Fetch reaction counts for all posts
    const postIds = posts?.map(p => p.id) || [];
    const { data: reactionCounts } = postIds.length > 0
        ? await supabase
            .from("post_reactions")
            .select("post_id, reaction")
            .in("post_id", postIds)
        : { data: [] };

    // Group reactions by post_id
    const reactionsByPost = (reactionCounts || []).reduce((acc, r) => {
        acc[r.post_id] = (acc[r.post_id] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="cliente-dashboard-content cliente-page-container">
            {/* Page Header */}
            <div className="cliente-page-header">
                <h1 className="cliente-page-title">Novidades e Dicas</h1>
                <p className="cliente-page-subtitle">Artigos e conselhos para o cuidado capilar</p>
            </div>

            {posts && posts.length > 0 ? (
                <div className="cliente-news-grid">
                    {posts.map((post, index) => {
                        const readingTime = calculateReadingTime(post.content || "");
                        const isNew = isNewPost(post.created_at);
                        const totalReactions = reactionsByPost[post.id] || 0;

                        return (
                            <Link
                                href={`/cliente/conteudos/${post.id}`}
                                key={post.id}
                                className="cliente-post-card cliente-post-card-link"
                                style={{ animationDelay: `${index * 80}ms` }}
                            >
                                {post.image_url && (
                                    <div className="cliente-post-image">
                                        <img src={post.image_url} alt={post.title} loading="lazy" />
                                        {isNew && (
                                            <span className="cliente-post-badge-new">Novo</span>
                                        )}
                                    </div>
                                )}
                                {!post.image_url && isNew && (
                                    <span className="cliente-post-badge-new cliente-post-badge-inline">Novo</span>
                                )}
                                <div className="cliente-post-content">
                                    <h3 className="cliente-post-title">{post.title}</h3>
                                    {post.content && (
                                        <p className="cliente-post-excerpt">
                                            {post.content.substring(0, 120)}...
                                        </p>
                                    )}
                                    <div className="cliente-post-meta">
                                        <span className="cliente-post-reading-time">
                                            <ClockIcon />
                                            {readingTime} min
                                        </span>
                                        <span className="cliente-post-date">
                                            {new Date(post.created_at).toLocaleDateString("pt-PT", {
                                                day: "numeric",
                                                month: "short"
                                            })}
                                        </span>
                                        {totalReactions > 0 && (
                                            <span className="cliente-post-reactions">
                                                <HeartIcon />
                                                {totalReactions}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="cliente-empty-state">
                    <div className="cliente-empty-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="cliente-empty-title">Sem artigos</h3>
                    <p className="cliente-empty-text">
                        Ainda não há artigos publicados. Volte em breve!
                    </p>
                </div>
            )}
        </div>
    );
}
