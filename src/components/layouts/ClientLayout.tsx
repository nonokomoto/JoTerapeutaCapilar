"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Avatar, NavigationProgress } from "@/components/ui";
import type { Profile } from "@/types/database";

// Custom SVG icons with active state support
interface NavIconProps {
    active?: boolean;
}

function HomeIcon({ active }: NavIconProps) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={active ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={active ? 0 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            {!active && <polyline points="9 22 9 12 15 12 15 22" />}
        </svg>
    );
}

function UpdatesIcon({ active }: NavIconProps) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={active ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={active ? 0 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            {!active && (
                <>
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                </>
            )}
        </svg>
    );
}

function ProfileIcon({ active }: NavIconProps) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={active ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={active ? 0 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function ContentIcon({ active }: NavIconProps) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={active ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={active ? 0 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            {!active && (
                <>
                    <line x1="8" y1="7" x2="16" y2="7" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                </>
            )}
        </svg>
    );
}

function CalendarIcon({ active }: NavIconProps) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={active ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={active ? 0 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            {!active && (
                <>
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </>
            )}
        </svg>
    );
}

interface ClientLayoutProps {
    children: React.ReactNode;
    profile: Profile;
}

const navItems = [
    { href: "/cliente", label: "Início", icon: HomeIcon },
    { href: "/cliente/atualizacoes", label: "Atualizações", icon: UpdatesIcon },
    { href: "/cliente/marcacoes", label: "Marcações", icon: CalendarIcon },
    { href: "/cliente/conteudos", label: "Conteúdos", icon: ContentIcon },
    { href: "/cliente/perfil", label: "Perfil", icon: ProfileIcon },
];

export function ClientLayout({ children, profile }: ClientLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="cliente-layout-container">
            {/* Navigation Progress Bar */}
            <Suspense fallback={null}>
                <NavigationProgress />
            </Suspense>

            {/* Desktop Sidebar */}
            <aside className="cliente-sidebar">
                <div className="cliente-sidebar-logo">
                    Jo Terapeuta Capilar
                </div>

                <nav className="cliente-sidebar-nav">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`cliente-sidebar-item ${isActive ? "active" : ""}`}
                            >
                                <Icon active={isActive} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="cliente-sidebar-footer">
                    <div className="cliente-sidebar-user">
                        <Avatar src={profile.avatar_url} name={profile.name} size="sm" />
                        <span className="truncate font-medium">{profile.name}</span>
                    </div>
                </div>
            </aside>

            <div className="cliente-main-wrapper">
                {/* Mobile Header */}
                <header className="cliente-mobile-header">
                    <h1 className="cliente-mobile-title">
                        Jo Terapeuta Capilar
                    </h1>
                    <Avatar src={profile.avatar_url} name={profile.name} size="sm" />
                </header>

                {/* Main Content */}
                <main className="flex-1 lg:pb-0 pb-24">{children}</main>

                {/* Mobile Bottom Navigation */}
                <nav className="cliente-bottom-nav">
                    <div className="cliente-bottom-nav-inner">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`cliente-nav-item ${isActive ? "active" : ""}`}
                                >
                                    <Icon active={isActive} />
                                    <span className={isActive ? "font-semibold" : "font-medium"}>
                                        {item.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </div>
    );
}
