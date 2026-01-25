"use client";

import { useState } from "react";
import { Modal, Button } from "@/components/ui";
import { updateClientAppointments } from "../actions";
import { CalendarPlus, CalendarCheck, CalendarClock, Save } from "lucide-react";

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
    const [error, setError] = useState<string | null>(null);

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
        setError(null);

        const result = await updateClientAppointments(clientId, {
            first_visit_date: formData.first_visit_date || null,
            last_appointment_date: formData.last_appointment_date || null,
            next_appointment_date: formData.next_appointment_date || null,
        });

        setIsLoading(false);

        if (result.success) {
            onClose();
        } else {
            setError(result.error || "Erro ao guardar marcações");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gerir Marcações">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="first-visit" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <CalendarPlus size={14} style={{ color: '#8B5CF6' }} />
                        Primeira visita
                    </label>
                    <input
                        id="first-visit"
                        type="datetime-local"
                        value={formData.first_visit_date}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            first_visit_date: e.target.value
                        }))}
                        className="input border border-gray-200"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="last-visit" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <CalendarCheck size={14} style={{ color: '#10B981' }} />
                        Última visita
                    </label>
                    <input
                        id="last-visit"
                        type="datetime-local"
                        value={formData.last_appointment_date}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            last_appointment_date: e.target.value
                        }))}
                        className="input border border-gray-200"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label htmlFor="next-visit" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <CalendarClock size={14} style={{ color: '#3B82F6' }} />
                        Próxima marcação
                    </label>
                    <input
                        id="next-visit"
                        type="datetime-local"
                        value={formData.next_appointment_date}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            next_appointment_date: e.target.value
                        }))}
                        className="input border border-gray-200"
                    />
                </div>

                {error && (
                    <div className="ds-alert-error text-sm">{error}</div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        <Save size={16} />
                        Guardar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
