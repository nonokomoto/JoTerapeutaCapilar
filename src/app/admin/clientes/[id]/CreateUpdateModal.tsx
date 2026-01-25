"use client";

import { useState } from "react";
import { Button, Modal } from "@/components/ui";
import { CreateUpdateForm } from "./CreateUpdateForm";
import { Plus } from "lucide-react";

interface CreateUpdateModalProps {
    clientId: string;
    clientName: string;
}

export function CreateUpdateModal({ clientId, clientName }: CreateUpdateModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    function handleClose() {
        setIsOpen(false);
    }

    return (
        <>
            <Button onClick={() => setIsOpen(true)} size="sm">
                <Plus size={16} />
                Nova Atualização
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title="Nova Atualização"
                subtitle={`Para ${clientName}`}
                size="lg"
            >
                <CreateUpdateForm
                    clientId={clientId}
                    onSuccess={handleClose}
                    compact
                />
            </Modal>
        </>
    );
}
