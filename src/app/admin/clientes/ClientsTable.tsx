"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, Button } from "@/components/ui";
import { Plus, Users, ChevronRight, Loader2 } from "lucide-react";
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
            <Card className="py-16">
                <div className="text-center">
                    <div 
                        className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4"
                        style={{ background: "var(--color-accent-bg)" }}
                    >
                        <Users size={28} style={{ color: "var(--color-accent)" }} />
                    </div>
                    <h3 
                        className="font-semibold text-lg mb-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        {searchQuery ? "Sem resultados" : "Sem clientes"}
                    </h3>
                    <p 
                        className="text-sm mb-5 max-w-xs mx-auto"
                        style={{ color: "var(--color-gray-500)" }}
                    >
                        {searchQuery
                            ? "Nenhum cliente encontrado para esta pesquisa"
                            : "Comece por adicionar o seu primeiro cliente"}
                    </p>
                    {!searchQuery && (
                        <Link href="/admin/clientes/novo">
                            <Button className="gap-2">
                                <Plus size={16} />
                                Adicionar cliente
                            </Button>
                        </Link>
                    )}
                </div>
            </Card>
        );
    }

    return (
        <div 
            className="overflow-hidden shadow-sm"
            style={{ 
                background: "#fff",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-gray-200)",
            }}
        >
            {/* Table Header */}
            <div 
                className="grid items-center px-5 py-3.5 text-xs font-medium uppercase tracking-wide"
                style={{ 
                    gridTemplateColumns: "1fr 1.2fr 1fr 100px",
                    background: "var(--color-gray-50)",
                    borderBottom: "1px solid var(--color-gray-200)",
                    color: "var(--color-gray-500)",
                }}
            >
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
                        className="grid items-center px-5 py-4 transition-colors hover:bg-gray-50 group"
                        style={{ 
                            gridTemplateColumns: "1fr 1.2fr 1fr 100px",
                            borderTop: index > 0 ? "1px solid var(--color-gray-100)" : "none",
                        }}
                    >
                        {/* Nome */}
                        <div>
                            <span 
                                className="font-medium text-sm"
                                style={{ color: "var(--text-primary)" }}
                            >
                                {client.name}
                            </span>
                            <span 
                                className="block md:hidden text-xs mt-0.5"
                                style={{ color: "var(--color-gray-500)" }}
                            >
                                {client.email}
                            </span>
                        </div>

                        {/* Email */}
                        <span 
                            className="hidden md:block text-sm"
                            style={{ color: "var(--color-gray-500)" }}
                        >
                            {client.email}
                        </span>

                        {/* Telefone */}
                        <span 
                            className="hidden lg:block text-sm"
                            style={{ color: "var(--color-gray-500)" }}
                        >
                            {client.phone || "—"}
                        </span>

                        {/* Atualizações */}
                        <div className="flex items-center justify-center gap-2">
                            <span 
                                className="text-sm font-semibold"
                                style={{ color: "var(--color-primary)" }}
                            >
                                {client.updateCount}
                            </span>
                            <ChevronRight 
                                size={16} 
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color: "var(--color-gray-400)" }}
                            />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Loading indicator / Infinite scroll trigger */}
            <div 
                ref={loaderRef}
                className="px-5 py-3 text-xs flex items-center justify-center gap-2"
                style={{ 
                    borderTop: "1px solid var(--color-gray-100)",
                    color: "var(--color-gray-400)",
                    background: "var(--color-gray-50)",
                }}
            >
                {isLoading ? (
                    <>
                        <Loader2 size={14} className="animate-spin" />
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
