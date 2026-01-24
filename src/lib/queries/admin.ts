"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { createClientAction, deleteClientAction } from "@/app/admin/clientes/actions";

// Types - exported for use in components
export interface AdminStats {
    clientsCount: number;
    postsCount: number;
    updatesCount: number;
}

export interface RecentClient {
    id: string;
    name: string;
    avatar_url: string | null;
    created_at?: string;
    lastUpdate: string | null;
}

// Fetch functions
async function fetchAdminStats(): Promise<AdminStats> {
    const res = await fetch("/api/admin/stats");
    if (!res.ok) throw new Error("Failed to fetch admin stats");
    return res.json();
}

async function fetchRecentClients(limit = 5): Promise<RecentClient[]> {
    const res = await fetch(`/api/admin/clients?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch recent clients");
    return res.json();
}

// Hooks

/**
 * Fetches admin dashboard stats (clients, posts, updates counts)
 * @param initialData - SSR data to hydrate cache immediately
 */
export function useAdminStats(initialData?: AdminStats) {
    return useQuery({
        queryKey: queryKeys.admin.stats(),
        queryFn: fetchAdminStats,
        initialData,
        staleTime: 10 * 60 * 1000, // 10 minutes - stats change rarely
        placeholderData: (previousData) => previousData, // Show stale data during refetch
    });
}

/**
 * Fetches recent clients with their last update date
 * @param limit - Number of clients to fetch
 * @param initialData - SSR data to hydrate cache immediately
 */
export function useRecentClients(limit = 5, initialData?: RecentClient[]) {
    return useQuery({
        queryKey: queryKeys.admin.recentClients(limit),
        queryFn: () => fetchRecentClients(limit),
        initialData,
        staleTime: 10 * 60 * 1000, // 10 minutes
        placeholderData: (previousData) => previousData, // Show stale data during refetch
    });
}

// Mutations

/**
 * Create a new client and invalidate related caches
 */
export function useCreateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await createClientAction(formData);
            if (result?.error) {
                throw new Error(result.error);
            }
            return result;
        },
        onSuccess: () => {
            // Invalidate all admin queries to refresh data
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
        },
    });
}

/**
 * Delete a client with optimistic updates
 * Immediately updates stats and client list before server confirmation
 */
export function useDeleteClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (clientId: string) => {
            const result = await deleteClientAction(clientId);
            if (result?.error) {
                throw new Error(result.error);
            }
            return result;
        },
        onMutate: async (clientId: string) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.admin.all });

            // Snapshot previous values for rollback
            const previousStats = queryClient.getQueryData<AdminStats>(queryKeys.admin.stats());
            const previousClients = queryClient.getQueryData<RecentClient[]>(queryKeys.admin.recentClients(5));

            // Optimistically update stats (decrement client count)
            if (previousStats) {
                queryClient.setQueryData<AdminStats>(queryKeys.admin.stats(), {
                    ...previousStats,
                    clientsCount: Math.max(0, previousStats.clientsCount - 1),
                });
            }

            // Optimistically remove client from recent clients list
            if (previousClients) {
                queryClient.setQueryData<RecentClient[]>(
                    queryKeys.admin.recentClients(5),
                    previousClients.filter((client) => client.id !== clientId)
                );
            }

            // Return context for rollback
            return { previousStats, previousClients };
        },
        onError: (_err, _clientId, context) => {
            // Rollback on error
            if (context?.previousStats) {
                queryClient.setQueryData(queryKeys.admin.stats(), context.previousStats);
            }
            if (context?.previousClients) {
                queryClient.setQueryData(queryKeys.admin.recentClients(5), context.previousClients);
            }
        },
        onSettled: () => {
            // Always refetch after mutation to ensure consistency
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
        },
    });
}

// Client Statistics
export interface ClientStats {
    total: number;
    comMarcacao: number;
    semMarcacao: number;
}

async function fetchClientStats(): Promise<ClientStats> {
    const res = await fetch("/api/admin/client-stats");
    if (!res.ok) throw new Error("Failed to fetch client stats");
    return res.json();
}

/**
 * Fetches aggregated statistics for clients (active, inactive, upcoming)
 * @param initialData - SSR data to hydrate cache immediately
 */
export function useClientStats(initialData?: ClientStats) {
    return useQuery({
        queryKey: queryKeys.admin.clientStats(),
        queryFn: fetchClientStats,
        initialData,
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: (previousData) => previousData,
    });
}
