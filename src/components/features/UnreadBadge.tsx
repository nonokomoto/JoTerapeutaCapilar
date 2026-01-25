import { Badge } from "@/components/ui";

interface UnreadBadgeProps {
    isUnread: boolean;
}

/**
 * Badge "Novo" para atualizações não lidas
 * Mostra apenas se client_read_at === null
 */
export function UnreadBadge({ isUnread }: UnreadBadgeProps) {
    if (!isUnread) return null;

    return (
        <Badge variant="accent" size="sm" className="unread-badge">
            Novo
        </Badge>
    );
}
