import {
  Calendar as BigCalendar,
  momentLocalizer
} from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import {
  servicesOptions,
  calendarStyles,
  responsiveModalStyles
} from './constants'
import {
  Rocket,
  Info,
  ChevronDown,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  Settings,
  ClipboardList
} from 'lucide-react'

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
            background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)",
            padding: "1.25rem",
            borderRadius: 16,
            marginBottom: "2rem",
            border: "1px solid #fde68a",
            boxShadow: "0 4px 12px rgba(251,191,36,0.08)",
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem"
          }}
        >
          <div style={{
            background: "#fef3c7",
            padding: "8px",
            borderRadius: "12px",
            color: "#d97706",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Rocket size={24} />
          </div>
          <div>
            <h4 style={{ color: "#92400e", fontSize: "1rem", fontWeight: 700, margin: "0 0 4px 0" }}>
              ¿Cómo reservar tu servicio?
            </h4>
            <div style={{
              color: "#92400e",
              fontSize: "0.85rem",
              lineHeight: 1.5,
              opacity: 0.9,
              display: "flex",
              flexWrap: "wrap",
              gap: "8px"
            }}>
              <span>1. Selecciona el tipo de servicio</span>
              <span>•</span>
              <span>2. Elige una fecha disponible</span>
              <span>•</span>
              <span>3. Inicia sesión</span>
              <span>•</span>
              <span>4. Confirma los detalles</span>
            </div>
          </div>
        </div>
      )}

      {/* Selector de servicio Moderno */}
      <div style={{
        marginBottom: "2rem",
        background: "#f8fafc",
        padding: "1.5rem",
        borderRadius: 20,
        border: "1px solid #e2e8f0"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ color: "#3b82f6" }}>
              <Settings size={20} />
            </div>
            <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1e293b" }}>Paso 1: Elige tu servicio</span>
          </div>

          <div style={{ position: "relative" }}>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem 1.25rem",
                borderRadius: 14,
                fontSize: "1rem",
                border: "2px solid #e2e8f0",
                backgroundColor: "#fff",
                color: "#1e293b",
                fontWeight: 600,
                cursor: "pointer",
                appearance: "none",
                transition: "all 0.3s ease",
                outline: "none",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6"
                e.target.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.1)"
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0"
                e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)"
              }}
            >
              {servicesOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div style={{
              position: "absolute",
              right: "1.25rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              color: "#64748b"
            }}>
              <ChevronDown size={20} />
            </div>
          </div>

          <div
            style={{
              padding: "1rem",
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: "0.95rem",
              color: "#64748b",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              lineHeight: 1.5
            }}
          >
            <div style={{ color: "#3b82f6", marginTop: "2px" }}>
              <Info size={18} />
            </div>
            <span>{selectedService?.description}</span>
          </div>
        </div>
      </div>

      {/* Calendario con header premium */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            padding: "1.5rem",
            borderRadius: 20,
            marginBottom: "1.5rem",
            border: "1px solid #bfdbfe",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(59,130,246,0.05)"
          }}
        >
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#1e40af",
            marginBottom: "0.5rem"
          }}>
            <CalendarIcon size={22} />
            <h3 style={{ fontWeight: 800, fontSize: "1.25rem", margin: 0 }}>
              Paso 2: Consulta Disponibilidad
            </h3>
          </div>
          <p style={{ color: "#3b82f6", fontSize: "1rem", margin: 0, fontWeight: 500 }}>
            Toca una fecha en <strong style={{ color: "#16a34a" }}>verde</strong> para reservar
            {user && <span> • Toca en <strong style={{ color: "#1d4ed8" }}>azul</strong> para tus detalles</span>}
          </p>
        </div>

        {/* Leyenda refinada */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginBottom: "1.5rem",
            padding: "1rem 1.25rem",
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #f1f5f9",
            overflowX: "auto",
            scrollbarWidth: "none"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
            <div style={{
              width: 14,
              height: 14,
              backgroundColor: "#22c55e",
              borderRadius: 4,
              boxShadow: "0 0 0 2px rgba(34,197,94,0.1)"
            }}></div>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>Disponible</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
            <div style={{
              width: 14,
              height: 14,
              backgroundColor: "#ef4444",
              borderRadius: 4,
              boxShadow: "0 0 0 2px rgba(239,68,68,0.1)"
            }}></div>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>Ocupado</span>
          </div>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
              <div style={{
                width: 14,
                height: 14,
                backgroundColor: "#3b82f6",
                borderRadius: 4,
                boxShadow: "0 0 0 2px rgba(59,130,246,0.1)"
              }}></div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>Mis Reservas</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
            <div style={{
              width: 14,
              height: 14,
              backgroundColor: "#f1f5f9",
              borderRadius: 4,
              boxShadow: "0 0 0 2px rgba(203,213,225,0.1)"
            }}></div>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#475569" }}>Pasado</span>
          </div>
        </div>

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "#fff",
              borderRadius: 20,
              border: "1px solid #f1f5f9",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem"
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              border: "3px solid #f1f5f9",
              borderTopColor: "#3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <span style={{ color: "#64748b", fontWeight: 500 }}>Actualizando disponibilidad...</span>
          </div>
        ) : (
          <BigCalendar
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
              next: "Próximo",
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