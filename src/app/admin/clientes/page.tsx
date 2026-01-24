import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Button, PageHeader, Icon, Skeleton } from "@/components/ui";
import { ClientsTable } from "./ClientsTable";
import { SearchInput } from "./SearchInput";
import { ClientStatsBar } from "./ClientStatsBar";
import { ClientFilters } from "./ClientFilters";

const PAGE_SIZE = 20;

export default async function AdminClientes({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; filter?: string; sort?: string }>;
}) {
    const supabase = await createClient();
    const { q, filter, sort } = await searchParams;

    // Query first page of clients
    let query = supabase
        .from("profiles")
        .select("*")
        .eq("role", "client");

    // Filtragem (Server-side)
    if (q) {
        query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
    }

    if (filter === "com_marcacao") {
        query = query.gte("next_appointment_date", new Date().toISOString());
    } else if (filter === "sem_marcacao") {
        query = query.or(`next_appointment_date.is.null,next_appointment_date.lt.${new Date().toISOString()}`);
    }

    // Ordenação (Server-side)
    const currentSort = sort || "name_asc";
    if (currentSort === "name_asc") query = query.order("name", { ascending: true });
    else if (currentSort === "name_desc") query = query.order("name", { ascending: false });
    else if (currentSort === "created_desc") query = query.order("created_at", { ascending: false });
    else if (currentSort === "created_asc") query = query.order("created_at", { ascending: true });
    else if (currentSort === "last_visit_desc") query = query.order("last_appointment_date", { ascending: false, nullsFirst: false });
    else if (currentSort === "next_appt_asc") query = query.order("next_appointment_date", { ascending: true, nullsFirst: false });

    query = query.range(0, PAGE_SIZE - 1);

    const { data: clients } = await query;

    // Get update counts for initial clients
    const updateCounts: Record<string, number> = {};
    if (clients && clients.length > 0) {
        const clientIds = clients.map(c => c.id);
        const { data: counts } = await supabase
            .from("client_updates")
            .select("client_id")
            .in("client_id", clientIds);

        if (counts) {
            counts.forEach(update => {
                updateCounts[update.client_id] = (updateCounts[update.client_id] || 0) + 1;
            });
        }
    }

    const clientsWithCounts = (clients || []).map(client => ({
        ...client,
        updateCount: updateCounts[client.id] || 0,
    }));

    const hasMore = (clients?.length || 0) === PAGE_SIZE;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Clientes"
                actions={
                    <Link href="/admin/clientes/novo">
                        <Button className="gap-2">
                            <Icon name="plus" size="sm" />
                            Novo Cliente
                        </Button>
                    </Link>
                }
            />

            {/* Stats Bar */}
            <ClientStatsBar />

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="w-full max-w-sm">
                    <Suspense fallback={<Skeleton variant="rectangular" height={42} width="100%" />}>
                        <SearchInput />
                    </Suspense>
                </div>
                <ClientFilters />
            </div>

            {/* Clients Table with Infinite Scroll */}
            <ClientsTable
                initialClients={clientsWithCounts}
                initialHasMore={hasMore}
                searchQuery={q}
                filter={filter}
                sort={currentSort}
            />
        </div>
    );
}
