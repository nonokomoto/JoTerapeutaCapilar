import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostReactionBar } from "@/components/features/PostReactionBar";
import { SmartContent } from "@/components/features/SmartContent";
import type { ReactionType, ReactionCount } from "@/types/database";

// Icons
function ArrowLeftIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

// Helper functions
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content?.trim().split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ArtigoDetalhe({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: post, error } = await supabase
        .from("posts")
        .select("id, title, content, image_url, created_at")
        .eq("id", id)
        .eq("published", true)
        .single();

    if (error || !post) {
        notFound();
    }

    // Fetch reactions for this post
    const { data: reactions } = await supabase
        .from("post_reactions")
        .select("reaction, user_id")
        .eq("post_id", id);

    // Group reactions by type with user_reacted flag
    const reactionCounts: ReactionCount[] = (['like', 'celebrate', 'helpful', 'question'] as ReactionType[])
        .map(reactionType => {
            const reactionList = reactions?.filter(r => r.reaction === reactionType) || [];
            return {
                reaction: reactionType,
                count: reactionList.length,
                user_reacted: reactionList.some(r => r.user_id === user?.id)
            };
        })
        .filter(r => r.count > 0 || r.user_reacted);

    const readingTime = calculateReadingTime(post.content || "");

    return (
        <div className="cliente-dashboard-content cliente-page-container">
            {/* Back Navigation */}
            <Link
                href="/cliente/conteudos"
                className="cliente-back-link"
            >
                <ArrowLeftIcon />
                Voltar aos artigos
            </Link>

            <article className="cliente-article">
                {/* Article Header */}
                <header className="cliente-article-header">
                    <div className="cliente-article-meta">
                        <span className="cliente-article-date">
                            {new Date(post.created_at).toLocaleDateString("pt-PT", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </span>
                        <span className="cliente-article-reading-time">
                            <ClockIcon />
                            {readingTime} min de leitura
                        </span>
                    </div>
                    <h1 className="cliente-article-title">{post.title}</h1>
                </header>

                {/* Featured Image */}
                {post.image_url && (
                    <div className="cliente-article-image">
                        <img src={post.image_url} alt={post.title} />
                    </div>
                )}

                {/* Article Content */}
                <SmartContent
                    content={post.content || ""}
                    className="cliente-article-content"
                />

                {/* Reactions */}
                <div className="cliente-article-reactions">
                    <p className="cliente-article-reactions-label">O que achou deste artigo?</p>
                    <PostReactionBar postId={post.id} reactions={reactionCounts} />
                </div>
            </article>
        </div>
    );
}
