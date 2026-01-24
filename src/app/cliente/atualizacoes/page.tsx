import { createClient } from "@/lib/supabase/server";

// Icons
function ClipboardIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 14l2 2 4-4" />
        </svg>
    );
}

function ImageIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
        </svg>
    );
}

export default async function ClienteAtualizacoes() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

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
        // Filter out automated appointment updates
        .not("title", "ilike", "%Agendamento%")
        .not("title", "ilike", "%Consulta Realizada%")
        .not("title", "ilike", "%Marcação%")
        .not("title", "ilike", "%Visita realizada%")
        .order("created_at", { ascending: false });

    return (
        <div className="cliente-dashboard-content cliente-page-container">
            {/* Page Header */}
            <div className="cliente-page-header">
                <h1 className="cliente-page-title">As minhas atualizações</h1>
                <p className="cliente-page-subtitle">Acompanhe a sua evolução capilar</p>
            </div>

            {/* Updates List */}
            {updates && updates.length > 0 ? (
                <div className="cliente-updates-list">
                    {updates.map((update, index) => (
                        <article
                            key={update.id}
                            className="cliente-update-card"
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                            <div className="cliente-update-header">
                                <div className="cliente-update-icon">
                                    <ClipboardIcon />
                                </div>
                                <div className="cliente-update-meta">
                                    <h3 className="cliente-update-title">{update.title}</h3>
                                    <p className="cliente-update-date">
                                        {new Date(update.created_at).toLocaleDateString("pt-PT", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="cliente-update-content">
                                {update.content}
                            </div>

                            {/* Attachments */}
                            {update.attachments && update.attachments.length > 0 && (
                                <div className="cliente-update-attachments">
                                    <p className="cliente-attachments-label">Anexos</p>
                                    <div className="cliente-attachments-grid">
                                        {update.attachments.map((attachment) => (
                                            <a
                                                key={attachment.id}
                                                href={attachment.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="cliente-attachment-link"
                                            >
                                                {attachment.file_type === "image" ? <ImageIcon /> : <FileIcon />}
                                                <span className="truncate">{attachment.file_name}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            ) : (
                <div className="cliente-empty-state">
                    <div className="cliente-empty-icon">
                        <ClipboardIcon />
                    </div>
                    <h3 className="cliente-empty-title">Sem atualizações</h3>
                    <p className="cliente-empty-text">
                        A sua terapeuta ainda não adicionou atualizações ao seu perfil
                    </p>
                </div>
            )}
        </div>
    );
}
