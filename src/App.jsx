import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from './components/LandingPage/Navbar';
import Hero from './components/LandingPage/Hero';
import Services from './components/LandingPage/Services';
import HorizontalTimelineTestimonials from './components/LandingPage/Testimonials';
import ContactForm from './components/LandingPage/ContactForm';
import Footer from './components/LandingPage/Footer';
import AboutUs from './components/LandingPage/AboutUs';
import FAQ from './components/LandingPage/FAQ';
import Reserva from './components/Reservas/Reservas';
import JobApplicationForm from './components/JobApplication/JobApplicationForm';
import EmailVerification from './components/EmailVerification';
import ResetPassword from './components/ResetPassword';
import CookieConsent from './components/CookieConsent';
import WhatsAppButton from './components/WhatsAppButton';
import SEO, { localBusinessSchema, websiteSchema, breadcrumbSchema } from './components/SEO';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState('hero');
  const [showJobModal, setShowJobModal] = useState(false);
  const sectionsRef = useRef({});
  const SITE_URL = 'https://starlimpiezas.es';

  // Configuración SEO por ruta
  const getSEOConfig = () => {
    const routesSEO = {
      '/': {
        title: 'Star Limpiezas | Servicios de Limpieza Profesionales en Girona y Costa Brava',
        description: 'Empresa de limpieza profesional en Girona y Costa Brava. Limpieza de hogares, Airbnb, comunidades, oficinas, restaurantes y servicios forestales. Presupuesto sin compromiso. ✆ 643 513 174',
        url: SITE_URL
      },
      '/reservas': {
        title: 'Reservar Servicio de Limpieza | Star Limpiezas',
        description: 'Reserva fácilmente tu servicio de limpieza profesional en Girona y Costa Brava. Hogar, Airbnb, comunidad, oficina o restaurante. Atención por WhatsApp.',
        url: `${SITE_URL}/reservas`
      },
      '/verify-email': {
        title: 'Verificación de Email | Star Limpiezas',
        description: 'Verifica tu correo electrónico para activar tu cuenta y gestionar tus reservas de servicios de limpieza.',
        url: `${SITE_URL}/verify-email`,
        robots: 'noindex, nofollow'
      },
      '/reset-password': {
        title: 'Restablecer Contraseña | Star Limpiezas',
        description: 'Restablece tu contraseña de forma segura para acceder a tu cuenta y gestionar tus reservas de limpieza.',
        url: `${SITE_URL}/reset-password`,
        robots: 'noindex, nofollow'
      }
    };

    return routesSEO[location.pathname] || routesSEO['/'];
  };

  const seoConfig = getSEOConfig();

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
      rootMargin: '-40% 0px -60% 0px',
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
    const sections = ['hero', 'services', 'aboutUs', 'faq', 'testimonials', 'contact'];

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Combinar schemas
  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      localBusinessSchema,
      websiteSchema,
      breadcrumbSchema([{ name: 'Inicio', url: SITE_URL }])
    ]
  };

  return (
    <div className="scroll-smooth">
      <Helmet>
        <html lang="es" />
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="robots" content={seoConfig.robots || 'index, follow'} />
        <link rel="canonical" href={seoConfig.url} />
        <script type="application/ld+json">
          {JSON.stringify(combinedSchema)}
        </script>
      </Helmet>
      
      <Navbar currentSection={currentSection} navigationHandler={handleNavigation} />
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <Services />
              <AboutUs />
              <FAQ />
              <HorizontalTimelineTestimonials />
              <ContactForm onOpenJobModal={() => setShowJobModal(true)} />
            </main>
          }
        />
        <Route 
          path="/reservas" 
          element={
            <>
              <Helmet>
                <title>{seoConfig.title}</title>
                <meta name="description" content={seoConfig.description} />
                <link rel="canonical" href={seoConfig.url} />
              </Helmet>
              <Reserva />
            </>
          } 
        />
        <Route 
          path="/verify-email" 
          element={
            <>
              <Helmet>
                <title>{seoConfig.title}</title>
                <meta name="robots" content={seoConfig.robots} />
                <link rel="canonical" href={seoConfig.url} />
              </Helmet>
              <EmailVerification />
            </>
          } 
        />
        <Route 
          path="/reset-password" 
          element={
            <>
              <Helmet>
                <title>{seoConfig.title}</title>
                <meta name="robots" content={seoConfig.robots} />
                <link rel="canonical" href={seoConfig.url} />
              </Helmet>
              <ResetPassword />
            </>
          } 
        />
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
