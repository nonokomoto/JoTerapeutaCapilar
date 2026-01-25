import Link from "next/link";
import { Calendar, ChevronRight, Eye, EyeOff, Image as ImageIcon } from "lucide-react";

interface Post {
    id: string;
    title: string;
    content: string;
    image_url: string | null;
    published: boolean;
    created_at: string;
    updated_at: string;
}

interface AdminPostCardProps {
    post: Post;
    index: number;
}

export function AdminPostCard({ post, index }: AdminPostCardProps) {
    const displayDate = post.published ? post.updated_at : post.created_at;

    return (
        <Link
            href={`/admin/posts/${post.id}`}
            className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Image Thumbnail */}
            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {post.image_url ? (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <ImageIcon size={24} className="text-gray-300" />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-[var(--color-rose-gold)] transition-colors">
                    {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                    {post.content}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 mt-2">
                    {/* Status Badge */}
                    <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                            post.published
                                ? "bg-green-50 text-green-700"
                                : "bg-amber-50 text-amber-700"
                        }`}
                    >
                        {post.published ? (
                            <>
                                <Eye size={12} />
                                Publicado
                            </>
                        ) : (
                            <>
                                <EyeOff size={12} />
                                Rascunho
                            </>
                        )}
                    </span>

                    {/* Date */}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={12} />
                        {new Date(displayDate).toLocaleDateString("pt-PT", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0 text-gray-300 group-hover:text-[var(--color-rose-gold)] group-hover:translate-x-1 transition-all">
                <ChevronRight size={20} />
            </div>
        </Link>
    );
}
