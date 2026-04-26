export default function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Seven7Barber',
    description: 'Barbearia premium com serviços de corte masculino, barba e pigmentação.',
    image: 'https://seven7barber.com/og-image.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua Exemplo, 123',
      addressLocality: 'Cidade',
      addressRegion: 'Estado',
      postalCode: '12345-678',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.5505,
      longitude: -46.6333,
    },
    telephone: '+55-11-99999-9999',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    priceRange: '$$',
    sameAs: [
      'https://instagram.com/seven7barber',
      'https://facebook.com/seven7barber',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
