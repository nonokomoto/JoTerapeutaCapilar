"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition, useRef } from "react";
import { Icon } from "@/components/ui";

export function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);
    const isFirstRender = useRef(true);
    const lastPushedQuery = useRef(initialQuery);

    // Debounce search - only when query changes from user input
    useEffect(() => {
        // Skip on first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Skip if query hasn't actually changed from what we pushed
        if (query === lastPushedQuery.current) {
            return;
        }

        const timeout = setTimeout(() => {
            const params = new URLSearchParams();
            
            if (query.trim()) {
                params.set("q", query.trim());
            }

            lastPushedQuery.current = query.trim();
            
            startTransition(() => {
                const url = query.trim() 
                    ? `/admin/clientes?${params.toString()}`
                    : "/admin/clientes";
                router.push(url);
            });
        }, 400);

        return () => clearTimeout(timeout);
    }, [query, router]);

    const clearSearch = () => {
        setQuery("");
        lastPushedQuery.current = "";
        router.push("/admin/clientes");
    };

    return (
        <div className="relative max-w-sm">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ds-text-muted">
                <Icon name="search" size={18} />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar clientes..."
                className="search-input"
            />
            {/* Clear / Loading indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isPending ? (
                    <div className="ds-text-muted animate-spin">
                        <Icon name="loader" size={16} />
                    </div>
                ) : query ? (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="search-input-clear"
                    >
                        <Icon name="x" size={14} />
                    </button>
                ) : null}
            </div>
        </div>
    );
}
