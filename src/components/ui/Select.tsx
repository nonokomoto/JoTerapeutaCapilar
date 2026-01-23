import { SelectHTMLAttributes, forwardRef } from "react";

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
    label?: string;
    error?: string;
    hint?: string;
    options: SelectOption[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, hint, options, placeholder, className = "", id, ...props }, ref) => {
        const selectId = id || props.name;
        const hasError = !!error;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={selectId}
                        className={`block text-sm font-medium mb-2 ${hasError ? "ds-text-error" : "ds-text-secondary"}`}
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        className={`select ${hasError ? "select-error" : ""} ${className}`}
                        aria-invalid={hasError}
                        aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="select-icon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                </div>
                {error && (
                    <p
                        id={`${selectId}-error`}
                        className="mt-2 text-sm ds-text-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p
                        id={`${selectId}-hint`}
                        className="mt-2 text-sm ds-text-muted"
                    >
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";

export { Select };
