# ADR 003: Sistema de Marcações Melhorado

**Data**: 2026-01-24
**Status**: Implementado
**Contexto**: Melhoria do sistema de gestão de marcações de clientes

---

## Contexto e Problema

O sistema original de marcações tinha várias limitações:

### **Problemas Identificados**

1. **Falta de Hora**: Apenas guardava datas, perdendo informação de horário
2. **Sistema Dual Desconectado**:
   - Campos no `profiles` (first_visit_date, last_appointment_date, next_appointment_date)
   - Tabela `appointments` existia mas não era usada no UI
   - Sem sincronização entre ambos
3. **UX Limitada**:
   - Modal simples com 3 campos de data
   - Sem visualização de histórico
   - Sem contexto sobre tipo de marcação ou notas
4. **Sem Histórico Visível**: Impossível ver padrões ou frequência de visitas

---

## Decisão

Implementar um **sistema híbrido inteligente** onde:

1. A tabela `appointments` é a **fonte primária** de dados
2. Os campos no `profiles` são **campos calculados automaticamente**
3. A sincronização acontece via função `syncProfileAppointments()`

### **Arquitetura da Solução**

```
┌─────────────────────────────────────────────┐
│          Tabela appointments                │
│  (Fonte primária - histórico completo)      │
│                                             │
│  • appointment_date (TIMESTAMPTZ)           │
│  • appointment_type (tratamento/...)        │
│  • notes                                    │
│  • completed (boolean)                      │
└─────────────────────────────────────────────┘
                    ↓
         syncProfileAppointments()
                    ↓
┌─────────────────────────────────────────────┐
│         Campos calculados em profiles       │
│                                             │
│  • first_visit_date = MIN(completed)        │
│  • last_appointment_date = MAX(completed)   │
│  • next_appointment_date = MIN(upcoming)    │
└─────────────────────────────────────────────┘
```

---

## Implementação

### **1. Novos Componentes**

#### **AppointmentsModalNew.tsx**
Modal com 3 tabs:
- **Próximas**: Marcações futuras não realizadas
- **Histórico**: Últimas 10 marcações realizadas ou passadas
- **Nova**: Formulário para criar marcação

#### **AppointmentsHistory.tsx**
Lista inteligente que:
- Separa próximas marcações de histórico
- Permite marcar como realizada
- Mostra tipo, data/hora e notas

#### **AppointmentForm.tsx**
Formulário completo com:
- `datetime-local` (data + hora)
- Tipo de marcação (tratamento/consulta/retorno)
- Notas opcionais
- Checkbox "marcar como realizada"

### **2. Novas Actions**

```typescript
// CRUD completo
createAppointment()      // + syncProfileAppointments()
updateAppointment()      // + syncProfileAppointments()
deleteAppointment()      // + syncProfileAppointments()
toggleAppointmentComplete() // + syncProfileAppointments()

// Query
getClientAppointments()

// Sincronização automática
syncProfileAppointments() // Privada, chamada automaticamente
```

### **3. Sincronização Automática**

Sempre que há alteração em `appointments`, a função `syncProfileAppointments()` recalcula:

```typescript
first_visit_date = MIN(appointment_date WHERE completed = true)
last_appointment_date = MAX(appointment_date WHERE completed = true)
next_appointment_date = MIN(appointment_date WHERE completed = false AND appointment_date >= NOW())
```

---

## Consequências

### **Positivas ✅**

1. **Precisão Total**: Data + hora em vez de só data
2. **Histórico Completo**: Visibilidade de todas as marcações
3. **Manutenção Zero**: Sincronização automática (sem dupla entrada)
4. **UX Intuitiva**: Tabs claras, ações rápidas (marcar como realizada)
5. **Insights**: Possibilidade de análise de frequência e padrões
6. **Tipos de Marcação**: Distinguir tratamento/consulta/retorno
7. **Notas Contextuais**: Observações sobre cada marcação

### **Negativas ⚠️**

1. **Complexidade**: Mais código para manter (mas bem estruturado)
2. **Migração**: Clientes com dados antigos mantêm campos manuais (até criar nova marcação)
3. **Performance**: Query extra para sincronização (mas otimizada com índices)

### **Mitigações**

- Função `syncProfileAppointments()` é eficiente (usa índices existentes)
- Componentes bem modularizados (fácil manter)
- Sistema antigo (`AppointmentsModal.tsx`) mantido temporariamente como fallback

---

## Melhorias Futuras

### **Curto Prazo**
- [ ] Botão para eliminar marcação
- [ ] Confirmação antes de eliminar
- [ ] Indicador visual de marcações atrasadas

### **Médio Prazo**
- [ ] Notificações de próximas marcações
- [ ] Relatório de frequência de visitas
- [ ] Exportar histórico para PDF
- [ ] Dashboard com timeline visual

### **Longo Prazo**
- [ ] Integração com calendário (Google Calendar)
- [ ] SMS/Email de lembrete automático
- [ ] Sugestão inteligente de próxima marcação (com base em histórico)

---

## Compatibilidade

### **Migração de Dados**
Não é necessária migração forçada:
- Clientes existentes: campos manuais continuam a funcionar
- Ao criar primeira marcação via novo sistema: sincronização automática
- Campos antigos são sobrescritos por valores calculados

### **Rollback**
Se necessário, pode-se reverter para `AppointmentsModal.tsx` original alterando o import em `AppointmentsSection.tsx`.

---

## Ficheiros Criados/Modificados

### **Criados**
- `src/app/admin/clientes/[id]/AppointmentsModalNew.tsx`
- `src/app/admin/clientes/[id]/AppointmentsHistory.tsx`
- `src/app/admin/clientes/[id]/AppointmentForm.tsx`
- `docs/adr/003-appointments-system-improvement.md`

### **Modificados**
- `src/app/admin/clientes/[id]/AppointmentsSection.tsx` (usar novo modal)
- `src/app/admin/clientes/[id]/AppointmentsCard.tsx` (mostrar hora)
- `src/app/admin/clientes/[id]/AppointmentsModal.tsx` (adicionar datetime-local)
- `src/app/admin/clientes/actions.ts` (novas actions + sync)

---

## Validação

✅ Build passou sem erros
✅ TypeScript types corretos
✅ Componentes seguem Design System (DS classes)
✅ Mobile-first (inputs datetime-local nativos)
✅ PT-PT (labels e formatação de datas)

---

## Referências

- [PDR 002: Gestão Melhorada de Clientes](../pdr/002-gestao-melhorada-clientes.md)
- [Migration 004: Appointments Table](../../supabase/migrations/004_appointments_table.sql)
- [Database Types](../../src/types/database.ts)
