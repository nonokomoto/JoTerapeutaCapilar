"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { UpdateCategory } from "@/types/database";

interface UpdateFiltersProps {
    categories: UpdateCategory[];
    years: number[];
}

const CATEGORY_LABELS: Record<UpdateCategory, string> = {
    evolucao: "Evolução",
    rotina: "Rotina",
    recomendacao: "Recomendação",
    agendamento: "Agendamento",
    outro: "Outro"
};

export function UpdateFilters({ categories, years }: UpdateFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedCategory = searchParams.get("categoria") || "todas";
    const selectedYear = searchParams.get("ano") || "todos";

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value === "todas" || value === "todos") {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        const queryString = params.toString();
        router.push(queryString ? `?${queryString}` : window.location.pathname);
    };

    return (
        <div className="update-filters">
            {/* Category Filter */}
            <div className="filter-group">
                <label htmlFor="category-filter" className="filter-label">
                    Categoria
                </label>
                <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => updateFilter("categoria", e.target.value)}
                    className="filter-select input"
                >
                    <option value="todas">Todas as categorias</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {CATEGORY_LABELS[category]}
                        </option>
                    ))}
                </select>
            </div>

            {/* Year Filter */}
            <div className="filter-group">
                <label htmlFor="year-filter" className="filter-label">
                    Ano
                </label>
                <select
                    id="year-filter"
                    value={selectedYear}
                    onChange={(e) => updateFilter("ano", e.target.value)}
                    className="filter-select input"
                >
                    <option value="todos">Todos os anos</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
