"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getLocalizedHash } from "@/i18n/routes";

interface GaleriaPageClientProps {
    lang: Locale;
    dict: Dictionary;
}

const galleryImages = [
    "WhatsApp+Image+2024-11-27+at+17.57.26.webp",
    "WhatsApp+Image+2024-11-27+at+17.57.22+copie+2.webp",
    "WhatsApp+Image+2024-11-27+at+17.57.22+copie.webp",
    "WhatsApp+Image+2024-11-27+at+17.57.22.webp",
    "AAC80F70-FBD4-4847-8E26-179C20C1FF00.webp",
    "IMG_7272.webp",
    "IMG_7269.webp",
    "IMG_7242.webp",
    "IMG_7236.webp",
    "IMG_7114.webp",
    "IMG_7110.webp",
    "IMG_7101.webp",
    "IMG_7096.webp",
    "IMG_7066.webp",
    "IMG_7019.webp",
    "IMG_7004.webp",
    "IMG_6962.webp",
    "IMG_6955.webp",
];

export function GaleriaPageClient({ lang, dict }: GaleriaPageClientProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { common, gallery } = dict;
    const contactHash = getLocalizedHash("contact", lang);
    const homePath = "/" + lang;

    return (
        <>
            <Header lang={lang} dict={common} />
            <main>
                <section className="landing-page-hero">
                    <div className="landing-container">
                        <p className="landing-section-label">{gallery.hero.label}</p>
                        <h1 className="landing-page-title">{gallery.hero.title}</h1>
                        <p className="landing-page-subtitle">{gallery.hero.subtitle}</p>
                    </div>
                </section>

                <section className="landing-gallery-page">
                    <div className="landing-container">
                        <div className="landing-gallery-grid-full">
                            {galleryImages.map((image) => (
                                <div
                                    key={image}
                                    className="landing-gallery-item-full"
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <img
                                        src={"/images/landing/clientes/" + image}
                                        alt={gallery.lightbox.imageAlt}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {selectedImage && (
                    <div className="landing-lightbox" onClick={() => setSelectedImage(null)}>
                        <button className="landing-lightbox-close" aria-label={gallery.lightbox.close}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="landing-lightbox-content" onClick={(e) => e.stopPropagation()}>
                            <img
                                src={"/images/landing/clientes/" + selectedImage}
                                alt={gallery.lightbox.imageAlt}
                            />
                        </div>
                    </div>
                )}

                <section className="landing-cta">
                    <div className="landing-container">
                        <div className="landing-cta-content">
                            <h2 className="landing-cta-title">{gallery.cta.title}</h2>
                            <p className="landing-cta-description">{gallery.cta.description}</p>
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
