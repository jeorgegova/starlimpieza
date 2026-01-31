import React, { useEffect, useState } from 'react';
import burbuja from '../../assets/burbuja.png';
import logo from '../../assets/logo.png';
import videoHome from '../../assets/videoHome.mp4';

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
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f8',
        textAlign: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src={videoHome} type="video/mp4" />
      </video>

      {bubbles.map((b) => (
        <div
          key={b.id}
          style={{
            position: 'absolute',
            width: `${b.size}px`,
            height: `${b.size}px`,
            borderRadius: '50%',
            backgroundImage: `url(${bubbleImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: b.opacity,
            border: '2px solid rgba(137, 129, 129, 0.4)',
            left: `${b.x - b.size / 2}px`,
            top: `${b.y - b.size / 2}px`,
            transform: `scale(${b.scale})`,
            transition: 'transform 0.1s ease',
            pointerEvents: 'none',
            zIndex: 1,
            boxShadow: `
              0 0 20px rgba(52, 38, 210, 0.3),
              inset 0 0 20px rgba(81, 78, 221, 0.2)
            `,
            filter: 'blur(0.5px)',
          }}
        />
      ))}

      <div className="responsive-hero-circle">
        <div className="shimmer-bg" />
        <h1 className="hero-title">
          Empresa de limpieza en Girona
        </h1>
        <p className="hero-desc">
          En Star Limpiezas, con sede en Mont-ras, provincia de Girona, nos especializamos en ofrecer servicios de limpieza y mantenimiento, garantizando calidad, eficiencia y confianza. Nuestra área principal de actuación es la comarca del Baix Empordá.
        </p>
        <img
          src={logo}
          alt="Grupo de limpiadores"
          className="hero-logo"
        />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        @keyframes glow {
          0% {
            box-shadow: 
              0 0 50px rgba(255,255,255,0.4),
              inset 0 0 50px rgba(255,255,255,0.2),
              0 20px 40px rgba(0,0,0,0.1);
          }
          100% {
            box-shadow: 
              0 0 70px rgba(255,255,255,0.6),
              inset 0 0 70px rgba(255,255,255,0.3),
              0 25px 50px rgba(0,0,0,0.15);
          }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-5px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        .responsive-hero-circle {
          background:
            radial-gradient(circle at 30% 20%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 100%),
            linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
          padding: 3rem 2rem;
          border-radius: 50%;
          width: min(92vw, 500px);
          height: min(92vw, 500px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 5;
          backdrop-filter: blur(10px);
          border: 3px solid rgba(255,255,255,0.3);
          box-shadow:
            0 0 50px rgba(255,255,255,0.4),
            inset 0 0 50px rgba(28, 17, 48, 0.2),
            0 20px 40px rgba(18, 5, 62, 0.1);
          position: relative;
          animation: float 6s ease-in-out infinite, glow 3s ease-in-out infinite alternate;
        }
        .shimmer-bg {
          position: absolute;
          top: 10%;
          left: 20%;
          width: 30%;
          height: 30%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%);
          animation: shimmer 4s ease-in-out infinite;
        }
        .hero-title {
          font-size: 2.2rem;
          margin-bottom: 1.5rem;
          color: #2c3e50;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
          animation: fadeInUp 1s ease-out 0.5s both;
        }
        .hero-desc {
          margin-bottom: 2rem;
          color: #34495e;
          line-height: 1.6;
          font-size: 1.1rem;
          font-weight: 400;
          text-align: center;
          animation: fadeInUp 1s ease-out 0.7s both;
        }
        .hero-logo {
          max-width: 120px;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          border: 3px solid rgba(255,255,255,0.5);
          animation: logoFloat 3s ease-in-out infinite, fadeInUp 1s ease-out 0.9s both;
        }

        /* --- MEDIA QUERIES --- */
        @media (max-width: 600px) {
          .responsive-hero-circle {
            width: 90vw !important;
            height: 90vw !important;
            min-width: 220px;
            min-height: 220px;
            padding: 2.2rem 0.7rem !important;
          }
          .hero-title {
            font-size: 1.15rem !important;
          }
          .hero-desc {
            font-size: 0.98rem !important;
            margin-bottom: 1.2rem;
          }
          .hero-logo {
            max-width: 60px !important;
          }
        }
        /* --- END MEDIA QUERIES --- */
      `}</style>
    </section>
  );
};

export default Hero;
