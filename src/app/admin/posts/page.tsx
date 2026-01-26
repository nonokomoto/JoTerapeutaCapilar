import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button, Icon, PageHeader, EmptyState } from "@/components/ui";

// Icons
function HeartIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    );
}

function calculateReadingTime(content: string): number {
    const words = content?.trim().split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / 200));
}

export default async function AdminPosts() {
    const supabase = await createClient();

    const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    // Fetch reaction counts for all posts
    const postIds = posts?.map(p => p.id) || [];
    const { data: reactionCounts } = postIds.length > 0
        ? await supabase
            .from("post_reactions")
            .select("post_id")
            .in("post_id", postIds)
        : { data: [] };

    // Group reactions by post_id
    const reactionsByPost = (reactionCounts || []).reduce((acc, r) => {
        acc[r.post_id] = (acc[r.post_id] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const publishedCount = posts?.filter(p => p.published).length || 0;
    const draftCount = posts?.filter(p => !p.published).length || 0;

    return (
        <div>
            <PageHeader
                title="Publicações"
                subtitle="Gerir conteúdos visíveis para todos os clientes"
                actions={
                    <Link href="/admin/posts/novo">
                        <Button>
                            <Icon name="plus" size="sm" />
                            Nova Publicação
                        </Button>
                    </Link>
                }
            />

            {/* Stats Summary */}
            {posts && posts.length > 0 && (
                <div className="posts-stats">
                    <div className="posts-stat">
                        <span className="posts-stat-value">{posts.length}</span>
                        <span className="posts-stat-label">Total</span>
                    </div>
                    <div className="posts-stat">
                        <span className="posts-stat-value posts-stat-published">{publishedCount}</span>
                        <span className="posts-stat-label">Publicados</span>
                    </div>
                    <div className="posts-stat">
                        <span className="posts-stat-value posts-stat-draft">{draftCount}</span>
                        <span className="posts-stat-label">Rascunhos</span>
                    </div>
                </div>
            )}

            {/* Posts List */}
            {posts && posts.length > 0 ? (
                <div className="posts-list">
                    {posts.map((post) => {
                        const reactions = reactionsByPost[post.id] || 0;
                        const readingTime = calculateReadingTime(post.content || "");

                        return (
                            <Link
                                key={post.id}
                                href={`/admin/posts/${post.id}`}
                                className="post-card"
                            >
                                {/* Image */}
                                <div className="post-card-image">
                                    {post.image_url ? (
                                        <img src={post.image_url} alt={post.title} />
                                    ) : (
                                        <Icon name="image" size={28} className="ds-text-muted" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="post-card-content">
                                    <div className="post-card-header">
                                        <h3 className="post-card-title">{post.title}</h3>
                                        <span
                                            className={`post-card-status ${post.published ? "published" : "draft"}`}
                                        >
                                            {post.published ? "Publicado" : "Rascunho"}
                                        </span>
                                    </div>
                                    <p className="post-card-excerpt">{post.content}</p>
                                    <div className="post-card-meta">
                                        <span className="post-card-date">
                                            {new Date(
                                                post.published ? post.updated_at : post.created_at
                                            ).toLocaleDateString("pt-PT", {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </span>
                                        <span className="post-card-reading">
                                            {readingTime} min leitura
                                        </span>
                                        {reactions > 0 && (
                                            <span className="post-card-reactions">
                                                <HeartIcon />
                                                {reactions}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Arrow indicator */}
                                <div className="post-card-arrow">
                                    <Icon name="chevron-right" size="md" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon="file-text"
                    title="Nenhuma publicação"
                    description="Crie o seu primeiro conteúdo para os clientes"
                    action={{
                        label: "Criar publicação",
                        href: "/admin/posts/novo",
                    }}
                />
            )}
        </div>
    );
}
