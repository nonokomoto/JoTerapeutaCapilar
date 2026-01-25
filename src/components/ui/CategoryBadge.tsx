import { Badge } from "./Badge";
import { Icon, IconName } from "./Icon";
import { UpdateCategory } from "@/types/database";

interface CategoryBadgeProps {
    category: UpdateCategory;
    size?: "sm" | "md";
}

// Mapeamento de categoria para badge variant e ícone
const CATEGORY_CONFIG: Record<UpdateCategory, {
    label: string;
    variant: "success" | "info" | "accent" | "warning" | "default";
    icon: IconName;
}> = {
    evolucao: {
        label: "Evolução",
        variant: "success",
        icon: "trending-up"
    },
    rotina: {
        label: "Rotina",
        variant: "info",
        icon: "calendar"
    },
    recomendacao: {
        label: "Recomendação",
        variant: "accent",
        icon: "lightbulb"
    },
    agendamento: {
        label: "Agendamento",
        variant: "warning",
        icon: "clock"
    },
    outro: {
        label: "Outro",
        variant: "default",
        icon: "file-text"
    }
};

export function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
    const config = CATEGORY_CONFIG[category];

    return (
        <Badge variant={config.variant} size={size}>
            <Icon name={config.icon} size={size === "sm" ? 12 : 14} />
            {config.label}
        </Badge>
    );
}
