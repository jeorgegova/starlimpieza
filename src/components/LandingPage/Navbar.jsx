import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (sectionId) => {
    if (isMenuOpen) setIsMenuOpen(false);

    const scrollToSection = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.offsetTop - navbarHeight;
        window.scrollTo({ top: elementPosition, behavior: 'smooth' });
      }
    };

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(scrollToSection, 400);
    } else {
      scrollToSection();
    }
  };

  const menuItems = [
    { name: 'Inicio', id: 'hero' },
    { name: 'Servicios', id: 'services' },
    { name: 'Nuestra Empresa', id: 'aboutUs' },
    { name: 'Testimonios', id: 'testimonials' },
    { name: 'Contacto', id: 'contact' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo replace text */}
        <div className="navbar-logo" onClick={() => handleNavClick('hero')}>
          <img src={logo} alt="Logo Star Limpiezas" />
        </div>

        <ul className={`navbar-menu desktop-menu`}>
          {menuItems.map(item => (
            <li key={item.name} className="navbar-menu-item">
              <a
                href={`#${item.id}`}
                onClick={e => { e.preventDefault(); handleNavClick(item.id); }}
                tabIndex={0}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
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

      {/* Mobile Dropdown Menu */}
      <div className={`navbar-dropdown${isMenuOpen ? ' open' : ''}`} style={{ display: isMobile ? 'block' : 'none' }}>
        <ul>
          {menuItems.map((item, idx) => (
            <li key={item.name} style={{
              transition: `all 0.35s cubic-bezier(.42,0,.58,1) ${idx * 0.04}s`
            }}>
              <button
                onClick={() => handleNavClick(item.id)}
                className="navbar-dropdown-link"
                tabIndex={0}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* --- CSS Styling (media-queries included) --- */}
      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 3px 18px rgba(30, 116, 216, 0.05);
          border-bottom: 1px solid rgba(0,0,0,0.04);
          backdrop-filter: blur(12px);
          transition: all 0.3s cubic-bezier(.4,0,.2,1);
        }
        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          min-height: 72px;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        .navbar-logo img {
          height: 44px;
          width: auto;
          max-width: 180px;
          border-radius: 12px;
          box-shadow: 0 2px 14px rgba(30,116,216,0.07);
          background: white;
          padding: 3px 8px;
          transition: box-shadow 0.3s;
        }
        .navbar-logo img:hover, .navbar-logo img:focus {
          box-shadow: 0 7px 16px rgba(30,116,216,0.13);
        }

        .desktop-menu {
          display: flex;
          gap: 2.5rem;
          list-style: none;
          align-items: center;
          margin: 0;
          padding: 0;
        }
        .navbar-menu-item a {
          display: block;
          text-decoration: none;
          color: #4a5568;
          font-weight: 500;
          font-size: 1rem;
          padding: 0.75rem 1.25rem;
          border-radius: 25px;
          transition: all 0.23s cubic-bezier(.4,0,.2,1);
          outline: none;
        }
        .navbar-menu-item a:hover, .navbar-menu-item a:focus {
          color: #1e74d8;
          background: rgba(30,116,216,0.13);
          transform: translateY(-2px);
          box-shadow: 0 7px 16px rgba(30,116,216,0.09);
        }

        .navbar-hamburger {
          background: none;
          border: none;
          flex-direction: column;
          cursor: pointer;
          gap: 4px;
          justify-content: center;
          align-items: center;
          height: 40px;
          padding: 5px;
          outline: none;
          z-index: 9999;
          display: none;
        }
        .hamburger-bar {
          width: 25px;
          height: 3px;
          background: #1e74d8;
          border-radius: 2px;
          margin: 2px 0;
          transition: all 0.3s cubic-bezier(.4,0,.2,1);
        }
        .hamburger-bar.top.open {
          transform: rotate(45deg) translate(5px,6px);
        }
        .hamburger-bar.mid.open {
          opacity: 0;
        }
        .hamburger-bar.bot.open {
          transform: rotate(-45deg) translate(5px,-6px);
        }

        .navbar-dropdown {
          position: absolute;
          top: 100%;
          left: 0; right: 0;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(16px);
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          box-shadow: 0 8px 32px rgba(30,116,216,0.08);
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(.4,0,.2,1);
        }
        .navbar-dropdown.open {
          opacity: 1;
          pointer-events: auto;
          visibility: visible;
          max-height: 360px;
          transition: all 0.38s cubic-bezier(.42,0,.58,1);
        }
        .navbar-dropdown ul {
          list-style: none;
          margin: 0;
          padding: 2rem 1rem 1rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          max-width: 380px;
          margin-left: auto;
          margin-right: auto;
        }
        .navbar-dropdown-link {
          background: none;
          border: none;
          cursor: pointer;
          color: #4a5568;
          font-weight: 500;
          font-size: 1.07rem;
          padding: 1rem 1.2rem;
          border-radius: 15px;
          width: 100%;
          text-align: left;
          transition: all 0.3s cubic-bezier(.4,0,.2,1);
          font-family: inherit;
        }
        .navbar-dropdown-link:hover, .navbar-dropdown-link:focus {
          color: #1e74d8;
          background: rgba(30,116,216,0.11);
          transform: scale(1.045);
        }

        /* --- Responsiveness --- */
        @media (max-width: 900px) {
          .navbar-container {
            max-width: 100vw;
            padding-left: 1.2rem;
            padding-right: 1.2rem;
          }
          .desktop-menu {
            gap: 1.2rem;
          }
        }
        @media (max-width: 800px) {
          .navbar-logo img {
            height: 38px;
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
            min-height: 60px;
            height: 62px;
          }
        }
        @media (max-width: 480px) {
          .navbar-logo img {
            height: 32px;
            padding: 2px 4px;
            max-width: 100px;
          }
          .navbar-container {
            padding-left: 0.4rem;
            padding-right: 0.4rem;
          }
          .navbar-dropdown ul {
            padding-left: 0.5rem; padding-right: 0.5rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
