"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { ImagePicker } from "@/components/ImagePicker";
import { createPostAction } from "../actions";
import { ArrowLeft, Save, Send } from "lucide-react";

export default function NovoPost() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    async function handleSubmit(formData: FormData, publish: boolean) {
        setIsLoading(true);
        setError(null);

        // Add image URL and publish status
        if (imageUrl) {
            formData.set("image_url", imageUrl);
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
            {/* Header */}
            <div className="post-form-header">
                <Link href="/admin/posts" className="post-form-back">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="post-form-title">Nova Publicação</h1>
                    <p className="post-form-subtitle">
                        Crie conteúdo para partilhar com os seus clientes
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
                        <Link href="/admin/posts">
                            <Button variant="ghost" type="button">
                                Cancelar
                            </Button>
                        </Link>
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
                    </div>
                </form>
            </div>
        </div>
    );
}
