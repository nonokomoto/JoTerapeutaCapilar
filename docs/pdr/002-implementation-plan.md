# Plano de Implementação - PDR 002: Gestão Melhorada de Clientes

**Data**: 2026-01-23
**Baseado em**: PDR 002 + Respostas do utilizador

## Decisões Tomadas

| Questão | Decisão |
|---------|---------|
| Auto-atualização de status | **Cálculo dinâmico** em runtime |
| Histórico de marcações | **Tabela separada** (`appointments`) |
| Timeline visual | **Fase futura** (não incluída nesta versão) |
| Ordem de implementação | **Listagem primeiro** (Fase 3 → Fase 4) |

---

## Estrutura do Plano

```
Fase 1: Base de Dados (migrations)
Fase 2: Backend (queries + server actions)
Fase 3: UI - Listagem de Clientes
Fase 4: UI - Detalhe do Cliente
```

---

## Fase 1: Base de Dados

### 1.1 Migration: Campos de Gestão de Clientes

**Ficheiro**: `supabase/migrations/003_client_management_fields.sql`

```sql
-- =====================================================
-- PDR 002: Campos de Gestão de Clientes
-- =====================================================

-- 1. Adicionar campos à tabela profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS first_visit_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_appointment_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_appointment_date TIMESTAMPTZ;

-- Nota: status será calculado dinamicamente, não armazenado

-- 2. Índices para performance (queries filtradas)
CREATE INDEX IF NOT EXISTS idx_profiles_next_appointment
ON profiles(next_appointment_date)
WHERE role = 'client';

CREATE INDEX IF NOT EXISTS idx_profiles_last_appointment
ON profiles(last_appointment_date)
WHERE role = 'client';

-- 3. Comentários de documentação
COMMENT ON COLUMN profiles.first_visit_date IS 'Data da primeira visita do cliente (manual)';
COMMENT ON COLUMN profiles.last_appointment_date IS 'Data da última consulta/tratamento';
COMMENT ON COLUMN profiles.next_appointment_date IS 'Data da próxima marcação agendada';
```

### 1.2 Migration: Tabela de Histórico de Marcações

**Ficheiro**: `supabase/migrations/004_appointments_table.sql`

```sql
-- =====================================================
-- PDR 002: Tabela de Histórico de Marcações
-- =====================================================

-- 1. Criar tabela de marcações
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    appointment_date TIMESTAMPTZ NOT NULL,
    appointment_type TEXT NOT NULL DEFAULT 'tratamento',
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_client FOREIGN KEY (client_id)
        REFERENCES profiles(id) ON DELETE CASCADE
);

-- 2. Índices
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_client_date ON appointments(client_id, appointment_date DESC);

-- 3. Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_appointments_updated_at();

-- 4. RLS Policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Admin pode ver todas as marcações
CREATE POLICY "Admin can view all appointments"
ON appointments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Admin pode criar/editar/apagar marcações
CREATE POLICY "Admin can manage appointments"
ON appointments FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Clientes NÃO podem ver a tabela de marcações
-- (sem policy para clientes = sem acesso)

-- 5. Comentários
COMMENT ON TABLE appointments IS 'Histórico completo de marcações dos clientes';
COMMENT ON COLUMN appointments.appointment_type IS 'Tipo: tratamento, consulta, retorno';
COMMENT ON COLUMN appointments.completed IS 'Se a marcação foi realizada';
```

### 1.3 Atualizar Tipos TypeScript

**Ficheiro**: `src/types/database.ts` (adicionar)

```typescript
// Novo tipo para status calculado dinamicamente
export type ClientStatus = 'ativo' | 'inativo' | 'aguarda_marcacao';

// Novos campos no Profile
export interface Profile {
    // ... campos existentes ...
    first_visit_date: string | null;
    last_appointment_date: string | null;
    next_appointment_date: string | null;
}

// Nova interface para Appointment
export interface Appointment {
    id: string;
    client_id: string;
    appointment_date: string;
    appointment_type: 'tratamento' | 'consulta' | 'retorno';
    notes: string | null;
    completed: boolean;
    created_at: string;
    updated_at: string;
}
```

### 1.4 Regenerar Tipos Supabase

```bash
supabase gen types typescript --project-id cpgophielhqiagfcaabp > src/types/supabase.ts
```

---

## Fase 2: Backend (Queries + Actions)

### 2.1 Função de Cálculo de Status (Dinâmico)

**Ficheiro**: `src/lib/utils/clientStatus.ts` (novo)

```typescript
import type { ClientStatus } from '@/types';

interface StatusInput {
    last_appointment_date: string | null;
    next_appointment_date: string | null;
}

/**
 * Calcula o status do cliente dinamicamente
 * - ativo: tem marcação futura OU última visita < 60 dias
 * - aguarda_marcacao: sem marcação futura, última visita < 60 dias
 * - inativo: sem atividade há +60 dias
 */
export function calculateClientStatus(client: StatusInput): ClientStatus {
    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const hasNextAppointment = client.next_appointment_date &&
        new Date(client.next_appointment_date) >= now;

    const lastVisitRecent = client.last_appointment_date &&
        new Date(client.last_appointment_date) >= sixtyDaysAgo;

    if (hasNextAppointment) {
        return 'ativo';
    }

    if (lastVisitRecent) {
        return 'aguarda_marcacao';
    }

    return 'inativo';
}

/**
 * Verifica se cliente tem marcação próxima (7 dias)
 */
export function hasUpcomingAppointment(nextDate: string | null): boolean {
    if (!nextDate) return false;
    const next = new Date(nextDate);
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return next >= new Date() && next <= sevenDaysFromNow;
}

/**
 * Verifica se é cliente novo (criado há menos de 30 dias)
 */
export function isNewClient(createdAt: string): boolean {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return new Date(createdAt) >= thirtyDaysAgo;
}
```

### 2.2 Queries de Estatísticas

**Ficheiro**: `src/lib/queries/admin.ts` (adicionar)

```typescript
// Tipos para estatísticas de clientes
export interface ClientStats {
    total: number;
    active: number;
    inactive: number;
    upcomingAppointments: number; // próximos 7 dias
}

// Fetch function para estatísticas
async function fetchClientStats(): Promise<ClientStats> {
    const res = await fetch("/api/admin/client-stats");
    if (!res.ok) throw new Error("Failed to fetch client stats");
    return res.json();
}

// Hook
export function useClientStats(initialData?: ClientStats) {
    return useQuery({
        queryKey: queryKeys.admin.clientStats(),
        queryFn: fetchClientStats,
        initialData,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
}
```

### 2.3 API Route para Estatísticas

**Ficheiro**: `src/app/api/admin/client-stats/route.ts` (novo)

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();

    // Obter todos os clientes com campos de marcação
    const { data: clients, error } = await supabase
        .from("profiles")
        .select("id, created_at, last_appointment_date, next_appointment_date")
        .eq("role", "client");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const now = new Date();
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    let active = 0;
    let inactive = 0;
    let upcomingAppointments = 0;

    clients?.forEach(client => {
        const hasNextAppt = client.next_appointment_date &&
            new Date(client.next_appointment_date) >= now;
        const lastVisitRecent = client.last_appointment_date &&
            new Date(client.last_appointment_date) >= sixtyDaysAgo;

        // Contagem de status
        if (hasNextAppt || lastVisitRecent) {
            active++;
        } else {
            inactive++;
        }

        // Contagem de marcações próximas
        if (client.next_appointment_date) {
            const nextDate = new Date(client.next_appointment_date);
            if (nextDate >= now && nextDate <= sevenDaysFromNow) {
                upcomingAppointments++;
            }
        }
    });

    return NextResponse.json({
        total: clients?.length || 0,
        active,
        inactive,
        upcomingAppointments,
    });
}
```

### 2.4 Server Actions para Marcações

**Ficheiro**: `src/app/admin/clientes/actions.ts` (adicionar)

```typescript
// Atualizar marcações do cliente
export async function updateClientAppointments(
    clientId: string,
    data: {
        first_visit_date?: string | null;
        last_appointment_date?: string | null;
        next_appointment_date?: string | null;
    }
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", clientId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath(`/admin/clientes/${clientId}`);
    revalidatePath("/admin/clientes");
    return { success: true };
}

// CRUD para appointments (histórico)
export async function createAppointment(data: {
    client_id: string;
    appointment_date: string;
    appointment_type?: string;
    notes?: string;
}) {
    const supabase = await createClient();

    const { data: appointment, error } = await supabase
        .from("appointments")
        .insert(data)
        .select()
        .single();

    if (error) return { error: error.message };

    revalidatePath(`/admin/clientes/${data.client_id}`);
    return { data: appointment };
}
```

---

## Fase 3: UI - Listagem de Clientes

### 3.1 Componentes Novos

#### 3.1.1 ClientStatsBar

**Ficheiro**: `src/app/admin/clientes/ClientStatsBar.tsx` (novo)

```typescript
"use client";

import { StatCard } from "@/components/ui";
import { useClientStats, type ClientStats } from "@/lib/queries/admin";

interface ClientStatsBarProps {
    initialData?: ClientStats;
}

export function ClientStatsBar({ initialData }: ClientStatsBarProps) {
    const { data: stats } = useClientStats(initialData);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                label="Total Clientes"
                value={stats?.total || 0}
                icon="users"
            />
            <StatCard
                label="Ativos"
                value={stats?.active || 0}
                icon="user-check"
                variant="success"
            />
            <StatCard
                label="Inativos"
                value={stats?.inactive || 0}
                icon="user-x"
                variant="warning"
            />
            <StatCard
                label="Marcações (7d)"
                value={stats?.upcomingAppointments || 0}
                icon="calendar"
                variant="accent"
            />
        </div>
    );
}
```

#### 3.1.2 ClientFilters

**Ficheiro**: `src/app/admin/clientes/ClientFilters.tsx` (novo)

```typescript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui";

const FILTER_OPTIONS = [
    { value: "all", label: "Todos os clientes" },
    { value: "active", label: "Clientes ativos" },
    { value: "inactive", label: "Clientes inativos" },
    { value: "upcoming", label: "Marcação próxima (7d)" },
    { value: "new", label: "Novos clientes (30d)" },
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
        router.push(`/admin/clientes?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <Select
                value={currentFilter}
                onChange={(e) => updateParams("filter", e.target.value)}
                options={FILTER_OPTIONS}
                className="w-full sm:w-48"
            />
            <Select
                value={currentSort}
                onChange={(e) => updateParams("sort", e.target.value)}
                options={SORT_OPTIONS}
                className="w-full sm:w-48"
            />
        </div>
    );
}
```

#### 3.1.3 ClientStatusBadge

**Ficheiro**: `src/components/ui/ClientStatusBadge.tsx` (novo)

```typescript
import { Badge } from "./Badge";
import type { ClientStatus } from "@/types";

interface ClientStatusBadgeProps {
    status: ClientStatus;
    hasUpcomingAppointment?: boolean;
    isNewClient?: boolean;
    size?: "sm" | "md";
}

const STATUS_CONFIG = {
    ativo: { label: "Ativo", variant: "success" as const },
    inativo: { label: "Inativo", variant: "error" as const },
    aguarda_marcacao: { label: "Aguarda marcação", variant: "warning" as const },
};

export function ClientStatusBadge({
    status,
    hasUpcomingAppointment,
    isNewClient,
    size = "sm"
}: ClientStatusBadgeProps) {
    // Prioridade: marcação próxima > novo cliente > status
    if (hasUpcomingAppointment) {
        return <Badge variant="accent" size={size}>Marcação próxima</Badge>;
    }

    if (isNewClient && status !== 'inativo') {
        return <Badge variant="info" size={size}>Novo cliente</Badge>;
    }

    const config = STATUS_CONFIG[status];
    return <Badge variant={config.variant} size={size}>{config.label}</Badge>;
}
```

### 3.2 Atualizar ClientsTable

Adicionar coluna de status e última visita à tabela existente.

**Alterações em**: `src/app/admin/clientes/ClientsTable.tsx`

- Adicionar `ClientStatusBadge` em cada linha
- Adicionar coluna "Última Visita" (formatada com tempo relativo)
- Passar novos campos do cliente para os badges

### 3.3 Atualizar Página Principal

**Alterações em**: `src/app/admin/clientes/page.tsx`

- Adicionar `<ClientStatsBar />` antes da pesquisa
- Adicionar `<ClientFilters />` ao lado da pesquisa
- Passar filtro e ordenação para a query

### 3.4 CSS para Novos Componentes

**Adicionar em**: `src/app/styles.css`

```css
/* Filtros de clientes */
.clients-filters-bar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-3);
    align-items: center;
}

/* Stats bar responsivo */
.clients-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-4);
}

@media (min-width: 1024px) {
    .clients-stats-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* Badge de status na tabela */
.client-status-cell {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
}
```

---

## Fase 4: UI - Detalhe do Cliente

### 4.1 Card de Marcações

**Ficheiro**: `src/app/admin/clientes/[id]/AppointmentsCard.tsx` (novo)

```typescript
"use client";

import { Icon, Button } from "@/components/ui";
import { ClientStatusBadge } from "@/components/ui/ClientStatusBadge";
import { calculateClientStatus } from "@/lib/utils/clientStatus";
import { formatRelativeDate } from "@/lib/utils/date";

interface AppointmentsCardProps {
    client: {
        first_visit_date: string | null;
        last_appointment_date: string | null;
        next_appointment_date: string | null;
    };
    onEdit: () => void;
}

export function AppointmentsCard({ client, onEdit }: AppointmentsCardProps) {
    const status = calculateClientStatus(client);

    return (
        <div className="client-appointments-card">
            <div className="client-appointments-header">
                <div className="client-appointments-icon">
                    <Icon name="calendar" size={16} />
                </div>
                <h3 className="client-appointments-title">Marcações</h3>
                <ClientStatusBadge status={status} />
            </div>

            <div className="client-appointments-content">
                <AppointmentRow
                    label="Primeira visita"
                    date={client.first_visit_date}
                />
                <AppointmentRow
                    label="Última visita"
                    date={client.last_appointment_date}
                    relative
                />
                <AppointmentRow
                    label="Próxima marcação"
                    date={client.next_appointment_date}
                    highlight
                />
            </div>

            <Button variant="secondary" size="sm" onClick={onEdit} className="w-full">
                <Icon name="edit" size={14} />
                Gerir Marcações
            </Button>
        </div>
    );
}

function AppointmentRow({
    label,
    date,
    relative = false,
    highlight = false
}: {
    label: string;
    date: string | null;
    relative?: boolean;
    highlight?: boolean;
}) {
    return (
        <div className={`client-appointment-row ${highlight ? 'highlight' : ''}`}>
            <span className="client-appointment-label">{label}</span>
            <span className="client-appointment-value">
                {date
                    ? relative
                        ? formatRelativeDate(date)
                        : new Date(date).toLocaleDateString('pt-PT')
                    : 'Não definida'
                }
            </span>
        </div>
    );
}
```

### 4.2 Modal de Gestão de Marcações

**Ficheiro**: `src/app/admin/clientes/[id]/AppointmentsModal.tsx` (novo)

```typescript
"use client";

import { useState } from "react";
import { Modal, Button, Input, FormField } from "@/components/ui";
import { updateClientAppointments } from "../actions";

interface AppointmentsModalProps {
    clientId: string;
    initialData: {
        first_visit_date: string | null;
        last_appointment_date: string | null;
        next_appointment_date: string | null;
    };
    isOpen: boolean;
    onClose: () => void;
}

export function AppointmentsModal({
    clientId,
    initialData,
    isOpen,
    onClose
}: AppointmentsModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_visit_date: initialData.first_visit_date?.split('T')[0] || '',
        last_appointment_date: initialData.last_appointment_date?.split('T')[0] || '',
        next_appointment_date: initialData.next_appointment_date?.split('T')[0] || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await updateClientAppointments(clientId, {
            first_visit_date: formData.first_visit_date || null,
            last_appointment_date: formData.last_appointment_date || null,
            next_appointment_date: formData.next_appointment_date || null,
        });

        setIsLoading(false);

        if (result.success) {
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gerir Marcações">
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField label="Primeira visita">
                    <Input
                        type="date"
                        value={formData.first_visit_date}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            first_visit_date: e.target.value
                        }))}
                    />
                </FormField>

                <FormField label="Última visita">
                    <Input
                        type="date"
                        value={formData.last_appointment_date}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            last_appointment_date: e.target.value
                        }))}
                    />
                </FormField>

                <FormField label="Próxima marcação">
                    <Input
                        type="date"
                        value={formData.next_appointment_date}
                        onChange={(e) => setFormData(prev => ({
                            ...prev,
                            next_appointment_date: e.target.value
                        }))}
                    />
                </FormField>

                <div className="flex gap-3 justify-end pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Guardar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
```

### 4.3 Atualizar Página de Detalhe

**Alterações em**: `src/app/admin/clientes/[id]/page.tsx`

- Adicionar `AppointmentsCard` na sidebar (abaixo de Notas Privadas)
- Adicionar badge de status no header do perfil
- Passar dados de marcações para os componentes

### 4.4 CSS para Card de Marcações

**Adicionar em**: `src/app/styles.css`

```css
/* Card de Marcações */
.client-appointments-card {
    background: var(--bg-card);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    padding: var(--spacing-4);
}

.client-appointments-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-2);
    margin-bottom: var(--spacing-4);
}

.client-appointments-icon {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    background: var(--color-accent-bg);
    color: var(--color-accent);
    display: flex;
    align-items: center;
    justify-content: center;
}

.client-appointments-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    flex: 1;
}

.client-appointments-content {
    margin-bottom: var(--spacing-4);
}

.client-appointment-row {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-2) 0;
    border-bottom: 1px solid var(--border-subtle);
}

.client-appointment-row:last-child {
    border-bottom: none;
}

.client-appointment-row.highlight {
    background: var(--color-accent-bg);
    margin: 0 calc(-1 * var(--spacing-4));
    padding: var(--spacing-2) var(--spacing-4);
    border-radius: var(--radius-sm);
}

.client-appointment-label {
    font-size: 0.8125rem;
    color: var(--text-secondary);
}

.client-appointment-value {
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text-primary);
}
```

---

## Checklist de Implementação

### Fase 1: Base de Dados
- [ ] Criar migration `003_client_management_fields.sql`
- [ ] Criar migration `004_appointments_table.sql`
- [ ] Executar migrations (`supabase db push` ou dashboard)
- [ ] Atualizar `src/types/database.ts`
- [ ] Regenerar `src/types/supabase.ts`

### Fase 2: Backend
- [ ] Criar `src/lib/utils/clientStatus.ts`
- [ ] Criar `src/lib/utils/date.ts` (formatRelativeDate)
- [ ] Adicionar `queryKeys.admin.clientStats()` em `src/lib/queries/keys.ts`
- [ ] Adicionar hooks em `src/lib/queries/admin.ts`
- [ ] Criar `src/app/api/admin/client-stats/route.ts`
- [ ] Adicionar actions em `src/app/admin/clientes/actions.ts`

### Fase 3: UI Listagem
- [ ] Criar `src/app/admin/clientes/ClientStatsBar.tsx`
- [ ] Criar `src/app/admin/clientes/ClientFilters.tsx`
- [ ] Criar `src/components/ui/ClientStatusBadge.tsx`
- [ ] Exportar em `src/components/ui/index.ts`
- [ ] Atualizar `src/app/admin/clientes/page.tsx`
- [ ] Atualizar `src/app/admin/clientes/ClientsTable.tsx`
- [ ] Adicionar CSS em `src/app/styles.css`

### Fase 4: UI Detalhe
- [ ] Criar `src/app/admin/clientes/[id]/AppointmentsCard.tsx`
- [ ] Criar `src/app/admin/clientes/[id]/AppointmentsModal.tsx`
- [ ] Atualizar `src/app/admin/clientes/[id]/page.tsx`
- [ ] Adicionar CSS em `src/app/styles.css`

### Validação Final
- [ ] Testar filtros e ordenação
- [ ] Testar cálculo dinâmico de status
- [ ] Testar CRUD de marcações
- [ ] Verificar RLS (cliente não vê marcações)
- [ ] Testar em mobile
- [ ] `npm run build` sem erros
- [ ] `npm run lint` sem erros

---

## Estimativa de Ficheiros

| Fase | Ficheiros Novos | Ficheiros Modificados |
|------|-----------------|----------------------|
| 1 | 2 migrations | 2 (database.ts, supabase.ts) |
| 2 | 3 | 2 (admin.ts, actions.ts) |
| 3 | 3 | 3 (page.tsx, ClientsTable.tsx, styles.css) |
| 4 | 2 | 2 (page.tsx, styles.css) |
| **Total** | **10** | **9** |

---

## Notas de Implementação

1. **Mobile-first**: Todos os componentes devem funcionar bem em ecrãs pequenos
2. **PT-PT**: Usar "Guardar" não "Salvar", "Marcação" não "Agendamento"
3. **Design System**: Usar classes DS, não Tailwind para cores
4. **Performance**: Queries filtradas usam índices criados nas migrations
5. **RLS**: Tabela `appointments` só acessível por admin

---

## Ordem de Execução Recomendada

```
1. Fase 1 completa (migrations + tipos)
2. Fase 2 completa (backend)
3. Fase 3.1-3.3 (componentes de listagem)
4. Fase 3.4 (CSS)
5. Testar listagem
6. Fase 4.1-4.2 (componentes de detalhe)
7. Fase 4.3-4.4 (integração + CSS)
8. Testar detalhe
9. Validação final
```
