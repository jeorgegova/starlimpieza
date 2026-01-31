import React, { useState, useEffect } from 'react';
import CookieSettings from './CookieSettings';
import PrivacyPolicy from './PrivacyPolicy';
import './CookieConsent.css';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  useEffect(() => {
    // Always show cookie consent on page load
    setShowConsent(true);
  }, []);

  const acceptAllCookies = () => {
    setShowConsent(false);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const openPrivacyPolicy = () => {
    setShowPrivacyPolicy(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

  const closePrivacyPolicy = () => {
    setShowPrivacyPolicy(false);
  };

  if (!showConsent) return null;

  return (
    <>
      <div className="cookie-consent-modal">
        <div className="cookie-consent-content">
          <div className="cookie-consent-text">
            <div className="cookie-consent-title">
              🍪 Cookies y Privacidad
            </div>
            <div className="cookie-consent-description">
              Utilizamos cookies propias y de terceros para mejorar tu experiencia,
              analizar el tráfico web y personalizar el contenido. Consulta nuestra{' '}
              <button
                onClick={openPrivacyPolicy}
                style={{
                  color: '#3b82f6',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  padding: 0,
                  fontFamily: 'inherit'
                }}
              >
                política de privacidad
              </button>{' '}
              para más información sobre cómo utilizamos tus datos.
            </div>
          </div>

          <div className="cookie-consent-buttons">
            <button
              className="cookie-consent-settings"
              onClick={openSettings}
            >
              ⚙️ Ajustes
            </button>
            <button
              className="cookie-consent-accept"
              onClick={acceptAllCookies}
            >
              ✅ Aceptar Todas
            </button>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <CookieSettings
          onClose={closeSettings}
          onAcceptAll={acceptAllCookies}
        />
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <PrivacyPolicy onClose={closePrivacyPolicy} />
      )}
    </>
  );
};

export default CookieConsent;