import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export default async function ClienteDashboard() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Use admin client for profile to bypass RLS
    const adminClient = await import("@/lib/supabase/admin").then(m => m.createAdminClient());

    const { data: profile } = await adminClient
        .from("profiles")
        .select("name")
        .eq("id", user?.id)
        .single();

    // Get recent updates
    const { data: recentUpdates } = await supabase
        .from("client_updates")
        .select("id, title, created_at")
        .eq("client_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(3);

    // Get recent posts
    const { data: recentPosts } = await supabase
        .from("posts")
        .select("id, title, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3);

    const firstName = profile?.name?.split(" ")[0] || "Cliente";

    return (
        <div className="p-4 space-y-6">
            {/* Welcome Section */}
            <div className="py-4">
                <h1
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    Olá, {firstName} 👋
                </h1>
                <p style={{ color: "var(--text-muted)" }}>
                    Bem-vindo à sua área pessoal
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Link href="/cliente/atualizacoes">
                    <Card className="text-center py-6 hover:shadow-md transition-shadow">
                        <div className="text-3xl mb-2">📋</div>
                        <span className="text-sm font-medium">As minhas atualizações</span>
                    </Card>
                </Link>
                <Link href="/cliente/perfil">
                    <Card className="text-center py-6 hover:shadow-md transition-shadow">
                        <div className="text-3xl mb-2">👤</div>
                        <span className="text-sm font-medium">O meu perfil</span>
                    </Card>
                </Link>
            </div>

            {/* Recent Updates */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2
                        className="text-lg font-semibold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Últimas atualizações
                    </h2>
                    <Link
                        href="/cliente/atualizacoes"
                        className="text-sm"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Ver tudo
                    </Link>
                </div>

                {recentUpdates && recentUpdates.length > 0 ? (
                    <div className="space-y-3">
                        {recentUpdates.map((update) => (
                            <Card key={update.id}>
                                <h3 className="font-medium">{update.title}</h3>
                                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                    {new Date(update.created_at).toLocaleDateString("pt-PT")}
                                </p>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <p
                            className="text-center py-4"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Sem atualizações de momento
                        </p>
                    </Card>
                )}
            </section>

            {/* Recent Posts */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h2
                        className="text-lg font-semibold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Notícias
                    </h2>
                </div>

                {recentPosts && recentPosts.length > 0 ? (
                    <div className="space-y-3">
                        {recentPosts.map((post) => (
                            <Card key={post.id}>
                                <h3 className="font-medium">{post.title}</h3>
                                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                    {new Date(post.created_at).toLocaleDateString("pt-PT")}
                                </p>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <p
                            className="text-center py-4"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Sem notícias de momento
                        </p>
                    </Card>
                )}
            </section>
        </div>
    );
}
