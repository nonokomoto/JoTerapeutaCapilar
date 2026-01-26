"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/landing/Logo";

// Header component (reutilizado)
function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/home#sobre", label: "Sobre" },
        { href: "/galeria", label: "Galeria" },
        { href: "/blog", label: "Blog" },
        { href: "/home#contacto", label: "Contacto" },
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
                            <Link
                                key={link.href}
                                href={link.href}
                                className="landing-nav-link"
                            >
                                {link.label}
                            </Link>
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
                            <Link
                                key={link.href}
                                href={link.href}
                                className="landing-nav-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
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

// Footer component (reutilizado)
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
                        <Link href="/home#sobre">Sobre</Link>
                        <Link href="/galeria">Galeria</Link>
                        <Link href="/blog">Blog</Link>
                        <Link href="/home#contacto">Contacto</Link>
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

// Gallery images data - fotos reais das clientes (mais recentes primeiro)
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

export default function GaleriaPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <>
            <Header />
            <main>
                {/* Hero Section */}
                <section className="landing-page-hero">
                    <div className="landing-container">
                        <p className="landing-section-label">Galeria</p>
                        <h1 className="landing-page-title">
                            Resultados que falam por si
                        </h1>
                        <p className="landing-page-subtitle">
                            Descubra as transformações capilares realizadas com amor, dedicação
                            e produtos 100% naturais.
                        </p>
                    </div>
                </section>

                {/* Gallery Grid */}
                <section className="landing-gallery-page">
                    <div className="landing-container">
                        <div className="landing-gallery-grid-full">
                            {galleryImages.map((image) => (
                                <div
                                    key={image}
                                    className="landing-gallery-item-full"
                                    onClick={() => setSelectedImage(image)}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`/images/landing/clientes/${image}`}
                                        alt="Transformação capilar"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Lightbox */}
                {selectedImage && (
                    <div className="landing-lightbox" onClick={() => setSelectedImage(null)}>
                        <button className="landing-lightbox-close" aria-label="Fechar">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="landing-lightbox-content" onClick={e => e.stopPropagation()}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={`/images/landing/clientes/${selectedImage}`}
                                alt="Transformação capilar"
                            />
                        </div>
                    </div>
                )}

                {/* CTA Section */}
                <section className="landing-cta">
                    <div className="landing-container">
                        <div className="landing-cta-content">
                            <h2 className="landing-cta-title">
                                Pronta para a sua transformação?
                            </h2>
                            <p className="landing-cta-description">
                                Marque a sua consulta e descubra como podemos cuidar do seu cabelo
                                de forma natural e personalizada.
                            </p>
                            <div className="landing-cta-actions">
                                <Link href="/home#contacto" className="landing-btn landing-btn-primary landing-btn-lg">
                                    Marcar Consulta
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
