# Roadmap de Funcionalidades - Jo Terapeuta Capilar

> Especificação de alto nível das próximas features da plataforma

---

## 🎯 Visão Geral

A plataforma Jo Terapeuta Capilar vai evoluir com 3 novas funcionalidades principais que melhoram a experiência tanto da admin como dos clientes.

---

## 📊 Stack Tecnológico

### Stack Atual (Manter ✅)

```
┌─────────────────────────────────────────┐
│          FRONTEND & BACKEND             │
├─────────────────────────────────────────┤
│  • Next.js 16 (App Router + React 19)   │
│  • TypeScript                           │
│  • Tailwind CSS 4                       │
│  • React Query (state & cache)          │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│            BASE DE DADOS                │
├─────────────────────────────────────────┤
│  • Supabase PostgreSQL                  │
│  • Supabase Auth                        │
│  • Supabase Storage                     │
│  • Row Level Security (RLS)             │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│             HOSTING                     │
├─────────────────────────────────────────┤
│  • Vercel (Deploy & Edge Functions)     │
│  • Vercel Speed Insights                │
└─────────────────────────────────────────┘
```

### Recomendação: **Manter Stack Atual**

**Porquê?**
- ✅ Next.js 16 é extremamente rápido e moderno
- ✅ Supabase fornece tudo o que precisamos
- ✅ Zero custo adicional de infraestrutura
- ✅ Conhecimento técnico já consolidado
- ✅ Arquitetura já está correta

**Não precisamos de:**
- ❌ Framework diferente
- ❌ Base de dados adicional
- ❌ Serviços de storage externos
- ❌ Backend separado

---

## 🆕 Novas Funcionalidades

### Feature 1: Fotos Antes/Depois

**O que é:**
Sistema de upload e visualização de fotos comparativas de "antes" e "depois" dos tratamentos capilares.

**Para quem:**
- **Admin:** Upload de 2 fotos (antes/depois) ao criar atualizações
- **Cliente:** Visualização lado-a-lado do progresso do tratamento

**Como funciona:**
1. Admin cria atualização do cliente
2. Faz upload de foto "antes" e foto "depois"
3. Cliente vê comparação visual lado-a-lado no seu histórico
4. Pode ampliar/fazer zoom nas fotos

**Onde aparece:**
- Dashboard admin: ao criar atualização
- Dashboard cliente: nas atualizações do tratamento
- Histórico de atualizações: destaque visual

**Valor para o negócio:**
- Demonstra visualmente resultados dos tratamentos
- Aumenta confiança e satisfação dos clientes
- Material para marketing (com autorização)

---

### Feature 2: Sistema de Questionários

**O que é:**
Sistema completo de criação, envio e resposta de questionários personalizados dentro da plataforma.

**Para quem:**
- **Admin:** Criar questionários e enviá-los aos clientes
- **Cliente:** Responder questionários e ver histórico

**Como funciona:**

#### Lado Admin:
1. Criar questionário com múltiplas perguntas
2. Escolher tipos de resposta: texto livre, múltipla escolha, escala
3. Enviar para cliente específico ou para todos os clientes
4. Ver respostas organizadas por cliente ou por questionário
5. Acompanhar quem respondeu e quem está pendente

#### Lado Cliente:
1. Recebe notificação de novo questionário
2. Responde perguntas dentro da plataforma
3. Submete respostas
4. Pode ver histórico de questionários respondidos

**Tipos de perguntas suportadas:**
- Texto curto
- Texto longo (textarea)
- Escolha única (radio buttons)
- Múltipla escolha (checkboxes)
- Escala numérica (1-10)

**Onde aparece:**
- Dashboard admin: nova secção "Questionários"
- Dashboard cliente: badge de notificação quando há pendentes
- Menu principal: nova opção "Questionários"

**Casos de uso:**
- Avaliação inicial do cliente
- Feedback pós-tratamento
- Questionário de satisfação
- Acompanhamento de sintomas
- Recolha de informações estruturadas

**Valor para o negócio:**
- Dados estruturados e organizados
- Automatiza recolha de informação
- Histórico completo de cada cliente
- Base para decisões de tratamento

---

### Feature 3: Otimização de Performance

**O que é:**
Conjunto de melhorias técnicas para tornar a aplicação mais rápida e eficiente.

**Objetivos:**
- ⚡ Carregar páginas mais rápido
- 📉 Reduzir consumo de dados
- 🎯 Melhorar experiência em mobile
- 💾 Diminuir custos de storage

**Áreas de otimização:**

#### 1. Imagens
- Compressão automática no upload
- Formatos modernos (WebP)
- Lazy loading (carregar só quando necessário)
- Redimensionamento inteligente

#### 2. Dados
- Cache inteligente (não recarregar dados desnecessariamente)
- Paginação (não carregar tudo de uma vez)
- Índices na base de dados (queries mais rápidas)
- Queries otimizadas

#### 3. Código
- Remover código não utilizado
- Carregar componentes só quando necessário
- Reduzir tamanho dos ficheiros JavaScript
- Melhorar tempo de resposta do servidor

#### 4. Experiência
- Loading skeletons (mostrar estrutura enquanto carrega)
- Estados de loading mais elegantes
- Feedback visual imediato
- Menos "brancos" na tela

**Impacto:**
- 🚀 App 40-60% mais rápida
- 📱 Melhor em conexões lentas
- 💰 Menos custos de bandwidth
- 😊 Clientes mais satisfeitos

**Valor para o negócio:**
- Profissionalismo aumentado
- Menos reclamações de lentidão
- Redução de custos de infraestrutura

---

### Feature 4: Loja de Produtos (Shopify)

**O que é:**
Integração com Shopify para vender produtos capilares diretamente na plataforma, sem os clientes terem que sair para outro site.

**Para quem:**
- **Admin:** Gerir produtos, ver vendas, recomendar produtos específicos
- **Cliente:** Ver catálogo, adicionar ao carrinho, comprar dentro da plataforma

**Como funciona:**

#### Lado Admin:
1. Conectar conta Shopify (one-time setup)
2. Produtos sincronizam automaticamente
3. Pode recomendar produtos específicos nas atualizações dos clientes
4. Pode destacar produtos em posts/artigos
5. Ver estatísticas de vendas por cliente

#### Lado Cliente:
1. Acesso à secção "Loja" ou "Produtos Recomendados"
2. Ver catálogo completo de produtos
3. Filtrar por categoria (shampoos, condicionadores, tratamentos, etc.)
4. Ver produtos recomendados pela terapeuta especificamente para si
5. Adicionar ao carrinho
6. Checkout integrado (Shopify Buy Button ou embed)
7. Pagamento seguro via Shopify
8. Histórico de compras (opcional)

**Modelos de integração:**

**Opção A - Shopify Buy Button (Simples)**
- Embed de produtos individuais
- Carrinho Shopify popup
- Checkout em página Shopify
- ⏱️ Implementação: 4-6h
- 💰 Custo: €100-150

**Opção B - Shopify Storefront API (Completo)**
- Catálogo completo integrado
- Carrinho custom na plataforma
- Experiência totalmente integrada
- Recomendações personalizadas
- ⏱️ Implementação: 12-16h
- 💰 Custo: €300-400

**Onde aparece:**
- Menu principal: nova secção "Produtos"
- Dashboard cliente: widget "Produtos Recomendados"
- Atualizações: admin pode incluir link para produto
- Posts: produtos mencionados podem ter link direto

**Funcionalidades:**
- ✅ Catálogo de produtos sincronizado
- ✅ Preços e stock em tempo real
- ✅ Imagens e descrições dos produtos
- ✅ Carrinho de compras
- ✅ Checkout seguro (via Shopify)
- ✅ Recomendações personalizadas por cliente
- ✅ Histórico de compras (opcional)
- ✅ Tracking de vendas por terapeuta

**Casos de uso:**
- Cliente termina tratamento, terapeuta recomenda shampoo específico
- Cliente lê post sobre cuidados, vê produto recomendado, compra na hora
- Admin quer monetizar conhecimento vendendo produtos
- Cliente recebe recomendação personalizada baseada no histórico

**Valor para o negócio:**
- 💰 Nova fonte de receita (venda de produtos)
- 🔄 Monetização do conhecimento
- 🎯 Recomendações personalizadas aumentam conversão
- 📈 Clientes compram produtos certos para o tratamento
- ⚡ Conveniência: tudo no mesmo lugar

**Requisitos:**
- Conta Shopify (a partir de $29/mês)
- Produtos já cadastrados no Shopify
- Domínio configurado (pode usar subdomínio)

**Custos adicionais:**
- Shopify Plan: $29-79/mês (pago pela cliente)
- Taxas de transação: 2.9% + $0.30 por venda (Shopify)
- Sem custos de desenvolvimento recorrentes

---

## 🗺️ Como as Features se Encaixam

```
┌──────────────────────────────────────────────────────┐
│              PLATAFORMA JO TERAPEUTA                 │
└──────────────────────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ ÁREA ADMIN   │ │ ÁREA CLIENTE │ │ INFRAESTRUTURA│
└──────────────┘ └──────────────┘ └──────────────┘
        │               │               │
        ▼               ▼               ▼
┌──────────────────────────────────────────────────────┐
│            FUNCIONALIDADES EXISTENTES                │
├──────────────────────────────────────────────────────┤
│  ✓ Dashboard com estatísticas                        │
│  ✓ Gestão de clientes                                │
│  ✓ Atualizações de tratamento                        │
│  ✓ Posts e conteúdos                                 │
│  ✓ Upload de anexos (imagens, PDFs)                  │
│  ✓ Autenticação e segurança                          │
└──────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────┐
│              NOVAS FUNCIONALIDADES                   │
├──────────────────────────────────────────────────────┤
│  + Fotos Antes/Depois                                │
│    └─> Integra com: Atualizações existentes         │
│                                                       │
│  + Sistema de Questionários                          │
│    └─> Nova secção independente                     │
│    └─> Integra com: Perfil do cliente               │
│                                                       │
│  + Otimizações de Performance                        │
│    └─> Melhora: TUDO (transversal)                  │
│                                                       │
│  + Loja de Produtos (Shopify)                        │
│    └─> Nova secção de e-commerce                    │
│    └─> Integra com: Recomendações personalizadas    │
└──────────────────────────────────────────────────────┘
```

### Integração entre Features

**Fotos Antes/Depois** ↔️ **Atualizações**
- Substitui/complementa anexos tradicionais
- Mesma interface de criação
- Visualização especial para comparação

**Questionários** ↔️ **Perfil do Cliente**
- Respostas ficam associadas ao cliente
- Admin vê questionários no perfil
- Histórico completo disponível

**Loja Shopify** ↔️ **Atualizações & Posts**
- Admin pode recomendar produtos nas atualizações
- Produtos aparecem em posts educativos
- Cliente compra sem sair da plataforma

**Performance** ↔️ **Todas as Features**
- Melhora carregamento de fotos antes/depois
- Acelera listagem de questionários
- Otimiza toda a experiência

---

## 📈 Fluxo de Utilização

### Fluxo: Fotos Antes/Depois

```
ADMIN:
Login → Clientes → Selecionar Cliente → Nova Atualização
  → Upload "Antes" → Upload "Depois" → Adicionar descrição
  → Guardar → Cliente recebe atualização com fotos

CLIENTE:
Login → Dashboard → Ver atualização → Comparação lado-a-lado
  → Pode ampliar fotos → Pode voltar ao histórico
```

### Fluxo: Questionários

```
ADMIN:
Login → Questionários → Criar Novo
  → Adicionar perguntas → Escolher tipo de resposta
  → Enviar para cliente(s) → Aguardar respostas
  → Ver respostas → Analisar dados

CLIENTE:
Login → Notificação "1 novo questionário"
  → Abrir questionário → Ler perguntas
  → Preencher respostas → Submeter
  → Confirmação de envio → Ver histórico
```

### Fluxo: Loja Shopify

```
ADMIN:
Login → Configurações → Conectar Shopify (uma vez)
  → Produtos sincronizam automaticamente
  → Ir para cliente → Nova atualização
  → "Recomendo este shampoo" → Selecionar produto
  → Cliente vê produto recomendado na atualização

CLIENTE:
Login → Ver "Produtos Recomendados" no dashboard
  → Ou ir para menu "Loja"
  → Ver catálogo → Filtrar por categoria
  → Clicar em produto → Ver detalhes
  → Adicionar ao carrinho → Checkout
  → Pagar via Shopify → Receber em casa
```

---

## 💰 Investimento e Priorização

### Pacote Completo (Recomendado)

| Feature | Complexidade | Tempo | Valor |
|---------|-------------|-------|-------|
| **Fotos Antes/Depois** | Média | 6-8h | €150-200 |
| **Questionários** | Alta | 12-16h | €300-400 |
| **Performance** | Média | 5-8h | €120-180 |
| **Loja Shopify (Simples)** | Baixa | 4-6h | €100-150 |
| **Loja Shopify (Completa)** | Alta | 12-16h | €300-400 |
| **Total (com loja simples)** | - | **27-38h** | **€670-930** |
| **Total (com loja completa)** | - | **35-48h** | **€870-1,180** |

### Ou por Fases

**Fase 1 - Impacto Visual & Vendas** (€370-530)
- ✅ Fotos Antes/Depois
- ✅ Otimizações de Performance
- ✅ Loja Shopify (versão simples)

**Fase 2 - Automação & Dados** (€300-400)
- ✅ Sistema de Questionários

**Fase 3 - E-commerce Avançado** (€300-400)
- ✅ Upgrade Loja Shopify (versão completa)
- ✅ Recomendações personalizadas
- ✅ Histórico de compras

---

## 🎯 Próximos Passos

1. ✅ Aprovação do roadmap
2. ✅ Escolha de fase ou pacote completo
3. ✅ Definição de prioridades
4. → Início de desenvolvimento
5. → Testes em ambiente de staging
6. → Deploy em produção
7. → Formação da admin (se necessário)

---

## 🔮 Futuro (Opcional, não incluído)

Funcionalidades para considerar no futuro:

- 📅 Sistema de agendamentos
- 💬 Chat em tempo real
- 📧 Notificações por email
- 📱 App mobile nativa
- 📊 Relatórios e analytics avançados
- 🔗 Integração Instagram/WhatsApp
- 🎁 Programa de fidelidade/pontos
- 📦 Tracking de encomendas integrado
- ⭐ Reviews e ratings de produtos

**Mas primeiro, vamos focar nestas 4 funcionalidades! 🚀**

---

*Documento criado em 22 de Janeiro de 2026*
