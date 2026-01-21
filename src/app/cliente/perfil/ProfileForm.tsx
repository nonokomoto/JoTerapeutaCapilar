"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
    profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    const initials = profile.name?.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() || "CL";

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
            setError("Erro ao atualizar perfil");
        } else {
            setSuccess(true);
            router.refresh();
        }

        setIsLoading(false);
    }

    async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsPasswordLoading(true);
        setPasswordError(null);
        setPasswordSuccess(false);

        const formData = new FormData(e.currentTarget);
        const currentPassword = formData.get("currentPassword") as string;
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (newPassword !== confirmPassword) {
            setPasswordError("As palavras-passe não coincidem");
            setIsPasswordLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("A palavra-passe deve ter pelo menos 6 caracteres");
            setIsPasswordLoading(false);
            return;
        }

        const supabase = createClient();

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: profile.email,
            password: currentPassword,
        });

        if (signInError) {
            setPasswordError("Palavra-passe atual incorreta");
            setIsPasswordLoading(false);
            return;
        }

        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (updateError) {
            setPasswordError("Erro ao atualizar palavra-passe");
        } else {
            setPasswordSuccess(true);
            setShowPasswordForm(false);
        }

        setIsPasswordLoading(false);
    }

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    }

    return (
        <div className="space-y-4">
            {/* Avatar Section */}
            <div className="cliente-profile-card cliente-profile-avatar-section">
                {profile.avatar_url ? (
                    <img
                        src={profile.avatar_url}
                        alt={profile.name}
                        className="cliente-profile-avatar"
                        style={{ objectFit: "cover" }}
                    />
                ) : (
                    <div className="cliente-profile-avatar">
                        {initials}
                    </div>
                )}
                <h2 className="cliente-profile-name">{profile.name}</h2>
                <p className="cliente-profile-email">{profile.email}</p>
            </div>

            {/* Profile Form */}
            <div className="cliente-profile-card">
                <h3 className="cliente-profile-section-title">Informações pessoais</h3>

                <form action={handleSubmit} className="cliente-profile-form">
                    <Input
                        label="Nome completo"
                        name="name"
                        defaultValue={profile.name}
                        required
                    />

                    <Input
                        label="Telefone"
                        name="phone"
                        type="tel"
                        defaultValue={profile.phone || ""}
                        placeholder="+351 912 345 678"
                    />

                    <Input
                        label="E-mail"
                        name="email"
                        type="email"
                        value={profile.email}
                        disabled
                    />

                    {error && (
                        <div className="ds-alert-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            className="p-3 text-sm rounded-md"
                            style={{
                                backgroundColor: "var(--color-success-bg)",
                                color: "var(--color-success)",
                            }}
                        >
                            Perfil atualizado com sucesso
                        </div>
                    )}

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Guardar
                    </Button>
                </form>
            </div>

            {/* Password Change */}
            <div className="cliente-profile-card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="cliente-profile-section-title" style={{ marginBottom: 0 }}>
                        Palavra-passe
                    </h3>
                    {!showPasswordForm && (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="text-sm px-3 py-1.5 rounded-md font-medium transition-colors"
                            style={{
                                backgroundColor: "var(--color-gray-100)",
                                color: "var(--text-secondary)"
                            }}
                        >
                            Alterar
                        </button>
                    )}
                </div>

                {passwordSuccess && !showPasswordForm && (
                    <div
                        className="p-3 text-sm rounded-md"
                        style={{
                            backgroundColor: "var(--color-success-bg)",
                            color: "var(--color-success)",
                        }}
                    >
                        Palavra-passe alterada com sucesso
                    </div>
                )}

                {showPasswordForm ? (
                    <form onSubmit={handlePasswordChange} className="cliente-profile-form">
                        <Input
                            label="Palavra-passe atual"
                            name="currentPassword"
                            type="password"
                            required
                        />

                        <Input
                            label="Nova palavra-passe"
                            name="newPassword"
                            type="password"
                            required
                        />

                        <Input
                            label="Confirmar nova palavra-passe"
                            name="confirmPassword"
                            type="password"
                            required
                        />

                        {passwordError && (
                            <div className="ds-alert-error">
                                {passwordError}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                fullWidth
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setPasswordError(null);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" fullWidth isLoading={isPasswordLoading}>
                                Alterar
                            </Button>
                        </div>
                    </form>
                ) : (
                    !passwordSuccess && (
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            Recomendamos alterar a palavra-passe temporária.
                        </p>
                    )
                )}
            </div>

            {/* Logout Button */}
            <div className="cliente-profile-card" style={{ padding: 0 }}>
                <button onClick={handleLogout} className="cliente-profile-logout">
                    Terminar sessão
                </button>
            </div>
        </div>
    );
}
