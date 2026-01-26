"use client";

import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getLocalizedHash } from "@/i18n/routes";

interface SobrePageClientProps {
    lang: Locale;
    dict: Dictionary;
}

const ingredientImages = [
    "lavande.webp",
    "nigelle.webp",
    "cha.webp",
    "menthe.webp",
    "jojoba.webp",
    "argila.webp",
];

export function SobrePageClient({ lang, dict }: SobrePageClientProps) {
    const { common, about } = dict;
    const contactHash = getLocalizedHash("contact", lang);
    const homePath = "/" + lang;

    return (
        <>
            <Header lang={lang} dict={common} />
            <main>
                <section className="landing-about-hero">
                    <div className="landing-container">
                        <div className="landing-about-hero-grid">
                            <div className="landing-about-hero-content">
                                <p className="landing-section-label">{about.hero.label}</p>
                                <h1 className="landing-about-hero-title">{about.hero.title}</h1>
                                <div className="landing-about-hero-text">
                                    {about.hero.paragraphs.map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                                <p className="landing-about-quote">&ldquo;{about.hero.quote}&rdquo;</p>
                            </div>
                            <div className="landing-about-hero-image">
                                <img src="/images/landing/profile.webp" alt="Josianne Gomes" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="landing-about-collage">
                    <div className="landing-container">
                        <div className="landing-about-collage-grid">
                            <div className="landing-about-collage-item landing-about-collage-large">
                                <img src="/images/landing/sobre/josianne-1.webp" alt="Josianne Gomes" />
                            </div>
                            <div className="landing-about-collage-item">
                                <img src="/images/landing/sobre/josianne-principal.webp" alt="Produtos naturais" />
                            </div>
                            <div className="landing-about-collage-item">
                                <img src="/images/landing/sobre/trabalho-1.webp" alt="Tratamento capilar" />
                            </div>
                            <div className="landing-about-collage-item">
                                <img src="/images/landing/sobre/trabalho-2.webp" alt="Resultado de tratamento" />
                            </div>
                            <div className="landing-about-collage-item">
                                <img src="/images/landing/sobre/josianne-2.webp" alt="Josianne Gomes" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="landing-ingredients">
                    <div className="landing-container">
                        <div className="landing-section-header">
                            <p className="landing-section-label">{about.ingredients.label}</p>
                            <h2 className="landing-section-title">{about.ingredients.title}</h2>
                            <p className="landing-ingredients-description">{about.ingredients.description}</p>
                        </div>
                        <div className="landing-ingredients-grid">
                            {about.ingredients.items.map((ingredient, index) => (
                                <div key={ingredient.name} className="landing-ingredient-card">
                                    <div className="landing-ingredient-image">
                                        <img src={"/images/landing/sobre/" + ingredientImages[index]} alt={ingredient.name} />
                                    </div>
                                    <h3 className="landing-ingredient-name">{ingredient.name}</h3>
                                    <p className="landing-ingredient-description">{ingredient.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="landing-cta">
                    <div className="landing-container">
                        <div className="landing-cta-content">
                            <h2 className="landing-cta-title">{about.cta.title}</h2>
                            <p className="landing-cta-description">{about.cta.description}</p>
                            <div className="landing-cta-actions">
                                <a href={homePath + "#" + contactHash} className="landing-btn landing-btn-primary landing-btn-lg">
                                    {common.cta.bookConsultation}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer lang={lang} dict={common} />
        </>
    );
}
