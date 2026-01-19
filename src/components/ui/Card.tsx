import { HTMLAttributes, forwardRef } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    elevated?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ children, elevated = false, className = "", ...props }, ref) => {
        const baseClass = "card";
        const elevatedClass = elevated ? "card-elevated" : "";

        return (
            <div
                ref={ref}
                className={`${baseClass} ${elevatedClass} ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

export { Card };
