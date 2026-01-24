"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui";

const FILTER_OPTIONS = [
    { value: "all", label: "Todos os clientes" },
    { value: "com_marcacao", label: "Com marcação" },
    { value: "sem_marcacao", label: "Sem marcação" },
];

const SORT_OPTIONS = [
    { value: "name_asc", label: "Nome (A-Z)" },
    { value: "name_desc", label: "Nome (Z-A)" },
    { value: "created_desc", label: "Mais recentes" },
    { value: "created_asc", label: "Mais antigos" },
    { value: "last_visit_desc", label: "Última visita (recentes)" },
    { value: "next_appt_asc", label: "Próxima marcação" },
];

export function ClientFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentFilter = searchParams.get("filter") || "all";
    const currentSort = searchParams.get("sort") || "name_asc";

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(key, value);
        // Reset search when changing filters/sort
        // params.delete("q"); 
        router.push(`/admin/clientes?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <Select
                value={currentFilter}
                onChange={(e) => updateParams("filter", e.target.value)}
                options={FILTER_OPTIONS}
                className="w-full sm:w-56"
            />
            <Select
                value={currentSort}
                onChange={(e) => updateParams("sort", e.target.value)}
                options={SORT_OPTIONS}
                className="w-full sm:w-56"
            />
        </div>
    );
}
