"use client";

import Link from "next/link";
import { Calendar, Newspaper, ChevronRight } from "lucide-react";

interface Post {
    id: string;
    title: string;
    content: string | null;
    image_url: string | null;
    created_at: string;
}

interface PostCardProps {
    post: Post;
    index?: number;
    variant?: "default" | "compact";
    showBadge?: boolean;
}

/**
 * Determina se o post é "novo" (publicado nos últimos 7 dias)
 */
function isNewPost(createdAt: string): boolean {
    const postDate = new Date(createdAt);
    const now = new Date();
    const diffTime = now.getTime() - postDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
}

/**
 * Trunca o conteúdo para preview
 */
function getContentPreview(content: string | null, maxLength: number = 100): string {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
}

export function PostCard({ post, index = 0, variant = "default", showBadge = true }: PostCardProps) {
    const isNew = isNewPost(post.created_at);
    const preview = getContentPreview(post.content, variant === "compact" ? 80 : 120);

    return (
        <Link
            href={`/cliente/conteudos/${post.id}`}
            className="group block bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-gray-300"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Image */}
            {post.image_url ? (
                <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* New Badge on Image */}
                    {showBadge && isNew && (
                        <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold uppercase tracking-wide bg-[var(--color-blush)] text-[var(--color-rose-gold)] rounded-full">
                                Novo
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <Newspaper size={40} className="text-gray-300" />
                    {/* New Badge */}
                    {showBadge && isNew && (
                        <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold uppercase tracking-wide bg-[var(--color-blush)] text-[var(--color-rose-gold)] rounded-full">
                                Novo
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="p-4 flex flex-col gap-2">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-[var(--color-rose-gold)] transition-colors">
                    {post.title}
                </h3>

                {/* Excerpt */}
                {preview && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {preview}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar size={14} />
                        <span>
                            {new Date(post.created_at).toLocaleDateString("pt-PT", {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-[var(--color-rose-gold)] opacity-0 group-hover:opacity-100 transition-opacity">
                        Ler mais
                        <ChevronRight size={14} />
                    </div>
                </div>
            </div>
        </Link>
    );
}
