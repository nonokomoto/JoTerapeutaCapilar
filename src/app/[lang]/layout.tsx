import { i18n } from "@/i18n/config";

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

interface LangLayoutProps {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}

export default async function LangLayout({ children }: LangLayoutProps) {
    return children;
}
