# Análise de Viabilidade - Plataforma de Acompanhamento Capilar

## ✅ Pontos Fortes do Projeto

### 1. Scope Bem Definido
- **Separação clara** do site existente (Squarespace) - sem risco de quebrar algo
- **MVP focado** - não tenta resolver tudo de uma vez
- **Funcionalidades essenciais** bem identificadas

### 2. Stack Tecnológica Adequada
| Componente | Tecnologia | Justificação |
|------------|------------|--------------|
| Frontend | Next.js 15 | SSR, App Router, performance |
| Backend/Auth | Supabase | Auth pronto, RLS nativo, rápido de implementar |
| Base de Dados | PostgreSQL | Robusto, escalável |
| Deploy | Vercel + Supabase Cloud | Zero DevOps, deploy automático |

### 3. Modelo de Negócio Claro
- Não é rede social (sem complexidade de feeds algorítmicos)
- Não é marketplace (sem pagamentos complexos)
- Relação 1:N simples (terapeuta → clientes)

---

## 📊 Estimativa de Esforço (MVP)

### Funcionalidades Core

| Funcionalidade | Complexidade | Tempo Estimado |
|----------------|--------------|----------------|
| **Auth + Perfis** | Média | 2-3 dias |
| Autenticação email/password | Baixa | 0.5 dia |
| Perfis admin vs cliente | Baixa | 0.5 dia |
| Página de registo/login | Média | 1 dia |
| **Área Admin** | Média | 3-4 dias |
| Dashboard admin | Baixa | 0.5 dia |
| Lista de clientes | Baixa | 0.5 dia |
| CRUD clientes | Média | 1 dia |
| Criar atualizações personalizadas | Média | 1 dia |
| Upload ficheiros/imagens | Média | 1 dia |
| **Área Cliente** | Baixa | 2-3 dias |
| Dashboard cliente | Baixa | 0.5 dia |
| Ver atualizações pessoais | Baixa | 0.5 dia |
| Feed de conteúdos gerais | Média | 1 dia |
| Ver documentos | Baixa | 0.5 dia |
| **Feed Conteúdos** | Baixa | 1-2 dias |
| CRUD posts (admin) | Média | 1 dia |
| Listagem posts (cliente) | Baixa | 0.5 dia |
| **Infraestrutura** | Média | 2-3 dias |
| Setup projeto + deploy | Baixa | 0.5 dia |
| Schema DB + RLS | Média | 1 dia |
| Storage setup | Baixa | 0.5 dia |
| Design system base | Média | 1 dia |

### 📅 Total Estimado: 10-15 dias úteis

> [!NOTE]
> Esta estimativa assume:
> - Desenvolvedor familiarizado com a stack
> - Sem mudanças significativas de scope
> - Design simples mas profissional

---

## ⚠️ Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Scope creep | Alta | Alto | Contrato com funcionalidades fixas para MVP |
| Cliente quer features "tipo Instagram" | Média | Médio | Documento claro do que não é incluído |
| Performance uploads grandes | Baixa | Baixo | Supabase Storage com limites claros |
| Terapeuta não usa a plataforma | Média | Alto | UI extremamente simples, onboarding |

---

## 🏗️ Estrutura de Dados Proposta

```
┌─────────────────┐
│     users       │  (Supabase Auth)
│  - id           │
│  - email        │
│  - role         │  (admin | client)
└────────┬────────┘
         │
         │ 1:1
         ▼
┌─────────────────┐
│    profiles     │
│  - id           │
│  - user_id      │
│  - name         │
│  - phone        │
│  - avatar_url   │
│  - created_at   │
└────────┬────────┘
         │
         │ 1:N (admin → client)
         ▼
┌─────────────────┐      ┌─────────────────┐
│    updates      │      │     posts       │
│  - id           │      │  - id           │
│  - client_id    │      │  - title        │
│  - admin_id     │      │  - content      │
│  - title        │      │  - image_url    │
│  - content      │      │  - published    │
│  - created_at   │      │  - created_at   │
└────────┬────────┘      └─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│   attachments   │
│  - id           │
│  - update_id    │
│  - file_url     │
│  - file_type    │
│  - created_at   │
└─────────────────┘
```

---

## 🔐 Segurança (RLS)

Políticas essenciais:
1. **Clientes** só vêem os seus próprios dados (updates, attachments)
2. **Admin** vê e gere tudo
3. **Posts** visíveis para todos os autenticados (ou público, a decidir)
4. **Storage** - ficheiros privados por cliente

---

## 💰 Custos Operacionais

| Serviço | Plano | Custo/mês | Notas |
|---------|-------|-----------|-------|
| Supabase | Free → Pro | €0-25 | Free suficiente para MVP |
| Vercel | Hobby → Pro | €0-20 | Hobby suficiente para início |
| Domínio | - | ~€12/ano | app.joterapeutacapilar.com |

**Total inicial: €0-12/ano** (só domínio)

---

## ✅ Decisões Confirmadas

| Questão | Decisão |
|---------|---------|
| Registo de clientes | **Admin cria conta** (convite) |
| Posts do feed | **Só para autenticados** |
| Notificações email | **Fase 2** (proposta futura) |
| Tipos de ficheiro | **Fotos + PDF** |
| Limites upload | **Modestos** (~5-10MB/ficheiro) |
