import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    containerClassName?: string;
    labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className = "", containerClassName = "", labelClassName, id, ...props }, ref) => {
        const inputId = id || props.name;
        const hasError = !!error;

        const defaultLabelClass = `block text-sm font-medium mb-2 ${hasError ? "ds-text-error" : "ds-text-muted"}`;

        return (
            <div className={`w-full ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className={labelClassName || defaultLabelClass}
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
                        className="mt-2 text-sm ds-text-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p
                        id={`${inputId}-hint`}
                        className="mt-2 text-sm ds-text-muted"
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
