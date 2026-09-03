/* =============================================================================
   CONFIGURAÇÃO DO SITE — troque por cliente
   -----------------------------------------------------------------------------
   Este arquivo concentra textos, contatos, redes sociais e imagens das seções
   institucionais. Os IMÓVEIS ficam no painel (/admin) e no seed de exemplo
   (src/data/seedProperties.ts).

   Imagens: use URLs http(s). Nas seções institucionais estão fotos do Unsplash
   apenas como referência — substitua pelas fotos reais do cliente.
   ========================================================================== */

export interface SiteConfig {
  brand: {
    name: string
    shortName: string
    role: string
    creci: string
    /** Sobrescreve cores da marca em runtime (opcional). Deixe undefined p/ usar theme.css */
    theme?: {
      brand?: string
      brandStrong?: string
      brandInk?: string
      accent?: string
      accentStrong?: string
      accentInk?: string
    }
  }

  contact: {
    phoneDisplay: string
    /** Somente dígitos com DDI. Ex.: 5511999998888 */
    whatsapp: string
    email: string
    addressLine: string
    city: string
    hours: string
  }

  social: {
    instagram?: string
    facebook?: string
    linkedin?: string
    youtube?: string
  }

  hero: {
    eyebrow: string
    titleLead: string
    titleEmphasis: string
    titleTail: string
    subtitle: string
    primaryCta: { label: string; href: string }
    secondaryCta: { label: string; href: string }
    image: string
  }

  about: {
    eyebrow: string
    title: string
    portrait: string
    /** 1º parágrafo aparece na home (versão curta); todos aparecem em /sobre. */
    paragraphs: string[]
    signature: string
    highlights: { value: string; label: string }[]
  }

  services: {
    eyebrow: string
    title: string
    intro: string
    items: { title: string; description: string }[]
  }

  regions: {
    eyebrow: string
    title: string
    intro: string
    items: { name: string; blurb: string; image: string }[]
  }

  cta: {
    title: string
    text: string
    buttonLabel: string
  }

  /* ---------------------------------------------------------------------------
     PAINEL RESTRITO — apenas demonstração.
     Sem backend, a autenticação é local (fica salva no navegador).
     Ao ligar um backend real, troque isto por login de verdade.
     ------------------------------------------------------------------------- */
  admin: {
    username: string
    password: string
    /** Frase exibida na tela de login. */
    hint: string
  }
}

export const site: SiteConfig = {
  brand: {
    name: 'Marina Alcântara',
    shortName: 'M. Alcântara',
    role: 'Corretora de Imóveis',
    creci: 'CRECI-SP 123.456-F',
    theme: undefined,
  },

  contact: {
    phoneDisplay: '(42) 99965-5468',
    whatsapp: '5542999655468',
    email: 'nexttec.digital@gmail.com',
    addressLine: 'Rua dos Jacarandás, 210 · Jardim Europa',
    city: 'São Paulo · SP',
    hours: 'Seg a Sáb, 9h às 19h · visitas com hora marcada',
  },

  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    youtube: '',
  },

  hero: {
    eyebrow: 'Curadoria imobiliária de alto padrão',
    titleLead: 'A casa certa',
    titleEmphasis: 'não se procura',
    titleTail: '— se reconhece.',
    subtitle:
      'Assessoria completa na compra e venda de residências, coberturas e terrenos exclusivos, com discrição, método e cuidado em cada detalhe.',
    primaryCta: { label: 'Ver imóveis disponíveis', href: '/imoveis' },
    secondaryCta: { label: 'Conversar no WhatsApp', href: '#whatsapp' },
    image:
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2000&q=80',
  },

  about: {
    eyebrow: 'Quem conduz',
    title: 'Cada negociação, acompanhada de perto',
    portrait:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1000&q=80',
    paragraphs: [
      'Trabalho com imóveis desde 2007 e conduzo pessoalmente cada negociação — da primeira visita à escritura. Atendo poucos clientes por vez, sempre com transparência na avaliação, no preço e na documentação.',
      'Meu papel é reduzir ruído: apresentar só o que faz sentido para você e cuidar do resto.',
    ],
    signature: 'Marina Alcântara',
    highlights: [
      { value: '18', label: 'anos de experiência' },
      { value: '97%', label: 'clientes por indicação' },
      { value: '41', label: 'dias — média para vender' },
    ],
  },

  services: {
    eyebrow: 'Como eu ajudo',
    title: 'Assessoria do começo ao fim',
    intro:
      'Um processo claro, sem surpresas, para quem vai comprar ou vender um imóvel de valor.',
    items: [
      {
        title: 'Venda com estratégia',
        description:
          'Avaliação de mercado, preparação do imóvel, fotos profissionais e um plano de divulgação segmentado para o público certo.',
      },
      {
        title: 'Busca personalizada',
        description:
          'Você descreve o que precisa e recebe uma seleção curada — inclusive imóveis fora dos portais, em negociação reservada.',
      },
      {
        title: 'Documentação e due diligence',
        description:
          'Análise de matrícula, certidões, regularidade e condomínio antes de qualquer proposta. Segurança jurídica primeiro.',
      },
      {
        title: 'Negociação e fechamento',
        description:
          'Condução da proposta, contraproposta, contrato e financiamento, com acompanhamento até a entrega das chaves.',
      },
    ],
  },

  regions: {
    eyebrow: 'Onde atuo',
    title: 'Regiões de atuação',
    intro:
      'Conhecimento de rua a rua nos bairros onde a localização faz toda a diferença.',
    items: [
      {
        name: 'Jardins',
        blurb: 'Ruas arborizadas, comércio sofisticado e imóveis clássicos.',
        image:
          'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Vila Nova Conceição',
        blurb: 'Prédios contemporâneos a poucos passos do Parque Ibirapuera.',
        image:
          'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Alto de Pinheiros',
        blurb: 'Casas com quintal, silêncio e verde perto do rio.',
        image:
          'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80',
      },
      {
        name: 'Itaim Bibi',
        blurb: 'Vida urbana, gastronomia e imóveis compactos bem resolvidos.',
        image:
          'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },

  cta: {
    title: 'Vamos conversar sobre o seu próximo endereço?',
    text: 'Conte o que você procura ou o que pretende vender. Respondo pessoalmente em até um dia útil.',
    buttonLabel: 'Falar com a Marina',
  },

  admin: {
    username: 'admin',
    password: 'imoveis2025',
    hint: 'Área de demonstração — acesso local, sem servidor.',
  },
}

export default site
