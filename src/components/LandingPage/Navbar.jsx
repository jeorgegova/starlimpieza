import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Navbar = ({ navigationHandler, showClientButton = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLogoShine, setShowLogoShine] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const shineInterval = setInterval(() => {
      setShowLogoShine(true);
      setTimeout(() => setShowLogoShine(false), 1500);
    }, 5000);
    return () => clearInterval(shineInterval);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (item) => {
    if (isMenuOpen) setIsMenuOpen(false);
    navigationHandler(item.id);
  };

  const menuItems = [
    { name: 'Inicio', id: 'hero' },
    { name: 'Servicios', id: 'services' },
    { name: 'Nuestra Empresa', id: 'aboutUs' },
    { name: 'Testimonios', id: 'testimonials' },
    { name: 'Contacto', id: 'contact' }
  ];

  const handleClientAreaClick = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    navigate('/reservas');
  };

  const isReservasPage = location.pathname === '/reservas';

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isReservasPage ? 'navbar-reservas' : ''}`}>
      <div className="navbar-container">
        <div className={`navbar-logo ${showLogoShine ? 'logo-shine' : ''}`} onClick={() => navigationHandler('hero')}>
          <img src={logo} alt="Logo Star Limpiezas" />
          <div className="logo-sparkle sparkle-1"></div>
          <div className="logo-sparkle sparkle-2"></div>
          <div className="logo-sparkle sparkle-3"></div>
        </div>

        <ul className={`navbar-menu desktop-menu`}>
          {menuItems.map((item, idx) => (
            <li key={item.name} className="navbar-menu-item" style={{ animationDelay: `${idx * 0.1}s` }}>
              <a
                href="#"
                onClick={e => { e.preventDefault(); handleNavClick(item); }}
                tabIndex={0}
              >
                {item.name}
              </a>
            </li>
          ))}
          {showClientButton && !isReservasPage && (
            <li className="navbar-menu-item" style={{ animationDelay: `${menuItems.length * 0.1}s` }}>
              <button
                onClick={handleClientAreaClick}
                className="navbar-client-button"
                tabIndex={0}
              >
                Área de Clientes
              </button>
            </li>
          )}
        </ul>

        <button
          className="navbar-hamburger"
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
          style={{ display: isMobile ? 'flex' : 'none' }}
        >
          <span className={isMenuOpen ? "hamburger-bar open top" : "hamburger-bar top"} />
          <span className={isMenuOpen ? "hamburger-bar open mid" : "hamburger-bar mid"} />
          <span className={isMenuOpen ? "hamburger-bar open bot" : "hamburger-bar bot"} />
        </button>
      </div>

      <div className={`navbar-dropdown${isMenuOpen ? ' open' : ''}`} style={{ display: isMobile ? 'block' : 'none' }}>
        <ul>
          {menuItems.map((item, idx) => (
            <li key={item.name} style={{
              transition: `all 0.35s cubic-bezier(.42,0,.58,1) ${idx * 0.04}s`
            }}>
              <button
                onClick={() => handleNavClick(item)}
                className="navbar-dropdown-link"
                tabIndex={0}
              >
                {item.name}
              </button>
            </li>
          ))}
          {showClientButton && !isReservasPage && (
            <li className="navbar-dropdown-client">
              <button
                onClick={handleClientAreaClick}
                className="navbar-client-button"
                tabIndex={0}
              >
                Área de Clientes
              </button>
            </li>
          )}
          {isReservasPage && (
            <li className="navbar-dropdown-back">
              <button
                onClick={() => navigate('/')}
                className="navbar-back-button"
                tabIndex={0}
              >
                ← Volver al Inicio
              </button>
            </li>
          )}
        </ul>
      </div>

      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: navbar-float 6s ease-in-out infinite;
        }
        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          animation: none;
        }
        .navbar-reservas {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: none;
        }
        @keyframes navbar-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 65px;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
          position: relative;
          transition: all 0.3s ease;
        }
        .navbar-logo img {
          height: 75px;
          width: auto;
          max-width: 200px;
          border-radius: 10px;
          background: none;
          padding: 0;
          transition: all 0.3s ease;
        }
        .navbar-logo:hover img {
          transform: scale(1.05);
          filter: brightness(1.05);
        }
        .logo-shine img {
          filter: brightness(1.1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
        }
        .logo-sparkle {
          position: absolute;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #ffffff 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
        }
        .sparkle-1 {
          top: 10px;
          right: 20px;
          animation: sparkle-anim 1.5s ease-in-out infinite;
        }
        .sparkle-2 {
          top: 25px;
          right: 40px;
          animation: sparkle-anim 1.5s ease-in-out infinite 0.3s;
        }
        .sparkle-3 {
          top: 15px;
          right: 60px;
          animation: sparkle-anim 1.5s ease-in-out infinite 0.6s;
        }
        @keyframes sparkle-anim {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        .desktop-menu {
          display: flex;
          gap: 0.5rem;
          list-style: none;
          align-items: center;
          margin: 0;
          padding: 0;
        }
        .navbar-menu-item {
          opacity: 0;
          transform: translateY(-10px);
          animation: menu-fade-in 0.5s ease forwards;
        }
        @keyframes menu-fade-in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .navbar-menu-item a {
          position: relative;
          display: block;
          text-decoration: none;
          color: #333333;
          font-weight: 500;
          font-size: 1rem;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          transition: all 0.25s ease;
          outline: none;
          letter-spacing: 0.3px;
        }
        .navbar-menu-item a::after {
          content: '';
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: calc(100% - 2.5rem);
          height: 2px;
          background: #1a1a1a;
          border-radius: 1px;
          transition: transform 0.25s ease;
        }
        .navbar-menu-item a:hover::after, 
        .navbar-menu-item a:focus::after {
          transform: translateX(-50%) scaleX(1);
        }
        
        .navbar-client-button {
          background: #1a1a1a;
          color: #ffffff;
          font-weight: 500;
          font-size: 0.95rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          outline: none;
          letter-spacing: 0.5px;
        }
        .navbar-client-button:hover, .navbar-client-button:focus {
          background: #000000;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .navbar-hamburger {
          background: none;
          border: none;
          flex-direction: column;
          cursor: pointer;
          gap: 5px;
          justify-content: center;
          align-items: center;
          height: 44px;
          padding: 8px;
          outline: none;
          z-index: 9999;
          display: none;
        }
        .hamburger-bar {
          width: 26px;
          height: 2px;
          background: #333333;
          border-radius: 1px;
          margin: 2.5px 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hamburger-bar.top.open {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger-bar.mid.open {
          opacity: 0;
        }
        .hamburger-bar.bot.open {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .navbar-dropdown {
          position: absolute;
          top: 100%;
          left: 0; right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .navbar-dropdown.open {
          opacity: 1;
          pointer-events: auto;
          visibility: visible;
          max-height: 500px;
        }
        .navbar-dropdown ul {
          list-style: none;
          margin: 0;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }
        .navbar-dropdown-client {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        .navbar-dropdown-client .navbar-client-button {
          width: 100%;
          text-align: center;
          padding: 1rem 1.25rem;
          font-size: 1rem;
        }
        .navbar-dropdown-back {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        .navbar-back-button {
          width: 100%;
          text-align: center;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          font-weight: 500;
          background: #1a1a1a;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .navbar-back-button:hover, .navbar-back-button:focus {
          background: #000000;
          transform: scale(1.02);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }
        .navbar-dropdown-link {
          background: none;
          border: none;
          cursor: pointer;
          color: #333333;
          font-weight: 500;
          font-size: 1rem;
          padding: 1rem 1.25rem;
          border-radius: 8px;
          width: 100%;
          text-align: left;
          transition: all 0.25s ease;
          font-family: inherit;
        }
        .navbar-dropdown-link:hover, .navbar-dropdown-link:focus {
          color: #000000;
          background: rgba(0, 0, 0, 0.03);
        }

        @media (max-width: 900px) {
          .navbar-container {
            max-width: 100vw;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }
        @media (max-width: 800px) {
          .navbar-logo img {
            height: 60px;
          }
        }
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .navbar-hamburger {
            display: flex !important;
          }
          .navbar-container {
            height: 50px;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .navbar-logo img {
            height: 55px;
            max-width: 130px;
          }
          .navbar-menu-item {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
        @media (max-width: 480px) {
          .navbar-logo img {
            height: 48px;
            max-width: 110px;
          }
          .navbar-dropdown ul {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
