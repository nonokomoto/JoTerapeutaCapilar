"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import { Avatar, Icon } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

// Custom icons that aren't in lucide
function DashboardIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
    );
}

function PostsIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`transition-transform duration-200 ${collapsed ? "rotate-180" : "rotate-0"}`}
        >
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
        </svg>
    );
}

// Component wrapper for lucide Icon to match custom icon API
function ClientsIcon() {
    return <Icon name="users" size={22} />;
}

const navItems = [
    { href: "/admin", label: "Dashboard", icon: DashboardIcon, exact: true },
    { href: "/admin/clientes", label: "Clientes", icon: ClientsIcon, exact: false },
    { href: "/admin/posts", label: "Publicações", icon: PostsIcon, exact: false },
];

// Sidebar Content as a separate component to avoid creating during render
interface SidebarContentProps {
    isMobile?: boolean;
    collapsed: boolean;
    pathname: string;
    profile: Profile;
    onNavClick: () => void;
    onToggleCollapsed: () => void;
    onLogout: () => void;
}

function SidebarContent({
    isMobile = false,
    collapsed,
    pathname,
    profile,
    onNavClick,
    onToggleCollapsed,
    onLogout,
}: SidebarContentProps) {
    const isCollapsed = isMobile ? false : collapsed;

    return (
        <div className="flex flex-col h-full">
            {/* Header / Logo Area */}
            <div className={`admin-sidebar-header ${isCollapsed ? "collapsed" : ""}`}>
                <div className="admin-sidebar-logo">Jo</div>
                <div className="admin-sidebar-brand">
                    <span className="admin-sidebar-title">Jo Terapeuta Capilar</span>
                    <span className="admin-sidebar-subtitle">Painel Admin</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="admin-sidebar-nav">
                <div className="admin-sidebar-nav-list">
                    {navItems.map((item) => {
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);
                        const NavIcon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onNavClick}
                                className={`admin-nav-link ${isActive ? "active" : ""} ${isCollapsed ? "collapsed" : ""}`}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <span className="admin-nav-icon">
                                    <NavIcon />
                                </span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div className="admin-sidebar-footer">
                {/* Collapse Toggle - Desktop only */}
                {!isMobile && (
                    <button
                        onClick={onToggleCollapsed}
                        className={`admin-sidebar-collapse-btn ${isCollapsed ? "collapsed" : ""}`}
                        title={collapsed ? "Expandir" : "Colapsar"}
                    >
                        <CollapseIcon collapsed={collapsed} />
                        <span>Colapsar menu</span>
                    </button>
                )}

                {/* User Section */}
                <div className={`admin-sidebar-user ${isCollapsed ? "collapsed" : ""}`}>
                    {isCollapsed ? (
                        <>
                            <Avatar src={profile.avatar_url} name={profile.name} size="sm" />
                            <button
                                onClick={onLogout}
                                className="admin-sidebar-logout"
                                title="Terminar sessão"
                            >
                                <Icon name="logout" size="sm" />
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="admin-sidebar-user-info">
                                <Avatar src={profile.avatar_url} name={profile.name} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="admin-sidebar-user-name">{profile.name}</p>
                                    <p className="admin-sidebar-user-email">{profile.email}</p>
                                </div>
                            </div>
                            <button onClick={onLogout} className="admin-sidebar-logout">
                                <Icon name="logout" size="sm" />
                                <span>Terminar sessão</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

interface AdminLayoutProps {
    children: React.ReactNode;
    profile: Profile;
}

// Custom hook for localStorage with SSR support
function useLocalStorageState(key: string, defaultValue: boolean): [boolean, (value: boolean) => void] {
    const [state, setState] = useState(() => {
        if (typeof window === "undefined") return defaultValue;
        const saved = localStorage.getItem(key);
        return saved !== null ? JSON.parse(saved) : defaultValue;
    });

    const setStateWithStorage = useCallback((value: boolean) => {
        setState(value);
        localStorage.setItem(key, JSON.stringify(value));
    }, [key]);

    return [state, setStateWithStorage];
}

export function AdminLayout({ children, profile }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useLocalStorageState("admin-sidebar-collapsed", false);

    const toggleCollapsed = useCallback(() => {
        setCollapsed(!collapsed);
    }, [collapsed, setCollapsed]);

    const closeSidebar = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    const openSidebar = useCallback(() => {
        setSidebarOpen(true);
    }, []);

    const handleLogout = useCallback(async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    }, [router]);

    const sidebarProps = useMemo(() => ({
        collapsed,
        pathname,
        profile,
        onNavClick: closeSidebar,
        onToggleCollapsed: toggleCollapsed,
        onLogout: handleLogout,
    }), [collapsed, pathname, profile, closeSidebar, toggleCollapsed, handleLogout]);

    return (
        <div className="min-h-screen flex bg-white">
            {/* Desktop Sidebar */}
            <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
                <SidebarContent {...sidebarProps} />
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="admin-mobile-overlay"
                    onClick={closeSidebar}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`admin-mobile-sidebar ${sidebarOpen ? "open" : ""}`}>
                <button
                    onClick={closeSidebar}
                    className="admin-mobile-close"
                >
                    <Icon name="close" size="lg" />
                </button>
                <SidebarContent {...sidebarProps} isMobile />
            </aside>

            {/* Main Content */}
            <div className={`admin-main ${collapsed ? "sidebar-collapsed" : ""}`}>
                {/* Mobile Header */}
                <header className="admin-mobile-header">
                    <button
                        onClick={openSidebar}
                        className="admin-mobile-menu-btn"
                    >
                        <Icon name="menu" size="lg" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="admin-sidebar-logo admin-sidebar-logo-sm">Jo</div>
                        <span className="font-semibold ds-text-primary">Jo Terapeuta</span>
                    </div>
                </header>

                <main className="admin-content">{children}</main>
            </div>
        </div>
    );
}
