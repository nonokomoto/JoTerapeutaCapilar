"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Button, Input, TextArea } from "@/components/ui";
import { Pencil, X } from "lucide-react";
import { updateClientAction } from "../actions";

interface EditClientModalProps {
    client: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        notes: string | null;
    };
}

export function EditClientModal({ client }: EditClientModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

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
        setError(null);
    }

    async function handleSubmit(formData: FormData) {
        setError(null);
        formData.append("client_id", client.id);

        startTransition(async () => {
            const result = await updateClientAction(formData);
            if (result?.error) {
                setError(result.error);
            } else {
                handleClose();
            }
        });
    }

    return (
        <>
            {/* Trigger Button */}
            <Button onClick={() => setIsOpen(true)} variant="secondary" size="sm">
                <Pencil size={16} />
                Editar
            </Button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="modal-overlay" onClick={handleClose}>
                    {/* Modal Content */}
                    <div
                        ref={modalRef}
                        className="modal-content"
                        style={{ maxWidth: "480px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Editar Cliente</h2>
                                <p className="text-sm ds-text-muted mt-1">
                                    Atualizar dados de {client.name}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="modal-close-btn"
                                aria-label="Fechar"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form action={handleSubmit}>
                            <div className="modal-body space-y-4">
                                <Input
                                    label="Nome completo *"
                                    name="name"
                                    defaultValue={client.name}
                                    placeholder="Maria Silva"
                                    required
                                />

                                <Input
                                    label="E-mail *"
                                    name="email"
                                    type="email"
                                    defaultValue={client.email}
                                    placeholder="maria@example.com"
                                    required
                                />

                                <Input
                                    label="Telefone"
                                    name="phone"
                                    type="tel"
                                    defaultValue={client.phone || ""}
                                    placeholder="+351 912 345 678"
                                />

                                <TextArea
                                    label="Notas (privadas)"
                                    name="notes"
                                    rows={3}
                                    defaultValue={client.notes || ""}
                                    placeholder="Notas internas sobre este cliente..."
                                />

                                {error && (
                                    <div className="ds-alert-error">{error}</div>
                                )}
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
                                    type="submit"
                                    isLoading={isPending}
                                >
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
