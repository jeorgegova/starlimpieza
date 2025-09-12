"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d742.3130216254883!2d3.1533424520107025!3d41.908939298115264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDU0JzMyLjIiTiAzwrAwOScxNC40IkU!5e0!3m2!1ses!2sco!4v1757478879723!5m2!1ses!2sco"

const ContactForm = () => {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 900) setIsVisible(true)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="contact" className={`contact-hero2${isVisible ? " visible" : ""}`}>
      <div className="contact-hero2-map-background">
        <iframe
          title="Ubicación"
          src={MAP_SRC}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Botón SOLO DENTRO DEL BLOQUE */}
        <button
          className="reservar-float-btn"
          onClick={() => navigate("/reservas")}
        >
          Reservar
        </button>
      </div>
      <div className="contact-hero2-content">
        <form className="contact-hero2-form">
          <h2>Contáctanos</h2>
          <div className="subtitle">¿Tienes una consulta? ¡Escríbenos!</div>
          <input type="text" placeholder="Nombre" required />
          <input type="email" placeholder="Email" required />
          <input type="text" placeholder="Asunto" required />
          <textarea placeholder="Mensaje" rows="4" required />
          <button type="submit">Enviar</button>
        </form>
      </div>

      <style>{`
        .contact-hero2 {
          position: relative;
          width: 100vw;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 0;
          opacity: 0;
          transition: opacity 1.2s ease-in-out;
          overflow: hidden;
        }
        .contact-hero2.visible { 
          opacity: 1; 
        }
        .contact-hero2-map-background {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 1;
          /* Importante para poner button sobre el mapa */
          pointer-events: none;
        }
        .contact-hero2-map-background iframe {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: auto;
        }
        .reservar-float-btn {
          position: absolute;
          top: 14vh;
          right: 3vw;
          z-index: 10;
          padding: 1.1rem 2.2rem;
          background: linear-gradient(135deg,rgba(32, 18, 226, 0.34) 0%,rgba(0, 0, 0, 0.36) 100%);
          color: #fff;
          font-size: 1.1rem;
          font-weight: 700;
          border: green 1px solid;
          border-radius: 18px;
          cursor: pointer;
          box-shadow: 0 12px 38px rgba(0, 0, 0, 0.13), 0 0 0 1.5px rgba(32, 18, 226, 0.34);
          backdrop-filter: blur(8px) saturate(180%);
          -webkit-backdrop-filter: blur(8px) saturate(180%);
          transition: all 0.32s cubic-bezier(.31,.74,.56,1.17);
          text-transform: uppercase;
          letter-spacing: 1px;
          filter: drop-shadow(0 12px 40px rgba(66,66,80,.08));
          animation: float-bounce 2.6s ease-in-out infinite alternate;
          pointer-events: auto; /* permite click sobre botón! */
        }
        @keyframes float-bounce {
          0%   { transform: translateY(0); box-shadow: 0 10px 28px rgba(62,62,80,0.13);}
          100% { transform: translateY(-9px) scale(1.035); box-shadow: 0 24px 50px rgba(122,122,144,0.18);}
        }
        .reservar-float-btn:hover {
          background: linear-gradient(120deg,rgba(72,72,88,0.7) 0%,rgba(170,170,170,0.50) 100%);
          color: #e7eeff;
          transform: translateY(-3px) scale(1.065);
          box-shadow: 0 22px 62px rgba(100, 148, 238, 0.22);
          animation: pulseGlow 1.0s infinite alternate, float-bounce 2.6s ease-in-out infinite alternate;
        }
        @keyframes pulseGlow {
          0% { filter: drop-shadow(0 0 0px #6b80fa99);}
          100% { filter: drop-shadow(0 0 16px #88a7fa44);}
        }
        @media (max-width:600px) {
          .reservar-float-btn {
            top: unset;
            bottom: 14vh;
            right: 4vw;
            left: unset;
            padding: 1.1rem 1.1rem;
            font-size: 1rem;
            border-radius: 13px;
          }
        }
        .contact-hero2-content {
          position: absolute;
          left: 2rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 3;
          width: 100%;
          max-width: 450px;
          pointer-events: none;
        }
        .contact-hero2-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: rgba(54, 54, 54, 0.19);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.19);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(30px) saturate(170%);
          border: 1px solid rgba(8, 8, 8, 0.26);
          transform: translateY(0);
          transition: all 0.3s ease;
          pointer-events: auto;
        }
        .contact-hero2-form:hover {
          transform: translateY(-5px);
          box-shadow: 0 35px 70px rgba(0, 0, 0, 0.20), 0 0 0 1px rgba(255, 255, 255, 0.26);
        }
        .contact-hero2-form h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.5rem 0;
          text-align: center;
          text-shadow: 0 2px 8px rgba(0,0,0,0.26);
        }
        .contact-hero2-form .subtitle {
          font-size: 1.1rem;
          color: rgb(252, 252, 252);
          text-align: center;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        .contact-hero2-form input,
        .contact-hero2-form textarea {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid rgba(88, 88, 88, 0.3);
          border-radius: 12px;
          font-size: 1rem;
          color: #24334d;
          backdrop-filter: blur(2px);
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }
        .contact-hero2-form input:focus,
        .contact-hero2-form textarea:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(255,255,255,0.97);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.11), 0 8px 25px rgba(0,0,0,0.14);
          transform: translateY(-2px);
        }
        .contact-hero2-form input::placeholder,
        .contact-hero2-form textarea::placeholder {
          color: #8e9daf;
          font-weight: 500;
        }
        .contact-hero2-form textarea {
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
        }
        .contact-hero2-form button {
          margin-top: 0.5rem;
          padding: 1.1rem 2rem;
          background: linear-gradient(135deg,rgba(129, 149, 241, 0.8) 0%,hsla(237, 31.50%, 48.60%, 0.86) 100%);
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.28);
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .contact-hero2-form button:hover {
          background: linear-gradient(hsl(237, 31.50%, 48.60%) 100%, 135deg,rgb(129, 149, 241) 0%);
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.39);
        }
        .contact-hero2-form button:active {
          transform: translateY(0);
        }
        @media (max-width: 1024px) {
          .contact-hero2-content {
            left: auto;
            top: 10vh;
            transform: none;
            margin: 0 auto;
            right: 0;
            max-width: 430px;
          }
        }
        @media (max-width: 768px) {
          .contact-hero2 {
            align-items: flex-start;
            min-height: 600px;
          }
          .contact-hero2-content {
            position: static;
            transform: none;
            max-width: 100vw;
            width: 100%;
            top: auto;
            left: 0;
            padding: 2rem 0.5rem;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            height: auto !important;
            margin: 0 auto;
            background: none;
          }
          .contact-hero2-form {
            padding: 2rem 1rem;
            max-width: 390px;
            border-radius: 16px;
          }
          .contact-hero2-form h2 {
            font-size: 1.55rem;
          }
        }
        @media (max-width: 500px) {
          .contact-hero2-content {
            padding: 1rem 0.2rem;
          }
          .contact-hero2-form {
            padding: 1.1rem 0.5rem;
            border-radius: 11px;
          }
          .contact-hero2-form h2 {
            font-size: 1.14rem;
          }
        }
      `}</style>
    </section>
  )
}

export default ContactForm
