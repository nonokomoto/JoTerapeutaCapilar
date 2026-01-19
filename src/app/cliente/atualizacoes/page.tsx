import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";

export default async function ClienteAtualizacoes() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Get all updates with attachments
    const { data: updates } = await supabase
        .from("client_updates")
        .select(
            `
            id,
            title,
            content,
            created_at,
            attachments (
                id,
                file_url,
                file_name,
                file_type
            )
        `
        )
        .eq("client_id", user?.id)
        .order("created_at", { ascending: false });

    return (
        <div className="p-4">
            <div className="mb-6">
                <h1
                    className="text-2xl font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    Mes mises à jour
                </h1>
                <p style={{ color: "var(--text-muted)" }}>
                    Suivez votre progression
                </p>
            </div>

            {updates && updates.length > 0 ? (
                <div className="space-y-4">
                    {updates.map((update) => (
                        <Card key={update.id}>
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold">{update.title}</h3>
                                <span
                                    className="text-xs"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    {new Date(update.created_at).toLocaleDateString(
                                        "fr-FR",
                                        {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </span>
                            </div>

                            <p
                                className="text-sm mb-4"
                                style={{
                                    color: "var(--text-primary)",
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {update.content}
                            </p>

                            {/* Attachments */}
                            {update.attachments && update.attachments.length > 0 && (
                                <div className="border-t pt-4 mt-4">
                                    <p
                                        className="text-xs font-medium mb-2"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        Pièces jointes
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {update.attachments.map((attachment) => (
                                            <a
                                                key={attachment.id}
                                                href={attachment.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm"
                                                style={{
                                                    backgroundColor: "var(--bg-input)",
                                                }}
                                            >
                                                {attachment.file_type === "image" ? "🖼️" : "📄"}
                                                <span className="truncate max-w-[120px]">
                                                    {attachment.file_name}
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
                    <div className="text-center py-8">
                        <div className="text-4xl mb-3">📋</div>
                        <h3 className="font-medium mb-1">Aucune mise à jour</h3>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            Votre thérapeute n&apos;a pas encore ajouté de mises à jour
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}
