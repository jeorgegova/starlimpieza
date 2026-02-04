import React, { useRef, useEffect, useState } from "react";

const valores = [
  { titulo: "Responsabilidad y Transparencia", texto: "Somos una empresa responsable y transparente, tanto con nuestros clientes como con nuestros trabajadores.", color: "#17689d" },
  { titulo: "Calidad", texto: "Garantizamos resultados impecables con los mejores productos y técnicas.", color: "#17689d" },
  { titulo: "Rapidez y Eficiencia", texto: "Nos diferenciamos en la rapidez, acompañada de una formación continua de nuestros trabajadores, provocando que nuestro cliente pague menos horas de servicio, obteniendo una limpiezas impecable e incluso mejor que la de la competencia.", color: "#17689d" },
  { titulo: "Cuidado de Trabajadores", texto: "Creemos y defendemos la ideología de cuidar a nuestros trabajadores, sus derechos y la igualdad. Según la investigación de Oxford, los trabajadores alegres son un 13% más productivos.", color: "#17689d" }
];

const bubbleArray = [
  { size: 70, left: "12%", delay: "0s", dur: "13s", topFrom: "92%", topTo: "-16%", opacity: 0.26 },
  { size: 100, left: "26%", delay: "4s", dur: "17s", topFrom: "96%", topTo: "-9%", opacity: 0.19 },
  { size: 60, left: "53%", delay: "2s", dur: "15s", topFrom: "88%", topTo: "-13%", opacity: 0.23 },
  { size: 120, left: "77%", delay: "6s", dur: "21s", topFrom: "90%", topTo: "-18%", opacity: 0.22 },
  { size: 48, left: "36%", delay: "8s", dur: "11s", topFrom: "84%", topTo: "-10%", opacity: 0.20 },
  { size: 85, left: "71%", delay: "1s", dur: "18s", topFrom: "81%", topTo: "-10%", opacity: 0.17 },
];

const AboutUs = () => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setIsVisible(entry.isIntersecting)),
      { threshold: 0.3 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      id="aboutUs"
      className={`about-float-section${isVisible ? " about-float-active" : ""}`}
    >
      {/* Burbujas de fondo */}
      <div className="about-bubbles-bg" aria-hidden="true">
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
          ></div>
        ))}
      </div>

      <div className="about-container">
        <div className="about-header">
          <span className="about-badge">Sobre Nosotros</span>
          <h1 className="about-title">Comprometidos con la calidad y el buen servicio</h1>
        </div>

        {/* Contenido */}
        <div className="about-float-content">
          {/* Tarjeta Quiénes somos */}
          <div className="about-card">
            <h2>Quiénes somos</h2>
            <p style={{ textAlign: 'justify' }}>
              En <strong>Star Limpiezas</strong> somos una empresa líder en servicios de limpieza profesional en Girona y toda la Costa Brava. Con sede en Mont-ras, provincia de Girona, nuestro equipo de profesionales altamente cualificados trabaja con compromiso y eficiencia para ofrecer soluciones personalizadas adaptadas a cada cliente.
              <br /> <br />
              Con más de 10 años de experiencia, nos hemos consolidado como la empresa de referencia en el Baix Empordà, Alt Empordà y toda la provincia. Nuestra trayectoria se basa en la confianza de hogares, comunidades, restaurantes, hoteles y propiedades Airbnb.
              <br /> <br />
              Ofrecemos limpieza de hogares, propiedades turísticas y Airbnb, comunidades, oficinas, restaurantes, cristales profesionales, garajes y servicios forestales especializados.
            </p>

            <div className="about-float-highlight-card fadeUp">
              <div>
                <div className="hi-title">Misión</div>
                <div className="hi-desc">
                  Brindar servicios de limpieza y mantenimiento de alta calidad, garantizando espacios impecables, seguros y confortables. Soluciones personalizadas y productos respetuosos con el medio ambiente.
                </div>
              </div>
            </div>
            <div className="about-float-highlight-card fadeUp" style={{ animationDelay: '0.18s' }}>
              <div>
                <div className="hi-title">Visión</div>
                <div className="hi-desc">
                  Ser la empresa de limpieza de referencia, destacándonos por eficiencia, confianza y compromiso. Innovar y mejorar constantemente para seguir creciendo en el sector.
                </div>
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="about-float-values-area">
            <div className="values-carousel-title">Nuestros valores</div>
            <div className="about-float-values-carousel">
              {valores.map((valor, i) => (
                <div
                  className="valor-float-card"
                  style={{
                    borderLeft: `5px solid ${valor.color}`,
                    animationDelay: `${0.27 + i * 0.12}s`
                  }}
                  key={i}
                >
                  <div>
                    <div className="valor-j-title">{valor.titulo}</div>
                    <div className="valor-j-text">{valor.texto}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="about-highlight">
              Nuestra prioridad es la satisfacción del cliente, asegurando un servicio puntual, seguro y de calidad en cada intervención.
            </div>
          </div>
        </div>
      </div>
      {/* Estilos */}
      <style>{`
        .about-float-section {
          position: relative;
          width: 95vw;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          background: #fff;
          overflow: hidden;
          padding: 4rem 2rem;
        }
        .about-bubbles-bg {
          pointer-events: none;
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          overflow: hidden;
          z-index: 0;
        }
        .bubble {
          position: absolute;
          background: radial-gradient(ellipse at 60% 36%, #bee8f9 75%, #b0f7db 120%, #fff 180%);
          box-shadow: 0 8px 32px #93d4ff16;
          border-radius: 50%;
          filter: blur(0.8px);
          will-change: transform,opacity;
          animation-name: bubbleUp;
          animation-timing-function: cubic-bezier(.33,.6,.6,1);
          animation-iteration-count: infinite;
        }
        @keyframes bubbleUp {
          from { top: var(--bblTopFrom); opacity: inherit; }
          to   { top: var(--bblTopTo); opacity: 0.04; }
        }
        .about-float-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1100px;
          display: flex;
          gap: 3rem;
        }
        .about-card {
          flex: 1.5;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(14px);
          border-radius: 2rem;
          padding: 2rem;
          box-shadow: 0 12px 35px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          opacity: 0;
          transform: translateY(50px);
          transition: all 1s ease;
        }
        .about-float-active .about-card { opacity: 1; transform: none; }

        .about-card h2 { font-size: 2rem; font-weight: 800; color: #165180; margin-bottom: 1rem; }
        .about-card p { font-size: 1rem; color: #244062; line-height: 1.7; }
        .about-bold { font-weight: 700; color: #17689d; display: inline-block; margin-top: 0.5rem; }
        .about-float-highlight-card {
          display: flex;
          flex-direction: column;
          background: rgba(237,247,255,0.9);
          border-radius: 1rem;
          margin-top: 1rem;
          padding: 1rem 1.2rem;
          opacity: 0;
          transform: translateY(35px);
          animation: fadeUpCard 0.8s forwards;
        }
        .about-float-active .about-float-highlight-card { opacity: 1; transform: none; }
        .hi-title { font-weight: 700; color: #0383cc; font-size: 1rem; margin-bottom: 0.3rem; }
        .hi-desc { font-size: 0.95rem; color: #2c455e; }

        .about-float-values-area { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
        .values-carousel-title { font-weight: 700; color: #09597b; font-size: 1.1rem; margin-bottom: 0.8rem; }
        .about-float-values-carousel { display: flex; flex-direction: column; gap: 0.9rem; }
        .valor-float-card {
          background: rgba(248,252,255,0.8);
          border-radius: 1rem;
          padding: 0.9rem 1.2rem;
          transition: all .25s;
          border-left: 5px solid transparent;
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
        .about-highlight {
          margin-top: 1.5rem;
          padding: 1.25rem;
          background: #f1f5f9;
          border-radius: 1rem;
          color: #0f172a;
          font-weight: 600;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .valor-float-card:hover {
          transform: translateY(-6px);
          border-left: 5px solid #2563eb;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        .valor-j-title { font-weight: 700; color: #0071c9; font-size: 1rem; margin-bottom: 0.2rem; }
        .valor-j-text { font-size: 0.95rem; color: #486b8a; }
        @keyframes fadeUpCard { from{opacity:0; transform:translateY(35px);} to{opacity:1; transform:none;} }

        /* Tablet */
        @media (max-width: 900px){
          .about-float-content {
            flex-direction: column;
            gap: 2rem;
          }
          .about-card {
            font-size: 0.98rem;
            padding: 1.1rem;
            border-radius: 1.2rem;
          }
          .about-float-values-area {
            padding-bottom: 1.2rem;
          }
        }
        /* Celular */
        @media (max-width: 600px){
          .about-float-section {
            padding: 2.1rem 0.7rem 2.1rem 0.7rem;
          }
          .about-float-content {
            max-width: 98vw;
            gap: 1rem;
          }
          .about-card{
            padding: 1rem 0.8rem;
            border-radius: 1.1rem;
          }
          .about-card h2{ font-size: 1.27rem; }
          .about-card p, .about-bold{ font-size:0.98rem; }
          .about-float-highlight-card{ padding:0.7rem 0.7rem;}
          .hi-title, .valor-j-title{ font-size:0.91rem;}
          .hi-desc, .valor-j-text{ font-size:0.89rem;}
          .valor-float-card { border-radius: 0.75rem; padding:0.6rem 0.75rem;}
        }
        @media (max-width:420px){
          .about-card{ padding:0.5rem 0.42rem;}
        }
      `}</style>
    </section>
  );
};

export default AboutUs;