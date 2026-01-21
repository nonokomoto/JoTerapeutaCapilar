"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";

// Types - exported for use in components
export interface ClientProfile {
    id: string;
    name: string;
    avatar_url: string | null;
}

export interface ClientUpdate {
    id: string;
    title: string;
    created_at: string;
}

export interface ClientUpdatesResponse {
    updates: ClientUpdate[];
    count: number;
}

export interface Post {
    id: string;
    title: string;
    content: string | null;
    image_url: string | null;
    created_at: string;
}

// Fetch functions
async function fetchClientProfile(): Promise<ClientProfile> {
    const res = await fetch("/api/client/profile");
    if (!res.ok) throw new Error("Failed to fetch profile");
    return res.json();
}

async function fetchClientUpdates(limit = 3): Promise<ClientUpdatesResponse> {
    const res = await fetch(`/api/client/updates?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch updates");
    return res.json();
}

async function fetchRecentPosts(limit = 6): Promise<Post[]> {
    const res = await fetch(`/api/posts?limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
}

// Hooks

/**
 * Fetches current user's profile
 * @param initialData - SSR data to hydrate cache immediately
 */
export function useClientProfile(initialData?: ClientProfile) {
    return useQuery({
        queryKey: queryKeys.client.profile(),
        queryFn: fetchClientProfile,
        initialData,
        staleTime: 10 * 60 * 1000, // 10 minutes - profile changes rarely
    });
}

/**
 * Fetches current user's treatment updates
 * @param limit - Number of updates to fetch
 * @param initialData - SSR data to hydrate cache immediately
 */
export function useClientUpdates(limit = 3, initialData?: ClientUpdatesResponse) {
    return useQuery({
        queryKey: queryKeys.client.updates(undefined, limit),
        queryFn: () => fetchClientUpdates(limit),
        initialData,
        staleTime: 2 * 60 * 1000, // 2 minutes - updates are more dynamic
    });
}

/**
 * Fetches published posts
 * @param limit - Number of posts to fetch
 * @param initialData - SSR data to hydrate cache immediately
 */
export function useRecentPosts(limit = 6, initialData?: Post[]) {
    return useQuery({
        queryKey: queryKeys.posts.list(limit),
        queryFn: () => fetchRecentPosts(limit),
        initialData,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
