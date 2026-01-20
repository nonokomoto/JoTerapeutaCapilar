"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui";
import type { Profile } from "@/types/database";

// Icons as simple SVG components
function HomeIcon({ active }: { active?: boolean }) {
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
        >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            {!active && <polyline points="9 22 9 12 15 12 15 22" />}
        </svg>
    );
}

function UpdatesIcon({ active }: { active?: boolean }) {
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

function ProfileIcon({ active }: { active?: boolean }) {
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
        >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
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
    { href: "/cliente/perfil", label: "Perfil", icon: ProfileIcon },
];

export function ClientLayout({ children, profile }: ClientLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-secondary)" }}>
            {/* Header */}
            <header
                className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 safe-top"
                style={{
                    backgroundColor: "var(--bg-card)",
                    borderBottom: "1px solid var(--border-subtle)",
                }}
            >
                <h1
                    className="text-lg font-semibold"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    Jo Terapeuta Capilar
                </h1>
                <Avatar src={profile.avatar_url} name={profile.name} size="sm" />
            </header>

            {/* Main Content */}
            <main className="flex-1 pb-24">{children}</main>

            {/* Bottom Navigation */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-10 safe-bottom"
                style={{
                    backgroundColor: "var(--bg-card)",
                    borderTop: "1px solid var(--border-subtle)",
                }}
            >
                <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all"
                                style={{
                                    color: isActive
                                        ? "var(--text-primary)"
                                        : "var(--text-muted)",
                                    backgroundColor: isActive
                                        ? "var(--bg-hover)"
                                        : "transparent",
                                }}
                            >
                                <Icon active={isActive} />
                                <span
                                    className="text-xs font-medium"
                                    style={{
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
