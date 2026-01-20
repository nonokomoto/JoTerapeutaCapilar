import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, Button, Avatar, Input } from "@/components/ui";

export default async function AdminClientes({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const supabase = await createClient();
    const { q } = await searchParams;

    let query = supabase
        .from("profiles")
        .select("*")
        .eq("role", "client")
        .order("name", { ascending: true });

    if (q) {
        query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
    }

    const { data: clients } = await query;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1
                        className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Clientes
                    </h1>
                    <p style={{ color: "var(--text-muted)" }}>
                        Gerir os seus clientes
                    </p>
                </div>
                <Link href="/admin/clientes/novo">
                    <Button>+ Novo cliente</Button>
                </Link>
            </div>

            {/* Search */}
            <form className="max-w-md">
                <Input
                    name="q"
                    placeholder="Pesquisar cliente..."
                    defaultValue={q || ""}
                />
            </form>

            {/* Clients List */}
            {clients && clients.length > 0 ? (
                <div className="grid gap-4">
                    {clients.map((client) => (
                        <Link key={client.id} href={`/admin/clientes/${client.id}`}>
                            <Card variant="outlined" interactive className="flex items-center gap-4">
                                <Avatar
                                    src={client.avatar_url}
                                    name={client.name}
                                    size="lg"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold">{client.name}</h3>
                                    <p
                                        className="text-sm truncate"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        {client.email}
                                    </p>
                                    {client.phone && (
                                        <p
                                            className="text-sm"
                                            style={{ color: "var(--text-muted)" }}
                                        >
                                            {client.phone}
                                        </p>
                                    )}
                                </div>
                                <span
                                    className="text-xs"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    {new Date(client.created_at).toLocaleDateString("pt-PT")}
                                </span>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <Card>
                    <div className="text-center py-8">
                        <div className="text-4xl mb-3">👥</div>
                        <h3 className="font-medium mb-1">
                            {q ? "Sem resultados" : "Sem clientes"}
                        </h3>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            {q
                                ? "Tente outra pesquisa"
                                : "Comece por adicionar o seu primeiro cliente"}
                        </p>
                        {!q && (
                            <Link href="/admin/clientes/novo" className="inline-block mt-4">
                                <Button>Adicionar cliente</Button>
                            </Link>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
