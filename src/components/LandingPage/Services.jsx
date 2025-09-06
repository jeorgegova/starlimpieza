"use client"

import { useEffect, useRef, useState } from "react";
import img1 from "../../assets/img1.png";
import img2 from "../../assets/img2.png";
import img3 from "../../assets/img3.png";
import img4 from "../../assets/img4.png";
import img5 from "../../assets/img5.png";
import { useNavigate } from "react-router-dom";

const backgrounds = [img1, img2, img3, img4, img5];

const Services = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState(0);
  const [prevBgIndex, setPrevBgIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showEntrance, setShowEntrance] = useState(false);
  const [arrowAnimated, setArrowAnimated] = useState(false);
  const isTransitioning = useRef(false);
  const containerRef = useRef(null);

  const services = [
    {
      id: 1, title: "Limpieza Residencial", image: "🏠",
      description: "Servicios integrales de limpieza para hogares con tecnología avanzada y productos eco-friendly",
      color: "#64748b", bgColor: "#f8fafc",
    },
    {
      id: 2, title: "Turismo & Airbnb", image: "🏨",
      description: "Limpieza especializada entre huéspedes con protocolos de higiene premium",
      color: "#475569", bgColor: "#f1f5f9",
    },
    {
      id: 3, title: "Servicios Forestales", image: "🌲",
      description: "Mantenimiento ecológico y prevención de incendios con equipo especializado",
      color: "#059669", bgColor: "#f0fdf4",
    },
    {
      id: 4, title: "Cristales Premium", image: "✨",
      description: "Limpieza de cristales con técnicas nanotecnológicas para resultados impecables",
      color: "#0284c7", bgColor: "#f0f9ff",
    },
    {
      id: 5, title: "Gestión de Terrenos", image: "🏗️",
      description: "Consultoría y venta de terrenos con asesoramiento integral personalizado",
      color: "#ea580c", bgColor: "#fff7ed",
    },
  ];

  // Crossfade de fondo
  useEffect(() => {
    if (currentCard !== prevBgIndex) {
      setTransitioning(true);
      const timeout = setTimeout(() => {
        setTransitioning(false);
        setPrevBgIndex(currentCard);
      }, 1300);
      return () => clearTimeout(timeout);
    }
  }, [currentCard, prevBgIndex]);

  // Efecto entrada y shake-arrow CADA vez que entra en viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsActive(entry.isIntersecting);
          if (entry.isIntersecting) {
            setShowEntrance(true);
            setArrowAnimated(true);
            setTimeout(() => setArrowAnimated(false), 2500); // Dura 2.5s ahora
          }
        });
      },
      { threshold: 0.47 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCardClick = (index) => {
    if (!isTransitioning.current) {
      isTransitioning.current = true;
      setCurrentCard(index);
      setTimeout(() => { isTransitioning.current = false; }, 800);
    }
  };

  const handleNextCard = () => handleCardClick((currentCard + 1) % services.length);
  const handlePrevCard = () => handleCardClick(currentCard === 0 ? services.length - 1 : currentCard - 1);

  const handleMouseEffect = (e, cardElement) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 50;
    const rotateY = (centerX - x) / 50;
    cardElement.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale(1.02)
    `;
  };
  const resetCard = (cardElement) => {
    cardElement.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <section
      id="services"
      ref={containerRef}
      className={`services-section${isActive ? " focused" : ""}${showEntrance ? " animate-in" : ""}`}
    >
      {/* Fondos solo dentro de services */}
      <div
        className="crossfade-bg"
        style={{
          backgroundImage: `linear-gradient(to bottom,rgba(255,255,255,0.23) 75%, #f8fafc 99%), url(${backgrounds[prevBgIndex]})`,
          opacity: transitioning ? 1 : 1,
          zIndex: 0,
          position: "absolute",
          top: 0, left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div
        className={`crossfade-bg${transitioning ? ' shown' : ''}`}
        style={{
          backgroundImage: `linear-gradient(to bottom,rgba(255,255,255,0.23) 75%, #f8fafc 99%), url(${backgrounds[currentCard]})`,
          opacity: transitioning ? 1 : 0,
          zIndex: 1,
          pointerEvents: "none",
          position: "absolute",
          top: 0, left: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <h2 className={`services-title${showEntrance ? " entrance-title" : ""}`}>Nuestros Servicios</h2>
      <button
        className={`nav-arrow left${arrowAnimated ? ' shake' : ''}`}
        onClick={handlePrevCard}
        tabIndex={0}
        aria-label="Anterior"
      >←</button>
      <button
        className={`nav-arrow right${arrowAnimated ? ' shake' : ''}`}
        onClick={handleNextCard}
        tabIndex={0}
        aria-label="Siguiente"
      >→</button>
      <div className={`cards-container${showEntrance ? " fadein" : ""}`}>
        {services.map((service, index) => {
          const isActiveCard = index === currentCard;
          const offset = index - currentCard;
          const isVisible = Math.abs(offset) <= 2;
          return (
            <div
              key={service.id}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                transform: isActiveCard
                  ? "translateX(0) translateZ(0) rotateY(0deg) scale(1)"
                  : `translateX(${offset * 80}px) translateZ(${Math.abs(offset) * -150}px) rotateY(${offset * 10}deg) scale(${1 - Math.abs(offset) * 0.1})`,
                opacity: isVisible ? (isActiveCard ? 1 : 0.4 - Math.abs(offset) * 0.1) : 0,
                zIndex: isActiveCard ? 100 : 100 - Math.abs(offset),
                pointerEvents: isActiveCard ? "auto" : "none",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: isActiveCard ? "rgba(255, 255, 255, 0.7)" : service.bgColor,
                  backdropFilter: "blur(3px)",
                  borderRadius: "16px",
                  padding: "2rem",
                  boxShadow: isActiveCard
                    ? "0 20px 40px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)"
                    : "0 8px 16px rgba(0,0,0,0.04)",
                  border: `1px solid ${isActiveCard ? service.color + "40" : "rgba(0,0,0,0.06)"}`,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "2rem",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseMove={(e) => isActiveCard && handleMouseEffect(e, e.currentTarget)}
                onMouseLeave={(e) => isActiveCard && resetCard(e.currentTarget)}
              >
                <div
                  style={{
                    flex: "0 0 200px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      fontSize: "4rem",
                      marginBottom: "1rem",
                      transform: isActiveCard ? "scale(1)" : "scale(0.9)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    {service.image}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: isActiveCard ? service.color : "rgba(100, 116, 139, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isActiveCard ? "white" : "#64748b",
                      fontWeight: "500",
                      fontSize: "0.8rem",
                      transform: `scale(${isActiveCard ? 1 : 0.9})`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {index + 1}
                  </div>
                </div>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                    zIndex: 2,
                  }}
                >
                  <h3
                    style={{
                      color: service.color,
                      fontSize: "1.8rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                      lineHeight: "1.3",
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    style={{
                      color: "#64748b",
                      lineHeight: "1.6",
                      fontSize: "1rem",
                      marginBottom: "2rem",
                      textAlign: "left",
                    }}
                  >
                    {service.description}
                  </p>
                  {isActiveCard && (
                    <button
                      style={{
                        background: service.color,
                        color: "white",
                        border: "none",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transform: "translateY(0)",
                        transition: "all 0.2s ease",
                        boxShadow: `0 4px 12px ${service.color}30`,
                        alignSelf: "flex-start",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = `0 6px 16px ${service.color}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = `0 4px 12px ${service.color}30`;
                      }}
                      onClick={() => navigate('/reservas')}
                    >
                      Solicitar Servicio
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="nav-dots">
        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            className={`dot${index === currentCard ? " active" : ""}`}
          />
        ))}
      </div>
      <div className="nav-inst">
        Usa las flechas o indicadores para navegar entre servicios
      </div>
      <style>{`
        .services-section {
          min-height: 82vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 2rem 1rem;
          background: none;
          z-index: 2;
        }
        .services-section.animate-in .cards-container,
        .services-section.animate-in .services-title {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }
        .cards-container {
          position: relative;
          width: 800px;
          height: 360px;
          perspective: 1200px;
          max-width: 90vw;
          z-index: 3;
          opacity: 0;
          transform: translateY(60px);
          pointer-events: none;
          transition: opacity 0.9s cubic-bezier(.42,0,1,1) 0.2s, transform 0.85s cubic-bezier(.42,0,1,1) 0.23s;
        }
        .services-title {
          position: absolute;
          top: 8%;
          left: 50%;
          transform: translateX(-50%) translateY(30px);
          font-size: 2.5rem;
          color: #475569;
          font-weight: 700;
          z-index: 10;
          letter-spacing: 1px;
          text-align: center;
          opacity: 0;
          transition: opacity 0.8s 0.15s, transform 0.8s 0.15s;

          /* 👇 borde azul */
          -webkit-text-stroke: 0.5px white; 
        }
        .services-section.animate-in .services-title {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
        .nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.87);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          color: #64748b;
          z-index: 200;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          outline: none;
        }
        .nav-arrow.left { left: 5%; }
        .nav-arrow.right { right: 5%; }
        .nav-arrow.shake {
          animation: shake-arrow 2.5s cubic-bezier(.2,.8,.43,1.04);
        }
        @keyframes shake-arrow {
          0% { transform: translateY(-50%) translateX(0); }
          6% { transform: translateY(-50%) translateX(-14px);}
          13% { transform: translateY(-50%) translateX(12px);}
          23% { transform: translateY(-50%) translateX(-10px);}
          32% { transform: translateY(-50%) translateX(8px);}
          41% { transform: translateY(-50%) translateX(-7px);}
          50% { transform: translateY(-50%) translateX(5px);}
          60%{ transform: translateY(-50%) translateX(-4px);}
          72% { transform: translateY(-50%) translateX(2px);}
          85%,100% { transform: translateY(-50%) translateX(0);}
        }
        .nav-dots {
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 200;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: rgba(100, 116, 139, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .dot.active {
          width: 24px;
          background: #475569;
        }
        .nav-inst {
          position: absolute;
          bottom: 5%;
          left: 50%;
          transform: translateX(-50%);
          color: #64748b;
          font-size: 0.8rem;
          opacity: 0.7;
          text-align: center;
          font-weight: 400;
          z-index: 3;
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
          transform: scale(1.025);
          z-index: 10;
        }
        @media (max-width:900px) {
          .cards-container { width:98vw;height:320px;}
        }
        @media (max-width:600px) {
          .services-title { font-size:1.6rem;}
          .cards-container { height:240px;}
        }
      `}</style>
    </section>
  );
};

export default Services;
