import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

const SECTIONS = ['hero', 'services', 'testimonials', 'contact'];

function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [servicesComplete, setServicesComplete] = useState(false);
  const [serviceCard, setServiceCard] = useState(0);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);

  const scrollToSection = (index) => {
    const sectionId = SECTIONS[index];
    const element = document.getElementById(sectionId);
    if (element) {
      isScrolling.current = true;
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isScrolling.current = false;
      }, 800); // Reducido a 800ms para alinearse con Services
    }
  };

  useEffect(() => {
    const onWheel = (e) => {
      const now = Date.now();
      if (isScrolling.current || now - lastScrollTime.current < 800) {
        e.preventDefault();
        return;
      }

      lastScrollTime.current = now;
      console.log(`App: activeSection=${activeSection}, serviceCard=${serviceCard}, servicesComplete=${servicesComplete}, deltaY=${e.deltaY}`);

      // Si estamos en Services (sección 1)
      if (activeSection === 1) {
        // Solo permitir cambios de sección en los límites
        if (e.deltaY > 0 && servicesComplete) {
          e.preventDefault();
          setActiveSection(2); // Ir a Testimonials
        } else if (e.deltaY < 0 && serviceCard === 0) {
          e.preventDefault();
          setActiveSection(0); // Ir a Hero
        }
        // Dejar que Services maneje el scroll internamente
        return;
      }

      // Para otras secciones
      e.preventDefault();
      if (e.deltaY > 0) {
        setActiveSection((prev) => Math.min(prev + 1, SECTIONS.length - 1));
      } else if (e.deltaY < 0) {
        setActiveSection((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [activeSection, servicesComplete, serviceCard]);

  useEffect(() => {
    scrollToSection(activeSection);
  }, [activeSection]);

  return (
    <>
      <Navbar
        onNavigate={(section) => {
          const index = SECTIONS.indexOf(section);
          if (index >= 0) setActiveSection(index);
        }}
      />
      <Hero active={activeSection === 0} />
      <Services
        active={activeSection === 1}
        currentCard={serviceCard}
        setCurrentCard={setServiceCard}
        onComplete={setServicesComplete}
      />
      <Testimonials active={activeSection === 2} />
      <ContactForm active={activeSection === 3} />
      <Footer />
    </>
  );
}

export default App;