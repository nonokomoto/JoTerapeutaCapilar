"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";

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
        staleTime: 5 * 60 * 1000, // 5 minutes
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
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
