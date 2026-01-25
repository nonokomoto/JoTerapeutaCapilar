"use client";

import { useState, useEffect, useRef } from "react";
import { CategoryBadge, ImageGallery, MarkdownContent } from "@/components/ui";
import { UnreadBadge } from "@/components/features/UnreadBadge";
import { UpdateReadTracker } from "@/components/features/UpdateReadTracker";
import { ReactionBar } from "@/components/features/ReactionBar";
import { ChevronDown, ChevronUp, FileText, Image as ImageIcon } from "lucide-react";
import { ClientUpdate, ReactionCount } from "@/types/database";

interface UpdateCardProps {
    update: ClientUpdate;
    reactions: ReactionCount[];
    index: number;
    defaultExpanded?: boolean;
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

export function UpdateCard({ update, reactions, index, defaultExpanded = false }: UpdateCardProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const cardRef = useRef<HTMLElement>(null);

    const imageAttachments = update.attachments?.filter(att => att.file_type === "image") || [];
    const documentAttachments = update.attachments?.filter(att => att.file_type !== "image") || [];
    const hasAttachments = (update.attachments?.length || 0) > 0;

    // Truncate content for preview (first 150 chars)
    const contentPreview = update.content.length > 150
        ? update.content.substring(0, 150).trim() + "..."
        : update.content;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Auto-scroll and expand when defaultExpanded changes
    useEffect(() => {
        if (defaultExpanded && cardRef.current) {
            setIsExpanded(true);
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    }, [defaultExpanded]);

    return (
        <article
            ref={cardRef}
            id={`update-${update.id}`}
            className={`cliente-update-card ${!update.client_read_at ? 'update-card-unread' : ''} ${isExpanded ? 'update-card-expanded' : ''}`}
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <UpdateReadTracker updateId={update.id} isUnread={!update.client_read_at} />

            {/* Clickable Header */}
            <button
                type="button"
                className="update-card-header-btn"
                onClick={toggleExpand}
                aria-expanded={isExpanded}
            >
                <div className="cliente-update-header">
                    <div className="cliente-update-icon">
                        <ClipboardIcon />
                    </div>
                    <div className="cliente-update-meta">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="cliente-update-title mb-0">{update.title}</h3>
                            <CategoryBadge category={update.category} size="sm" />
                            <UnreadBadge isUnread={!update.client_read_at} />
                        </div>
                        <p className="cliente-update-date">
                            {new Date(update.created_at).toLocaleDateString("pt-PT", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <div className="update-card-expand-icon">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>

                {/* Preview - only show when collapsed */}
                {!isExpanded && (
                    <div className="update-card-preview">
                        <p className="update-card-preview-text">{contentPreview}</p>
                        {hasAttachments && (
                            <div className="update-card-preview-meta">
                                {imageAttachments.length > 0 && (
                                    <span className="update-card-meta-item">
                                        <ImageIcon size={14} />
                                        {imageAttachments.length} {imageAttachments.length === 1 ? 'imagem' : 'imagens'}
                                    </span>
                                )}
                                {documentAttachments.length > 0 && (
                                    <span className="update-card-meta-item">
                                        <FileText size={14} />
                                        {documentAttachments.length} {documentAttachments.length === 1 ? 'documento' : 'documentos'}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="update-card-expanded-content">
                    <div className="cliente-update-content">
                        <MarkdownContent content={update.content} />
                    </div>

                    {/* Image Gallery */}
                    {imageAttachments.length > 0 && (
                        <ImageGallery attachments={imageAttachments} />
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
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <FileIcon />
                                        <span className="truncate">{attachment.file_name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reactions */}
                    <div onClick={(e) => e.stopPropagation()}>
                        <ReactionBar
                            updateId={update.id}
                            reactions={reactions}
                        />
                    </div>
                </div>
            )}
        </article>
    );
}
