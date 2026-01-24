"use client";

import { useState } from "react";
import { AppointmentsCard } from "./AppointmentsCard";
import { AppointmentsModalNew } from "./AppointmentsModalNew";

interface AppointmentsSectionProps {
    clientId: string;
    clientData: {
        first_visit_date: string | null;
        last_appointment_date: string | null;
        next_appointment_date: string | null;
    };
}

export function AppointmentsSection({ clientId, clientData }: AppointmentsSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <AppointmentsCard
                client={clientData}
                onEdit={() => setIsModalOpen(true)}
            />

            <AppointmentsModalNew
                clientId={clientId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
