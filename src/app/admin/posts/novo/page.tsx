"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button, PageHeader, Icon } from "@/components/ui";
import { PostEditor } from "@/components/features/PostEditor";
import { createPostAction } from "../actions";

export default function NovoPost() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form data refs
    const titleRef = useRef<string>("");
    const contentRef = useRef<string>("");
    const coverImageRef = useRef<string | null>(null);

    async function handleSubmit(publish: boolean) {
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.set("title", titleRef.current);
        formData.set("content", contentRef.current);
        if (coverImageRef.current) {
            formData.set("image_url", coverImageRef.current);
        }
        formData.set("published", publish.toString());

        const result = await createPostAction(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
        // If no error, the action will redirect
    }

    return (
        <div className="post-form-container">
            <PageHeader
                title="Nova Publicação"
                subtitle="Crie conteúdo para partilhar com os seus clientes"
                backHref="/admin/posts"
                backLabel="Publicações"
            />

            {/* Editor with Preview */}
            <div className="post-form-card">
                <PostEditor
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
                    <Link href="/admin/posts">
                        <Button variant="ghost" type="button">
                            Cancelar
                        </Button>
                    </Link>
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
                </div>
            </div>
        </div>
    );
}
