import React from 'react';

const PrivacyPolicy = ({ onClose }) => {
  return (
    <>
      <style>
        {`
          .privacy-policy-overlay {
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

          .privacy-policy-modal {
            background: #fff;
            border-radius: 20px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 80px rgba(0,0,0,0.15);
            position: relative;
            border: 1px solid #e5e7eb;
          }

          .privacy-policy-header {
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid #e5e7eb;
            text-align: center;
            position: sticky;
            top: 0;
            background: #fff;
            border-radius: 20px 20px 0 0;
          }

          .privacy-policy-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }

          .privacy-policy-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
          }

          .privacy-policy-close:hover {
            background: #f8fafc;
            color: #1f2937;
          }

          .privacy-policy-content {
            padding: 1.5rem 2rem 2rem;
            line-height: 1.6;
          }

          .privacy-section {
            margin-bottom: 2rem;
          }

          .privacy-section-title {
            font-size: 1.2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #22c55e;
          }

          .privacy-section-content {
            color: #64748b;
            margin-bottom: 1rem;
          }

          .privacy-list {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
          }

          .privacy-list-item {
            margin-bottom: 0.5rem;
            color: #64748b;
          }

          .privacy-contact {
            background: #f0f9ff;
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid #3b82f6;
            margin-top: 2rem;
          }

          .privacy-contact-title {
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 0.5rem;
          }

          .privacy-contact-text {
            color: #64748b;
            margin-bottom: 0.5rem;
          }

          .privacy-contact-link {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
          }

          .privacy-contact-link:hover {
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .privacy-policy-modal {
              width: 95%;
              margin: 1rem;
            }
            .privacy-policy-header {
              padding: 1.5rem 1.5rem 1rem;
            }
            .privacy-policy-content {
              padding: 1rem 1.5rem 1.5rem;
            }
            .privacy-section-title {
              font-size: 1.1rem;
            }
          }
        `}
      </style>

      <div className="privacy-policy-overlay" onClick={onClose}>
        <div className="privacy-policy-modal" onClick={(e) => e.stopPropagation()}>
          <div className="privacy-policy-header">
            <button className="privacy-policy-close" onClick={onClose}>×</button>
            <h2 className="privacy-policy-title">📋 Política de Privacidad</h2>
          </div>

          <div className="privacy-policy-content">
            <div className="privacy-section">
              <h3 className="privacy-section-title">1. Información General</h3>
              <div className="privacy-section-content">
                Esta Política de Privacidad describe cómo Star Limpieza recopila, utiliza y protege
                la información personal que nos proporcionas cuando utilizas nuestro sitio web y servicios.
                Nos comprometemos a proteger tu privacidad y a tratar tus datos personales de manera responsable.
              </div>
            </div>

            <div className="privacy-section">
              <h3 className="privacy-section-title">2. Información que Recopilamos</h3>
              <div className="privacy-section-content">
                Podemos recopilar los siguientes tipos de información:
              </div>
              <ul className="privacy-list">
                <li className="privacy-list-item">
                  <strong>Información personal:</strong> Nombre, dirección de correo electrónico,
                  número de teléfono, dirección física.
                </li>
                <li className="privacy-list-item">
                  <strong>Información de uso:</strong> Cómo utilizas nuestro sitio web,
                  páginas visitadas, tiempo de permanencia.
                </li>
                <li className="privacy-list-item">
                  <strong>Información técnica:</strong> Dirección IP, tipo de navegador,
                  sistema operativo, cookies.
                </li>
                <li className="privacy-list-item">
                  <strong>Información de reservas:</strong> Detalles de servicios solicitados,
                  ubicación, preferencias.
                </li>
              </ul>
            </div>

            <div className="privacy-section">
              <h3 className="privacy-section-title">3. Uso de Cookies</h3>
              <div className="privacy-section-content">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio web:
              </div>
              <ul className="privacy-list">
                <li className="privacy-list-item">
                  <strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio.
                </li>
                <li className="privacy-list-item">
                  <strong>Cookies de análisis:</strong> Nos ayudan a entender cómo utilizas nuestro sitio.
                </li>
                <li className="privacy-list-item">
                  <strong>Cookies de marketing:</strong> Para mostrar anuncios relevantes.
                </li>
                <li className="privacy-list-item">
                  <strong>Cookies funcionales:</strong> Para recordar tus preferencias.
                </li>
              </ul>
            </div>

            <div className="privacy-section">
              <h3 className="privacy-section-title">4. Cómo Utilizamos tu Información</h3>
              <div className="privacy-section-content">
                Utilizamos la información recopilada para:
              </div>
              <ul className="privacy-list">
                <li className="privacy-list-item">Procesar y gestionar tus reservas de servicios.</li>
                <li className="privacy-list-item">Comunicarnos contigo sobre tus reservas y servicios.</li>
                <li className="privacy-list-item">Mejorar nuestro sitio web y servicios.</li>
                <li className="privacy-list-item">Enviar información relevante sobre nuestros servicios.</li>
                <li className="privacy-list-item">Cumplir con obligaciones legales.</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h3 className="privacy-section-title">5. Compartir Información</h3>
              <div className="privacy-section-content">
                No vendemos, alquilamos ni compartimos tu información personal con terceros,
                excepto en los siguientes casos:
              </div>
              <ul className="privacy-list">
                <li className="privacy-list-item">Con tu consentimiento explícito.</li>
                <li className="privacy-list-item">Para proporcionar los servicios solicitados.</li>
                <li className="privacy-list-item">Cuando sea requerido por ley.</li>
                <li className="privacy-list-item">Para proteger nuestros derechos y seguridad.</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h3 className="privacy-section-title">6. Seguridad de Datos</h3>
              <div className="privacy-section-content">
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger
                tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
                Utilizamos encriptación SSL/TLS para proteger la transmisión de datos.
              </div>
            </div>

            <div className="privacy-section">
              <h3 className="privacy-section-title">7. Tus Derechos</h3>
              <div className="privacy-section-content">
                Según el RGPD y otras leyes de protección de datos, tienes derecho a:
              </div>
              <ul className="privacy-list">
                <li className="privacy-list-item">Acceder a tus datos personales.</li>
                <li className="privacy-list-item">Rectificar información inexacta.</li>
                <li className="privacy-list-item">Solicitar la eliminación de tus datos.</li>
                <li className="privacy-list-item">Limitar el procesamiento de tus datos.</li>
                <li className="privacy-list-item">Oponerte al procesamiento.</li>
                <li className="privacy-list-item">Portabilidad de datos.</li>
              </ul>
            </div>

            <div className="privacy-section">
              <h3 className="privacy-section-title">8. Retención de Datos</h3>
              <div className="privacy-section-content">
                Conservamos tu información personal solo durante el tiempo necesario para cumplir
                con los fines para los que fue recopilada, incluyendo cualquier requisito legal,
                contable o de informes. Los datos de reservas se conservan durante el período
                necesario para proporcionar el servicio y gestionar cualquier reclamación posterior.
              </div>
            </div>

            <div className="privacy-section">
              <h3 className="privacy-section-title">9. Cambios a esta Política</h3>
              <div className="privacy-section-content">
                Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos
                sobre cambios significativos mediante un aviso destacado en nuestro sitio web
                o enviándote una notificación directa. El uso continuado de nuestros servicios
                después de dichos cambios constituirá tu aceptación de la política actualizada.
              </div>
            </div>

            <div className="privacy-contact">
              <h4 className="privacy-contact-title">📞 Contacto</h4>
              <p className="privacy-contact-text">
                Si tienes preguntas sobre esta Política de Privacidad o deseas ejercer tus derechos,
                puedes contactarnos a través de:
              </p>
              <p className="privacy-contact-text">
                <strong>Email:</strong>{' '}
                <a href="mailto:privacidad@starlimpieza.com" className="privacy-contact-link">
                  info@starlimpiezas.com
                </a>
              </p>
              <p className="privacy-contact-text">
                <strong>Teléfono:</strong> +34 643513174
              </p>
              <p className="privacy-contact-text">
                <strong>Dirección:</strong> Mont-ras, Girona, España
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;