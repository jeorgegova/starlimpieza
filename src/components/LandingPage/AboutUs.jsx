import React, { useRef, useEffect, useState } from "react";

const valores = [
  { 
    titulo: "Responsabilidad y Transparencia", 
    texto: "Somos una empresa responsable y transparente, tanto con nuestros clientes como con nuestros trabajadores.", 
    color: "white",
    icon: "🤝"
  },
  { 
    titulo: "Rapidez y Eficiencia", 
    texto: "Nos diferenciamos en la rapidez, acompañada de una formación continua de nuestros trabajadores, provocando que nuestro cliente pague menos horas de servicio, obteniendo una limpiezas impecable e incluso mejor que la de la competencia.", 
    color: "white",
    icon: "⚡"
  },
  { 
    titulo: "Cuidado de Trabajadores", 
    texto: "Creemos y defendemos la ideología de cuidar a nuestros trabajadores, sus derechos y la igualdad. Según la investigación de Oxford, los trabajadores alegres son un 13% más productivos.", 
    color: "white",
    icon: "💼"
  }
];

const bubbleArray = [
  { size: 70, left: "12%", delay: "0s", dur: "13s", topFrom: "92%", topTo: "-16%", opacity: 0.2 },
  { size: 100, left: "26%", delay: "4s", dur: "17s", topFrom: "96%", topTo: "-9%", opacity: 0.15 },
  { size: 60, left: "53%", delay: "2s", dur: "15s", topFrom: "88%", topTo: "-13%", opacity: 0.18 },
  { size: 120, left: "77%", delay: "6s", dur: "21s", topFrom: "90%", topTo: "-18%", opacity: 0.17 },
  { size: 48, left: "36%", delay: "8s", dur: "11s", topFrom: "84%", topTo: "-10%", opacity: 0.16 },
  { size: 85, left: "71%", delay: "1s", dur: "18s", topFrom: "81%", topTo: "-10%", opacity: 0.14 },
];

const AboutUs = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setIsVisible(entry.isIntersecting)),
      { threshold: 0.2 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      id="aboutUs"
      className={`about-section ${isVisible ? "section-visible" : ""}`}
    >
      {/* Burbujas de fondo */}
      <div className="bubbles-container" aria-hidden="true">
        {bubbleArray.map((b, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              opacity: b.opacity,
              animationDelay: b.delay,
              animationDuration: b.dur,
              top: b.topFrom,
              "--bblTopFrom": b.topFrom,
              "--bblTopTo": b.topTo,
            }}
          />
        ))}
      </div>

      <div className="about-container">
        {/* Header */}
        <div className="about-header">
          <span className="about-badge">Sobre Nosotros</span>
          <h1 className="about-title">Quiénes Somos - Star Limpiezas</h1>
        </div>

        {/* Contenido principal */}
        <div className="about-main">
          {/* Quiénes somos */}
          <div className="about-card fade-up">
            <p>
              En <strong>Star Limpiezas</strong> somos una empresa líder en servicios de limpieza profesional en Girona y toda la Costa Brava. Con sede en Mont-ras, provincia de Girona, nuestro equipo de profesionales altamente cualificados trabaja con compromiso y eficiencia para ofrecer soluciones personalizadas adaptadas a cada cliente.
            </p>
            <p>
              Con más de 10 años de experiencia, nos hemos consolidado como la empresa de referencia en el Baix Empordà, Alt Empordà y toda la provincia. Nuestra trayectoria se basa en la confianza de hogares, comunidades, restaurantes, hoteles y propiedades Airbnb.
            </p>
            <p>
              Ofrecemos limpieza de hogares, propiedades turísticas y Airbnb, comunidades, oficinas, restaurantes, cristales profesionales, garajes y servicios forestales especializados.
            </p>
            <div className="about-highlight">
              Nuestra prioridad es la satisfacción del cliente, asegurando un servicio puntual, seguro y de calidad en cada intervención.
            </div>
          </div>

          {/* Valores */}
          <div className="values-section fade-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="section-title">Nuestros Valores</h2>
            <div className="values-grid">
              {valores.map((valor, i) => (
                <div 
                  key={i} 
                  className="value-card"
                  style={{ 
                    '--accent-color': valor.color,
                    animationDelay: `${0.3 + i * 0.1}s`
                  }}
                >
                  <span className="value-icon">{valor.icon}</span>
                  <h3 className="value-title">{valor.titulo}</h3>
                  <p className="value-text">{valor.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="mv-section fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="mv-grid">
            <div className="mv-card mission-card">
              <div className="mv-header">
                <h3 className="mv-title">Misión</h3>
              </div>
              <p className="mv-text">
                Obtener la satisfacción de nuestros clientes, estableciendo una relación laboral para largo plazo, que nos permita cubrir sus necesidades de limpieza, con el mejor servicio y calidad. Siempre teniendo en cuenta el cuidado del medio ambiente.
              </p>
            </div>
            <div className="mv-card vision-card">
              <div className="mv-header">
                <h3 className="mv-title">Visión</h3>
              </div>
              <p className="mv-text">
                Destacando nuestra eficiencia y credibilidad, con nuestros propios resultados, a través de procesos de mejora continua, enfocados hacia el cliente, lo cual nos lleva a una fidelización. Un cliente satisfecho nos volverá a llamar y con el «boca a boca» nos ayudará a llegar a más clientes, permitiéndonos posicionarnos más en el mercado y expandirnos a diferentes localidades.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos */}
      <style>{`
        .about-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #f8fafc;
          overflow: hidden;
          padding: 5rem 2rem;
        }
        
        .bubbles-container {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        
        .bubble {
          position: absolute;
          background: radial-gradient(circle at 30% 30%, rgba(190, 227, 248, 0.4), rgba(190, 227, 248, 0.1));
          border: 1px solid rgba(190, 227, 248, 0.3);
          border-radius: 50%;
          will-change: transform, opacity;
          animation-name: bubbleUp;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        
        @keyframes bubbleUp {
          from { top: var(--bblTopFrom); opacity: inherit; }
          to   { top: var(--bblTopTo); opacity: 0; }
        }
        
        .about-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .about-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .about-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: #0f172a;
          color: white;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2);
        }
        
        .about-title {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
        }
        
        .about-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }
        
        .about-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.06);
        }
        
        .about-card p {
          color: #475569;
          line-height: 1.8;
          margin-bottom: 1.25rem;
          font-size: 1rem;
          text-align: justify;
        }
        
        .about-card p:last-of-type {
          margin-bottom: 1.25rem;
        }
        
        .about-card strong {
          color: #0f172a;
          font-weight: 600;
        }
        
        .about-highlight {
          margin-top: 1.5rem;
          padding: 1.25rem;
          background: #f1f5f9;
          border-radius: 1rem;
          border-left: 3px solid #0ea5e9;
          color: #0f172a;
          font-weight: 600;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 1.5rem;
        }
        
        .values-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .value-card {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-left: 4px solid var(--accent-color);
          transition: all 0.3s ease;
        }
        
        .value-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }
        
        .value-icon {
          font-size: 1.75rem;
          display: block;
          margin-bottom: 0.75rem;
        }
        
        .value-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 0.5rem;
        }
        
        .value-text {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
        }
        
        .mv-section {
          margin-top: 1rem;
        }
        
        .mv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        
        .mv-card {
          background: white;
          border-radius: 1.5rem;
          padding: 2.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }
        
        .mission-card {
          border-top: 3px solid #0ea5e9;
        }
        
        .vision-card {
          border-top: 3px solid #22c55e;
        }
        
        .mv-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
        }
        
        .mv-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        
        .mv-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        
        .mv-text {
          color: #475569;
          line-height: 1.75;
          font-size: 0.95rem;
          margin: 0;
        }
        
        /* Animaciones */
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .section-visible .fade-up {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Responsive */
        @media (max-width: 968px) {
          .about-main {
            grid-template-columns: 1fr;
          }
          
          .mv-grid {
            grid-template-columns: 1fr;
          }
          
          .about-card {
            padding: 2rem;
          }
          
          .value-card {
            padding: 1.25rem;
          }
          
          .mv-card {
            padding: 2rem;
          }
        }
        
        @media (max-width: 640px) {
          .about-section {
            padding: 3rem 1rem;
          }
          
          .about-card {
            padding: 1.5rem;
            border-radius: 1.25rem;
          }
          
          .mv-card {
            padding: 1.5rem;
            border-radius: 1.25rem;
          }
          
          .value-card {
            padding: 1.25rem;
          }
          
          .about-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutUs;