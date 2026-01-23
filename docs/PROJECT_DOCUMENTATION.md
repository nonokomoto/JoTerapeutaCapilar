# Jo Terapeuta Capilar - Documentação do Projeto

> Plataforma privada de acompanhamento de clientes para terapia capilar

---

## Visão Geral

A **Jo Terapeuta Capilar** é uma aplicação web desenvolvida para gerir o acompanhamento personalizado de clientes em tratamentos capilares. A plataforma permite à terapeuta registar a evolução de cada cliente e partilhar conteúdos educativos, enquanto os clientes podem acompanhar o seu progresso de forma simples e intuitiva.

### Informações Técnicas

| Item | Detalhe |
|------|---------|
| **URL de Produção** | app.joterapeutacapilar.com |
| **Tecnologias** | Next.js 15, Supabase, Vercel |
| **Idioma** | Português (Portugal) | Francês
| **Abordagem** | Mobile-First |

---

## Funcionalidades

### Para a Administradora (Terapeuta)

#### 1. Dashboard Administrativo
- Visão geral com estatísticas: total de clientes, clientes em tratamento, posts publicados
- Lista de clientes recentes com data da última atualização
- Acesso rápido às principais ações

#### 2. Gestão de Clientes
- **Listagem completa** com pesquisa por nome, email ou telefone
- **Criação de clientes** com geração automática de palavra-passe temporária
- **Perfil detalhado** de cada cliente com:
  - Informações pessoais
  - Notas privadas (visíveis apenas para a admin)
  - Histórico de atualizações do tratamento
  - Opção de reset de palavra-passe

#### 3. Atualizações de Tratamento
- Criação de atualizações personalizadas para cada cliente
- Upload de anexos (imagens e PDFs até 10MB)
- Registo automático da data e autoria

#### 4. Gestão de Conteúdos
- Criação e edição de posts (novidades, dicas, artigos)
- Upload de imagem de capa
- Controlo de publicação (rascunho/publicado)

---

### Para os Clientes

#### 1. Dashboard Pessoal
- Saudação personalizada conforme a hora do dia
- Resumo das últimas 3 atualizações do tratamento
- Feed com os últimos 6 conteúdos publicados

#### 2. Histórico de Atualizações
- Visualização completa de todas as atualizações do tratamento
- Acesso a anexos (imagens e documentos)
- Datas formatadas em português

#### 3. Conteúdos e Dicas
- Feed de artigos e novidades publicados pela terapeuta
- Visualização em grelha responsiva
- Página de leitura individual para cada artigo

#### 4. Perfil Pessoal
- Edição de dados pessoais (nome, telefone)
- Alteração de palavra-passe
- Opção de terminar sessão

---

## Fluxos de Utilização

### Fluxo da Administradora

```
Login → Dashboard Admin
           │
           ├── Clientes
           │      ├── Ver lista de clientes
           │      ├── Pesquisar cliente
           │      ├── Criar novo cliente → Gera password temporária
           │      └── Ver cliente
           │             ├── Adicionar atualização
           │             ├── Anexar ficheiros
           │             └── Reset password
           │
           └── Conteúdos
                  ├── Ver lista de posts
                  ├── Criar novo post
                  └── Editar/Publicar post
```

### Fluxo do Cliente

```
Login (com password temporária ou própria)
           │
           └── Dashboard Cliente
                  │
                  ├── Ver atualizações recentes
                  │      └── Ir para histórico completo
                  │
                  ├── Ver novidades e dicas
                  │      └── Ler artigo completo
                  │
                  └── Perfil
                         ├── Editar dados
                         ├── Alterar password
                         └── Terminar sessão
```

---

## Estrutura de Navegação

### Área Administrativa (`/admin`)

| Página | Rota | Descrição |
|--------|------|-----------|
| Dashboard | `/admin` | Estatísticas e visão geral |
| Lista de Clientes | `/admin/clientes` | Todos os clientes com pesquisa |
| Novo Cliente | `/admin/clientes/novo` | Formulário de criação |
| Detalhe Cliente | `/admin/clientes/[id]` | Perfil e atualizações |
| Lista de Posts | `/admin/posts` | Gestão de conteúdos |
| Novo Post | `/admin/posts/novo` | Criar artigo |
| Editar Post | `/admin/posts/[id]` | Editar artigo |

### Área do Cliente (`/cliente`)

| Página | Rota | Descrição |
|--------|------|-----------|
| Dashboard | `/cliente` | Página inicial personalizada |
| Atualizações | `/cliente/atualizacoes` | Histórico do tratamento |
| Conteúdos | `/cliente/conteudos` | Feed de artigos |
| Artigo | `/cliente/conteudos/[id]` | Leitura do artigo |
| Perfil | `/cliente/perfil` | Dados pessoais |

---

## Design e Interface

### Paleta de Cores

| Cor | Uso |
|-----|-----|
| **Rose Gold** `#C9A080` | Cor de destaque, acentos |
| **Azul Escuro** `#1E3A5F` | Cor primária, navegação ativa |
| **Sage** `#8FA68F` | Mensagens de sucesso |
| **Terracotta** `#C17B5D` | Alertas, avisos |
| **Wine** `#8B3A3A` | Erros |

### Tipografia

- **Títulos**: Manrope (sans-serif)
- **Corpo de texto**: Poppins (sans-serif)

### Responsividade

| Breakpoint | Comportamento |
|------------|---------------|
| **Mobile** (< 640px) | 1 coluna, navegação inferior |
| **Tablet** (640px - 1023px) | 2 colunas |
| **Desktop** (≥ 1024px) | 3 colunas, sidebar lateral |

---

## Segurança

### Autenticação
- Sistema de login por email e palavra-passe
- Sessões geridas pelo Supabase Auth
- Palavras-passe temporárias geradas automaticamente para novos clientes

### Controlo de Acesso
- **Administradora**: Acesso total a todos os dados e funcionalidades
- **Clientes**: Acesso apenas aos seus próprios dados e conteúdos públicos

### Proteção de Dados
- Row Level Security (RLS) ao nível da base de dados
- Clientes não conseguem ver dados de outros clientes
- Notas privadas visíveis apenas para a administradora

---

## Modelo de Dados

### Entidades Principais

```
┌─────────────────┐     ┌─────────────────┐
│    PROFILES     │     │     POSTS       │
├─────────────────┤     ├─────────────────┤
│ id              │     │ id              │
│ role (admin/    │     │ admin_id        │
│       client)   │     │ title           │
│ name            │     │ content         │
│ email           │     │ image_url       │
│ phone           │     │ published       │
│ avatar_url      │     │ created_at      │
│ notes           │     │ updated_at      │
│ created_at      │     └─────────────────┘
│ updated_at      │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│ CLIENT_UPDATES  │
├─────────────────┤
│ id              │
│ client_id       │
│ admin_id        │
│ title           │
│ content         │
│ created_at      │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│  ATTACHMENTS    │
├─────────────────┤
│ id              │
│ update_id       │
│ file_url        │
│ file_name       │
│ file_type       │
│ file_size       │
│ created_at      │
└─────────────────┘
```

---

## Limitações e Regras de Negócio

1. **Criação de contas**: Apenas a administradora pode criar contas de clientes (sem auto-registo)
2. **Tipos de ficheiro**: Apenas imagens e PDFs são permitidos como anexos
3. **Tamanho de ficheiros**: Limite de ~10MB por ficheiro
4. **Visibilidade de posts**: Clientes só vêem posts marcados como "publicados"
5. **Atualizações**: São criadas exclusivamente pela administradora

---

## Glossário

| Termo | Significado |
|-------|-------------|
| **Atualização** | Registo de evolução do tratamento de um cliente |
| **Post/Conteúdo** | Artigo, dica ou novidade publicada para todos os clientes |
| **Anexo** | Ficheiro (imagem ou PDF) associado a uma atualização |
| **Profile** | Perfil de utilizador (pode ser admin ou cliente) |

---

## Documentação Técnica Adicional

### Planos de Desenvolvimento

- **[Plano de Refatoração - Fases 1-2](./refactoring-plan-phase-1-2.md)** - Refatoração de componentes UI Core e Layouts para produção
- **[Análise de Viabilidade](./viability_analysis.md)** - Análise técnica e de viabilidade do projeto
- **[ADRs](./adr/)** - Architecture Decision Records (decisões arquiteturais)

---

## Contactos e Suporte

Para questões técnicas ou suporte, contactar a equipa de desenvolvimento.

---

*Documentação gerada em Janeiro de 2026*
