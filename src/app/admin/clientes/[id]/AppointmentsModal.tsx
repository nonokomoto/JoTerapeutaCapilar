"use client";

import { useState } from "react";
import { Modal, Button, Input } from "@/components/ui";
import { updateClientAppointments } from "../actions";

interface AppointmentsModalProps {
    clientId: string;
    initialData: {
        first_visit_date: string | null;
        last_appointment_date: string | null;
        next_appointment_date: string | null;
    };
    isOpen: boolean;
    onClose: () => void;
}

export function AppointmentsModal({
    clientId,
    initialData,
    isOpen,
    onClose
}: AppointmentsModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Formatar para datetime-local (YYYY-MM-DDTHH:MM)
    const formatToDatetimeLocal = (isoString: string | null) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const [formData, setFormData] = useState({
        first_visit_date: formatToDatetimeLocal(initialData.first_visit_date),
        last_appointment_date: formatToDatetimeLocal(initialData.last_appointment_date),
        next_appointment_date: formatToDatetimeLocal(initialData.next_appointment_date),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await updateClientAppointments(clientId, {
            first_visit_date: formData.first_visit_date || null,
            last_appointment_date: formData.last_appointment_date || null,
            next_appointment_date: formData.next_appointment_date || null,
        });

        setIsLoading(false);

        if (result.success) {
            onClose();
        } else {
            alert(result.error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gerir Marcações">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Primeira visita"
                    type="datetime-local"
                    value={formData.first_visit_date}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        first_visit_date: e.target.value
                    }))}
                />

                <Input
                    label="Última visita"
                    type="datetime-local"
                    value={formData.last_appointment_date}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        last_appointment_date: e.target.value
                    }))}
                />

                <Input
                    label="Próxima marcação"
                    type="datetime-local"
                    value={formData.next_appointment_date}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        next_appointment_date: e.target.value
                    }))}
                />

                <div className="flex gap-3 justify-end pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Guardar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
