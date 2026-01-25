"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Appointment } from "@/types/database";
import { CalendarClock, Tag, FileText, CheckCircle, Save, Plus } from "lucide-react";

interface AppointmentFormProps {
    clientId: string;
    appointment?: Appointment | null;
    onSubmit: (data: {
        appointment_date: string;
        appointment_type: string;
        notes?: string;
        completed?: boolean;
    }) => Promise<void>;
    onCancel: () => void;
}

export function AppointmentForm({
    clientId,
    appointment,
    onSubmit,
    onCancel
}: AppointmentFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Formatar para datetime-local
    const formatToDatetimeLocal = (isoString: string | null) => {
        if (!isoString) {
            // Default: próxima segunda-feira às 14:00
            const next = new Date();
            next.setDate(next.getDate() + ((1 + 7 - next.getDay()) % 7 || 7));
            next.setHours(14, 0, 0, 0);
            const year = next.getFullYear();
            const month = String(next.getMonth() + 1).padStart(2, '0');
            const day = String(next.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}T14:00`;
        }
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const [formData, setFormData] = useState({
        appointment_date: formatToDatetimeLocal(appointment?.appointment_date || null),
        appointment_type: appointment?.appointment_type || "",
        notes: appointment?.notes || "",
        completed: appointment?.completed || false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Converter datetime-local para ISO string
            const appointmentDate = new Date(formData.appointment_date).toISOString();

            await onSubmit({
                appointment_date: appointmentDate,
                appointment_type: formData.appointment_type,
                notes: formData.notes || undefined,
                completed: formData.completed,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
                <label htmlFor="apt-datetime" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <CalendarClock size={14} style={{ color: '#3B82F6' }} />
                    Data e Hora *
                </label>
                <input
                    id="apt-datetime"
                    type="datetime-local"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        appointment_date: e.target.value
                    }))}
                    required
                    className="input border border-gray-200"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="apt-type" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <Tag size={14} style={{ color: '#8B5CF6' }} />
                    Tipo de Marcação *
                </label>
                <input
                    id="apt-type"
                    type="text"
                    placeholder="Ex: Terapia de Ozono, Avaliação Capilar..."
                    value={formData.appointment_type}
                    onChange={(e) => setFormData(prev => ({
                        ...prev,
                        appointment_type: e.target.value
                    }))}
                    required
                    className="input border border-gray-200"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label htmlFor="apt-notes" className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <FileText size={14} style={{ color: '#10B981' }} />
                    Notas (opcional)
                </label>
                <textarea
                    id="apt-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="Observações sobre esta marcação..."
                    className="input border border-gray-200"
                    style={{ resize: "vertical", minHeight: "80px" }}
                />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                <input
                    type="checkbox"
                    id="completed"
                    checked={formData.completed}
                    onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <CheckCircle size={14} style={{ color: '#10B981' }} />
                <span>Marcar como realizada</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-4 border-t ds-border-subtle">
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {appointment ? <Save size={16} /> : <Plus size={16} />}
                    {appointment ? 'Atualizar' : 'Criar Marcação'}
                </Button>
            </div>
        </form>
    );
}
