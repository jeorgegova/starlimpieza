import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/LandingPage/Navbar';
import Hero from './components/LandingPage/Hero';
import Services from './components/LandingPage/Services';
import HorizontalTimelineTestimonials from './components/LandingPage/Testimonials';
import ContactForm from './components/LandingPage/ContactForm';
import Footer from './components/LandingPage/Footer';
import AboutUs from './components/LandingPage/AboutUs';
import Reserva from './components/Recervas';

function App() {
  const [currentSection, setCurrentSection] = useState('hero');
  const sectionsRef = useRef({});

  // Función para scroll suave a una sección específica
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Intersection Observer para detectar la sección actual
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Activa cuando la sección está en el centro
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
    <Router>
      <div className="scroll-smooth">
        <Navbar currentSection={currentSection} onNavigate={scrollToSection} />
        <Routes>
          <Route 
            path="/" 
            element={
              <main>
                <Hero />
                <Services />
                <AboutUs />
                <HorizontalTimelineTestimonials />
                <ContactForm />
              </main>
            } 
          />
          <Route path="/reservas" element={<Reserva />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
