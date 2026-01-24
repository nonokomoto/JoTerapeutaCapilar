"use client";

import { Icon, Button } from "@/components/ui";
import { Appointment } from "@/types/database";

interface AppointmentsHistoryProps {
    appointments: Appointment[];
    onEdit: (appointment: Appointment) => void;
    onToggleComplete: (appointmentId: string, completed: boolean) => void;
}

export function AppointmentsHistory({
    appointments,
    onEdit,
    onToggleComplete
}: AppointmentsHistoryProps) {
    // Separar próximas e passadas
    const now = new Date();
    const upcoming = appointments
        .filter(apt => new Date(apt.appointment_date) >= now && !apt.completed)
        .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());

    const past = appointments
        .filter(apt => new Date(apt.appointment_date) < now || apt.completed)
        .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
        .slice(0, 10); // Últimas 10

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
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

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'tratamento': 'Tratamento',
            'consulta': 'Consulta',
            'retorno': 'Retorno',
        };
        return labels[type] || type;
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'tratamento': 'ds-text-brand',
            'consulta': 'ds-text-taupe',
            'retorno': 'ds-text-secondary',
        };
        return colors[type] || 'ds-text-secondary';
    };

    if (appointments.length === 0) {
        return (
            <div className="ds-note-panel">
                <p className="ds-text-muted text-sm text-center">
                    Ainda não existem marcações registadas.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Próximas Marcações */}
            {upcoming.length > 0 && (
                <div>
                    <h4 className="ds-text-primary font-medium mb-3 flex items-center gap-2">
                        <Icon name="calendar" size={16} />
                        Próximas Marcações ({upcoming.length})
                    </h4>
                    <div className="space-y-2">
                        {upcoming.map((apt) => (
                            <AppointmentItem
                                key={apt.id}
                                appointment={apt}
                                onEdit={onEdit}
                                onToggleComplete={onToggleComplete}
                                isUpcoming
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Histórico */}
            {past.length > 0 && (
                <div>
                    <h4 className="ds-text-primary font-medium mb-3 flex items-center gap-2">
                        <Icon name="clock" size={16} />
                        Histórico ({past.length})
                    </h4>
                    <div className="space-y-2">
                        {past.map((apt) => (
                            <AppointmentItem
                                key={apt.id}
                                appointment={apt}
                                onEdit={onEdit}
                                onToggleComplete={onToggleComplete}
                                isUpcoming={false}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function AppointmentItem({
    appointment,
    onEdit,
    onToggleComplete,
    isUpcoming
}: {
    appointment: Appointment;
    onEdit: (apt: Appointment) => void;
    onToggleComplete: (id: string, completed: boolean) => void;
    isUpcoming: boolean;
}) {
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
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

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'tratamento': 'Tratamento',
            'consulta': 'Consulta',
            'retorno': 'Retorno',
        };
        return labels[type] || type;
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            'tratamento': 'ds-text-brand',
            'consulta': 'ds-text-taupe',
            'retorno': 'ds-text-secondary',
        };
        return colors[type] || 'ds-text-secondary';
    };

    // Verificar se é marcação próxima (dentro de 7 dias)
    const appointmentDate = new Date(appointment.appointment_date);
    const now = new Date();
    const daysUntil = Math.ceil((appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const isUpcomingSoon = isUpcoming && daysUntil <= 7 && daysUntil >= 0;

    return (
        <div className={`
            ds-panel p-3
            ${appointment.completed ? 'opacity-75' : ''}
            ${isUpcomingSoon ? 'border-l-4 ds-border-success' : ''}
        `}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        {appointment.completed && (
                            <Icon name="check" size={16} className="ds-text-success flex-shrink-0" />
                        )}
                        {isUpcomingSoon && !appointment.completed && (
                            <Icon name="calendar" size={16} className="ds-text-success flex-shrink-0" />
                        )}
                        <span className={`text-sm font-medium ${isUpcomingSoon ? 'ds-text-success' : 'ds-text-primary'}`}>
                            {formatDateTime(appointment.appointment_date)}
                        </span>
                        {isUpcomingSoon && (
                            <span className="text-xs ds-text-success font-medium">
                                ({daysUntil === 0 ? 'Hoje' : daysUntil === 1 ? 'Amanhã' : `${daysUntil} dias`})
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${getTypeColor(appointment.appointment_type)}`}>
                            {getTypeLabel(appointment.appointment_type)}
                        </span>
                    </div>
                    {appointment.notes && (
                        <p className="ds-text-secondary text-xs mt-2 line-clamp-2">
                            {appointment.notes}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    {isUpcoming && !appointment.completed && (
                        <button
                            onClick={() => onToggleComplete(appointment.id, true)}
                            className="p-1.5 hover:ds-bg-success rounded transition-colors"
                            title="Marcar como realizada"
                        >
                            <Icon name="check" size={16} className="ds-text-success" />
                        </button>
                    )}
                    <button
                        onClick={() => onEdit(appointment)}
                        className="p-1.5 hover:bg-black/5 rounded transition-colors"
                        title="Editar"
                    >
                        <Icon name="edit" size={16} className="ds-text-secondary" />
                    </button>
                </div>
            </div>
        </div>
    );
}
