"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, Icon, EmptyState } from "@/components/ui";
import type { Profile } from "@/types";

interface ClientWithCount extends Profile {
    updateCount: number;
}

interface ClientsTableProps {
    initialClients: ClientWithCount[];
    initialHasMore: boolean;
    searchQuery?: string;
}

const PAGE_SIZE = 20;

export function ClientsTable({ initialClients, initialHasMore, searchQuery }: ClientsTableProps) {
    const [clients, setClients] = useState<ClientWithCount[]>(initialClients);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const loaderRef = useRef<HTMLDivElement>(null);

    // Reset when search query changes
    useEffect(() => {
        setClients(initialClients);
        setHasMore(initialHasMore);
        setPage(1);
    }, [initialClients, initialHasMore, searchQuery]);

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
                .eq("role", "client")
                .order("name", { ascending: true })
                .range(from, to);

            if (searchQuery) {
                query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
            }

            const { data: newClients, error } = await query;

            if (error) throw error;

            if (newClients && newClients.length > 0) {
                // Get update counts for new clients
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
    }, [page, hasMore, isLoading, searchQuery]);

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
                <span>Nome</span>
                <span className="hidden md:block">Email</span>
                <span className="hidden lg:block">Telefone</span>
                <span className="text-center">Atualizações</span>
            </div>

            {/* Table Body */}
            <div>
                {clients.map((client, index) => (
                    <Link
                        key={client.id}
                        href={`/admin/clientes/${client.id}`}
                        className={`clients-table-row ${index > 0 ? "clients-table-row-border" : ""}`}
                    >
                        {/* Nome */}
                        <div>
                            <span className="clients-table-name">{client.name}</span>
                            <span className="clients-table-email-mobile">{client.email}</span>
                        </div>

                        {/* Email */}
                        <span className="hidden md:block clients-table-cell">{client.email}</span>

                        {/* Telefone */}
                        <span className="hidden lg:block clients-table-cell">{client.phone || "—"}</span>

                        {/* Atualizações */}
                        <div className="clients-table-updates">
                            <span className="clients-table-count">{client.updateCount}</span>
                            <span className="clients-table-chevron">
                                <Icon name="chevron-right" size="sm" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Loading indicator / Infinite scroll trigger */}
            <div ref={loaderRef} className="clients-table-footer">
                {isLoading ? (
                    <>
                        <Icon name="loader" size={14} className="animate-spin" />
                        <span>A carregar mais clientes...</span>
                    </>
                ) : hasMore ? (
                    <span>Scroll para carregar mais</span>
                ) : (
                    <span>
                        {clients.length} cliente{clients.length !== 1 ? "s" : ""} • Clique num cliente para ver detalhes
                    </span>
                )}
            </div>
        </div>
    );
}
