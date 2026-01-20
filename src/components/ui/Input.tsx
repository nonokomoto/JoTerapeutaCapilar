import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className = "", id, ...props }, ref) => {
        const inputId = id || props.name;
        const hasError = !!error;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium mb-2"
                        style={{ color: hasError ? "var(--color-error)" : "var(--text-secondary)" }}
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`input ${hasError ? "input-error" : ""} ${className}`}
                    aria-invalid={hasError}
                    aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                    {...props}
                />
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="mt-2 text-sm"
                        style={{ color: "var(--color-error)" }}
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p
                        id={`${inputId}-hint`}
                        className="mt-2 text-sm"
                        style={{ color: "var(--text-muted)" }}
                    >
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
