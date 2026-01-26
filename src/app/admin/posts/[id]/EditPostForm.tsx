"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, PageHeader, Icon } from "@/components/ui";
import { PostEditor } from "@/components/features/PostEditor";
import { updatePostAction, deletePostAction } from "../actions";

interface Post {
    id: string;
    title: string;
    content: string;
    image_url: string | null;
    published: boolean;
    created_at: string;
}

interface EditPostFormProps {
    post: Post;
}

export function EditPostForm({ post }: EditPostFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Form data refs with initial values
    const titleRef = useRef<string>(post.title);
    const contentRef = useRef<string>(post.content);
    const coverImageRef = useRef<string | null>(post.image_url);

    async function handleSubmit(publish: boolean) {
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.set("id", post.id);
        formData.set("title", titleRef.current);
        formData.set("content", contentRef.current);
        if (coverImageRef.current) {
            formData.set("image_url", coverImageRef.current);
        }
        formData.set("published", publish.toString());

        const result = await updatePostAction(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            router.push("/admin/posts");
            router.refresh();
        }

        setIsLoading(false);
    }

    async function handleDelete() {
        setIsDeleting(true);
        setError(null);

        const formData = new FormData();
        formData.set("id", post.id);

        const result = await deletePostAction(formData);

        if (result?.error) {
            setError(result.error);
            setIsDeleting(false);
        } else {
            router.push("/admin/posts");
            router.refresh();
        }
    }

    return (
        <div className="post-form-container">
            <PageHeader
                title="Editar Publicação"
                subtitle={`Criada a ${new Date(post.created_at).toLocaleDateString("pt-PT", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })}`}
                backHref="/admin/posts"
                backLabel="Publicações"
            />

            {/* Editor with Preview */}
            <div className="post-form-card">
                <PostEditor
                    defaultTitle={post.title}
                    defaultContent={post.content}
                    defaultCoverImage={post.image_url}
                    onTitleChange={(title) => { titleRef.current = title; }}
                    onContentChange={(content) => { contentRef.current = content; }}
                    onCoverImageChange={(url) => { coverImageRef.current = url; }}
                />

                {/* Error */}
                {error && (
                    <div className="image-picker-error" style={{ marginTop: "var(--spacing-4)" }}>
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="post-form-actions" style={{ marginTop: "var(--spacing-6)" }}>
                    {/* Delete Button */}
                    {!showDeleteConfirm ? (
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="post-delete-btn"
                        >
                            <Icon name="trash" size="sm" />
                        </button>
                    ) : (
                        <div className="post-delete-confirm">
                            <span className="post-delete-text">Eliminar?</span>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="post-delete-yes"
                            >
                                {isDeleting ? "..." : "Sim"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="post-delete-no"
                            >
                                Não
                            </button>
                        </div>
                    )}

                    <div className="flex-1" />

                    <Link href="/admin/posts">
                        <Button variant="ghost" type="button">
                            Cancelar
                        </Button>
                    </Link>

                    {post.published ? (
                        <>
                            <Button
                                variant="secondary"
                                isLoading={isLoading}
                                onClick={() => handleSubmit(false)}
                            >
                                Despublicar
                            </Button>
                            <Button
                                isLoading={isLoading}
                                onClick={() => handleSubmit(true)}
                            >
                                <Icon name="save" size="sm" />
                                Guardar
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="secondary"
                                isLoading={isLoading}
                                onClick={() => handleSubmit(false)}
                            >
                                <Icon name="save" size="sm" />
                                Guardar Rascunho
                            </Button>
                            <Button
                                isLoading={isLoading}
                                onClick={() => handleSubmit(true)}
                            >
                                <Icon name="send" size="sm" />
                                Publicar
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
