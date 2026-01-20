import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, Avatar } from "@/components/ui";
import { CreateUpdateForm } from "./CreateUpdateForm";
import { ResetPasswordButton } from "./ResetPasswordButton";

export default async function ClienteDetalhe({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const supabase = await createClient();
    const { id } = await params;

    // Get client profile
    const { data: client } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

    if (!client) {
        notFound();
    }

    // Get client updates
    const { data: updates } = await supabase
        .from("client_updates")
        .select(
            `
            id,
            title,
            content,
            created_at,
            attachments (id, file_url, file_name, file_type)
        `
        )
        .eq("client_id", id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/clientes"
                    className="p-2 rounded-sm"
                    style={{ backgroundColor: "var(--bg-input)" }}
                >
                    ←
                </Link>
                <div className="flex-1">
                    <h1
                        className="text-2xl font-bold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        {client.name}
                    </h1>
                    <p style={{ color: "var(--text-muted)" }}>
                        Cliente desde{" "}
                        {new Date(client.created_at).toLocaleDateString("pt-PT", {
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Client Info Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    <Card className="text-center py-6">
                        <Avatar
                            src={client.avatar_url}
                            name={client.name}
                            size="xl"
                            className="mx-auto"
                        />
                        <h2 className="font-semibold mt-4">{client.name}</h2>
                        <p
                            className="text-sm"
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
                    </Card>

                    {/* Notes */}
                    <Card>
                        <h3
                            className="text-sm font-semibold mb-2"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Notas privadas
                        </h3>
                        <p
                            className="text-sm whitespace-pre-wrap"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {client.notes || "Sem notas"}
                        </p>
                    </Card>

                    {/* Reset Password */}
                    <ResetPasswordButton clientId={client.id} clientEmail={client.email} />
                </div>

                {/* Updates Section */}
                <div className="md:col-span-2 space-y-4">
                    {/* Create Update Form */}
                    <CreateUpdateForm clientId={client.id} />

                    {/* Updates List */}
                    <h3
                        className="text-lg font-semibold"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Histórico de atualizações
                    </h3>

                    {updates && updates.length > 0 ? (
                        <div className="space-y-4">
                            {updates.map((update) => (
                                <Card key={update.id}>
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="font-semibold">{update.title}</h4>
                                        <span
                                            className="text-xs"
                                            style={{ color: "var(--text-muted)" }}
                                        >
                                            {new Date(update.created_at).toLocaleDateString(
                                                "pt-PT",
                                                {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <p
                                        className="text-sm whitespace-pre-wrap"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        {update.content}
                                    </p>

                                    {update.attachments &&
                                        update.attachments.length > 0 && (
                                            <div className="border-t pt-3 mt-3">
                                                <p
                                                    className="text-xs font-medium mb-2"
                                                    style={{ color: "var(--text-muted)" }}
                                                >
                                                    Anexos
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {update.attachments.map((att) => (
                                                        <a
                                                            key={att.id}
                                                            href={att.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm"
                                                            style={{
                                                                backgroundColor: "var(--bg-input)",
                                                            }}
                                                        >
                                                            {att.file_type === "image"
                                                                ? "🖼️"
                                                                : "📄"}
                                                            <span className="truncate max-w-[120px]">
                                                                {att.file_name}
                                                            </span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <p
                                className="text-center py-6"
                                style={{ color: "var(--text-muted)" }}
                            >
                                Sem atualizações para este cliente
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
