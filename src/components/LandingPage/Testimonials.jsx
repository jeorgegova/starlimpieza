import React, { useRef, useEffect, useState } from 'react';

// Testimonios de Google
const testimonials = [
  {
    text: "Star limpiezas es una empresa seria. Los empleados nos dejan siempre un apartamento impecable; tanto es así, que la valoración de nuestros huéspedes es siempre un 10/ excelente. Además, si tenemos alguna reserva imprevista, siempre responden a nuestro requerimiento con suma eficacia y amabilidad. Son unos buenos profesionales.",
    author_name: "Carmen Fraile",
    rating: 5,
    relative_time_description: "Hace 5 meses",
    is_owner_response: false,
  },
  {
    text: "David y su equipo nos hizo una limpieza general de la casa, de los sofás y el garaje - un 10 todo! Eficiencia, nivel de limpieza y amabilidad, todo genial! Muy recomendados!",
    author_name: "Serena Washburn",
    rating: 5,
    relative_time_description: "Hace 6 meses",
    is_owner_response: false,
  },
  {
    text: "Excelente servicio! Tengo perros y gatos y el sofá me quedó como nuevo. Muy profesionales en su trabajo, todo hecho impecable.",
    author_name: "Jade.S",
    rating: 5,
    relative_time_description: "Hace un año",
    is_owner_response: false,
  },
  {
    text: "Grandes profesionales! Un servicio de 5 estrellas, los contratamos para limpiar nuestra casa y también nos ayudaron con otras dudas que teníamos muy amablemente! Sin dudas los volveremos a llamar.",
    author_name: "Lisse Ramírez",
    rating: 5,
    relative_time_description: "Hace 3 años",
    is_owner_response: false,
  },
  {
    text: "Hemos contratado sus servicios en varias ocasiones, siempre han sido puntuales, profesionales y con un trato muy personal, siempre pendientes de todos los detalles. Lo recomendamos!",
    author_name: "fincas turismopals",
    rating: 5,
    relative_time_description: "Hace 2 años",
    is_owner_response: false,
  },
  {
    text: "Perfecto trato y mejor atención, una limpieza en mi piso y terraza perfecta en todos los aspectos.",
    author_name: "Esteve Sandoval Alavedra",
    rating: 5,
    relative_time_description: "Hace un año",
    is_owner_response: false,
  },
  {
    text: "Personal muy profesional. Hace tiempo que nos hace la limpieza y estamos satisfechos. Lo recomendamos!",
    author_name: "Laura",
    rating: 5,
    relative_time_description: "Hace 3 años",
    is_owner_response: false,
  },
  {
    text: "Ha sido nuestra primera vez, y repetiremos con ellos. Grandes profesionales!!!",
    author_name: "Elena Martinez",
    rating: 5,
    relative_time_description: "Hace un año",
    is_owner_response: false,
  },
  {
    text: "Es impecable el servicio y el trato. Lo recomiendo!",
    author_name: "M E",
    rating: 5,
    relative_time_description: "Hace 3 años",
    is_owner_response: false,
  },
  {
    text: "Profesionales y cumplidores. Recomendable 100%. Aspectos positivos: Profesionalidad, Puntualidad, Calidad, Atención al detalle",
    author_name: "Toni Oriol",
    rating: 5,
    relative_time_description: "Hace 3 años",
    is_owner_response: false,
  },
  {
    text: "Empresa muy profesional, con atención a los detalles. Rápidos y eficaces.",
    author_name: "Santos Palazzi",
    rating: 5,
    relative_time_description: "Hace 3 años",
    is_owner_response: false,
  },
  {
    text: "Estoy muy contenta con la persona que me hace la limpieza de hace años.",
    author_name: "ASUNCION SALVADOR",
    rating: 5,
    relative_time_description: "Hace 3 años",
    is_owner_response: false,
  },
  {
    text: "Todo perfecto, son de confianza total. Aspectos positivos: Profesionalidad, Puntualidad, Calidad, Atención al detalle",
    author_name: "Julieta Figueras",
    rating: 5,
    relative_time_description: "Hace 3 años",
    is_owner_response: false,
  },
  {
    text: "Estamos muy satisfechos con los servicios de esta empresa. La recomendamos ampliamente.",
    author_name: "Isabelle Brunet",
    rating: 5,
    relative_time_description: "Hace un año",
    is_owner_response: false,
  },
];

const mod = (a, b) => ((a % b) + b) % b;

const HorizontalTimelineTestimonials = ({ interval = 4000 }) => {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef();
  const sectionRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    if (isVisible) setCurrent(0);
  }, [isVisible]);

  const goto = idx => {
    setCurrent(idx);
    clearInterval(timerRef.current);
    if (isVisible) {
      timerRef.current = setInterval(() => {
        setCurrent(prev => mod(prev + 1, testimonials.length));
      }, interval);
    }
  };

  const next = () => goto(mod(current + 1, testimonials.length));
  const prev = () => goto(mod(current - 1, testimonials.length));

  const handleMouseEnter = () => clearInterval(timerRef.current);
  const handleMouseLeave = () => {
    if (isVisible) {
      timerRef.current = setInterval(() => {
        setCurrent(prev => mod(prev + 1, testimonials.length));
      }, interval);
    }
  };

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
      <h2>Lo que dicen nuestros clientes en Google</h2>

      <div className="timeline-slider-arrows" style={{ marginBottom: 8 }}>
        <button onClick={prev} aria-label="Anterior" className="slider-arrow">‹</button>
        <button onClick={next} aria-label="Siguiente" className="slider-arrow">›</button>
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
                <div style={{ marginBottom: '0.4rem', color: '#e0a800', fontWeight: 700 }}>
                  {Array.from({ length: t.rating }).map((_, i) => <span key={i}>★</span>)}
                  {Array.from({ length: 5 - t.rating }).map((_, i) => <span key={i} style={{ color: '#e0a80055' }}>★</span>)}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <p className="author">
                  - {t.author_name}
                  <span className="time-ago">{t.relative_time_description}</span>
                </p>
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

      <div className="progress-indicator">
        <div
          key={current}
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
          background: linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%);
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
          color: #1e293b;
          margin-bottom: 2.8rem;
          font-weight: 600;
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
          color: #64748b;
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
          color: #1e293b;
          background: rgba(0, 0, 0, 0.05);
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
          border: 2px solid #e2e8f0;
          box-shadow: 0 6px 36px rgba(0, 0, 0, 0.08);
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
          box-shadow: 0 12px 46px 0px rgba(0, 0, 0, 0.12), 0 0 2px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
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
          background: linear-gradient(135deg, #1e293b 65%, #475569 100%);
          border-radius: 50%;
          border: 3.7px solid #fff;
          box-shadow: 0 0 0 6px rgba(0, 0, 0, 0.1), 0 2px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }
        .timeline-card-active .timeline-horizontal-dot {
          box-shadow: 0 0 17px 8px rgba(30, 41, 59, 0.3), 0 3px 16px rgba(0, 0, 0, 0.2);
          transform: scale(1.1);
        }
        .timeline-horizontal-content p {
          margin: 0 0 .7rem;
          line-height: 1.6;
        }
        .timeline-horizontal-content .testimonial-text {
          color: #334155;
          font-size: 1rem;
        }
        .timeline-horizontal-content .author {
          text-align: right;
          margin-top: .65rem;
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
        }
        .timeline-horizontal-content .time-ago {
          font-size: .9em;
          color: #94a3b8;
          font-weight: 400;
          margin-left: 0.5em;
          font-style: normal;
        }
        .timeline-slider-track {
          position: absolute;
          left: 0;
          right: 0;
          top: 64px;
          height: 8px;
          background: repeating-linear-gradient(
              90deg, #1e293b 0 60px, #475569 60px 120px
            );
          opacity: 0.15;
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
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: #cbd5e1;
          cursor: pointer;
          transition: all 0.18s;
        }
        .timeline-dot-btn:hover {
          background: #94a3b8;
          transform: scale(1.2);
        }
        .timeline-dot-btn.active {
          background: #1e293b;
          box-shadow: 0 0 0 4px rgba(30, 41, 59, 0.2);
          transform: scale(1.1);
        }
        .progress-indicator {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 4px;
          background: rgba(30, 41, 59, 0.15);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, #1e293b, #475569);
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
          .timeline-horizontal-section h2 { font-size: 1.6rem;}
          .timeline-card { padding-left: 1.2rem; font-size: .95em;}
          .timeline-horizontal-marker{left:-30px;}
          .slider-arrow { font-size: 1.8rem; width: 40px; height: 40px; }
          .progress-indicator { width: 120px; }
          .timeline-horizontal-content .testimonial-text { font-size: 0.9rem; }
        }
      `}</style>
    </section>
  );
};

export default HorizontalTimelineTestimonials;
