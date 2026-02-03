import { Helmet } from 'react-helmet-async'

const SEO = ({
  title = 'Star Limpiezas | Servicios de Limpieza Profesionales en Girona y Costa Brava',
  description = 'Empresa de limpieza profesional en Girona y Costa Brava. Limpieza de hogares, Airbnb, comunidades, oficinas, restaurantes y servicios forestales. Presupuesto sin compromiso.',
  keywords = 'limpieza Girona, limpieza Costa Brava, limpieza Airbnb, limpieza comunidades, limpieza oficinas, limpieza restaurantes, servicios forestales, poda árboles, prevención incendios, Mont-ras, Baix Empordà',
  image = '/logo.png',
  url = 'https://starlimpiezas.es',
  type = 'website',
  schema = null
}) => {
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`
  
  return (
    <Helmet>
      {/* Meta tags básicos */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Star Limpiezas" />
      <link rel="canonical" href={url} />
      
      {/* Geo tags */}
      <meta name="geo.region" content="ES-GI" />
      <meta name="geo.placename" content="Mont-ras, Girona" />
      <meta name="geo.position" content="41.9167;3.1333" />
      <meta name="ICBM" content="41.9167, 3.1333" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Star Limpiezas" />
      <meta property="og:locale" content="es_ES" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@starlimpiezas" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* Schema.org datos estructurados */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  )
}

// Schema para LocalBusiness
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Star Limpiezas',
  description: 'Empresa de limpieza profesional en Girona y Costa Brava. Servicios de limpieza para hogares, Airbnb, comunidades, oficinas, restaurantes y servicios forestales.',
  url: 'https://starlimpiezas.es',
  logo: 'https://starlimpiezas.es/logo.png',
  image: 'https://starlimpiezas.es/logo.png',
  telephone: '+34643513174',
  email: 'info@starlimpiezas.com',
  priceRange: '€€',
  paymentAccepted: 'Efectivo, Transferencia Bancaria',
  currenciesAccepted: 'EUR',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avinguda de la Marina, S/N',
    addressLocality: 'Mont-ras',
    addressRegion: 'Girona',
    postalCode: '17230',
    addressCountry: 'ES'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '41.9167',
    longitude: '3.1333'
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '20:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '09:00',
      closes: '14:00'
    }
  ],
  areaServed: {
    '@type': 'Place',
    name: 'Girona y alrededores'
  },
  serviceType: [
    'Limpieza de hogares',
    'Limpieza Airbnb',
    'Limpieza de comunidades',
    'Limpieza de oficinas',
    'Limpieza de restaurantes',
    'Servicios forestales',
    'Poda de árboles',
    'Prevención de incendios',
    'Limpieza de cristales',
    'Limpieza de garajes'
  ],
  sameAs: [
    'https://www.facebook.com/starlimpiezas',
    'https://www.instagram.com/starlimpiezas',
    'https://wa.me/34643513174'
  ]
}

// Schema para WebSite con SearchAction
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Star Limpiezas',
  url: 'https://starlimpiezas.es',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://starlimpiezas.es/reservas?servicio={search_term_string}',
      actionPlatform: [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform'
      ]
    },
    'query-input': 'required name=search_term_string'
  }
}

// Schema para BreadcrumbList
export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})

export default SEO
