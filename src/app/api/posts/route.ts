import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Verify user is authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get("limit") || "6");

        // Fetch published posts
        const { data: posts, error } = await supabase
            .from("posts")
            .select("id, title, content, image_url, created_at")
            .eq("published", true)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;

        return NextResponse.json(posts || []);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Erro ao obter posts" },
            { status: 500 }
        );
    }
}
