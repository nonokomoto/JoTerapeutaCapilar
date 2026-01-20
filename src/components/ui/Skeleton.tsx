import { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "text" | "circular" | "rectangular";
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    variant = "text",
    width,
    height,
    className = "",
    style,
    ...props
}: SkeletonProps) {
    const variantStyles = {
        text: {
            height: height || "1em",
            width: width || "100%",
            borderRadius: "var(--radius-xs)",
        },
        circular: {
            width: width || "40px",
            height: height || "40px",
            borderRadius: "var(--radius-full)",
        },
        rectangular: {
            width: width || "100%",
            height: height || "100px",
            borderRadius: "var(--radius-sm)",
        },
    };

    return (
        <div
            className={`skeleton ${className}`}
            style={{
                ...variantStyles[variant],
                ...style,
            }}
            aria-hidden="true"
            {...props}
        />
    );
}

// Convenience components for common use cases
export function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div className={`card card-elevated space-y-4 ${className}`}>
            <Skeleton variant="text" width="60%" height="1.25rem" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
        </div>
    );
}

export function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
    const sizes = {
        sm: "32px",
        md: "40px",
        lg: "56px",
        xl: "80px",
    };

    return <Skeleton variant="circular" width={sizes[size]} height={sizes[size]} />;
}
