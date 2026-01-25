# Plano de Melhorias - Dashboard Cliente & Admin Clientes

## Visão Geral

Duas áreas a melhorar:
1. **Dashboard Cliente** (`/cliente`) - Adicionar widgets informativos
2. **Lista de Clientes Admin** (`/admin/clientes`) - Enriquecer tabela e stats

---

## PARTE 1: Dashboard Cliente (`/cliente`)

### Estrutura Final Pretendida

```
┌─────────────────────────────────────────────────────────────┐
│  1. HERO (saudação + avatar)                    ✅ EXISTE   │
├─────────────────────────────────────────────────────────────┤
│  2. WIDGET PRÓXIMA CONSULTA (se existir)        🆕 NOVO     │
│     ┌─────────────────────────────────────────────────────┐ │
│     │  📅 Próxima Consulta                                │ │
│     │     Terça-feira, 28 de Janeiro às 15:00             │ │
│     │     Daqui a 3 dias                                  │ │
│     └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  3. STATS CARDS (métricas da jornada)           🆕 NOVO     │
│     ┌───────────────┐  ┌───────────────┐  ┌───────────────┐ │
│     │ 🗓️ Cliente há │  │ 📝 Atualizações│  │ ✨ Visitas    │ │
│     │    8 meses    │  │      12       │  │      8        │ │
│     └───────────────┘  └───────────────┘  └───────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  4. EVOLUÇÃO ANTES/DEPOIS (se existir)          🆕 NOVO     │
│     ┌─────────────────────────────────────────────────────┐ │
│     │  📸 A Minha Evolução                                │ │
│     │  ┌──────────┐   →   ┌──────────┐                    │ │
│     │  │  ANTES   │       │  DEPOIS  │                    │ │
│     │  │ Jan 2025 │       │ Jan 2026 │                    │ │
│     │  └──────────┘       └──────────┘                    │ │
│     │                [Ver todas as comparações]           │ │
│     └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  5. ÚLTIMOS TRATAMENTOS                         ✅ EXISTE   │
├─────────────────────────────────────────────────────────────┤
│  6. NOVIDADES E DICAS                           ✅ EXISTE   │
└─────────────────────────────────────────────────────────────┘
```

### Tarefas Cliente

#### 1.1 Widget Próxima Consulta
- [ ] Criar componente `NextAppointmentWidget.tsx`
- [ ] Buscar `next_appointment_date` do perfil do cliente
- [ ] Mostrar data formatada + "Daqui a X dias"
- [ ] Design: Card destacado com ícone calendário
- [ ] Condição: Só mostrar se existir data futura

#### 1.2 Stats Cards (Jornada)
- [ ] Criar componente `ClientJourneyStats.tsx`
- [ ] Calcular tempo como cliente (meses/anos desde `created_at`)
- [ ] Contar total de atualizações (`client_updates`)
- [ ] Contar total de visitas realizadas (`appointments` com `completed=true`)
- [ ] Design: 3 cards horizontais em grid

#### 1.3 Evolução Antes/Depois
- [ ] Criar componente `BeforeAfterPreview.tsx`
- [ ] Buscar última comparação do cliente (`before_after_comparisons`)
- [ ] Mostrar imagens lado a lado com datas
- [ ] Link para galeria completa (página futura ou modal)
- [ ] Condição: Só mostrar se existir pelo menos 1 comparação

#### 1.4 Integração na Página
- [ ] Atualizar `/cliente/page.tsx` com nova ordem
- [ ] Adicionar queries para novos dados
- [ ] Estilos CSS em `styles.css`

---

## PARTE 2: Admin Clientes (`/admin/clientes`)

### Estrutura Final Pretendida

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Clientes                    [+ Novo Cliente]       │
├─────────────────────────────────────────────────────────────┤
│  STATS BAR (expandida)                          🆕 MELHORAR │
│  👥 45 clientes • 📅 12 com marcação • ⚠️ 8 precisam atenção│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  [🔍 Pesquisar...]              [Filtro ▼] [Ordenar ▼]     │
├─────────────────────────────────────────────────────────────┤
│  TABELA (enriquecida)                           🆕 MELHORAR │
│                                                             │
│  Nome / Contacto      Status       Última    Próxima  Upd  │
│  ──────────────────────────────────────────────────────────│
│  [AV] Ana Silva       🟢 Em dia    15 Jan    28 Jan    5   │
│       ana@email.com                                         │
│  ──────────────────────────────────────────────────────────│
│  [AV] Maria Santos    🟡 Atenção   20 Dez      —       3   │
│       maria@email.com                                       │
│  ──────────────────────────────────────────────────────────│
│  [AV] João Costa      🔴 Inativo   15 Out      —       1   │
│       joao@email.com                                        │
└─────────────────────────────────────────────────────────────┘
```

### Tarefas Admin

#### 2.1 Stats Bar Expandida
- [ ] Adicionar métrica "Precisam de atenção" (sem visita >30 dias)
- [ ] Adicionar métrica "Novos este mês" (opcional)
- [ ] Atualizar query em `useClientStats`
- [ ] Atualizar componente `ClientStatsBar.tsx`

#### 2.2 Avatares na Tabela
- [ ] Importar componente `Avatar` existente
- [ ] Adicionar avatar à célula do nome
- [ ] Ajustar grid da tabela para acomodar avatar

#### 2.3 Coluna "Última Visita"
- [ ] Adicionar coluna `last_appointment_date`
- [ ] Formatar data (dia/mês ou "—" se null)
- [ ] Ajustar responsive breakpoints

#### 2.4 Indicadores Visuais de Status
- [ ] Criar lógica de cálculo de urgência:
  - 🟢 **Em dia**: tem próxima marcação ou visitou há <30 dias
  - 🟡 **Atenção**: sem marcação, última visita 30-60 dias
  - 🔴 **Inativo**: sem marcação, última visita >60 dias
- [ ] Atualizar `ClientStatusBadge` ou criar novo componente
- [ ] Aplicar na tabela

#### 2.5 Ajustes CSS
- [ ] Atualizar estilos da tabela em `styles.css`
- [ ] Garantir responsividade mobile

---

## Ficheiros a Criar/Modificar

### Novos Ficheiros
```
src/components/cliente/
├── NextAppointmentWidget.tsx    # Widget próxima consulta
├── ClientJourneyStats.tsx       # Stats da jornada
└── BeforeAfterPreview.tsx       # Preview evolução
```

### Ficheiros a Modificar
```
src/app/cliente/page.tsx                    # Integrar novos componentes
src/app/admin/clientes/page.tsx             # Dados adicionais
src/app/admin/clientes/ClientsTable.tsx     # Avatar + coluna última visita
src/app/admin/clientes/ClientStatsBar.tsx   # Novas métricas
src/lib/queries/admin.ts                    # Query stats expandida
src/lib/utils/clientStatus.ts               # Lógica de urgência (se necessário)
src/app/styles.css                          # Novos estilos
```

---

## Ordem de Implementação

### Fase 1: Dashboard Cliente
1. `NextAppointmentWidget` + integração
2. `ClientJourneyStats` + integração
3. `BeforeAfterPreview` + integração
4. Estilos CSS

### Fase 2: Admin Clientes
1. Avatares na tabela
2. Coluna "Última Visita"
3. Stats Bar expandida
4. Indicadores visuais de status
5. Ajustes CSS finais

---

## Notas Técnicas

- **Mobile-first**: Todos os componentes devem funcionar bem em mobile
- **Skeleton loading**: Usar loading states para novos componentes
- **Server Components**: Preferir server components onde possível
- **Design System**: Usar classes `ds-*` e componentes UI existentes
- **PT-PT**: Manter linguagem portuguesa de Portugal
