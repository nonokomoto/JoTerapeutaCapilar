"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Logo } from "@/components/landing/Logo";

// Blog posts data (mesmos dados da página principal)
const blogPosts = [
    {
        id: 1,
        slug: "como-cuidar-cabelos-cacheados",
        title: "Como cuidar de cabelos cacheados no inverno",
        excerpt: "Descubra as melhores dicas para manter os seus cachos hidratados e definidos durante os meses mais frios do ano.",
        category: "Cuidados",
        date: "15 Jan 2024",
        readTime: "5 min",
        image: "/images/landing/clientes/IMG_7272.webp",
        content: `
            <p>O inverno pode ser um período desafiador para quem tem cabelos cacheados. O ar frio e seco tende a retirar a humidade natural dos fios, deixando-os mais secos, quebradiços e com frizz.</p>

            <h2>Por que os cachos sofrem mais no inverno?</h2>
            <p>Os cabelos cacheados têm uma estrutura diferente dos cabelos lisos. A curvatura dos fios dificulta a distribuição da oleosidade natural do couro cabeludo até às pontas, tornando-os naturalmente mais secos.</p>
            <p>Durante o inverno, este problema intensifica-se devido a:</p>
            <ul>
                <li>Baixa humidade do ar</li>
                <li>Uso de água quente durante o banho</li>
                <li>Aquecimento central em ambientes fechados</li>
                <li>Uso de gorros e cachecóis que causam fricção</li>
            </ul>

            <h2>Dicas essenciais para o inverno</h2>

            <h3>1. Hidratação profunda semanal</h3>
            <p>Intensifique a hidratação durante o inverno. Uma máscara de hidratação profunda semanal é essencial para repor a humidade perdida.</p>

            <h3>2. Evite água muito quente</h3>
            <p>Por mais tentador que seja um banho quente no inverno, a água em temperatura elevada remove os óleos naturais do cabelo. Opte por água morna e finalize com água fria para selar as cutículas.</p>

            <h3>3. Use óleos naturais</h3>
            <p>Óleos como o de coco, argan ou abacate são excelentes para criar uma barreira protetora nos fios. Aplique algumas gotas nas pontas após a lavagem.</p>

            <h3>4. Proteja os fios do frio</h3>
            <p>Ao usar gorros, prefira os de cetim ou forre o seu gorro com um lenço de seda para evitar a fricção e o frizz.</p>

            <h3>5. Mantenha-se hidratada</h3>
            <p>A hidratação começa de dentro para fora. Beba bastante água e mantenha uma alimentação equilibrada, rica em ómega-3 e vitaminas.</p>

            <h2>Receita caseira de hidratação</h2>
            <p>Uma receita simples e eficaz para o inverno:</p>
            <ul>
                <li>2 colheres de sopa de azeite</li>
                <li>1 colher de sopa de mel</li>
                <li>1 banana madura amassada</li>
            </ul>
            <p>Misture todos os ingredientes, aplique nos cabelos e deixe atuar por 30 minutos. Enxague bem e lave normalmente.</p>

            <p>Com estes cuidados, os seus cachos vão manter-se saudáveis, hidratados e definidos durante todo o inverno!</p>
        `,
    },
    {
        id: 2,
        slug: "beneficios-oleos-naturais",
        title: "Os benefícios dos óleos naturais para o cabelo",
        excerpt: "Conheça os óleos essenciais que podem transformar a saúde do seu cabelo de forma natural e eficaz.",
        category: "Tratamentos",
        date: "10 Jan 2024",
        readTime: "7 min",
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&h=450&fit=crop",
        content: `
            <p>Os óleos naturais têm sido utilizados há séculos para cuidar dos cabelos. Ricos em nutrientes, vitaminas e ácidos gordos essenciais, são aliados poderosos para manter os fios saudáveis e brilhantes.</p>

            <h2>Os melhores óleos para cada tipo de cabelo</h2>

            <h3>Óleo de Coco</h3>
            <p>O óleo de coco é um dos mais versáteis. Penetra profundamente na fibra capilar, nutrindo de dentro para fora. Ideal para cabelos secos e danificados.</p>
            <p><strong>Como usar:</strong> Aplique no cabelo seco antes de dormir e lave pela manhã, ou use como finalizador em pequenas quantidades.</p>

            <h3>Óleo de Argan</h3>
            <p>Conhecido como "ouro líquido", o óleo de argan é rico em vitamina E e antioxidantes. Confere brilho intenso sem deixar os fios pesados.</p>
            <p><strong>Como usar:</strong> Perfeito como finalizador. Aplique 2-3 gotas nas pontas do cabelo húmido ou seco.</p>

            <h3>Óleo de Rícino (Mamona)</h3>
            <p>Estimula o crescimento capilar e fortalece os fios. Rico em ácido ricinoleico, que possui propriedades anti-inflamatórias.</p>
            <p><strong>Como usar:</strong> Massaje no couro cabeludo e deixe atuar por pelo menos 2 horas antes de lavar.</p>

            <h3>Óleo de Abacate</h3>
            <p>Extremamente nutritivo, rico em vitaminas A, D e E. Penetra facilmente nos fios, sendo excelente para cabelos muito secos.</p>
            <p><strong>Como usar:</strong> Pode ser usado em máscaras caseiras ou como tratamento pré-shampoo.</p>

            <h3>Óleo de Jojoba</h3>
            <p>A composição mais próxima da oleosidade natural do couro cabeludo. Ideal para equilibrar a produção de sebo.</p>
            <p><strong>Como usar:</strong> Excelente para massagens no couro cabeludo ou como finalizador leve.</p>

            <h2>Dicas de utilização</h2>
            <ul>
                <li>Aqueça levemente o óleo antes de aplicar para potenciar a absorção</li>
                <li>Menos é mais - comece com poucas gotas e aumente conforme necessário</li>
                <li>Combine diferentes óleos para obter múltiplos benefícios</li>
                <li>Escolha sempre óleos puros, prensados a frio e de qualidade</li>
            </ul>

            <p>Integrar óleos naturais na sua rotina capilar é um passo simples que pode fazer toda a diferença na saúde e beleza dos seus cabelos!</p>
        `,
    },
    {
        id: 3,
        slug: "transicao-capilar-guia",
        title: "Guia completo da transição capilar",
        excerpt: "Tudo o que precisa saber para iniciar a sua jornada de transição capilar com sucesso e paciência.",
        category: "Transição",
        date: "5 Jan 2024",
        readTime: "10 min",
        image: "/images/landing/clientes/WhatsApp+Image+2024-11-27+at+17.57.22.webp",
        content: `
            <p>A transição capilar é o processo de abandonar os tratamentos químicos e deixar crescer o cabelo natural. É uma jornada de autodescoberta e aceitação que requer paciência, mas os resultados são transformadores.</p>

            <h2>O que é a transição capilar?</h2>
            <p>É o período entre a última química (alisamento, relaxamento, permanente) e o corte total da parte química. Durante este período, convive-se com duas texturas diferentes no cabelo.</p>

            <h2>Por onde começar?</h2>

            <h3>1. Defina o seu objetivo</h3>
            <p>Decida se quer fazer a transição gradual (deixando crescer) ou o big chop (corte radical). Ambas as opções são válidas e a escolha deve respeitar o seu tempo e conforto.</p>

            <h3>2. Pare com as químicas</h3>
            <p>O primeiro passo é parar definitivamente com qualquer tratamento que altere a estrutura do fio. Isto inclui alisamentos, relaxamentos e progressivas.</p>

            <h3>3. Invista em hidratação</h3>
            <p>Durante a transição, a linha de demarcação (onde o cabelo natural encontra o químico) é frágil e propensa a quebra. Hidratações frequentes são essenciais.</p>

            <h2>Cuidados durante a transição</h2>

            <h3>Cronograma capilar</h3>
            <p>Siga um cronograma equilibrado de:</p>
            <ul>
                <li><strong>Hidratação:</strong> Repõe a água nos fios</li>
                <li><strong>Nutrição:</strong> Repõe os lípidos com óleos e manteigas</li>
                <li><strong>Reconstrução:</strong> Repõe a proteína (queratina)</li>
            </ul>

            <h3>Penteados protetores</h3>
            <p>Tranças, coques e twists ajudam a camuflar as duas texturas e protegem os fios da manipulação excessiva.</p>

            <h3>Cortes regulares</h3>
            <p>Vá cortando as pontas químicas gradualmente. Isto ajuda a reduzir a diferença entre as texturas e mantém o cabelo saudável.</p>

            <h2>Produtos recomendados</h2>
            <ul>
                <li>Shampoos suaves, sem sulfatos agressivos</li>
                <li>Condicionadores nutritivos</li>
                <li>Leave-ins hidratantes</li>
                <li>Óleos vegetais para selar a hidratação</li>
                <li>Cremes de pentear para definição</li>
            </ul>

            <h2>Quanto tempo dura a transição?</h2>
            <p>Não há um tempo definido. Depende do comprimento que deseja atingir antes do big chop e da velocidade de crescimento do seu cabelo (em média 1-1,5cm por mês).</p>

            <p>Lembre-se: a transição capilar é também uma transição emocional. Seja paciente consigo mesma e celebre cada centímetro de cabelo natural que cresce!</p>
        `,
    },
    {
        id: 4,
        slug: "receitas-caseiras-hidratacao",
        title: "5 receitas caseiras para hidratação profunda",
        excerpt: "Aprenda a fazer máscaras capilares naturais com ingredientes que já tem em casa.",
        category: "Receitas",
        date: "28 Dez 2023",
        readTime: "6 min",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=900&h=450&fit=crop",
        content: `
            <p>Não é preciso gastar fortunas em produtos para ter cabelos hidratados e saudáveis. A sua cozinha está cheia de ingredientes poderosos para criar máscaras capilares eficazes!</p>

            <h2>1. Máscara de Abacate e Mel</h2>
            <p><strong>Ideal para:</strong> Cabelos muito secos e danificados</p>
            <p><strong>Ingredientes:</strong></p>
            <ul>
                <li>1 abacate maduro</li>
                <li>2 colheres de sopa de mel</li>
                <li>1 colher de sopa de azeite</li>
            </ul>
            <p><strong>Modo de preparo:</strong> Amasse bem o abacate e misture com o mel e o azeite até formar uma pasta homogénea. Aplique no cabelo húmido, deixe atuar 30 minutos e enxague bem.</p>

            <h2>2. Máscara de Banana e Óleo de Coco</h2>
            <p><strong>Ideal para:</strong> Cabelos com frizz e sem brilho</p>
            <p><strong>Ingredientes:</strong></p>
            <ul>
                <li>1 banana madura</li>
                <li>2 colheres de sopa de óleo de coco</li>
                <li>1 colher de sopa de mel</li>
            </ul>
            <p><strong>Modo de preparo:</strong> Bata todos os ingredientes no liquidificador até ficar bem liso (sem grumos!). Aplique mecha a mecha, deixe 20-30 minutos e lave normalmente.</p>

            <h2>3. Máscara de Iogurte Natural</h2>
            <p><strong>Ideal para:</strong> Cabelos oleosos que precisam de hidratação leve</p>
            <p><strong>Ingredientes:</strong></p>
            <ul>
                <li>1 copo de iogurte natural (sem açúcar)</li>
                <li>1 colher de sopa de mel</li>
            </ul>
            <p><strong>Modo de preparo:</strong> Misture os ingredientes e aplique no cabelo lavado e húmido. Deixe 20 minutos e enxague com água fria.</p>

            <h2>4. Máscara de Ovo e Azeite</h2>
            <p><strong>Ideal para:</strong> Cabelos fracos e quebradiços</p>
            <p><strong>Ingredientes:</strong></p>
            <ul>
                <li>1 ovo inteiro</li>
                <li>2 colheres de sopa de azeite</li>
                <li>1 colher de sopa de mel</li>
            </ul>
            <p><strong>Modo de preparo:</strong> Bata o ovo e misture os outros ingredientes. Aplique no cabelo, deixe 20 minutos e enxague com água FRIA (importante para não cozinhar o ovo!).</p>

            <h2>5. Máscara de Papaia e Mel</h2>
            <p><strong>Ideal para:</strong> Todos os tipos de cabelo</p>
            <p><strong>Ingredientes:</strong></p>
            <ul>
                <li>1/2 papaia madura</li>
                <li>2 colheres de sopa de mel</li>
                <li>1 colher de sopa de óleo de coco</li>
            </ul>
            <p><strong>Modo de preparo:</strong> Bata a papaia no liquidificador com os outros ingredientes. Aplique da raiz às pontas, deixe 30 minutos e lave normalmente.</p>

            <h2>Dicas importantes</h2>
            <ul>
                <li>Faça sempre um teste de alergia antes de usar ingredientes novos</li>
                <li>Use ingredientes frescos e de qualidade</li>
                <li>Não guarde as sobras - prepare apenas a quantidade necessária</li>
                <li>Use uma touca térmica ou plástica para potenciar os resultados</li>
            </ul>

            <p>Experimente estas receitas e descubra qual funciona melhor para o seu tipo de cabelo!</p>
        `,
    },
    {
        id: 5,
        slug: "couro-cabeludo-saudavel",
        title: "A importância de um couro cabeludo saudável",
        excerpt: "Entenda por que cuidar do couro cabeludo é essencial para ter cabelos fortes e bonitos.",
        category: "Saúde",
        date: "20 Dez 2023",
        readTime: "4 min",
        image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&h=450&fit=crop",
        content: `
            <p>Muitas pessoas focam-se apenas nos fios, esquecendo que a saúde capilar começa no couro cabeludo. Assim como uma planta precisa de solo fértil para crescer, os nossos cabelos precisam de um couro cabeludo saudável.</p>

            <h2>Por que o couro cabeludo é tão importante?</h2>
            <p>O couro cabeludo é onde estão os folículos capilares - as estruturas que produzem os fios de cabelo. Um couro cabeludo saudável:</p>
            <ul>
                <li>Fornece nutrientes para os fios</li>
                <li>Mantém o pH equilibrado</li>
                <li>Protege contra infeções</li>
                <li>Regula a produção de oleosidade</li>
            </ul>

            <h2>Problemas comuns do couro cabeludo</h2>

            <h3>Caspa</h3>
            <p>Pode ser causada por fungos, stress, ou produtos inadequados. Manifesta-se através de descamação visível e comichão.</p>

            <h3>Oleosidade excessiva</h3>
            <p>Produção exagerada de sebo que deixa o cabelo com aspeto gorduroso. Pode ser agravada por lavagens frequentes com produtos agressivos.</p>

            <h3>Couro cabeludo seco</h3>
            <p>Sensação de repuxar, descamação fina e comichão. Diferente da caspa, as escamas são menores e mais secas.</p>

            <h3>Dermatite seborreica</h3>
            <p>Condição mais intensa que a caspa comum, com placas avermelhadas e descamação gordurosa. Requer acompanhamento profissional.</p>

            <h2>Como cuidar do couro cabeludo</h2>

            <h3>1. Limpeza adequada</h3>
            <p>Lave o cabelo com a frequência adequada ao seu tipo. Use shampoos suaves e massaje bem o couro cabeludo com as pontas dos dedos (nunca com as unhas).</p>

            <h3>2. Esfoliação</h3>
            <p>Uma vez por semana, faça uma esfoliação suave para remover células mortas e resíduos de produtos. Pode usar um esfoliante específico ou açúcar mascavado misturado com shampoo.</p>

            <h3>3. Hidratação</h3>
            <p>Use tónicos e séruns específicos para o couro cabeludo. Óleos como o de jojoba e tea tree são excelentes para equilibrar.</p>

            <h3>4. Massagem</h3>
            <p>Massaje o couro cabeludo diariamente por alguns minutos. Isto estimula a circulação sanguínea e a chegada de nutrientes aos folículos.</p>

            <h3>5. Proteção solar</h3>
            <p>O couro cabeludo também sofre com a exposição solar. Use chapéus ou produtos com proteção UV.</p>

            <p>Cuidar do couro cabeludo é investir na saúde e beleza dos seus cabelos a longo prazo!</p>
        `,
    },
    {
        id: 6,
        slug: "produtos-naturais-evitar-quimicos",
        title: "Por que escolher produtos naturais?",
        excerpt: "Saiba quais ingredientes químicos evitar e como fazer escolhas mais saudáveis para o seu cabelo.",
        category: "Produtos",
        date: "15 Dez 2023",
        readTime: "8 min",
        image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=900&h=450&fit=crop",
        content: `
            <p>Cada vez mais pessoas estão a optar por produtos capilares naturais. Mas porquê? Quais são os ingredientes que devemos evitar e como fazer escolhas mais conscientes?</p>

            <h2>Ingredientes a evitar</h2>

            <h3>Sulfatos (SLS/SLES)</h3>
            <p>São detergentes agressivos responsáveis pela espuma abundante. Removem a oleosidade natural do cabelo, causando ressecamento e irritação do couro cabeludo.</p>
            <p><strong>Procure por:</strong> Shampoos sem sulfatos ou com surfactantes suaves como cocamidopropyl betaine.</p>

            <h3>Parabenos</h3>
            <p>Conservantes que podem interferir com o sistema hormonal. Aparecem nos rótulos como methylparaben, propylparaben, butylparaben.</p>
            <p><strong>Alternativas:</strong> Conservantes naturais como vitamina E, extrato de semente de toranja.</p>

            <h3>Silicones insolúveis</h3>
            <p>Criam uma película nos fios que inicialmente dá brilho, mas com o tempo acumula-se e impede a entrada de nutrientes. Exemplos: dimethicone, cyclomethicone.</p>
            <p><strong>Alternativas:</strong> Silicones solúveis em água ou óleos naturais.</p>

            <h3>Petrolatos e óleos minerais</h3>
            <p>Derivados do petróleo que "sufocam" o fio. Aparecem como mineral oil, paraffinum liquidum, petrolatum.</p>
            <p><strong>Alternativas:</strong> Óleos vegetais como coco, argan, abacate.</p>

            <h3>Álcoois secantes</h3>
            <p>Alguns álcoois ressecam os fios, como alcohol denat, isopropyl alcohol, propanol.</p>
            <p><strong>Álcoois bons:</strong> Cetyl alcohol, cetearyl alcohol, stearyl alcohol (são emolientes).</p>

            <h2>Benefícios dos produtos naturais</h2>
            <ul>
                <li>Menos irritação e alergias</li>
                <li>Respeito pelo equilíbrio natural do cabelo</li>
                <li>Ingredientes biodegradáveis</li>
                <li>Sustentabilidade ambiental</li>
                <li>Resultados a longo prazo mais saudáveis</li>
            </ul>

            <h2>Como ler os rótulos</h2>
            <p>Os ingredientes são listados por ordem de concentração - os primeiros da lista são os mais abundantes. Procure produtos onde os ingredientes naturais apareçam no início da lista.</p>

            <h2>Período de adaptação</h2>
            <p>Ao mudar para produtos naturais, o cabelo pode passar por um período de adaptação de 2 a 4 semanas. Isto é normal - o cabelo está a "desintoxicar" dos produtos anteriores.</p>

            <h2>Marcas e certificações</h2>
            <p>Procure por certificações como:</p>
            <ul>
                <li>COSMOS Organic</li>
                <li>Ecocert</li>
                <li>NATRUE</li>
                <li>Cruelty-free / Vegan</li>
            </ul>

            <p>A transição para produtos naturais é um investimento na saúde do seu cabelo e do planeta. Vale a pena!</p>
        `,
    },
];

// Header component
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

// Footer component
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

export default function BlogPostPage() {
    const params = useParams();
    const slug = params.slug as string;

    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return (
            <>
                <Header />
                <main>
                    <section className="landing-page-hero">
                        <div className="landing-container">
                            <h1 className="landing-page-title">Artigo não encontrado</h1>
                            <p className="landing-page-subtitle">
                                O artigo que procura não existe ou foi removido.
                            </p>
                            <Link href="/blog" className="landing-btn landing-btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
                                Voltar ao Blog
                            </Link>
                        </div>
                    </section>
                </main>
                <Footer />
            </>
        );
    }

    // Get related posts (same category, excluding current)
    const relatedPosts = blogPosts
        .filter(p => p.category === post.category && p.id !== post.id)
        .slice(0, 2);

    return (
        <>
            <Header />
            <main>
                {/* Article Header */}
                <section className="landing-article-hero">
                    <div className="landing-container">
                        <div className="landing-article-meta-top">
                            <Link href="/blog" className="landing-back-link">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                </svg>
                                Voltar ao Blog
                            </Link>
                        </div>
                        <span className="landing-article-category">{post.category}</span>
                        <h1 className="landing-article-title">{post.title}</h1>
                        <div className="landing-article-meta">
                            <span>{post.date}</span>
                            <span className="landing-meta-divider">•</span>
                            <span>{post.readTime} de leitura</span>
                        </div>
                    </div>
                </section>

                {/* Featured Image */}
                <section className="landing-article-image">
                    <div className="landing-container">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.image}
                            alt={post.title}
                        />
                    </div>
                </section>

                {/* Article Content */}
                <section className="landing-article-content">
                    <div className="landing-container">
                        <div
                            className="landing-article-body"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </section>

                {/* Author */}
                <section className="landing-article-author">
                    <div className="landing-container">
                        <div className="landing-author-card">
                            <div className="landing-author-avatar">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/images/landing/profile.webp"
                                    alt="Josianne Gomes"
                                />
                            </div>
                            <div className="landing-author-info">
                                <span className="landing-author-label">Escrito por</span>
                                <h3 className="landing-author-name">Josianne Gomes</h3>
                                <p className="landing-author-bio">
                                    Terapeuta Capilar especializada em tricologia clínica e cabelos crespos e cacheados.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="landing-related-posts">
                        <div className="landing-container">
                            <h2 className="landing-related-title">Artigos relacionados</h2>
                            <div className="landing-related-grid">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost.id}
                                        href={`/blog/${relatedPost.slug}`}
                                        className="landing-related-card"
                                    >
                                        <div className="landing-related-card-image">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={relatedPost.image}
                                                alt={relatedPost.title}
                                            />
                                        </div>
                                        <div className="landing-related-card-content">
                                            <span className="landing-related-card-category">{relatedPost.category}</span>
                                            <h3 className="landing-related-card-title">{relatedPost.title}</h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA */}
                <section className="landing-cta">
                    <div className="landing-container">
                        <div className="landing-cta-content">
                            <h2 className="landing-cta-title">
                                Precisa de ajuda personalizada?
                            </h2>
                            <p className="landing-cta-description">
                                Marque uma consulta e receba um plano de cuidados
                                adaptado às necessidades do seu cabelo.
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
