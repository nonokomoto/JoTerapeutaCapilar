"use client";

import { HTMLAttributes } from "react";

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
    label: string;
    value: string | number;
    description?: string;
    trend?: {
        value: string;
        positive: boolean;
    };
    icon?: React.ReactNode;
    accentColor?: "rose" | "sage" | "terracotta" | "default";
}

// These map to CSS custom properties defined in src/app/styles.css
const accentColorVars = {
    default: {
        icon: "var(--color-gray-500)",
        bar: "var(--color-rose-gold)",
    },
    rose: {
        icon: "var(--color-rose-gold)",
        bar: "var(--color-rose-gold)",
    },
    sage: {
        icon: "var(--color-sage)",
        bar: "var(--color-sage)",
    },
    terracotta: {
        icon: "var(--color-terracotta)",
        bar: "var(--color-terracotta)",
    },
};

export function StatCard(allProps: StatCardProps) {
    const {
        label,
        value,
        description,
        trend,
        icon,
        accentColor = "default",
        className = "",
        style,
        ...props
    } = allProps;

    const colors = accentColorVars[accentColor];

    return (
        <div
            className={`stat-card ${className}`}
            style={style}
            {...props}
        >
            {/* Header */}
            <div className="stat-card-header">
                {icon && (
                    <div className="stat-card-icon" style={{ color: colors.icon }}>
                        {icon}
                    </div>
                )}
                <div>
                    <span className="stat-card-label">{label}</span>
                    {description && (
                        <span className="stat-card-description">{description}</span>
                    )}
                </div>
            </div>

            {/* Value */}
            <div className="stat-card-value-row">
                <span className="stat-card-value">{value}</span>
                {trend && (
                    <span className={`stat-card-trend ${trend.positive ? 'positive' : 'negative'}`}>
                        {trend.positive ? '↑' : '↓'} {trend.value}
                    </span>
                )}
            </div>

            {/* Progress bar */}
            <div className="stat-card-progress">
                <div className="stat-card-progress-bar" style={{ background: colors.bar }} />
            </div>
        </div>
    );
}
