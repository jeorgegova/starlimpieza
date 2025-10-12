import React, { useState } from 'react';
import './CookieSettings.css';

const CookieSettings = ({ onClose, onAcceptAll }) => {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  const handleToggle = (type) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSavePreferences = () => {
    // Here you would save the preferences to localStorage or send to server
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
    onClose();
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setCookiePreferences(allAccepted);
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    onAcceptAll();
  };

  return (
    <>
      <div className="cookie-settings-overlay" onClick={onClose}>
        <div className="cookie-settings-modal" onClick={(e) => e.stopPropagation()}>
          <div className="cookie-settings-header">
            <h2 className="cookie-settings-title">⚙️ Configuración de Cookies</h2>
            <p className="cookie-settings-subtitle">
              Personaliza qué tipos de cookies deseas aceptar en nuestro sitio web
            </p>
          </div>

          <div className="cookie-settings-content">
            {/* Cookies Esenciales */}
            <div className="cookie-category">
              <div className="cookie-category-header">
                <div className="cookie-category-title">
                  🔒 Cookies Esenciales
                </div>
                <div
                  className={`cookie-toggle ${cookiePreferences.essential ? 'active' : ''} disabled`}
                  onClick={() => handleToggle('essential')}
                >
                  <div className="cookie-toggle-slider"></div>
                </div>
              </div>
              <div className="cookie-category-description">
                Estas cookies son necesarias para el funcionamiento básico del sitio web,
                incluyendo la navegación segura y el acceso a áreas protegidas.
              </div>
              <div className="cookie-category-required">Requeridas - No se pueden desactivar</div>
            </div>

            {/* Cookies de Análisis */}
            <div className="cookie-category">
              <div className="cookie-category-header">
                <div className="cookie-category-title">
                  📊 Cookies de Análisis
                </div>
                <div
                  className={`cookie-toggle ${cookiePreferences.analytics ? 'active' : ''}`}
                  onClick={() => handleToggle('analytics')}
                >
                  <div className="cookie-toggle-slider"></div>
                </div>
              </div>
              <div className="cookie-category-description">
                Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web
                recopilando información de forma anónima sobre el uso del sitio.
              </div>
            </div>

            {/* Cookies de Marketing */}
            <div className="cookie-category">
              <div className="cookie-category-header">
                <div className="cookie-category-title">
                  📢 Cookies de Marketing
                </div>
                <div
                  className={`cookie-toggle ${cookiePreferences.marketing ? 'active' : ''}`}
                  onClick={() => handleToggle('marketing')}
                >
                  <div className="cookie-toggle-slider"></div>
                </div>
              </div>
              <div className="cookie-category-description">
                Se utilizan para rastrear visitantes en diferentes sitios web con el fin de
                mostrar anuncios relevantes basados en sus intereses.
              </div>
            </div>

            {/* Cookies Funcionales */}
            <div className="cookie-category">
              <div className="cookie-category-header">
                <div className="cookie-category-title">
                  ⚡ Cookies Funcionales
                </div>
                <div
                  className={`cookie-toggle ${cookiePreferences.functional ? 'active' : ''}`}
                  onClick={() => handleToggle('functional')}
                >
                  <div className="cookie-toggle-slider"></div>
                </div>
              </div>
              <div className="cookie-category-description">
                Permiten recordar las elecciones del usuario (como idioma, ubicación)
                y proporcionan características mejoradas y más personales.
              </div>
            </div>
          </div>

          <div className="cookie-settings-footer">
            <button
              className="cookie-settings-button cookie-settings-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="cookie-settings-button cookie-settings-save"
              onClick={handleSavePreferences}
            >
              Guardar Preferencias
            </button>
            <button
              className="cookie-settings-button cookie-settings-accept-all"
              onClick={handleAcceptAll}
            >
              ✅ Aceptar Todas
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieSettings;