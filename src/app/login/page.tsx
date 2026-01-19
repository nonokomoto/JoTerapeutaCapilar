"use client";

import { useState } from "react";
import { AuthLayout } from "@/components/layouts";
import { Button, Card, Input } from "@/components/ui";
import { login } from "./actions";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
        // If no error, the server action will redirect
    }

    return (
        <AuthLayout>
            <Card elevated>
                <h2
                    className="text-2xl font-bold mb-2 text-center"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    Connexion
                </h2>
                <p
                    className="text-sm mb-6 text-center"
                    style={{ color: "var(--text-muted)" }}
                >
                    Accédez à votre espace personnel
                </p>

                <form action={handleSubmit} className="space-y-4">
                    <Input
                        label="E-mail"
                        name="email"
                        type="email"
                        placeholder="votre@email.com"
                        autoComplete="email"
                        required
                    />

                    <Input
                        label="Mot de passe"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                    />

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

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Se connecter
                    </Button>
                </form>
            </Card>

            <p
                className="text-sm text-center mt-6"
                style={{ color: "var(--text-muted)" }}
            >
                Mot de passe oublié ?{" "}
                <a
                    href="mailto:contact@joterapeutacapilar.com"
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                >
                    Contactez-nous
                </a>
            </p>
        </AuthLayout>
    );
}
