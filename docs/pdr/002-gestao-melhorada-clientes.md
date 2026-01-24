# PDR 002: Gestão Melhorada de Clientes

**Status**: Proposta
**Data**: 2026-01-23
**Autor**: Sistema

## Contexto

A terapeuta capilar gere um salão de beleza onde clientes fazem marcações e são atendidos. Atualmente, o sistema de gestão de clientes é muito básico:

- **Listagem**: Apenas ordenação por nome alfabético, sem filtros ou badges visuais
- **Informação limitada**: Não há campos para marcações, status ou histórico de visitas
- **Sem contexto temporal**: Difícil identificar clientes recentes, antigos, inativos ou com marcações próximas

### Necessidades da Terapeuta

1. **Saber quem são os clientes mais antigos vs. recentes**
2. **Ver quem tem marcação próxima**
3. **Identificar clientes inativos**
4. **Gerir melhor o relacionamento** com base no histórico

---

## Proposta de Solução

### 1. Campos Adicionais na Base de Dados

Adicionar campos à tabela `profiles` para rastrear informação temporal e de status:

```sql
-- Nova migration: 003_client_management_fields.sql

ALTER TABLE profiles
ADD COLUMN first_visit_date TIMESTAMPTZ,
ADD COLUMN last_appointment_date TIMESTAMPTZ,
ADD COLUMN next_appointment_date TIMESTAMPTZ,
ADD COLUMN status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'aguarda_marcacao'));

-- Índices para performance
CREATE INDEX idx_profiles_next_appointment ON profiles(next_appointment_date) WHERE role = 'client';
CREATE INDEX idx_profiles_last_appointment ON profiles(last_appointment_date) WHERE role = 'client';
CREATE INDEX idx_profiles_status ON profiles(status) WHERE role = 'client';

-- Comentários
COMMENT ON COLUMN profiles.first_visit_date IS 'Data da primeira visita do cliente (preenchido manualmente)';
COMMENT ON COLUMN profiles.last_appointment_date IS 'Data da última consulta/tratamento';
COMMENT ON COLUMN profiles.next_appointment_date IS 'Data da próxima marcação agendada';
COMMENT ON COLUMN profiles.status IS 'Status do cliente: ativo, inativo, aguarda_marcacao';
```

**Campos**:
- `first_visit_date`: Data da primeira visita (diferente de `created_at` que é quando foi criado na plataforma)
- `last_appointment_date`: Última vez que foi atendido
- `next_appointment_date`: Próxima marcação agendada
- `status`: Estado do cliente (`ativo`, `inativo`, `aguarda_marcacao`)

---

### 2. Melhorias na Listagem de Clientes (`/admin/clientes`)

#### 2.1 Filtros e Ordenação

**Filtros disponíveis**:
- Todos os clientes
- Clientes ativos
- Clientes inativos (sem marcação há +30 dias)
- Com marcação próxima (próximos 7 dias)
- Novos clientes (últimos 30 dias)

**Ordenação**:
- Nome (A-Z / Z-A)
- Data de registo (mais recentes / mais antigos)
- Última visita (mais recentes / mais antigos)
- Próxima marcação (mais próximos / mais distantes)

#### 2.2 Badges Visuais na Tabela

Adicionar indicadores visuais na linha de cada cliente:

- 🟢 **"Marcação próxima"** - se `next_appointment_date` ≤ 7 dias
- 🟡 **"Aguarda marcação"** - se `status = 'aguarda_marcacao'`
- 🔴 **"Inativo"** - se `last_appointment_date` > 60 dias ou `status = 'inativo'`
- ✨ **"Novo cliente"** - se `created_at` < 30 dias

#### 2.3 Estatísticas no Topo

Card com resumo visual:

```
┌─────────────────────────────────────────────────────┐
│  Total Clientes: 45   Ativos: 38   Inativos: 7     │
│  Marcações próximas (7d): 12                        │
└─────────────────────────────────────────────────────┘
```

#### 2.4 Nova Coluna na Tabela

Adicionar coluna **"Última Visita"** ou **"Próxima Marcação"** (conforme ordenação ativa).

**Estrutura da tabela atualizada**:

| Nome | Email | Telefone | Última Visita | Atualizações | Status |
|------|-------|----------|---------------|--------------|--------|
| Ana Silva | ana@… | 912… | há 5 dias 🟢 | 3 | → |

---

### 3. Melhorias no Detalhe do Cliente (`/admin/clientes/[id]`)

#### 3.1 Card de Marcações

Novo card na sidebar (ao lado das "Notas Privadas"):

```
┌─────────────────────────────────┐
│  📅 Marcações                    │
│                                  │
│  Primeira visita: 12 Mar 2024   │
│  Última visita: há 5 dias        │
│  Próxima marcação: 28 Jan 2026  │
│                                  │
│  [Editar Marcações]              │
└─────────────────────────────────┘
```

#### 3.2 Timeline Visual

No histórico de atualizações, incluir marcos temporais de marcações:

```
─────────────────────────────────
  28 Jan 2026  📅 Próxima marcação
─────────────────────────────────
  18 Jan 2026  ✉️ Atualização: "Tratamento de ..."
─────────────────────────────────
  15 Jan 2026  📅 Última visita
─────────────────────────────────
```

#### 3.3 Indicador de Status

Badge visual no topo do perfil do cliente:

```
┌────────────────────────────────────┐
│  Ana Silva  🟢 Ativo                │
│  Cliente desde março de 2024       │
└────────────────────────────────────┘
```

Status:
- 🟢 **Ativo** - tem marcações ou foi atendido recentemente
- 🟡 **Aguarda marcação** - sem marcação agendada
- 🔴 **Inativo** - sem atividade há mais de 60 dias

#### 3.4 Modal de Gestão de Marcações

Novo botão "Gerir Marcações" que abre modal para atualizar:
- Data da primeira visita
- Data da última consulta
- Data da próxima marcação
- Status do cliente

---

## Estrutura de Implementação

### Fase 1: Base de Dados
- [ ] Criar migration `003_client_management_fields.sql`
- [ ] Executar migration em produção
- [ ] Atualizar `src/types/supabase.ts` (regenerar tipos)

### Fase 2: Backend / Queries
- [ ] Criar queries para estatísticas (`lib/queries/admin.ts`)
- [ ] Adicionar filtros e ordenação na query de clientes
- [ ] Criar função para calcular status automático

### Fase 3: UI - Listagem de Clientes
- [ ] Adicionar card de estatísticas no topo
- [ ] Implementar filtros (dropdown ou tabs)
- [ ] Implementar ordenação (dropdown)
- [ ] Adicionar badges visuais na tabela
- [ ] Adicionar coluna "Última Visita" / "Próxima Marcação"

### Fase 4: UI - Detalhe do Cliente
- [ ] Criar card de marcações na sidebar
- [ ] Adicionar badge de status no header
- [ ] Criar modal de gestão de marcações
- [ ] Implementar timeline visual (opcional)

### Fase 5: Funcionalidades Auxiliares
- [ ] Auto-atualização de status (função serverless/cron?)
- [ ] Notificações para marcações próximas (futuro)

---

## Design System

### Componentes a Criar/Reutilizar

- **StatusBadge**: Badge para status do cliente (`<Badge variant="success|warning|error" />`)
- **StatsCard**: Card de estatísticas (reutilizar `<StatCard />`)
- **FilterDropdown**: Dropdown de filtros (criar novo componente)
- **SortDropdown**: Dropdown de ordenação (criar novo componente)
- **AppointmentCard**: Card de marcações (novo componente)
- **AppointmentModal**: Modal de gestão de marcações (criar novo)

### Classes CSS a Adicionar

```css
/* Badges de status na tabela */
.client-status-badge {
  /* ... */
}

/* Card de marcações */
.client-appointments-card {
  /* Similar a .client-notes-card */
}

/* Filtros e ordenação */
.clients-filters-bar {
  /* ... */
}
```

---

## Casos de Uso

### UC1: Terapeuta quer ver clientes com marcação esta semana
1. Acede a `/admin/clientes`
2. Clica no filtro "Marcação próxima (7d)"
3. Vê lista filtrada ordenada por `next_appointment_date`

### UC2: Terapeuta quer contactar clientes inativos
1. Acede a `/admin/clientes`
2. Clica no filtro "Inativos"
3. Vê clientes sem atividade há +60 dias
4. Pode enviar atualização ou ligar

### UC3: Terapeuta atualiza marcação de cliente
1. Acede a `/admin/clientes/[id]`
2. Clica em "Gerir Marcações" no card
3. Atualiza "Próxima marcação" para nova data
4. Guarda → status atualiza automaticamente para "ativo"

### UC4: Terapeuta vê cliente pela primeira vez
1. Atende cliente
2. Acede ao perfil em `/admin/clientes/[id]`
3. Clica "Gerir Marcações"
4. Preenche "Primeira visita" e "Última visita" com data de hoje

---

## Questões em Aberto

1. **Auto-atualização de status**: Criar função serverless para marcar clientes como "inativos" automaticamente após X dias? Ou calcular dinamicamente?

2. **Notificações**: No futuro, notificar terapeuta quando marcação está a aproximar-se?

3. **Histórico de marcações**: Guardar histórico completo de todas as marcações (tabela separada) ou apenas última/próxima?

4. **Integração com calendário**: Sincronizar com Google Calendar / Apple Calendar?

---

## Notas Técnicas

- **RLS**: Garantir que clientes **não veem** campos de marcações (apenas admin)
- **Performance**: Índices criados para queries filtradas serem rápidas
- **Mobile-first**: Filtros e estatísticas devem funcionar bem em mobile
- **PT-PT**: Manter linguagem portuguesa (Portugal) em toda a UI

---

## Decisão

**Aprovar implementação?** [ ] Sim [ ] Não [ ] Modificar

Se aprovado, começar por **Fase 1** (migration) e depois **Fase 3** (UI listagem).
