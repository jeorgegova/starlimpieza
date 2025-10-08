import { servicesOptions } from './constants'

export default function ReservationDetailModal({
  showReservationDetailModal,
  setShowReservationDetailModal,
  reservationDetail,
  locationOptions,
}) {
  if (!showReservationDetailModal || !reservationDetail) return null

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
      onClick={() => setShowReservationDetailModal(false)}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: 20,
          maxWidth: 500,
          width: "90%",
          boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
          border: "1px solid #e5e7eb",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowReservationDetailModal(false)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "#64748b",
          }}
        >
          ×
        </button>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#1f2937",
              marginBottom: "0.5rem",
            }}
          >
            Detalles de la Reserva
          </h3>
          <p style={{ color: "#64748b", lineHeight: 1.5 }}>
            Reserva #{reservationDetail.id}
          </p>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ color: "#1f2937", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
            📋 Servicio: {servicesOptions.find((s) => s.value === reservationDetail.service_name)?.label || reservationDetail.service_name}
          </h4>
          <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
            <div style={{ marginBottom: "0.25rem" }}>
              📅 <strong>Fecha:</strong>{" "}
              {new Date(reservationDetail.assigned_date).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            {reservationDetail.shift && (
              <div style={{ marginBottom: "0.25rem" }}>
                🕐 <strong>Jornada:</strong> {reservationDetail.shift === "mañana" ? "Mañana" : "Tarde"}
              </div>
            )}
            <div style={{ marginBottom: "0.25rem" }}>
              📍 <strong>Ubicación:</strong> {locationOptions.find(l => l.id === reservationDetail.location_id)?.location || "Desconocida"}
            </div>
            <div style={{ marginBottom: "0.25rem" }}>
              🏠 <strong>Dirección:</strong> {reservationDetail.address}
            </div>
            <div style={{ marginBottom: "0.25rem" }}>
              📞 <strong>Teléfono:</strong> {reservationDetail.phone}
            </div>
            <div style={{ marginBottom: "0.25rem" }}>
              ⏰ <strong>Estado:</strong>{" "}
              <span
                style={{
                  color:
                    reservationDetail.status === "confirmed" ? "#22c55e" :
                    reservationDetail.status === "completed" ? "#3b82f6" : "#f59e0b",
                  fontWeight: 600,
                }}
              >
                {reservationDetail.status === "confirmed" ? "Confirmada" :
                 reservationDetail.status === "completed" ? "Completada" : "Pendiente"}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => setShowReservationDetailModal(false)}
            style={{
              background: "#f8fafc",
              color: "#64748b",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "0.75rem 1.5rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}