import { getDictionary } from "@/i18n/dictionaries";
import { i18n, type Locale } from "@/i18n/config";
import { SobrePageClient } from "../_components/SobrePageClient";

interface AProposPageProps {
    params: Promise<{ lang: Locale }>;
}

export async function generateStaticParams() {
    return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function AProposPage({ params }: AProposPageProps) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return <SobrePageClient lang={lang} dict={dict} />;
}
