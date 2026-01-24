# ADR-002: Substituição de Loading Spinners por Barra de Progresso

## Status
**Aceite** - 2026-01-23

## Contexto

A aplicação usava ficheiros `loading.tsx` do Next.js App Router em cada rota. Estes ficheiros mostram automaticamente um spinner full-screen durante a navegação entre páginas (Server Components).

### Problemas identificados

1. **UX intrusiva**: Cada navegação substituía toda a página por um spinner, mesmo para transições rápidas
2. **Perda de contexto visual**: O utilizador perdia a referência visual da página anterior
3. **Sensação de lentidão**: Spinners criam perceção de que a app é lenta, mesmo quando a navegação é rápida
4. **Experiência inconsistente**: Comportamento diferente de apps modernas (YouTube, GitHub, etc.)

### Rotas afetadas (11 ficheiros `loading.tsx`)
- `/cliente/atualizacoes`
- `/cliente/conteudos`
- `/cliente/conteudos/[id]`
- `/cliente/perfil`
- `/admin/clientes`
- `/admin/clientes/[id]`
- `/admin/clientes/novo`
- `/admin/posts`
- `/admin/posts/[id]`
- `/admin/posts/novo`
- `/login`

## Decisão

Substituir os ficheiros `loading.tsx` por uma **barra de progresso no topo** (estilo YouTube/GitHub) que:
- Mostra feedback visual subtil durante navegação
- Mantém a página atual visível até a nova carregar
- Anima suavemente o progresso da navegação

## Implementação

### 1. Componente `NavigationProgress`

```tsx
// src/components/ui/NavigationProgress.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgress() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);
    const [progress, setProgress] = useState(0);

    // Reset quando navegação completa
    useEffect(() => {
        setIsNavigating(false);
        setProgress(0);
    }, [pathname, searchParams]);

    // Detecta cliques em links internos
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (href?.startsWith("/") && href !== pathname) {
                setIsNavigating(true);
                setProgress(20);
            }
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [pathname]);

    // Anima progresso
    useEffect(() => {
        if (!isNavigating) return;
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                if (prev >= 70) return prev + 1;
                return prev + 5;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [isNavigating]);

    if (!isNavigating && progress === 0) return null;

    return (
        <div className="navigation-progress-container">
            <div className="navigation-progress-bar" style={{ width: `${progress}%` }} />
        </div>
    );
}
```

### 2. Estilos CSS

```css
/* src/app/styles.css */
.navigation-progress-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    z-index: 99999;
    pointer-events: none;
}

.navigation-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--color-rose-gold), var(--color-taupe));
    box-shadow: 0 0 10px var(--color-rose-gold);
    transition: width 0.1s ease-out, opacity 0.3s ease-out;
}
```

### 3. Integração nos Layouts

```tsx
// AdminLayout.tsx e ClientLayout.tsx
import { Suspense } from "react";
import { NavigationProgress } from "@/components/ui";

export function Layout({ children }) {
    return (
        <div>
            <Suspense fallback={null}>
                <NavigationProgress />
            </Suspense>
            {/* resto do layout */}
        </div>
    );
}
```

### 4. Remoção dos `loading.tsx`

Removidos todos os 11 ficheiros `loading.tsx` das rotas.

## Consequências

### Positivas
- **Melhor UX**: Feedback visual subtil sem interromper a visualização
- **Contexto preservado**: Página atual visível durante transição
- **Perceção de velocidade**: App parece mais rápida e responsiva
- **Consistência**: Comportamento alinhado com apps modernas
- **Menos código**: Um componente reutilizável vs 11 ficheiros individuais

### Negativas
- **Sem fallback para conteúdo**: Se a página demorar muito, não há skeleton/placeholder
- **Depende de JavaScript**: Barra não aparece se JS falhar (aceitável para SPA)

### Trade-offs aceites
- Preferimos uma experiência mais fluida a mostrar estados de loading explícitos
- O tempo de navegação típico (< 2s) não justifica skeletons elaborados

## Problema adicional: Cache do React Query

Durante a investigação, identificámos também que a criação de novos recursos (clientes, posts) não atualizava automaticamente as listas cached.

### Solução implementada

Criámos mutation hooks que invalidam o cache após operações de escrita:

```tsx
// src/lib/queries/admin.ts
export function useCreateClient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const result = await createClientAction(formData);
            if (result?.error) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            // Invalida todas as queries de admin
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
        },
    });
}
```

## Alternativas consideradas

### 1. Manter `loading.tsx` com skeletons (rejeitada)
- **Prós**: Feedback visual específico por página
- **Contras**: Ainda substitui toda a página, mantém problema de UX
- **Decisão**: Não resolve o problema principal

### 2. View Transitions API (adiada)
- **Prós**: Transições nativas do browser, muito suaves
- **Contras**: Suporte limitado (Chrome only), API ainda experimental
- **Decisão**: Considerar no futuro quando suporte for mais amplo

### 3. Parallel Routes / Intercepting Routes (rejeitada)
- **Prós**: Controlo granular de loading states
- **Contras**: Complexidade significativa, refactor extenso
- **Decisão**: Overengineering para o caso de uso atual

## Ficheiros modificados

| Ficheiro | Alteração |
|----------|-----------|
| `src/components/ui/NavigationProgress.tsx` | Novo componente |
| `src/components/ui/index.ts` | Export do componente |
| `src/app/styles.css` | Estilos da barra de progresso |
| `src/components/layouts/AdminLayout.tsx` | Integração do componente |
| `src/components/layouts/ClientLayout.tsx` | Integração do componente |
| `src/lib/queries/admin.ts` | Mutation hook `useCreateClient` |
| `src/lib/queries/index.ts` | Export do mutation hook |
| `src/app/admin/clientes/novo/page.tsx` | Uso do mutation hook |
| 11x `loading.tsx` | Removidos |

## Referências
- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [React Query Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [NProgress](https://github.com/rstacruz/nprogress) - Inspiração para a barra de progresso
