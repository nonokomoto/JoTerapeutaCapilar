"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { i18n, type Locale } from "@/i18n/config";
import { translatePath } from "@/i18n/routes";

interface LanguageSwitcherProps {
    currentLocale: Locale;
    labels: { pt: string; fr: string };
    variant?: "desktop" | "mobile";
}

// SVG Flag components for consistent rendering across all browsers
const PortugalFlag = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size * 0.67} viewBox="0 0 30 20" className="lang-flag-svg">
        <rect width="30" height="20" fill="#FF0000" />
        <rect width="12" height="20" fill="#006600" />
        <circle cx="12" cy="10" r="4" fill="#FFCC00" />
        <circle cx="12" cy="10" r="3" fill="#FF0000" />
        <circle cx="12" cy="10" r="2.2" fill="#FFFFFF" />
        <path d="M10.5 8.5 L13.5 8.5 L12 11.5 Z" fill="#0066CC" />
    </svg>
);

const FranceFlag = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size * 0.67} viewBox="0 0 30 20" className="lang-flag-svg">
        <rect width="10" height="20" fill="#002654" />
        <rect x="10" width="10" height="20" fill="#FFFFFF" />
        <rect x="20" width="10" height="20" fill="#CE1126" />
    </svg>
);

const FlagIcon = ({ locale, size = 20 }: { locale: Locale; size?: number }) => {
    return locale === "pt" ? <PortugalFlag size={size} /> : <FranceFlag size={size} />;
};

export function LanguageSwitcher({ currentLocale, labels, variant = "desktop" }: LanguageSwitcherProps) {
    const pathname = usePathname();

    const getLocalizedPathForLocale = (targetLocale: Locale) => {
        if (targetLocale === currentLocale) {
            return pathname;
        }
        return translatePath(pathname, currentLocale, targetLocale);
    };

    const otherLocale = i18n.locales.find((l) => l !== currentLocale) as Locale;

    // Mobile variant: shows link to switch language
    if (variant === "mobile") {
        return (
            <div className="language-switcher-mobile">
                <Link
                    href={getLocalizedPathForLocale(otherLocale)}
                    className="lang-btn"
                    hrefLang={otherLocale}
                >
                    <FlagIcon locale={otherLocale} size={22} />
                    <span className="lang-code">{otherLocale.toUpperCase()}</span>
                </Link>
            </div>
        );
    }

    // Desktop variant: flag + code for each language
    return (
        <div className="language-switcher-desktop">
            {i18n.locales.map((locale, index) => (
                <span key={locale} className="lang-item">
                    {index > 0 && <span className="lang-divider">|</span>}
                    <Link
                        href={getLocalizedPathForLocale(locale)}
                        className={"lang-link" + (locale === currentLocale ? " active" : "")}
                        hrefLang={locale}
                    >
                        <FlagIcon locale={locale} size={18} />
                        <span className="lang-code">{locale.toUpperCase()}</span>
                    </Link>
                </span>
            ))}
        </div>
    );
}
