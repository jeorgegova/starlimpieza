"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import img2 from "../../assets/img2.png"
import img3 from "../../assets/img3.png"
import img4 from "../../assets/img4.png"
import img5 from "../../assets/img5.png"
import img6 from "../../assets/img6.png"
import img7 from "../../assets/img7.png"
import deepHouseCleaning from "../../assets/deep-house-cleaning-professional.jpg"
import regularHomeCleaning from "../../assets/regular-home-cleaning-service.jpg"
import homeMaintenanceCleaning from "../../assets/home-maintenance-cleaning.jpg"
import airbnbKeyHandover from "../../assets/airbnb-key-handover-service.jpg"
import vacationRentalTurnover from "../../assets/vacation-rental-turnover-cleaning.jpg"
import professionalLaundry from "../../assets/professional-laundry-service-hotel.jpg"
import ecologicalForestMaintenance from "../../assets/ecological-forest-maintenance.jpg"
import professionalTreePruning from "../../assets/professional-tree-pruning-service.jpg"
import forestFirePrevention from "../../assets/forest-fire-prevention-clearing.jpg"
import residentialWindowCleaning from "../../assets/residential-window-cleaning-home.jpg"
import officeWindowCleaning from "../../assets/office-window-cleaning-professional.jpg"
import commercialStorefrontWindowCleaning from "../../assets/commercial-storefront-window-cleaning.jpg"
import communityParkingGarageCleaning from "../../assets/community-parking-garage-cleaning.jpg"
import privateGarageCleaning from "../../assets/private-garage-cleaning-service.jpg"
import restaurantHoodDegreasingService from "../../assets/restaurant-hood-degreasing-service.jpg"
import femaleCookCleaning from "../../assets/female-cook-cleaning.jpg"
import limpiezaZonasComunes from "../../assets/Limpieza-de-zonas-comunes.jpg"
import mantenimientoInstalaciones from "../../assets/Mantenimiento-e-Instalaciones.jpg"
import supervisionCalidad from "../../assets/Supervision-de-calidad.jpg"
import restaurantDiningAreaCleaning from "../../assets/restaurant-dining-area-cleaning.jpg"
import garagePestControl from "../../assets/garage-pest-control-treatment.jpg"
import img8 from "../../assets/img8.png"

const Services = () => {
  const navigate = useNavigate()
  const [modalService, setModalService] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const sectionRefs = useRef([])


  const services = [
    {
      id: 1,
      title: "Limpieza de casas",
      image: img8,
      description:
        "Ofrecemos servicios integrales de limpieza para hogares, incluyendo limpieza a fondo, general y de mantenimiento. Utilizamos tecnología avanzada y productos eco-friendly para garantizar un ambiente saludable y brillante.",
      color: "#64748b",
      gradient: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
      tag: "Hogar",
    },
    {
      id: 2,
      title: "Turismo & Airbnb",
      image: img2,
      description:
        "Especializados en limpieza entre huéspedes para propiedades de turismo y Airbnb. Incluye entrega de llaves, cambios turísticos, servicio de lavandería profesional y compras a domicilio.",
      color: "#8b5cf6",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      tag: "Turismo",
    },
    {
      id: 3,
      title: "Servicios Forestales",
      image: img3,
      description:
        "Servicios forestales que incluyen mantenimiento ecológico, poda de árboles y prevención de incendios. Utilizamos equipo especializado para preservar el medio ambiente.",
      color: "#059669",
      gradient: "linear-gradient(135deg, #059669 0%, #047857 100%)",
      tag: "Ecológico",
    },
    {
      id: 4,
      title: "Limpiezas de Cristales",
      image: img4,
      description:
        "Limpieza profesional de cristales utilizando técnicas nanotecnológicas avanzadas para eliminar manchas y residuos de manera efectiva. Garantizamos resultados impecables y duraderos.",
      color: "#0284c7",
      gradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
      tag: "Profesional",
    },
    {
      id: 5,
      title: "Limpiezas de Garajes",
      image: img5,
      description:
        "Siempre disponibles para una limpieza impecable de garajes comunitarios y privados. Incluye eliminación profunda de polvo, grasa y residuos, además de tratamientos antiparasitarios.",
      color: "#dc2626",
      gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
      tag: "Comunidad",
    },
    {
      id: 6,
      title: "Limpieza de Restaurantes",
      image: img6,
      description:
        "El brillo no solo está en el plato. Ofrecemos limpieza especializada para restaurantes, incluyendo cocinas, salones, equipos de ventilación y desengrase de campanas.",
      color: "#ea580c",
      gradient: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
      tag: "Hostelería",
    },
    {
      id: 7,
      title: "Comunidades",
      image: img7,
      description:
        "No limpie, solo llámenos. Servicios de limpieza para comunidades de vecinos, incluyendo zonas comunes, mantenimiento de instalaciones y supervisión de calidad.",
      color: "#7c2d12",
      gradient: "linear-gradient(135deg, #92400e 0%, #78350f 100%)",
      tag: "Residencial",
    },
  ]

  const getModalContent = (service) => {
    const contents = {
      1: {
        title: "Limpieza en casa particulares",
        subsections: [
          {
            title: "Limpieza a Fondo",
            description:
              "Nuestro servicio de limpieza a fondo es ideal para aquellos momentos en que tu hogar necesita una atención especial. Nos encargamos de cada rincón, desde techos hasta zócalos, eliminando la suciedad acumulada y dejando tu casa como nueva.",
            image: deepHouseCleaning,
            features: [
              "Limpieza profunda de todas las habitaciones",
              "Desinfección de baños y cocina",
              "Limpieza de ventanas y marcos",
              "Aspirado y fregado de suelos",
            ],
          },
          {
            title: "Limpieza General",
            description:
              "El servicio de limpieza general es perfecto para el mantenimiento regular de tu hogar. Incluye todas las tareas esenciales para mantener tu casa limpia y ordenada, adaptándonos a tus necesidades y horarios.",
            image: regularHomeCleaning,
            features: [
              "Limpieza de superficies y muebles",
              "Organización de espacios",
              "Limpieza de cocina y baños",
              "Cambio de ropa de cama",
            ],
          },
          {
            title: "Limpieza de Mantenimiento",
            description:
              "Con nuestro servicio de mantenimiento, tu hogar se mantiene impecable de forma continua. Programamos visitas regulares para asegurar que tu casa siempre esté en perfectas condiciones, sin que tengas que preocuparte por nada.",
            image: homeMaintenanceCleaning,
            features: [
              "Visitas programadas semanales o quincenales",
              "Mantenimiento preventivo",
              "Supervisión de calidad constante",
              "Flexibilidad de horarios",
            ],
          },
        ],
      },
      2: {
        title: "Turismo & Airbnb",
        subsections: [
          {
            title: "Entrega de Llaves",
            description:
              "La entrega de llaves es un paso esencial en la gestión de alquileres turísticos. En Star Limpieza, nos encargamos de recibir a los huéspedes con puntualidad y profesionalismo, asegurando un check-in fluido y sin inconvenientes.",
            image: airbnbKeyHandover,
            features: [
              "Recepción personalizada de huéspedes",
              "Explicación de servicios del alojamiento",
              "Disponibilidad 24/7",
              "Gestión profesional de check-in",
            ],
          },
          {
            title: "Cambios Turísticos",
            description:
              "El cambio entre huéspedes debe realizarse de manera rápida y eficiente para garantizar la mejor experiencia. En Star Limpieza, ofrecemos un servicio de cambios turísticos que incluye la limpieza completa del alojamiento, reposición de artículos esenciales y organización de los espacios.",
            image: vacationRentalTurnover,
            features: [
              "Limpieza completa entre huéspedes",
              "Reposición de amenities",
              "Inspección de calidad",
              "Tiempo de respuesta rápido",
            ],
          },
          {
            title: "Servicio de Lavandería",
            description:
              "La limpieza de ropa de cama y toallas es clave en los alojamientos turísticos. En Star Limpieza, ofrecemos un servicio de lavandería profesional, garantizando textiles limpios, frescos y bien presentados para cada nuevo huésped.",
            image: professionalLaundry,
            features: [
              "Lavado profesional de ropa de cama",
              "Toallas y textiles impecables",
              "Planchado y presentación",
              "Servicio express disponible",
            ],
          },
        ],
      },
      3: {
        title: "Servicios Forestales",
        subsections: [
          {
            title: "Mantenimiento Ecológico",
            description:
              "Nuestro servicio de mantenimiento ecológico se enfoca en preservar el medio ambiente mientras cuidamos de tus áreas verdes. Utilizamos técnicas sostenibles y productos biodegradables para mantener tus espacios forestales en óptimas condiciones.",
            image: ecologicalForestMaintenance,
            features: [
              "Técnicas de limpieza sostenibles",
              "Productos biodegradables",
              "Preservación de flora y fauna",
              "Gestión de residuos ecológica",
            ],
          },
          {
            title: "Poda de Árboles",
            description:
              "La poda profesional es esencial para la salud y seguridad de tus árboles. Nuestro equipo especializado realiza podas técnicas que promueven el crecimiento saludable y previenen riesgos, siempre respetando el ciclo natural de cada especie.",
            image: professionalTreePruning,
            features: [
              "Poda técnica especializada",
              "Evaluación de salud arbórea",
              "Equipo profesional certificado",
              "Respeto por el ciclo natural",
            ],
          },
          {
            title: "Prevención de Incendios",
            description:
              "La prevención de incendios forestales es crucial para proteger tu propiedad y el medio ambiente. Implementamos medidas preventivas efectivas, incluyendo la limpieza de maleza, creación de cortafuegos y asesoramiento en gestión de riesgos.",
            image: forestFirePrevention,
            features: [
              "Limpieza de maleza y vegetación seca",
              "Creación de cortafuegos",
              "Asesoramiento en prevención",
              "Cumplimiento normativo",
            ],
          },
        ],
      },
      4: {
        title: "Limpiezas de Cristales",
        subsections: [
          {
            title: "Limpieza de Cristales Residenciales",
            description:
              "Nuestro servicio de limpieza de cristales para viviendas garantiza que sus ventanas brillen, mejorando la estética y la luminosidad de tu hogar. Utilizamos productos no abrasivos para asegurar la integridad de sus cristales y un ambiente libre de residuos.",
            image: residentialWindowCleaning,
            features: [
              "Productos no abrasivos de alta calidad",
              "Limpieza interior y exterior",
              "Tratamiento anti-manchas",
              "Resultados sin rayas ni residuos",
            ],
          },
          {
            title: "Limpieza de Cristales en Oficinas",
            description:
              "Contamos con un servicio adaptado a las necesidades de su oficina, logrando que sus cristales estén siempre impecables y sin distracciones. Con Star Limpiezas, sus ventanas reflejarán un ambiente profesional y agradable para sus empleados y clientes.",
            image: officeWindowCleaning,
            features: [
              "Horarios flexibles fuera de horas laborales",
              "Mínima interrupción de actividades",
              "Imagen corporativa impecable",
              "Contratos de mantenimiento regular",
            ],
          },
          {
            title: "Limpieza de Cristales en Locales Comerciales",
            description:
              "El servicio de limpieza de cristales en comercios es esencial para una excelente imagen. Nuestros expertos se encargan de limpiar desde escaparates hasta ventanas grandes, logrando que su negocio siempre tenga una apariencia atractiva y bien cuidada.",
            image: commercialStorefrontWindowCleaning,
            features: [
              "Limpieza de escaparates y fachadas",
              "Atención a grandes superficies acristaladas",
              "Mejora de la imagen comercial",
              "Servicio regular programado",
            ],
          },
        ],
      },
      5: {
        title: "Limpiezas de Garajes",
        subsections: [
          {
            title: "Limpieza de Garajes Comunitarios",
            description:
              "Mantenemos los garajes comunitarios en perfectas condiciones, eliminando polvo, manchas de aceite y residuos acumulados. Nuestro servicio regular garantiza un espacio limpio y seguro para todos los residentes.",
            image: communityParkingGarageCleaning,
            features: [
              "Limpieza profunda de suelos y paredes",
              "Eliminación de manchas de aceite",
              "Desinfección de áreas comunes",
              "Mantenimiento preventivo regular",
            ],
          },
          {
            title: "Limpieza de Garajes Privados",
            description:
              "Tu garaje privado merece el mismo cuidado que el resto de tu hogar. Ofrecemos limpieza exhaustiva que incluye organización de espacios, eliminación de grasa y suciedad, y tratamiento de superficies para mantener tu garaje impecable.",
            image: privateGarageCleaning,
            features: [
              "Limpieza personalizada",
              "Organización de espacios",
              "Tratamiento de manchas difíciles",
              "Servicio a domicilio",
            ],
          },
          {
            title: "Tratamientos Antiparasitarios",
            description:
              "Los garajes pueden ser refugio de plagas. Nuestro servicio incluye tratamientos antiparasitarios profesionales para prevenir y eliminar insectos y roedores, garantizando un espacio higiénico y seguro.",
            image: garagePestControl,
            features: [
              "Tratamientos preventivos",
              "Eliminación de plagas existentes",
              "Productos seguros y efectivos",
              "Seguimiento y garantía",
            ],
          },
        ],
      },
      6: {
        title: "Limpieza de Restaurantes",
        subsections: [
          {
            title: "Limpieza de Cocinas Profesionales",
            description:
              "La cocina es el corazón de cualquier restaurante. Nuestro servicio especializado garantiza la máxima higiene y cumplimiento de normativas sanitarias, con limpieza profunda de equipos, superficies y áreas de preparación de alimentos.",
            image: femaleCookCleaning,
            features: [
              "Desengrase profundo de superficies",
              "Limpieza de equipos industriales",
              "Cumplimiento de normativas sanitarias",
              "Desinfección de áreas de preparación",
            ],
          },
          {
            title: "Limpieza de Salones y Comedores",
            description:
              "El comedor es la carta de presentación de tu restaurante. Mantenemos tus espacios de atención al cliente impecables, creando un ambiente acogedor y profesional que mejora la experiencia de tus comensales.",
            image: restaurantDiningAreaCleaning,
            features: [
              "Limpieza de mesas y sillas",
              "Mantenimiento de suelos",
              "Limpieza de ventanas y espejos",
              "Atención a detalles decorativos",
            ],
          },
          {
            title: "Desengrase de Campanas",
            description:
              "Las campanas extractoras requieren mantenimiento especializado. Nuestro servicio de desengrase profesional elimina la acumulación de grasa, mejora la eficiencia de ventilación y reduce riesgos de incendio, cumpliendo con todas las normativas.",
            image: restaurantHoodDegreasingService,
            features: [
              "Desengrase completo de campanas",
              "Limpieza de conductos de ventilación",
              "Prevención de incendios",
              "Certificación de limpieza",
            ],
          },
        ],
      },
      7: {
        title: "Comunidades",
        subsections: [
          {
            title: "Limpieza de Zonas Comunes",
            description:
              "Las zonas comunes son el reflejo de tu comunidad. Ofrecemos limpieza regular y exhaustiva de escaleras, pasillos, ascensores y áreas recreativas, manteniendo un ambiente agradable y bien cuidado para todos los vecinos.",
            image: limpiezaZonasComunes,
            features: [
              "Limpieza de escaleras y pasillos",
              "Mantenimiento de ascensores",
              "Limpieza de áreas recreativas",
              "Servicio regular programado",
            ],
          },
          {
            title: "Mantenimiento de Instalaciones",
            description:
              "El mantenimiento preventivo es clave para preservar el valor de tu comunidad. Nos encargamos del cuidado de instalaciones, jardines, piscinas y áreas deportivas, garantizando su correcto funcionamiento y apariencia.",
            image: mantenimientoInstalaciones,
            features: [
              "Mantenimiento de jardines",
              "Limpieza de piscinas",
              "Cuidado de áreas deportivas",
              "Inspecciones regulares",
            ],
          },
          {
            title: "Supervisión de Calidad",
            description:
              "Cada servicio incluye supervisión de calidad para garantizar los más altos estándares. Nuestro equipo realiza inspecciones regulares y mantiene comunicación constante con la comunidad para asegurar la satisfacción total.",
            image: supervisionCalidad,
            features: [
              "Inspecciones de calidad regulares",
              "Comunicación con administradores",
              "Reportes detallados",
              "Garantía de satisfacción",
            ],
          },
        ],
      },
    }
    return (
      contents[service.id] || {
        title: "Servicio",
        subsections: [
          {
            title: "Información",
            description: "Información próximamente.",
            image: restaurantHoodDegreasingService,
            features: [],
          },
        ],
      }
    )
  }

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = sectionRefs.current.indexOf(entry.target)
          if (index !== -1) {
            setActiveSection(index)
          }
          entry.target.classList.add("in-view")
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref)
      })
    }
  }, [])

  return (
    <section id="services" className="services-vertical">
      <div className="services-header">
        <div className="header-content">
          <span className="header-badge">Nuestros Servicios</span>
          <h1 className="header-title">Soluciones de limpieza profesional para cada necesidad</h1>
          <p className="header-description">
            Descubre nuestra amplia gama de servicios especializados, diseñados para mantener tus espacios impecables
          </p>
        </div>
      </div>

      <div className="services-container">
        {services.map((service, index) => (
          <div
            key={service.id}
            ref={(el) => (sectionRefs.current[index] = el)}
            className={`service-section ${index % 2 === 0 ? "image-left" : "image-right"}`}
          >
            <div className="service-image-wrapper">
              <div className="service-image-container">
                <img src={service.image || "/placeholder.svg"} alt={service.title} className="service-image" />
                <div className="image-overlay" style={{ background: `${service.color}15` }} />
              </div>
            </div>

            <div className="service-content-wrapper">
              <div className="service-content">
                <span className="service-tag" style={{ background: service.gradient }}>
                  {service.tag}
                </span>
                <span className="service-number" style={{ color: service.color }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="service-title">{service.title}</h2>
                <p className="service-description">{service.description}</p>

                <div className="service-actions">
                  <button
                    className="service-btn service-btn-primary"
                    style={{ background: service.gradient }}
                    onClick={() => navigate("/reservas")}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Reservar ahora</span>
                  </button>
                  <button
                    className="service-btn service-btn-secondary"
                    style={{ color: service.color, borderColor: `${service.color}40` }}
                    onClick={() => {
                      setModalService(service)
                      setShowModal(true)
                    }}
                  >
                    <span>Más información</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && modalService && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowModal(false)
            setModalService(null)
          }}
        >
          <div className="modal-container-large" onClick={(e) => e.stopPropagation()}>
            <div
              className="modal-header-large"
              style={{
                background: modalService.gradient,
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="modal-header-content">
                <span className="modal-badge">{modalService.tag}</span>
                <h2 className="modal-title-large">{getModalContent(modalService).title}</h2>
                <p className="modal-subtitle">Descubre todos los detalles de nuestro servicio especializado</p>
              </div>
              <button
                className="modal-close-large"
                onClick={() => {
                  setShowModal(false)
                  setModalService(null)
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body-large">
              {getModalContent(modalService).subsections.map((subsection, index) => (
                <div key={index} className="subsection">
                  <div className="subsection-content">
                    <div className="subsection-text">
                      <h3 className="subsection-title">{subsection.title}</h3>
                      <p className="subsection-description">{subsection.description}</p>
                      {subsection.features && subsection.features.length > 0 && (
                        <ul className="subsection-features">
                          {subsection.features.map((feature, idx) => (
                            <li key={idx}>
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ color: modalService.color }}
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="subsection-image">
                      <img src={subsection.image || "/placeholder.svg"} alt={subsection.title} />
                    </div>
                  </div>
                </div>
              ))}
              <div className="modal-footer">
                <button
                  className="modal-cta-button"
                  style={{ background: modalService.gradient }}
                  onClick={() => navigate("/reservas")}
                >
                  <span>Reservar este servicio</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* New vertical scrolling layout */
        .services-vertical {
          width: 100%;
          background: #FAFAFA;
          position: relative;
        }

        /* Header Section */
        .services-header {
          padding: 8rem 2rem 4rem;
          text-align: center;
          background: linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%);
        }

        .header-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .header-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: #0A0A0A;
          color: white;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }

        .header-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          color: #0A0A0A;
          margin: 0 0 1.5rem;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .header-description {
          font-size: clamp(1.125rem, 2vw, 1.375rem);
          color: #666;
          line-height: 1.6;
          margin: 0;
        }

        /* Progress Indicator */
        .progress-indicator {
          position: fixed;
          left: 2rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 100;
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .progress-bar-track {
          width: 3px;
          height: 300px;
          background: #E0E0E0;
          border-radius: 100px;
          position: relative;
          overflow: hidden;
        }

        .progress-bar-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 100px;
        }

        .progress-labels {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .progress-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0.5rem;
          border-radius: 8px;
          opacity: 0.5;
        }

        .progress-label:hover {
          opacity: 1;
          background: rgba(0, 0, 0, 0.03);
        }

        .progress-label.active {
          opacity: 1;
        }

        .label-number {
          font-size: 0.875rem;
          font-weight: 700;
          font-family: monospace;
          min-width: 30px;
        }

        .label-text {
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
          max-width: 0;
          overflow: hidden;
          transition: max-width 0.3s ease;
        }

        .progress-label:hover .label-text,
        .progress-label.active .label-text {
          max-width: 200px;
        }

        /* Services Container */
        .services-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .service-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-bottom: 8rem;
          min-height: 600px;
          align-items: center;
          opacity: 0;
          transform: translateY(60px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .service-section.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        .service-section.image-right {
          direction: rtl;
        }

        .service-section.image-right > * {
          direction: ltr;
        }

        .service-image-wrapper {
          position: relative;
          height: 100%;
          min-height: 500px;
        }

        .service-image-container {
          position: sticky;
          top: 100px;
          height: 600px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .service-image-container {
          position: sticky;
          top: 100px;
          height: 600px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          /* Eliminado el transition si no se usa */
        }

        .service-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          mix-blend-mode: multiply;
          pointer-events: none;
        }

        .service-content-wrapper {
          display: flex;
          align-items: center;
          padding: 2rem;
        }

        .service-content {
          max-width: 560px;
        }

        .service-tag {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          border-radius: 100px;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .service-number {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          font-family: monospace;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .service-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 800;
          color: #0A0A0A;
          margin: 0 0 1.5rem;
          letter-spacing: -0.03em;
          line-height: 1.1;
        }

        .service-description {
          font-size: clamp(1rem, 2vw, 1.25rem);
          line-height: 1.7;
          color: #4A4A4A;
          margin: 0 0 2.5rem;
        }

        .service-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .service-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 2rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          outline: none;
          position: relative;
          overflow: hidden;
        }

        .service-btn::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .service-btn:hover::before {
          width: 300px;
          height: 300px;
        }

        .service-btn > * {
          position: relative;
          z-index: 1;
        }

        .service-btn-primary {
          color: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .service-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
        }

        .service-btn-secondary {
          background: transparent;
          border: 2px solid;
        }

        .service-btn-secondary:hover {
          background: rgba(0, 0, 0, 0.03);
          transform: translateY(-2px);
        }

        /* New expanded modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
          overflow-y: auto;
        }

        .modal-container-large {
          background: white;
          border-radius: 24px;
          max-width: 1200px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
        }

        .modal-container-large .subsection-image:hover {
          transform: scale(1.03);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }

        .modal-header-large {
          padding: 1rem;
          color: white;
          position: relative;
        }

        .modal-header-content {
          max-width: 800px;
        }

        .modal-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .modal-title-large {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          margin: 0 0 0.75rem;
          letter-spacing: -0.02em;
          padding-right: 4rem;
        }

        .modal-subtitle {
          font-size: 1.125rem;
          opacity: 0.95;
          margin: 0;
          line-height: 1.6;
        }

        .modal-close-large {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.3s ease;
        }

        .modal-close-large:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .modal-body-large {
          padding: 3rem;
          overflow-y: auto;
          flex: 1;
        }

        .subsection {
          margin-bottom: 4rem;
        }

        .subsection:last-child {
          margin-bottom: 2rem;
        }

        .subsection-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .subsection-text {
          order: 1;
        }

        .subsection:nth-child(even) .subsection-text {
          order: 2;
        }

        .subsection-image {
          order: 2;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .subsection:nth-child(even) .subsection-image {
          order: 1;
        }


        .subsection-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .subsection-title {
          color: #0A0A0A;
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 1rem;
          letter-spacing: -0.01em;
        }

        .subsection-description {
          color: #4A4A4A;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-size: 1.0625rem;
        }

        .subsection-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .subsection-features li {
          display: flex;
          align-items: start;
          gap: 0.75rem;
          margin-bottom: 0.875rem;
          color: #4A4A4A;
          line-height: 1.6;
        }

        .subsection-features li svg {
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .modal-footer {
          padding: 2rem 3rem 3rem;
          display: flex;
          justify-content: center;
          border-top: 1px solid #E5E5E5;
        }

        .modal-cta-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.25rem 2.5rem;
          border-radius: 12px;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          outline: none;
          color: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .modal-cta-button:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .progress-indicator {
            left: 1rem;
          }

          .progress-label .label-text {
            display: none;
          }
        }

        @media (max-width: 1024px) {
          .progress-indicator {
            display: none;
          }

          .service-section {
            grid-template-columns: 1fr;
            gap: 2rem;
            margin-bottom: 6rem;
          }

          .service-section.image-right {
            direction: ltr;
          }

          .service-image-container {
            position: relative;
            top: 0;
            height: 400px;
          }

          .service-content-wrapper {
            padding: 1rem;
          }

          .subsection-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .subsection-text {
            order: 2 !important;
          }

          .subsection-image {
            order: 1 !important;
          }
        }

        @media (max-width: 640px) {
          .services-header {
            padding: 6rem 1.5rem 3rem;
          }

          .services-container {
            padding: 2rem 1.5rem;
          }

          .service-section {
            margin-bottom: 4rem;
          }

          .service-image-container {
            height: 300px;
          }

          .service-actions {
            flex-direction: column;
          }

          .service-btn {
            width: 100%;
            justify-content: center;
          }

          .modal-overlay {
            padding: 1rem;
          }

          .modal-header-large {
            padding: 2rem 1.5rem;
          }

          .modal-body-large {
            padding: 2rem 1.5rem;
          }

          .modal-footer {
            padding: 1.5rem;
          }

          .modal-cta-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  )
}

export default Services