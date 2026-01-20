import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

// Admin client to bypass RLS for role checking
function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
}

// Helper to get user role from profiles table
async function getUserRole(userId: string): Promise<"admin" | "client" | null> {
    const adminClient = createAdminClient();
    const { data: profile } = await adminClient
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

    return profile?.role as "admin" | "client" | null;
}

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

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
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session if expired
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isLoginRoute = pathname.startsWith("/login");
    const isAdminRoute = pathname.startsWith("/admin");
    const isClienteRoute = pathname.startsWith("/cliente");
    const isProtectedRoute = isAdminRoute || isClienteRoute;

    // Not authenticated - redirect to login if trying to access protected routes
    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Authenticated user - check role and redirect appropriately
    if (user) {
        const role = await getUserRole(user.id);

        // If on login page, redirect to appropriate dashboard
        if (isLoginRoute) {
            const url = request.nextUrl.clone();
            url.pathname = role === "admin" ? "/admin" : "/cliente";
            return NextResponse.redirect(url);
        }

        // If admin trying to access /cliente routes, redirect to /admin
        if (role === "admin" && isClienteRoute) {
            const url = request.nextUrl.clone();
            url.pathname = "/admin";
            return NextResponse.redirect(url);
        }

        // If client trying to access /admin routes, redirect to /cliente
        if (role === "client" && isAdminRoute) {
            const url = request.nextUrl.clone();
            url.pathname = "/cliente";
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
