import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "accent" | "glass";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = "primary",
            size = "md",
            isLoading = false,
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

        const sizeClasses = {
            sm: "text-sm px-3 py-2 min-h-[36px]",
            md: "",
            lg: "text-base px-6 py-3 min-h-[52px]",
        };

        return (
            <button
                ref={ref}
                className={`${baseClass} ${variantClass} ${widthClass} ${sizeClasses[size]} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <span className="spinner" style={{ width: 18, height: 18 }} />
                        <span>A carregar...</span>
                    </>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
