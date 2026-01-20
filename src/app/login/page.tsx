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
                    Iniciar sessão
                </h2>
                <p
                    className="text-sm mb-6 text-center"
                    style={{ color: "var(--text-muted)" }}
                >
                    Aceda à sua área pessoal
                </p>

                <form action={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        autoComplete="email"
                        required
                    />

                    <Input
                        label="Palavra-passe"
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
                        Entrar
                    </Button>
                </form>
            </Card>

            <p
                className="text-sm text-center mt-6"
                style={{ color: "var(--text-muted)" }}
            >
                Esqueceu a palavra-passe?{" "}
                <a
                    href="mailto:contact@joterapeutacapilar.com"
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                >
                    Contacte-nos
                </a>
            </p>
        </AuthLayout>
    );
}
