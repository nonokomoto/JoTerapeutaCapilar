"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import { createUpdateAction } from "../actions";

interface CreateUpdateFormProps {
    clientId: string;
}

export function CreateUpdateForm({ clientId }: CreateUpdateFormProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        formData.append("client_id", clientId);
        const result = await createUpdateAction(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setIsOpen(false);
            router.refresh();
        }

        setIsLoading(false);
    }

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} fullWidth>
                + Nouvelle mise à jour
            </Button>
        );
    }

    return (
        <Card>
            <h3
                className="text-lg font-semibold mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
            >
                Nouvelle mise à jour
            </h3>

            <form action={handleSubmit} className="space-y-4">
                <Input
                    label="Titre"
                    name="title"
                    placeholder="Ex: Consultation du 15 janvier"
                    required
                />

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="content"
                        className="text-sm font-medium"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        Contenu
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        rows={5}
                        className="input"
                        placeholder="Décrivez les observations, recommandations, progrès..."
                        required
                        style={{
                            resize: "vertical",
                            minHeight: "120px",
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

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setIsOpen(false)}
                        fullWidth
                    >
                        Annuler
                    </Button>
                    <Button type="submit" isLoading={isLoading} fullWidth>
                        Publier
                    </Button>
                </div>
            </form>
        </Card>
    );
}
