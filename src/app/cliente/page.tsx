import { createClient } from "@/lib/supabase/server";
import { TreatmentsSection, NewsSection } from "@/components/cliente/DashboardContent";

// Get time-based greeting
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
}

// Icons
function UpdatesIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 14l2 2 4-4" />
        </svg>
    );
}

function SparklesIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
            <path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z" />
            <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" />
        </svg>
    );
}

export default async function ClienteDashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Use admin client for profile to bypass RLS
    const adminClient = await import("@/lib/supabase/admin").then(m => m.createAdminClient());

    const { data: profile } = await adminClient
        .from("profiles")
        .select("name, avatar_url")
        .eq("id", user?.id)
        .single();

    // Get initial updates for SSR
    const { data: recentUpdates, count: updatesCount } = await supabase
        .from("client_updates")
        .select("id, title, created_at", { count: "exact" })
        .eq("client_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(3);

    // Get initial posts for SSR
    const { data: recentPosts } = await supabase
        .from("posts")
        .select("id, title, created_at, content, image_url")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6);

    const firstName = profile?.name?.split(" ")[0] || "Cliente";
    const greeting = getGreeting();
    const initials = profile?.name?.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() || "CL";

    return (
        <div className="cliente-dash-container">
            {/* Hero Section v2 - Desktop Optimized */}
            <div className="cliente-hero-glass cliente-hero-glass-desktop">
                <div className="cliente-glass-card">
                    <div className="relative flex-shrink-0">
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.name}
                                className="cliente-avatar-premium"
                            />
                        ) : (
                            <div className="cliente-avatar-premium cliente-avatar-initials">
                                {initials}
                            </div>
                        )}
                        <div className="absolute bottom-1 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-rose-gold shadow-sm border-2 border-primary lg:bottom-0">
                            <SparklesIcon />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <p className="cliente-hero-greeting">{greeting},</p>
                        <h1 className="cliente-hero-name">{firstName}!</h1>

                        <div className="cliente-status-pill self-center lg:self-start">
                            <UpdatesIcon />
                            <span>A sua saúde capilar em dia</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cliente-dashboard-content">
                {/* Treatments Section - Now reactive with TanStack Query */}
                <TreatmentsSection
                    initialUpdates={recentUpdates || []}
                    initialCount={updatesCount || 0}
                />

                {/* News & Tips Section - Now reactive with TanStack Query */}
                <NewsSection initialPosts={recentPosts || []} />
            </div>
        </div>
    );
}
