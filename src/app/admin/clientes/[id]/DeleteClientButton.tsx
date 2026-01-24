"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { useDeleteClient } from "@/lib/queries";

interface DeleteClientButtonProps {
    clientId: string;
    clientName: string;
    updateCount: number;
}

export function DeleteClientButton({ clientId, clientName, updateCount }: DeleteClientButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmName, setConfirmName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const deleteClient = useDeleteClient();

    // Flexible name matching: accepts first name, full name, or any part
    // Normalizes by trimming spaces and comparing lowercase
    const normalizedInput = confirmName.trim().toLowerCase();
    const normalizedFullName = clientName.trim().toLowerCase();
    const nameParts = normalizedFullName.split(/\s+/); // Split by any whitespace
    const firstName = nameParts[0];

    // Accept: full name, first name, or any individual name part
    const isConfirmed = normalizedInput.length >= 2 && (
        normalizedInput === normalizedFullName ||
        normalizedInput === firstName ||
        nameParts.includes(normalizedInput)
    );

    // Close on Escape key
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    function handleClose() {
        setIsOpen(false);
        setConfirmName("");
        setError(null);
    }

    async function handleDelete() {
        if (!isConfirmed) return;

        setError(null);
        try {
            await deleteClient.mutateAsync(clientId);
            // On success, redirect to clients list
            router.push("/admin/clientes");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao eliminar cliente");
        }
    }

    return (
        <>
            {/* Trigger Button */}
            <Button
                onClick={() => setIsOpen(true)}
                variant="secondary"
                size="sm"
                className="delete-client-btn"
            >
                <Trash2 size={16} />
                Eliminar
            </Button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="modal-overlay" onClick={handleClose}>
                    {/* Modal Content */}
                    <div
                        ref={modalRef}
                        className="modal-content"
                        style={{ maxWidth: "420px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="modal-header">
                            <div className="flex items-center gap-3">
                                <div className="confirm-dialog-icon" style={{
                                    width: "40px",
                                    height: "40px",
                                    margin: 0,
                                    backgroundColor: "var(--color-error-bg)"
                                }}>
                                    <AlertTriangle size={20} className="ds-text-error" />
                                </div>
                                <h2 className="modal-title">Eliminar Cliente</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="modal-close-btn"
                                aria-label="Fechar"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="modal-body">
                            <div className="space-y-4">
                                <p className="ds-text-primary">
                                    Tem a certeza que deseja eliminar <strong>{clientName}</strong>?
                                </p>

                                <div className="ds-panel">
                                    <p className="text-sm ds-text-secondary mb-2">
                                        Esta ação é irreversível e irá eliminar:
                                    </p>
                                    <ul className="text-sm ds-text-muted list-disc list-inside space-y-1">
                                        <li>O perfil do cliente</li>
                                        <li>{updateCount} atualização{updateCount !== 1 ? "ões" : ""} e respetivos anexos</li>
                                        <li>Todos os ficheiros associados</li>
                                    </ul>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium ds-text-secondary mb-2">
                                        Para confirmar, escreva o primeiro nome ou nome completo:
                                    </label>
                                    <Input
                                        value={confirmName}
                                        onChange={(e) => setConfirmName(e.target.value)}
                                        placeholder={firstName || clientName}
                                    />
                                </div>

                                {error && (
                                    <div className="ds-alert-error">{error}</div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                onClick={handleDelete}
                                disabled={!isConfirmed}
                                isLoading={deleteClient.isPending}
                                className={isConfirmed ? "btn-danger" : ""}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
