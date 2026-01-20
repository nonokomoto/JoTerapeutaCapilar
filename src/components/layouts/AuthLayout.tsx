interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4"
            style={{ backgroundColor: "var(--bg-secondary)" }}
        >
            {/* Content */}
            <div className="w-full max-w-sm">{children}</div>
        </div>
    );
}
