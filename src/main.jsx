import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import emailjs from '@emailjs/browser'
import './index.css'
import App from './App.jsx'

// Initialize EmailJS
emailjs.init('your_public_key'); // Replace with your EmailJS public key

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </StrictMode>,
)
