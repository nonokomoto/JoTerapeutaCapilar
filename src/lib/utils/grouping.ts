import { ClientUpdate } from "@/types/database";

/**
 * Agrupa atualizações por mês (formato: "janeiro de 2026")
 * Retorna array de [monthLabel, updates[]] ordenado por data (mais recente primeiro)
 */
export function groupUpdatesByMonth(updates: ClientUpdate[]): [string, ClientUpdate[]][] {
    const groups = new Map<string, ClientUpdate[]>();

    updates.forEach(update => {
        const date = new Date(update.created_at);

        // Formato: "janeiro de 2026"
        const monthLabel = date.toLocaleDateString('pt-PT', {
            year: 'numeric',
            month: 'long'
        });

        if (!groups.has(monthLabel)) {
            groups.set(monthLabel, []);
        }
        groups.get(monthLabel)!.push(update);
    });

    // Converter Map para array e ordenar por data (mais recente primeiro)
    // Usamos a primeira update de cada grupo para ordenação
    return Array.from(groups.entries()).sort((a, b) => {
        const dateA = new Date(a[1][0].created_at);
        const dateB = new Date(b[1][0].created_at);
        return dateB.getTime() - dateA.getTime();
    });
}

/**
 * Extrai anos únicos das atualizações para filtros
 * Retorna array ordenado decrescente (mais recente primeiro)
 */
export function getUniqueYears(updates: ClientUpdate[]): number[] {
    const years = new Set<number>();

    updates.forEach(update => {
        const year = new Date(update.created_at).getFullYear();
        years.add(year);
    });

    return Array.from(years).sort((a, b) => b - a);
}

/**
 * Formata data para exibição em PT-PT
 */
export function formatDate(date: string | Date, format: 'full' | 'short' | 'monthYear' = 'full'): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    switch (format) {
        case 'full':
            return d.toLocaleDateString('pt-PT', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        case 'short':
            return d.toLocaleDateString('pt-PT', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        case 'monthYear':
            return d.toLocaleDateString('pt-PT', {
                month: 'long',
                year: 'numeric'
            });
        default:
            return d.toLocaleDateString('pt-PT');
    }
}

/**
 * Filtra atualizações por categoria e ano
 */
export function filterUpdates(
    updates: ClientUpdate[],
    filters: { category?: string; year?: string }
): ClientUpdate[] {
    let filtered = [...updates];

    // Filter by category
    if (filters.category && filters.category !== 'todas') {
        filtered = filtered.filter(update => update.category === filters.category);
    }

    // Filter by year
    if (filters.year && filters.year !== 'todos') {
        const year = parseInt(filters.year, 10);
        filtered = filtered.filter(update => {
            const updateYear = new Date(update.created_at).getFullYear();
            return updateYear === year;
        });
    }

    return filtered;
}
