"use client";

import { useState, useTransition } from "react";
import { Button, Modal } from "@/components/ui";
import { Pencil, User, Mail, Phone, FileText, Save } from "lucide-react";
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

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Editar Cliente"
                subtitle={`Atualizar dados de ${client.name}`}
            >
                <form action={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="edit-name" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <User size={14} style={{ color: '#8B5CF6' }} />
                            Nome completo *
                        </label>
                        <input
                            id="edit-name"
                            name="name"
                            defaultValue={client.name}
                            placeholder="Maria Silva"
                            required
                            className="input border border-gray-200"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="edit-email" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <Mail size={14} style={{ color: '#3B82F6' }} />
                            E-mail *
                        </label>
                        <input
                            id="edit-email"
                            name="email"
                            type="email"
                            defaultValue={client.email}
                            placeholder="maria@example.com"
                            required
                            className="input border border-gray-200"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="edit-phone" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <Phone size={14} style={{ color: '#10B981' }} />
                            Telefone
                        </label>
                        <input
                            id="edit-phone"
                            name="phone"
                            type="tel"
                            defaultValue={client.phone || ""}
                            placeholder="+351 912 345 678"
                            className="input border border-gray-200"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="edit-notes" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                            <FileText size={14} style={{ color: '#F59E0B' }} />
                            Notas (privadas)
                        </label>
                        <textarea
                            id="edit-notes"
                            name="notes"
                            rows={3}
                            defaultValue={client.notes || ""}
                            placeholder="Notas internas sobre este cliente..."
                            className="input border border-gray-200"
                            style={{ resize: "vertical", minHeight: "80px" }}
                        />
                    </div>

                    {error && (
                        <div className="ds-alert-error text-sm">{error}</div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
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
                            <Save size={16} />
                            Guardar
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
