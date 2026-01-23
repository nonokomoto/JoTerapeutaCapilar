"use client";

import { ReactNode } from "react";
import {
    useController,
    Control,
    FieldValues,
    Path,
    RegisterOptions,
} from "react-hook-form";
import { Input, InputProps } from "./Input";

interface FormFieldProps<T extends FieldValues> extends Omit<InputProps, "name" | "error"> {
    name: Path<T>;
    control: Control<T>;
    rules?: RegisterOptions<T, Path<T>>;
    label?: string;
    hint?: string;
}

export function FormField<T extends FieldValues>({
    name,
    control,
    rules,
    label,
    hint,
    ...inputProps
}: FormFieldProps<T>) {
    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
        rules,
    });

    return (
        <Input
            {...field}
            {...inputProps}
            label={label}
            hint={hint}
            error={error?.message}
        />
    );
}

// Wrapper for form sections with consistent spacing
interface FormSectionProps {
    children: ReactNode;
    title?: string;
    description?: string;
    className?: string;
}

export function FormSection({ children, title, description, className = "" }: FormSectionProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            {(title || description) && (
                <div className="mb-4">
                    {title && <h3 className="text-lg font-semibold ds-text-primary">{title}</h3>}
                    {description && <p className="text-sm ds-text-muted mt-1">{description}</p>}
                </div>
            )}
            {children}
        </div>
    );
}

// Form row for horizontal layouts
interface FormRowProps {
    children: ReactNode;
    className?: string;
}

export function FormRow({ children, className = "" }: FormRowProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
            {children}
        </div>
    );
}
