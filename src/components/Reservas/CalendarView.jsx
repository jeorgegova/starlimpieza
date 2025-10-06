import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { servicesOptions, calendarStyles, responsiveModalStyles } from './constants'

// Configurar moment en español
moment.locale("es")
const localizer = momentLocalizer(moment)

export default function CalendarView({
  user,
  service,
  setService,
  selectedService,
  events,
  loading,
  handleSelectSlot,
  calDate,
  setCalDate,
  calView,
  setCalView,
  locationOptions,
  openReservationDetail,
}) {
  return (
    <>
      <style>{calendarStyles + responsiveModalStyles}</style>

      {/* Instrucciones compactas para usuarios no logueados */}
      {!user && (
        <div
          style={{
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            padding: "1rem",
            borderRadius: 12,
            marginBottom: "1.5rem",
            border: "1px solid #f59e0b",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ fontSize: "1.2rem" }}>🚀</div>
            <div>
              <strong style={{ color: "#92400e", fontSize: "1rem" }}>¿Cómo reservar?</strong>
              <div style={{ color: "#92400e", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                1. Selecciona servicio • 2. Elige fecha • 3. Inicia sesión • 4. Confirma
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selector de servicio compacto */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1f2937" }}>🔧 Servicio:</span>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            style={{
              flex: 1,
              padding: "0.75rem",
              borderRadius: 10,
              fontSize: "1rem",
              border: "2px solid #e5e7eb",
              backgroundColor: "#fff",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            {servicesOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            padding: "0.75rem",
            background: "#f8fafc",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            fontSize: "0.9rem",
            color: "#64748b",
          }}
        >
          <strong style={{ color: "#1f2937" }}>📝</strong> {selectedService?.description}
        </div>
      </div>

      {/* Calendario con header compacto */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            padding: "1rem",
            borderRadius: 12,
            marginBottom: "1rem",
            border: "1px solid #0ea5e9",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#0c4a6e",
              margin: "0 0 0.25rem 0",
            }}
          >
            📅 Calendario de Disponibilidad
          </h3>
          <p
            style={{
              color: "#0369a1",
              fontSize: "0.9rem",
              margin: 0,
            }}
          >
            Clic en fecha <strong style={{ color: "#22c55e" }}>verde</strong> para reservar
            {user && <span> • Clic en <strong style={{ color: "#3b82f6" }}>azul</strong> para ver detalles</span>}
          </p>
        </div>

        {/* Leyenda compacta */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            padding: "0.75rem",
            background: "#f8fafc",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            overflowX: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: "#22c55e",
                borderRadius: 4,
                border: "2px solid #16a34a",
              }}
            ></div>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#1f2937" }}>Disponible</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: "#ef4444",
                borderRadius: 4,
                border: "2px solid #dc2626",
              }}
            ></div>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#1f2937" }}>Ocupado</span>
          </div>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: "#3b82f6",
                  borderRadius: 4,
                  border: "2px solid #2563eb",
                }}
              ></div>
              <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#1f2937" }}>Mis Reservas</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
            <div
              style={{
                width: 16,
                height: 16,
                backgroundColor: "#f1f5f9",
                borderRadius: 4,
                border: "2px solid #cbd5e1",
              }}
            ></div>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#1f2937" }}>Pasado</span>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "#64748b",
            }}
          >
            ⏳ Cargando calendario...
          </div>
        ) : (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 450, marginBottom: "1rem" }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={(event) => {
              if (event.resource === "my-reservation" && event.reservationData) {
                openReservationDetail(event.reservationData)
              }
            }}
            views={["month"]}
            view={calView}
            date={calDate}
            onNavigate={(newDate) => setCalDate(newDate)}
            onView={(newView) => setCalView(newView)}
            toolbar={true}
            eventPropGetter={(event) => {
              if (event.resource === "reserved") {
                return { className: "reserved" }
              } else if (event.resource === "my-reservation") {
                return { className: "my-reservation", style: { cursor: "pointer" } }
              }
              return {}
            }}
            dayPropGetter={(date) => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const checkDate = new Date(date)
              checkDate.setHours(0, 0, 0, 0)

              const isPast = checkDate < today
              const eventsOnDate = events.filter((ev) => {
                const evDate = new Date(ev.start)
                evDate.setHours(0, 0, 0, 0)
                return evDate.getTime() === checkDate.getTime()
              })

              let isReserved = false
              if (service === "Limpieza de casas") {
                const reservedOnDate = eventsOnDate.filter(ev => ev.resource === "reserved")
                isReserved = reservedOnDate.length >= 2
              } else {
                isReserved = eventsOnDate.length > 0
              }

              return {
                style: {
                  backgroundColor: isPast ? "#f1f5f9" : isReserved ? "rgba(239,68,68,0.1)" : "",
                  cursor: isPast || isReserved ? "not-allowed" : "pointer",
                  color: isPast ? "#94a3b8" : "",
                },
              }
            }}
            messages={{
              next: "Siguiente",
              previous: "Anterior",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
            }}
          />
        )}
      </div>
    </>
  )
}