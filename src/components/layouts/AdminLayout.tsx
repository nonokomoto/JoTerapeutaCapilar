"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

// Icons
function DashboardIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
        </svg>
    );
}

function ClientsIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function PostsIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

interface AdminLayoutProps {
    children: React.ReactNode;
    profile: Profile;
}

const navItems = [
    { href: "/admin", label: "Tableau de bord", icon: DashboardIcon },
    { href: "/admin/clientes", label: "Clients", icon: ClientsIcon },
    { href: "/admin/posts", label: "Publications", icon: PostsIcon },
];

export function AdminLayout({ children, profile }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    }

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-6" style={{ borderBottom: "1px solid var(--color-light-gray)" }}>
                <h1
                    className="text-xl font-bold"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    Jo Terapeuta
                </h1>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Administration
                </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-sm transition-colors"
                                    style={{
                                        backgroundColor: isActive ? "var(--bg-secondary)" : "transparent",
                                        color: "var(--text-primary)",
                                        fontWeight: isActive ? 500 : 400,
                                    }}
                                >
                                    <Icon />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User & Logout */}
            <div className="p-4" style={{ borderTop: "1px solid var(--color-light-gray)" }}>
                <div className="flex items-center gap-3 mb-4">
                    <Avatar src={profile.avatar_url} name={profile.name} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{profile.name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                            {profile.email}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm rounded-sm transition-colors"
                    style={{
                        color: "var(--text-muted)",
                    }}
                >
                    <LogoutIcon />
                    <span>Déconnexion</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-tertiary)" }}>
            {/* Desktop Sidebar */}
            <aside
                className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0"
                style={{ backgroundColor: "var(--bg-primary)", borderRight: "1px solid var(--color-light-gray)" }}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 md:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                style={{ backgroundColor: "var(--bg-primary)" }}
            >
                <div className="absolute top-4 right-4">
                    <button onClick={() => setSidebarOpen(false)}>
                        <CloseIcon />
                    </button>
                </div>
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {/* Mobile Header */}
                <header
                    className="md:hidden sticky top-0 z-10 flex items-center gap-4 px-4 py-3"
                    style={{
                        backgroundColor: "var(--bg-primary)",
                        borderBottom: "1px solid var(--color-light-gray)",
                    }}
                >
                    <button onClick={() => setSidebarOpen(true)}>
                        <MenuIcon />
                    </button>
                    <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                        Jo Terapeuta
                    </h1>
                </header>

                <main className="p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
