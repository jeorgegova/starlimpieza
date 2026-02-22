"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Briefcase } from "lucide-react"

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d742.3130216254883!2d3.1533424520107025!3d41.908939298115264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDU0JzMyLjIiTiAzwrAwOScxNC40IkU!5e0!3m2!1ses!2sco!4v1757478879723!5m2!1ses!2sco"

const ContactForm = ({ onOpenJobModal }) => {
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
      </div>
      <div className="contact-hero2-content">
        <div className="contact-main-grid">
          <form className="contact-hero2-form">
            <h2>Contáctenos</h2>
            <div className="subtitle">¿Tiene alguna duda? ¡Escríbanos!</div>
            <input type="text" placeholder="Nombre" required />
            <input type="email" placeholder="Email" required />
            <input type="text" placeholder="Asunto" required />
            <textarea placeholder="Mensaje" rows="4" required />
            <button type="submit">Enviar</button>
          </form>

          <div className="job-side-card">
            <div className="job-side-icon">
              <Briefcase size={24} />
            </div>
            <h3>Trabaja con Nosotros</h3>
            <p>Buscamos personas comprometidas para crecer con nosotros en Star Limpiezas.</p>
            <button onClick={onOpenJobModal}>
              Crear Solicitud
            </button>
          </div>
        </div>
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
          pointer-events: none;
        }
        .contact-hero2-map-background iframe {
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: auto;
        }
        .contact-hero2-content {
          position: absolute;
          left: 0;
          top: 12%;
          transform: translateY(0);
          z-index: 3;
          width: 100%;
          padding: 0 20px;
          height: auto;
          pointer-events: none;
          box-sizing: border-box;
        }
        .contact-main-grid {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          width: 100%;
        }
        .contact-hero2-form {
          width: 450px;
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          gap: 1.25rem;
          background: rgba(15, 23, 42, 0.3);
          border-radius: 24px;
          padding: 2.25rem 2rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transform: translateY(0);
          transition: all 0.3s ease;
          pointer-events: auto;
        }
        .job-side-card {
          width: 350px;
          margin-top: 20px;
          background: rgba(15, 23, 42, 0.3);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.75rem;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.22);
          pointer-events: auto;
          animation: slideInRight 0.8s ease-out;
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .job-side-icon {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .job-side-card h3 {
          font-size: 1.35rem;
          font-weight: 700;
          margin: 0;
          color: #fff;
        }
        .job-side-card p {
          font-size: 0.9rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }
        .job-side-card button {
          width: 100%;
          padding: 0.85rem;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #fff;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }
        .job-side-card button:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #334155 0%, #475569 100%);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .contact-hero2-form:hover {
          transform: translateY(-5px);
          box-shadow: 0 35px 70px rgba(0, 0, 0, 0.3);
        }
        .contact-hero2-form h2 {
          font-size: 2.22rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.5rem 0;
          text-align: center;
        }
        .contact-hero2-form .subtitle {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .contact-hero2-form input,
        .contact-hero2-form textarea {
          width: 100%;
          padding: 0.85rem 1.15rem;
          background: rgba(255, 255, 255, 0.98);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 12px;
          font-size: 0.95rem;
          color: #0f172a;
          transition: all 0.2s;
        }
        .contact-hero2-form input:focus,
        .contact-hero2-form textarea:focus {
          outline: none;
          background: #fff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .contact-hero2-form button[type="submit"] {
          margin-top: 0.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .contact-hero2-form button[type="submit"]:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #334155 0%, #475569 100%);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        @media (max-width: 1024px) {
          .contact-hero2-form { width: 400px; }
          .job-side-card { width: 320px; }
        }
        @media (max-width: 850px) {
          .contact-hero2 {
            min-height: auto;
            padding: 4rem 1rem;
          }
          .contact-hero2-content {
            position: relative;
            transform: none;
            left: 0; top: 0;
            width: 100%;
            padding: 0;
          }
          .contact-main-grid {
            flex-direction: column;
            align-items: center;
            gap: 2rem;
          }
          .contact-hero2-form, .job-side-card {
            margin-left: 10px;
            width: 100%;
            max-width: 450px;
          }
        }
        @media (max-width: 500px) {
          .contact-hero2-form h2 { font-size: 1.75rem; }
          .job-side-card h3 { font-size: 1.25rem; }
        }
        @media (max-width: 500px) {
          .contact-hero2-form h2 { font-size: 1.75rem; }
          .job-side-card h3 { font-size: 1.25rem; }
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
