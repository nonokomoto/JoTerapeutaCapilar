"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/landing/Logo";

// ============================================
// HEADER COMPONENT
// ============================================
function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "#sobre", label: "Sobre" },
        { href: "/galeria", label: "Galeria" },
        { href: "/blog", label: "Blog" },
        { href: "#contacto", label: "Contacto" },
    ];

    return (
        <header className="landing-header">
            <div className="landing-container">
                <div className="landing-header-inner">
                    <Link href="/home" className="landing-logo">
                        <Logo size="header" />
                    </Link>

                    <nav className="landing-nav-desktop">
                        {navLinks.map((link) => (
                            link.href.startsWith("/") ? (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="landing-nav-link"
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="landing-nav-link"
                                >
                                    {link.label}
                                </a>
                            )
                        ))}
                    </nav>

                    <div className="landing-header-actions">
                        <Link href="/login" className="landing-btn landing-btn-primary">
                            Área de Cliente
                        </Link>
                    </div>

                    <button
                        className="landing-mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menu"
                    >
                        <span className={`hamburger ${mobileMenuOpen ? "open" : ""}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                    </button>
                </div>

                {mobileMenuOpen && (
                    <nav className="landing-nav-mobile">
                        {navLinks.map((link) => (
                            link.href.startsWith("/") ? (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="landing-nav-link"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="landing-nav-link"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            )
                        ))}
                        <Link
                            href="/login"
                            className="landing-btn landing-btn-primary"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Área de Cliente
                        </Link>
                    </nav>
                )}
            </div>
        </header>
    );
}

// ============================================
// HERO SECTION - Split Layout
// ============================================
function HeroSection() {
    return (
        <section className="landing-hero">
            <div className="landing-container">
                <div className="landing-hero-content">
                    <p className="landing-hero-label">Josianne Gomes</p>
                    <h1 className="landing-hero-title">
                        Honre o seu legado,<br />
                        celebre a sua <span className="text-accent">beleza</span>
                    </h1>
                    <p className="landing-hero-subtitle">
                        Terapeuta Capilar especializada em tricologia clínica e cabelos crespos e cacheados.
                        Tratamentos personalizados com produtos 100% naturais.
                    </p>
                    <div className="landing-hero-actions">
                        <a href="#contacto" className="landing-btn landing-btn-primary landing-btn-lg">
                            Marcar Consulta
                        </a>
                        <Link href="/sobre" className="landing-btn landing-btn-secondary landing-btn-lg">
                            Saber Mais
                        </Link>
                    </div>
                </div>

                <div className="landing-hero-image">
                    <div className="landing-hero-image-wrapper">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/landing/hero.jpg"
                            alt="Josianne Gomes - Terapeuta Capilar"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div className="landing-hero-image-frame"></div>
                    </div>
                </div>
            </div>

            <div className="landing-hero-decoration">
                <span>Scroll</span>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}

// ============================================
// FEATURES SECTION
// ============================================
function FeaturesSection() {
    const features = [
        {
            icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "Fórmulas Seguras",
            description: "Produtos 100% naturais e biológicos, cuidadosamente selecionados para garantir a máxima qualidade e eficácia nos tratamentos.",
        },
        {
            icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            title: "Resultados Visíveis",
            description: "Tratamentos personalizados com resultados comprovados, adaptados às necessidades específicas de cada tipo de cabelo.",
        },
        {
            icon: (
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ),
            title: "Fontes Éticas",
            description: "Matérias-primas de origem sustentável, respeitando o ambiente e promovendo práticas de consumo consciente.",
        },
    ];

    return (
        <section className="landing-features">
            <div className="landing-container">
                <div className="landing-section-header">
                    <p className="landing-section-label">Os Nossos Valores</p>
                    <h2 className="landing-section-title">
                        Compromisso com a qualidade e o seu bem-estar
                    </h2>
                </div>
                <div className="landing-features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="landing-feature-card">
                            <div className="landing-feature-icon">{feature.icon}</div>
                            <h3 className="landing-feature-title">{feature.title}</h3>
                            <p className="landing-feature-description">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================
// ABOUT SECTION
// ============================================
function AboutSection() {
    return (
        <section id="sobre" className="landing-about">
            <div className="landing-container">
                <div className="landing-about-grid">
                    <div className="landing-about-image">
                        <div className="landing-about-image-wrapper">
                            <div className="landing-about-image-inner">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/images/landing/profile.webp"
                                    alt="Josianne Gomes - Terapeuta Capilar"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="landing-about-content">
                        <p className="landing-section-label">Sobre Mim</p>
                        <h2 className="landing-section-title">Josianne Gomes</h2>
                        <div className="landing-about-text">
                            <p>
                                Terapeuta Capilar especializada em tricologia clínica e cabelos crespos e cacheados.
                                Com formação em Fitoenergética, Aromaterapia e colorimetria, dedico-me a proporcionar
                                tratamentos personalizados que respeitam a natureza única de cada cabelo.
                            </p>
                            <p>
                                Em 2019, após um acidente grave, iniciei a minha jornada de cura através da terapia capilar.
                                Esta experiência transformadora levou-me a partilhar este conhecimento com outras pessoas,
                                ajudando-as a reconectar-se com as suas raízes e a celebrar a sua beleza natural.
                            </p>
                            <p>
                                Utilizo exclusivamente produtos 100% naturais e biológicos, cuidadosamente selecionados
                                para nutrir e revitalizar o seu cabelo de forma saudável e sustentável.
                            </p>
                            <p className="landing-about-quote">
                                &ldquo;Bem-vinda à terapia pelo amor!&rdquo;
                            </p>
                        </div>
                        <a href="#contacto" className="landing-btn landing-btn-primary">
                            Entrar em Contacto
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================
// GALLERY SECTION
// ============================================
function GallerySection() {
    const galleryImages = [
        { src: "IMG_7101.webp", alt: "Transformação capilar" },
        { src: "IMG_7110.webp", alt: "Tratamento de cachos" },
        { src: "IMG_7114.webp", alt: "Hidratação profunda" },
        { src: "IMG_7236.webp", alt: "Definição de cachos" },
        { src: "IMG_7242.webp", alt: "Resultado de tratamento" },
        { src: "IMG_7272.webp", alt: "Cabelos saudáveis" },
    ];

    return (
        <section id="galeria" className="landing-gallery">
            <div className="landing-container">
                <div className="landing-section-header">
                    <p className="landing-section-label">Galeria</p>
                    <h2 className="landing-section-title">
                        Resultados que falam por si
                    </h2>
                </div>
                <div className="landing-gallery-grid">
                    {galleryImages.map((image, index) => (
                        <div key={index} className="landing-gallery-item">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`/images/landing/clientes/${image.src}`}
                                alt={image.alt}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </div>
                <div className="landing-gallery-cta">
                    <Link href="/galeria" className="landing-btn landing-btn-secondary">
                        Ver Galeria Completa
                    </Link>
                </div>
            </div>
        </section>
    );
}

// ============================================
// BLOG SECTION
// ============================================
function BlogSection() {
    return (
        <section id="blog" className="landing-blog">
            <div className="landing-container">
                <div className="landing-blog-grid">
                    <div className="landing-blog-image">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/landing/clientes/WhatsApp+Image+2024-11-27+at+17.57.26.webp"
                            alt="Cliente feliz com cabelos cacheados saudáveis"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="landing-blog-content">
                        <p className="landing-section-label">Blog</p>
                        <h2 className="landing-section-title">
                            Dicas de cuidados capilares
                        </h2>
                        <p className="landing-blog-description">
                            Descubra artigos sobre cuidados capilares, dicas de tratamentos naturais,
                            receitas caseiras e muito mais para manter o seu cabelo saudável e bonito.
                        </p>
                        <Link href="/blog" className="landing-btn landing-btn-primary">
                            Ver Publicações
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================
// CONTACT SECTION
// ============================================
function ContactSection() {
    return (
        <section id="contacto" className="landing-contact">
            <div className="landing-container">
                <div className="landing-contact-grid">
                    <div className="landing-contact-info">
                        <p className="landing-section-label">Contacto</p>
                        <h2 className="landing-section-title">
                            Marque a sua consulta
                        </h2>
                        <p className="landing-contact-description">
                            Estou disponível para responder às suas questões e agendar a sua consulta personalizada.
                            Entre em contacto através dos meios abaixo.
                        </p>

                        <div className="landing-contact-details">
                            <div className="landing-contact-item">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div>
                                    <span className="landing-contact-label">Telefone</span>
                                    <a href="tel:+352661395650">(+352) 661 395 650</a>
                                </div>
                            </div>

                            <div className="landing-contact-item">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <span className="landing-contact-label">Email</span>
                                    <a href="mailto:josianne.terapeutacapilar@gmail.com">josianne.terapeutacapilar@gmail.com</a>
                                </div>
                            </div>

                            <div className="landing-contact-item">
                                <svg fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <div>
                                    <span className="landing-contact-label">WhatsApp</span>
                                    <a href="https://wa.me/352661395650" target="_blank" rel="noopener noreferrer">
                                        Enviar mensagem
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="landing-contact-form-wrapper">
                        <form className="landing-contact-form">
                            <div className="landing-form-group">
                                <label htmlFor="name">Nome</label>
                                <input type="text" id="name" name="name" required placeholder="O seu nome" />
                            </div>
                            <div className="landing-form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" required placeholder="O seu email" />
                            </div>
                            <div className="landing-form-group">
                                <label htmlFor="subject">Assunto</label>
                                <input type="text" id="subject" name="subject" required placeholder="Assunto da mensagem" />
                            </div>
                            <div className="landing-form-group">
                                <label htmlFor="message">Mensagem</label>
                                <textarea id="message" name="message" rows={4} required placeholder="A sua mensagem"></textarea>
                            </div>
                            <button type="submit" className="landing-btn landing-btn-primary landing-btn-lg">
                                Enviar Mensagem
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
    return (
        <footer className="landing-footer">
            <div className="landing-container">
                <div className="landing-footer-grid">
                    <div className="landing-footer-brand">
                        <Logo size="footer" />
                    </div>
                    <div className="landing-footer-links">
                        <h4>Navegação</h4>
                        <a href="#sobre">Sobre</a>
                        <Link href="/galeria">Galeria</Link>
                        <Link href="/blog">Blog</Link>
                        <a href="#contacto">Contacto</a>
                    </div>
                    <div className="landing-footer-links">
                        <h4>Ligações</h4>
                        <Link href="/login">Área de Cliente</Link>
                    </div>
                    <div className="landing-footer-social">
                        <h4>Redes Sociais</h4>
                        <div className="landing-social-links">
                            <a
                                href="https://instagram.com/joterapeutacapilar"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            <a
                                href="https://facebook.com/joterapeutacapilar"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                            >
                                <svg fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="landing-footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Josianne Gomes - Terapeuta Capilar. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

// ============================================
// MAIN PAGE
// ============================================
export default function LandingPage() {
    return (
        <>
            <Header />
            <main>
                <HeroSection />
                <FeaturesSection />
                <AboutSection />
                <GallerySection />
                <BlogSection />
                <ContactSection />
            </main>
            <Footer />
        </>
    );
}
