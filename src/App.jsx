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
