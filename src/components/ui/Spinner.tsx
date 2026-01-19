export interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
    const sizeMap = {
        sm: { width: 16, height: 16, borderWidth: 2 },
        md: { width: 24, height: 24, borderWidth: 2 },
        lg: { width: 32, height: 32, borderWidth: 3 },
    };

    const { width, height, borderWidth } = sizeMap[size];

    return (
        <div
            className={`spinner ${className}`}
            style={{ width, height, borderWidth }}
            role="status"
            aria-label="Chargement"
        />
    );
}
