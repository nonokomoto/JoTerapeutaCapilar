import { createClient } from "@/lib/supabase/server";
import { getUpdateReactions } from "@/app/cliente/actions";
import { DateGroupHeader } from "@/components/ui";
import { groupUpdatesByMonth, getUniqueYears, filterUpdates } from "@/lib/utils/grouping";
import { UpdateFilters } from "@/components/features/UpdateFilters";
import { UpdateCard } from "@/components/features/UpdateCard";
import { UpdateCategory } from "@/types/database";

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

export default async function ClienteAtualizacoes({
    searchParams,
}: {
    searchParams: Promise<{ categoria?: string; ano?: string; open?: string }>;
}) {
    const supabase = await createClient();
    const params = await searchParams;
    const openUpdateId = params.open;

    const {
        data: { user },
    } = await supabase.auth.getUser();

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
            client_liked,
            client_read_at,
            created_at,
            attachments (
                id,
                update_id,
                file_url,
                file_name,
                file_type,
                file_size,
                created_at
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

    // Extract unique categories and years for filters
    const uniqueCategories = updates
        ? Array.from(new Set(updates.map(u => u.category)))
        : [];
    const uniqueYears = updates ? getUniqueYears(updates) : [];

    // Apply filters
    const filteredUpdates = updates
        ? filterUpdates(updates, {
            category: params.categoria,
            year: params.ano
        })
        : [];

    // Group filtered updates by month
    const groupedUpdates = filteredUpdates.length > 0 ? groupUpdatesByMonth(filteredUpdates) : [];

    // Count for display
    const totalCount = updates?.length || 0;
    const filteredCount = filteredUpdates.length;
    const hasFilters = params.categoria || params.ano;

    // Calculate unread count
    const unreadCount = filteredUpdates.filter(u => !u.client_read_at).length;

    // Fetch reactions for all updates
    const updateReactionsMap = new Map();
    await Promise.all(
        filteredUpdates.map(async (update) => {
            const reactions = await getUpdateReactions(update.id);
            updateReactionsMap.set(update.id, reactions);
        })
    );

    return (
        <div className="cliente-dashboard-content cliente-page-container">
            {/* Page Header */}
            <div className="cliente-page-header">
                <h1 className="cliente-page-title">As minhas atualizações</h1>
                {unreadCount > 0 ? (
                    <p className="cliente-page-subtitle">
                        {unreadCount} {unreadCount === 1 ? 'nova atualização' : 'novas atualizações'}
                    </p>
                ) : (
                    <p className="cliente-page-subtitle">Acompanhe a sua evolução capilar</p>
                )}
            </div>

            {/* Filters */}
            {totalCount > 0 && (
                <UpdateFilters
                    categories={uniqueCategories as UpdateCategory[]}
                    years={uniqueYears}
                />
            )}

            {/* Results count */}
            {hasFilters && totalCount > 0 && (
                <div className="filter-results-count">
                    A mostrar {filteredCount} de {totalCount} {filteredCount === 1 ? 'atualização' : 'atualizações'}
                </div>
            )}

            {/* Updates List - Grouped by Month */}
            {groupedUpdates.length > 0 ? (
                <div>
                    {groupedUpdates.map(([monthLabel, monthUpdates]) => (
                        <div key={monthLabel}>
                            <DateGroupHeader label={monthLabel} count={monthUpdates.length} />

                            <div className="date-group-updates">
                                {monthUpdates.map((update, index) => (
                                    <UpdateCard
                                        key={update.id}
                                        update={update}
                                        reactions={updateReactionsMap.get(update.id) || []}
                                        index={index}
                                        defaultExpanded={update.id === openUpdateId}
                                    />
                                ))}
                            </div>
                        </div>
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
