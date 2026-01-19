import Image from "next/image";

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4"
            style={{ backgroundColor: "var(--bg-tertiary)" }}
        >
            {/* Logo */}
            <div className="mb-8">
                <Image
                    src="/logo.svg"
                    alt="Jo Terapeuta Capilar"
                    width={180}
                    height={60}
                    priority
                />
            </div>

            {/* Content */}
            <div className="w-full max-w-md">{children}</div>
        </div>
    );
}
