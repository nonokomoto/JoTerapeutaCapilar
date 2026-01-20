"use client";

import { useState } from "react";
import { Button, Card } from "@/components/ui";
import { resetClientPasswordAction } from "../actions";

type Props = {
    clientId: string;
    clientEmail: string;
};

export function ResetPasswordButton({ clientId, clientEmail }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    async function handleReset() {
        setIsLoading(true);
        setError(null);

        const result = await resetClientPasswordAction(clientId);

        if (result?.error) {
            setError(result.error);
        } else if (result?.success && result?.password) {
            setPassword(result.password);
        }
        setIsLoading(false);
    }

    function copyToClipboard(text: string, field: string) {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    }

    function handleClose() {
        setPassword(null);
        setError(null);
    }

    // Show password modal
    if (password) {
        return (
            <Card>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3
                            className="text-sm font-semibold"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Nova palavra-passe gerada
                        </h3>
                        <button
                            onClick={handleClose}
                            className="text-sm px-2 py-1 rounded-sm"
                            style={{ backgroundColor: "var(--bg-input)" }}
                        >
                            Fechar
                        </button>
                    </div>

                    <div
                        className="p-3 rounded-sm"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                Email
                            </span>
                            <button
                                onClick={() => copyToClipboard(clientEmail, "email")}
                                className="text-xs px-2 py-0.5 rounded-sm transition-colors"
                                style={{
                                    backgroundColor: copied === "email" ? "var(--color-nude)" : "var(--bg-input)"
                                }}
                            >
                                {copied === "email" ? "Copiado!" : "Copiar"}
                            </button>
                        </div>
                        <p className="font-mono text-sm">{clientEmail}</p>
                    </div>

                    <div
                        className="p-3 rounded-sm"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                                Palavra-passe
                            </span>
                            <button
                                onClick={() => copyToClipboard(password, "password")}
                                className="text-xs px-2 py-0.5 rounded-sm transition-colors"
                                style={{
                                    backgroundColor: copied === "password" ? "var(--color-nude)" : "var(--bg-input)"
                                }}
                            >
                                {copied === "password" ? "Copiado!" : "Copiar"}
                            </button>
                        </div>
                        <p className="font-mono text-sm">{password}</p>
                    </div>

                    <button
                        onClick={() => copyToClipboard(`Email: ${clientEmail}\nPalavra-passe: ${password}`, "all")}
                        className="w-full p-2 rounded-sm text-sm font-medium transition-colors"
                        style={{
                            backgroundColor: copied === "all" ? "var(--color-nude)" : "var(--bg-input)"
                        }}
                    >
                        {copied === "all" ? "Copiado!" : "Copiar tudo"}
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <h3
                className="text-sm font-semibold mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
            >
                Dados de acesso
            </h3>
            <p
                className="text-sm mb-3"
                style={{ color: "var(--text-muted)" }}
            >
                Gere uma nova palavra-passe para o cliente.
            </p>

            {error && (
                <div
                    className="p-2 text-sm rounded-sm mb-3"
                    style={{
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        color: "var(--color-error)",
                    }}
                >
                    {error}
                </div>
            )}

            <Button
                variant="secondary"
                fullWidth
                onClick={handleReset}
                isLoading={isLoading}
            >
                Gerar nova palavra-passe
            </Button>
        </Card>
    );
}
