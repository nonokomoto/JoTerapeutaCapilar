import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/layouts";

export default async function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/login");
    }

    // If not admin, redirect to client dashboard
    if (profile.role !== "admin") {
        redirect("/cliente");
    }

    return <AdminLayout profile={profile}>{children}</AdminLayout>;
}
