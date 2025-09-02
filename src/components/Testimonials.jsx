// components/Testimonials.js
import React, { useEffect, useState } from 'react';

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1000) { // Adjust threshold as needed
        setIsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="testimonials" style={{
      padding: '4rem 2rem',
      backgroundColor: '#f0f4f8',
      transition: 'opacity 1s ease-in-out, transform 1s ease-in-out',
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
    }}>
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', color: '#333' }}>Lo que dicen nuestros clientes...</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div style={{ padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
          <p>"Hemos contratado sus servicios en varias ocasiones, siempre han sido puntuales, profesionales y con un trato muy personal, siempre pendientes de todos los detalles. Lo recomendamos!"</p>
          <p style={{ textAlign: 'right', fontStyle: 'italic' }}>- fincas turismopals</p>
        </div>
        <div style={{ padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
          <p>"Excelente servicio! Tengo perros y gatos y el sofá me quedó como nuevo. Muy profesionales en su trabajo, todo hecho impecable."</p>
          <p style={{ textAlign: 'right', fontStyle: 'italic' }}>- Jade.S</p>
        </div>
        <div style={{ padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
          <p>"Perfecto trato y mejor atencion, una limpieza en mi piso y terraza perfecta en todos los aspectos."</p>
          <p style={{ textAlign: 'right', fontStyle: 'italic' }}>- Esteve Sandoval Alavedra</p>
        </div>
        <div style={{ padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
          <p>"Estamos muy contentos con los servicios de esta empresa. Los recomendamos ampliamente."</p>
          <p style={{ textAlign: 'right', fontStyle: 'italic' }}>- Isabelle Brunet</p>
        </div>
        <div style={{ padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
          <p>"Grandes profesionales! Un servicio de 5 estrellas, los contratamos para limpiar nuestra casa y también nos ayudaron con otras dudas que teníamos muy amablemente! Sin dudas los volveremos a llamar."</p>
          <p style={{ textAlign: 'right', fontStyle: 'italic' }}>- Lisse Ramírez</p>
        </div>
        <div style={{ padding: '1.5rem', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', backgroundColor: '#fff' }}>
          <p>"Personal muy profesional . Hace tiempo que nos hace la limpieza y estamos satisfechos. Lo recomendamos!"</p>
          <p style={{ textAlign: 'right', fontStyle: 'italic' }}>- Laura</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;