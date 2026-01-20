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
            <Card variant="outlined">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">
                            Nova palavra-passe gerada
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClose}
                        >
                            Fechar
                        </Button>
                    </div>

                    <div className="ds-panel">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs ds-text-muted">
                                Email
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(clientEmail, "email")}
                            >
                                {copied === "email" ? "Copiado!" : "Copiar"}
                            </Button>
                        </div>
                        <p className="font-mono text-sm">{clientEmail}</p>
                    </div>

                    <div className="ds-panel">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs ds-text-muted">
                                Palavra-passe
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(password, "password")}
                            >
                                {copied === "password" ? "Copiado!" : "Copiar"}
                            </Button>
                        </div>
                        <p className="font-mono text-sm">{password}</p>
                    </div>

                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={() => copyToClipboard(`Email: ${clientEmail}\nPalavra-passe: ${password}`, "all")}
                    >
                        {copied === "all" ? "Copiado!" : "Copiar tudo"}
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card variant="outlined">
            <h3 className="text-sm font-semibold mb-2">
                Dados de acesso
            </h3>
            <p className="text-sm ds-text-muted mb-3">
                Gere uma nova palavra-passe para o cliente.
            </p>

            {error && (
                <div className="ds-alert-error text-sm mb-3">
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
