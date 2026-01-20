"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Input } from "@/components/ui";
import { createClientAction } from "../actions";

type Credentials = {
    email: string;
    password: string;
};

export default function NovoCliente() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [credentials, setCredentials] = useState<Credentials | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        const result = await createClientAction(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result?.success && result?.credentials) {
            setCredentials(result.credentials);
            setIsLoading(false);
        }
    }

    function copyToClipboard(text: string, field: string) {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    }

    // Show credentials after successful creation
    if (credentials) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                    <div className="text-center space-y-4">
                        <div
                            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "var(--color-nude)" }}
                        >
                            <span className="text-2xl">✓</span>
                        </div>
                        <h1
                            className="text-2xl font-bold"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Cliente criado com sucesso
                        </h1>
                        <p style={{ color: "var(--text-muted)" }}>
                            Guarde ou partilhe os dados de acesso com o cliente
                        </p>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div
                            className="p-4 rounded-sm"
                            style={{ backgroundColor: "var(--bg-secondary)" }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Email</span>
                                <button
                                    onClick={() => copyToClipboard(credentials.email, "email")}
                                    className="text-xs px-2 py-1 rounded-sm transition-colors"
                                    style={{
                                        backgroundColor: copied === "email" ? "var(--color-nude)" : "var(--bg-input)"
                                    }}
                                >
                                    {copied === "email" ? "Copiado!" : "Copiar"}
                                </button>
                            </div>
                            <p className="font-mono text-sm">{credentials.email}</p>
                        </div>

                        <div
                            className="p-4 rounded-sm"
                            style={{ backgroundColor: "var(--bg-secondary)" }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Palavra-passe temporária</span>
                                <button
                                    onClick={() => copyToClipboard(credentials.password, "password")}
                                    className="text-xs px-2 py-1 rounded-sm transition-colors"
                                    style={{
                                        backgroundColor: copied === "password" ? "var(--color-nude)" : "var(--bg-input)"
                                    }}
                                >
                                    {copied === "password" ? "Copiado!" : "Copiar"}
                                </button>
                            </div>
                            <p className="font-mono text-sm">{credentials.password}</p>
                        </div>

                        <button
                            onClick={() => copyToClipboard(`Email: ${credentials.email}\nPalavra-passe: ${credentials.password}`, "all")}
                            className="w-full p-3 rounded-sm text-sm font-medium transition-colors"
                            style={{
                                backgroundColor: copied === "all" ? "var(--color-nude)" : "var(--bg-input)"
                            }}
                        >
                            {copied === "all" ? "Copiado!" : "Copiar tudo"}
                        </button>
                    </div>

                    <div className="mt-6 pt-4 border-t" style={{ borderColor: "var(--border-color)" }}>
                        <Link href="/admin/clientes">
                            <Button fullWidth>
                                Voltar à lista de clientes
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
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
                        Novo cliente
                    </h1>
                    <p style={{ color: "var(--text-muted)" }}>
                        Crie uma conta para um novo cliente
                    </p>
                </div>
            </div>

            {/* Form */}
            <Card>
                <form action={handleSubmit} className="space-y-4">
                    <Input
                        label="Nome completo *"
                        name="name"
                        placeholder="Maria Silva"
                        required
                    />

                    <Input
                        label="E-mail *"
                        name="email"
                        type="email"
                        placeholder="maria@example.com"
                        required
                    />

                    <Input
                        label="Telefone"
                        name="phone"
                        type="tel"
                        placeholder="+351 912 345 678"
                    />

                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="notes"
                            className="text-sm font-medium"
                            style={{ fontFamily: "var(--font-sans)" }}
                        >
                            Notas (privadas)
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={4}
                            className="input"
                            placeholder="Notas internas sobre este cliente..."
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
                                Cancelar
                            </Button>
                        </Link>
                        <Button fullWidth type="submit" isLoading={isLoading} className="flex-1">
                            Criar cliente
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
                <p className="font-medium mb-1">Como funciona?</p>
                <p style={{ color: "var(--text-muted)" }}>
                    Será gerada uma palavra-passe temporária que deverá comunicar ao cliente.
                </p>
            </div>
        </div>
    );
}
