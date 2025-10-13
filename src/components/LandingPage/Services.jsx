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
  const [visibleBgIndex, setVisibleBgIndex] = useState(0)
  const [prevBgIndex, setPrevBgIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [showEntrance, setShowEntrance] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalService, setModalService] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const [isTitleAtTop, setIsTitleAtTop] = useState(false)
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const cardRefs = useRef([])
  const currentCardIndexRef = useRef(0)
  const isScrollingRef = useRef(false)
  const scrollDirectionRef = useRef(null)
  const touchStartRef = useRef({ x: 0, y: 0 })
  const isTouchScrollingRef = useRef(false)

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
        ),
      },
      2: {
        title: "Turismo & Airbnb",
        content: (
          <>
            <h3>Entrega de llaves</h3>
            <p>
              La entrega de llaves es un paso esencial en la gestión de alquileres turísticos. En Star Limpieza, nos
              encargamos de recibir a los huéspedes con puntualidad y profesionalismo, asegurando un check-in fluido y
              sin inconvenientes. Proporcionamos información relevante sobre el alojamiento y resolvemos cualquier duda
              que puedan tener los visitantes. Además, ofrecemos un servicio de recogida de llaves al finalizar la
              estancia, verificando el estado del inmueble para mayor tranquilidad del propietario. Nuestra gestión
              garantiza una experiencia agradable tanto para los dueños como para los huéspedes.
            </p>
            <h3>Cambios turísticos</h3>
            <p>
              El cambio entre huéspedes debe realizarse de manera rápida y eficiente para garantizar la mejor
              experiencia. En Star Limpieza, ofrecemos un servicio de cambios turísticos en Girona que incluye la
              limpieza completa del alojamiento, reposición de artículos esenciales y organización de los espacios. Nos
              aseguramos de que cada estancia quede impecable y lista para recibir a nuevos huéspedes en el menor tiempo
              posible. Trabajamos con puntualidad y siguiendo altos estándares de higiene, brindando tranquilidad a los
              propietarios y comodidad a los visitantes.
            </p>
            <h3>Servicio de lavandería</h3>
            <p>
              La limpieza de ropa de cama y toallas es clave en los alojamientos turísticos. En Star Limpieza, ofrecemos
              un servicio de lavandería profesional en Girona, garantizando textiles limpios, frescos y bien presentados
              para cada nuevo huésped. Nos encargamos del lavado, secado y planchado de sábanas, toallas y mantelería,
              utilizando productos de alta calidad que eliminan bacterias y mantienen la suavidad de los tejidos.
              Nuestro servicio es rápido y eficiente, asegurando que siempre haya ropa limpia disponible para cada
              cambio de estancia.
            </p>
            <h3>Compras a domicilio</h3>
            <p>
              Ofrecemos un servicio de compras a domicilio para facilitar la estancia de los huéspedes. En Star
              Limpieza, nos encargamos de abastecer el alojamiento con productos esenciales antes de la llegada de los
              visitantes. Podemos realizar compras personalizadas según las necesidades del propietario o los huéspedes,
              incluyendo alimentos, productos de higiene o cualquier otro artículo necesario. Con este servicio,
              garantizamos que los visitantes encuentren todo lo que necesitan al llegar, mejorando su experiencia y
              comodidad desde el primer momento.
            </p>
          </>
        ),
      },
      3: {
        title: "Servicios Forestales",
        content: (
          <>
            <p>
              Mantenimiento ecológico y prevención de incendios con equipo especializado. En Star Limpieza, ofrecemos
              servicios forestales que incluyen limpieza de áreas verdes, poda de árboles, y medidas preventivas contra
              incendios. Utilizamos equipos especializados para mantener los espacios naturales en óptimas condiciones,
              contributing to the preservation of the environment and community safety.
            </p>
          </>
        ),
      },
      4: {
        title: "Limpiezas de Cristales",
        content: (
          <>
            <p>
              Limpieza de cristales con técnicas nanotecnológicas para resultados impecables. Nuestros profesionales
              utilizan tecnología avanzada para limpiar ventanas, fachadas y superficies acristaladas, eliminando
              manchas y residuos de manera efectiva. Garantizamos un acabado brillante y duradero que mejora la
              apariencia de cualquier edificio.
            </p>
          </>
        ),
      },
      5: {
        title: "Limpiezas de Garajes",
        content: (
          <>
            <p>
              Siempre disponibles para una limpieza impecable. Mantenimiento de garajes comunitarios y privados para
              evitar suciedad y plagas. Ofrecemos servicios de limpieza profunda que incluyen eliminación de polvo,
              grasa y residuos, así como tratamientos antiparasitarios para mantener los espacios libres de plagas y en
              perfectas condiciones.
            </p>
          </>
        ),
      },
      6: {
        title: "Limpieza de Restaurantes",
        content: (
          <>
            <p>
              El brillo no solo está en el plato. Limpieza especializada para restaurantes, incluyendo campanas de
              cocina y desengrase. Nuestros equipos especializados se encargan de la limpieza de cocinas, salones, y
              equipos de ventilación, asegurando higiene y cumplimiento de normativas sanitarias para un ambiente seguro
              y atractivo.
            </p>
          </>
        ),
      },
      7: {
        title: "Comunidades",
        content: (
          <>
            <p>
              No limpie, solo llámenos. Servicios de limpieza para comunidades con equipos especializados y supervisión
              de calidad. Ofrecemos limpieza de zonas comunes, mantenimiento de instalaciones, y servicios
              personalizados para comunidades de vecinos, garantizando espacios limpios, seguros y agradables para todos
              los residentes.
            </p>
          </>
        ),
      },
    }
    return contents[service.id] || { title: "Servicio", content: <p>Información próximamente.</p> }
  }

  useEffect(() => {
    if (visibleBgIndex !== prevBgIndex) {
      setTransitioning(true)
      const timeout = setTimeout(() => {
        setTransitioning(false)
        setPrevBgIndex(visibleBgIndex)
      }, 1300)
      return () => clearTimeout(timeout)
    }
  }, [visibleBgIndex, prevBgIndex])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShowEntrance(true)
            setIsActive(true)
            console.log("[v0] Services component is now active")
          } else {
            setIsActive(false)
            setIsTitleAtTop(false)
            console.log("[v0] Services component is now inactive")
          }
        })
      },
      { 
        threshold: 0.1,
        rootMargin: "0px 0px -50% 0px"
      },
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Observer para detectar cuando el título está en la parte superior
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // El título está en la parte superior cuando intersecta con el top de la ventana
          if (entry.isIntersecting && entry.boundingClientRect.top <= 200) {
            setIsTitleAtTop(true)
            console.log("[v0] Title is at top - horizontal scroll enabled")
          } else if (entry.boundingClientRect.top > 200) {
            setIsTitleAtTop(false)
            console.log("[v0] Title not at top - vertical scroll enabled")
          }
        })
      },
      { 
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: "-50px 0px 0px 0px"
      },
    )
    if (titleRef.current) observer.observe(titleRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(entry.target.dataset.index)
            setVisibleBgIndex(index)
            currentCardIndexRef.current = index
            console.log("[v0] Card visible:", index)
          }
        })
      },
      { threshold: 0.6 },
    )

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  // Touch events para móviles
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (!isActive || !isTitleAtTop || showModal) return
      
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
      isTouchScrollingRef.current = false
    }

    const handleTouchMove = (e) => {
      if (!isActive || !isTitleAtTop || showModal) return
      
      const currentIndex = currentCardIndexRef.current
      const deltaX = touchStartRef.current.x - e.touches[0].clientX
      const deltaY = touchStartRef.current.y - e.touches[0].clientY
      
      // Determinar si el movimiento es principalmente horizontal
      const isHorizontalMove = Math.abs(deltaX) > Math.abs(deltaY)
      
      // Si estamos en la primera tarjeta y hacemos scroll hacia arriba
      if (currentIndex === 0 && deltaY < -10 && !isHorizontalMove) {
        console.log("[v0] Touch: Allowing scroll up from first card")
        isTouchScrollingRef.current = false
        return
      }
      
      // Si estamos en la última tarjeta y hacemos scroll hacia abajo
      if (currentIndex === services.length - 1 && deltaY > 10 && !isHorizontalMove) {
        console.log("[v0] Touch: Allowing scroll down from last card")
        isTouchScrollingRef.current = false
        return
      }
      
      // Si el movimiento es horizontal, prevenir scroll vertical
      if (isHorizontalMove && Math.abs(deltaX) > 10) {
        e.preventDefault()
        isTouchScrollingRef.current = true
      }
    }

    const handleTouchEnd = (e) => {
      if (!isActive || !isTitleAtTop || showModal || isScrollingRef.current) return

      const deltaX = touchStartRef.current.x - e.changedTouches[0].clientX
      const deltaY = touchStartRef.current.y - e.changedTouches[0].clientY
      const currentIndex = currentCardIndexRef.current

      console.log("[v0] Touch end:", { deltaX, deltaY, currentIndex })

      // Solo procesar si fue un movimiento horizontal significativo
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50
      
      if (!isHorizontalSwipe) {
        console.log("[v0] Touch: Not a horizontal swipe, allowing normal scroll")
        return
      }

      let nextIndex = currentIndex

      if (deltaX > 0 && currentIndex < services.length - 1) {
        // Swipe left (siguiente tarjeta)
        nextIndex = currentIndex + 1
        console.log("[v0] Swipe left to next card:", nextIndex)
      } else if (deltaX < 0 && currentIndex > 0) {
        // Swipe right (tarjeta anterior)
        nextIndex = currentIndex - 1
        console.log("[v0] Swipe right to previous card:", nextIndex)
      }

      if (nextIndex !== currentIndex) {
        isScrollingRef.current = true
        currentCardIndexRef.current = nextIndex

        const targetCard = cardRefs.current[nextIndex]
        if (targetCard && scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            left: targetCard.offsetLeft,
            behavior: "smooth",
          })
        }

        setTimeout(() => {
          isScrollingRef.current = false
          isTouchScrollingRef.current = false
          console.log("[v0] Touch scroll unlocked")
        }, 600)
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [isActive, isTitleAtTop, showModal, services.length])

  // Wheel events para desktop
  useEffect(() => {
    let accumulatedDelta = 0
    const deltaThreshold = 50 // Aumentado para evitar saltos con trackpad
    let resetTimeout = null
    let lastEventTime = 0

    const handleWheel = (e) => {
      if (!isActive || !isTitleAtTop || showModal) {
        console.log("[v0] Wheel ignored - not active, title not at top, or modal open")
        return
      }

      if (isScrollingRef.current) {
        console.log("[v0] Wheel ignored - currently scrolling")
        e.preventDefault()
        return
      }

      const currentTime = Date.now()
      const timeDiff = currentTime - lastEventTime
      lastEventTime = currentTime

      const currentIndex = currentCardIndexRef.current
      
      // Solo acumular si los eventos están cerca en tiempo (mismo gesto)
      if (timeDiff < 150) {
        accumulatedDelta += e.deltaY
      } else {
        // Si pasó mucho tiempo, es un nuevo gesto
        accumulatedDelta = e.deltaY
      }
      
      // Limpiar timeout anterior
      if (resetTimeout) {
        clearTimeout(resetTimeout)
      }
      
      // Reset accumulated delta después de un breve período de inactividad
      resetTimeout = setTimeout(() => {
        accumulatedDelta = 0
      }, 200)

      console.log("[v0] Wheel event:", { currentIndex, deltaY: e.deltaY, accumulatedDelta, timeDiff })

      // Allow scroll to previous component if at first card and scrolling up
      if (currentIndex === 0 && accumulatedDelta < -deltaThreshold) {
        console.log("[v0] At first card, allowing scroll up to previous component")
        accumulatedDelta = 0
        setIsTitleAtTop(false)
        return
      }

      // Allow scroll to next component if at last card and scrolling down
      if (currentIndex === services.length - 1 && accumulatedDelta > deltaThreshold) {
        console.log("[v0] At last card, allowing scroll down to next component")
        accumulatedDelta = 0
        setIsTitleAtTop(false)
        return
      }

      // Prevent default scroll and handle card navigation
      e.preventDefault()

      let nextIndex = currentIndex

      // Solo cambiar de tarjeta si se supera el umbral
      if (accumulatedDelta > deltaThreshold && currentIndex < services.length - 1) {
        nextIndex = currentIndex + 1
        accumulatedDelta = 0
        console.log("[v0] Moving to next card:", nextIndex)
      } else if (accumulatedDelta < -deltaThreshold && currentIndex > 0) {
        nextIndex = currentIndex - 1
        accumulatedDelta = 0
        console.log("[v0] Moving to previous card:", nextIndex)
      }

      if (nextIndex !== currentIndex) {
        isScrollingRef.current = true
        currentCardIndexRef.current = nextIndex

        // Scroll to the next card
        const targetCard = cardRefs.current[nextIndex]
        if (targetCard && scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            left: targetCard.offsetLeft,
            behavior: "smooth",
          })
        }

        // Reset scrolling flag after animation
        setTimeout(() => {
          isScrollingRef.current = false
          console.log("[v0] Scroll unlocked")
        }, 700)
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWheel)
      if (resetTimeout) {
        clearTimeout(resetTimeout)
      }
    }
  }, [isActive, isTitleAtTop, showModal, services.length])

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

  return (
    <section id="services" ref={containerRef} className={`services-section${showEntrance ? " animate-in" : ""}`}>
      <div
        className="crossfade-bg"
        style={{
          backgroundImage: `linear-gradient(to bottom,rgba(255,255,255,0.23) 75%, #f8fafc 99%), url(${backgrounds[prevBgIndex]})`,
          opacity: transitioning ? 1 : 1,
        }}
      />
      <div
        className={`crossfade-bg${transitioning ? " shown" : ""}`}
        style={{
          backgroundImage: `linear-gradient(to bottom,rgba(255,255,255,0.23) 75%, #f8fafc 99%), url(${backgrounds[visibleBgIndex]})`,
          opacity: transitioning ? 1 : 0,
        }}
      />

      <h2 ref={titleRef} className={`services-title${showEntrance ? " entrance-title" : ""}`}>Nuestros Servicios</h2>

      <div ref={scrollContainerRef} className={`cards-horizontal-container${showEntrance ? " fadein" : ""}`}>
        <div className="cards-track">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="service-card-wrapper"
              ref={(el) => (cardRefs.current[index] = el)}
              data-index={index}
            >
              <div
                className="service-card"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "20px",
                  padding: "1.5rem",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
                  border: `1px solid ${service.color}30`,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "1.5rem",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseMove={(e) => handleMouseEffect(e, e.currentTarget)}
                onMouseLeave={(e) => resetCard(e.currentTarget)}
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
                      background: service.color,
                      color: "white",
                    }}
                  >
                    {index + 1}
                  </div>
                  <h3 className="service-title" style={{ color: service.color }}>
                    {service.title}
                  </h3>
                  <p className="service-description">{service.description}</p>
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
                      onClick={() => {
                        setModalService(service)
                        setShowModal(true)
                      }}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .services-section {
          max-height: calc(100vh - 80px);
          width: 100%;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 0;
          background: none;
          z-index: 2;
          padding-top: 5vh;
        }
        
        .services-section.animate-in .cards-horizontal-container,
        .services-section.animate-in .services-title {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }

        .cards-horizontal-container {
          position: relative;
          width: 100%;
          height: 90vh;
          z-index: 3;
          opacity: 0;
          transform: translateY(60px);
          pointer-events: none;
          transition: opacity 0.9s cubic-bezier(.42,0,1,1) 0.2s, transform 0.85s cubic-bezier(.42,0,1,1) 0.23s;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          scrollbar-width: none;
          margin-top: 8vh;
          touch-action: pan-x pan-y;
        }

        .cards-horizontal-container::-webkit-scrollbar {
          display: none;
        }

        .cards-track {
          display: flex;
          height: 100%;
          width: fit-content;
          gap: 0;
        }

        .service-card-wrapper {
          flex: 0 0 100vw;
          width: 100vw;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          scroll-snap-align: start;
        }
        
        .service-card {
          flex-direction: column !important;
          gap: 1rem !important;
          padding: 2rem !important;
          text-align: center;
          width: 100%;
          max-width: 900px;
          height: auto;
          max-height: 70vh;
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
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          letter-spacing: -0.02em;
        }
        
        .service-description {
          color: #64748b;
          line-height: 1.6;
          font-size: 1rem;
          margin-bottom: 1.25rem;
          text-align: center;
        }

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
          top: 2%;
          left: 50%;
          transform: translateX(-50%) translateY(30px);
          font-size: 2rem;
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
        
        .crossfade-bg {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 100%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          pointer-events: none;
          opacity: 1;
          transition: opacity 0.8s cubic-bezier(.4,0,.2,1);
          z-index: 0;
        }
        
        .crossfade-bg.shown {
          opacity: 1;
          z-index: 1;
        }

        .service-image-left {
          width: 100%;
          height: 200px;
          background-size: cover;
          background-position: center;
          border-radius: 16px;
          position: relative;
        }

        .service-number-alt {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          z-index: 2;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        @media (min-width: 768px) {
          .service-card {
            flex-direction: row !important;
            gap: 2rem !important;
            padding: 2.5rem !important;
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
            font-size: 2.5rem;
          }

          .service-image-left {
            width: 300px;
            height: 100%;
            min-height: 350px;
            border-radius: 16px 0 0 16px;
          }

          .service-title {
            font-size: 1.75rem;
          }
        }

        @media (min-width: 1024px) {
          .services-title {
            font-size: 3rem;
          }

          .service-card {
            max-width: 1100px;
          }

          .service-image-left {
            width: 400px;
          }

          .service-title {
            font-size: 2rem;
          }

          .service-description {
            font-size: 1.1rem;
          }
        }

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

        .modal-content h3 {
          color: #475569;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
          font-weight: 600;
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
        <div
          className="modal-overlay"
          onClick={() => {
            setShowModal(false)
            setModalService(null)
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ borderTop: `4px solid ${modalService.color}` }}
          >
            {(() => {
              const modalData = getModalContent(modalService)
              return (
                <>
                  <h2>{modalData.title}</h2>
                  {modalData.content}
                </>
              )
            })()}
            <button
              onClick={() => {
                setShowModal(false)
                setModalService(null)
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default Services