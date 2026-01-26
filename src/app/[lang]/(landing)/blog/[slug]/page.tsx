import { getDictionary } from "@/i18n/dictionaries";
import { i18n, type Locale } from "@/i18n/config";
import { BlogPostPageClient } from "../../_components/BlogPostPageClient";

interface BlogPostPageProps {
    params: Promise<{ lang: Locale; slug: string }>;
}

const blogSlugs = [
    "como-cuidar-cabelos-cacheados",
    "beneficios-oleos-naturais",
    "transicao-capilar-guia",
    "receitas-caseiras-hidratacao",
    "couro-cabeludo-saudavel",
    "produtos-naturais-evitar-quimicos",
];

export async function generateStaticParams() {
    const params: { lang: Locale; slug: string }[] = [];
    for (const locale of i18n.locales) {
        for (const slug of blogSlugs) {
            params.push({ lang: locale, slug });
        }
    }
    return params;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang);
    return <BlogPostPageClient lang={lang} dict={dict} slug={slug} />;
}
