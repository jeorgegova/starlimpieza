import React, { useEffect, useState } from 'react';

const Services = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [foamDirection, setFoamDirection] = useState('none');

  const services = [
    {
      id: 1,
      title: "Limpieza",
      image: "https://via.placeholder.com/100?text=Trapeador",
      description: "Ofrecemos un servicio integral de limpieza para hogares, oficinas, comunidades y locales comerciales. Utilizamos productos de alta calidad y técnicas innovadoras para garantizar espacios impecables y saludables. Nos adaptamos a sus necesidades, proporcionando limpieza periódica o puntual con un equipo profesional y eficiente."
    },
    {
      id: 2,
      title: "Limpieza de cambios turísticos",
      image: "https://via.placeholder.com/100?text=Hotel",
      description: "Nos encargamos de la limpieza y preparación de alojamientos turísticos entre estancias. Garantizamos espacios impecables, ordenados y listos para recibir a nuevos huéspedes, cumpliendo con los más altos estándares de higiene y rapidez para optimizar la rotación de clientes."
    },
    {
      id: 3,
      title: "Limpiezas forestales",
      image: "https://via.placeholder.com/100?text=Árboles",
      description: "Realizamos limpiezas forestales para prevenir incendios y mantener el equilibrio ecológico. Nuestro equipo elimina restos vegetales, maleza y residuos en terrenos, garantizando un entorno seguro y limpio, cumpliendo con la normativa vigente."
    },
    {
      id: 4,
      title: "Limpieza de cristales",
      image: "https://via.placeholder.com/100?text=Cristales",
      description: "Nos especializamos en la limpieza de cristales, utilizando productos de alta calidad y técnicas avanzadas para obtener resultados excepcionales. Ya sea para su hogar, oficina o negocio, nuestros profesionales aseguran que sus cristales luzcan perfectos, sin rayas ni residuos."
    },
    {
      id: 5,
      title: "Terrenos",
      image: "https://via.placeholder.com/100?text=Terrenos",
      description: "Ofrecemos terrenos en venta en Girona y alrededores. Disponemos de diferentes opciones según sus necesidades, desde solares para construcción hasta terrenos rústicos. Le asesoramos en todo el proceso para que encuentre la mejor opción para su inversión."
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const servicesSection = document.getElementById('services');
      if (!servicesSection) return;

      const sectionTop = servicesSection.offsetTop;
      const sectionHeight = servicesSection.offsetHeight;
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calcular el progreso del scroll dentro de la sección
      const sectionStart = sectionTop - windowHeight / 2;
      const sectionEnd = sectionTop + sectionHeight - windowHeight / 2;
      const scrollProgress = Math.max(0, Math.min(1, 
        (scrollPosition - sectionStart) / (sectionEnd - sectionStart)
      ));
      
      // Determinar qué carta debe mostrarse basado en el progreso
      const totalCards = services.length;
      const cardIndex = Math.floor(scrollProgress * totalCards);
      const newCurrentCard = Math.min(cardIndex, totalCards - 1);
      
      setCurrentCard(newCurrentCard);
      
      // Efecto de espuma
      if (scrollProgress > 0.1 && scrollProgress < 0.9) {
        setFoamDirection('up');
      } else {
        setFoamDirection('down');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [services.length]);

  return (
    <section
      id="services"
      style={{
        padding: '4rem 2rem',
        backgroundColor: '#fff',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '200vh' // Altura suficiente para permitir scroll
      }}
    >
      {/* Efecto de espuma */}
      <div
        style={{
          position: 'absolute',
          top: foamDirection === 'up' ? '0' : 'auto',
          bottom: foamDirection === 'down' ? '0' : 'auto',
          left: 0,
          right: 0,
          height: foamDirection !== 'none' ? '100px' : '0',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)',
          boxShadow: '0 0 20px rgba(255,255,255,0.8)',
          transform: foamDirection === 'up' ? 'translateY(-100%)' : foamDirection === 'down' ? 'translateY(100%)' : 'none',
          transition: 'transform 0.8s ease-in-out, height 0.8s ease-in-out',
          zIndex: 10,
        }}
      />
      
      <h2 style={{ 
        textAlign: 'center', 
        fontSize: '2rem', 
        marginBottom: '3rem', 
        color: '#333', 
        zIndex: 5,
        position: 'relative'
      }}>
        Nuestros servicios de limpieza en Girona
      </h2>
      
      {/* Container de carta única centrada */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        minHeight: '500px',
        perspective: '1000px'
      }}>
        
        {/* Stack de cartas */}
        <div style={{
          position: 'relative',
          width: '400px',
          height: '500px'
        }}>
          {services.map((service, index) => {
            const isActive = index === currentCard;
            const isBelow = index < currentCard;
            const isAbove = index > currentCard;
            const isEven = index % 2 === 0;
            
            return (
              <div
                key={service.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                  transform: isActive 
                    ? 'translateX(0) translateY(0) rotateY(0deg) rotateZ(0deg) scale(1)' 
                    : isBelow 
                    ? `translateX(0) translateY(${index * -2}px) rotateZ(${index * -1}deg) scale(0.98)`
                    : `translateX(${isEven ? '-120vw' : '120vw'}) translateY(-50px) rotateY(${isEven ? '-45deg' : '45deg'}) rotateZ(${isEven ? '-15deg' : '15deg'}) scale(0.9)`,
                  opacity: isAbove ? 0 : 1,
                  zIndex: isActive ? 10 : (services.length - index),
                  transformOrigin: 'center center'
                }}
              >
                {/* Carta */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: isActive 
                      ? '0 20px 40px rgba(0,0,0,0.15), 0 0 0 2px rgba(255,255,255,0.2)' 
                      : '0 4px 15px rgba(0,0,0,0.05)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: `2px solid ${isActive ? '#4a90e2' : '#e9ecef'}`,
                    background: isActive 
                      ? 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)' 
                      : '#f9f9f9',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Efecto de brillo cuando se activa */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                        transform: 'translateX(100%)',
                        animation: 'shine 1.5s ease-in-out',
                        pointerEvents: 'none'
                      }}
                    />
                  )}
                  
                  {/* Contenido de la carta */}
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      style={{ 
                        marginBottom: '1rem',
                        borderRadius: '50%',
                        border: `3px solid ${isActive ? '#4a90e2' : '#e9ecef'}`,
                        transition: 'all 0.3s ease',
                        transform: isActive ? 'scale(1.1)' : 'scale(1)'
                      }} 
                    />
                    <h3 style={{ 
                      color: isActive ? '#4a90e2' : '#333',
                      fontSize: '1.4rem',
                      marginBottom: '1rem',
                      fontWeight: '600',
                      transition: 'color 0.3s ease'
                    }}>
                      {service.title}
                    </h3>
                  </div>
                  
                  <p style={{ 
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#666',
                    position: 'relative',
                    zIndex: 2,
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {service.description}
                  </p>
                  
                  {/* Indicador de carta activa */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #4a90e2, #7b68ee)',
                        boxShadow: '0 0 10px rgba(74, 144, 226, 0.5)',
                        animation: 'pulse 2s infinite'
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Indicador de progreso */}
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {services.map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: index === currentCard ? '#4a90e2' : '#ddd',
                transition: 'all 0.3s ease',
                transform: index === currentCard ? 'scale(1.5)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
    </section>
  );
};

export default Services;