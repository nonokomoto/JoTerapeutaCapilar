import { ReactNode } from "react";
import Link from "next/link";
import { Icon, IconName } from "./Icon";
import { Button, ButtonProps } from "./Button";

export interface EmptyStateProps {
    icon?: IconName;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick?: () => void;
        href?: string;
        variant?: ButtonProps["variant"];
    };
    children?: ReactNode;
    className?: string;
}

export function EmptyState({
    icon = "info",
    title,
    description,
    action,
    children,
    className = "",
}: EmptyStateProps) {
    return (
        <div className={`empty-state ${className}`}>
            <div className="empty-state-icon">
                <Icon name={icon} size="xl" />
            </div>
            <h3 className="empty-state-title">{title}</h3>
            {description && (
                <p className="empty-state-description">{description}</p>
            )}
            {action && (
                <div className="empty-state-action">
                    {action.href ? (
                        <Link href={action.href}>
                            <Button variant={action.variant || "primary"}>
                                {action.label}
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            variant={action.variant || "primary"}
                            onClick={action.onClick}
                        >
                            {action.label}
                        </Button>
                    )}
                </div>
            )}
            {children && <div className="empty-state-content">{children}</div>}
        </div>
    );
}
