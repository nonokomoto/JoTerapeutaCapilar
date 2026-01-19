import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = "", id, ...props }, ref) => {
        const inputId = id || props.name;
        const errorClass = error ? "input-error" : "";

        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium"
                        style={{ fontFamily: "var(--font-sans)" }}
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`input ${errorClass} ${className}`}
                    {...props}
                />
                {error && (
                    <span
                        className="text-sm"
                        style={{ color: "var(--color-error)" }}
                    >
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
