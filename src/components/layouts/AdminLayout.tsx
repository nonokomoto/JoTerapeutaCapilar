"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

// Icons - slightly larger for better visibility
function DashboardIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
    );
}

function ClientsIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function PostsIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
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
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
        >
            <polyline points="11 17 6 12 11 7" />
            <polyline points="18 17 13 12 18 7" />
        </svg>
    );
}

interface AdminLayoutProps {
    children: React.ReactNode;
    profile: Profile;
}

const navItems = [
    { href: "/admin", label: "Dashboard", icon: DashboardIcon, exact: true },
    { href: "/admin/clientes", label: "Clientes", icon: ClientsIcon, exact: false },
    { href: "/admin/posts", label: "Publicações", icon: PostsIcon, exact: false },
];

export function AdminLayout({ children, profile }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("admin-sidebar-collapsed");
        if (saved !== null) {
            setCollapsed(JSON.parse(saved));
        }
    }, []);

    function toggleCollapsed() {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem("admin-sidebar-collapsed", JSON.stringify(newState));
    }

    async function handleLogout() {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
    }

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
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
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`admin-nav-link ${isActive ? "active" : ""} ${isCollapsed ? "collapsed" : ""}`}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <span className="admin-nav-icon">
                                        <Icon />
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
                            onClick={toggleCollapsed}
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
                                    onClick={handleLogout}
                                    className="admin-sidebar-logout"
                                    title="Terminar sessão"
                                >
                                    <LogoutIcon />
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
                                <button onClick={handleLogout} className="admin-sidebar-logout">
                                    <LogoutIcon />
                                    <span>Terminar sessão</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Desktop Sidebar */}
            <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
                <SidebarContent />
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="admin-mobile-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`admin-mobile-sidebar ${sidebarOpen ? "open" : ""}`}>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="admin-mobile-close"
                >
                    <CloseIcon />
                </button>
                <SidebarContent isMobile />
            </aside>

            {/* Main Content */}
            <div className={`admin-main ${collapsed ? "sidebar-collapsed" : ""}`}>
                {/* Mobile Header */}
                <header className="admin-mobile-header">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="admin-mobile-menu-btn"
                    >
                        <MenuIcon />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="admin-sidebar-logo" style={{ width: 32, height: 32, fontSize: '0.8125rem' }}>Jo</div>
                        <span className="font-semibold text-gray-900">Jo Terapeuta</span>
                    </div>
                </header>

                <main className="admin-content">{children}</main>
            </div>
        </div>
    );
}
