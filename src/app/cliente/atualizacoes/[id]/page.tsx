import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUpdateReactions } from "@/app/cliente/actions";
import { CategoryBadge, ImageGallery, MarkdownContent } from "@/components/ui";
import { ReactionBar } from "@/components/features/ReactionBar";

// Back arrow icon
function ArrowLeftIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
    );
}

function ClipboardIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 14l2 2 4-4" />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    );
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AtualizacaoDetalhe({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: update, error } = await supabase
        .from("client_updates")
        .select(`
            id,
            client_id,
            admin_id,
            title,
            content,
            category,
            client_liked,
            client_read_at,
            created_at,
            attachments (
                id,
                update_id,
                file_url,
                file_name,
                file_type,
                file_size,
                created_at
            )
        `)
        .eq("id", id)
        .eq("client_id", user?.id)
        .single();

    if (error || !update) {
        notFound();
    }

    // Get reactions for this update
    const reactions = await getUpdateReactions(update.id);

    // Separate image and document attachments
    const imageAttachments = update.attachments?.filter(att => att.file_type === "image") || [];
    const documentAttachments = update.attachments?.filter(att => att.file_type !== "image") || [];

    // Mark as read if not already
    if (!update.client_read_at) {
        await supabase
            .from("client_updates")
            .update({ client_read_at: new Date().toISOString() })
            .eq("id", update.id);
    }

    return (
        <div className="cliente-dashboard-content cliente-page-container">
            {/* Back Navigation */}
            <Link
                href="/cliente/atualizacoes"
                className="inline-flex items-center gap-2 mb-6 text-sm font-medium transition-opacity hover:opacity-70 ds-text-secondary"
            >
                <ArrowLeftIcon />
                Voltar às atualizações
            </Link>

            <article className="cliente-update-detail">
                {/* Update Header */}
                <header className="cliente-update-detail-header">
                    <div className="cliente-update-detail-icon">
                        <ClipboardIcon />
                    </div>
                    <div className="cliente-update-detail-meta">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h1 className="cliente-update-detail-title">{update.title}</h1>
                            <CategoryBadge category={update.category} size="sm" />
                        </div>
                        <p className="cliente-update-detail-date">
                            {new Date(update.created_at).toLocaleDateString("pt-PT", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                        </p>
                    </div>
                </header>

                {/* Update Content */}
                <div className="cliente-update-detail-content">
                    <MarkdownContent content={update.content} />
                </div>

                {/* Image Gallery */}
                {imageAttachments.length > 0 && (
                    <div className="cliente-update-detail-images">
                        <ImageGallery attachments={imageAttachments} />
                    </div>
                )}

                {/* Document Attachments */}
                {documentAttachments.length > 0 && (
                    <div className="cliente-update-attachments">
                        <p className="cliente-attachments-label">Documentos</p>
                        <div className="cliente-attachments-grid">
                            {documentAttachments.map((attachment) => (
                                <a
                                    key={attachment.id}
                                    href={attachment.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cliente-attachment-link"
                                >
                                    <FileIcon />
                                    <span className="truncate">{attachment.file_name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Reactions */}
                <div className="cliente-update-detail-reactions">
                    <ReactionBar
                        updateId={update.id}
                        reactions={reactions}
                    />
                </div>
            </article>
        </div>
    );
}
