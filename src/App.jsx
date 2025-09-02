import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Services />
      <Testimonials />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
