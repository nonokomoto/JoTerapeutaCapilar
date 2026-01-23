"use client";

import { ReactNode } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { Icon, IconName } from "./Icon";

export interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
    icon?: IconName;
}

const variantConfig = {
    danger: {
        icon: "alert" as IconName,
        iconClass: "ds-text-error",
        confirmVariant: "primary" as const,
    },
    warning: {
        icon: "alert" as IconName,
        iconClass: "ds-text-warning",
        confirmVariant: "accent" as const,
    },
    info: {
        icon: "info" as IconName,
        iconClass: "ds-text-brand",
        confirmVariant: "primary" as const,
    },
};

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "danger",
    isLoading = false,
    icon,
}: ConfirmDialogProps) {
    const config = variantConfig[variant];
    const displayIcon = icon || config.icon;

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={false}
            closeOnOverlayClick={!isLoading}
            closeOnEscape={!isLoading}
        >
            <div className="text-center">
                {/* Icon */}
                <div className={`confirm-dialog-icon ${config.iconClass}`}>
                    <Icon name={displayIcon} size="xl" />
                </div>

                {/* Title */}
                <h3 className="confirm-dialog-title">{title}</h3>

                {/* Message */}
                <div className="confirm-dialog-message">{message}</div>

                {/* Actions */}
                <div className="confirm-dialog-actions">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={config.confirmVariant}
                        onClick={handleConfirm}
                        isLoading={isLoading}
                        loadingText="A processar..."
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
