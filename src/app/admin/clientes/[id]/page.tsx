import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUpdateReactions } from "@/app/cliente/actions";
import { Icon, PageHeader, EmptyState, Avatar, ClientStatusBadge, DateGroupHeader } from "@/components/ui";
import { calculateClientStatus } from "@/lib/utils/clientStatus";
import { groupUpdatesByMonth } from "@/lib/utils/grouping";
import { AppointmentsSection } from "./AppointmentsSection";
import { CreateUpdateModal } from "./CreateUpdateModal";
import { CreateBeforeAfterModal } from "./CreateBeforeAfterModal";
import { ResetPasswordButton } from "./ResetPasswordButton";
import { EditClientModal } from "./EditClientModal";
import { DeleteClientButton } from "./DeleteClientButton";
import { UpdateCard } from "./UpdateCard";

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

    const status = calculateClientStatus(client);

    // Get client updates
    // ... existing updates query ...
    const { data: updates } = await supabase
        .from("client_updates")
        .select(
            `
            id,
            client_id,
            admin_id,
            title,
            content,
            category,
            created_at,
            attachments (id, file_url, file_name, file_type, file_size, update_id, created_at)
        `
        )
        .eq("client_id", id)
        .order("created_at", { ascending: false });

    // Group updates by month
    const groupedUpdates = updates ? groupUpdatesByMonth(updates) : [];

    // Fetch reactions for all updates
    const updateReactionsMap = new Map();
    if (updates) {
        await Promise.all(
            updates.map(async (update) => {
                const reactions = await getUpdateReactions(update.id);
                updateReactionsMap.set(update.id, reactions);
            })
        );
    }

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
                <div className="flex gap-2">
                    <EditClientModal
                        client={{
                            id: client.id,
                            name: client.name,
                            email: client.email,
                            phone: client.phone,
                            notes: client.notes,
                        }}
                    />
                    <DeleteClientButton
                        clientId={client.id}
                        clientName={client.name}
                        updateCount={updates?.length || 0}
                    />
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

            <div className="client-detail-grid">
                {/* Sidebar - Widgets */}
                <aside className="client-sidebar">
                    <h3 className="client-sidebar-title">
                        <Icon name="info" size={16} />
                        Informações
                    </h3>

                    <div className="client-sidebar-widgets">
                        {/* Appointments Card */}
                        <AppointmentsSection
                            clientId={client.id}
                            clientData={{
                                first_visit_date: client.first_visit_date,
                                last_appointment_date: client.last_appointment_date,
                                next_appointment_date: client.next_appointment_date
                            }}
                        />

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
                </aside>

                {/* Updates Section - Feed */}
                <main className="client-feed">
                    {/* Updates List */}
                    <div className="client-updates-section">
                        {/* Section Header with Add Buttons */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="section-label">Histórico de Atualizações</h3>
                            <div className="flex gap-2">
                                <CreateBeforeAfterModal clientId={client.id} />
                                <CreateUpdateModal clientId={client.id} clientName={client.name} />
                            </div>
                        </div>

                        {groupedUpdates.length > 0 ? (
                            <div>
                                {groupedUpdates.map(([monthLabel, monthUpdates]) => (
                                    <div key={monthLabel}>
                                        <DateGroupHeader label={monthLabel} count={monthUpdates.length} />

                                        <div className="date-group-updates">
                                            {monthUpdates.map((update) => (
                                                <UpdateCard
                                                    key={update.id}
                                                    update={update}
                                                    clientId={client.id}
                                                    reactions={updateReactionsMap.get(update.id) || []}
                                                />
                                            ))}
                                        </div>
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
                </main>
            </div>
        </div>
    );
}
