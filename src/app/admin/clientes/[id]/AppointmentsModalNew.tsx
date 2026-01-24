"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Icon, IconName, ConfirmDialog } from "@/components/ui";
import { AppointmentsHistory } from "./AppointmentsHistory";
import { AppointmentForm } from "./AppointmentForm";
import { Appointment } from "@/types/database";
import {
    getClientAppointments,
    createAppointment,
    updateAppointment,
    toggleAppointmentComplete,
    deleteAppointment,
} from "../actions";

interface AppointmentsModalNewProps {
    clientId: string;
    isOpen: boolean;
    onClose: () => void;
}

type Tab = "upcoming" | "history" | "new" | "edit";

export function AppointmentsModalNew({
    clientId,
    isOpen,
    onClose
}: AppointmentsModalNewProps) {
    const [activeTab, setActiveTab] = useState<Tab>("upcoming");
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [deletingAppointmentId, setDeletingAppointmentId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Carregar marcações quando o modal abre
    useEffect(() => {
        if (isOpen) {
            loadAppointments();
        }
    }, [isOpen, clientId]);

    const loadAppointments = async () => {
        const result = await getClientAppointments(clientId);
        if (result.success && result.data) {
            setAppointments(result.data);
        }
    };

    const handleCreateAppointment = async (data: {
        appointment_date: string;
        appointment_type: string;
        notes?: string;
        completed?: boolean;
    }) => {
        const result = await createAppointment({
            client_id: clientId,
            ...data,
        });

        if (result.success) {
            await loadAppointments();
            setActiveTab("upcoming");
        } else {
            alert(result.error);
        }
    };

    const handleUpdateAppointment = async (data: {
        appointment_date: string;
        appointment_type: string;
        notes?: string;
        completed?: boolean;
    }) => {
        if (!editingAppointment) return;

        const result = await updateAppointment(editingAppointment.id, data);

        if (result.success) {
            await loadAppointments();
            setEditingAppointment(null);
            setActiveTab("upcoming");
        } else {
            alert(result.error);
        }
    };

    const handleToggleComplete = async (appointmentId: string, completed: boolean) => {
        const result = await toggleAppointmentComplete(appointmentId, completed);

        if (result.success) {
            await loadAppointments();
        } else {
            alert(result.error);
        }
    };

    const handleCancelAppointment = async () => {
        if (!deletingAppointmentId) return;

        setIsLoading(true);
        const result = await deleteAppointment(deletingAppointmentId);
        setIsLoading(false);

        if (result.success) {
            await loadAppointments();
            setDeletingAppointmentId(null);
            onClose();
        } else {
            alert(result.error);
        }
    };

    const handleEdit = (appointment: Appointment) => {
        setEditingAppointment(appointment);
        setActiveTab("edit");
    };

    const handleCancelForm = () => {
        setEditingAppointment(null);
        setActiveTab("upcoming");
    };

    // Separar próximas e passadas para contadores
    const now = new Date();
    const upcomingCount = appointments.filter(
        apt => new Date(apt.appointment_date) >= now && !apt.completed
    ).length;
    const historyCount = appointments.filter(
        apt => new Date(apt.appointment_date) < now || apt.completed
    ).length;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Gerir Marcações"
                size="lg"
            >
                {/* Tabs */}
                {activeTab !== "edit" && (
                    <div className="flex gap-2 mb-6 pb-4 border-b ds-border-subtle">
                        <TabButton
                            active={activeTab === "upcoming"}
                            onClick={() => setActiveTab("upcoming")}
                            icon="calendar"
                            label="Próximas"
                            count={upcomingCount}
                        />
                        <TabButton
                            active={activeTab === "history"}
                            onClick={() => setActiveTab("history")}
                            icon="clock"
                            label="Histórico"
                            count={historyCount}
                        />
                        <TabButton
                            active={activeTab === "new"}
                            onClick={() => setActiveTab("new")}
                            icon="plus"
                            label="Nova"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="min-h-[300px]">
                    {(activeTab === "upcoming" || activeTab === "history") && (
                        <AppointmentsHistory
                            appointments={appointments}
                            onEdit={handleEdit}
                            onToggleComplete={handleToggleComplete}
                            onDelete={(id) => setDeletingAppointmentId(id)}
                        />
                    )}

                    {activeTab === "new" && (
                        <div>
                            <h3 className="ds-text-primary font-medium mb-4">
                                Nova Marcação
                            </h3>
                            <AppointmentForm
                                clientId={clientId}
                                onSubmit={handleCreateAppointment}
                                onCancel={handleCancelForm}
                            />
                        </div>
                    )}

                    {activeTab === "edit" && editingAppointment && (
                        <div>
                            <h3 className="ds-text-primary font-medium mb-4">
                                Editar Marcação
                            </h3>
                            <AppointmentForm
                                clientId={clientId}
                                appointment={editingAppointment}
                                onSubmit={handleUpdateAppointment}
                                onCancel={handleCancelForm}
                            />
                        </div>
                    )}
                </div>
            </Modal>

            <ConfirmDialog
                isOpen={!!deletingAppointmentId}
                onClose={() => setDeletingAppointmentId(null)}
                onConfirm={handleCancelAppointment}
                title="Cancelar Marcação"
                message="Tem a certeza que deseja cancelar esta marcação? Esta ação irá remover o registo e criar uma atualização na linha do tempo do cliente."
                confirmText="Sim, cancelar"
                cancelText="Não, manter"
                variant="danger"
                isLoading={isLoading}
            />
        </>
    );
}

function TabButton({
    active,
    onClick,
    icon,
    label,
    count
}: {
    active: boolean;
    onClick: () => void;
    icon: IconName;
    label: string;
    count?: number;
}) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${active
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'ds-bg-secondary ds-text-secondary hover:ds-bg-muted'
                }
            `}
        >
            <Icon name={icon} size={16} />
            <span>{label}</span>
            {count !== undefined && count > 0 && (
                <span className={`
                    text-xs px-1.5 py-0.5 rounded-full
                    ${active ? 'bg-white/20' : 'ds-bg-muted'}
                `}>
                    {count}
                </span>
            )}
        </button>
    );
}
