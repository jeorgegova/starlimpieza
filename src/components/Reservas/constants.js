export const servicesOptions = [
  { value: "Limpieza de casas", label: "Limpieza de Casas", description: "Limpieza completa de tu hogar" },
  { value: "Turismo & Airbnb", label: "Turismo & Airbnb", description: "Preparación para huéspedes" },
  { value: "Servicios Forestales", label: "Servicios Forestales", description: "Mantenimiento de áreas verdes" },
  { value: "Cristales Premium", label: "Cristales Premium", description: "Limpieza especializada de cristales" },
  { value: "Gestión de Terrenos", label: "Gestión de Terrenos", description: "Mantenimiento de propiedades" },
  { value: "Limpiezas de Garajes", label: "Limpieza de Garajes", description: "Limpieza y organización" },
  { value: "Limpieza de Cocinas", label: "Limpieza de Cocinas", description: "Limpieza profunda de cocinas" },
  { value: "Comunidades", label: "Comunidades", description: "Mantenimiento de áreas comunes" },
]

export const calendarStyles = `
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  .rbc-calendar {
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
  }
  .rbc-day-bg:hover {
    background-color: rgba(34,197,94,0.1) !important;
    border: 2px solid #22c55e !important;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .rbc-event.reserved {
    background-color: #ef4444 !important;
    border: none !important;
    color: #fff !important;
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 0.85rem;
    cursor: not-allowed;
    font-weight: 600;
  }
  .rbc-event.my-reservation {
    background-color: #3b82f6 !important;
    border: none !important;
    color: #fff !important;
    border-radius: 8px;
    padding: 4px 8px;
    font-size: 0.85rem;
    font-weight: 600;
  }
  .rbc-selected {
    background-color: #22c55e !important;
    border: 2px solid #16a34a !important;
  }
  .rbc-today {
    background-color: rgba(34,197,94,0.05) !important;
  }
  .rbc-toolbar {
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }
  .rbc-btn-group button {
    border-radius: 8px !important;
    padding: 0.5rem 1rem !important;
    font-weight: 500 !important;
    transition: all 0.3s !important;
    border: 1px solid #e5e7eb !important;
    margin: 0 0.25rem !important;
  }
  .rbc-btn-group button:hover {
    background-color: #22c55e !important;
    color: white !important;
    border-color: #22c55e !important;
  }
  .rbc-toolbar-label {
    font-weight: 700;
    color: #111827;
    font-size: 1.2rem;
  }
`

export const responsiveModalStyles = `
   @media (max-width: 768px) {
     .reservation-modal {
       padding: 1rem !important;
       min-width: 95vw !important;
       max-width: 95vw !important;
       max-height: 95vh !important;
       margin: 1rem !important;
     }
     .reservation-modal-buttons {
       flex-direction: column !important;
       gap: 0.5rem !important;
     }
     .reservation-modal-buttons button {
       width: 100% !important;
       min-width: unset !important;
     }

      /* AuthModal Responsive Styles */
      .auth-modal-container {
        padding: 1rem !important;
        border-radius: 24px !important;
        margin: 0.5rem !important;
        width: 100% !important;
        max-width: 100% !important;
        max-height: 95vh !important;
      }

      .auth-modal-description {
        display: none !important;
      }

      .auth-modal-title {
        font-size: 1.35rem !important;
        margin-bottom: 0 !important;
      }

      .auth-modal-header {
        margin-bottom: 0.75rem !important;
      }

      .auth-modal-close-button {
        top: 0.75rem !important;
        right: 0.75rem !important;
        width: 32px !important;
        height: 32px !important;
      }

      .auth-modal-icon-container {
        width: 36px !important;
        height: 36px !important;
        margin-bottom: 0.5rem !important;
      }

      .auth-modal-icon-container svg {
        width: 18px !important;
        height: 18px !important;
      }

      .auth-modal-form-group {
        margin-bottom: 0.5rem !important;
      }

      .auth-modal-input {
        padding: 0.75rem 0.75rem 0.75rem 2.5rem !important;
        font-size: 0.95rem !important;
      }

      .auth-modal-input-icon {
        left: 0.75rem !important;
        width: 18px !important;
        height: 18px !important;
      }

      .auth-modal-label {
        font-size: 0.75rem !important;
        margin-bottom: 0.25rem !important;
      }

      .auth-modal-forgot-password {
        margin-top: -0.25rem !important;
        margin-bottom: 0.75rem !important;
      }

      .auth-modal-submit-button {
        padding: 0.75rem !important;
        font-size: 0.95rem !important;
      }

      .auth-modal-footer {
        margin-top: 0.75rem !important;
        padding-top: 0.75rem !important;
      }

      .auth-modal-p {
        font-size: 0.85rem !important;
        margin-bottom: 0.1rem !important;
      }
    }

   @media (max-width: 1024px) {
     .info-cards-grid {
       grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
     }
     .tab-cards-grid {
       grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
     }
     .legend-grid {
       grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
     }
     .stats-grid {
       grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
     }
   }

   @media (max-width: 768px) {
     .info-cards-grid {
       grid-template-columns: 1fr !important;
     }
     .tab-cards-grid {
       grid-template-columns: 1fr !important;
     }
     .legend-grid {
       grid-template-columns: repeat(2, 1fr) !important;
     }
     .stats-grid {
       grid-template-columns: repeat(3, 1fr) !important;
     }
   }
`