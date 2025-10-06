import { servicesOptions } from './constants'

export default function MyReservationsView({
  userReservations,
  setActiveTab,
  openReservationDetail,
  locationOptions,
}) {
  return (
    <div>
      {/* Header compacto */}
      <div
        style={{
          background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
          padding: "1rem 1.5rem",
          borderRadius: 12,
          marginBottom: "1.5rem",
          border: "1px solid #3b82f6",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#1e40af",
            margin: "0 0 0.25rem 0",
          }}
        >
          📋 Mis Reservas
        </h3>
        <p
          style={{
            color: "#1e40af",
            fontSize: "0.9rem",
            margin: 0,
          }}
        >
          Gestiona tus reservas
        </p>
      </div>

      {userReservations.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            background: "#f8fafc",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>📅</div>
          <h4 style={{ color: "#64748b", marginBottom: "0.5rem", fontSize: "1rem" }}>No tienes reservas aún</h4>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "1rem" }}>
            Ve a "Hacer Reserva" para crear tu primera reserva
          </p>
          <button
            onClick={() => setActiveTab("calendar")}
            style={{
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "0.6rem 1.2rem",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Hacer mi primera reserva
          </button>
        </div>
      ) : (
        <div>
          {/* Estadísticas compactas */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginBottom: "1.5rem",
              overflowX: "auto",
              paddingBottom: "0.5rem",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                padding: "0.75rem",
                borderRadius: 10,
                border: "1px solid #22c55e",
                textAlign: "center",
                minWidth: "100px",
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#166534" }}>
                {userReservations.filter(r => r.status === "confirmed").length}
              </div>
              <div style={{ color: "#166534", fontSize: "0.8rem" }}>Confirmadas</div>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                padding: "0.75rem",
                borderRadius: 10,
                border: "1px solid #0ea5e9",
                textAlign: "center",
                minWidth: "100px",
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0c4a6e" }}>
                {userReservations.filter(r => new Date(r.assigned_date) >= new Date()).length}
              </div>
              <div style={{ color: "#0c4a6e", fontSize: "0.8rem" }}>Próximas</div>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
                padding: "0.75rem",
                borderRadius: 10,
                border: "1px solid #ef4444",
                textAlign: "center",
                minWidth: "100px",
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#dc2626" }}>
                {userReservations.filter(r => new Date(r.assigned_date) < new Date()).length}
              </div>
              <div style={{ color: "#dc2626", fontSize: "0.8rem" }}>Completadas</div>
            </div>
          </div>

          {/* Lista de reservas compacta */}
          <div style={{ display: "grid", gap: "1rem" }}>
            {userReservations.map((reservation) => (
              <div
                key={reservation.id}
                style={{
                  background: "#fff",
                  padding: "1rem",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onClick={() => openReservationDetail(reservation)}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-1px)"
                  e.target.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)"
                  e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.5rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <h4
                        style={{
                          color: "#1f2937",
                          margin: 0,
                          fontSize: "1rem",
                          fontWeight: 600,
                        }}
                      >
                        {servicesOptions.find((s) => s.value === reservation.service_name)?.label ||
                          reservation.service_name}
                      </h4>
                      <span
                        style={{
                          background: reservation.status === "confirmed" ? "#dcfce7" : "#fef3c7",
                          color: reservation.status === "confirmed" ? "#166534" : "#92400e",
                          padding: "0.2rem 0.6rem",
                          borderRadius: 16,
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        {reservation.status === "confirmed" ? "Confirmada" : "Pendiente"}
                      </span>
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.4 }}>
                      <div>
                        📅 {new Date(reservation.assigned_date).toLocaleDateString("es-ES", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                        {" • "}
                        📍 {locationOptions.find(l => l.id === reservation.location_id)?.location || "Desconocida"}
                      </div>
                      <div>
                        🏠 {reservation.address} • 📞 {reservation.phone}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: (() => {
                        const today = new Date()
                        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                        return reservation.assigned_date < todayStr ? "#fef2f2" : "#f0f9ff"
                      })(),
                      color: (() => {
                        const today = new Date()
                        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                        return reservation.assigned_date < todayStr ? "#dc2626" : "#2563eb"
                      })(),
                      padding: "0.5rem 0.75rem",
                      borderRadius: 8,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      textAlign: "center",
                      flexShrink: 0,
                    }}
                  >
                    {(() => {
                      const today = new Date()
                      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
                      return reservation.assigned_date < todayStr ? "✅ Completada" : "⏳ Próxima"
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}