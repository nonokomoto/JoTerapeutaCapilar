import { getDictionary } from "@/i18n/dictionaries";
import { i18n, type Locale } from "@/i18n/config";
import { GaleriaPageClient } from "../_components/GaleriaPageClient";

interface GaleriePageProps {
    params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function GaleriePage({ params }: GaleriePageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <GaleriaPageClient lang={lang} dict={dict} />;
}
