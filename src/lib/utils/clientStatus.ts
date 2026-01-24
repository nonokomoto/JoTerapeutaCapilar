import type { ClientStatus } from "@/types/database";

interface StatusInput {
    next_appointment_date: string | null;
}

/**
 * Calcula o status do cliente dinamicamente
 * - com_marcacao: tem marcação futura agendada
 * - sem_marcacao: sem marcação futura
 */
export function calculateClientStatus(client: StatusInput): ClientStatus {
    const now = new Date();

    const hasNextAppointment = client.next_appointment_date &&
        new Date(client.next_appointment_date) >= now;

    return hasNextAppointment ? "com_marcacao" : "sem_marcacao";
}
