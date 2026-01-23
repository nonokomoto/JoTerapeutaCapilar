import { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "./Icon";

export interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backHref?: string;
    backLabel?: string;
    actions?: ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    subtitle,
    backHref,
    backLabel = "Voltar",
    actions,
    className = "",
}: PageHeaderProps) {
    return (
        <header className={`page-header ${className}`}>
            {backHref && (
                <Link href={backHref} className="page-header-back">
                    <Icon name="arrow-left" size="sm" />
                    <span>{backLabel}</span>
                </Link>
            )}
            <div className="page-header-content">
                <div className="page-header-text">
                    <h1 className="page-header-title">{title}</h1>
                    {subtitle && (
                        <p className="page-header-subtitle">{subtitle}</p>
                    )}
                </div>
                {actions && <div className="page-header-actions">{actions}</div>}
            </div>
        </header>
    );
}

// Section header for use within pages
export interface SectionHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function SectionHeader({
    title,
    description,
    action,
    className = "",
}: SectionHeaderProps) {
    return (
        <div className={`section-header ${className}`}>
            <div className="section-header-text">
                <h2 className="section-header-title">{title}</h2>
                {description && (
                    <p className="section-header-description">{description}</p>
                )}
            </div>
            {action && <div className="section-header-action">{action}</div>}
        </div>
    );
}
