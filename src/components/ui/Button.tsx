import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    isLoading?: boolean;
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = "primary",
            isLoading = false,
            fullWidth = false,
            className = "",
            disabled,
            ...props
        },
        ref
    ) => {
        const baseClass = "btn";
        const variantClass = variant === "secondary" ? "btn-secondary" : "btn-primary";
        const widthClass = fullWidth ? "w-full" : "";

        return (
            <button
                ref={ref}
                className={`${baseClass} ${variantClass} ${widthClass} ${className}`}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <span className="spinner" style={{ width: 18, height: 18 }} />
                        <span>Chargement...</span>
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
