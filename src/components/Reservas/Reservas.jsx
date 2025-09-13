"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

// Configurar moment en español
moment.locale("es")
const localizer = momentLocalizer(moment)

const servicesOptions = [
  { value: "Limpieza de casas", label: "Limpieza de Casas", description: "Limpieza completa de tu hogar" },
  { value: "Turismo & Airbnb", label: "Turismo & Airbnb", description: "Preparación para huéspedes" },
  { value: "Servicios Forestales", label: "Servicios Forestales", description: "Mantenimiento de áreas verdes" },
  { value: "Cristales Premium", label: "Cristales Premium", description: "Limpieza especializada de cristales" },
  { value: "Gestión de Terrenos", label: "Gestión de Terrenos", description: "Mantenimiento de propiedades" },
  { value: "Limpiezas de Garajes", label: "Limpieza de Garajes", description: "Limpieza y organización" },
  { value: "Limpieza de Cocinas", label: "Limpieza de Cocinas", description: "Limpieza profunda de cocinas" },
  { value: "Comunidades", label: "Comunidades", description: "Mantenimiento de áreas comunes" },
]

const calendarStyles = `
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

export default function ReservaMejorada() {
  // Estados principales
  const [service, setService] = useState(servicesOptions[0].value)
  const [reservedEvents, setReservedEvents] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [allReservations, setAllReservations] = useState([])
  const [userReservations, setUserReservations] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [user, setUser] = useState(null)

  // Estados de autenticación
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [regUsername, setRegUsername] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regName, setRegName] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regAddress, setRegAddress] = useState("")
  const [regError, setRegError] = useState("")
  const [regSuccess, setRegSuccess] = useState("")

  // Estados del calendario
  const [calDate, setCalDate] = useState(new Date())
  const [calView, setCalView] = useState("month")

  // Estados de vista
  const [activeTab, setActiveTab] = useState("calendar")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [reservationToDelete, setReservationToDelete] = useState(null)

  const [showEditModal, setShowEditModal] = useState(false)
  const [reservationToEdit, setReservationToEdit] = useState(null)
  const [editDate, setEditDate] = useState("")
  const [editService, setEditService] = useState("")

  useEffect(() => {
    fetchAllReservations()
    if (user) {
      fetchUserReservations()
    }
    setSelectedDate(null)
  }, [service, user])

  useEffect(() => {
    const mappedEvents = [...reservedEvents]
    if (user) {
      // Agregar reservas del usuario actual con diferente color
      const userEvents = userReservations.map((r) => ({
        title: "Mi Reserva",
        start: new Date(r.assigned_date),
        end: new Date(r.assigned_date),
        allDay: true,
        resource: "my-reservation",
        reservationData: r,
      }))
      mappedEvents.push(...userEvents)
    }
    setEvents(mappedEvents)
  }, [reservedEvents, userReservations, user])

  async function fetchAllReservations() {
    setLoading(true)
    const { data, error } = await supabase
      .from("user_services")
      .select("*, users(name, username, phone, email)")
      .eq("service_name", service)
      .order("assigned_date", { ascending: true })

    if (error) {
      setAllReservations([])
      setReservedEvents([])
    } else {
      setAllReservations(data)
      const mappedReserved = data
        .filter((r) => !user || r.user_id !== user.id) // Excluir reservas del usuario actual
        .map((r) => ({
          title: "Reservado",
          start: new Date(r.assigned_date),
          end: new Date(r.assigned_date),
          allDay: true,
          resource: "reserved",
        }))
      setReservedEvents(mappedReserved)
    }
    setLoading(false)
  }

  async function fetchUserReservations() {
    if (!user) return

    const { data, error } = await supabase
      .from("user_services")
      .select("*")
      .eq("user_id", user.id)
      .order("assigned_date", { ascending: true })

    if (!error && data) {
      setUserReservations(data)
    }
  }

  function handleSelectSlot({ start }) {
    const selected = new Date(start.setHours(0, 0, 0, 0))
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selected < today) {
      alert("No puedes reservar fechas pasadas")
      return
    }

    const isReserved = events.some((ev) => {
      const evStart = new Date(ev.start.setHours(0, 0, 0, 0))
      return evStart.getTime() === selected.getTime()
    })

    if (isReserved) {
      alert("Esta fecha ya está ocupada. Por favor elige otra fecha.")
      return
    }

    if (!user) {
      setShowAuthModal(true)
      return
    }

    setSelectedDate(start)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError("")

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .limit(1)

    if (error) {
      setLoginError("Error de conexión. Intenta nuevamente.")
      return
    }

    if (data.length === 1) {
      setUser(data[0])
      clearAuthFields()
      setShowAuthModal(false)
    } else {
      setLoginError("Usuario o contraseña incorrectos")
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setRegError("")
    setRegSuccess("")

    if (!regUsername || !regPassword || !regName) {
      setRegError("Por favor completa todos los campos obligatorios")
      return
    }

    // Verificar si el usuario ya existe
    const { data: existingUser, error } = await supabase.from("users").select("id").eq("username", regUsername).limit(1)

    if (error) {
      setRegError("Error de conexión")
      return
    }

    if (existingUser.length > 0) {
      setRegError("Este nombre de usuario ya está en uso")
      return
    }

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          username: regUsername,
          password: regPassword,
          name: regName,
          phone: regPhone,
          email: regEmail,
          address: regAddress,
          role: "user", // Rol por defecto
        },
      ])
      .select()
      .single()

    if (insertError) {
      setRegError("Error al crear la cuenta: " + insertError.message)
      return
    }

    // Iniciar sesión automáticamente después del registro
    setUser(newUser)
    clearAuthFields()
    setShowAuthModal(false)
    alert("¡Cuenta creada exitosamente! Has iniciado sesión automáticamente.")
  }

  function clearAuthFields() {
    setUsername("")
    setPassword("")
    setRegUsername("")
    setRegPassword("")
    setRegName("")
    setRegPhone("")
    setRegEmail("")
    setRegAddress("")
    setLoginError("")
    setRegError("")
    setRegSuccess("")
  }

  function handleLogout() {
    setUser(null)
    setSelectedDate(null)
    setUserReservations([])
    setActiveTab("calendar")
  }

  async function handleReserve() {
    if (!selectedDate) {
      alert("Por favor selecciona una fecha para reservar")
      return
    }

    if (!user) {
      alert("Debes iniciar sesión para hacer una reserva")
      return
    }

    const { error } = await supabase.from("user_services").insert([
      {
        user_id: user.id,
        service_name: service,
        assigned_date: selectedDate.toISOString().slice(0, 10),
        status: "confirmed",
      },
    ])

    if (error) {
      alert("Error al crear la reserva: " + error.message)
    } else {
      alert("¡Reserva creada exitosamente!")
      fetchAllReservations()
      fetchUserReservations()
      setSelectedDate(null)
    }
  }

  async function handleDeleteReservation(reservationId) {
    const { error } = await supabase.from("user_services").delete().eq("id", reservationId)

    if (error) {
      alert("Error al eliminar la reserva")
    } else {
      alert("Reserva eliminada exitosamente")
      fetchAllReservations()
      fetchUserReservations()
      setShowDeleteModal(false)
      setReservationToDelete(null)
    }
  }

  async function handleEditReservation() {
    if (!editDate || !editService) {
      alert("Por favor completa todos los campos")
      return
    }

    const { error } = await supabase
      .from("user_services")
      .update({
        assigned_date: editDate,
        service_name: editService,
      })
      .eq("id", reservationToEdit.id)

    if (error) {
      alert("Error al actualizar la reserva: " + error.message)
    } else {
      alert("Reserva actualizada exitosamente")
      fetchAllReservations()
      fetchUserReservations()
      setShowEditModal(false)
      setReservationToEdit(null)
      setEditDate("")
      setEditService("")
    }
  }

  function openEditModal(reservation) {
    setReservationToEdit(reservation)
    setEditDate(reservation.assigned_date)
    setEditService(reservation.service_name)
    setShowEditModal(true)
  }

  const selectedService = servicesOptions.find((s) => s.value === service)

  return (
    <>
      <style>{calendarStyles}</style>

      {/* Botón flotante de autenticación */}
      {!user && (
        <button
          style={{
            position: "fixed",
            zIndex: 9999,
            right: 28,
            top: 28,
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            borderRadius: 50,
            boxShadow: "0 8px 32px rgba(34,197,94,0.3)",
            padding: "1rem 2rem",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onClick={() => {
            setShowAuthModal(true)
            setAuthMode("login")
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)"
            e.target.style.boxShadow = "0 12px 40px rgba(34,197,94,0.4)"
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)"
            e.target.style.boxShadow = "0 8px 32px rgba(34,197,94,0.3)"
          }}
        >
          Iniciar Sesión
        </button>
      )}

      <div
        style={{
          maxWidth: 1200,
          margin: "2rem auto",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          padding: "2rem",
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          border: "1px solid #f1f5f9",
        }}
      >
        {/* Header mejorado */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "3rem",
            padding: "2rem",
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            borderRadius: 20,
            border: "1px solid #e0f2fe",
          }}
        >
          <h1
            style={{
              fontWeight: 800,
              fontSize: "2.5rem",
              marginBottom: "1rem",
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            Sistema de Reservas
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#64748b",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Reserva fácilmente nuestros servicios profesionales. Selecciona el servicio que necesitas y elige la fecha
            que mejor te convenga.
          </p>
        </div>

        {/* Información del usuario */}
        {user && (
          <div
            style={{
              background:
                user.role === "admin"
                  ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)"
                  : "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              padding: "1.5rem",
              borderRadius: 16,
              marginBottom: "2rem",
              border: user.role === "admin" ? "1px solid #f59e0b" : "1px solid #3b82f6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "1.1rem",
                  color: "#1f2937",
                  fontWeight: 600,
                }}
              >
                {user.role === "admin" ? "Administrador:" : "Bienvenido:"} <strong>{user.name}</strong>
              </span>
              {user.role === "admin" && (
                <div style={{ fontSize: "0.9rem", color: "#92400e", marginTop: "0.25rem" }}>
                  Tienes permisos para gestionar todas las reservas
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(239,68,68,0.1)",
                color: "#dc2626",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8,
                padding: "0.5rem 1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        )}

        {/* Navegación por pestañas para usuarios logueados */}
        {user && (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "2rem",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "1rem",
            }}
          >
            <button
              onClick={() => setActiveTab("calendar")}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: 12,
                border: "none",
                background: activeTab === "calendar" ? "#22c55e" : "#f8fafc",
                color: activeTab === "calendar" ? "#fff" : "#64748b",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Hacer Reserva
            </button>
            <button
              onClick={() => setActiveTab("myReservations")}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: 12,
                border: "none",
                background: activeTab === "myReservations" ? "#22c55e" : "#f8fafc",
                color: activeTab === "myReservations" ? "#fff" : "#64748b",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Mis Reservas ({userReservations.length})
            </button>
            {user.role === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                style={{
                  padding: "0.75rem 1.5rem",
                  borderRadius: 12,
                  border: "none",
                  background: activeTab === "admin" ? "#f59e0b" : "#f8fafc",
                  color: activeTab === "admin" ? "#fff" : "#64748b",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Panel Admin
              </button>
            )}
          </div>
        )}

        {/* Contenido principal basado en la pestaña activa */}
        {(!user || activeTab === "calendar") && (
          <>
            {/* Instrucciones para usuarios no logueados */}
            {!user && (
              <div
                style={{
                  background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                  padding: "1.5rem",
                  borderRadius: 16,
                  marginBottom: "2rem",
                  border: "1px solid #f59e0b",
                }}
              >
                <h3 style={{ color: "#92400e", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
                  ℹ️ ¿Cómo hacer una reserva?
                </h3>
                <ol style={{ color: "#92400e", paddingLeft: "1.5rem", lineHeight: 1.6 }}>
                  <li>Selecciona el servicio que necesitas</li>
                  <li>Haz clic en una fecha disponible del calendario</li>
                  <li>Inicia sesión o crea una cuenta</li>
                  <li>Confirma tu reserva</li>
                </ol>
              </div>
            )}

            {/* Selector de servicio mejorado */}
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  fontWeight: 700,
                  color: "#1f2937",
                  marginBottom: "1rem",
                  display: "block",
                  fontSize: "1.2rem",
                }}
              >
                🔧 Selecciona tu servicio:
              </label>
              <div
                style={{
                  background: "#f8fafc",
                  padding: "1.5rem",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                }}
              >
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    borderRadius: 12,
                    fontSize: "1.1rem",
                    border: "2px solid #e5e7eb",
                    backgroundColor: "#fff",
                    fontWeight: 600,
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
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <strong style={{ color: "#1f2937" }}>📝 Descripción:</strong>
                  <p style={{ color: "#64748b", margin: "0.5rem 0 0 0" }}>{selectedService?.description}</p>
                </div>
              </div>
            </div>

            {/* Calendario */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "#1f2937",
                  marginBottom: "1rem",
                }}
              >
                📅 Selecciona una fecha disponible:
              </h3>

              {/* Leyenda del calendario */}
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginBottom: "1rem",
                  padding: "1rem",
                  background: "#f8fafc",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: "#22c55e",
                      borderRadius: 4,
                    }}
                  ></div>
                  <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Disponible</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: "#ef4444",
                      borderRadius: 4,
                    }}
                  ></div>
                  <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Ocupado</span>
                </div>
                {user && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        backgroundColor: "#3b82f6",
                        borderRadius: 4,
                      }}
                    ></div>
                    <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Mis reservas</span>
                  </div>
                )}
              </div>

              {loading ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem",
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
                  style={{ height: 500, marginBottom: "2rem" }}
                  selectable
                  onSelectSlot={handleSelectSlot}
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
                      return { className: "my-reservation" }
                    }
                    return {}
                  }}
                  dayPropGetter={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    const checkDate = new Date(date)
                    checkDate.setHours(0, 0, 0, 0)

                    const isPast = checkDate < today
                    const isReserved = events.some((ev) => {
                      const evDate = new Date(ev.start)
                      evDate.setHours(0, 0, 0, 0)
                      return evDate.getTime() === checkDate.getTime()
                    })

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

            {/* Sección de confirmación de reserva */}
            <div
              style={{
                background: selectedDate ? "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)" : "#f8fafc",
                padding: "2rem",
                borderRadius: 16,
                border: selectedDate ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h4
                    style={{
                      fontWeight: 700,
                      color: "#1f2937",
                      marginBottom: "0.5rem",
                      fontSize: "1.1rem",
                    }}
                  >
                    📋 Resumen de tu reserva:
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
                      : "No seleccionada"}
                  </div>
                </div>
                <button
                  style={{
                    background: selectedDate && user ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" : "#94a3b8",
                    color: "#fff",
                    fontWeight: 700,
                    padding: "1rem 2rem",
                    border: "none",
                    borderRadius: 12,
                    cursor: selectedDate && user ? "pointer" : "not-allowed",
                    fontSize: "1.1rem",
                    boxShadow: selectedDate && user ? "0 8px 24px rgba(34,197,94,0.3)" : "none",
                    transition: "all 0.3s ease",
                    minWidth: 200,
                  }}
                  onClick={handleReserve}
                  disabled={!selectedDate || !user}
                >
                  {!user
                    ? "👤 Inicia sesión para reservar"
                    : !selectedDate
                      ? "📅 Selecciona una fecha"
                      : "✅ Confirmar Reserva"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Pestaña de reservas del usuario */}
        {user && activeTab === "myReservations" && (
          <div>
            <h3
              style={{
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "#1f2937",
                marginBottom: "1.5rem",
              }}
            >
              📋 Mis Reservas
            </h3>

            {userReservations.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  background: "#f8fafc",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📅</div>
                <h4 style={{ color: "#64748b", marginBottom: "0.5rem" }}>No tienes reservas aún</h4>
                <p style={{ color: "#94a3b8" }}>Ve a la pestaña "Hacer Reserva" para crear tu primera reserva</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {userReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    style={{
                      background: "#fff",
                      padding: "1.5rem",
                      borderRadius: 16,
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            color: "#1f2937",
                            marginBottom: "0.5rem",
                            fontSize: "1.1rem",
                          }}
                        >
                          {servicesOptions.find((s) => s.value === reservation.service_name)?.label ||
                            reservation.service_name}
                        </h4>
                        <div style={{ color: "#64748b", fontSize: "0.95rem" }}>
                          <div style={{ marginBottom: "0.25rem" }}>
                            📅 <strong>Fecha:</strong>{" "}
                            {new Date(reservation.assigned_date).toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div style={{ marginBottom: "0.25rem" }}>
                            ⏰ <strong>Estado:</strong>{" "}
                            <span
                              style={{
                                color: reservation.status === "confirmed" ? "#22c55e" : "#f59e0b",
                                fontWeight: 600,
                              }}
                            >
                              {reservation.status === "confirmed" ? "Confirmada" : "Pendiente"}
                            </span>
                          </div>
                          <div>
                            🆔 <strong>ID:</strong> #{reservation.id}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          background: new Date(reservation.assigned_date) < new Date() ? "#fef2f2" : "#f0f9ff",
                          color: new Date(reservation.assigned_date) < new Date() ? "#dc2626" : "#2563eb",
                          padding: "0.5rem 1rem",
                          borderRadius: 8,
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        {new Date(reservation.assigned_date) < new Date() ? "✅ Completada" : "⏳ Próxima"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Panel de administrador */}
        {user && user.role === "admin" && activeTab === "admin" && (
          <div>
            <h3
              style={{
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "#1f2937",
                marginBottom: "1.5rem",
              }}
            >
              Panel de Administración
            </h3>

            {/* Estadísticas rápidas */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
                  padding: "1.5rem",
                  borderRadius: 16,
                  border: "1px solid #3b82f6",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1f2937" }}>{allReservations.length}</div>
                <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Total Reservas
                  <br />
                  {service}
                </div>
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                  padding: "1.5rem",
                  borderRadius: 16,
                  border: "1px solid #22c55e",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1f2937" }}>
                  {allReservations.filter((r) => r.status === "confirmed").length}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.9rem" }}>Confirmadas</div>
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                  padding: "1.5rem",
                  borderRadius: 16,
                  border: "1px solid #f59e0b",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1f2937" }}>
                  {allReservations.filter((r) => new Date(r.assigned_date) >= new Date()).length}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.9rem" }}>Próximas</div>
              </div>
            </div>

            {/* Lista detallada de reservas para admin */}
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #e5e7eb",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid #e5e7eb",
                  fontWeight: 700,
                  color: "#1f2937",
                }}
              >
                Todas las Reservas - {service}
              </div>

              {allReservations.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem",
                    color: "#64748b",
                  }}
                >
                  No hay reservas para este servicio
                </div>
              ) : (
                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                  {allReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      style={{
                        padding: "1.5rem",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 300 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <h4
                            style={{
                              color: "#1f2937",
                              margin: 0,
                              fontSize: "1.1rem",
                            }}
                          >
                            {reservation.users?.name || "Usuario"}
                          </h4>
                          <span
                            style={{
                              background: reservation.status === "confirmed" ? "#dcfce7" : "#fef3c7",
                              color: reservation.status === "confirmed" ? "#166534" : "#92400e",
                              padding: "0.25rem 0.75rem",
                              borderRadius: 20,
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            {reservation.status === "confirmed" ? "Confirmada" : "Pendiente"}
                          </span>
                        </div>
                        <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                          <div>
                            {new Date(reservation.assigned_date).toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div>@{reservation.users?.username}</div>
                          {reservation.users?.phone && <div>{reservation.users.phone}</div>}
                          {reservation.users?.email && <div>{reservation.users.email}</div>}
                          <div>ID: #{reservation.id}</div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          onClick={() => openEditModal(reservation)}
                          style={{
                            background: "#eff6ff",
                            color: "#2563eb",
                            border: "1px solid #bfdbfe",
                            borderRadius: 8,
                            padding: "0.5rem 1rem",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            setReservationToDelete(reservation)
                            setShowDeleteModal(true)
                          }}
                          style={{
                            background: "#fef2f2",
                            color: "#dc2626",
                            border: "1px solid #fecaca",
                            borderRadius: 8,
                            padding: "0.5rem 1rem",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mostrar todas las reservas para usuarios no logueados */}
        {!user && (
          <div style={{ marginTop: "2rem" }}>
            <h3
              style={{
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#1f2937",
                marginBottom: "1rem",
              }}
            >
              📊 Reservas actuales para: {selectedService?.label}
            </h3>

            {allReservations.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  background: "#f8fafc",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                  color: "#64748b",
                }}
              >
                🎉 ¡No hay reservas! Todas las fechas están disponibles.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "0.75rem",
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "1rem",
                  background: "#f8fafc",
                  borderRadius: 16,
                  border: "1px solid #e2e8f0",
                }}
              >
                {allReservations.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: "#fff",
                      padding: "1rem",
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>📅</span>
                    <div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "#1f2937",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {new Date(r.assigned_date).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                        Reservado por: {r.users?.name || "Usuario"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de autenticación mejorado */}
      {showAuthModal && (
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
          onClick={() => setShowAuthModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "2.5rem",
              borderRadius: 24,
              minWidth: 400,
              maxWidth: 500,
              boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
              position: "relative",
              border: "1px solid #e5e7eb",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {authMode === "login" ? (
              <>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "#1f2937",
                      marginBottom: "0.5rem",
                    }}
                  >
                    👤 Iniciar Sesión
                  </h3>
                  <p style={{ color: "#64748b" }}>Accede a tu cuenta para gestionar tus reservas</p>
                </div>

                {loginError && (
                  <div
                    style={{
                      background: "#fef2f2",
                      color: "#dc2626",
                      padding: "1rem",
                      borderRadius: 12,
                      marginBottom: "1rem",
                      border: "1px solid #fecaca",
                    }}
                  >
                    ❌ {loginError}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Usuario
                    </label>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: 12,
                        border: "2px solid #e5e7eb",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                      }}
                      required
                      placeholder="Ingresa tu usuario"
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
                      Contraseña
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: 12,
                        border: "2px solid #e5e7eb",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                      }}
                      required
                      placeholder="Ingresa tu contraseña"
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                      color: "#fff",
                      fontWeight: 700,
                      border: "none",
                      borderRadius: 12,
                      fontSize: "1.1rem",
                      padding: "1rem",
                      width: "100%",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 8px 24px rgba(34,197,94,0.3)",
                    }}
                  >
                    🚀 Iniciar Sesión
                  </button>
                </form>

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "1.5rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <span style={{ color: "#64748b" }}>¿No tienes cuenta? </span>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3b82f6",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      setAuthMode("register")
                      clearAuthFields()
                    }}
                  >
                    Crear una cuenta
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "#1f2937",
                      marginBottom: "0.5rem",
                    }}
                  >
                    ✨ Crear Cuenta
                  </h3>
                  <p style={{ color: "#64748b" }}>Únete para gestionar tus reservas fácilmente</p>
                </div>

                {regError && (
                  <div
                    style={{
                      background: "#fef2f2",
                      color: "#dc2626",
                      padding: "1rem",
                      borderRadius: 12,
                      marginBottom: "1rem",
                      border: "1px solid #fecaca",
                    }}
                  >
                    ❌ {regError}
                  </div>
                )}

                {regSuccess && (
                  <div
                    style={{
                      background: "#f0fdf4",
                      color: "#166534",
                      padding: "1rem",
                      borderRadius: 12,
                      marginBottom: "1rem",
                      border: "1px solid #bbf7d0",
                    }}
                  >
                    ✅ {regSuccess}
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#374151",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Usuario *
                      </label>
                      <input
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          borderRadius: 12,
                          border: "2px solid #e5e7eb",
                          fontSize: "1rem",
                        }}
                        required
                        placeholder="usuario123"
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#374151",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Contraseña *
                      </label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          borderRadius: 12,
                          border: "2px solid #e5e7eb",
                          fontSize: "1rem",
                        }}
                        required
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label
                      style={{
                        fontWeight: 600,
                        color: "#374151",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Nombre completo *
                    </label>
                    <input
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: 12,
                        border: "2px solid #e5e7eb",
                        fontSize: "1rem",
                      }}
                      required
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#374151",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Teléfono
                      </label>
                      <input
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          borderRadius: 12,
                          border: "2px solid #e5e7eb",
                          fontSize: "1rem",
                        }}
                        placeholder="+1234567890"
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontWeight: 600,
                          color: "#374151",
                          display: "block",
                          marginBottom: "0.5rem",
                        }}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          borderRadius: 12,
                          border: "2px solid #e5e7eb",
                          fontSize: "1rem",
                        }}
                        placeholder="juan@email.com"
                      />
                    </div>
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
                      Dirección
                    </label>
                    <input
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: 12,
                        border: "2px solid #e5e7eb",
                        fontSize: "1rem",
                      }}
                      placeholder="Calle 123, Ciudad"
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      color: "#fff",
                      fontWeight: 700,
                      border: "none",
                      borderRadius: 12,
                      fontSize: "1.1rem",
                      padding: "1rem",
                      width: "100%",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
                    }}
                  >
                    🎉 Crear Cuenta
                  </button>
                </form>

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "1.5rem",
                    paddingTop: "1.5rem",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <span style={{ color: "#64748b" }}>¿Ya tienes cuenta? </span>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "#3b82f6",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      setAuthMode("login")
                      clearAuthFields()
                    }}
                  >
                    Iniciar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showEditModal && reservationToEdit && (
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
          onClick={() => setShowEditModal(false)}
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
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                Editar Reserva
              </h3>
              <p style={{ color: "#64748b", lineHeight: 1.5 }}>
                Editando reserva de <strong>{reservationToEdit.users?.name}</strong>
              </p>
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
                Fecha
              </label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: 12,
                  border: "2px solid #e5e7eb",
                  fontSize: "1rem",
                }}
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
                Servicio
              </label>
              <select
                value={editService}
                onChange={(e) => setEditService(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: 12,
                  border: "2px solid #e5e7eb",
                  fontSize: "1rem",
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
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setShowEditModal(false)}
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
                Cancelar
              </button>
              <button
                onClick={handleEditReservation}
                style={{
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "0.75rem 1.5rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
                }}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar reserva */}
      {showDeleteModal && reservationToDelete && (
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
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: 20,
              maxWidth: 400,
              boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
              border: "1px solid #e5e7eb",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                Confirmar Eliminación
              </h3>
              <p style={{ color: "#64748b", lineHeight: 1.5 }}>
                ¿Estás seguro de que quieres eliminar la reserva de <strong>{reservationToDelete.users?.name}</strong>{" "}
                para el <strong>{new Date(reservationToDelete.assigned_date).toLocaleDateString("es-ES")}</strong>?
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
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
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteReservation(reservationToDelete.id)}
                style={{
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  padding: "0.75rem 1.5rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
