"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Card, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
    profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        const supabase = createClient();

        const { error: updateError } = await supabase
            .from("profiles")
            .update({
                name: formData.get("name") as string,
                phone: formData.get("phone") as string,
            })
            .eq("id", profile.id);

        if (updateError) {
            setError("Erreur lors de la mise à jour");
        } else {
            setSuccess(true);
            router.refresh();
        }

        setIsLoading(false);
    }

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    }

    return (
        <div className="space-y-6">
            {/* Avatar Section */}
            <Card className="flex flex-col items-center py-8">
                <Avatar src={profile.avatar_url} name={profile.name} size="xl" />
                <h2
                    className="text-xl font-semibold mt-4"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    {profile.name}
                </h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    {profile.email}
                </p>
            </Card>

            {/* Profile Form */}
            <Card>
                <h3
                    className="text-lg font-semibold mb-4"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    Informations personnelles
                </h3>

                <form action={handleSubmit} className="space-y-4">
                    <Input
                        label="Nom complet"
                        name="name"
                        defaultValue={profile.name}
                        required
                    />

                    <Input
                        label="Téléphone"
                        name="phone"
                        type="tel"
                        defaultValue={profile.phone || ""}
                        placeholder="+33 6 12 34 56 78"
                    />

                    <Input
                        label="E-mail"
                        name="email"
                        type="email"
                        value={profile.email}
                        disabled
                    />

                    {error && (
                        <div
                            className="p-3 text-sm rounded-sm"
                            style={{
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
                                color: "var(--color-error)",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            className="p-3 text-sm rounded-sm"
                            style={{
                                backgroundColor: "rgba(34, 197, 94, 0.1)",
                                color: "var(--color-success)",
                            }}
                        >
                            Profil mis à jour avec succès
                        </div>
                    )}

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Enregistrer
                    </Button>
                </form>
            </Card>

            {/* Logout Button */}
            <Card>
                <button
                    onClick={handleLogout}
                    className="w-full py-3 text-center font-medium"
                    style={{ color: "var(--color-error)" }}
                >
                    Déconnexion
                </button>
            </Card>
        </div>
    );
}
