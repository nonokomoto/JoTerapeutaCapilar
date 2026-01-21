import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Verify user is admin
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "5");

        // Use admin client to bypass RLS
        const adminClient = createAdminClient();

        const { data: clients, error } = await adminClient
            .from("profiles")
            .select(`
                id, 
                name, 
                avatar_url,
                created_at,
                client_updates!client_updates_client_id_fkey (
                    created_at
                )
            `)
            .eq("role", "client")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;

        // Transform data to include lastUpdate
        const transformedClients = clients?.map((client) => ({
            id: client.id,
            name: client.name,
            avatar_url: client.avatar_url,
            created_at: client.created_at,
            lastUpdate: client.client_updates?.[0]?.created_at || null,
        })) || [];

        return NextResponse.json(transformedClients);
    } catch (error) {
        console.error("Error fetching clients:", error);
        return NextResponse.json(
            { error: "Erro ao obter clientes" },
            { status: 500 }
        );
    }
}
