# Workflow: Next.js 15 + Supabase + Vercel Setup

Guia passo-a-passo para criar um novo projeto com esta stack.

---

## 1. Criar Projeto Supabase (Cloud)

```bash
# Listar projetos existentes
supabase projects list

# OU criar via Dashboard: https://supabase.com/dashboard
# 1. New Project → Escolher org → Nome → Região (West EU Ireland)
# 2. Aguardar criação (~2 min)
# 3. Guardar credenciais: Project URL + anon key
```

---

## 2. Criar Projeto Next.js

```bash
# Criar na pasta do projeto (pasta vazia)
cd /path/to/project

npx -y create-next-app@latest ./ \
  --typescript \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm \
  --yes

# Instalar Supabase
npm install @supabase/supabase-js @supabase/ssr
```

---

## 3. Ligar ao Supabase

```bash
# Ligar projeto local ao Supabase Cloud
supabase link --project-ref YOUR_PROJECT_REF
```

---

## 4. Configurar Variáveis de Ambiente

Criar `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Criar `.env.local.example` (para git):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## 5. Criar Clientes Supabase

### `src/lib/supabase/client.ts` (Browser)
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### `src/lib/supabase/server.ts` (Server Components)
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignored in Server Components
          }
        },
      },
    }
  );
}
```

### `src/lib/supabase/middleware.ts` (Auth Helper)
```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();
  return supabaseResponse;
}
```

### `src/middleware.ts` (Route Protection)
```typescript
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

---

## 6. Criar Schema da Base de Dados

Criar `supabase/migrations/001_schema.sql` e executar no SQL Editor:
- Criar tabelas
- Criar indexes
- Criar triggers
- Criar funções (ex: auto-create profile on signup)

---

## 7. Aplicar RLS Policies

Criar `supabase/migrations/002_rls.sql` e executar no SQL Editor:
```sql
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
CREATE POLICY "policy_name" ON your_table FOR SELECT USING (...);
```

---

## 8. Testar Localmente

```bash
npm run dev
# Abre http://localhost:3000
```

---

## 9. Deploy Vercel

```bash
# Primeira vez
vercel

# Depois
vercel --prod

# Configurar variáveis no Vercel Dashboard:
# Settings → Environment Variables → Add NEXT_PUBLIC_SUPABASE_URL e ANON_KEY
```

---

## Estrutura Final do Projeto

```
project/
├── .env.local              # Credenciais (não vai para git)
├── .env.local.example      # Template
├── src/
│   ├── app/                # App Router
│   ├── lib/
│   │   └── supabase/
│   │       ├── client.ts   # Browser client
│   │       ├── server.ts   # Server client
│   │       └── middleware.ts
│   ├── middleware.ts       # Route protection
│   └── types/
│       └── database.ts     # TypeScript types
└── supabase/
    └── migrations/
        ├── 001_schema.sql
        └── 002_rls.sql
```

---

## Comandos Úteis

```bash
# Listar projetos Supabase
supabase projects list

# Ver estado do projeto ligado
supabase link --project-ref REF

# Gerar types do schema
supabase gen types typescript --project-id REF > src/types/supabase.ts

# Deploy Vercel
vercel --prod
```
