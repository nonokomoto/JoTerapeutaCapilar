import type { Locale } from './config';

// Tipos para os dicionários
export interface CommonDictionary {
  nav: {
    about: string;
    gallery: string;
    blog: string;
    contact: string;
    clientArea: string;
  };
  footer: {
    navigation: string;
    links: string;
    socialMedia: string;
    copyright: string;
  };
  logo: {
    subtitle: string;
  };
  languageSwitcher: {
    pt: string;
    fr: string;
  };
  cta: {
    bookConsultation: string;
    learnMore: string;
    contact: string;
    viewGallery: string;
    viewPosts: string;
    sendMessage: string;
    readMore: string;
    backToBlog: string;
  };
}

export interface HomeDictionary {
  hero: {
    label: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    scroll: string;
  };
  features: {
    label: string;
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  about: {
    label: string;
    name: string;
    paragraphs: string[];
    quote: string;
  };
  gallery: {
    label: string;
    title: string;
    images: Array<{
      alt: string;
    }>;
  };
  blog: {
    label: string;
    title: string;
    description: string;
  };
  contact: {
    label: string;
    title: string;
    description: string;
    phone: string;
    email: string;
    whatsapp: string;
    whatsappAction: string;
    form: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      subject: string;
      subjectPlaceholder: string;
      message: string;
      messagePlaceholder: string;
    };
  };
}

export interface AboutDictionary {
  hero: {
    label: string;
    title: string;
    paragraphs: string[];
    quote: string;
  };
  ingredients: {
    label: string;
    title: string;
    description: string;
    items: Array<{
      name: string;
      description: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
  };
}

export interface GalleryDictionary {
  hero: {
    label: string;
    title: string;
    subtitle: string;
  };
  lightbox: {
    close: string;
    imageAlt: string;
  };
  cta: {
    title: string;
    description: string;
  };
}

export interface BlogDictionary {
  hero: {
    label: string;
    title: string;
    subtitle: string;
  };
  filters: {
    all: string;
    categories: {
      cuidados: string;
      tratamentos: string;
      transicao: string;
      receitas: string;
      saude: string;
      produtos: string;
    };
  };
  post: {
    readTime: string;
  };
  article: {
    writtenBy: string;
    authorBio: string;
    relatedPosts: string;
  };
  error: {
    notFound: string;
    notFoundMessage: string;
  };
  cta: {
    title: string;
    description: string;
  };
}

export interface Dictionary {
  common: CommonDictionary;
  home: HomeDictionary;
  about: AboutDictionary;
  gallery: GalleryDictionary;
  blog: BlogDictionary;
}

// Importação dinâmica dos dicionários
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pt: async () => {
    const [common, home, about, gallery, blog] = await Promise.all([
      import('./dictionaries/pt/common.json'),
      import('./dictionaries/pt/home.json'),
      import('./dictionaries/pt/about.json'),
      import('./dictionaries/pt/gallery.json'),
      import('./dictionaries/pt/blog.json'),
    ]);
    return {
      common: common.default,
      home: home.default,
      about: about.default,
      gallery: gallery.default,
      blog: blog.default,
    };
  },
  fr: async () => {
    const [common, home, about, gallery, blog] = await Promise.all([
      import('./dictionaries/fr/common.json'),
      import('./dictionaries/fr/home.json'),
      import('./dictionaries/fr/about.json'),
      import('./dictionaries/fr/gallery.json'),
      import('./dictionaries/fr/blog.json'),
    ]);
    return {
      common: common.default,
      home: home.default,
      about: about.default,
      gallery: gallery.default,
      blog: blog.default,
    };
  },
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export async function getCommonDictionary(locale: Locale): Promise<CommonDictionary> {
  const dict = await getDictionary(locale);
  return dict.common;
}

export async function getHomeDictionary(locale: Locale): Promise<HomeDictionary> {
  const dict = await getDictionary(locale);
  return dict.home;
}

export async function getAboutDictionary(locale: Locale): Promise<AboutDictionary> {
  const dict = await getDictionary(locale);
  return dict.about;
}

export async function getGalleryDictionary(locale: Locale): Promise<GalleryDictionary> {
  const dict = await getDictionary(locale);
  return dict.gallery;
}

export async function getBlogDictionary(locale: Locale): Promise<BlogDictionary> {
  const dict = await getDictionary(locale);
  return dict.blog;
}
