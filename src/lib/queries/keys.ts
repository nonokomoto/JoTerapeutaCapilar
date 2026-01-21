/**
 * Query key factory for type-safe cache management.
 * Use these keys consistently across all queries and mutations.
 */
export const queryKeys = {
    // Admin dashboard queries
    admin: {
        all: ["admin"] as const,
        stats: () => [...queryKeys.admin.all, "stats"] as const,
        recentClients: (limit?: number) =>
            [...queryKeys.admin.all, "recentClients", { limit }] as const,
    },

    // Client dashboard queries
    client: {
        all: ["client"] as const,
        profile: (id?: string) => [...queryKeys.client.all, "profile", id] as const,
        updates: (clientId?: string, limit?: number) =>
            [...queryKeys.client.all, "updates", { clientId, limit }] as const,
    },

    // Shared content queries
    posts: {
        all: ["posts"] as const,
        list: (limit?: number) => [...queryKeys.posts.all, "list", { limit }] as const,
        detail: (id: string) => [...queryKeys.posts.all, "detail", id] as const,
    },
};
