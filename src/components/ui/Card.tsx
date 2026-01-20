import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "elevated" | "outlined" | "ghost" | "default" | "glass";
    interactive?: boolean;
    elevated?: boolean; // Legacy support - do not use, use variant="elevated" instead
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ children, variant = "default", interactive = false, elevated, className = "", ...props }, ref) => {
        const baseClass = "card";

        // Support legacy elevated prop
        const effectiveVariant = elevated ? "elevated" : variant;

        const variantClasses = {
            default: "card-elevated",
            elevated: "card-elevated",
            outlined: "card-outlined",
            ghost: "card-ghost",
            glass: "backdrop-blur-xl bg-white/70 border border-white/50 shadow-sm",
        };

        const interactiveClass = interactive ? "card-interactive" : "";

        return (
            <div
                ref={ref}
                className={`${baseClass} ${variantClasses[effectiveVariant]} ${interactiveClass} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

export { Card };
