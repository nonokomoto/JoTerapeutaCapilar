import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "accent" | "glass";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    loadingText?: string;
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = "primary",
            size = "md",
            isLoading = false,
            loadingText,
            fullWidth = false,
            className = "",
            disabled,
            ...props
        },
        ref
    ) => {
        const baseClass = "btn";
        const variantClass = variant === "glass"
            ? "backdrop-blur-md bg-white/10 hover:bg-white/20 text-foreground border border-white/20 shadow-sm"
            : `btn-${variant}`;
        const widthClass = fullWidth ? "w-full" : "";
        const loadingClass = isLoading ? "btn-loading" : "";

        const sizeClasses = {
            sm: "text-sm px-3 py-2 min-h-[36px]",
            md: "",
            lg: "text-base px-6 py-3 min-h-[52px]",
        };

        const spinnerColor = variant === "primary" || variant === "accent" ? "white" : "muted";

        const spinnerStyle = {
            width: 18,
            height: 18,
            borderWidth: 2,
            borderColor: spinnerColor === "white" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)",
            borderTopColor: spinnerColor === "white" ? "#ffffff" : "var(--color-gray-600)",
        };

        return (
            <button
                ref={ref}
                className={`${baseClass} ${variantClass} ${widthClass} ${sizeClasses[size]} ${loadingClass} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <span className="btn-loading-content">
                        <span className="spinner" style={spinnerStyle} />
                        {loadingText && <span>{loadingText}</span>}
                    </span>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
