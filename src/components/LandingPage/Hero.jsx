import React, { useEffect, useState } from 'react';
import burbuja from '../../assets/burbuja.png';
import logo from '../../assets/logo.png';
import videoHome from '../../assets/videoHome.mp4';
import './Hero.css';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const bubbleImage = burbuja;

  useEffect(() => {
    const handleScroll = () => {
      const servicesSection = document.getElementById('services');
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      if (scrollPosition < servicesSection?.offsetTop) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const numBubbles = 15;
    const initialBubbles = Array.from({ length: numBubbles }, (_, i) => {
      const left = Math.random() * window.innerWidth;
      const top = Math.random() * window.innerHeight;
      const size = Math.random() * 60 + 30;
      return {
        id: i,
        x: left,
        y: top,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size,
        scale: 0,
        state: 'growing',
        opacity: Math.random() * 0.4 + 0.3,
        originalVx: (Math.random() - 0.5) * 2,
        originalVy: (Math.random() - 0.5) * 2,
        lastHit: 0,
        isHit: false,
      };
    });
    setBubbles(initialBubbles);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBubbles((prev) =>
        prev.map((b) => {
          const newB = { ...b };
          const step = 0.03;

          if (newB.state === 'growing') {
            newB.scale = Math.min(1, newB.scale + step);
            if (newB.scale >= 1) {
              newB.state = 'floating';
            }
          }

          if (newB.state === 'floating') {
            const dx = mousePosition.x - newB.x;
            const dy = mousePosition.y - newB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < newB.size / 2 + 5 && distance > 0) {
              if (!newB.isHit) {
                const pushStrength = 6;
                const pushX = (-dx / distance) * pushStrength;
                const pushY = (-dy / distance) * pushStrength;
                newB.vx += pushX;
                newB.vy += pushY;
                newB.lastHit = Date.now();
                newB.isHit = true;
              }
            } else {
              newB.isHit = false;
            }

            const timeSinceHit = Date.now() - newB.lastHit;
            if (timeSinceHit < 1500) {
              newB.vx *= 0.985;
              newB.vy *= 0.985;
            } else {
              newB.vx += (newB.originalVx - newB.vx) * 0.01;
              newB.vy += (newB.originalVy - newB.vy) * 0.01;
            }

            newB.vx *= 0.99;
            newB.vy *= 0.99;

            newB.x += newB.vx;
            newB.y += newB.vy;

            if (newB.x <= newB.size / 2 || newB.x >= window.innerWidth - newB.size / 2) {
              newB.vx *= -0.8;
              newB.x = Math.max(newB.size / 2, Math.min(window.innerWidth - newB.size / 2, newB.x));
            }
            if (newB.y <= newB.size / 2 || newB.y >= window.innerHeight - newB.size / 2) {
              newB.vy *= -0.8;
              newB.y = Math.max(newB.size / 2, Math.min(window.innerHeight - newB.size / 2, newB.y));
            }
          }

          return newB;
        })
      );
    }, 16);

    return () => clearInterval(intervalId);
  }, [mousePosition]);

  return (
    <section
      id="hero"
      className={`hero-section ${isVisible ? 'visible' : ''}`}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/video-poster.jpg"
        aria-label="Video de presentación de Star Limpiezas - Servicios de limpieza profesionales"
      >
        <source src={videoHome} type="video/mp4" />
      </video>

      {bubbles.map((b) => (
        <div
          key={b.id}
          className="bubble"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.x - b.size / 2}px`,
            top: `${b.y - b.size / 2}px`,
            opacity: b.opacity,
            transform: `scale(${b.scale})`,
          }}
        />
      ))}

      <div className="responsive-hero-circle">
        <div className="shimmer-bg" />
        <h1 className="hero-title">
          Star Limpiezas
        </h1>
        <p className="hero-desc">
          Somos una empresa líder en limpieza profesional ubicada en Mont-ras, provincia de Girona. Especialistas en limpieza de hogares, propiedades Airbnb, comunidades de vecinos, oficinas, restaurantes y servicios forestales. Garantizamos calidad, eficiencia y confianza con más de 10 años de experiencia en este mercado.
        </p>
        <img
          src={logo}
          alt="Star Limpiezas - Empresa de limpieza profesional en Girona y Costa Brava"
          className="hero-logo"
          width="120"
          height="120"
        />
      </div>
    </section>
  );
};

export default Hero;
