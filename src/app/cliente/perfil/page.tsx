import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export default async function ClientePerfil() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

    if (!profile) {
        return null;
    }

    return (
        <div className="p-4">
            <div className="mb-6">
                <h1
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    Mon profil
                </h1>
                <p style={{ color: "var(--text-muted)" }}>
                    Gérez vos informations
                </p>
            </div>

            <ProfileForm profile={profile} />
        </div>
    );
}
