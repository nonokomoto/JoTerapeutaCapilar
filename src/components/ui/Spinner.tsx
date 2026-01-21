export interface SpinnerProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    color?: "primary" | "white" | "muted";
}

export function Spinner({ size = "md", className = "", color = "primary" }: SpinnerProps) {
    const sizeMap = {
        sm: "w-4 h-4 border-2",
        md: "w-6 h-6 border-2",
        lg: "w-8 h-8 border-3",
        xl: "w-12 h-12 border-4",
    };

    const colorMap = {
        primary: "border-rose-gold/30 border-t-rose-gold",
        white: "border-white/30 border-t-white",
        muted: "border-gray-300 border-t-gray-600",
    };

    return (
        <div
            className={`spinner ${sizeMap[size]} ${colorMap[color]} ${className}`}
            role="status"
            aria-label="A carregar"
        />
    );
}

// Full page loading overlay
export interface PageLoaderProps {
    message?: string;
}

export function PageLoader({ message = "A carregar..." }: PageLoaderProps) {
    return (
        <div className="page-loader">
            <div className="page-loader-content">
                <Spinner size="xl" />
                <p className="page-loader-text">{message}</p>
            </div>
        </div>
    );
}

// Inline loading for buttons or small areas
export interface LoadingDotsProps {
    className?: string;
}

export function LoadingDots({ className = "" }: LoadingDotsProps) {
    return (
        <span className={`loading-dots ${className}`}>
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
        </span>
    );
}
