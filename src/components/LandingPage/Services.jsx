"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import img1 from "../../assets/img1.png"
import img2 from "../../assets/img2.png"
import img3 from "../../assets/img3.png"
import img4 from "../../assets/img4.png"
import img5 from "../../assets/img5.png"
import img6 from "../../assets/img6.png"
import img7 from "../../assets/img7.png"
import img8 from "../../assets/img8.png"

const backgrounds = [img1, img2, img3, img4, img5, img6, img7]

const Services = () => {
  const navigate = useNavigate()
  const [currentCard, setCurrentCard] = useState(0)
  const [prevBgIndex, setPrevBgIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [showEntrance, setShowEntrance] = useState(false)
  const [arrowAnimated, setArrowAnimated] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalService, setModalService] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const isTransitioning = useRef(false)
  const containerRef = useRef(null)
  const autoSlideTimer = useRef(null)

  const services = [
    {
      id: 1,
      title: "Limpieza de casas",
      image: img8,
      description: "Servicios integrales de limpieza para hogares con tecnología avanzada y productos eco-friendly",
      color: "#64748b",
      bgColor: "#f8fafc",
    },
    {
      id: 2,
      title: "Turismo & Airbnb",
      image: img2,
      description: "Limpieza especializada entre huéspedes con protocolos de higiene premium",
      color: "#475569",
      bgColor: "#f1f5f9",
    },
    {
      id: 3,
      title: "Servicios Forestales",
      image: img3,
      description: "Mantenimiento ecológico y prevención de incendios con equipo especializado",
      color: "#059669",
      bgColor: "#f0fdf4",
    },
    {
      id: 4,
      title: "Limpiezas de Cristales",
      image: img4,
      description: "Limpieza de cristales con técnicas nanotecnológicas para resultados impecables",
      color: "#0284c7",
      bgColor: "#f0f9ff",
    },
    {
      id: 5,
      title: "Limpiezas de Garajes",
      image: img5,
      description:
        "Siempre disponibles para una limpieza impecable. Mantenimiento de garajes comunitarios y privados para evitar suciedad y plagas.",
      color: "#dc2626",
      bgColor: "#fef2f2",
    },
    {
      id: 6,
      title: "Limpieza de Restaurantes",
      image: img6,
      description:
        "El brillo no solo está en el plato. Limpieza especializada para restaurantes, incluyendo campanas de cocina y desengrase.",
      color: "#ea580c",
      bgColor: "#fff7ed",
    },
    {
      id: 7,
      title: "Comunidades",
      image: img7,
      description:
        "No limpie, solo llámenos. Servicios de limpieza para comunidades con equipos especializados y supervisión de calidad.",
      color: "#7c2d12",
      bgColor: "#fefbf3",
    },
  ]

  const getModalContent = (service) => {
    const contents = {
      1: {
        title: "Limpieza en casa particulares",
        content: (
          <>
            <p>El hogar se convierte en el paraíso cuando se limpia.</p>
            <p>
              Desde Star Limpiezas, sabemos que un hogar limpio es un hogar feliz, por lo que ofrecemos este servicio,
              con el fin de que nuestros clientes no pierdan tiempo en realizar las tareas domésticas, nosotros nos
              ocupamos dejándolo todo brillante.
            </p>
            <p>
              <strong>Nuestros servicios de limpieza de casa son:</strong>
            </p>
            <ul>
              <li>Limpieza a fondo</li>
              <li>Limpieza general</li>
              <li>Limpieza de mantenimiento</li>
              <li>Limpieza de obras</li>
              <li>Limpieza de persianas</li>
            </ul>
            <p>
              <strong>¿Cómo trabajamos?</strong>
            </p>
            <p>
              Depende el servicio solicitado realizamos un trabajo en equipo, o trabajo individual, trabajamos
              fijándonos en los detalles, y siempre al finalizar nuestros servicios tenemos una persona que realizar la
              supervisión de calidad.
            </p>
          </>
        )
      },
      2: {
        title: "Turismo & Airbnb",
        content: (
          <>
            <h3>Entrega de llaves</h3>
            <p>La entrega de llaves es un paso esencial en la gestión de alquileres turísticos. En Star Limpieza, nos encargamos de recibir a los huéspedes con puntualidad y profesionalismo, asegurando un check-in fluido y sin inconvenientes. Proporcionamos información relevante sobre el alojamiento y resolvemos cualquier duda que puedan tener los visitantes. Además, ofrecemos un servicio de recogida de llaves al finalizar la estancia, verificando el estado del inmueble para mayor tranquilidad del propietario. Nuestra gestión garantiza una experiencia agradable tanto para los dueños como para los huéspedes.</p>
            <h3>Cambios turísticos</h3>
            <p>El cambio entre huéspedes debe realizarse de manera rápida y eficiente para garantizar la mejor experiencia. En Star Limpieza, ofrecemos un servicio de cambios turísticos en Girona que incluye la limpieza completa del alojamiento, reposición de artículos esenciales y organización de los espacios. Nos aseguramos de que cada estancia quede impecable y lista para recibir a nuevos huéspedes en el menor tiempo posible. Trabajamos con puntualidad y siguiendo altos estándares de higiene, brindando tranquilidad a los propietarios y comodidad a los visitantes.</p>
            <h3>Servicio de lavandería</h3>
            <p>La limpieza de ropa de cama y toallas es clave en los alojamientos turísticos. En Star Limpieza, ofrecemos un servicio de lavandería profesional en Girona, garantizando textiles limpios, frescos y bien presentados para cada nuevo huésped. Nos encargamos del lavado, secado y planchado de sábanas, toallas y mantelería, utilizando productos de alta calidad que eliminan bacterias y mantienen la suavidad de los tejidos. Nuestro servicio es rápido y eficiente, asegurando que siempre haya ropa limpia disponible para cada cambio de estancia.</p>
            <h3>Compras a domicilio</h3>
            <p>Ofrecemos un servicio de compras a domicilio para facilitar la estancia de los huéspedes. En Star Limpieza, nos encargamos de abastecer el alojamiento con productos esenciales antes de la llegada de los visitantes. Podemos realizar compras personalizadas según las necesidades del propietario o los huéspedes, incluyendo alimentos, productos de higiene o cualquier otro artículo necesario. Con este servicio, garantizamos que los visitantes encuentren todo lo que necesitan al llegar, mejorando su experiencia y comodidad desde el primer momento.</p>
          </>
        )
      },
      3: {
        title: "Servicios Forestales",
        content: (
          <>
            <p>Mantenimiento ecológico y prevención de incendios con equipo especializado. En Star Limpieza, ofrecemos servicios forestales que incluyen limpieza de áreas verdes, poda de árboles, y medidas preventivas contra incendios. Utilizamos equipos especializados para mantener los espacios naturales en óptimas condiciones, contribuyendo a la preservación del medio ambiente y la seguridad de las comunidades.</p>
          </>
        )
      },
      4: {
        title: "Limpiezas de Cristales",
        content: (
          <>
            <p>Limpieza de cristales con técnicas nanotecnológicas para resultados impecables. Nuestros profesionales utilizan tecnología avanzada para limpiar ventanas, fachadas y superficies acristaladas, eliminando manchas y residuos de manera efectiva. Garantizamos un acabado brillante y duradero que mejora la apariencia de cualquier edificio.</p>
          </>
        )
      },
      5: {
        title: "Limpiezas de Garajes",
        content: (
          <>
            <p>Siempre disponibles para una limpieza impecable. Mantenimiento de garajes comunitarios y privados para evitar suciedad y plagas. Ofrecemos servicios de limpieza profunda que incluyen eliminación de polvo, grasa y residuos, así como tratamientos antiparasitarios para mantener los espacios libres de plagas y en perfectas condiciones.</p>
          </>
        )
      },
      6: {
        title: "Limpieza de Restaurantes",
        content: (
          <>
            <p>El brillo no solo está en el plato. Limpieza especializada para restaurantes, incluyendo campanas de cocina y desengrase. Nuestros equipos especializados se encargan de la limpieza de cocinas, salones, y equipos de ventilación, asegurando higiene y cumplimiento de normativas sanitarias para un ambiente seguro y atractivo.</p>
          </>
        )
      },
      7: {
        title: "Comunidades",
        content: (
          <>
            <p>No limpie, solo llámenos. Servicios de limpieza para comunidades con equipos especializados y supervisión de calidad. Ofrecemos limpieza de zonas comunes, mantenimiento de instalaciones, y servicios personalizados para comunidades de vecinos, garantizando espacios limpios, seguros y agradables para todos los residentes.</p>
          </>
        )
      },
    }
    return contents[service.id] || { title: "Servicio", content: <p>Información próximamente.</p> }
  }

  const startAutoSlide = () => {
    if (autoSlideTimer.current) clearTimeout(autoSlideTimer.current)
    if (!isPaused) {
      autoSlideTimer.current = setTimeout(() => {
        setCurrentCard((prev) => (prev + 1) % services.length)
      }, 4000)
    }
  }

  useEffect(() => {
    if (isActive && !showModal) startAutoSlide()
    return () => clearTimeout(autoSlideTimer.current)
    // eslint-disable-next-line
  }, [currentCard, isActive, services.length, showModal, isPaused])

  useEffect(() => {
    if (currentCard !== prevBgIndex) {
      setTransitioning(true)
      const timeout = setTimeout(() => {
        setTransitioning(false)
        setPrevBgIndex(currentCard)
      }, 1300)
      return () => clearTimeout(timeout)
    }
  }, [currentCard, prevBgIndex])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsActive(entry.isIntersecting)
          if (entry.isIntersecting) {
            setShowEntrance(true)
            setArrowAnimated(true)
            setTimeout(() => setArrowAnimated(false), 2500)
          }
        })
      },
      { threshold: 0.47 },
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const handleCardClick = (index) => {
    if (!isTransitioning.current) {
      isTransitioning.current = true
      setCurrentCard(index)
      setTimeout(() => {
        isTransitioning.current = false
      }, 800)
      startAutoSlide()
    }
  }

  const handleNextCard = () => handleCardClick((currentCard + 1) % services.length)
  const handlePrevCard = () => handleCardClick(currentCard === 0 ? services.length - 1 : currentCard - 1)

  const handleMouseEffect = (e, cardElement) => {
    if (window.innerWidth <= 768) return
    const rect = cardElement.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 50
    const rotateY = (centerX - x) / 50
    cardElement.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale(1.02)
    `
  }

  const resetCard = (cardElement) => {
    cardElement.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)"
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  return (
    <section
      id="services"
      ref={containerRef}
      className={`services-section${isActive ? " focused" : ""}${showEntrance ? " animate-in" : ""}`}
      style={{
        width: "95%",
        height: "100%",
      }}
    >
      <div
        className="crossfade-bg"
        style={{
          backgroundImage: `linear-gradient(to bottom,rgba(255,255,255,0.23) 75%, #f8fafc 99%), url(${backgrounds[prevBgIndex]})`,
          opacity: transitioning ? 1 : 1,
          zIndex: 0,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div
        className={`crossfade-bg${transitioning ? " shown" : ""}`}
        style={{
          backgroundImage: `linear-gradient(to bottom,rgba(255,255,255,0.23) 75%, #f8fafc 99%), url(${backgrounds[currentCard]})`,
          opacity: transitioning ? 1 : 0,
          zIndex: 1,
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <h2 className={`services-title${showEntrance ? " entrance-title" : ""}`}>Nuestros Servicios</h2>

      <div className="progress-container">
        <div className="auto-slide-indicator">
          <div className={`progress-bar${isPaused ? " paused" : ""}`} key={currentCard} />
        </div>
      </div>

      <button
        className={`nav-arrow left${arrowAnimated ? " shake" : ""}`}
        onClick={handlePrevCard}
        tabIndex={0}
        aria-label="Anterior"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <button
        className={`nav-arrow right${arrowAnimated ? " shake" : ""}`}
        onClick={handleNextCard}
        tabIndex={0}
        aria-label="Siguiente"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <div className={`cards-container${showEntrance ? " fadein" : ""}`}>
        {services.map((service, index) => {
          const isActiveCard = index === currentCard
          const offset = index - currentCard
          const isVisible = Math.abs(offset) <= 2
          return (
            <div
              key={service.id}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                right:'25px',
                transformStyle: "preserve-3d",
                transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                transform:
                  window.innerWidth <= 768
                    ? isActiveCard
                      ? "translateX(0) scale(1)"
                      : `translateX(${offset * 100}%) scale(0.9)`
                    : isActiveCard
                      ? "translateX(0) translateZ(0) rotateY(0deg) scale(1)"
                      : `translateX(${offset * 80}px) translateZ(${Math.abs(offset) * -150}px) rotateY(${offset * 10}deg) scale(${1 - Math.abs(offset) * 0.1})`,
                opacity: isVisible ? (isActiveCard ? 1 : 0.4 - Math.abs(offset) * 0.1) : 0,
                zIndex: isActiveCard ? 100 : 100 - Math.abs(offset),
                pointerEvents: isActiveCard ? "auto" : "none",
                touchAction: "manipulation",
              }}
            >
              <div
                className="service-card"
                style={{
                  width: "100%",
                  height: "100%",
                  background: isActiveCard ? "rgba(255, 255, 255, 0.85)" : service.bgColor,
                  backdropFilter: "blur(12px)",
                  borderRadius: "20px",
                  padding: "1.5rem",
                  boxShadow: isActiveCard
                    ? "0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)"
                    : "0 10px 20px rgba(0,0,0,0.08)",
                  border: `1px solid ${isActiveCard ? service.color + "30" : "rgba(0,0,0,0.06)"}`,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "1.5rem",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseMove={(e) => isActiveCard && handleMouseEffect(e, e.currentTarget)}
                onMouseLeave={(e) => isActiveCard && resetCard(e.currentTarget)}
              >
                <div
                  className="service-image-left"
                  style={{
                    backgroundImage: `url(${service.image})`,
                  }}
                />

                <div className="service-content">
                  <div
                    className="service-number-alt"
                    style={{
                      background: isActiveCard ? service.color : "rgba(100, 116, 139, 0.1)",
                      color: isActiveCard ? "white" : "#64748b",
                    }}
                  >
                    {index + 1}
                  </div>
                  <h3 className="service-title" style={{ color: service.color }}>
                    {service.title}
                  </h3>
                  <p className="service-description">{service.description}</p>
                  {isActiveCard && (
                    <div className="button-group">
                      <button
                        className="service-button primary"
                        style={{
                          background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`,
                          boxShadow: `0 4px 14px ${service.color}35`,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)"
                          e.target.style.boxShadow = `0 6px 20px ${service.color}45`
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)"
                          e.target.style.boxShadow = `0 4px 14px ${service.color}35`
                        }}
                        onClick={() => navigate("/reservas")}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ marginRight: "6px" }}
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Reservar
                      </button>
                      <button
                        className="service-button secondary"
                        style={{
                          borderColor: service.color,
                          color: service.color,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = service.color
                          e.target.style.color = "white"
                          e.target.style.transform = "translateY(-2px)"
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent"
                          e.target.style.color = service.color
                          e.target.style.transform = "translateY(0)"
                        }}
                        onClick={() => { setModalService(service); setShowModal(true); }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ marginRight: "6px" }}
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        Más información
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="nav-dots">
        {services.map((service, index) => (
          <button
            key={index}
            onClick={() => handleCardClick(index)}
            className={`dot${index === currentCard ? " active" : ""}`}
            aria-label={`Ir a servicio ${index + 1}`}
            style={{
              background: index === currentCard ? services[currentCard].color : "rgba(100, 116, 139, 0.3)",
            }}
          />
        ))}
        <button
          className="pause-button"
          onClick={togglePause}
          aria-label={isPaused ? "Reanudar" : "Pausar"}
          title={isPaused ? "Reanudar presentación" : "Pausar presentación"}
        >
          {isPaused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          )}
        </button>
      </div>

      <style>{`
        .services-section {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 1rem;
          background: none;
          z-index: 2;
        }
        
        .services-section.animate-in .cards-container,
        .services-section.animate-in .services-title {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }

        /* Contenedor mejorado para progreso y botón de pausa */
        .progress-container {
          position: absolute;
          top: 12%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 10;
        }

        .auto-slide-indicator {
          width: 180px;
          height: 4px;
          background: rgba(100, 116, 139, 0.15);
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #475569, #64748b);
          border-radius: 4px;
          animation: progress 4s linear infinite;
          transform-origin: left;
        }

        .progress-bar.paused {
          animation-play-state: paused;
        }

        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        /* Botón de pausa moderno */
        .pause-button {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #475569;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          outline: none;
        }

        .pause-button:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .pause-button:active {
          transform: scale(0.95);
        }
        
        .cards-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          height: 340px;
          perspective: 1200px;
          z-index: 3;
          opacity: 0;
          transform: translateY(60px);
          pointer-events: none;
          transition: opacity 0.9s cubic-bezier(.42,0,1,1) 0.2s, transform 0.85s cubic-bezier(.42,0,1,1) 0.23s;
        }
        
        .service-card {
          flex-direction: column !important;
          gap: 1rem !important;
          padding: 1.5rem !important;
          text-align: center;
        }
        
        .service-icon-section {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        }
        
        .service-emoji {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 0.5rem;
          transition: transform 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .service-number {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        
        .service-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          z-index: 2;
        }
        
        .service-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          letter-spacing: -0.02em;
        }
        
        .service-description {
          color: #64748b;
          line-height: 1.6;
          font-size: 0.9rem;
          margin-bottom: 1.25rem;
          text-align: center;
        }

        /* Grupo de botones mejorado con mejor alineación */
        .button-group {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          width: 100%;
        }
        
        .service-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          white-space: nowrap;
        }

        .service-button.primary {
          color: white;
          background: linear-gradient(135deg, #64748b, #475569);
        }

        .service-button.secondary {
          color: #64748b;
          background: transparent;
          border: 2px solid #64748b;
        }
        
        .services-title {
          position: absolute;
          top: 5%;
          left: 50%;
          transform: translateX(-50%) translateY(30px);
          font-size: 1.75rem;
          color: #1e293b;
          font-weight: 800;
          z-index: 10;
          letter-spacing: -0.02em;
          text-align: center;
          opacity: 0;
          transition: opacity 0.8s 0.15s, transform 0.8s 0.15s;
          text-shadow: 0 2px 4px rgba(255,255,255,0.8);
        }
        
        .services-section.animate-in .services-title {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        
        /* Flechas de navegación modernizadas con iconos SVG */
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.95);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #475569;
          z-index: 200;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          outline: none;
          touch-action: manipulation;
        }
        
        .nav-arrow:hover {
          background: rgba(255,255,255,1);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(0,0,0,0.18);
        }

        .nav-arrow:active {
          transform: translateY(-50%) scale(0.95);
        }
        
        .nav-arrow.left { 
          left: 10px;
        }
        .nav-arrow.right { 
          right: 10px;
        }
        
        .nav-arrow.shake {
          animation: shake-arrow 2.5s cubic-bezier(.2,.8,.43,1.04);
        }
        
        @keyframes shake-arrow {
          0% { transform: translateY(-50%) translateX(0); }
          6% { transform: translateY(-50%) translateX(-8px);}
          13% { transform: translateY(-50%) translateX(6px);}
          23% { transform: translateY(-50%) translateX(-5px);}
          32% { transform: translateY(-50%) translateX(4px);}
          41% { transform: translateY(-50%) translateX(-3px);}
          50% { transform: translateY(-50%) translateX(2px);}
          60%{ transform: translateY(-50%) translateX(-2px);}
          72% { transform: translateY(-50%) translateX(1px);}
          85%,100% { transform: translateY(-50%) translateX(0);}
        }
        
        /* Dots de navegación mejorados con colores dinámicos */
        .nav-dots {
          align-items: center;
          justify-content: center;
          position: absolute;
          bottom: 11%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 10px;
          z-index: 200;
          padding: 8px 12px;
          border-radius: 20px;
        }
        
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background: rgba(100, 116, 139, 0.3);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          touch-action: manipulation;
          border: none;
          outline: none;
          padding: 0;
        }

        .dot:hover {
          transform: scale(1.2);
        }
        
        .dot.active {
          width: 28px;
        }
        
        .crossfade-bg {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          pointer-events: none;
          will-change: opacity;
          opacity: 1;
          transition: opacity 1.3s cubic-bezier(.4,0,.2,1);
        }
        
        .crossfade-bg.shown {
          opacity: 1;
        }
        
        .crossfade-bg:not(.shown) {
          opacity: 0;
        }
        
        .services-section.focused {
          box-shadow: 0 12px 52px 0px #818cf82a;
          transform: scale(1.01);
          z-index: 10;
        }

        @media (min-width: 768px) {
          .cards-container {
            max-width: 600px;
            height: 300px;
          }
          
          .service-card {
            flex-direction: row !important;
            gap: 1.5rem !important;
            padding: 2rem !important;
            text-align: left;
          }
          
          .service-content {
            align-items: flex-start;
            text-align: left;
          }
          
          .service-description {
            text-align: left;
          }
          
          .button-group {
            justify-content: flex-start;
          }
          
          .services-title {
            font-size: 2.25rem;
          }
          
          .progress-container {
            top: 15%;
          }

          .auto-slide-indicator {
            width: 220px;
          }
          
          .nav-arrow.left { left: 5%; }
          .nav-arrow.right { right: 5%; }
        }

        @media (min-width: 1024px) {
          .services-section {
            min-height: 90vh;
            padding: 2rem;
          }
          
          .cards-container {
            max-width: 800px;
            height: 380px;
          }
          
          .service-card {
            padding: 2.5rem !important;
            gap: 2rem !important;
          }
          
          .service-emoji {
            width: 3.5rem;
            height: 3.5rem;
          }
          
          .service-number {
            width: 30px;
            height: 30px;
            font-size: 0.85rem;
          }
          
          .service-title {
            font-size: 1.5rem;
          }
          
          .service-description {
            font-size: 1rem;
          }
          
          .services-title {
            font-size: 2.75rem;
            top: 8%;
          }
          
          .progress-container {
            top: 18%;
          }

          .auto-slide-indicator {
            width: 260px;
          }

          .pause-button {
            width: 30px;
            height: 30px;
          }
          
          .nav-arrow {
            width: 56px;
            height: 56px;
          }
          
          .nav-arrow.left { left: 3%; }
          .nav-arrow.right { right: 3%; }
        }

        @media (min-width: 1440px) {
          .cards-container {
            max-width: 900px;
            height: 420px;
          }

          .services-title {
            font-size: 3rem;
          }
        }

        .service-image-left {
          flex: 1;
          background-size: cover;
          background-position: center;
          border-radius: 16px 0 0 16px;
          position: relative;
          height: 100%;
        }

        .service-number-alt {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          transition: all 0.3s ease;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        /* Modal modernizado con mejor presentación */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          padding: 2.5rem;
          border-radius: 20px;
          max-width: 560px;
          max-height: 85vh;
          overflow-y: auto;
          text-align: left;
          animation: modalIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-content h2 {
          color: #1e293b;
          margin-bottom: 1.25rem;
          font-size: 1.75rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .modal-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: #475569;
        }

        .modal-content ul {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
          color: #475569;
        }

        .modal-content ul li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .modal-content button {
          background: linear-gradient(135deg, #64748b, #475569);
          color: white;
          border: none;
          padding: 0.75rem 1.75rem;
          border-radius: 12px;
          cursor: pointer;
          float: right;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
        }

        .modal-content button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(100, 116, 139, 0.4);
        }
      `}</style>

      {showModal && modalService && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); setModalService(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ borderTop: `4px solid ${modalService.color}` }}>
            {(() => {
              const modalData = getModalContent(modalService);
              return (
                <>
                  <h2>{modalData.title}</h2>
                  {modalData.content}
                </>
              );
            })()}
            <button onClick={() => { setShowModal(false); setModalService(null); }}>Cerrar</button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Services
