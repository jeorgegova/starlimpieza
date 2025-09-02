// components/ContactForm.js
import React, { useEffect, useState } from 'react';

const ContactForm = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1500) { // Adjust threshold as needed
        setIsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="contact" style={{
      padding: '4rem 2rem',
      backgroundColor: '#fff',
      transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', color: '#333' }}>Contáctanos</h2>
      <form style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" placeholder="Nombre" style={{ padding: '1rem', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem' }} />
        <input type="email" placeholder="Email" style={{ padding: '1rem', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem' }} />
        <input type="text" placeholder="Asunto" style={{ padding: '1rem', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem' }} />
        <textarea placeholder="Mensaje" rows="5" style={{ padding: '1rem', borderRadius: '5px', border: '1px solid #ddd', fontSize: '1rem' }}></textarea>
        <button type="submit" style={{ padding: '1rem', backgroundColor: '#4a90e2', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Enviar</button>
      </form>
    </section>
  );
};

export default ContactForm;