"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";

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
            <Search 
                size={18} 
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--color-gray-400)" }}
            />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar clientes..."
                className="w-full h-[42px] pl-11 pr-10 text-sm rounded-lg border bg-white transition-all focus:outline-none focus:ring-2 focus:ring-opacity-50"
                style={{ 
                    borderColor: "var(--color-gray-200)",
                    color: "var(--text-primary)",
                }}
            />
            {/* Clear / Loading indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isPending ? (
                    <Loader2 
                        size={16} 
                        className="animate-spin"
                        style={{ color: "var(--color-gray-400)" }}
                    />
                ) : query ? (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X size={14} style={{ color: "var(--color-gray-400)" }} />
                    </button>
                ) : null}
            </div>
        </div>
    );
}
