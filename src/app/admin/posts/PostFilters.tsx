"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LayoutGrid } from "lucide-react";

interface PostFiltersProps {
    publishedCount: number;
    draftCount: number;
}

export function PostFilters({ publishedCount, draftCount }: PostFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentFilter = searchParams.get("estado") || "todos";

    const updateFilter = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === "todos") {
            params.delete("estado");
        } else {
            params.set("estado", value);
        }

        const queryString = params.toString();
        router.push(queryString ? `?${queryString}` : window.location.pathname);
    };

    const filters = [
        { value: "todos", label: "Todos", icon: LayoutGrid, count: publishedCount + draftCount },
        { value: "publicados", label: "Publicados", icon: Eye, count: publishedCount },
        { value: "rascunhos", label: "Rascunhos", icon: EyeOff, count: draftCount },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => {
                const isActive = currentFilter === filter.value;
                const FilterIcon = filter.icon;

                return (
                    <button
                        key={filter.value}
                        onClick={() => updateFilter(filter.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                            isActive
                                ? "bg-[var(--color-rose-gold)] text-white"
                                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        <FilterIcon size={16} />
                        {filter.label}
                        <span
                            className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full ${
                                isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                        >
                            {filter.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
