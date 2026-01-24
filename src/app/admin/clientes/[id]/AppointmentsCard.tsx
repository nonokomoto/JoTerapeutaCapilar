"use client";

import { Icon, Button } from "@/components/ui";
import { ClientStatusBadge } from "@/components/ui/ClientStatusBadge";
import { calculateClientStatus } from "@/lib/utils/clientStatus";

interface AppointmentsCardProps {
    client: {
        first_visit_date: string | null;
        last_appointment_date: string | null;
        next_appointment_date: string | null;
    };
    onEdit: () => void;
}

export function AppointmentsCard({ client, onEdit }: AppointmentsCardProps) {
    const status = calculateClientStatus(client);

    return (
        <div className="client-appointments-card">
            <div className="client-appointments-header">
                <div className="client-appointments-icon">
                    <Icon name="calendar" size={16} />
                </div>
                <h3 className="client-appointments-title">Marcações</h3>
                <ClientStatusBadge status={status} />
            </div>

            <div className="client-appointments-content">
                <AppointmentRow
                    label="Próxima marcação"
                    date={client.next_appointment_date}
                    highlight
                />
                <AppointmentRow
                    label="Primeira visita"
                    date={client.first_visit_date}
                />
                <AppointmentRow
                    label="Última visita"
                    date={client.last_appointment_date}
                />
            </div>

            <Button variant="secondary" size="sm" onClick={onEdit} className="w-full">
                <Icon name="edit" size={14} className="mr-2" />
                Gerir Marcações
            </Button>
        </div>
    );
}

function AppointmentRow({
    label,
    date,
    highlight = false
}: {
    label: string;
    date: string | null;
    highlight?: boolean;
}) {
    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString);
        const dateStr = date.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('pt-PT', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${dateStr} às ${timeStr}`;
    };

    return (
        <div className={`client-appointment-row ${highlight ? 'highlight' : ''}`}>
            <span className="client-appointment-label">{label}</span>
            <span className="client-appointment-value">
                {date
                    ? formatDateTime(date)
                    : 'Não definida'
                }
            </span>
        </div>
    );
}
