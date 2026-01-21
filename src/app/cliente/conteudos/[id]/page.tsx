import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Back arrow icon
function ArrowLeftIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
    );
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ArtigoDetalhe({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: post, error } = await supabase
        .from("posts")
        .select("id, title, content, image_url, created_at")
        .eq("id", id)
        .eq("published", true)
        .single();

    if (error || !post) {
        notFound();
    }

    return (
        <div className="cliente-dashboard-content cliente-page-container">
            {/* Back Navigation */}
            <Link
                href="/cliente/conteudos"
                className="inline-flex items-center gap-2 mb-6 text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--text-secondary)" }}
            >
                <ArrowLeftIcon />
                Voltar aos artigos
            </Link>

            <article className="cliente-article">
                {/* Article Header */}
                <header className="cliente-article-header">
                    <p className="cliente-article-date">
                        {new Date(post.created_at).toLocaleDateString("pt-PT", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        })}
                    </p>
                    <h1 className="cliente-article-title">{post.title}</h1>
                </header>

                {/* Featured Image */}
                {post.image_url && (
                    <div className="cliente-article-image">
                        <img src={post.image_url} alt={post.title} />
                    </div>
                )}

                {/* Article Content */}
                <div className="cliente-article-content">
                    {post.content}
                </div>
            </article>
        </div>
    );
}
