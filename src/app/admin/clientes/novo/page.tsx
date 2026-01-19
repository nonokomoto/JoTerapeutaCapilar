"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Input } from "@/components/ui";
import { createClientAction } from "../actions";

export default function NovoCliente() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        const result = await createClientAction(formData);

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
                    href="/admin/clientes"
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
                        Nouveau client
                    </h1>
                    <p style={{ color: "var(--text-muted)" }}>
                        Créez un compte pour un nouveau client
                    </p>
                </div>
            </div>

            {/* Form */}
            <Card>
                <form action={handleSubmit} className="space-y-4">
                    <Input
                        label="Nom complet *"
                        name="name"
                        placeholder="Marie Dupont"
                        required
                    />

                    <Input
                        label="E-mail *"
                        name="email"
                        type="email"
                        placeholder="marie@example.com"
                        required
                    />

                    <Input
                        label="Téléphone"
                        name="phone"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                    />

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="notes"
                            className="text-sm font-medium"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Notes (privées)
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={4}
                            className="input"
                            placeholder="Notes internes sur ce client..."
                            style={{
                                resize: "vertical",
                                minHeight: "100px",
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

                    <div className="flex gap-4 pt-4">
                        <Link href="/admin/clientes" className="flex-1">
                            <Button variant="secondary" fullWidth type="button">
                                Annuler
                            </Button>
                        </Link>
                        <Button fullWidth type="submit" isLoading={isLoading} className="flex-1">
                            Créer le client
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Info */}
            <div
                className="p-4 rounded-sm text-sm"
                style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                }}
            >
                <p className="font-medium mb-1">💡 Comment ça marche ?</p>
                <p style={{ color: "var(--text-muted)" }}>
                    Un compte sera créé pour le client avec un mot de passe temporaire.
                    Vous devrez leur communiquer leurs identifiants de connexion.
                </p>
            </div>
        </div>
    );
}
