import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/LandingPage/Navbar';
import Hero from './components/LandingPage/Hero';
import Services from './components/LandingPage/Services';
import HorizontalTimelineTestimonials from './components/LandingPage/Testimonials';
import ContactForm from './components/LandingPage/ContactForm';
import Footer from './components/LandingPage/Footer';
import AboutUs from './components/LandingPage/AboutUs';
import Reserva from './components/Reservas/Reservas';
import JobApplicationForm from './components/JobApplication/JobApplicationForm';
import EmailVerification from './components/EmailVerification';
import ResetPassword from './components/ResetPassword';
import CookieConsent from './components/CookieConsent';
import WhatsAppButton from './components/WhatsAppButton';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState('hero');
  const [showJobModal, setShowJobModal] = useState(false);
  const sectionsRef = useRef({});

  // Función para scroll suave a una sección específica
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.offsetTop - navbarHeight;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  // Función para manejar navegación (scroll, route, o modal)
  const handleNavigation = (id) => {
    if (id.startsWith('/')) {
      navigate(id);
    } else if (id === 'job-modal') {
      setShowJobModal(true);
    } else {
      // Scroll to section
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => scrollToSection(id), 400);
      } else {
        scrollToSection(id);
      }
    }
  };

  // Intersection Observer para detectar la sección actual
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -60% 0px', // Mejor detección para services
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observar todas las secciones
    const sections = ['hero', 'services', 'aboutUs', 'testimonials', 'contact'];

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // SEO dinámico por ruta
  useEffect(() => {
    const SITE_URL = window.location.origin;
    const routesSEO = {
      '/': {
        title: 'Star Limpiezas | Servicios de limpieza profesionales en Girona y Costa Brava',
        description: 'Empresa de limpieza profesional en Girona y Costa Brava: hogares, Airbnb, comunidades, oficinas y servicios forestales. Reserva online y atención por WhatsApp.',
        robots: 'index,follow',
        ogTitle: 'Star Limpiezas | Servicios de limpieza profesionales',
        ogDescription: 'Empresa de limpieza profesional en Girona y Costa Brava: hogares, Airbnb, comunidades, oficinas y servicios forestales. Reserva online y atención por WhatsApp.'
      },
      '/reservas': {
        title: 'Reservas de servicios | Star Limpiezas',
        description: 'Reserva fácilmente nuestros servicios profesionales en Girona y Costa Brava.',
        robots: 'index,follow',
        ogTitle: 'Reservas - Star Limpiezas',
        ogDescription: 'Reserva fácilmente nuestros servicios profesionales en Girona y Costa Brava.'
      },
      '/verify-email': {
        title: 'Verificación de email | Star Limpiezas',
        description: 'Verifica tu correo para activar tu cuenta y gestionar tus reservas.',
        robots: 'noindex,nofollow',
        ogTitle: 'Verificación de email',
        ogDescription: 'Verifica tu correo para activar tu cuenta.'
      },
      '/reset-password': {
        title: 'Restablecer contraseña | Star Limpiezas',
        description: 'Restablece tu contraseña para acceder a tus reservas de servicios.',
        robots: 'noindex,nofollow',
        ogTitle: 'Restablecer contraseña',
        ogDescription: 'Restablece tu contraseña para acceder a tus reservas.'
      }
    };

    const seo = routesSEO[location.pathname] || routesSEO['/'];
    document.title = seo.title;

    const ensureMeta = (selector, attributes) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v));
        document.head.appendChild(el);
      } else {
        Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v));
      }
      return el;
    };

    // Meta básicos
    ensureMeta('meta[name="description"]', { name: 'description', content: seo.description });
    ensureMeta('meta[name="robots"]', { name: 'robots', content: seo.robots });

    // Open Graph
    ensureMeta('meta[property="og:title"]', { property: 'og:title', content: seo.ogTitle });
    ensureMeta('meta[property="og:description"]', { property: 'og:description', content: seo.ogDescription });
    ensureMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    ensureMeta('meta[property="og:url"]', { property: 'og:url', content: SITE_URL + location.pathname });
    ensureMeta('meta[property="og:image"]', { property: 'og:image', content: SITE_URL + '/logo.png' });

    // Twitter
    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.ogTitle });
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.ogDescription });
    ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: SITE_URL + '/logo.png' });

    // Canonical
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', SITE_URL + location.pathname);
  }, [location.pathname]);

  return (
    <div className="scroll-smooth">
      <Navbar currentSection={currentSection} navigationHandler={handleNavigation} />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <Services />
              <AboutUs />
              <HorizontalTimelineTestimonials />
              <ContactForm onOpenJobModal={() => setShowJobModal(true)} />
            </main>
          }
        />
        <Route path="/reservas" element={<Reserva />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
       <Footer onNavigate={handleNavigation} />
       <CookieConsent />
       <WhatsAppButton />
       {showJobModal && (
         <JobApplicationForm onClose={() => setShowJobModal(false)} />
       )}
    </div>
  );
}

export default App;
