import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { servicesOptions } from './constants'

export default function ReservationModal({
  showReservationModal,
  setShowReservationModal,
  selectedDate,
  service,
  reservationLocation,
  setReservationLocation,
  reservationAddress,
  setReservationAddress,
  reservationPhone,
  setReservationPhone,
  reservationShift,
  setReservationShift,
  handleReserve,
  locationOptions,
  user,
}) {
  const [applicableDiscount, setApplicableDiscount] = useState(0)
  const [loadingDiscount, setLoadingDiscount] = useState(false)

  useEffect(() => {
    if (showReservationModal && user && service) {
      calculateDiscount()
    }
  }, [showReservationModal, user, service])

  const calculateDiscount = async () => {
    if (!user || !service) return

    setLoadingDiscount(true)
    try {
      const { data, error } = await supabase.rpc('get_service_discount', {
        p_user_id: user.id,
        p_service_type: service
      })

      if (error) throw error
      setApplicableDiscount(data || 0)
    } catch (error) {
      console.error('Error calculating discount:', error)
      setApplicableDiscount(0)
    } finally {
      setLoadingDiscount(false)
    }
  }
  if (!showReservationModal) return null

  const selectedService = servicesOptions.find((s) => s.value === service)

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 11000,
        backdropFilter: "blur(4px)",
      }}
      onClick={() => setShowReservationModal(false)}
    >
      <div
        className="reservation-modal"
        style={{
          background: "#fff",
          padding: "2.5rem",
          borderRadius: 24,
          minWidth: 500,
          maxWidth: 600,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
          position: "relative",
          border: "1px solid #e5e7eb",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            📋 Detalles de la Reserva
          </h3>
          <p style={{ color: "#64748b" }}>Completa la información para confirmar tu reserva</p>
        </div>

        {/* Resumen de la reserva */}
        <div
          style={{
            background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
            padding: "1.5rem",
            borderRadius: 16,
            marginBottom: "2rem",
            border: "1px solid #3b82f6",
          }}
        >
          <h4 style={{ color: "#1f2937", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
            📋 Resumen:
          </h4>
          <div style={{ color: "#64748b" }}>
            <strong>Servicio:</strong> {selectedService?.label}
            <br />
            <strong>Fecha:</strong>{" "}
            {selectedDate
              ? selectedDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </div>
        </div>

        {/* Información de precios */}
        <div
          style={{
            background: service === "Limpieza de casas" ? "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)" : "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            padding: "1.5rem",
            borderRadius: 16,
            marginBottom: "2rem",
            border: service === "Limpieza de casas" ? "1px solid #22c55e" : "1px solid #f59e0b",
          }}
        >
          <h4 style={{ color: "#1f2937", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
            💰 Información de Precios:
          </h4>
          {service === "Limpieza de casas" ? (
            <div style={{ color: "#166534" }}>
              <strong>Precio: 20€ por hora</strong>
              <br />
              Se cobra por horas con un mínimo de 4 horas. Vendrán 2 personas (cada persona realiza 2 horas de trabajo).
              {applicableDiscount > 0 && (
                <div style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  background: "#22c55e",
                  color: "white",
                  borderRadius: 8,
                  fontWeight: "600"
                }}>
                  🎉 ¡Bonificación aplicada! Tienes un {applicableDiscount}% de descuento en este servicio
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: "#92400e" }}>
              <strong>Precio: Por cotización</strong>
              <br />
              Se enviará una cotización detallada al confirmar la reserva.
              {applicableDiscount > 0 && (
                <div style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  background: "#f59e0b",
                  color: "white",
                  borderRadius: 8,
                  fontWeight: "600"
                }}>
                  🎉 ¡Bonificación aplicada! Tienes un {applicableDiscount}% de descuento en este servicio
                </div>
              )}
            </div>
          )}
        </div>

        {/* Formulario */}
        <form>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              📍 Ubicación *
            </label>
            <select
              value={reservationLocation}
              onChange={(e) => setReservationLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 12,
                border: "2px solid #e5e7eb",
                fontSize: "1rem",
                backgroundColor: "#fff",
                transition: "all 0.3s ease",
              }}
              required
            >
              <option value="">Selecciona una ubicación</option>
              {locationOptions.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.location}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              🏠 Dirección *
            </label>
            <input
              type="text"
              value={reservationAddress}
              onChange={(e) => setReservationAddress(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 12,
                border: "2px solid #e5e7eb",
                fontSize: "1rem",
                transition: "all 0.3s ease",
              }}
              placeholder="Ej: Calle Mayor 123, Girona"
              required
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                fontWeight: 600,
                color: "#374151",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              📞 Teléfono *
            </label>
            <input
              type="tel"
              value={reservationPhone}
              onChange={(e) => setReservationPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 12,
                border: "2px solid #e5e7eb",
                fontSize: "1rem",
                transition: "all 0.3s ease",
              }}
              placeholder="+34 123 456 789"
              required
            />
          </div>

          {service === "Limpieza de casas" && (
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  fontWeight: 600,
                  color: "#374151",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                🕐 Jornada *
              </label>
              <select
                value={reservationShift}
                onChange={(e) => setReservationShift(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: 12,
                  border: "2px solid #e5e7eb",
                  fontSize: "1rem",
                  backgroundColor: "#fff",
                  transition: "all 0.3s ease",
                }}
                required
              >
                <option value="">Selecciona una jornada</option>
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
              </select>
            </div>
          )}

          {/* Política de cancelaciones */}
          <div
            style={{
              background: "#fef2f2",
              padding: "1rem",
              borderRadius: 12,
              marginBottom: "2rem",
              border: "1px solid #fecaca",
            }}
          >
            <strong style={{ color: "#dc2626" }}>⚠️ Política de Cancelaciones:</strong>
            <p style={{ color: "#dc2626", margin: "0.5rem 0 0 0", fontSize: "0.9rem" }}>
              Cancelaciones con menos de 48 horas pierden la mitad del dinero. Cancelaciones con menos de 24 horas pierden todo el dinero.
            </p>
          </div>

          <div
            className="reservation-modal-buttons"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={() => setShowReservationModal(false)}
              style={{
                background: "#f8fafc",
                color: "#64748b",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "1rem 2rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "1rem",
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleReserve}
              style={{
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                borderRadius: 12,
                fontSize: "1rem",
                padding: "1rem 2rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
              }}
            >
              ✅ Confirmar Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}