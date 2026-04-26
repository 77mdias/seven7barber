import { Metadata } from 'next';

export interface SeoData {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

export function generateMetadata(data: SeoData): Metadata {
  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: data.ogImage ? [data.ogImage] : [],
      url: data.canonical,
    },
    alternates: {
      canonical: data.canonical,
    },
    ...(data.noIndex && { robots: { index: false, follow: false } }),
  };
}

// Page-specific metadata
export const pageMetadata: Record<string, SeoData> = {
  '/': {
    title: 'Seven7Barber | Barbearia Premium',
    description: 'Agende seu horário na melhor barbearia da cidade. Profissionais experientes, ambiente premium e serviços de excelência.',
    ogImage: '/og-image.jpg',
  },
  '/services': {
    title: 'Nossos Serviços | Seven7Barber',
    description: 'Conheça nossos serviços: corte masculino, barba, sobrancelha, pigmentação e muito mais. Preços acessíveis e qualidade premium.',
  },
  '/booking': {
    title: 'Agendar | Seven7Barber',
    description: 'Escolha o melhor horário para você. Seleccione os serviços, barbeiro e data disponível.',
  },
  '/dashboard': {
    title: 'Meu Painel | Seven7Barber',
    description: 'Acompanhe seus agendamentos e histórico de atendimentos.',
  },
  '/login': {
    title: 'Entrar | Seven7Barber',
    description: 'Faça login para gerenciar seus agendamentos.',
    noIndex: true,
  },
  '/register': {
    title: 'Criar Conta | Seven7Barber',
    description: 'Crie sua conta para agendar serviços.',
    noIndex: true,
  },
};
