# Copilot instructions — Jo Terapeuta Capilar

## Big picture
- Next.js App Router (see `src/app/**`) with Supabase auth + RLS.
- Two role-based areas: `/admin/**` and `/cliente/**`, plus `/login`.
- Core data model (see `supabase/migrations/*.sql` and `src/types/database.ts`): `profiles`, `client_updates`, `attachments`, `posts`.

## Auth, roles, and Supabase clients
- Route protection + role redirects are centralized in middleware:
  - `src/middleware.ts` delegates to `src/lib/supabase/middleware.ts`.
  - Uses `profiles.role` (`admin` | `client`) to redirect between `/admin` and `/cliente`.
- Use the correct Supabase client for the execution context:
  - **Server Components / Server Actions**: `createClient()` from `src/lib/supabase/server.ts` (RLS applies).
  - **Client Components**: `createClient()` from `src/lib/supabase/client.ts`.
  - **Admin bypass (service role)**: `createAdminClient()` from `src/lib/supabase/admin.ts`.
    - Used for role checks and admin-only operations (e.g., `auth.admin.*`, Storage uploads).
- Required env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## Server Actions pattern (forms)
- Server actions live next to routes (e.g. `src/app/login/actions.ts`, `src/app/admin/**/actions.ts`).
- Use the pattern:
  - Top line: `"use server";`
  - Input: `FormData` (or primitives) and return `{ error: string }` or `{ success: true, ... }`.
  - Navigation: `revalidatePath(...)` + `redirect(...)` when appropriate.
- File uploads: Next config allows larger server action bodies (`next.config.ts` sets `serverActions.bodySizeLimit` to `10mb`).

## Storage + attachments
- Attachments are uploaded by admin actions using the service-role client and stored in:
  - Storage bucket: `attachments` (see usage in `src/app/admin/clientes/actions.ts`).
  - Table: `attachments` with `file_type` of `image` or `pdf`.
- Validate uploads the same way the repo does: accept `image/*` and `application/pdf`, ignore empty inputs.

## UI + styling conventions
- UI language is PT-PT (e.g., “palavra-passe”, “Terminar sessão”, “A carregar...”).
- Prefer existing primitives in `src/components/ui/*` (e.g., `Button`, `Input`, `Card`, `Avatar`, `StatCard`, `Badge`).
- Global design tokens and component classes live in `src/app/styles.css` (CSS variables + `.btn`, `.input`, etc.).

## Design System rules (IMPORTANT)
**Tailwind = layout only; `styles.css` + UI components = appearance.**

### What to use for what:
| Purpose | Use |
|---------|-----|
| Layout / structure | Tailwind (`flex`, `grid`, `gap-*`, `space-y-*`, `items-center`, `lg:*`, etc.) |
| Color / typography / border / radius / shadow | DS classes from `styles.css` or UI components |

### NEVER use Tailwind color classes directly:
- ❌ `text-gray-*`, `bg-red-*`, `border-blue-*`, `text-blue-900`
- ✅ Use DS semantic classes instead

### DS semantic classes (defined in `styles.css`):
- **Text colors**: `ds-text-primary`, `ds-text-secondary`, `ds-text-muted`, `ds-text-light`, `ds-text-brand`, `ds-text-taupe`
- **Borders**: `ds-border-default`, `ds-border-subtle`
- **Backgrounds**: `ds-bg-secondary`, `ds-bg-muted`
- **Panels**: `ds-panel` (gray panel), `ds-note-panel` (notes box)
- **Alerts**: `ds-alert-error`

### Avoid inline styles:
- ❌ `style={{ color: "var(--text-secondary)" }}`
- ✅ `className="ds-text-secondary"`
- If you need something new, add a class to `styles.css`

### Component usage:
- Always use `Button`, `Card`, `Input`, `Badge`, `Avatar` from `@/components/ui`
- Use component variants (`variant="primary"`, `size="sm"`) instead of custom className
- If a pattern repeats 2-3 times, promote it to a variant in the component

## Developer workflows
- Commands (see `package.json`):
  - `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.
- DB schema/RLS live in `supabase/migrations/`.
