import { Badge } from "./Badge";
import type { ClientStatus } from "@/types/database";

interface ClientStatusBadgeProps {
    status: ClientStatus;
    size?: "sm" | "md";
}

const STATUS_CONFIG = {
    com_marcacao: { label: "Com marcação", variant: "success" as const },
    sem_marcacao: { label: "Sem marcação", variant: "warning" as const },
};

export function ClientStatusBadge({
    status,
    size = "sm"
}: ClientStatusBadgeProps) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.sem_marcacao;
    return <Badge variant={config.variant} size={size}>{config.label}</Badge>;
}
