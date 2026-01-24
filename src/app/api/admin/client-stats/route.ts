import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: clients, error } = await supabase
            .from("profiles")
            .select("next_appointment_date")
            .eq("role", "client");

        if (error) {
            console.error("Supabase error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const now = new Date();

        let comMarcacao = 0;
        let semMarcacao = 0;

        clients?.forEach(client => {
            const nextAppt = client.next_appointment_date as string | null;
            const hasNextAppt = nextAppt && new Date(nextAppt) >= now;

            if (hasNextAppt) {
                comMarcacao++;
            } else {
                semMarcacao++;
            }
        });

        return NextResponse.json({
            total: clients?.length || 0,
            comMarcacao,
            semMarcacao,
        });
    } catch (error) {
        console.error("Error in client-stats route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
