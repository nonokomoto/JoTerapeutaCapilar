import { getDictionary } from "@/i18n/dictionaries";
import { i18n, type Locale } from "@/i18n/config";
import { BlogPageClient } from "../_components/BlogPageClient";

interface BlogPageProps {
    params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function BlogPage({ params }: BlogPageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <BlogPageClient lang={lang} dict={dict} />;
}
