"use client";

import { useState } from "react";
import { Icon, Avatar, Modal, ConfirmDialog, Button, CategoryBadge, ImageGallery, MarkdownContent } from "@/components/ui";
import { ClientUpdate, Attachment, ReactionCount } from "@/types/database";
import { ReactionSummary } from "@/components/features/ReactionSummary";
import { CreateUpdateForm } from "./CreateUpdateForm";
import { deleteClientUpdateAction } from "../actions";
import { Edit, Trash2, MoreVertical, Paperclip } from "lucide-react";

interface UpdateCardProps {
    update: ClientUpdate;
    clientId: string;
    reactions?: ReactionCount[];
}

export function UpdateCard({ update, clientId, reactions = [] }: UpdateCardProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const getUpdateStyle = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes("agendamento confirmado")) {
            return {
                icon: "calendar" as const,
                colorClass: "text-[var(--color-info)]",
                bgClass: "bg-[var(--color-info-bg)]"
            };
        }
        if (t.includes("consulta realizada")) {
            return {
                icon: "check" as const,
                colorClass: "text-[var(--color-success)]",
                bgClass: "bg-[var(--color-success-bg)]"
            };
        }
        if (t.includes("agendamento cancelado")) {
            return {
                icon: "x" as const,
                colorClass: "text-[var(--color-error)]",
                bgClass: "bg-[var(--color-error-bg)]"
            };
        }
        return null;
    };

    const style = getUpdateStyle(update.title);

    async function handleDelete() {
        setIsDeleting(true);
        await deleteClientUpdateAction(update.id, clientId);
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
    }

    return (
        <>
            <div className="client-update-card relative group">
                {/* Actions Dropdown/Buttons */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="p-1.5 rounded bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-colors"
                        title="Editar"
                    >
                        <Edit size={14} />
                    </button>
                    <button
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="p-1.5 rounded bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-red-600 hover:border-red-200 transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>

                {/* Header: Title + Badge */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        {style && (
                            <div className={`flex items-center justify-center w-7 h-7 rounded-full ${style.bgClass} ${style.colorClass} shrink-0`}>
                                <Icon name={style.icon} size={16} />
                            </div>
                        )}
                        <h4 className="client-update-title">{update.title}</h4>
                    </div>
                    <CategoryBadge category={update.category} size="sm" />
                </div>

                {/* Date - metadata line */}
                <div className="client-update-meta">
                    <span className="client-update-date">
                        {new Date(update.created_at).toLocaleDateString(
                            "pt-PT",
                            {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            }
                        ).toUpperCase()}
                    </span>
                    {update.client_liked && (
                        <span className="inline-flex items-center gap-1 text-xs text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100" title="Cliente gostou">
                            ❤️ Gostou
                        </span>
                    )}
                </div>

                {/* Content - separated */}
                <div className="client-update-body">
                    <MarkdownContent content={update.content} />
                </div>

                {/* Image Gallery - show images in thumbnail grid */}
                {update.attachments && update.attachments.length > 0 && (
                    <ImageGallery attachments={update.attachments} />
                )}

                {/* Non-image attachments (PDFs) - show as badges */}
                {update.attachments && update.attachments.some(att => att.file_type !== "image") && (
                    <div className="client-update-attachments">
                        {update.attachments
                            .filter(att => att.file_type !== "image")
                            .map((att) => (
                                <a
                                    key={att.id}
                                    href={att.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="client-attachment-badge"
                                >
                                    <Icon name="file-text" size={14} />
                                    <span className="truncate max-w-[120px]">
                                        {att.file_name}
                                    </span>
                                </a>
                            ))}
                    </div>
                )}

                {/* Client Reactions */}
                <ReactionSummary reactions={reactions} />
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Editar Atualização"
                size="lg"
            >
                <CreateUpdateForm
                    clientId={clientId}
                    compact
                    initialData={{
                        id: update.id,
                        title: update.title,
                        content: update.content,
                        category: update.category,
                        attachments: update.attachments,
                    }}
                    onSuccess={() => setIsEditModalOpen(false)}
                />
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar Atualização"
                message={`Tem a certeza que deseja eliminar a atualização "${update.title}"? Esta ação não pode ser desfeita.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    );
}
