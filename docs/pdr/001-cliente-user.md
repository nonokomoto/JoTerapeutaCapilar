# PDR-001: Cliente (User) - Especificação Completa

> **Product Design Record** - Documento de referência para o conceito de "Cliente" na plataforma Jo Terapeuta Capilar

**Data de criação:** 2026-01-23
**Versão:** 1.0
**Estado:** Draft

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Definição de Cliente](#definição-de-cliente)
3. [Modelo de Dados](#modelo-de-dados)
4. [User Journey Map](#user-journey-map)
5. [Operações CRUD](#operações-crud)
6. [Fluxos de Utilizador](#fluxos-de-utilizador)
7. [Estados e Transições](#estados-e-transições)
8. [Edge Cases](#edge-cases)
9. [Gaps Identificados](#gaps-identificados)
10. [Proposta de Melhorias](#proposta-de-melhorias)

---

## Visão Geral

### O que é um Cliente neste sistema?

Um **Cliente** é uma pessoa que está a fazer tratamento capilar com a Jo Terapeuta. A plataforma permite à terapeuta (admin) acompanhar cada cliente de forma personalizada, enviando atualizações sobre o progresso do tratamento e partilhando conteúdo educativo.

### Princípios Fundamentais

| Princípio | Descrição |
|-----------|-----------|
| **Sem auto-registo** | Admin cria todas as contas de cliente |
| **Mobile-first** | Clientes usam quase exclusivamente telemóvel |
| **Dados privados** | Cliente só vê os seus próprios dados (RLS) |
| **Acompanhamento pessoal** | Cada cliente tem atualizações personalizadas |

---

## Definição de Cliente

### Persona Principal

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE                           │
├─────────────────────────────────────────────────────┤
│  Quem: Pessoa em tratamento capilar com a Jo        │
│  Idade: 25-55 anos (maioria mulheres)               │
│  Dispositivo: Telemóvel (95%+)                      │
│  Tech-savvy: Baixo a médio                          │
│  Frequência: Semanal a mensal                       │
└─────────────────────────────────────────────────────┘
```

### Necessidades do Cliente

1. **Ver progresso** - Acompanhar evolução do tratamento
2. **Receber orientações** - Instruções personalizadas da terapeuta
3. **Aceder a conteúdo** - Artigos e dicas sobre cuidados capilares
4. **Gerir perfil** - Atualizar informações de contacto

### Relação com Admin

```
ADMIN (Jo Terapeuta)
     │
     ├── Cria conta do cliente
     ├── Envia atualizações personalizadas
     ├── Anexa fotos e documentos
     ├── Mantém notas privadas
     └── Pode repor password

CLIENTE
     │
     ├── Recebe credenciais da admin
     ├── Faz login na plataforma
     ├── Visualiza as suas atualizações
     ├── Lê conteúdo geral
     └── Atualiza o próprio perfil
```

---

## Modelo de Dados

### Estrutura do Cliente (profiles)

| Campo | Tipo | Obrigatório | Editável por Cliente | Editável por Admin |
|-------|------|-------------|----------------------|---------------------|
| `id` | UUID | Sim | Não | Não |
| `name` | TEXT | Sim | Sim | **Em falta** |
| `email` | TEXT | Sim | Não | **Em falta** |
| `phone` | TEXT | Não | Sim | **Em falta** |
| `avatar_url` | TEXT | Não | Sim | Não |
| `notes` | TEXT | Não | Não (invisível) | Sim |
| `role` | TEXT | Sim | Não | Não |
| `created_at` | TIMESTAMP | Sim | Não | Não |
| `updated_at` | TIMESTAMP | Sim | Automático | Automático |

### Dados Relacionados

```
┌──────────────┐
│   CLIENTE    │
│  (profiles)  │
└──────┬───────┘
       │
       ├───────────────────────┐
       │                       │
       ▼                       ▼
┌──────────────────┐    ┌──────────────┐
│ CLIENT_UPDATES   │    │    POSTS     │
│ (personalizadas) │    │   (gerais)   │
└────────┬─────────┘    └──────────────┘
         │
         ▼
┌──────────────────┐
│   ATTACHMENTS    │
│ (imagens, PDFs)  │
└──────────────────┘
```

### Contadores Derivados

- **Total de atualizações**: COUNT de client_updates para este cliente
- **Cliente desde**: created_at formatado

---

## User Journey Map

### Journey 1: Novo Cliente (Onboarding)

```
┌────────────────────────────────────────────────────────────────────┐
│                    ONBOARDING DO CLIENTE                           │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  1. CRIAÇÃO        2. COMUNICAÇÃO      3. PRIMEIRO         4. USO │
│     DA CONTA          CREDENCIAIS         LOGIN              ATIVO│
│                                                                    │
│  ┌─────────┐       ┌─────────┐       ┌─────────┐       ┌────────┐ │
│  │  Admin  │──────▶│  Admin  │──────▶│ Cliente │──────▶│Cliente │ │
│  │  cria   │       │ envia   │       │ recebe  │       │explora │ │
│  │ cliente │       │email+pw │       │credenc. │       │platafor│ │
│  └─────────┘       └─────────┘       └─────────┘       └────────┘ │
│       │                 │                 │                 │      │
│       ▼                 ▼                 ▼                 ▼      │
│   Conta criada      Comunicação       Login feito       Perfil    │
│   no Supabase       por WhatsApp      Vê dashboard     atualizado │
│                     ou presencial                      Muda pw    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Touchpoints:**
- Criação: `/admin/clientes/novo`
- Comunicação: Externa (WhatsApp, presencial)
- Login: `/login`
- Dashboard: `/cliente`

### Journey 2: Acompanhamento de Tratamento

```
┌────────────────────────────────────────────────────────────────────┐
│                 CICLO DE ACOMPANHAMENTO                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                         ┌──────────────┐                           │
│                         │   Cliente    │                           │
│                    ┌───▶│faz tratamento│◀────┐                     │
│                    │    └──────┬───────┘     │                     │
│                    │           │             │                     │
│                    │           ▼             │                     │
│                    │    ┌──────────────┐     │                     │
│                    │    │ Admin regista│     │                     │
│    Ver histórico   │    │ atualização  │     │  Segue instruções   │
│    de atualizações │    └──────┬───────┘     │  do tratamento      │
│                    │           │             │                     │
│                    │           ▼             │                     │
│                    │    ┌──────────────┐     │                     │
│                    │    │ Cliente vê   │     │                     │
│                    └────│ atualização  │─────┘                     │
│                         │ e anexos     │                           │
│                         └──────────────┘                           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Journey 3: Consumo de Conteúdo

```
Cliente Login ──▶ Dashboard ──▶ Ver "Novidades" ──▶ Ler artigo
                      │
                      └──▶ Menu "Conteúdos" ──▶ Lista de artigos ──▶ Ler
```

---

## Operações CRUD

### CREATE - Criação de Cliente

**Quem pode:** Apenas Admin
**Onde:** `/admin/clientes/novo`
**Campos necessários:**
- Nome completo (obrigatório)
- Email (obrigatório, único)
- Telefone (opcional)
- Notas privadas (opcional)

**Processo:**
1. Admin preenche formulário
2. Sistema gera password temporária (12 caracteres)
3. Cria utilizador no Supabase Auth
4. Trigger automático cria perfil na tabela `profiles`
5. Atualiza perfil com telefone e notas
6. Apresenta credenciais à admin para partilhar

**Output:**
```
Email: cliente@exemplo.com
Password temporária: aB3cD4eF5gH6
```

### READ - Leitura de Clientes

#### Lista de Clientes (Admin)
**Onde:** `/admin/clientes`
**Dados mostrados:**
- Avatar/iniciais
- Nome
- Email
- Telefone
- Número de atualizações
- Data de criação

**Funcionalidades:**
- Pesquisa por nome, email, telefone
- Scroll infinito (20 por página)
- Ordenação por nome (A-Z)

#### Detalhe do Cliente (Admin)
**Onde:** `/admin/clientes/[id]`
**Dados mostrados:**
- Perfil completo
- Notas privadas
- Lista de todas as atualizações
- Anexos de cada atualização

#### Perfil Próprio (Cliente)
**Onde:** `/cliente/perfil`
**Dados mostrados:**
- Nome
- Email (apenas leitura)
- Telefone
- Avatar

### UPDATE - Atualização de Cliente

#### Pelo Próprio Cliente
**Onde:** `/cliente/perfil`
**Pode editar:**
- ✅ Nome
- ✅ Telefone
- ✅ Avatar
- ✅ Password

**Não pode editar:**
- ❌ Email
- ❌ Role

#### Pelo Admin ✅ IMPLEMENTADO
**Onde:** `/admin/clientes/[id]` (botão "Editar" no banner do perfil)
**Pode editar:**
- ✅ Nome
- ✅ Email (com validação de unicidade)
- ✅ Telefone
- ✅ Notas privadas

**Componente:** `EditClientModal.tsx`
**Server Action:** `updateClientAction(formData)`

**Processo:**
1. Clica em "Editar" no banner do perfil
2. Modal abre com formulário pré-preenchido
3. Edita campos necessários
4. Clica "Guardar"
5. Validação de email único (se alterado)
6. Atualiza auth + profile

### DELETE - Eliminação de Cliente ✅ IMPLEMENTADO

**Onde:** `/admin/clientes/[id]` (botão "Eliminar" no banner do perfil)
**Componente:** `DeleteClientButton.tsx`
**Server Action:** `deleteClientAction(clientId)`

**Processo:**
1. Clica em "Eliminar" no banner
2. Modal de confirmação abre
3. Mostra resumo do que será eliminado
4. Requer escrever o nome do cliente para confirmar
5. Elimina: ficheiros storage → attachments → updates → profile → auth user
6. Redireciona para lista de clientes

**Segurança:**
- Verifica se utilizador é admin
- Não permite eliminar admins
- Confirmação com nome obrigatória
- Cascade delete completo

---

## Fluxos de Utilizador

### Fluxo Admin: Gerir Clientes

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ADMIN: GESTÃO DE CLIENTES                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   /admin                                                            │
│      │                                                              │
│      ▼                                                              │
│   Dashboard ────────────────▶ Estatísticas gerais                   │
│      │                       (total clientes, atualizações)         │
│      │                                                              │
│      ▼                                                              │
│   /admin/clientes                                                   │
│      │                                                              │
│      ├──▶ [Pesquisar] ──▶ Filtrar lista                            │
│      │                                                              │
│      ├──▶ [Novo Cliente] ──▶ /admin/clientes/novo                  │
│      │                         │                                    │
│      │                         ▼                                    │
│      │                      Preencher formulário                    │
│      │                         │                                    │
│      │                         ▼                                    │
│      │                      Ver credenciais geradas                 │
│      │                         │                                    │
│      │                         ▼                                    │
│      │                      Partilhar com cliente                   │
│      │                                                              │
│      └──▶ [Clicar cliente] ──▶ /admin/clientes/[id]                │
│                                   │                                 │
│                                   ├──▶ Ver perfil                  │
│                                   ├──▶ Ver/editar notas            │
│                                   ├──▶ Repor password              │
│                                   ├──▶ Ver atualizações            │
│                                   └──▶ Criar nova atualização      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Fluxo Cliente: Usar Plataforma

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CLIENTE: USO DA PLATAFORMA                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   /login                                                            │
│      │                                                              │
│      ▼                                                              │
│   Inserir email + password                                          │
│      │                                                              │
│      ▼                                                              │
│   /cliente                                                          │
│      │                                                              │
│      ├──▶ Dashboard                                                 │
│      │       │                                                      │
│      │       ├──▶ Ver atualizações recentes (3)                    │
│      │       └──▶ Ver novidades recentes (6)                       │
│      │                                                              │
│      ├──▶ /cliente/atualizacoes                                    │
│      │       │                                                      │
│      │       └──▶ Lista completa de atualizações                   │
│      │               │                                              │
│      │               └──▶ Ver anexos (imagens, PDFs)               │
│      │                                                              │
│      ├──▶ /cliente/conteudos                                       │
│      │       │                                                      │
│      │       └──▶ Artigos e dicas gerais                           │
│      │               │                                              │
│      │               └──▶ /cliente/conteudos/[id] (ler artigo)     │
│      │                                                              │
│      └──▶ /cliente/perfil                                          │
│              │                                                      │
│              ├──▶ Editar nome e telefone                           │
│              ├──▶ Alterar password                                 │
│              └──▶ Terminar sessão                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Estados e Transições

### Estados do Cliente

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ESTADOS DO CLIENTE                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌───────────────┐                                                 │
│   │   PENDENTE    │ ─── Admin criou conta, cliente não fez login   │
│   └───────┬───────┘                                                 │
│           │                                                         │
│           │ Cliente faz primeiro login                              │
│           ▼                                                         │
│   ┌───────────────┐                                                 │
│   │    ATIVO      │ ─── Cliente usa a plataforma regularmente      │
│   └───────┬───────┘                                                 │
│           │                                                         │
│           │ Tratamento concluído / Cliente inativo                  │
│           ▼                                                         │
│   ┌───────────────┐                                                 │
│   │   INATIVO     │ ─── Não faz login há X meses (futuro)          │
│   └───────┬───────┘                                                 │
│           │                                                         │
│           │ Admin arquiva/elimina                                   │
│           ▼                                                         │
│   ┌───────────────┐                                                 │
│   │  ARQUIVADO    │ ─── Dados preservados mas ocultos (futuro)     │
│   └───────────────┘                                                 │
│                                                                     │
│   NOTA: Atualmente só existe estado implícito "ativo"              │
│         Estados futuros a considerar implementar                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Transições de Password

```
Password temporária ──▶ Cliente altera ──▶ Password definitiva
                              │
                              ▼
              Admin pode repor ──▶ Nova password temporária
```

---

## Edge Cases

### E1: Email duplicado na criação
- **Situação:** Admin tenta criar cliente com email já existente
- **Comportamento atual:** Erro do Supabase Auth
- **UX esperada:** Mensagem clara "Este email já está em uso"

### E2: Cliente esquece password
- **Situação:** Cliente não consegue fazer login
- **Solução atual:** Contactar admin para repor password
- **Processo:**
  1. Cliente contacta admin (WhatsApp/telefone)
  2. Admin vai a `/admin/clientes/[id]`
  3. Clica "Repor password"
  4. Partilha nova password temporária

### E3: Cliente tenta aceder a dados de outro
- **Situação:** Cliente manipula URL ou API
- **Proteção:** RLS bloqueia acesso
- **Resultado:** Erro ou lista vazia

### E4: Admin elimina cliente com atualizações ✅ RESOLVIDO
- **Situação:** Cliente tem histórico de atualizações e anexos
- **Comportamento:** Modal de confirmação mostra quantidade de atualizações
- **Requer:** Escrever nome do cliente para confirmar
- **Processo:** Elimina ficheiros do storage → attachments → updates → profile → auth

### E5: Cliente inativo há muito tempo
- **Situação:** Cliente não faz login há meses
- **Estado atual:** Nenhum tracking de atividade
- **Futuro:** Considerar campo `last_login_at`

### E6: Dados de contacto errados ✅ RESOLVIDO
- **Situação:** Admin inseriu email/telefone incorretos
- **Solução:** Admin clica "Editar" no banner do perfil
- **Processo:** Modal com formulário pré-preenchido → corrigir → guardar

---

## Gaps Identificados

### ~~Gap 1: Edição de Cliente pelo Admin~~ ✅ RESOLVIDO

**Implementado em:** 2026-01-23
**Componente:** `EditClientModal.tsx`
**Server Action:** `updateClientAction()`

### ~~Gap 2: Eliminação de Cliente~~ ✅ RESOLVIDO

**Implementado em:** 2026-01-23
**Componente:** `DeleteClientButton.tsx`
**Server Action:** `deleteClientAction()`

### Gap 3: Estados do Cliente ⚠️ FUTURO

**Problema:**
Não há distinção entre cliente ativo e inativo.

**Futuro:**
- Campo `status`: 'active' | 'inactive' | 'archived'
- Tracking de último login
- Filtro por estado na lista

### Gap 4: Histórico de Alterações

**Problema:**
Não há registo de quem alterou o quê e quando.

**Futuro:**
- Audit log para alterações sensíveis
- Histórico de passwords repostas

---

## Proposta de Melhorias

### ~~Fase 1: Edição de Cliente~~ ✅ CONCLUÍDA

**Implementado:** Modal de edição no banner do perfil
- Botão "Editar" no banner do cliente
- Formulário com nome, email, telefone, notas
- Validação de email único
- Feedback de sucesso/erro

### ~~Fase 2: Eliminação de Cliente~~ ✅ CONCLUÍDA

**Implementado:** Eliminação com confirmação segura
- Botão "Eliminar" no banner do cliente
- Modal com resumo do que será eliminado
- Confirmação por escrita do nome
- Cascade delete completo (storage + DB)

### Fase 3: Gestão de Estado do Cliente ⚠️ FUTURO

**Objetivo:** Distinguir clientes ativos de inativos

**Funcionalidades:**
1. Campo `status` no perfil
2. Botão "Arquivar cliente" (soft-delete)
3. Filtro na lista de clientes
4. Possibilidade de reativar

### Fase 4: Histórico de Alterações ⚠️ FUTURO

**Objetivo:** Audit log para rastreabilidade

**Funcionalidades:**
1. Registar alterações de perfil
2. Registar reposições de password
3. Visualização no detalhe do cliente

---

## Resumo Executivo

| Aspecto | Estado Atual | Prioridade |
|---------|--------------|------------|
| Criação de cliente | ✅ Funcional | - |
| Leitura de clientes | ✅ Funcional | - |
| Edição pelo cliente | ✅ Funcional | - |
| Edição pelo admin | ✅ Implementado | - |
| Eliminação | ✅ Implementado | - |
| Estados/Arquivamento | ⚠️ Futuro | 🟢 Baixa |

---

## Changelog

### 2026-01-23 - v1.1
- ✅ Implementada edição de cliente pelo admin (`EditClientModal.tsx`)
- ✅ Implementada eliminação de cliente com confirmação (`DeleteClientButton.tsx`)
- ✅ Server actions: `updateClientAction()`, `deleteClientAction()`
- ✅ Validação de email único na edição
- ✅ Cascade delete (storage + attachments + updates + profile + auth)

### 2026-01-23 - v1.0
- Documento inicial criado
- Mapeamento completo do conceito de Cliente
- Identificação de gaps

---

*Documento criado em 2026-01-23*
*Última atualização: 2026-01-23*
