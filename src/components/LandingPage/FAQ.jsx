"use client"

import { useState } from "react"
import { Helmet } from "react-helmet-async"

const faqs = [
  {
    question: "¿Qué servicios de limpieza ofrecen?",
    answer: "Star Limpiezas ofrece servicios de limpieza profesional en toda la provincia de Girona y sus alrededores: limpieza de hogares y casas particulares, limpieza de propiedades Airbnb y turísticas, limpieza de comunidades de vecinos, limpieza de oficinas y locales comerciales, limpieza de restaurantes y establecimientos de hostelería, limpieza profesional de cristales, limpieza de garajes comunitarios y privados, y servicios de mantenimiento forestal (mantenimiento de terrenos, poda de árboles, prevención de incendios)."
  },
  {
    question: "¿En qué zonas de Girona trabajan?",
    answer: "Prestamos servicios en toda la provincia de Girona y sus alrededores. Nuestra sede está en Mont-ras, Baix Empordà, y cubrimos las comarcas del Gironès, Baix Empordà, Alt Empordà, Selva, Pla de l'Estany, La Garrotxa y toda la Costa Brava. Consultar disponibilidad para zonas específicas."
  },
  {
    question: "¿Cuánto cuesta un servicio de limpieza?",
    answer: "Los precios varían según el tipo de servicio, metros cuadrados, estado del espacio y frecuencia. Ofrecemos presupuestos personalizados sin compromiso. Aceptamos efectivo y transferencia bancaria. Contáctanos al 643 513 174 o solicita tu presupuesto online."
  },
  {
    question: "¿Ofrecen limpieza de propiedades Airbnb?",
    answer: "Sí, somos especialistas en limpieza de Airbnb y propiedades turísticas en toda Girona. Nuestro servicio incluye: limpieza completa entre huéspedes, reposición de amenities, servicio de lavandería profesional, entrega de llaves y check-in, e inspección de calidad. Garantizamos tiempos de respuesta rápidos para maximizar la disponibilidad de tu propiedad."
  },
  {
    question: "¿Realizan poda de árboles y mantenimiento forestal?",
    answer: "Sí, ofrecemos servicios forestales profesionales en toda la provincia de Girona: mantenimiento de terrenos con técnicas sostenibles, poda técnica de árboles con evaluación de salud arbórea, y prevención de incendios forestales incluyendo limpieza de maleza, creación de cortafuegos y asesoramiento en gestión de riesgos."
  },
  {
    question: "¿Hacen limpieza de restaurantes y hostelería?",
    answer: "Sí, ofrecemos limpieza completa para restaurantes y establecimientos de hostelería: limpieza de cocinas profesionales con desengrase profundo, limpieza de salones y comedores, desengrase de campanas extractoras, limpieza de equipos industriales, y cumplimiento de normativas sanitarias."
  },
  {
    question: "¿Prestan servicios de limpieza de comunidades?",
    answer: "Sí, prestamos servicios de limpieza para comunidades de vecinos: limpieza de zonas comunes (escaleras, pasillos, ascensores), mantenimiento de instalaciones, limpieza de áreas recreativas, tratamiento de garajes comunitarios, y supervisión de calidad con reportes detallados."
  },
  {
    question: "¿Cómo puedo solicitar un presupuesto?",
    answer: "Puedes solicitar tu presupuesto de varias formas: llamándonos al 643 513 174, escribiéndonos por WhatsApp, solicitando presupuesto online en nuestra web, o enviándonos un email a info@starlimpiezas.com. Te responderemos en menos de 24 horas."
  },
  {
    question: "¿Tienen disponibilidad los fines de semana?",
    answer: "Nuestro horario habitual es de lunes a viernes de 8:00 a 20:00 horas. Los sábados atendemos de 9:00 a 14:00 horas para servicios urgentes. Para limpiezas de Airbnb y propiedades turísticas, ofrecemos disponibilidad flexible para adaptarnos a los check-outs y check-ins."
  },
  {
    question: "¿Utilizan productos respetuosos con el medio ambiente?",
    answer: "Sí, en Star Limpiezas apostamos por la sostenibilidad. Utilizamos productos de limpieza biodegradables y técnicas sostenibles. Nuestros servicios forestales están diseñados para preservar el medio ambiente local de Girona."
  },
  {
    question: "¿Ofrecen contratos de mantenimiento regular?",
    answer: "Sí, disponemos de contratos de mantenimiento regular para hogares, comunidades, oficinas y restaurantes. Estas opciones incluyen visitas programadas semanales, quincenales o mensuales con precios especiales y prioridad en la agenda."
  },
  {
    question: "¿Hacen limpieza de cristales en altura?",
    answer: "Sí, realizamos limpieza profesional de cristales para viviendas, oficinas y locales comerciales. Utilizamos técnicas avanzadas para eliminar manchas y residuos, garantizando resultados impecables sin rayas. Consultar para trabajos en altura que requieran equipamiento especial."
  }
]

// Schema FAQPage
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <>
      <Helmet>
        <title>Preguntas Frecuentes | Star Limpiezas</title>
        <meta name="description" content="Preguntas frecuentes sobre nuestros servicios de limpieza en Girona. Información sobre precios, zonas de servicio, Airbnb, comunidades, restaurantes y mantenimiento forestal." />
        <link rel="canonical" href="https://starlimpiezas.es/faq" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
    
      <section id="faq" className="faq-section">
        <div className="faq-container">
          <header className="faq-header">
            <span className="faq-badge">Preguntas Frecuentes</span>
            <h1 className="faq-title">Todo lo que necesitas saber sobre nuestros servicios</h1>
            <p className="faq-description">
              Encuentra respuestas a las preguntas más frecuentes sobre nuestros servicios de limpieza en Girona
            </p>
          </header>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <article 
                key={index} 
                className={`faq-item ${openIndex === index ? 'open' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  aria-expanded={openIndex === index}
                >
                  <span>{faq.question}</span>
                  <span className="faq-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
                <div 
                  className="faq-answer"
                  style={{ maxHeight: openIndex === index ? '500px' : '0' }}
                >
                  <p>{faq.answer}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="faq-cta">
            <p>¿No encuentras lo que buscas?</p>
            <a href="https://wa.me/34643513174" className="faq-whatsapp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contáctanos por WhatsApp
            </a>
          </div>
        </div>

        <style>{`
          .faq-section {
            padding: 6rem 2rem;
            background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          }

          .faq-container {
            max-width: 900px;
            margin: 0 auto;
          }

          .faq-header {
            text-align: center;
            margin-bottom: 4rem;
          }

          .faq-badge {
            display: inline-block;
            padding: 0.5rem 1.5rem;
            background: #0A0A0A;
            color: white;
            border-radius: 100px;
            font-size: 0.875rem;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-bottom: 1.5rem;
          }

          .faq-title {
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 800;
            color: #0A0A0A;
            margin: 0 0 1rem;
            letter-spacing: -0.02em;
            line-height: 1.2;
          }

          .faq-description {
            font-size: 1.125rem;
            color: #666;
            line-height: 1.6;
            margin: 0;
          }

          .faq-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .faq-item {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            transition: box-shadow 0.3s ease;
          }

          .faq-item:hover {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }

          .faq-item.open {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
          }

          .faq-question {
            width: 100%;
            padding: 1.5rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            background: none;
            border: none;
            cursor: pointer;
            text-align: left;
            font-size: 1.1rem;
            font-weight: 600;
            color: #0A0A0A;
            transition: color 0.3s ease;
          }

          .faq-question:hover {
            color: #2563eb;
          }

          .faq-icon {
            flex-shrink: 0;
            transition: transform 0.3s ease;
            color: #666;
          }

          .faq-item.open .faq-icon {
            transform: rotate(180deg);
          }

          .faq-answer {
            overflow: hidden;
            transition: max-height 0.4s ease;
          }

          .faq-answer p {
            padding: 0 2rem 1.5rem;
            margin: 0;
            color: #4A4A4A;
            line-height: 1.8;
            font-size: 1rem;
          }

          .faq-cta {
            text-align: center;
            margin-top: 3rem;
            padding-top: 3rem;
            border-top: 1px solid #E5E5E5;
          }

          .faq-cta p {
            margin: 0 0 1rem;
            color: #666;
            font-size: 1rem;
          }

          .faq-whatsapp {
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 2rem;
            background: #25D366;
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .faq-whatsapp:hover {
            background: #128C7E;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);
          }

          @media (max-width: 768px) {
            .faq-section {
              padding: 4rem 1rem;
            }

            .faq-question {
              padding: 1.25rem 1.5rem;
              font-size: 1rem;
            }

            .faq-answer p {
              padding: 0 1.5rem 1.25rem;
            }
          }
        `}</style>
      </section>
    </>
  )
}

export default FAQ
