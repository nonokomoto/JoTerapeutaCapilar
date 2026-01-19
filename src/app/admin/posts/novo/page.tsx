"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Input } from "@/components/ui";
import { createPostAction } from "../actions";

export default function NovoPost() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        const result = await createPostAction(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
        // If no error, the action will redirect
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/posts"
                    className="p-2 rounded-sm"
                    style={{ backgroundColor: "var(--bg-input)" }}
                >
                    ←
                </Link>
                <div>
                    <h1
                        className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Nouvelle publication
                    </h1>
                    <p style={{ color: "var(--text-muted)" }}>
                        Créez une actualité pour vos clients
                    </p>
                </div>
            </div>

            {/* Form */}
            <Card>
                <form action={handleSubmit} className="space-y-4">
                    <Input
                        label="Titre *"
                        name="title"
                        placeholder="Ex: Conseils pour l'été"
                        required
                    />

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="content"
                            className="text-sm font-medium"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Contenu *
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            rows={8}
                            className="input"
                            placeholder="Rédigez votre article..."
                            required
                            style={{
                                resize: "vertical",
                                minHeight: "200px",
                            }}
                        />
                    </div>

                    {error && (
                        <div
                            className="p-3 text-sm rounded-sm"
                            style={{
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                color: "var(--color-error)",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-4 pt-4">
                        <Link href="/admin/posts" className="flex-1">
                            <Button variant="secondary" fullWidth type="button">
                                Annuler
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            variant="secondary"
                            fullWidth
                            isLoading={isLoading}
                            className="flex-1"
                            onClick={(e) => {
                                const form = e.currentTarget.closest("form");
                                if (form) {
                                    const hiddenInput = document.createElement("input");
                                    hiddenInput.type = "hidden";
                                    hiddenInput.name = "published";
                                    hiddenInput.value = "false";
                                    form.appendChild(hiddenInput);
                                }
                            }}
                        >
                            Enregistrer brouillon
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            isLoading={isLoading}
                            className="flex-1"
                            onClick={(e) => {
                                const form = e.currentTarget.closest("form");
                                if (form) {
                                    const hiddenInput = document.createElement("input");
                                    hiddenInput.type = "hidden";
                                    hiddenInput.name = "published";
                                    hiddenInput.value = "true";
                                    form.appendChild(hiddenInput);
                                }
                            }}
                        >
                            Publier
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
