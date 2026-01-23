import { TextareaHTMLAttributes, forwardRef } from "react";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, error, hint, className = "", id, ...props }, ref) => {
        const textareaId = id || props.name;
        const hasError = !!error;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className={`block text-sm font-medium mb-2 ${hasError ? "ds-text-error" : "ds-text-secondary"}`}
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    className={`textarea ${hasError ? "textarea-error" : ""} ${className}`}
                    aria-invalid={hasError}
                    aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
                    {...props}
                />
                {error && (
                    <p
                        id={`${textareaId}-error`}
                        className="mt-2 text-sm ds-text-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p
                        id={`${textareaId}-hint`}
                        className="mt-2 text-sm ds-text-muted"
                    >
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

TextArea.displayName = "TextArea";

export { TextArea };
