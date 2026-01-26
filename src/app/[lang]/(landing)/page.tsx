import { getDictionary } from "@/i18n/dictionaries";
import { i18n, type Locale } from "@/i18n/config";
import { HomePageClient } from "./HomePageClient";

interface HomePageProps {
    params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function HomePage({ params }: HomePageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <HomePageClient lang={lang} dict={dict} />;
}
