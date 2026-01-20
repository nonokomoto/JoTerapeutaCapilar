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
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

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

        // Verify current password by re-authenticating
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: profile.email,
            password: currentPassword,
        });

        if (signInError) {
            setPasswordError("Palavra-passe atual incorreta");
            setIsPasswordLoading(false);
            return;
        }

        // Update password
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
                    Informações pessoais
                </h3>

                <form action={handleSubmit} className="space-y-4">
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
                            Perfil atualizado com sucesso
                        </div>
                    )}

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Guardar
                    </Button>
                </form>
            </Card>

            {/* Password Change */}
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h3
                        className="text-lg font-semibold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Palavra-passe
                    </h3>
                    {!showPasswordForm && (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="text-sm px-3 py-1 rounded-sm"
                            style={{ backgroundColor: "var(--bg-input)" }}
                        >
                            Alterar
                        </button>
                    )}
                </div>

                {passwordSuccess && !showPasswordForm && (
                    <div
                        className="p-3 text-sm rounded-sm"
                        style={{
                            backgroundColor: "rgba(34, 197, 94, 0.1)",
                            color: "var(--color-success)",
                        }}
                    >
                        Palavra-passe alterada com sucesso
                    </div>
                )}

                {showPasswordForm ? (
                    <form onSubmit={handlePasswordChange} className="space-y-4">
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
                            <div
                                className="p-3 text-sm rounded-sm"
                                style={{
                                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                                    color: "var(--color-error)",
                                }}
                            >
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
            </Card>

            {/* Logout Button */}
            <Card>
                <button
                    onClick={handleLogout}
                    className="w-full py-3 text-center font-medium"
                    style={{ color: "var(--color-error)" }}
                >
                    Terminar sessão
                </button>
            </Card>
        </div>
    );
}
