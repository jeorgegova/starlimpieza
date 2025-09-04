import React, { useEffect, useRef } from 'react';

const Services = ({ active, currentCard, setCurrentCard, onComplete }) => {
  const isTransitioning = useRef(false);
  const containerRef = useRef(null);
  const lastScrollTime = useRef(0);

  const services = [
    {
      id: 1,
      title: "Limpieza Residencial",
      image: "🏠",
      description: "Servicios integrales de limpieza para hogares con tecnología avanzada y productos eco-friendly",
      color: "#4a90e2",
      bgGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 2,
      title: "Turismo & Airbnb",
      image: "🏨",
      description: "Limpieza especializada entre huéspedes con protocolos de higiene premium",
      color: "#e74c3c",
      bgGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      id: 3,
      title: "Servicios Forestales",
      image: "🌲",
      description: "Mantenimiento ecológico y prevención de incendios con equipo especializado",
      color: "#27ae60",
      bgGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    {
      id: 4,
      title: "Cristales Premium",
      image: "✨",
      description: "Limpieza de cristales con técnicas nanotecnológicas para resultados impecables",
      color: "#9b59b6",
      bgGradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    },
    {
      id: 5,
      title: "Gestión de Terrenos",
      image: "🏗️",
      description: "Consultoría y venta de terrenos con asesoramiento integral personalizado",
      color: "#f39c12",
      bgGradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
    }
  ];

  // Notificar estado de completado
  useEffect(() => {
    if (currentCard === services.length - 1) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  }, [currentCard, onComplete, services.length]);

  // Control del scroll con debounce
  useEffect(() => {
    if (!active) return;

    const handleWheel = (e) => {
      const now = Date.now();
      if (isTransitioning.current || now - lastScrollTime.current < 800) {
        e.preventDefault();
        return;
      }

      // Permitir que el evento se propague a App.jsx si estamos en los límites
      if (
        (e.deltaY < 0 && currentCard === 0) || // Scroll hacia arriba en la primera tarjeta
        (e.deltaY > 0 && currentCard === services.length - 1) // Scroll hacia abajo en la última tarjeta
      ) {
        return; // No prevenir el evento, dejar que App.jsx lo maneje
      }

      // Manejar transiciones internas de tarjetas
      e.preventDefault();
      isTransitioning.current = true;
      lastScrollTime.current = now;

      if (e.deltaY > 0 && currentCard < services.length - 1) {
        setCurrentCard(prev => {
          console.log(`Moving to next card: ${prev + 1}`);
          return prev + 1;
        });
      } else if (e.deltaY < 0 && currentCard > 0) {
        setCurrentCard(prev => {
          console.log(`Moving to previous card: ${prev - 1}`);
          return prev - 1;
        });
      }

      setTimeout(() => {
        isTransitioning.current = false;
      }, 800);
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      document.removeEventListener('wheel', handleWheel);
      isTransitioning.current = false;
    };
  }, [active, currentCard, setCurrentCard, services.length]);

  // Efectos de mouse 3D
  const handle3DEffect = (e, cardElement) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    cardElement.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale3d(1.05, 1.05, 1.05)
    `;
  };

  const resetCard = (cardElement) => {
    cardElement.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section
      id="services"
      ref={containerRef}
      style={{
        height: '100vh',
        background: services[currentCard]?.bgGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 1s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.4)',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 4 + 3}s ease-in-out infinite alternate`,
              animationDelay: Math.random() * 2 + 's'
            }}
          />
        ))}
      </div>

      <h2 style={{
        position: 'absolute',
        top: '8%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '3.5rem',
        color: 'white',
        textShadow: '0 4px 20px rgba(0,0,0,0.4)',
        fontWeight: '800',
        zIndex: 10,
        letterSpacing: '2px',
        textAlign: 'center',
        opacity: active ? 1 : 0,
        transition: 'all 0.8s ease'
      }}>
        Servicios de Élite
      </h2>

      <div style={{
        position: 'relative',
        width: '500px',
        height: '600px',
        perspective: '1500px'
      }}>
        {services.map((service, index) => {
          const isActive = index === currentCard;
          const offset = index - currentCard;
          const isVisible = Math.abs(offset) <= 2;
          
          return (
            <div
              key={service.id}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
                transition: 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: isActive
                  ? 'translateX(0) translateZ(0) rotateY(0deg) scale(1)'
                  : `translateX(${offset * 120}px) translateZ(${Math.abs(offset) * -250}px) rotateY(${offset * 20}deg) scale(${1 - Math.abs(offset) * 0.15})`,
                opacity: isVisible ? (isActive ? 1 : 0.3 - Math.abs(offset) * 0.15) : 0,
                zIndex: isActive ? 100 : (100 - Math.abs(offset)),
                pointerEvents: isActive ? 'auto' : 'none'
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '25px',
                  padding: '2.5rem',
                  boxShadow: isActive 
                    ? '0 35px 70px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)'
                    : '0 15px 30px rgba(0,0,0,0.15)',
                  backdropFilter: 'blur(20px)',
                  border: `3px solid ${service.color}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease'
                }}
                onMouseMove={(e) => isActive && handle3DEffect(e, e.currentTarget)}
                onMouseLeave={(e) => isActive && resetCard(e.currentTarget)}
              >
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `linear-gradient(45deg, transparent 30%, ${service.color}25 50%, transparent 70%)`,
                  transform: isActive ? 'translateX(100%)' : 'translateX(-100%)',
                  transition: 'transform 2.5s ease-in-out',
                  pointerEvents: 'none'
                }} />

                <div style={{ textAlign: 'center', zIndex: 2 }}>
                  <div style={{
                    fontSize: '4.5rem',
                    marginBottom: '1.5rem',
                    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))',
                    transform: isActive ? 'scale(1)' : 'scale(0.8)',
                    transition: 'transform 0.5s ease'
                  }}>
                    {service.image}
                  </div>
                  
                  <h3 style={{
                    color: service.color,
                    fontSize: '2rem',
                    fontWeight: '800',
                    marginBottom: '1.5rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    lineHeight: '1.2'
                  }}>
                    {service.title}
                  </h3>
                </div>

                <p style={{
                  color: '#333',
                  lineHeight: '1.8',
                  fontSize: '1rem',
                  textAlign: 'center',
                  zIndex: 2,
                  marginBottom: '2rem'
                }}>
                  {service.description}
                </p>

                {isActive && (
                  <button style={{
                    background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)`,
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transform: 'translateY(0)',
                    transition: 'all 0.3s ease',
                    boxShadow: `0 12px 24px ${service.color}50`,
                    alignSelf: 'center',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-3px) scale(1.05)';
                    e.target.style.boxShadow = `0 18px 36px ${service.color}70`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = `0 12px 24px ${service.color}50`;
                  }}>
                    Solicitar Servicio
                  </button>
                )}

                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: isActive 
                    ? `linear-gradient(45deg, ${service.color}, ${service.color}cc)`
                    : 'rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                  transform: `scale(${isActive ? 1 : 0.8})`,
                  transition: 'all 0.4s ease',
                  boxShadow: isActive ? `0 8px 16px ${service.color}40` : 'none'
                }}>
                  {index + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '15px',
        zIndex: 200
      }}>
        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => !isTransitioning.current && setCurrentCard(index)}
            style={{
              width: index === currentCard ? '40px' : '15px',
              height: '15px',
              borderRadius: '10px',
              background: index === currentCard 
                ? `linear-gradient(45deg, ${service.color}, white)` 
                : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              boxShadow: index === currentCard ? `0 4px 12px ${service.color}60` : 'none',
              border: index === currentCard ? `2px solid white` : '2px solid transparent'
            }}
          />
        ))}
      </div>

      <div style={{
        position: 'absolute',
        bottom: '3%',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize: '0.9rem',
        opacity: 0.8,
        textAlign: 'center',
        textShadow: '0 2px 4px rgba(0,0,0,0.6)',
        fontWeight: '500'
      }}>
        🖱️ Scroll para navegar | Hover sobre las cartas activas
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          100% { transform: translateY(-25px) rotate(180deg); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </section>
  );
};

export default Services;