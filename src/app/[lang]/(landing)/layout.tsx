import type { Metadata } from "next";
import { i18n, type Locale, isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "./landing.css";

interface LandingLayoutProps {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: LandingLayoutProps): Promise<Metadata> {
    const { lang: langParam } = await params;
    const lang: Locale = isValidLocale(langParam) ? langParam : i18n.defaultLocale;
    const dict = await getDictionary(lang);

    const titles: Record<Locale, string> = {
        pt: "Josianne Gomes - Terapeuta Capilar",
        fr: "Josianne Gomes - Therapeute Capillaire",
    };

    const descriptions: Record<Locale, string> = {
        pt: "Cuidar do seu cabelo e um ato de amor, saude e conexao com as suas raizes. Tratamentos capilares personalizados com produtos naturais.",
        fr: "Prendre soin de vos cheveux est un acte d'amour, de sante et de connexion avec vos racines. Traitements capillaires personnalises avec des produits naturels.",
    };

    const baseUrl = "https://joterapeutacapilar.com";

    return {
        title: titles[lang],
        description: descriptions[lang],
        keywords: lang === "pt" 
            ? ["terapeuta capilar", "tratamento capilar", "cabelo natural", "produtos capilares naturais", "cuidados capilares"]
            : ["therapeute capillaire", "traitement capillaire", "cheveux naturels", "produits capillaires naturels", "soins capillaires"],
        alternates: {
            canonical: baseUrl + "/" + lang,
            languages: {
                "pt": baseUrl + "/pt",
                "fr": baseUrl + "/fr",
                "x-default": baseUrl + "/pt",
            },
        },
        openGraph: {
            title: titles[lang],
            description: descriptions[lang],
            type: "website",
            locale: lang === "pt" ? "pt_PT" : "fr_FR",
            alternateLocale: lang === "pt" ? "fr_FR" : "pt_PT",
        },
    };
}

export default async function LandingLayout({ children, params }: LandingLayoutProps) {
    return (
        <div className="landing-page">
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap"
                rel="stylesheet"
            />
            {children}
        </div>
    );
}
