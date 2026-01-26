"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/i18n/config";
import type { CommonDictionary } from "@/i18n/dictionaries";
import { getLocalizedPath, getLocalizedHash } from "@/i18n/routes";

interface HeaderProps {
    lang: Locale;
    dict: CommonDictionary;
}

export function Header({ lang, dict }: HeaderProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const contactHash = getLocalizedHash("contact", lang);
    const aboutHash = getLocalizedHash("about", lang);
    const homePath = "/" + lang;

    const navLinks = [
        { href: homePath + "#" + aboutHash, label: dict.nav.about, isHash: false },
        { href: getLocalizedPath("gallery", lang), label: dict.nav.gallery, isHash: false },
        { href: getLocalizedPath("blog", lang), label: dict.nav.blog, isHash: false },
        { href: homePath + "#" + contactHash, label: dict.nav.contact, isHash: false },
    ];

    const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);
    const closeMenu = () => setMobileMenuOpen(false);

    return (
        <header className="landing-header">
            <div className="landing-container">
                <div className="landing-header-inner">
                    <Link href={homePath} className="landing-logo">
                        <Logo size="header" subtitle={dict.logo.subtitle} />
                    </Link>

                    <nav className="landing-nav-desktop">
                        {navLinks.map((link) => (
                            link.isHash ? (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="landing-nav-link"
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="landing-nav-link"
                                >
                                    {link.label}
                                </Link>
                            )
                        ))}
                    </nav>

                    <div className="landing-header-actions">
                        <LanguageSwitcher currentLocale={lang} labels={dict.languageSwitcher} variant="desktop" />
                        <Link href="/login" className="landing-btn landing-btn-primary">
                            {dict.nav.clientArea}
                        </Link>
                    </div>

                    <button
                        className="landing-mobile-menu-btn"
                        onClick={toggleMenu}
                        aria-label="Menu"
                    >
                        <span className={"hamburger" + (mobileMenuOpen ? " open" : "")}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>
                </div>

                {mobileMenuOpen && (
                    <nav className="landing-nav-mobile">
                        <LanguageSwitcher currentLocale={lang} labels={dict.languageSwitcher} variant="mobile" />
                        {navLinks.map((link) => (
                            link.isHash ? (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="landing-nav-link"
                                    onClick={closeMenu}
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="landing-nav-link"
                                    onClick={closeMenu}
                                >
                                    {link.label}
                                </Link>
                            )
                        ))}
                        <Link
                            href="/login"
                            className="landing-btn landing-btn-primary"
                            onClick={closeMenu}
                        >
                            {dict.nav.clientArea}
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}
