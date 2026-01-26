"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getLocalizedHash } from "@/i18n/routes";

interface BlogPageClientProps {
    lang: Locale;
    dict: Dictionary;
}

const blogPosts = [
    {
        id: 1,
        slug: "como-cuidar-cabelos-cacheados",
        title: { pt: "Como cuidar de cabelos cacheados no inverno", fr: "Comment prendre soin des cheveux boucles en hiver" },
        excerpt: { pt: "Descubra as melhores dicas para manter os seus cachos hidratados e definidos durante os meses mais frios do ano.", fr: "Decouvrez les meilleures astuces pour garder vos boucles hydratees et definies pendant les mois les plus froids." },
        categoryKey: "cuidados",
        date: "15 Jan 2024",
        readTime: "5 min",
        image: "/images/landing/clientes/IMG_7272.webp",
    },
    {
        id: 2,
        slug: "beneficios-oleos-naturais",
        title: { pt: "Os beneficios dos oleos naturais para o cabelo", fr: "Les bienfaits des huiles naturelles pour les cheveux" },
        excerpt: { pt: "Conheca os oleos essenciais que podem transformar a saude do seu cabelo de forma natural e eficaz.", fr: "Decouvrez les huiles essentielles qui peuvent transformer la sante de vos cheveux naturellement." },
        categoryKey: "tratamentos",
        date: "10 Jan 2024",
        readTime: "7 min",
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=400&fit=crop",
    },
    {
        id: 3,
        slug: "transicao-capilar-guia",
        title: { pt: "Guia completo da transicao capilar", fr: "Guide complet de la transition capillaire" },
        excerpt: { pt: "Tudo o que precisa saber para iniciar a sua jornada de transicao capilar com sucesso e paciencia.", fr: "Tout ce que vous devez savoir pour commencer votre parcours de transition capillaire avec succes." },
        categoryKey: "transicao",
        date: "5 Jan 2024",
        readTime: "10 min",
        image: "/images/landing/clientes/WhatsApp+Image+2024-11-27+at+17.57.22.webp",
    },
    {
        id: 4,
        slug: "receitas-caseiras-hidratacao",
        title: { pt: "5 receitas caseiras para hidratacao profunda", fr: "5 recettes maison pour une hydratation profonde" },
        excerpt: { pt: "Aprenda a fazer mascaras capilares naturais com ingredientes que ja tem em casa.", fr: "Apprenez a faire des masques capillaires naturels avec des ingredients que vous avez deja chez vous." },
        categoryKey: "receitas",
        date: "28 Dez 2023",
        readTime: "6 min",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop",
    },
    {
        id: 5,
        slug: "couro-cabeludo-saudavel",
        title: { pt: "A importancia de um couro cabeludo saudavel", fr: "L'importance d'un cuir chevelu sain" },
        excerpt: { pt: "Entenda por que cuidar do couro cabeludo e essencial para ter cabelos fortes e bonitos.", fr: "Comprenez pourquoi prendre soin du cuir chevelu est essentiel pour avoir des cheveux forts et beaux." },
        categoryKey: "saude",
        date: "20 Dez 2023",
        readTime: "4 min",
        image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=400&fit=crop",
    },
    {
        id: 6,
        slug: "produtos-naturais-evitar-quimicos",
        title: { pt: "Por que escolher produtos naturais?", fr: "Pourquoi choisir des produits naturels?" },
        excerpt: { pt: "Saiba quais ingredientes quimicos evitar e como fazer escolhas mais saudaveis para o seu cabelo.", fr: "Decouvrez quels ingredients chimiques eviter et comment faire des choix plus sains pour vos cheveux." },
        categoryKey: "produtos",
        date: "15 Dez 2023",
        readTime: "8 min",
        image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&h=400&fit=crop",
    },
];

const categoryKeys = ["cuidados", "tratamentos", "transicao", "receitas", "saude", "produtos"] as const;

export function BlogPageClient({ lang, dict }: BlogPageClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const { common, blog } = dict;
    const contactHash = getLocalizedHash("contact", lang);
    const homePath = "/" + lang;

    const filteredPosts = selectedCategory === "all"
        ? blogPosts
        : blogPosts.filter(post => post.categoryKey === selectedCategory);

    const getCategoryLabel = (key: string) => {
        if (key === "all") return blog.filters.all;
        const categories = blog.filters.categories as Record<string, string>;
        return categories[key] || key;
    };

    return (
        <>
            <Header lang={lang} dict={common} />
            <main>
                <section className="landing-page-hero">
                    <div className="landing-container">
                        <p className="landing-section-label">{blog.hero.label}</p>
                        <h1 className="landing-page-title">{blog.hero.title}</h1>
                        <p className="landing-page-subtitle">{blog.hero.subtitle}</p>
                    </div>
                </section>

                <section className="landing-blog-page">
                    <div className="landing-container">
                        <div className="landing-blog-filters">
                            <button
                                className={"landing-filter-btn" + (selectedCategory === "all" ? " active" : "")}
                                onClick={() => setSelectedCategory("all")}
                            >
                                {blog.filters.all}
                            </button>
                            {categoryKeys.map((key) => (
                                <button
                                    key={key}
                                    className={"landing-filter-btn" + (selectedCategory === key ? " active" : "")}
                                    onClick={() => setSelectedCategory(key)}
                                >
                                    {getCategoryLabel(key)}
                                </button>
                            ))}
                        </div>

                        <div className="landing-blog-grid-full">
                            {filteredPosts.map((post) => (
                                <article key={post.id} className="landing-blog-card">
                                    <div className="landing-blog-card-image">
                                        <img src={post.image} alt={post.title[lang]} />
                                    </div>
                                    <div className="landing-blog-card-content">
                                        <div className="landing-blog-card-meta">
                                            <span className="landing-blog-card-category">{getCategoryLabel(post.categoryKey)}</span>
                                            <span className="landing-blog-card-date">{post.date}</span>
                                        </div>
                                        <h2 className="landing-blog-card-title">{post.title[lang]}</h2>
                                        <p className="landing-blog-card-excerpt">{post.excerpt[lang]}</p>
                                        <div className="landing-blog-card-footer">
                                            <span className="landing-blog-card-readtime">{post.readTime} {blog.post.readTime}</span>
                                            <Link href={"/" + lang + "/blog/" + post.slug} className="landing-blog-card-link">
                                                {common.cta.readMore}
                                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="landing-cta">
                    <div className="landing-container">
                        <div className="landing-cta-content">
                            <h2 className="landing-cta-title">{blog.cta.title}</h2>
                            <p className="landing-cta-description">{blog.cta.description}</p>
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
