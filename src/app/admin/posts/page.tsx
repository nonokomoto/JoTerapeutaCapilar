import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button, Icon, PageHeader, EmptyState } from "@/components/ui";

export default async function AdminPosts() {
    const supabase = await createClient();

    const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div>
            <PageHeader
                title="Publicações"
                subtitle="Gerir conteúdos visíveis para todos os clientes"
                actions={
                    <Link href="/admin/posts/novo">
                        <Button>
                            <Icon name="plus" size="sm" />
                            Novo Post
                        </Button>
                    </Link>
                }
            />

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
                                    <Icon name="image" size={28} className="ds-text-muted" />
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
                                <Icon name="chevron-right" size="md" />
                            </div>
                        </Link>
                    ))}
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
