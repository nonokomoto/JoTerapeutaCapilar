import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, Button } from "@/components/ui";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Get stats
    const { count: clientsCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "client");

    const { count: updatesCount } = await supabase
        .from("client_updates")
        .select("*", { count: "exact", head: true });

    const { count: postsCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("published", true);

    // Get recent clients
    const { data: recentClients } = await supabase
        .from("profiles")
        .select("id, name, email, created_at")
        .eq("role", "client")
        .order("created_at", { ascending: false })
        .limit(5);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1
                        className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Tableau de bord
                    </h1>
                    <p style={{ color: "var(--text-muted)" }}>
                        Vue d&apos;ensemble de votre activité
                    </p>
                </div>
                <Link href="/admin/clientes/novo">
                    <Button>+ Nouveau client</Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        Clients
                    </p>
                    <p
                        className="text-3xl font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        {clientsCount || 0}
                    </p>
                </Card>
                <Card>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        Mises à jour
                    </p>
                    <p
                        className="text-3xl font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        {updatesCount || 0}
                    </p>
                </Card>
                <Card>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        Publications
                    </p>
                    <p
                        className="text-3xl font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        {postsCount || 0}
                    </p>
                </Card>
            </div>

            {/* Recent Clients */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2
                        className="text-lg font-semibold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Clients récents
                    </h2>
                    <Link
                        href="/admin/clientes"
                        className="text-sm"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Voir tous
                    </Link>
                </div>

                {recentClients && recentClients.length > 0 ? (
                    <Card className="divide-y" style={{ padding: 0 }}>
                        {recentClients.map((client) => (
                            <Link
                                key={client.id}
                                href={`/admin/clientes/${client.id}`}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <p className="font-medium">{client.name}</p>
                                    <p
                                        className="text-sm"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        {client.email}
                                    </p>
                                </div>
                                <span
                                    className="text-xs"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    {new Date(client.created_at).toLocaleDateString("fr-FR")}
                                </span>
                            </Link>
                        ))}
                    </Card>
                ) : (
                    <Card>
                        <p
                            className="text-center py-6"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Aucun client pour le moment
                        </p>
                    </Card>
                )}
            </section>
        </div>
    );
}
