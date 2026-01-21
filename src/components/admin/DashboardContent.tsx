"use client";

import Link from "next/link";
import { useAdminStats, useRecentClients } from "@/lib/queries";
import { StatCard, Avatar } from "@/components/ui";

// Icons for stats
function UsersIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function TreatmentIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    );
}

function PostsIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

// Stats skeleton for loading state
function StatsSkeleton() {
    return (
        <div className="admin-stats-grid">
            {[1, 2, 3].map((i) => (
                <div key={i} className="stat-card animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                </div>
            ))}
        </div>
    );
}

// Client list skeleton
function ClientsSkeleton() {
    return (
        <div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="admin-client-item animate-pulse">
                    <div className="admin-client-info">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="admin-client-text-stack">
                            <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface AdminStatsProps {
    initialStats?: {
        clientsCount: number;
        postsCount: number;
        updatesCount: number;
    };
}

export function AdminStats({ initialStats }: AdminStatsProps) {
    // Pass initialData to hook - cache is populated immediately, no loading state
    const { data: stats } = useAdminStats(initialStats);

    // stats will always have data (either from cache or initialData)
    const displayStats = stats || initialStats;

    if (!displayStats) {
        return <StatsSkeleton />;
    }

    return (
        <div className="admin-stats-grid">
            <StatCard
                label="Total Clientes"
                value={displayStats?.clientsCount || 0}
                icon={<UsersIcon />}
                accentColor="rose"
            />
            <StatCard
                label="Em tratamento"
                value={displayStats?.clientsCount || 0}
                icon={<TreatmentIcon />}
                accentColor="sage"
            />
            <StatCard
                label="Posts publicados"
                value={displayStats?.postsCount || 0}
                icon={<PostsIcon />}
                accentColor="terracotta"
            />
        </div>
    );
}

interface RecentClient {
    id: string;
    name: string;
    avatar_url: string | null;
    lastUpdate: string | null;
}

interface RecentClientsListProps {
    initialClients?: RecentClient[];
}

export function RecentClientsList({ initialClients }: RecentClientsListProps) {
    // Pass initialData to hook - cache is populated immediately, no loading state
    const { data: clients } = useRecentClients(5, initialClients);

    // clients will always have data (either from cache or initialData)
    const displayClients = clients || initialClients;

    if (!displayClients) {
        return <ClientsSkeleton />;
    }

    if (!displayClients || displayClients.length === 0) {
        return (
            <div className="admin-empty-state">
                <div className="admin-empty-icon-box">
                    <UsersIcon />
                </div>
                <h3 className="admin-empty-title">
                    Ainda sem clientes
                </h3>
                <p className="admin-empty-desc">
                    Adicione o seu primeiro cliente
                </p>
                <Link
                    href="/admin/clientes/novo"
                    className="admin-btn-inline-add"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Adicionar
                </Link>
            </div>
        );
    }

    return (
        <div>
            {displayClients.map((client) => (
                <Link
                    key={client.id}
                    href={`/admin/clientes/${client.id}`}
                    className="admin-client-item hover:bg-gray-50"
                >
                    <div className="admin-client-info">
                        <Avatar
                            src={client.avatar_url}
                            name={client.name}
                            size="md"
                        />
                        <div className="admin-client-text-stack">
                            <span className="admin-client-name">
                                {client.name}
                            </span>
                            <span className="admin-client-date">
                                {client.lastUpdate
                                    ? `Última atualização: ${new Date(client.lastUpdate).toLocaleDateString("pt-PT", {
                                        day: "numeric",
                                        month: "short"
                                    })}`
                                    : "Sem atualizações"
                                }
                            </span>
                        </div>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B8ABA0" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </Link>
            ))}
        </div>
    );
}
