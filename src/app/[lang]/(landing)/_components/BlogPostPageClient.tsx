"use client";

import Link from "next/link";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import type { Locale } from "@/i18n/config";
import type { Dictionary, BlogDictionary } from "@/i18n/dictionaries";
import { getLocalizedHash } from "@/i18n/routes";

interface BlogPostPageClientProps {
    lang: Locale;
    dict: Dictionary;
    slug: string;
}

type CategoryKey = keyof BlogDictionary["filters"]["categories"];

interface BlogPost {
    title: Record<Locale, string>;
    content: Record<Locale, string>;
    category: CategoryKey;
    date: string;
    readTime: string;
    image: string;
}

const blogPostsContent: Record<string, BlogPost> = {
    "como-cuidar-cabelos-cacheados": {
        title: {
            pt: "Como cuidar de cabelos cacheados no inverno",
            fr: "Comment prendre soin des cheveux bouclés en hiver"
        },
        content: {
            pt: `
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
            fr: `
                <p>L'hiver peut être une période difficile pour ceux qui ont les cheveux bouclés. L'air froid et sec a tendance à retirer l'humidité naturelle des cheveux, les laissant plus secs, cassants et avec des frisottis.</p>

                <h2>Pourquoi les boucles souffrent-elles davantage en hiver ?</h2>
                <p>Les cheveux bouclés ont une structure différente des cheveux lisses. La courbure des cheveux rend difficile la distribution de l'huile naturelle du cuir chevelu jusqu'aux pointes, les rendant naturellement plus secs.</p>
                <p>Pendant l'hiver, ce problème s'intensifie en raison de :</p>
                <ul>
                    <li>La faible humidité de l'air</li>
                    <li>L'utilisation d'eau chaude pendant la douche</li>
                    <li>Le chauffage central dans les espaces fermés</li>
                    <li>L'utilisation de bonnets et écharpes qui causent des frictions</li>
                </ul>

                <h2>Conseils essentiels pour l'hiver</h2>

                <h3>1. Hydratation profonde hebdomadaire</h3>
                <p>Intensifiez l'hydratation pendant l'hiver. Un masque d'hydratation profonde hebdomadaire est essentiel pour restaurer l'humidité perdue.</p>

                <h3>2. Évitez l'eau très chaude</h3>
                <p>Aussi tentant qu'un bain chaud puisse être en hiver, l'eau à température élevée élimine les huiles naturelles des cheveux. Optez pour de l'eau tiède et terminez avec de l'eau froide pour sceller les cuticules.</p>

                <h3>3. Utilisez des huiles naturelles</h3>
                <p>Les huiles comme la noix de coco, l'argan ou l'avocat sont excellentes pour créer une barrière protectrice sur les cheveux. Appliquez quelques gouttes sur les pointes après le lavage.</p>

                <h3>4. Protégez vos cheveux du froid</h3>
                <p>Lorsque vous portez des bonnets, préférez ceux en satin ou doublez votre bonnet avec un foulard en soie pour éviter les frictions et les frisottis.</p>

                <h3>5. Restez hydratée</h3>
                <p>L'hydratation commence de l'intérieur. Buvez beaucoup d'eau et maintenez une alimentation équilibrée, riche en oméga-3 et vitamines.</p>

                <h2>Recette maison d'hydratation</h2>
                <p>Une recette simple et efficace pour l'hiver :</p>
                <ul>
                    <li>2 cuillères à soupe d'huile d'olive</li>
                    <li>1 cuillère à soupe de miel</li>
                    <li>1 banane mûre écrasée</li>
                </ul>
                <p>Mélangez tous les ingrédients, appliquez sur les cheveux et laissez agir pendant 30 minutes. Rincez bien et lavez normalement.</p>

                <p>Avec ces soins, vos boucles resteront saines, hydratées et définies tout l'hiver !</p>
            `
        },
        category: "cuidados",
        date: "15 Jan 2024",
        readTime: "5 min",
        image: "/images/landing/clientes/IMG_7272.webp",
    },
    "beneficios-oleos-naturais": {
        title: {
            pt: "Os benefícios dos óleos naturais para o cabelo",
            fr: "Les bienfaits des huiles naturelles pour les cheveux"
        },
        content: {
            pt: `
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
            fr: `
                <p>Les huiles naturelles sont utilisées depuis des siècles pour prendre soin des cheveux. Riches en nutriments, vitamines et acides gras essentiels, elles sont de puissants alliés pour garder les cheveux sains et brillants.</p>

                <h2>Les meilleures huiles pour chaque type de cheveux</h2>

                <h3>Huile de Coco</h3>
                <p>L'huile de coco est l'une des plus polyvalentes. Elle pénètre profondément dans la fibre capillaire, nourrissant de l'intérieur vers l'extérieur. Idéale pour les cheveux secs et abîmés.</p>
                <p><strong>Comment l'utiliser :</strong> Appliquez sur les cheveux secs avant de dormir et lavez le matin, ou utilisez comme finisseur en petites quantités.</p>

                <h3>Huile d'Argan</h3>
                <p>Connue comme "l'or liquide", l'huile d'argan est riche en vitamine E et en antioxydants. Elle confère une brillance intense sans alourdir les cheveux.</p>
                <p><strong>Comment l'utiliser :</strong> Parfaite comme finisseur. Appliquez 2-3 gouttes sur les pointes des cheveux humides ou secs.</p>

                <h3>Huile de Ricin</h3>
                <p>Stimule la croissance des cheveux et renforce les fibres. Riche en acide ricinoléique aux propriétés anti-inflammatoires.</p>
                <p><strong>Comment l'utiliser :</strong> Massez le cuir chevelu et laissez agir au moins 2 heures avant de laver.</p>

                <h3>Huile d'Avocat</h3>
                <p>Extrêmement nutritive, riche en vitamines A, D et E. Pénètre facilement les cheveux, excellente pour les cheveux très secs.</p>
                <p><strong>Comment l'utiliser :</strong> Peut être utilisée dans des masques maison ou comme traitement pré-shampooing.</p>

                <h3>Huile de Jojoba</h3>
                <p>La composition la plus proche du sébum naturel du cuir chevelu. Idéale pour équilibrer la production de sébum.</p>
                <p><strong>Comment l'utiliser :</strong> Excellente pour les massages du cuir chevelu ou comme finisseur léger.</p>

                <h2>Conseils d'utilisation</h2>
                <ul>
                    <li>Chauffez légèrement l'huile avant l'application pour améliorer l'absorption</li>
                    <li>Moins c'est plus - commencez avec quelques gouttes et augmentez si nécessaire</li>
                    <li>Combinez différentes huiles pour obtenir plusieurs bienfaits</li>
                    <li>Choisissez toujours des huiles pures, pressées à froid et de qualité</li>
                </ul>

                <p>Intégrer des huiles naturelles dans votre routine capillaire est un geste simple qui peut faire toute la différence pour la santé et la beauté de vos cheveux !</p>
            `
        },
        category: "tratamentos",
        date: "10 Jan 2024",
        readTime: "7 min",
        image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&h=450&fit=crop",
    },
    "transicao-capilar-guia": {
        title: {
            pt: "Guia completo da transição capilar",
            fr: "Guide complet de la transition capillaire"
        },
        content: {
            pt: `
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

                <h2>Quanto tempo dura a transição?</h2>
                <p>Não há um tempo definido. Depende do comprimento que deseja atingir antes do big chop e da velocidade de crescimento do seu cabelo (em média 1-1,5cm por mês).</p>

                <p>Lembre-se: a transição capilar é também uma transição emocional. Seja paciente consigo mesma e celebre cada centímetro de cabelo natural que cresce!</p>
            `,
            fr: `
                <p>La transition capillaire est le processus d'abandon des traitements chimiques et de laisser pousser les cheveux naturels. C'est un voyage de découverte de soi et d'acceptation qui nécessite de la patience, mais les résultats sont transformateurs.</p>

                <h2>Qu'est-ce que la transition capillaire ?</h2>
                <p>C'est la période entre la dernière chimie (lissage, défrisage, permanente) et la coupe totale de la partie chimique. Pendant cette période, on vit avec deux textures différentes de cheveux.</p>

                <h2>Par où commencer ?</h2>

                <h3>1. Définissez votre objectif</h3>
                <p>Décidez si vous voulez faire une transition progressive (en laissant pousser) ou un big chop (coupe radicale). Les deux options sont valables et le choix doit respecter votre temps et votre confort.</p>

                <h3>2. Arrêtez les chimies</h3>
                <p>La première étape est d'arrêter définitivement tout traitement qui altère la structure du cheveu. Cela inclut les lissages, défrisages et progressives.</p>

                <h3>3. Investissez dans l'hydratation</h3>
                <p>Pendant la transition, la ligne de démarcation (où le cheveu naturel rencontre le chimique) est fragile et sujette à la casse. Des hydratations fréquentes sont essentielles.</p>

                <h2>Soins pendant la transition</h2>

                <h3>Programme capillaire</h3>
                <p>Suivez un programme équilibré de :</p>
                <ul>
                    <li><strong>Hydratation :</strong> Restaure l'eau dans les cheveux</li>
                    <li><strong>Nutrition :</strong> Restaure les lipides avec des huiles et beurres</li>
                    <li><strong>Reconstruction :</strong> Restaure la protéine (kératine)</li>
                </ul>

                <h3>Coiffures protectrices</h3>
                <p>Les tresses, chignons et twists aident à camoufler les deux textures et protègent les cheveux d'une manipulation excessive.</p>

                <h3>Coupes régulières</h3>
                <p>Coupez progressivement les pointes chimiques. Cela aide à réduire la différence entre les textures et garde les cheveux sains.</p>

                <h2>Combien de temps dure la transition ?</h2>
                <p>Il n'y a pas de durée définie. Cela dépend de la longueur que vous souhaitez atteindre avant le big chop et de la vitesse de croissance de vos cheveux (en moyenne 1-1,5cm par mois).</p>

                <p>Rappelez-vous : la transition capillaire est aussi une transition émotionnelle. Soyez patiente avec vous-même et célébrez chaque centimètre de cheveu naturel qui pousse !</p>
            `
        },
        category: "transicao",
        date: "5 Jan 2024",
        readTime: "10 min",
        image: "/images/landing/clientes/WhatsApp+Image+2024-11-27+at+17.57.22.webp",
    },
    "receitas-caseiras-hidratacao": {
        title: {
            pt: "5 receitas caseiras para hidratação profunda",
            fr: "5 recettes maison pour une hydratation profonde"
        },
        content: {
            pt: `
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
            fr: `
                <p>Pas besoin de dépenser des fortunes en produits pour avoir des cheveux hydratés et sains. Votre cuisine regorge d'ingrédients puissants pour créer des masques capillaires efficaces !</p>

                <h2>1. Masque Avocat et Miel</h2>
                <p><strong>Idéal pour :</strong> Cheveux très secs et abîmés</p>
                <p><strong>Ingrédients :</strong></p>
                <ul>
                    <li>1 avocat mûr</li>
                    <li>2 cuillères à soupe de miel</li>
                    <li>1 cuillère à soupe d'huile d'olive</li>
                </ul>
                <p><strong>Préparation :</strong> Écrasez bien l'avocat et mélangez avec le miel et l'huile d'olive jusqu'à obtenir une pâte homogène. Appliquez sur cheveux humides, laissez agir 30 minutes et rincez bien.</p>

                <h2>2. Masque Banane et Huile de Coco</h2>
                <p><strong>Idéal pour :</strong> Cheveux avec frisottis et sans brillance</p>
                <p><strong>Ingrédients :</strong></p>
                <ul>
                    <li>1 banane mûre</li>
                    <li>2 cuillères à soupe d'huile de coco</li>
                    <li>1 cuillère à soupe de miel</li>
                </ul>
                <p><strong>Préparation :</strong> Mixez tous les ingrédients jusqu'à obtenir une texture lisse (sans grumeaux !). Appliquez mèche par mèche, laissez 20-30 minutes et lavez normalement.</p>

                <h2>3. Masque au Yaourt Nature</h2>
                <p><strong>Idéal pour :</strong> Cheveux gras nécessitant une hydratation légère</p>
                <p><strong>Ingrédients :</strong></p>
                <ul>
                    <li>1 pot de yaourt nature (sans sucre)</li>
                    <li>1 cuillère à soupe de miel</li>
                </ul>
                <p><strong>Préparation :</strong> Mélangez les ingrédients et appliquez sur cheveux lavés et humides. Laissez 20 minutes et rincez à l'eau froide.</p>

                <h2>4. Masque Œuf et Huile d'Olive</h2>
                <p><strong>Idéal pour :</strong> Cheveux fragiles et cassants</p>
                <p><strong>Ingrédients :</strong></p>
                <ul>
                    <li>1 œuf entier</li>
                    <li>2 cuillères à soupe d'huile d'olive</li>
                    <li>1 cuillère à soupe de miel</li>
                </ul>
                <p><strong>Préparation :</strong> Battez l'œuf et mélangez les autres ingrédients. Appliquez sur les cheveux, laissez 20 minutes et rincez à l'eau FROIDE (important pour ne pas cuire l'œuf !).</p>

                <h2>5. Masque Papaye et Miel</h2>
                <p><strong>Idéal pour :</strong> Tous types de cheveux</p>
                <p><strong>Ingrédients :</strong></p>
                <ul>
                    <li>1/2 papaye mûre</li>
                    <li>2 cuillères à soupe de miel</li>
                    <li>1 cuillère à soupe d'huile de coco</li>
                </ul>
                <p><strong>Préparation :</strong> Mixez la papaye avec les autres ingrédients. Appliquez des racines aux pointes, laissez 30 minutes et lavez normalement.</p>

                <h2>Conseils importants</h2>
                <ul>
                    <li>Faites toujours un test d'allergie avant d'utiliser de nouveaux ingrédients</li>
                    <li>Utilisez des ingrédients frais et de qualité</li>
                    <li>Ne conservez pas les restes - préparez uniquement la quantité nécessaire</li>
                    <li>Utilisez une charlotte chauffante ou en plastique pour potentialiser les résultats</li>
                </ul>

                <p>Essayez ces recettes et découvrez celle qui fonctionne le mieux pour votre type de cheveux !</p>
            `
        },
        category: "receitas",
        date: "28 Dez 2023",
        readTime: "6 min",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=900&h=450&fit=crop",
    },
    "couro-cabeludo-saudavel": {
        title: {
            pt: "A importância de um couro cabeludo saudável",
            fr: "L'importance d'un cuir chevelu sain"
        },
        content: {
            pt: `
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

                <h2>Como cuidar do couro cabeludo</h2>

                <h3>1. Limpeza adequada</h3>
                <p>Lave o cabelo com a frequência adequada ao seu tipo. Use shampoos suaves e massaje bem o couro cabeludo com as pontas dos dedos (nunca com as unhas).</p>

                <h3>2. Esfoliação</h3>
                <p>Uma vez por semana, faça uma esfoliação suave para remover células mortas e resíduos de produtos.</p>

                <h3>3. Hidratação</h3>
                <p>Use tónicos e séruns específicos para o couro cabeludo. Óleos como o de jojoba e tea tree são excelentes para equilibrar.</p>

                <h3>4. Massagem</h3>
                <p>Massaje o couro cabeludo diariamente por alguns minutos. Isto estimula a circulação sanguínea e a chegada de nutrientes aos folículos.</p>

                <p>Cuidar do couro cabeludo é investir na saúde e beleza dos seus cabelos a longo prazo!</p>
            `,
            fr: `
                <p>Beaucoup de personnes se concentrent uniquement sur les cheveux, oubliant que la santé capillaire commence au niveau du cuir chevelu. Tout comme une plante a besoin d'un sol fertile pour pousser, nos cheveux ont besoin d'un cuir chevelu sain.</p>

                <h2>Pourquoi le cuir chevelu est-il si important ?</h2>
                <p>Le cuir chevelu abrite les follicules pileux - les structures qui produisent les cheveux. Un cuir chevelu sain :</p>
                <ul>
                    <li>Fournit des nutriments aux cheveux</li>
                    <li>Maintient un pH équilibré</li>
                    <li>Protège contre les infections</li>
                    <li>Régule la production de sébum</li>
                </ul>

                <h2>Problèmes courants du cuir chevelu</h2>

                <h3>Pellicules</h3>
                <p>Peuvent être causées par des champignons, le stress ou des produits inadaptés. Se manifestent par une desquamation visible et des démangeaisons.</p>

                <h3>Excès de sébum</h3>
                <p>Production excessive de sébum qui donne aux cheveux un aspect gras. Peut être aggravée par des lavages fréquents avec des produits agressifs.</p>

                <h3>Cuir chevelu sec</h3>
                <p>Sensation de tiraillement, desquamation fine et démangeaisons. Contrairement aux pellicules, les squames sont plus petites et plus sèches.</p>

                <h2>Comment prendre soin du cuir chevelu</h2>

                <h3>1. Nettoyage approprié</h3>
                <p>Lavez vos cheveux à la fréquence adaptée à votre type. Utilisez des shampooings doux et massez bien le cuir chevelu du bout des doigts (jamais avec les ongles).</p>

                <h3>2. Exfoliation</h3>
                <p>Une fois par semaine, faites une exfoliation douce pour éliminer les cellules mortes et les résidus de produits.</p>

                <h3>3. Hydratation</h3>
                <p>Utilisez des toniques et sérums spécifiques pour le cuir chevelu. Les huiles comme le jojoba et le tea tree sont excellentes pour équilibrer.</p>

                <h3>4. Massage</h3>
                <p>Massez votre cuir chevelu quotidiennement pendant quelques minutes. Cela stimule la circulation sanguine et l'apport de nutriments aux follicules.</p>

                <p>Prendre soin de son cuir chevelu, c'est investir dans la santé et la beauté de ses cheveux à long terme !</p>
            `
        },
        category: "saude",
        date: "20 Dez 2023",
        readTime: "4 min",
        image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&h=450&fit=crop",
    },
    "produtos-naturais-evitar-quimicos": {
        title: {
            pt: "Por que escolher produtos naturais?",
            fr: "Pourquoi choisir des produits naturels ?"
        },
        content: {
            pt: `
                <p>Cada vez mais pessoas estão a optar por produtos capilares naturais. Mas porquê? Quais são os ingredientes que devemos evitar e como fazer escolhas mais conscientes?</p>

                <h2>Ingredientes a evitar</h2>

                <h3>Sulfatos (SLS/SLES)</h3>
                <p>São detergentes agressivos responsáveis pela espuma abundante. Removem a oleosidade natural do cabelo, causando ressecamento e irritação do couro cabeludo.</p>

                <h3>Parabenos</h3>
                <p>Conservantes que podem interferir com o sistema hormonal. Aparecem nos rótulos como methylparaben, propylparaben, butylparaben.</p>

                <h3>Silicones insolúveis</h3>
                <p>Criam uma película nos fios que inicialmente dá brilho, mas com o tempo acumula-se e impede a entrada de nutrientes. Exemplos: dimethicone, cyclomethicone.</p>

                <h3>Petrolatos e óleos minerais</h3>
                <p>Derivados do petróleo que "sufocam" o fio. Aparecem como mineral oil, paraffinum liquidum, petrolatum.</p>

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

                <p>A transição para produtos naturais é um investimento na saúde do seu cabelo e do planeta. Vale a pena!</p>
            `,
            fr: `
                <p>De plus en plus de personnes optent pour des produits capillaires naturels. Mais pourquoi ? Quels sont les ingrédients à éviter et comment faire des choix plus conscients ?</p>

                <h2>Ingrédients à éviter</h2>

                <h3>Sulfates (SLS/SLES)</h3>
                <p>Ce sont des détergents agressifs responsables de la mousse abondante. Ils éliminent le sébum naturel des cheveux, causant dessèchement et irritation du cuir chevelu.</p>

                <h3>Parabènes</h3>
                <p>Conservateurs qui peuvent interférer avec le système hormonal. Apparaissent sur les étiquettes comme methylparaben, propylparaben, butylparaben.</p>

                <h3>Silicones insolubles</h3>
                <p>Créent un film sur les cheveux qui donne initialement de la brillance, mais avec le temps s'accumule et empêche l'entrée des nutriments. Exemples : dimethicone, cyclomethicone.</p>

                <h3>Pétrolatum et huiles minérales</h3>
                <p>Dérivés du pétrole qui "étouffent" le cheveu. Apparaissent comme mineral oil, paraffinum liquidum, petrolatum.</p>

                <h2>Avantages des produits naturels</h2>
                <ul>
                    <li>Moins d'irritation et d'allergies</li>
                    <li>Respect de l'équilibre naturel des cheveux</li>
                    <li>Ingrédients biodégradables</li>
                    <li>Durabilité environnementale</li>
                    <li>Résultats plus sains à long terme</li>
                </ul>

                <h2>Comment lire les étiquettes</h2>
                <p>Les ingrédients sont listés par ordre de concentration - les premiers de la liste sont les plus abondants. Recherchez des produits où les ingrédients naturels apparaissent au début de la liste.</p>

                <h2>Période d'adaptation</h2>
                <p>En passant aux produits naturels, les cheveux peuvent traverser une période d'adaptation de 2 à 4 semaines. C'est normal - les cheveux "détoxifient" des produits précédents.</p>

                <p>La transition vers les produits naturels est un investissement dans la santé de vos cheveux et de la planète. Ça en vaut la peine !</p>
            `
        },
        category: "produtos",
        date: "15 Dez 2023",
        readTime: "8 min",
        image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=900&h=450&fit=crop",
    },
};

export function BlogPostPageClient({ lang, dict, slug }: BlogPostPageClientProps) {
    const { common, blog } = dict;
    const contactHash = getLocalizedHash("contact", lang);
    const homePath = "/" + lang;
    const blogPath = "/" + lang + "/blog";

    const post = blogPostsContent[slug];

    // Função para obter a categoria traduzida
    const getCategoryLabel = (categoryKey: CategoryKey): string => {
        return blog.filters.categories[categoryKey] || categoryKey;
    };

    if (!post) {
        return (
            <>
                <Header lang={lang} dict={common} />
                <main>
                    <section className="landing-page-hero">
                        <div className="landing-container">
                            <h1 className="landing-page-title">{blog.error.notFound}</h1>
                            <p className="landing-page-subtitle">{blog.error.notFoundMessage}</p>
                            <Link href={blogPath} className="landing-btn landing-btn-primary">
                                {common.cta.backToBlog}
                            </Link>
                        </div>
                    </section>
                </main>
                <Footer lang={lang} dict={common} />
            </>
        );
    }

    return (
        <>
            <Header lang={lang} dict={common} />
            <main>
                <section className="landing-article-hero">
                    <div className="landing-container">
                        <div className="landing-article-meta-top">
                            <Link href={blogPath} className="landing-back-link">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                                </svg>
                                {common.cta.backToBlog}
                            </Link>
                        </div>
                        <span className="landing-article-category">{getCategoryLabel(post.category)}</span>
                        <h1 className="landing-article-title">{post.title[lang]}</h1>
                        <div className="landing-article-meta">
                            <span>{post.date}</span>
                            <span className="landing-meta-divider">•</span>
                            <span>{post.readTime} {blog.post.readTime}</span>
                        </div>
                    </div>
                </section>

                <section className="landing-article-image">
                    <div className="landing-container">
                        <img src={post.image} alt={post.title[lang]} />
                    </div>
                </section>

                <section className="landing-article-content">
                    <div className="landing-container">
                        <div className="landing-article-body" dangerouslySetInnerHTML={{ __html: post.content[lang] }} />
                    </div>
                </section>

                <section className="landing-article-author">
                    <div className="landing-container">
                        <div className="landing-author-card">
                            <div className="landing-author-avatar">
                                <img src="/images/landing/profile.webp" alt="Josianne Gomes" />
                            </div>
                            <div className="landing-author-info">
                                <span className="landing-author-label">{blog.article.writtenBy}</span>
                                <h3 className="landing-author-name">Josianne Gomes</h3>
                                <p className="landing-author-bio">{blog.article.authorBio}</p>
                            </div>
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
