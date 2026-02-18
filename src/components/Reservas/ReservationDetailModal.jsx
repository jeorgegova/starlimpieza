import { servicesOptions } from './constants'
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  Info,
  Hash,
  Activity,
  User
} from 'lucide-react'

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
        background: "rgba(15, 23, 42, 0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 11000,
        padding: "1rem",
        backdropFilter: "blur(6px)",
      }}
      onClick={() => setShowReservationDetailModal(false)}
    >
      <div
        style={{
          background: "#fff",
          padding: 0,
          borderRadius: 32,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #f1f5f9",
          position: "relative",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Background */}
        <div style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)",
          padding: "2.5rem 2rem",
          position: "relative",
          color: "#1e293b",
          borderBottom: "1px solid #e2e8f0"
        }}>
          <button
            onClick={() => setShowReservationDetailModal(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(59, 130, 246, 0.05)",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)"}
          >
            <X size={20} color="#3b82f6" />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#3b82f6", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
            <Hash size={16} /> Reserva #{reservationDetail.id.toString().slice(-6)}
          </div>
          <h3
            style={{
              fontSize: "1.75rem",
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-0.025em",
              color: "#0f172a"
            }}
          >
            Detalles del Servicio
          </h3>
        </div>

        <div style={{ padding: "2rem" }}>
          {/* Main Service Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ width: 56, height: 56, background: "#eff6ff", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
              <Activity size={28} />
            </div>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b" }}>
                {servicesOptions.find((s) => s.value === reservationDetail.service_name)?.label || reservationDetail.service_name}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: 600 }}>Servicio Programado</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
            {/* Grid for details */}
            <DetailItem
              icon={<Calendar size={18} />}
              label="Fecha"
              value={new Date(reservationDetail.assigned_date + 'T12:00:00').toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {reservationDetail.shift && (
                <DetailItem
                  icon={<Clock size={18} />}
                  label="Jornada"
                  value={reservationDetail.shift === "mañana" ? "Mañana" : "Tarde"}
                />
              )}
              {reservationDetail.hours && (
                <DetailItem
                  icon={<Clock size={18} />}
                  label="Duración"
                  value={`${reservationDetail.hours} Horas`}
                />
              )}
            </div>

            <div style={{ height: "1px", background: "#f1f5f9", margin: "0.5rem 0" }} />

            <DetailItem
              icon={<MapPin size={18} />}
              label="Ubicación"
              value={`${locationOptions.find(l => l.id === reservationDetail.location_id)?.location || "S.D."} - ${reservationDetail.address}`}
            />

            <DetailItem
              icon={<Phone size={18} />}
              label="Contacto"
              value={reservationDetail.phone}
            />

            <div style={{ height: "1px", background: "#f1f5f9", margin: "0.5rem 0" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <DetailItem
                icon={<Activity size={18} />}
                label="Estado"
                value={
                  <span style={{
                    color: reservationDetail.status === "confirmed" ? "#16a34a" : reservationDetail.status === "completed" ? "#2563eb" : "#d97706",
                    fontWeight: 800
                  }}>
                    {reservationDetail.status === "confirmed" ? "Confirmada" : reservationDetail.status === "completed" ? "Finalizada" : "Pendiente"}
                  </span>
                }
              />
              {reservationDetail.hours && (
                <DetailItem
                  icon={<CreditCard size={18} />}
                  label="Precio Est."
                  value={`${Math.round(reservationDetail.hours * 20)}€`}
                />
              )}
            </div>
          </div>

          <div style={{ marginTop: "2.5rem" }}>
            <button
              onClick={() => setShowReservationDetailModal(false)}
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: 16,
                border: "none",
                background: "#f1f5f9",
                color: "#475569",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
              onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}

function DetailItem({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
      <div style={{ color: "#94a3b8", marginTop: "0.15rem" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.025em" }}>{label}</div>
        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#334155", lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  )
}