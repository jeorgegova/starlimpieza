import React, { useRef, useEffect, useState } from 'react';

const testimonials = [
  {
    text: "Hemos contratado sus servicios en varias ocasiones, siempre han sido puntuales, profesionales y con un trato muy personal, siempre pendientes de todos los detalles. Lo recomendamos!",
    author: "fincas turismopals",
  },
  {
    text: "Excelente servicio! Tengo perros y gatos y el sofá me quedó como nuevo. Muy profesionales en su trabajo, todo hecho impecable.",
    author: "Jade.S",
  },
  {
    text: "Perfecto trato y mejor atencion, una limpieza en mi piso y terraza perfecta en todos los aspectos.",
    author: "Esteve Sandoval Alavedra",
  },
  {
    text: "Estamos muy contentos con los servicios de esta empresa. Los recomendamos ampliamente.",
    author: "Isabelle Brunet",
  },
  {
    text: "Grandes profesionales! Un servicio de 5 estrellas, los contratamos para limpiar nuestra casa y también nos ayudaron con otras dudas que teníamos muy amablemente! Sin dudas los volveremos a llamar.",
    author: "Lisse Ramírez",
  },
  {
    text: "Personal muy profesional. Hace tiempo que nos hace la limpieza y estamos satisfechos. Lo recomendamos!",
    author: "Laura",
  }
];

const mod = (a, b) => ((a % b) + b) % b; // para indexado cíclico (prev/next)

const HorizontalTimelineTestimonials = ({ interval = 3500 }) => {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef();
  const sectionRef = useRef();

  // Intersection Observer para detectar visibilidad
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.3 } // Se activa cuando el 30% de la sección está visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Autoplay cuando la sección está visible
  useEffect(() => {
    if (!isVisible) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrent(prev => mod(prev + 1, testimonials.length));
    }, interval);

    return () => clearInterval(timerRef.current);
  }, [isVisible, interval]);

  // Resetear al primer testimonio cuando la sección se vuelve visible
  useEffect(() => {
    if (isVisible) {
      setCurrent(0);
    }
  }, [isVisible]);

  const goto = idx => {
    setCurrent(idx);
    // Reiniciar el timer después de navegación manual
    clearInterval(timerRef.current);
    if (isVisible) {
      timerRef.current = setInterval(() => {
        setCurrent(prev => mod(prev + 1, testimonials.length));
      }, interval);
    }
  };

  const next = () => goto(mod(current + 1, testimonials.length));
  const prev = () => goto(mod(current - 1, testimonials.length));

  // Pausa el autoplay al hacer hover
  const handleMouseEnter = () => {
    clearInterval(timerRef.current);
  };

  const handleMouseLeave = () => {
    if (isVisible) {
      timerRef.current = setInterval(() => {
        setCurrent(prev => mod(prev + 1, testimonials.length));
      }, interval);
    }
  };

  // Calcula cartas a mostrar (centro, izquierda, derecha, puede variar para más blur aún)
  const getCardState = idx => {
    if (idx === current) return "active";
    if (idx === mod(current - 1, testimonials.length)) return "left";
    if (idx === mod(current + 1, testimonials.length)) return "right";
    return "blur";
  };

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className={`timeline-horizontal-section${isVisible ? ' visible' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={-1}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2>Lo que dicen nuestros clientes</h2>

      <div className="timeline-slider-arrows" style={{ marginBottom: 8 }}>
        <button onClick={prev} aria-label="Anterior" className="slider-arrow">{'‹'}</button>
        <button onClick={next} aria-label="Siguiente" className="slider-arrow">{'›'}</button>
      </div>

      <div className="timeline-slider-stack">
        {testimonials.map((t, idx) => {
          const state = getCardState(idx);
          return (
            <div
              key={idx}
              className={`timeline-card timeline-card-${state}`}
              tabIndex={state === "active" ? 0 : -1}
              aria-selected={state === "active"}
              style={{
                zIndex: state === "active" ? 3 : (state === "left" || state === "right" ? 2 : 1)
              }}
              onClick={() => goto(idx)}
            >
              <div className="timeline-horizontal-marker">
                <div className="timeline-horizontal-dot" />
              </div>
              <div className="timeline-horizontal-content">
                <p>{t.text}</p>
                <p className="author">- {t.author}</p>
              </div>
            </div>
          );
        })}
        <div className="timeline-slider-track" />
      </div>

      <div className="timeline-dots">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            className={`timeline-dot-btn${idx === current ? ' active' : ''}`}
            onClick={() => goto(idx)}
            aria-label={`Ir al testimonio ${idx + 1}`}
          />
        ))}
      </div>

      {/* Indicador de progreso del autoplay */}
      <div className="progress-indicator">
        <div
          key={current}                      // ← Esto fuerza el reinicio de la animación
          className="progress-bar"
          style={{
            animationDuration: `${interval}ms`,
            animationPlayState: isVisible ? 'running' : 'paused',
          }}
        />
      </div>

      <style>{`
        .timeline-horizontal-section {
          padding: 4rem 0 3.1rem 0;
          background: linear-gradient(90deg, #e0f2fe 0%, #f8fafc 90%);
          opacity: 0;
          transition: opacity 1.2s;
          overflow-x: hidden;
          width: 100vw;
          position: relative;
        }
        .timeline-horizontal-section.visible {
          opacity: 1;
        }
        .timeline-horizontal-section h2 {
          text-align: center;
          font-size: 2.05rem;
          color: #334155;
          margin-bottom: 2.8rem;
        }
        .timeline-slider-arrows {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 10px;
        }
        .slider-arrow {
          font-size: 2.2rem;
          border: none;
          background: transparent;
          color: #38bdf8;
          cursor: pointer;
          padding: 0 10px;
          transition: all 0.2s;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .slider-arrow:hover {
          color: #2563eb;
          background: rgba(56, 189, 248, 0.1);
          transform: scale(1.1);
        }
        .timeline-slider-stack {
          position: relative;
          max-width: 860px;
          width: 96vw;
          margin: 0 auto;
          min-height: 260px;
          padding-top: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .timeline-card {
          position: absolute;
          left: 50%;
          top: 36px;
          transform: translateX(-50%);
          width: 54vw;
          min-width: 280px;
          max-width: 650px;
          background: #fff;
          border-radius: 20px;
          border: 2px solid #bae6fd;
          box-shadow: 0 6px 36px rgba(56,189,248,0.11);
          padding: 2rem 1.6rem 1.4rem 3.4rem;
          opacity: 0;
          filter: blur(12px);
          pointer-events: none;
          transition:
            filter 0.54s cubic-bezier(.78,0,.26,1),
            opacity 0.49s cubic-bezier(.78,0,.26,1),
            box-shadow 0.23s,
            border-color 0.2s,
            transform 0.56s cubic-bezier(.75,.05,.18,.98);
          min-height: 185px;
          cursor: pointer;
        }
        .timeline-card-active {
          opacity: 1;
          filter: blur(0);
          pointer-events: auto;
          box-shadow: 0 12px 46px 0px #38bdf866, 0 0 2px #818cf8c3;
          border-color: #38bdf8;
          transform: translateX(-50%) scale(1.01) translateY(-12px);
        }
        .timeline-card-left {
          opacity: 1;
          filter: blur(2.5px);
          pointer-events: auto;
          transform: translateX(calc(-120% - 24px)) scale(0.92) translateY(16px);
        }
        .timeline-card-right {
          opacity: 1;
          filter: blur(2.5px);
          pointer-events: auto;
          transform: translateX(calc(40% + 24px)) scale(0.92) translateY(16px);
        }
        .timeline-card-blur {
          opacity: 0;
          filter: blur(12px);
          pointer-events: none;
        }
        .timeline-horizontal-marker {
          position: absolute;
          left: -45px;
          top: 38px;
        }
        .timeline-horizontal-dot {
          width: 26px;
          height: 26px;
          background: linear-gradient(135deg,#38bdf8 65%,#818cf8 100%);
          border-radius: 50%;
          border: 3.7px solid #fff;
          box-shadow: 0 0 0 6px #bae6fd33, 0 2px 12px #818cf850;
          transition: all 0.3s ease;
        }
        .timeline-card-active .timeline-horizontal-dot {
          box-shadow: 0 0 17px 8px #38bdf87e, 0 3px 16px #818cf899;
          transform: scale(1.1);
        }
        .timeline-horizontal-content p {
          margin: 0 0 .7rem;
          line-height: 1.6;
        }
        .timeline-horizontal-content .author {
          text-align: right;
          font-style: italic;
          margin-top: .65rem;
          color: #38bdf8;
          font-size: 1.15rem;
          font-weight: 500;
        }
        .timeline-slider-track {
          position: absolute;
          left: 0;
          right: 0;
          top: 64px;
          height: 8px;
          background: repeating-linear-gradient(
              90deg, #38bdf8 0 60px, #818cf8 60px 120px
            );
          opacity: 0.18;
          filter: blur(7px);
          border-radius: 6px;
          z-index: 0;
        }
        .timeline-dots {
          display: flex;
          justify-content: center;
          gap: 14px;
          margin-top: 14px;
        }
        .timeline-dot-btn {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: none;
          background: #bae6fd;
          cursor: pointer;
          transition: all 0.18s;
        }
        .timeline-dot-btn:hover {
          background: #38bdf8;
          transform: scale(1.2);
        }
        .timeline-dot-btn.active {
          background: #38bdf8;
          box-shadow: 0 0 0 4px #38bdf85c;
          transform: scale(1.1);
        }
        .progress-indicator {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 4px;
          background: rgba(56, 189, 248, 0.2);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, #38bdf8, #818cf8);
          border-radius: 2px;
          transform: translateX(-100%);
          animation: progress linear infinite;
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        @media (max-width: 900px) {
          .timeline-card { width: 90vw !important; min-width: 200px; max-width: 98vw !important; }
          .timeline-slider-stack { width: 100vw; }
          .progress-indicator { width: 150px; }
        }
        @media (max-width: 650px) {
          .timeline-horizontal-section h2 { font-size: 1.8rem;}
          .timeline-card { padding-left: 1.2rem; font-size: .98em;}
          .timeline-horizontal-marker{left:-30px;}
          .slider-arrow { font-size: 1.8rem; width: 40px; height: 40px; }
          .progress-indicator { width: 120px; }
        }
      `}</style>
    </section>
  );
};

export default HorizontalTimelineTestimonials;
