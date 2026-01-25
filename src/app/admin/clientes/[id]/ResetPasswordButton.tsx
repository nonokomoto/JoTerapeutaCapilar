"use client";

import { useState } from "react";
import { Button, Icon } from "@/components/ui";
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
            <div className="sidebar-widget">
                <div className="sidebar-widget-header">
                    <div className="sidebar-widget-icon">
                        <Icon name="key" size={16} />
                    </div>
                    <h3 className="sidebar-widget-title">Nova palavra-passe</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                    >
                        Fechar
                    </Button>
                </div>

                <div className="space-y-3">
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
            </div>
        );
    }

    return (
        <div className="sidebar-widget">
            <div className="sidebar-widget-header">
                <div className="sidebar-widget-icon">
                    <Icon name="key" size={16} />
                </div>
                <h3 className="sidebar-widget-title">Dados de acesso</h3>
            </div>

            <p className="sidebar-widget-description">
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
        </div>
    );
}
