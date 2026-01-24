"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Input, TextArea, PageHeader, Icon } from "@/components/ui";
import { useCreateClient } from "@/lib/queries";

type Credentials = {
    email: string;
    password: string;
};

export default function NovoCliente() {
    const [credentials, setCredentials] = useState<Credentials | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const createClient = useCreateClient();

    async function handleSubmit(formData: FormData) {
        try {
            const result = await createClient.mutateAsync(formData);
            if (result?.success && result?.credentials) {
                setCredentials(result.credentials);
            }
        } catch {
            // Error is handled by mutation state
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
                        <div className="credentials-success-icon">
                            <Icon name="check" size="lg" />
                        </div>
                        <h1 className="credentials-title">Cliente criado com sucesso</h1>
                        <p className="ds-text-muted">
                            Guarde ou partilhe os dados de acesso com o cliente
                        </p>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="credentials-field">
                            <div className="credentials-field-header">
                                <span className="text-sm font-medium">Email</span>
                                <button
                                    onClick={() => copyToClipboard(credentials.email, "email")}
                                    className={`credentials-copy-btn ${copied === "email" ? "copied" : ""}`}
                                >
                                    {copied === "email" ? "Copiado!" : "Copiar"}
                                </button>
                            </div>
                            <p className="font-mono text-sm">{credentials.email}</p>
                        </div>

                        <div className="credentials-field">
                            <div className="credentials-field-header">
                                <span className="text-sm font-medium">Palavra-passe temporária</span>
                                <button
                                    onClick={() => copyToClipboard(credentials.password, "password")}
                                    className={`credentials-copy-btn ${copied === "password" ? "copied" : ""}`}
                                >
                                    {copied === "password" ? "Copiado!" : "Copiar"}
                                </button>
                            </div>
                            <p className="font-mono text-sm">{credentials.password}</p>
                        </div>

                        <button
                            onClick={() => copyToClipboard(`Email: ${credentials.email}\nPalavra-passe: ${credentials.password}`, "all")}
                            className={`credentials-copy-all ${copied === "all" ? "copied" : ""}`}
                        >
                            {copied === "all" ? "Copiado!" : "Copiar tudo"}
                        </button>
                    </div>

                    <div className="mt-6 pt-4 border-t ds-border-default">
                        <Link href="/admin/clientes">
                            <Button fullWidth>Voltar à lista de clientes</Button>
                        </Link>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <PageHeader
                title="Novo cliente"
                subtitle="Crie uma conta para um novo cliente"
                backHref="/admin/clientes"
                backLabel="Voltar"
            />

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

                    <Input
                        label="Primeira visita"
                        name="first_visit_date"
                        type="date"
                        hint="Data da primeira consulta/tratamento (opcional)"
                    />

                    <TextArea
                        label="Notas (privadas)"
                        name="notes"
                        rows={4}
                        placeholder="Notas internas sobre este cliente..."
                    />

                    {createClient.error && (
                        <div className="ds-alert-error">{createClient.error.message}</div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <Link href="/admin/clientes" className="flex-1">
                            <Button variant="secondary" fullWidth type="button">
                                Cancelar
                            </Button>
                        </Link>
                        <Button fullWidth type="submit" isLoading={createClient.isPending} className="flex-1">
                            Criar cliente
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Info */}
            <div className="ds-note-panel">
                <p className="font-medium mb-1">Como funciona?</p>
                <p className="ds-text-muted text-sm">
                    Será gerada uma palavra-passe temporária que deverá comunicar ao cliente.
                </p>
            </div>
        </div>
    );
}
