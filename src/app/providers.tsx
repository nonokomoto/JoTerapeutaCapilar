"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Data stays fresh for 5 minutes
                        staleTime: 5 * 60 * 1000,
                        // Cache is garbage collected after 30 minutes
                        gcTime: 30 * 60 * 1000,
                        // Disable refetch on window focus (mobile UX - app switching)
                        refetchOnWindowFocus: false,
                        // Disable refetch on network reconnect
                        refetchOnReconnect: false,
                        // Don't retry on error by default
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
