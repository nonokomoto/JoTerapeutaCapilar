import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Icon, PageHeader, EmptyState, Avatar } from "@/components/ui";
import { CreateUpdateModal } from "./CreateUpdateModal";
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
            <PageHeader
                title={client.name}
                backHref="/admin/clientes"
                backLabel="Voltar aos clientes"
            />

            {/* Profile Banner */}
            <div className="client-profile-banner">
                <div className="client-profile-info">
                    <Avatar
                        src={client.avatar_url}
                        name={client.name}
                        size="xl"
                    />
                    <div>
                        <h1 className="client-profile-name">{client.name}</h1>
                        <div className="client-profile-meta">
                            <Icon name="calendar" size={14} />
                            <span>
                                Cliente desde{" "}
                                {new Date(client.created_at).toLocaleDateString("pt-PT", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Info Card */}
            <div className="client-contact-card">
                <div className="client-contact-grid">
                    <div className="client-contact-item">
                        <div className="client-contact-icon">
                            <Icon name="mail" size={18} />
                        </div>
                        <div>
                            <span className="client-contact-label">Email</span>
                            <p className="client-contact-value">{client.email}</p>
                        </div>
                    </div>
                    <div className="client-contact-item">
                        <div className="client-contact-icon">
                            <Icon name="phone" size={18} />
                        </div>
                        <div>
                            <span className="client-contact-label">Telefone</span>
                            <p className="client-contact-value">
                                {client.phone || "Não definido"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Notes Card */}
                    <div className="client-notes-card">
                        <div className="client-notes-header">
                            <div className="client-notes-icon">
                                <Icon name="file-text" size={16} />
                            </div>
                            <h3 className="client-notes-title">Notas Privadas</h3>
                        </div>
                        {client.notes ? (
                            <p className="client-notes-content">{client.notes}</p>
                        ) : (
                            <p className="client-notes-empty">Sem notas adicionadas</p>
                        )}
                    </div>

                    {/* Reset Password */}
                    <ResetPasswordButton clientId={client.id} clientEmail={client.email} />
                </div>

                {/* Updates Section */}
                <div className="lg:col-span-2">
                    {/* Updates List */}
                    <div className="client-updates-section">
                        {/* Section Header with Add Button */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="section-header">Histórico de Atualizações</h3>
                            <CreateUpdateModal clientId={client.id} clientName={client.name} />
                        </div>

                        {updates && updates.length > 0 ? (
                            <div className="space-y-4">
                                {updates.map((update) => (
                                    <div key={update.id} className="client-update-card">
                                        <div className="client-update-date">
                                            <Icon name="calendar" size={14} />
                                            {new Date(update.created_at).toLocaleDateString(
                                                "pt-PT",
                                                {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                }
                                            )}
                                        </div>
                                        <h4 className="client-update-title">{update.title}</h4>
                                        <p className="client-update-content">{update.content}</p>

                                        {update.attachments && update.attachments.length > 0 && (
                                            <div className="client-update-attachments">
                                                {update.attachments.map((att) => (
                                                    <a
                                                        key={att.id}
                                                        href={att.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="client-attachment-badge"
                                                    >
                                                        <Icon
                                                            name={att.file_type === "image" ? "image" : "file-text"}
                                                            size={14}
                                                        />
                                                        <span className="truncate max-w-[120px]">
                                                            {att.file_name}
                                                        </span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon="file-text"
                                title="Sem atualizações"
                                description="Sem atualizações para este cliente"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
