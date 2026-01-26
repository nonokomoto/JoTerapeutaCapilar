"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UpdateCategory } from "@/types/database";

interface UpdateFiltersChipsProps {
    categories: UpdateCategory[];
    years: number[];
    totalCount: number;
    filteredCount: number;
}

const CATEGORY_CONFIG: Record<UpdateCategory, { label: string; color: string }> = {
    evolucao: { label: "Evolução", color: "var(--color-sage)" },
    rotina: { label: "Rotina", color: "var(--color-info-vibrant)" },
    recomendacao: { label: "Recomendação", color: "var(--color-rose-gold)" },
    agendamento: { label: "Agendamento", color: "var(--color-warning-vibrant)" },
    outro: { label: "Outro", color: "var(--color-taupe)" }
};

function FilterIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    );
}

function ChevronDownIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

function ChevronUpIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 15l-6-6-6 6" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

export function UpdateFiltersChips({ categories, years, totalCount, filteredCount }: UpdateFiltersChipsProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedCategory = searchParams.get("categoria") || "";
    const selectedYear = searchParams.get("ano") || "";
    const hasFilters = selectedCategory || selectedYear;

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (!value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        const queryString = params.toString();
        router.push(queryString ? `?${queryString}` : window.location.pathname);
    };

    const clearAllFilters = () => {
        router.push(window.location.pathname);
    };

    // Generate summary text for collapsed state
    const getFilterSummary = () => {
        const parts = [];
        if (selectedCategory && CATEGORY_CONFIG[selectedCategory as UpdateCategory]) {
            parts.push(CATEGORY_CONFIG[selectedCategory as UpdateCategory].label);
        }
        if (selectedYear) {
            parts.push(selectedYear);
        }
        return parts.length > 0 ? parts.join(" · ") : "Todos";
    };

    return (
        <div className="filters-chips-container">
            {/* Collapsed Header */}
            <button
                type="button"
                className="filters-chips-header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="filters-chips-header-left">
                    <FilterIcon />
                    <span className="filters-chips-label">Filtros</span>
                    {hasFilters && (
                        <span className="filters-chips-summary">{getFilterSummary()}</span>
                    )}
                </div>
                <div className="filters-chips-header-right">
                    {hasFilters && (
                        <span className="filters-chips-count">
                            {filteredCount} de {totalCount}
                        </span>
                    )}
                    {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="filters-chips-content">
                    {/* Category Chips */}
                    <div className="filters-chips-group">
                        <span className="filters-chips-group-label">Categoria</span>
                        <div className="filters-chips-row">
                            <button
                                type="button"
                                className={`filter-chip ${!selectedCategory ? 'active' : ''}`}
                                onClick={() => updateFilter("categoria", "")}
                            >
                                Todas
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => updateFilter("categoria", category)}
                                    style={{
                                        '--chip-color': CATEGORY_CONFIG[category].color
                                    } as React.CSSProperties}
                                >
                                    {CATEGORY_CONFIG[category].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Year Chips */}
                    {years.length > 0 && (
                        <div className="filters-chips-group">
                            <span className="filters-chips-group-label">Ano</span>
                            <div className="filters-chips-row">
                                <button
                                    type="button"
                                    className={`filter-chip ${!selectedYear ? 'active' : ''}`}
                                    onClick={() => updateFilter("ano", "")}
                                >
                                    Todos
                                </button>
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        type="button"
                                        className={`filter-chip ${selectedYear === String(year) ? 'active' : ''}`}
                                        onClick={() => updateFilter("ano", String(year))}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Clear Filters */}
                    {hasFilters && (
                        <button
                            type="button"
                            className="filters-chips-clear"
                            onClick={clearAllFilters}
                        >
                            <XIcon />
                            Limpar filtros
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
