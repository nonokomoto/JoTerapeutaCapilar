"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, Icon, EmptyState, ClientStatusBadge } from "@/components/ui";
import { calculateClientStatus } from "@/lib/utils/clientStatus";
import type { Profile } from "@/types";
import type { ClientStatus } from "@/types/database";

interface ClientWithCount extends Profile {
    updateCount: number;
}

interface ClientsTableProps {
    initialClients: ClientWithCount[];
    initialHasMore: boolean;
    searchQuery?: string;
    filter?: string;
    sort?: string;
}

const PAGE_SIZE = 20;

export function ClientsTable({ initialClients, initialHasMore, searchQuery, filter, sort }: ClientsTableProps) {
    const [clients, setClients] = useState<ClientWithCount[]>(initialClients);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const loaderRef = useRef<HTMLDivElement>(null);

    // Reset when factors change
    useEffect(() => {
        setClients(initialClients);
        setHasMore(initialHasMore);
        setPage(1);
    }, [initialClients, initialHasMore, searchQuery, filter, sort]);

    const loadMore = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true);
        const supabase = createClient();
        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        try {
            let query = supabase
                .from("profiles")
                .select("*")
                .eq("role", "client");

            // Filtragem
            if (searchQuery) {
                query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
            }

            if (filter === "com_marcacao") {
                query = query.gte("next_appointment_date", new Date().toISOString());
            } else if (filter === "sem_marcacao") {
                query = query.or(`next_appointment_date.is.null,next_appointment_date.lt.${new Date().toISOString()}`);
            }

            // Ordenação
            const currentSort = sort || "name_asc";
            if (currentSort === "name_asc") query = query.order("name", { ascending: true });
            else if (currentSort === "name_desc") query = query.order("name", { ascending: false });
            else if (currentSort === "created_desc") query = query.order("created_at", { ascending: false });
            else if (currentSort === "created_asc") query = query.order("created_at", { ascending: true });
            else if (currentSort === "last_visit_desc") query = query.order("last_appointment_date", { ascending: false, nullsFirst: false });
            else if (currentSort === "next_appt_asc") query = query.order("next_appointment_date", { ascending: true, nullsFirst: false });

            query = query.range(from, to);

            const { data: newClients, error } = await query;

            if (error) throw error;

            if (newClients && newClients.length > 0) {
                // Get update counts
                const clientIds = newClients.map(c => c.id);
                const { data: counts } = await supabase
                    .from("client_updates")
                    .select("client_id")
                    .in("client_id", clientIds);

                const updateCounts: Record<string, number> = {};
                if (counts) {
                    counts.forEach(update => {
                        updateCounts[update.client_id] = (updateCounts[update.client_id] || 0) + 1;
                    });
                }

                const clientsWithCounts: ClientWithCount[] = newClients.map(client => ({
                    ...client,
                    updateCount: updateCounts[client.id] || 0,
                }));

                setClients(prev => [...prev, ...clientsWithCounts]);
                setHasMore(newClients.length === PAGE_SIZE);
                setPage(prev => prev + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error loading more clients:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, hasMore, isLoading, searchQuery, filter, sort]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: "100px" }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [loadMore, hasMore, isLoading]);

    if (clients.length === 0) {
        return (
            <Card>
                <EmptyState
                    icon="users"
                    title={searchQuery ? "Sem resultados" : "Sem clientes"}
                    description={
                        searchQuery
                            ? "Nenhum cliente encontrado para esta pesquisa"
                            : "Comece por adicionar o seu primeiro cliente"
                    }
                    action={
                        !searchQuery
                            ? {
                                label: "Adicionar cliente",
                                onClick: () => (window.location.href = "/admin/clientes/novo"),
                            }
                            : undefined
                    }
                />
            </Card>
        );
    }

    return (
        <div className="clients-table-container">
            {/* Table Header */}
            <div className="clients-table-header">
                <span>Nome / Contacto</span>
                <span className="hidden md:block">Status</span>
                <span className="hidden lg:block">Última Visita</span>
                <span className="text-center">Updates</span>
                <span />
            </div>

            {/* Table Body */}
            <div>
                {clients.map((client, index) => {
                    const status = calculateClientStatus(client);

                    return (
                        <Link
                            key={client.id}
                            href={`/admin/clientes/${client.id}`}
                            className={`clients-table-row ${index > 0 ? "clients-table-row-border" : ""}`}
                        >
                            {/* Nome / Principal Info */}
                            <div className="clients-table-name-cell">
                                <span className="clients-table-name">{client.name}</span>
                                <span className="clients-table-email">{client.email}</span>
                            </div>

                            {/* Status */}
                            <div className="clients-table-status-cell hidden md:flex">
                                <ClientStatusBadge status={status} />
                            </div>

                            {/* Última Visita */}
                            <div className="clients-table-date-cell hidden lg:block">
                                {client.last_appointment_date
                                    ? new Date(client.last_appointment_date).toLocaleDateString('pt-PT')
                                    : "—"}
                            </div>

                            {/* Atualizações */}
                            <div className="clients-table-updates-cell">
                                <span className="clients-table-count">{client.updateCount}</span>
                            </div>

                            {/* Chevron */}
                            <div className="clients-table-chevron-cell">
                                <Icon name="chevron-right" size="sm" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Loading indicator / Infinite scroll trigger */}
            <div ref={loaderRef} className="clients-table-footer p-6 text-center text-xs text-text-secondary border-t border-border-default/30">
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                        <Icon name="loader" size={14} className="animate-spin" />
                        <span>A carregar mais clientes...</span>
                    </div>
                ) : hasMore ? (
                    <span>Deslize para carregar mais</span>
                ) : (
                    <span>
                        {clients.length} cliente{clients.length !== 1 ? "s" : ""} • Clique para ver detalhes
                    </span>
                )}
            </div>
        </div>
    );
}
