import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { Button, PageHeader, Icon, Skeleton } from "@/components/ui";
import { ClientsTable } from "./ClientsTable";
import { SearchInput } from "./SearchInput";

const PAGE_SIZE = 20;

export default async function AdminClientes({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const supabase = await createClient();
    const { q } = await searchParams;

    // Query first page of clients
    let query = supabase
        .from("profiles")
        .select("*")
        .eq("role", "client")
        .order("name", { ascending: true })
        .range(0, PAGE_SIZE - 1);

    if (q) {
        query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`);
    }

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

            {/* Search */}
            <Suspense fallback={<Skeleton variant="rectangular" height={42} width="100%" className="max-w-sm" />}>
                <SearchInput />
            </Suspense>

            {/* Clients Table with Infinite Scroll */}
            <ClientsTable
                initialClients={clientsWithCounts}
                initialHasMore={hasMore}
                searchQuery={q}
            />
        </div>
    );
}
