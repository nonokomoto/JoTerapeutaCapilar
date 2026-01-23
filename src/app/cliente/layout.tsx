import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientLayout } from "@/components/layouts";
import { ClientErrorBoundary } from "@/components/ClientErrorBoundary";

export default async function ClienteLayout({
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

    // Use admin client to bypass RLS recursion
    const adminClient = await import("@/lib/supabase/admin").then(m => m.createAdminClient());

    const { data: profile } = await adminClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile) {
        redirect("/login");
    }

    // If admin, redirect to admin dashboard
    if (profile.role === "admin") {
        redirect("/admin");
    }

    return (
        <ClientLayout profile={profile}>
            <ClientErrorBoundary>{children}</ClientErrorBoundary>
        </ClientLayout>
    );
}
