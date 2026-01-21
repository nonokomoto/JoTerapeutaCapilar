import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
    try {
        const supabase = await createClient();

        // Verify user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // Use admin client to bypass RLS for counting
        const adminClient = createAdminClient();

        // Get counts in parallel
        const [clientsResult, updatesResult, postsResult] = await Promise.all([
            adminClient
                .from("profiles")
                .select("*", { count: "exact", head: true })
                .eq("role", "client"),
            adminClient
                .from("client_updates")
                .select("*", { count: "exact", head: true }),
            adminClient
                .from("posts")
                .select("*", { count: "exact", head: true })
                .eq("published", true),
        ]);

        return NextResponse.json({
            clientsCount: clientsResult.count || 0,
            postsCount: postsResult.count || 0,
            updatesCount: updatesResult.count || 0,
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json(
            { error: "Erro ao obter estatísticas" },
            { status: 500 }
        );
    }
}
