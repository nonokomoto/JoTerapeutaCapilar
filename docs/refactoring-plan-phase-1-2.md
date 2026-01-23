# Plano: Refatoração de Componentes para Produção

## 📋 Contexto

Análise completa da aplicação identificou 40+ componentes React que precisam ser otimizados para produção. O objetivo é estabelecer best practices consistentes antes de prosseguir com o roadmap de novas features.

### Problemas Identificados

**Críticos (Bloqueiam Produção):**
1. ❌ Mistura de estilos inline, Tailwind colors e Design System classes
2. ❌ Componentes de layout manipulam DOM diretamente (`document.body.style`)
3. ❌ Falta error boundaries e estados de erro consistentes
4. ❌ Skeletons usam `animate-pulse` (Tailwind) em vez de CSS animations
5. ❌ Inline styles em vez de classes DS semânticas (`style={{ color: "..." }}`)

**Médios (Melhorias de Qualidade):**
- SVG icons definidos inline aumentam complexidade dos componentes
- Lógica de debounce/infinite scroll poderia ser extraída em hooks
- Magic numbers espalhados pelo código (PAGE_SIZE, timeouts)

**Baixos (Nice-to-Have):**
- Algumas componentes poderiam usar compound component pattern
- Estados de loading implementados de forma inconsistente

---

## 🎯 Objetivos

1. **Consistência**: 100% das componentes seguem o Design System
2. **Manutenibilidade**: Código limpo, DRY, testável
3. **Performance**: Otimizações React (memo, lazy loading)
4. **Accessibilidade**: ARIA labels, keyboard navigation
5. **Pronto para Produção**: Zero warnings, best practices

## ⚙️ Decisões Técnicas (Aprovadas)

- **Scope:** Apenas Fases 1-2 (UI Core + Layouts) - Componentes críticas que bloqueiam produção
- **Icons:** Sistema centralizado com componente Icon reutilizável
- **Formulários:** Migrar para React Hook Form (~25kb, validação robusta)
- **Error Handling:** Adicionar Error Boundaries (best practice produção)

---

## 📦 Componentes Prioritárias (Por Ordem de Refatoração)

**NOTA:** Vamos executar apenas Fases 1-2 (UI Core + Layouts). Fases 3-5 ficam para depois do roadmap de features.

---

### 🔴 **Fase 1: UI Core Components** (Fundação)
Refatorar primeiro porque são usadas em toda a app.

#### 1.1 `Button.tsx`
**Problemas:**
- Linha 28-29: Mistura className com inline styles no spinner
- Linha 45-46: Cores hardcoded em `spinnerStyle`

**Soluções:**
- Criar classe `.btn-spinner` no styles.css
- Remover inline styles, usar DS classes

#### 1.2 `Input.tsx`
**Problemas:**
- Linhas 20, 37, 47: Inline styles (`style={{ color: "var(...)" }}`)

**Soluções:**
- Criar classes: `.input-label`, `.input-error-text`, `.input-hint-text`
- Aplicar DS semantic classes

#### 1.3 `Card.tsx`
**Verificação:**
- ✅ Verificar se já está OK ou precisa ajustes

#### 1.4 `Avatar.tsx`
**Verificação:**
- ✅ Verificar se já está OK ou precisa ajustes

#### 1.5 `Badge.tsx`
**Verificação:**
- ✅ Verificar se já está OK ou precisa ajustes

#### 1.6 `StatCard.tsx`
**Verificação:**
- ✅ Verificar accent color system e consistência

#### 1.7 `Spinner.tsx` + `Skeleton.tsx`
**Problemas:**
- Skeletons usam `animate-pulse` (Tailwind)
- Spinner usa inline styles

**Soluções:**
- Criar CSS animations no styles.css
- Remover dependência de Tailwind para animações

---

### 🟡 **Fase 2: Layout Components** (Estrutura)

#### 2.1 `AdminLayout.tsx`
**Problemas CRÍTICOS:**
- Linhas 29-37: Manipulação direta de `document.body.style`
- Icons inline (linhas 11-87) aumentam complexidade
- Linha 251: Inline style no logo mobile

**Soluções:**
- Criar componente `<Icon name="dashboard" />` reutilizável
- Remover DOM manipulation, usar classes CSS
- Extrair icons para `/components/icons/`

#### 2.2 `ClientLayout.tsx`
**Problemas:**
- Provavelmente mesmos problemas que AdminLayout
- Icons inline, inline styles

**Soluções:**
- Usar mesmo sistema de icons da solução 2.1
- Garantir consistência com AdminLayout

#### 2.3 `AuthLayout.tsx`
**Verificação:**
- ✅ Layout simples, provavelmente OK

---

---

### ⏸️ **Fases 3-5: Adiadas para Depois**

As fases seguintes serão executadas após implementar novas features do roadmap:

---

### 🟢 **Fase 3: Feature Components** (Admin) - ADIADA

#### 3.1 `DashboardContent.tsx` (Admin)
**Componentes:**
- `AdminStats`
- `RecentClientsList`
- `StatsSkeleton`
- `ClientsSkeleton`

**Problemas:**
- Skeletons com `animate-pulse`
- Sem error states visíveis

**Soluções:**
- Usar Skeleton.tsx refatorado da Fase 1
- Adicionar error boundaries
- Mostrar erros de TanStack Query

#### 3.2 `SearchInput.tsx`
**Problemas:**
- Lógica de debounce complexa inline

**Soluções:**
- Extrair para hook `useDebounce(value, delay)`
- Simplificar componente

#### 3.3 `ClientsTable.tsx`
**Problemas:**
- Lógica de infinite scroll inline
- Intersection Observer manual

**Soluções:**
- Criar hook `useInfiniteScroll()`
- Melhorar loading states

#### 3.4 `CreateUpdateForm.tsx` + `CreateUpdateModal.tsx`
**Problemas:**
- Modal usa scroll lock manual
- Formulário sem validação consistente

**Soluções:**
- Usar biblioteca modal (Radix UI/Headless UI) ou melhorar implementação
- Adicionar validação de formulário

#### 3.5 `ResetPasswordButton.tsx`
**Problemas:**
- Conditional rendering aninhado (difícil de ler)

**Soluções:**
- Simplificar estrutura
- Early returns

#### 3.6 `EditPostForm.tsx`
**Problemas:**
- Mistura form state com loading states
- Lógica complexa

**Soluções:**
- Separar concerns (form logic vs UI)
- Considerar React Hook Form

---

### 🟢 **Fase 4: Feature Components** (Cliente) - ADIADA

#### 4.1 `DashboardContent.tsx` (Cliente)
**Componentes:**
- `TreatmentsSection`
- `NewsSection`
- `UpdatesSkeleton`
- `PostsSkeleton`

**Soluções:**
- Mesmas da Fase 3.1
- Usar Skeleton refatorado

#### 4.2 `ProfileForm.tsx`
**Problemas:**
- Validação de password provavelmente manual
- Sem feedback visual consistente

**Soluções:**
- Usar validação consistente
- Estados de erro claros

---

### 🔵 **Fase 5: Specialized Components** - ADIADA

#### 5.1 `ImagePicker/index.tsx`
**Verificação:**
- ✅ Verificar upload flow
- ✅ Verificar preview states
- ✅ Garantir 5MB limit e error handling

---

## 🛠️ Tarefas Transversais (Apenas Fases 1-2)

### T1: Instalar Dependências
```bash
npm install react-hook-form @hookform/resolvers zod
```

**Justificação:**
- `react-hook-form` - Gestão de formulários (25kb)
- `@hookform/resolvers` - Integração com validadores
- `zod` - Schema validation (TypeScript-first)

### T2: Sistema de Icons
**Criar:** `src/components/icons/Icon.tsx`

**Abordagem:**
```tsx
// Single component with icon name
<Icon name="dashboard" size="md" className="..." />
<Icon name="clients" size="lg" />
<Icon name="logout" size="sm" />
```

**Icons a migrar:**
- AdminLayout: dashboard, clients, posts, logout, menu, close, collapse
- ClientLayout: (verificar quais icons existem)

**Implementação:**
- Objeto com todos os SVG paths
- Props: `name`, `size` (sm=20px, md=22px, lg=24px), `className`, `...rest`
- TypeScript union type para `name` (autocomplete)

### T3: Custom Hooks
**Criar:**
- ~~`useDebounce`~~ - ADIADO para Fase 3
- ~~`useInfiniteScroll`~~ - ADIADO para Fase 3

### T4: Design System Classes
**Adicionar a `styles.css`:**
```css
/* Spinner styles */
.btn-spinner { ... }

/* Input styles */
.input-label { ... }
.input-error-text { ... }
.input-hint-text { ... }

/* Animations */
@keyframes skeleton-pulse { ... }
@keyframes spinner-rotate { ... }
```

### T5: Error Boundaries
**Criar:** `src/components/ErrorBoundary.tsx`

**Funcionalidades:**
- Class component (Error Boundaries precisam ser classes)
- Props: `fallback`, `onError`, `children`
- UI de erro amigável (PT-PT)
- Botão "Tentar novamente" que reseta o estado
- Log de erros (console.error + preparado para Sentry futuro)

**Aplicar em:**
- `src/app/admin/layout.tsx` - Wrap children
- `src/app/cliente/layout.tsx` - Wrap children
- Páginas com data fetching complexa (opcional)

**UI de Erro:**
```tsx
<div className="ds-panel text-center">
  <h3>Algo correu mal</h3>
  <p className="ds-text-muted">Ocorreu um erro inesperado...</p>
  <Button onClick={reset}>Tentar novamente</Button>
</div>
```

### T6: TypeScript Strict Mode
**Verificar:**
- `tsconfig.json` - Ativar strict mode se ainda não estiver
- Resolver warnings/erros

---

## 📂 Ficheiros a Modificar (Apenas Fases 1-2)

### ✏️ UI Components (Modificar)
- `src/components/ui/Button.tsx`
- `src/components/ui/Input.tsx`
- `src/components/ui/Spinner.tsx`
- `src/components/ui/Skeleton.tsx`
- `src/components/ui/Card.tsx` (verificação)
- `src/components/ui/Avatar.tsx` (verificação)
- `src/components/ui/Badge.tsx` (verificação)
- `src/components/ui/StatCard.tsx` (verificação)

### ✏️ Layout Components (Modificar)
- `src/components/layouts/AdminLayout.tsx`
- `src/components/layouts/ClientLayout.tsx`
- `src/components/layouts/AuthLayout.tsx` (verificação)

### ✏️ Layout Pages (Adicionar Error Boundaries)
- `src/app/admin/layout.tsx`
- `src/app/cliente/layout.tsx`

### ➕ Novos Ficheiros
- `src/components/icons/Icon.tsx` - Sistema de icons centralizado
- `src/components/ErrorBoundary.tsx` - Error boundary genérico
- `src/app/styles.css` - Adicionar classes (btn-spinner, input-*, animations)

### 📦 Package.json
- Adicionar: `react-hook-form`, `@hookform/resolvers`, `zod`

### ⏸️ Adiados para Fases 3-5
- `src/components/admin/DashboardContent.tsx`
- `src/app/admin/clientes/SearchInput.tsx`
- `src/app/admin/clientes/ClientsTable.tsx`
- `src/app/admin/clientes/[id]/CreateUpdateForm.tsx`
- `src/app/admin/clientes/[id]/CreateUpdateModal.tsx`
- `src/app/admin/posts/[id]/EditPostForm.tsx`
- `src/components/cliente/DashboardContent.tsx`
- `src/app/cliente/perfil/ProfileForm.tsx`
- `src/hooks/useDebounce.ts`
- `src/hooks/useInfiniteScroll.ts`

---

## ✅ Checklist de Qualidade (Por Componente)

Cada componente refatorado deve passar estes critérios:

- [ ] **Zero inline styles** - Apenas DS classes ou Tailwind layout
- [ ] **Zero Tailwind color classes** - Só `ds-text-*`, `ds-bg-*`, etc
- [ ] **Acessibilidade** - ARIA labels corretos
- [ ] **TypeScript** - Props bem tipadas, sem `any`
- [ ] **Error handling** - Estados de erro visíveis
- [ ] **Loading states** - Usando Spinner/Skeleton refatorados
- [ ] **Mobile-first** - Touch targets 44x44px mínimo
- [ ] **Performance** - React.memo onde apropriado
- [ ] **Testabilidade** - Props expostas, lógica simples

---

## 🔍 Metodologia de Refatoração

Para cada componente:

1. **Ler código atual** - Identificar problemas específicos
2. **Listar mudanças** - O que precisa ser alterado
3. **Refatorar** - Aplicar best practices
4. **Testar manualmente** - npm run dev, verificar UI
5. **Commit atómico** - 1 componente = 1 commit

---

## 🔧 Detalhes de Implementação

### 1. Sistema de Icons (`Icon.tsx`)

**Estrutura:**
```tsx
// src/components/icons/Icon.tsx
import { SVGProps } from "react";

export type IconName =
  | "dashboard"
  | "clients"
  | "posts"
  | "logout"
  | "menu"
  | "close"
  | "collapse"
  | "home"
  | "updates"
  | "content"
  | "profile";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: "sm" | "md" | "lg";
}

const icons: Record<IconName, JSX.Element> = {
  dashboard: <path d="..." />, // Copiar de AdminLayout
  clients: <path d="..." />,
  // ... outros icons
};

export function Icon({ name, size = "md", className = "", ...props }: IconProps) {
  const sizes = { sm: 20, md: 22, lg: 24 };
  const dimension = sizes[size];

  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={size === "sm" ? 1.5 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {icons[name]}
    </svg>
  );
}
```

**Icons a migrar:**
- AdminLayout: dashboard, clients, posts, logout, menu, close, collapse
- ClientLayout: (ler ficheiro e adicionar os icons necessários)

---

### 2. Error Boundary (`ErrorBoundary.tsx`)

**Estrutura:**
```tsx
// src/components/ErrorBoundary.tsx
"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
    // TODO: Enviar para Sentry no futuro
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="ds-panel text-center max-w-md">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto ds-text-muted" /* ... error icon ... */ />
            </div>
            <h3 className="mb-2">Algo correu mal</h3>
            <p className="ds-text-muted mb-6">
              Ocorreu um erro inesperado. Por favor, tente novamente.
            </p>
            <Button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              variant="primary"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Aplicar em:**
```tsx
// src/app/admin/layout.tsx
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function AdminLayout({ children }) {
  // ... código existente

  return (
    <ErrorBoundary>
      <AdminLayout profile={profile}>
        {children}
      </AdminLayout>
    </ErrorBoundary>
  );
}
```

---

### 3. Design System Classes (adicionar a `styles.css`)

**Adicionar após secção de componentes:**

```css
/* ============================================
   REFACTORED COMPONENTS STYLES
   ============================================ */

/* --- Button Spinner --- */
.btn-spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: var(--radius-full);
  animation: spin 0.6s linear infinite;
}

.btn-spinner--muted {
  border-color: rgba(0, 0, 0, 0.1);
  border-top-color: var(--color-gray-600);
}

/* --- Input Styles --- */
.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
}

.input-label--error {
  color: var(--color-error);
}

.input-error-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-error);
}

.input-hint-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* --- Animations --- */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.skeleton-animated {
  animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

### 4. Refatoração de `Button.tsx`

**Mudanças:**
- Remover `spinnerStyle` inline (linhas 41-47)
- Criar classes `.btn-spinner` e `.btn-spinner--muted`
- Usar classes em vez de inline styles

**Antes:**
```tsx
const spinnerStyle = {
  width: 18,
  height: 18,
  borderWidth: 2,
  borderColor: spinnerColor === "white" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)",
  borderTopColor: spinnerColor === "white" ? "#ffffff" : "var(--color-gray-600)",
};

<span className="spinner" style={spinnerStyle} />
```

**Depois:**
```tsx
<span className={`btn-spinner ${spinnerColor === "muted" ? "btn-spinner--muted" : ""}`} />
```

---

### 5. Refatoração de `Input.tsx`

**Mudanças:**
- Remover inline styles (linhas 20, 37, 47)
- Usar classes `.input-label`, `.input-error-text`, `.input-hint-text`

**Antes:**
```tsx
<label
  style={{ color: hasError ? "var(--color-error)" : "var(--text-secondary)" }}
>
```

**Depois:**
```tsx
<label className={`input-label ${hasError ? "input-label--error" : ""}`}>
```

---

### 6. Refatoração de `AdminLayout.tsx`

**Mudanças principais:**
1. Extrair todos os icons para `Icon` component
2. Remover functions `DashboardIcon()`, `ClientsIcon()`, etc
3. Remover inline style na linha 251
4. Usar Icon component

**Antes:**
```tsx
function DashboardIcon() {
  return <svg>...</svg>;
}

// Uso
<span className="admin-nav-icon">
  <Icon />
</span>
```

**Depois:**
```tsx
import { Icon } from "@/components/icons/Icon";

// No navItems
{ href: "/admin", label: "Dashboard", icon: "dashboard", exact: true }

// Uso
<span className="admin-nav-icon">
  <Icon name={item.icon} size="md" />
</span>
```

**CollapseIcon especial:**
```tsx
// Antes: Function component com prop e inline style
function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return <svg style={{ transform: collapsed ? "rotate(180deg)" : ... }} />;
}

// Depois: Usar Icon com className dinâmica
<Icon
  name="collapse"
  size="sm"
  className={collapsed ? "rotate-180" : ""}
  style={{ transition: "transform 0.2s ease" }}
/>
```

---

### 7. Refatoração de `Skeleton.tsx`

**Mudanças:**
- Remover `animate-pulse` (Tailwind)
- Usar `.skeleton-animated` class do styles.css

**Antes:**
```tsx
<div className="animate-pulse bg-gray-200">
```

**Depois:**
```tsx
<div className="skeleton-animated" style={{ backgroundColor: "var(--color-gray-200)" }}>
// OU se já existe DS class:
<div className="skeleton-animated ds-bg-muted">
```

---

## 🧪 Verificação Final

Depois de completar Fases 1-2:

### Build & Lint
```bash
npm run lint    # Zero erros ESLint
npm run build   # Build success (sem warnings)
```

### Manual Testing Checklist

#### Admin Area
- [ ] Login como admin
- [ ] Dashboard carrega sem erros
- [ ] Sidebar: ícones aparecem corretamente
- [ ] Sidebar: collapse funciona (desktop)
- [ ] Sidebar mobile: menu hambúrguer abre/fecha
- [ ] Navigation: links ativos destacados
- [ ] Avatar e logout button funcionam
- [ ] Navegar entre páginas (Dashboard → Clientes → Posts)

#### Cliente Area
- [ ] Login como cliente
- [ ] Dashboard carrega sem erros
- [ ] Layout cliente: ícones corretos
- [ ] Bottom nav (mobile) funciona
- [ ] Sidebar (desktop) funciona
- [ ] Navegar entre páginas

#### UI Components
- [ ] Botões: variants (primary, secondary, ghost, accent) renderizam
- [ ] Botões: loading state com spinner DS
- [ ] Inputs: label, error, hint renderizam com DS classes
- [ ] Inputs: foco e erro têm estilos corretos
- [ ] Cards, Avatars, Badges: verificar visualmente
- [ ] Skeletons: animação CSS (não Tailwind pulse)

#### Error Boundaries
- [ ] Forçar erro (throw em component) → ErrorBoundary mostra UI
- [ ] Botão "Tentar novamente" reseta estado
- [ ] Console mostra erro logado

#### Mobile (375px width)
- [ ] Touch targets ≥ 44x44px
- [ ] Texto legível
- [ ] Sidebar mobile funciona
- [ ] Bottom nav visível e usável

#### Desktop (1440px width)
- [ ] Sidebar colapsa/expande
- [ ] Layout responsive
- [ ] Hover states funcionam

### Performance & Quality
- [ ] `npm run build` - Zero warnings
- [ ] Console (dev) - Sem erros ou warnings React
- [ ] Lighthouse (opcional) - Score > 90
- [ ] Network tab - Sem 404s ou erros de assets
- [ ] Icons aparecem (não quebrados)

### Code Quality
- [ ] Nenhum inline style em UI components
- [ ] Nenhuma Tailwind color class (text-gray-*, bg-red-*, etc)
- [ ] Todos os ícones usando `<Icon name="..." />`
- [ ] Error Boundaries aplicados em layouts
- [ ] TypeScript: sem erros de tipos

---

## 📊 Estimativa de Esforço (Apenas Fases 1-2)

| Tarefa | Subtarefas | Prioridade | Ordem |
|--------|------------|------------|-------|
| **T1: Instalar deps** | npm install react-hook-form, zod | 🔴 | 1º |
| **T2: Sistema Icons** | Criar Icon.tsx | 🔴 | 2º |
| **T4: DS Classes** | Adicionar a styles.css | 🔴 | 3º |
| **T5: Error Boundary** | Criar ErrorBoundary.tsx | 🔴 | 4º |
| **Fase 1: UI Core** | Button, Input, Spinner, Skeleton, Card, Avatar, Badge, StatCard | 🔴 | 5º |
| **Fase 2: Layouts** | AdminLayout, ClientLayout, AuthLayout | 🔴 | 6º |
| **T5b: Aplicar ErrorBoundary** | Wraps em layouts | 🔴 | 7º |

**Total:** 1-2 sessões de trabalho focadas

**Ordem de Execução:**
1. Instalar dependências (1 min)
2. Criar infraestrutura (Icon, ErrorBoundary, DS classes) (~30 min)
3. Refatorar UI Core components (~45 min)
4. Refatorar Layouts usando novo Icon system (~45 min)
5. Aplicar Error Boundaries (~15 min)
6. Testes manuais e build (~15 min)

---

## 🚀 Próximos Passos

### Imediatamente Após Esta Refatoração
Depois de completar Fases 1-2, a app terá:

✅ **UI Components production-ready** - Button, Input, Spinner, Skeleton consistentes
✅ **Layouts limpos** - AdminLayout e ClientLayout sem DOM manipulation
✅ **Sistema de Icons reutilizável** - Fácil adicionar/modificar icons
✅ **Error Boundaries** - App não crasha completamente em erros
✅ **React Hook Form setup** - Pronto para usar em formulários novos

### Seguir com Roadmap
Com a base sólida, seguir para:

1. **Implementar novas features** do roadmap (prioridade)
2. **Fases 3-5 quando necessário** - Refatorar feature components à medida que editamos
3. **Testes automatizados** - (futuro) Quando app estiver mais madura
4. **Deploy produção** - Após features mínimas implementadas

---

## ⚠️ Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Quebrar funcionalidade existente | Alto | Testar manualmente após cada fase |
| Aumentar bundle size | Médio | Code splitting, tree shaking |
| Regredir acessibilidade | Médio | Checklist a11y por componente |
| Inconsistências visuais | Médio | Screenshot comparison antes/depois |

---

## 📝 Notas Importantes

- **Não adicionar features novas** - Só refatoração
- **Manter compatibilidade** - Mesmas props públicas
- **PT-PT sempre** - Mensagens de erro, labels
- **Mobile-first** - Testar em viewport pequeno primeiro
- **Design System first** - Quando em dúvida, usar DS class

---

## 🔐 Permissões Necessárias

Durante a implementação, vou precisar de permissão para:

1. **Instalar dependências npm** - `react-hook-form`, `@hookform/resolvers`, `zod`
2. **Criar novos ficheiros** - Icon.tsx, ErrorBoundary.tsx
3. **Modificar ficheiros existentes** - UI components, layouts, styles.css
4. **Executar build** - Para validar que não há erros

Não vou precisar de:
- ❌ Operações de base de dados
- ❌ Deploy para produção
- ❌ Git push (apenas commits locais)

---

**Autor do Plano:** Claude Sonnet 4.5
**Data:** 2026-01-22
**Branch:** `brave-jang` (worktree)
**Scope:** Fases 1-2 apenas (UI Core + Layouts)
**Tempo Estimado:** 1-2 sessões (~2-3 horas)
