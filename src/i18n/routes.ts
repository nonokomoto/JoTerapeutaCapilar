import type { Locale } from './config';

// Mapeamento de rotas por idioma
export const routeMap: Record<Locale, Record<string, string>> = {
  pt: {
    about: 'sobre',
    gallery: 'galeria',
    blog: 'blog',
  },
  fr: {
    about: 'a-propos',
    gallery: 'galerie',
    blog: 'blog',
  },
} as const;

// Mapeamento reverso: slug → identificador interno
export const reverseRouteMap: Record<Locale, Record<string, string>> = {
  pt: {
    sobre: 'about',
    galeria: 'gallery',
    blog: 'blog',
  },
  fr: {
    'a-propos': 'about',
    galerie: 'gallery',
    blog: 'blog',
  },
} as const;

export function getLocalizedRoute(route: string, locale: Locale): string {
  return routeMap[locale][route] || route;
}

export function getRouteKey(slug: string, locale: Locale): string | undefined {
  return reverseRouteMap[locale][slug];
}

export function getLocalizedPath(route: string, locale: Locale): string {
  const localizedRoute = getLocalizedRoute(route, locale);
  return '/' + locale + '/' + localizedRoute;
}

export function translatePath(path: string, fromLocale: Locale, toLocale: Locale): string {
  const pathWithoutLocale = path.replace('/' + fromLocale, '');
  if (pathWithoutLocale === '' || pathWithoutLocale === '/') {
    return '/' + toLocale;
  }
  const segments = pathWithoutLocale.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const routeKey = getRouteKey(firstSegment, fromLocale);
  if (routeKey) {
    const newSegment = getLocalizedRoute(routeKey, toLocale);
    segments[0] = newSegment;
  }
  return '/' + toLocale + '/' + segments.join('/');
}

export const hashMap: Record<Locale, Record<string, string>> = {
  pt: {
    contact: 'contacto',
    about: 'sobre',
    gallery: 'galeria',
  },
  fr: {
    contact: 'contact',
    about: 'a-propos',
    gallery: 'galerie',
  },
} as const;

export function getLocalizedHash(hash: string, locale: Locale): string {
  return hashMap[locale][hash] || hash;
}
