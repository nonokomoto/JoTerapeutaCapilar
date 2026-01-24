import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "3");

        // Fetch updates for current user
        const { data: updates, count, error } = await supabase
            .from("client_updates")
            .select("id, title, created_at", { count: "exact" })
            .eq("client_id", user.id)
            // Filter out automated appointment updates
            .not("title", "ilike", "%Agendamento%")
            .not("title", "ilike", "%Consulta Realizada%")
            .not("title", "ilike", "%Marcação%")
            .not("title", "ilike", "%Visita realizada%")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;

        return NextResponse.json({
            updates: updates || [],
            count: count || 0,
        });
    } catch (error) {
        console.error("Error fetching updates:", error);
        return NextResponse.json(
            { error: "Erro ao obter atualizações" },
            { status: 500 }
        );
    }
}
