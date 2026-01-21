"use client";

import { useState } from "react";
import Image from "next/image";
import { AuthLayout } from "@/components/layouts";
import { Button, Card, Input } from "@/components/ui";
import { login } from "./actions";

// Logo icon component
function LogoIcon() {
    return (
        <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
                background: "linear-gradient(135deg, var(--color-rose-gold) 0%, var(--color-terracotta) 100%)",
                boxShadow: "var(--shadow-md)",
            }}
        >
            <span className="text-white text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>
                Jo
            </span>
        </div>
    );
}

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
        // If no error, the server action will redirect
    }

    return (
        <AuthLayout>
            <Card variant="elevated" className="w-full">
                {/* Logo Icon */}
                <LogoIcon />

                {/* Brand Title */}
                <h1
                    className="text-xl font-bold text-center"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    Jo Terapeuta Capilar
                </h1>

                {/* Subtitle */}
                <p
                    className="text-sm text-center mb-6"
                    style={{ color: "var(--text-muted)" }}
                >
                    Aceda à sua conta
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            className="p-3 text-sm rounded-md"
                            style={{
                                backgroundColor: "var(--color-error-bg)",
                                color: "var(--color-error)",
                            }}
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Iniciar sessão
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
