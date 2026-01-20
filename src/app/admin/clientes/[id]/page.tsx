import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateUpdateModal } from "./CreateUpdateModal";
import { ResetPasswordButton } from "./ResetPasswordButton";

// Icons
function ArrowLeftIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
}

function NotesIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    );
}

function ImageIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

function EmptyIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
    );
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

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
            {/* Back Link */}
            <Link href="/admin/clientes" className="client-back-link">
                <ArrowLeftIcon />
                <span>Voltar aos clientes</span>
            </Link>

            {/* Profile Banner */}
            <div className="client-profile-banner">
                <div className="client-profile-info">
                    <div className="client-profile-avatar">
                        {client.avatar_url ? (
                            <img src={client.avatar_url} alt={client.name} />
                        ) : (
                            getInitials(client.name)
                        )}
                    </div>
                    <div>
                        <h1 className="client-profile-name">{client.name}</h1>
                        <div className="client-profile-meta">
                            <CalendarIcon />
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
                            <MailIcon />
                        </div>
                        <div>
                            <span className="client-contact-label">Email</span>
                            <p className="client-contact-value">{client.email}</p>
                        </div>
                    </div>
                    <div className="client-contact-item">
                        <div className="client-contact-icon">
                            <PhoneIcon />
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
                                <NotesIcon />
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
                                            <CalendarIcon />
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
                                                        {att.file_type === "image" ? (
                                                            <ImageIcon />
                                                        ) : (
                                                            <FileIcon />
                                                        )}
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
                            <div className="client-empty-updates">
                                <div className="client-empty-icon">
                                    <EmptyIcon />
                                </div>
                                <p className="client-empty-text">
                                    Sem atualizações para este cliente
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
