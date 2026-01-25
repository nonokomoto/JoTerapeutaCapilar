"use client";

import { NotificationToggle } from "@/components/features/NotificationToggle";
import { updateEmailNotificationPreference } from "@/app/cliente/actions";

interface NotificationSettingsProps {
    emailNotifications: boolean;
}

export function NotificationSettings({ emailNotifications }: NotificationSettingsProps) {
    const handleToggle = async (enabled: boolean) => {
        const result = await updateEmailNotificationPreference(enabled);
        if (result.error) {
            throw new Error(result.error);
        }
    };

    return (
        <NotificationToggle
            initialValue={emailNotifications}
            onToggle={handleToggle}
        />
    );
}
