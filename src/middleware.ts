import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { i18n, isValidLocale, type Locale } from "@/i18n/config";
import { reverseRouteMap, routeMap } from "@/i18n/routes";

function getPreferredLocale(request: NextRequest): Locale {
    // 1. Check cookie preference
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    if (cookieLocale && isValidLocale(cookieLocale)) {
        return cookieLocale;
    }

    // 2. Check Accept-Language header
    const acceptLanguage = request.headers.get("accept-language");
    if (acceptLanguage) {
        const preferredLocale = acceptLanguage.split(",")[0].split("-")[0].toLowerCase();
        if (isValidLocale(preferredLocale)) {
            return preferredLocale;
        }
    }

    // 3. Default locale
    return i18n.defaultLocale;
}

function pathnameHasLocale(pathname: string): boolean {
    return i18n.locales.some(
        (locale) => pathname.startsWith("/" + locale + "/") || pathname === "/" + locale
    );
}

function getLocaleFromPathname(pathname: string): Locale | null {
    for (const locale of i18n.locales) {
        if (pathname.startsWith("/" + locale + "/") || pathname === "/" + locale) {
            return locale;
        }
    }
    return null;
}

// Check if a slug is valid for a given locale
function isValidSlugForLocale(slug: string, locale: Locale): boolean {
    return slug in reverseRouteMap[locale] || slug === "blog";
}

// Translate a slug from one locale to another
function translateSlug(slug: string, fromLocale: Locale, toLocale: Locale): string {
    // Find the route key for this slug in the source locale
    const routeKey = reverseRouteMap[fromLocale][slug];
    if (routeKey) {
        // Return the slug for this route in the target locale
        return routeMap[toLocale][routeKey] || slug;
    }
    return slug;
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip i18n for protected routes (admin, cliente, login, api)
    const isProtectedRoute =
        pathname.startsWith("/admin") ||
        pathname.startsWith("/cliente") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/login");

    if (isProtectedRoute) {
        return await updateSession(request);
    }

    // Handle i18n routing for landing pages
    const hasLocale = pathnameHasLocale(pathname);

    if (!hasLocale) {
        // No locale in path - redirect to locale-prefixed path
        const locale = getPreferredLocale(request);

        // Handle root path
        if (pathname === "/" || pathname === "") {
            const url = request.nextUrl.clone();
            url.pathname = "/" + locale;
            const response = NextResponse.redirect(url);
            response.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
            return response;
        }

        // Handle other paths - check if this is a translated route
        const segments = pathname.split("/").filter(Boolean);
        const firstSegment = segments[0];

        // Check if it's a valid route in default locale (PT)
        if (isValidSlugForLocale(firstSegment, i18n.defaultLocale)) {
            const url = request.nextUrl.clone();
            url.pathname = "/" + locale + "/" + segments.join("/");
            const response = NextResponse.redirect(url);
            response.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
            return response;
        }

        // Check if it's a valid route in FR (someone typed /a-propos directly)
        if (isValidSlugForLocale(firstSegment, "fr")) {
            const url = request.nextUrl.clone();
            url.pathname = "/fr/" + segments.join("/");
            const response = NextResponse.redirect(url);
            response.cookies.set("NEXT_LOCALE", "fr", { path: "/", maxAge: 60 * 60 * 24 * 365 });
            return response;
        }

        // Default: redirect with preferred locale
        const url = request.nextUrl.clone();
        url.pathname = "/" + locale + pathname;
        const response = NextResponse.redirect(url);
        response.cookies.set("NEXT_LOCALE", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
        return response;
    }

    // Path has locale - validate the route slug for the locale
    const currentLocale = getLocaleFromPathname(pathname);
    if (currentLocale) {
        const pathWithoutLocale = pathname.replace("/" + currentLocale, "") || "/";
        const segments = pathWithoutLocale.split("/").filter(Boolean);

        if (segments.length > 0) {
            const firstSegment = segments[0];

            // Check if the slug is valid for the OTHER locale (wrong URL)
            const otherLocale: Locale = currentLocale === "pt" ? "fr" : "pt";

            if (
                !isValidSlugForLocale(firstSegment, currentLocale) &&
                isValidSlugForLocale(firstSegment, otherLocale)
            ) {
                // Redirect to correct slug for current locale
                const translatedSlug = translateSlug(firstSegment, otherLocale, currentLocale);
                segments[0] = translatedSlug;
                const url = request.nextUrl.clone();
                url.pathname = "/" + currentLocale + "/" + segments.join("/");
                return NextResponse.redirect(url);
            }
        }

        // Set locale cookie
        const response = NextResponse.next();
        response.cookies.set("NEXT_LOCALE", currentLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
