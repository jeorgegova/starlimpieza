import React, { useState } from 'react';

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
      <style>
        {`
          .cookie-settings-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            backdrop-filter: blur(4px);
          }

          .cookie-settings-modal {
            background: #fff;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 80px rgba(0,0,0,0.15);
            position: relative;
            border: 1px solid #e5e7eb;
          }

          .cookie-settings-header {
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid #e5e7eb;
            text-align: center;
          }

          .cookie-settings-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }

          .cookie-settings-subtitle {
            color: #64748b;
            font-size: 0.95rem;
          }

          .cookie-settings-content {
            padding: 1.5rem 2rem;
          }

          .cookie-category {
            margin-bottom: 2rem;
            padding: 1.5rem;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            background: #f8fafc;
          }

          .cookie-category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .cookie-category-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .cookie-toggle {
            position: relative;
            width: 50px;
            height: 26px;
            background: #e2e8f0;
            border-radius: 13px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .cookie-toggle.active {
            background: #22c55e;
          }

          .cookie-toggle.disabled {
            background: #94a3b8;
            cursor: not-allowed;
          }

          .cookie-toggle-slider {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 22px;
            height: 22px;
            background: white;
            border-radius: 50%;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }

          .cookie-toggle.active .cookie-toggle-slider {
            transform: translateX(24px);
          }

          .cookie-category-description {
            color: #64748b;
            font-size: 0.9rem;
            line-height: 1.5;
          }

          .cookie-category-required {
            color: #dc2626;
            font-size: 0.8rem;
            font-weight: 600;
            margin-top: 0.5rem;
          }

          .cookie-settings-footer {
            padding: 1.5rem 2rem 2rem;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }

          .cookie-settings-button {
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
          }

          .cookie-settings-save {
            background: #22c55e;
            color: white;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
          }

          .cookie-settings-save:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
          }

          .cookie-settings-accept-all {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
          }

          .cookie-settings-accept-all:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
          }

          .cookie-settings-cancel {
            background: #f8fafc;
            color: #64748b;
            border: 1px solid #e2e8f0;
          }

          .cookie-settings-cancel:hover {
            background: #f1f5f9;
            border-color: #cbd5e1;
          }

          @media (max-width: 768px) {
            .cookie-settings-modal {
              width: 95%;
              margin: 1rem;
            }
            .cookie-settings-header {
              padding: 1.5rem 1.5rem 1rem;
            }
            .cookie-settings-content {
              padding: 1rem 1.5rem;
            }
            .cookie-settings-footer {
              padding: 1rem 1.5rem 1.5rem;
              flex-direction: column;
            }
            .cookie-settings-button {
              width: 100%;
            }
          }
        `}
      </style>

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