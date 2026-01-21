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
        <div className="cliente-dashboard-content cliente-page-container">
            <div className="cliente-page-header">
                <h1 className="cliente-page-title">O meu perfil</h1>
                <p className="cliente-page-subtitle">Gerir as suas informações</p>
            </div>

            <div className="cliente-profile-layout">
                <ProfileForm profile={profile} />
            </div>
        </div>
    );
}
