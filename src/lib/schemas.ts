export const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://ronitjadhav.github.io/ronit.io',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Journey',
      item: 'https://ronitjadhav.github.io/ronit.io#journey',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Projects',
      item: 'https://ronitjadhav.github.io/ronit.io#projects',
    },
  ],
};

export const portfolioSchema = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: 'Ronit Jadhav Portfolio',
  description:
    'Professional portfolio showcasing geospatial development and software engineering projects',
  author: {
    '@type': 'Person',
    name: 'Ronit Jadhav',
  },
  url: 'https://ronitjadhav.github.io/ronit.io',
  dateCreated: '2024',
  inLanguage: 'en-US',
  audience: {
    '@type': 'Audience',
    audienceType: 'Employers, Clients, Recruiters',
  },
};
