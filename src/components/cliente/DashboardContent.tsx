"use client";

import Link from "next/link";
import { useClientUpdates, useRecentPosts } from "@/lib/queries";

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

function ChevronRightIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
        </svg>
    );
}

// Skeleton components
function UpdatesSkeleton() {
    return (
        <div className="cliente-treatments-grid">
            {[1, 2, 3].map((i) => (
                <div key={i} className="cliente-feed-card animate-pulse">
                    <div className="cliente-feed-icon bg-gray-200"></div>
                    <div className="cliente-feed-info">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function PostsSkeleton() {
    return (
        <div className="cliente-news-grid">
            {[1, 2, 3].map((i) => (
                <div key={i} className="cliente-post-card animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-t-lg"></div>
                    <div className="cliente-post-content">
                        <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface ClientUpdate {
    id: string;
    title: string;
    created_at: string;
}

interface TreatmentsSectionProps {
    initialUpdates?: ClientUpdate[];
    initialCount?: number;
}

export function TreatmentsSection({ initialUpdates, initialCount }: TreatmentsSectionProps) {
    // Pass initialData to hook - cache is populated immediately, no loading state
    const initialData = initialUpdates ? { updates: initialUpdates, count: initialCount || 0 } : undefined;
    const { data } = useClientUpdates(3, initialData);

    const updates = data?.updates || initialUpdates;

    if (!updates) {
        return (
            <section className="mb-10">
                <div className="cliente-feed-header">
                    <h2 className="cliente-section-label">Os meus tratamentos</h2>
                    <Link href="/cliente/atualizacoes" className="text-sm font-medium text-rose-gold hover:opacity-80 transition-opacity">
                        Ver histórico
                    </Link>
                </div>
                <UpdatesSkeleton />
            </section>
        );
    }

    return (
        <section className="mb-10">
            <div className="cliente-feed-header">
                <h2 className="cliente-section-label">Os meus tratamentos</h2>
                <Link href="/cliente/atualizacoes" className="text-sm font-medium text-rose-gold hover:opacity-80 transition-opacity">
                    Ver histórico
                </Link>
            </div>

            {updates && updates.length > 0 ? (
                <div className="cliente-treatments-grid">
                    {updates.map((update, index) => (
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
    );
}

interface Post {
    id: string;
    title: string;
    content: string | null;
    image_url: string | null;
    created_at: string;
}

interface NewsSectionProps {
    initialPosts?: Post[];
}

export function NewsSection({ initialPosts }: NewsSectionProps) {
    // Pass initialData to hook - cache is populated immediately, no loading state
    const { data: posts } = useRecentPosts(6, initialPosts);

    const displayPosts = posts || initialPosts;

    if (!displayPosts) {
        return (
            <section>
                <div className="cliente-feed-header">
                    <h2 className="cliente-section-label">Novidades e Dicas</h2>
                    <Link href="/cliente/conteudos" className="text-sm font-medium text-rose-gold hover:opacity-80 transition-opacity">
                        Ver todos
                    </Link>
                </div>
                <PostsSkeleton />
            </section>
        );
    }

    return (
        <section>
            <div className="cliente-feed-header">
                <h2 className="cliente-section-label">Novidades e Dicas</h2>
                <Link href="/cliente/conteudos" className="text-sm font-medium text-rose-gold hover:opacity-80 transition-opacity">
                    Ver todos
                </Link>
            </div>

            {displayPosts && displayPosts.length > 0 ? (
                <div className="cliente-news-grid">
                    {displayPosts.map((post, index) => (
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
    );
}
