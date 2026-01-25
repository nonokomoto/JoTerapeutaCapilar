"use client";

import { useState, useTransition } from "react";

interface NotificationToggleProps {
    initialValue: boolean;
    onToggle: (enabled: boolean) => Promise<void>;
}

/**
 * Toggle switch for email notifications
 * Client can enable/disable in their profile settings
 */
export function NotificationToggle({ initialValue, onToggle }: NotificationToggleProps) {
    const [enabled, setEnabled] = useState(initialValue);
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        const newValue = !enabled;
        setEnabled(newValue);

        startTransition(async () => {
            try {
                await onToggle(newValue);
            } catch (error) {
                // Revert on error
                setEnabled(!newValue);
                console.error("Failed to update notification preference:", error);
            }
        });
    };

    return (
        <div className="notification-toggle-container">
            <div className="notification-toggle-content">
                <div>
                    <h4 className="notification-toggle-title">Notificações por Email</h4>
                    <p className="notification-toggle-description">
                        Receba um email quando a sua terapeuta adicionar novas atualizações
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={isPending}
                    className={`toggle-switch ${enabled ? 'enabled' : 'disabled'}`}
                    role="switch"
                    aria-checked={enabled}
                >
                    <span className="toggle-switch-slider" />
                </button>
            </div>
        </div>
    );
}
