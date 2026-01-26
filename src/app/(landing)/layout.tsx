import type { Metadata } from "next";
import "./landing.css";

export const metadata: Metadata = {
    title: "Josianne Gomes - Terapeuta Capilar",
    description:
        "Cuidar do seu cabelo é um ato de amor, saúde e conexão com as suas raízes. Tratamentos capilares personalizados com produtos naturais.",
    keywords: [
        "terapeuta capilar",
        "tratamento capilar",
        "cabelo natural",
        "produtos capilares naturais",
        "cuidados capilares",
    ],
    openGraph: {
        title: "Josianne Gomes - Terapeuta Capilar",
        description:
            "Cuidar do seu cabelo é um ato de amor, saúde e conexão com as suas raízes.",
        type: "website",
    },
};

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="landing-page">
            {/* Google Fonts - Cormorant Garamond para títulos elegantes */}
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
