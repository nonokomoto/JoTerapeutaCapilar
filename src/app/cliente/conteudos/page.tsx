import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ClienteConteudos() {
    const supabase = await createClient();

    const { data: posts } = await supabase
        .from("posts")
        .select("id, title, content, image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

    return (
        <div className="cliente-dashboard-content cliente-page-container">
            {/* Page Header */}
            <div className="cliente-page-header">
                <h1 className="cliente-page-title">Novidades e Dicas</h1>
                <p className="cliente-page-subtitle">Artigos e conselhos para o cuidado capilar</p>
            </div>

            {posts && posts.length > 0 ? (
                <div className="cliente-news-grid">
                    {posts.map((post, index) => (
                        <Link
                            href={`/cliente/conteudos/${post.id}`}
                            key={post.id}
                            className="cliente-post-card cliente-post-card-link"
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                            {post.image_url && (
                                <div className="cliente-post-image">
                                    <img src={post.image_url} alt={post.title} />
                                </div>
                            )}
                            <div className="cliente-post-content">
                                <h3 className="cliente-post-title">{post.title}</h3>
                                {post.content && (
                                    <p className="cliente-post-excerpt">
                                        {post.content.substring(0, 120)}...
                                    </p>
                                )}
                                <p className="cliente-post-date">
                                    {new Date(post.created_at).toLocaleDateString("pt-PT", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="cliente-empty-state">
                    <div className="cliente-empty-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V9a2 2 0 012-2h2a2 2 0 012 2v9a2 2 0 01-2 2h-2z" />
                        </svg>
                    </div>
                    <p className="cliente-empty-text">Ainda não há artigos publicados</p>
                </div>
            )}
        </div>
    );
}
