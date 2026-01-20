import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui";

// Icons
function ImagePlaceholderIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

function EmptyPostsIcon() {
    return (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );
}

export default async function AdminPosts() {
    const supabase = await createClient();

    const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div>
            {/* Header */}
            <div className="posts-header">
                <div>
                    <h1 className="posts-header-title">Publicações</h1>
                    <p className="posts-header-subtitle">
                        Gerir conteúdos visíveis para todos os clientes
                    </p>
                </div>
                <Link href="/admin/posts/novo">
                    <Button>
                        <PlusIcon />
                        Novo Post
                    </Button>
                </Link>
            </div>

            {/* Posts List */}
            {posts && posts.length > 0 ? (
                <div className="posts-list">
                    {posts.map((post) => (
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
                                    <ImagePlaceholderIcon />
                                )}
                            </div>

                            {/* Content */}
                            <div className="post-card-content">
                                <h3 className="post-card-title">{post.title}</h3>
                                <p className="post-card-excerpt">{post.content}</p>
                                <div className="post-card-meta">
                                    <span
                                        className={`post-card-badge ${post.published ? "published" : "draft"}`}
                                    >
                                        {post.published ? "Publicado" : "Rascunho"}
                                    </span>
                                    <span className="post-card-date">
                                        {new Date(
                                            post.published ? post.updated_at : post.created_at
                                        ).toLocaleDateString("pt-PT", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Arrow indicator */}
                            <div className="post-card-arrow">
                                <ChevronRightIcon />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="posts-empty">
                    <div className="posts-empty-icon">
                        <EmptyPostsIcon />
                    </div>
                    <h3 className="posts-empty-title">Nenhuma publicação</h3>
                    <p className="posts-empty-text">
                        Crie o seu primeiro conteúdo para os clientes
                    </p>
                    <Link href="/admin/posts/novo">
                        <Button>
                            <PlusIcon />
                            Criar publicação
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
