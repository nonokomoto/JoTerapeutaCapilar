"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { ImagePicker } from "@/components/ImagePicker";
import { updatePostAction, deletePostAction } from "../actions";
import { ArrowLeft, Save, Send, Trash2 } from "lucide-react";

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
    const [imageUrl, setImageUrl] = useState<string | null>(post.image_url);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    async function handleSubmit(formData: FormData, publish: boolean) {
        setIsLoading(true);
        setError(null);

        formData.set("id", post.id);
        if (imageUrl) {
            formData.set("image_url", imageUrl);
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
            {/* Header */}
            <div className="post-form-header">
                <Link href="/admin/posts" className="post-form-back">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <h1 className="post-form-title">Editar Publicação</h1>
                    <p className="post-form-subtitle">
                        Criada a {new Date(post.created_at).toLocaleDateString("pt-PT", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="post-form-card">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const submitType = (e.nativeEvent as SubmitEvent).submitter?.getAttribute("data-action");
                        handleSubmit(formData, submitType === "publish");
                    }}
                    className="post-form-fields"
                >
                    {/* Image Picker */}
                    <ImagePicker value={imageUrl} onChange={setImageUrl} />

                    {/* Title */}
                    <div className="post-form-field">
                        <Input
                            label="Título"
                            name="title"
                            defaultValue={post.title}
                            placeholder="Ex: Dicas de cuidado diário"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div className="post-form-field">
                        <label htmlFor="content">Conteúdo</label>
                        <textarea
                            id="content"
                            name="content"
                            rows={8}
                            className="input"
                            defaultValue={post.content}
                            placeholder="Escreva o conteúdo da publicação..."
                            required
                            style={{
                                resize: "vertical",
                                minHeight: "200px",
                            }}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="image-picker-error">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="post-form-actions">
                        {/* Delete Button */}
                        {!showDeleteConfirm ? (
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="post-delete-btn"
                            >
                                <Trash2 size={16} />
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
                                    type="submit"
                                    variant="secondary"
                                    isLoading={isLoading}
                                    data-action="draft"
                                >
                                    Despublicar
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    data-action="publish"
                                >
                                    <Save size={16} />
                                    Guardar
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    type="submit"
                                    variant="secondary"
                                    isLoading={isLoading}
                                    data-action="draft"
                                >
                                    <Save size={16} />
                                    Guardar Rascunho
                                </Button>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    data-action="publish"
                                >
                                    <Send size={16} />
                                    Publicar
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
