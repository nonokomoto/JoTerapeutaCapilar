import { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "error" | "info" | "accent";
    size?: "sm" | "md";
}

export function Badge({
    children,
    variant = "default",
    size = "md",
    className = "",
    ...props
}: BadgeProps) {
    const sizeClasses = {
        sm: "text-xs px-2 py-0.5",
        md: "text-xs px-2.5 py-1",
    };

    return (
        <span
            className={`badge badge-${variant} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
}
