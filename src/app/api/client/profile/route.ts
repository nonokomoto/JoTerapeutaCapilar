import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // Use admin client to get profile (bypass RLS issues)
        const adminClient = createAdminClient();

        const { data: profile, error } = await adminClient
            .from("profiles")
            .select("id, name, avatar_url")
            .eq("id", user.id)
            .single();

        if (error) throw error;

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Erro ao obter perfil" },
            { status: 500 }
        );
    }
}
