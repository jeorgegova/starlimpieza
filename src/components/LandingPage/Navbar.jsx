import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (sectionId) => {
    // Cerrar menú móvil si está abierto
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
    
    // Pequeño delay para permitir que el menú se cierre
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const navbarHeight = 80; // altura aproximada del navbar
        const elementPosition = element.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      } else {
        console.log(`Elemento con ID "${sectionId}" no encontrado`);
      }
    }, isMenuOpen ? 300 : 0);
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '1rem 0',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      zIndex: 1000,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <div style={{ 
          fontSize: '1.75rem', 
          fontWeight: '700', 
          background: 'linear-gradient(135deg, #1e74d8 0%, #f4c430 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.5px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}>
          ⭐ STAR LIMPIEZAS
        </div>

        {/* Desktop Menu */}
        <ul style={{
          display: window.innerWidth > 768 ? 'flex' : 'none',
          listStyle: 'none',
          gap: '2.5rem',
          margin: 0,
          padding: 0,
          alignItems: 'center',
        }}>
          {[
            { name: 'Inicio', href: '#hero' },
            { name: 'Servicios', href: '#services' },
            { name: 'Nuestra Empresa', href: '#aboutUs' },
            { name: 'Testimonios', href: '#testimonials' },
            { name: 'Contacto', href: '#contact' }
          ].map((item, index) => (
            <li key={item.name} style={{
              position: 'relative',
            }}>
              <a 
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(item.href);
                  if (element) {
                    element.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  } else {
                    console.log(`Sección ${item.href} no encontrada`);
                  }
                }} 
                style={{ 
                  textDecoration: 'none', 
                  color: '#4a5568',
                  fontWeight: '500',
                  fontSize: '1rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '25px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  display: 'block',
                  transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#1e74d8';
                  e.target.style.backgroundColor = 'rgba(30, 116, 216, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(30, 116, 216, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#4a5568';
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <div 
          onClick={toggleMenu}
          style={{
            display: isMobile ? 'flex' : 'none',
            flexDirection: 'column',
            cursor: 'pointer',
            padding: '0.5rem',
            gap: '0.25rem',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{
            width: '25px',
            height: '3px',
            backgroundColor: '#1e74d8',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
            transform: isMenuOpen ? 'rotate(45deg) translate(6px, 6px)' : 'rotate(0)',
          }}></div>
          <div style={{
            width: '25px',
            height: '3px',
            backgroundColor: '#1e74d8',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
            opacity: isMenuOpen ? '0' : '1',
          }}></div>
          <div style={{
            width: '25px',
            height: '3px',
            backgroundColor: '#1e74d8',
            borderRadius: '2px',
            transition: 'all 0.3s ease',
            transform: isMenuOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'rotate(0)',
          }}></div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        transform: isMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isMenuOpen ? 1 : 0,
        visibility: isMenuOpen ? 'visible' : 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: isMobile ? 'block' : 'none',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      }}>
        <ul style={{
          listStyle: 'none',
          margin: 0,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          {[
            { name: 'Inicio', id: 'hero' },
            { name: 'Servicios', id: 'services' },
            { name: 'Nuestra Empresa', id: 'aboutUs' },
            { name: 'Testimonios', id: 'testimonials' },
            { name: 'Contacto', id: 'contact' }
          ].map((item, index) => (
            <li key={item.name} style={{
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
              transition: `all 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`,
            }}>
              <button
                onClick={() => handleNavClick(item.id)}
                style={{ 
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none', 
                  color: '#4a5568',
                  fontWeight: '500',
                  fontSize: '1.1rem',
                  padding: '1rem 1.5rem',
                  borderRadius: '15px',
                  transition: 'all 0.3s ease',
                  display: 'block',
                  textAlign: 'center',
                  width: '100%',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#1e74d8';
                  e.target.style.backgroundColor = 'rgba(30, 116, 216, 0.1)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#4a5568';
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;