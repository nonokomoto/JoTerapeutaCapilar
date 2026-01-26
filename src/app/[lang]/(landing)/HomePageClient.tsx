"use client";

import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getLocalizedPath, getLocalizedHash } from "@/i18n/routes";

interface HomePageClientProps {
    lang: Locale;
    dict: Dictionary;
}

const galleryImageFiles = [
    "IMG_7101.webp",
    "IMG_7110.webp",
    "IMG_7114.webp",
    "IMG_7236.webp",
    "IMG_7242.webp",
    "IMG_7272.webp",
];

const featureIcons = [
    <svg key="shield" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>,
    <svg key="bolt" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>,
    <svg key="heart" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>,
];

export function HomePageClient({ lang, dict }: HomePageClientProps) {
    const { common, home } = dict;
    const contactHash = getLocalizedHash("contact", lang);
    const aboutHash = getLocalizedHash("about", lang);

    return (
        <>
            <Header lang={lang} dict={common} />
            <main>
                {/* Hero Section */}
                <section className="landing-hero">
                    <div className="landing-container">
                        <div className="landing-hero-content">
                            <p className="landing-hero-label">{home.hero.label}</p>
                            <h1 className="landing-hero-title">
                                {home.hero.title.split("\n").map((line, i) => (
                                    <span key={i}>
                                        {line}
                                        {i === 0 && <br />}
                                    </span>
                                ))}
                                <span className="text-accent">{home.hero.titleAccent}</span>
                            </h1>
                            <p className="landing-hero-subtitle">{home.hero.subtitle}</p>
                            <div className="landing-hero-actions">
                                <a href={"#" + contactHash} className="landing-btn landing-btn-primary landing-btn-lg">
                                    {common.cta.bookConsultation}
                                </a>
                                <Link href={getLocalizedPath("about", lang)} className="landing-btn landing-btn-secondary landing-btn-lg">
                                    {common.cta.learnMore}
                                </Link>
                            </div>
                        </div>

                        <div className="landing-hero-image">
                            <div className="landing-hero-image-wrapper">
                                <img
                                    src="/images/landing/hero.jpg"
                                    alt="Josianne Gomes - Terapeuta Capilar"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                                <div className="landing-hero-image-frame"></div>
                            </div>
                        </div>
                    </div>

                    <div className="landing-hero-decoration">
                        <span>{home.hero.scroll}</span>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </section>

                {/* Features Section */}
                <section className="landing-features">
                    <div className="landing-container">
                        <div className="landing-section-header">
                            <p className="landing-section-label">{home.features.label}</p>
                            <h2 className="landing-section-title">{home.features.title}</h2>
                        </div>
                        <div className="landing-features-grid">
                            {home.features.items.map((feature, index) => (
                                <div key={index} className="landing-feature-card">
                                    <div className="landing-feature-icon">{featureIcons[index]}</div>
                                    <h3 className="landing-feature-title">{feature.title}</h3>
                                    <p className="landing-feature-description">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id={aboutHash} className="landing-about">
                    <div className="landing-container">
                        <div className="landing-about-grid">
                            <div className="landing-about-image">
                                <div className="landing-about-image-wrapper">
                                    <div className="landing-about-image-inner">
                                        <img
                                            src="/images/landing/profile.webp"
                                            alt="Josianne Gomes - Terapeuta Capilar"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="landing-about-content">
                                <p className="landing-section-label">{home.about.label}</p>
                                <h2 className="landing-section-title">{home.about.name}</h2>
                                <div className="landing-about-text">
                                    {home.about.paragraphs.map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                    <p className="landing-about-quote">&ldquo;{home.about.quote}&rdquo;</p>
                                </div>
                                <a href={"#" + contactHash} className="landing-btn landing-btn-primary">
                                    {common.cta.contact}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section id="galeria" className="landing-gallery">
                    <div className="landing-container">
                        <div className="landing-section-header">
                            <p className="landing-section-label">{home.gallery.label}</p>
                            <h2 className="landing-section-title">{home.gallery.title}</h2>
                        </div>
                        <div className="landing-gallery-grid">
                            {galleryImageFiles.map((file, index) => (
                                <div key={file} className="landing-gallery-item">
                                    <img
                                        src={"/images/landing/clientes/" + file}
                                        alt={home.gallery.images[index]?.alt || "Transformacao capilar"}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="landing-gallery-cta">
                            <Link href={getLocalizedPath("gallery", lang)} className="landing-btn landing-btn-secondary">
                                {common.cta.viewGallery}
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Blog Section */}
                <section id="blog" className="landing-blog">
                    <div className="landing-container">
                        <div className="landing-blog-grid">
                            <div className="landing-blog-image">
                                <img
                                    src="/images/landing/clientes/WhatsApp+Image+2024-11-27+at+17.57.26.webp"
                                    alt="Cliente feliz com cabelos cacheados saudaveis"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>
                            <div className="landing-blog-content">
                                <p className="landing-section-label">{home.blog.label}</p>
                                <h2 className="landing-section-title">{home.blog.title}</h2>
                                <p className="landing-blog-description">{home.blog.description}</p>
                                <Link href={getLocalizedPath("blog", lang)} className="landing-btn landing-btn-primary">
                                    {common.cta.viewPosts}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id={contactHash} className="landing-contact">
                    <div className="landing-container">
                        <div className="landing-contact-grid">
                            <div className="landing-contact-info">
                                <p className="landing-section-label">{home.contact.label}</p>
                                <h2 className="landing-section-title">{home.contact.title}</h2>
                                <p className="landing-contact-description">{home.contact.description}</p>

                                <div className="landing-contact-details">
                                    <div className="landing-contact-item">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <div>
                                            <span className="landing-contact-label">{home.contact.phone}</span>
                                            <a href="tel:+352661395650">(+352) 661 395 650</a>
                                        </div>
                                    </div>

                                    <div className="landing-contact-item">
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <div>
                                            <span className="landing-contact-label">{home.contact.email}</span>
                                            <a href="mailto:josianne.terapeutacapilar@gmail.com">josianne.terapeutacapilar@gmail.com</a>
                                        </div>
                                    </div>

                                    <div className="landing-contact-item">
                                        <svg fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        <div>
                                            <span className="landing-contact-label">{home.contact.whatsapp}</span>
                                            <a href="https://wa.me/352661395650" target="_blank" rel="noopener noreferrer">
                                                {home.contact.whatsappAction}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="landing-contact-form-wrapper">
                                <form className="landing-contact-form">
                                    <div className="landing-form-group">
                                        <label htmlFor="name">{home.contact.form.name}</label>
                                        <input type="text" id="name" name="name" required placeholder={home.contact.form.namePlaceholder} />
                                    </div>
                                    <div className="landing-form-group">
                                        <label htmlFor="email">{home.contact.form.email}</label>
                                        <input type="email" id="email" name="email" required placeholder={home.contact.form.emailPlaceholder} />
                                    </div>
                                    <div className="landing-form-group">
                                        <label htmlFor="subject">{home.contact.form.subject}</label>
                                        <input type="text" id="subject" name="subject" required placeholder={home.contact.form.subjectPlaceholder} />
                                    </div>
                                    <div className="landing-form-group">
                                        <label htmlFor="message">{home.contact.form.message}</label>
                                        <textarea id="message" name="message" rows={4} required placeholder={home.contact.form.messagePlaceholder}></textarea>
                                    </div>
                                    <button type="submit" className="landing-btn landing-btn-primary landing-btn-lg">
                                        {common.cta.sendMessage}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer lang={lang} dict={common} />
        </>
    );
}
