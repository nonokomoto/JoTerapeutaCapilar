# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Private client tracking platform for a hair therapist. Next.js 15 + Supabase + Vercel.

- **Production URL**: app.joterapeutacapilar.com
- **Language**: Portuguese (Portugal) - PT-PT
- **Approach**: Mobile-First (clients use almost exclusively mobile)

## Commands

```bash
# Development
npm run dev          # Start dev server at localhost:3000

# Build & Deploy
npm run build        # Production build (must pass before deploy)
npm run start        # Run production server locally
npm run lint         # ESLint checks

# Supabase
supabase link --project-ref cpgophielhqiagfcaabp
supabase gen types typescript --project-id cpgophielhqiagfcaabp > src/types/supabase.ts
```

## Architecture

```
src/
├── app/                      # Next.js App Router pages
├── lib/supabase/
│   ├── client.ts             # Browser client (client components)
│   ├── server.ts             # Server client (server components)
│   └── middleware.ts         # Session management helper
├── middleware.ts             # Route protection (/admin/*, /cliente/*)
└── types/
    └── database.ts           # TypeScript types for DB schema

supabase/migrations/          # Database schema & RLS policies
```

## Database Schema

Four core tables with RLS enabled:

1. **profiles** - User profiles (extends auth.users), role: 'admin' | 'client'
2. **client_updates** - Personalized messages from admin to specific clients
3. **attachments** - Files (images/PDF) linked to updates
4. **posts** - General content visible to all authenticated users

Profile auto-creation trigger fires on user signup.

## Route Structure

```
/login                    → Login page
/admin                    → Admin dashboard
/admin/clientes           → Client list
/admin/clientes/novo      → Create client
/admin/clientes/[id]      → Client detail + updates
/admin/conteudos          → Post management
/cliente                  → Client dashboard
/cliente/atualizacoes     → My updates
/cliente/conteudos        → General feed
```

## Key Conventions

### PT-PT Language (UI)
- "Utilizador" not "Usuário"
- "Guardar" not "Salvar"
- "Terminar sessão" not "Sair"

### Design System
- **Colors**: White (#FFFFFF), Black (#000000), Nude (#E5D3C6), Off-white (#FAFAFA)
- **Typography**: Manrope (headings), Poppins (body)
- **Buttons**: border-radius 0px (square edges)
- **Touch targets**: Minimum 44x44px

### Product Rules
- Admin creates client accounts (no self-registration)
- RLS enforced: clients only see their own data
- File types: images + PDF only (~5-10MB limit)
- Server Components by default, "use client" for interactivity

## Documentation

- `docs/design_specs.md` - Full design system details
- `docs/implementation_plan.md` - Development phases and page structure
- `skills/project/SKILL.md` - Complete project specification
