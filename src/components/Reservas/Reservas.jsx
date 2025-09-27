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

const responsiveModalStyles = `
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

  const [showReservationDetailModal, setShowReservationDetailModal] = useState(false)
  const [reservationDetail, setReservationDetail] = useState(null)

  // Estados para alertas en pantalla
  const [alertMessage, setAlertMessage] = useState("")
  const [alertType, setAlertType] = useState("") // "success" or "error"

  // Estados para modal de reserva
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [reservationLocation, setReservationLocation] = useState("")
  const [reservationAddress, setReservationAddress] = useState("")
  const [reservationPhone, setReservationPhone] = useState("")
  const [reservationShift, setReservationShift] = useState("")

  // Ubicaciones desde la base de datos
  const [locationOptions, setLocationOptions] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    fetchAllReservations()
    fetchLocations()
    if (user) {
      fetchUserReservations()
    }
    setSelectedDate(null)
  }, [service, user])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (showReservationModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showReservationModal]);

  useEffect(() => {
    const mappedEvents = [...reservedEvents]
    if (user) {
      // Agregar reservas del usuario actual con diferente color
      const userEvents = userReservations.map((r) => ({
        title: "Mi Reserva",
        start: new Date(r.assigned_date + 'T12:00:00'),
        end: new Date(r.assigned_date + 'T12:00:00'),
        allDay: true,
        resource: "my-reservation",
        reservationData: r,
      }))
      mappedEvents.push(...userEvents)
    }
    setEvents(mappedEvents)
  }, [reservedEvents, userReservations, user])

  // Auto-clear alert after 5 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage("")
        setAlertType("")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alertMessage])

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
          start: new Date(r.assigned_date + 'T12:00:00'),
          end: new Date(r.assigned_date + 'T12:00:00'),
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

  async function fetchLocations() {
    const { data, error } = await supabase.from("location").select("*")
    if (!error && data) {
      setLocationOptions(data)
    }
  }

  function handleSelectSlot({ start }) {
    const selected = new Date(start.setHours(0, 0, 0, 0))
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selected < today) {
      setAlertMessage("No puedes reservar fechas pasadas")
      setAlertType("error")
      return
    }

    const dateStr = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`

    let isReserved = false
    if (service === "Limpieza de casas") {
      const reservationsOnDate = allReservations.filter(r =>
        r.assigned_date === dateStr &&
        r.service_name === "Limpieza de casas" &&
        (!user || r.user_id !== user.id)
      )
      isReserved = reservationsOnDate.length >= 2
    } else {
      const reservationsOnDate = allReservations.filter(r =>
        r.assigned_date === dateStr &&
        r.service_name === service &&
        (!user || r.user_id !== user.id)
      )
      isReserved = reservationsOnDate.length > 0
    }

    if (isReserved) {
      if (service === "Limpieza de casas") {
        setAlertMessage("Esta fecha ya tiene dos reservas para Limpieza de casas. Por favor elige otra fecha.")
        setAlertType("error")
      } else {
        setAlertMessage("Esta fecha ya está ocupada. Por favor elige otra fecha.")
        setAlertType("error")
      }
      return
    }

    // Check if user already has 2 reservations on this date for Limpieza de casas
    if (service === "Limpieza de casas" && user) {
      const userReservationsOnDate = userReservations.filter(r =>
        r.assigned_date === dateStr && r.service_name === "Limpieza de casas"
      )
      if (userReservationsOnDate.length >= 2) {
        setAlertMessage("Ya hay dos reservas para esta fecha.")
        setAlertType("error")
        return
      }
    }

    if (!user) {
      setShowAuthModal(true)
      return
    }

    setSelectedDate(start)
    setShowReservationModal(true)
    setReservationLocation("")
    setReservationAddress(user.address || "")
    setReservationPhone(user.phone || "")
    setReservationShift("")
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
    setAlertMessage("¡Cuenta creada exitosamente! Has iniciado sesión automáticamente.")
    setAlertType("success")
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
      setAlertMessage("Por favor selecciona una fecha para reservar")
      setAlertType("error")
      return
    }

    if (!user) {
      setAlertMessage("Debes iniciar sesión para hacer una reserva")
      setAlertType("error")
      return
    }

    if (!reservationLocation || !reservationAddress || !reservationPhone) {
      setAlertMessage("Por favor completa todos los campos requeridos")
      setAlertType("error")
      return
    }

    if (service === "Limpieza de casas" && !reservationShift) {
      setAlertMessage("Por favor selecciona una jornada")
      setAlertType("error")
      return
    }

    if (service === "Limpieza de casas") {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
      const { data: existingShift, error: shiftError } = await supabase
        .from("user_services")
        .select("id")
        .eq("assigned_date", dateStr)
        .eq("service_name", "Limpieza de casas")
        .eq("shift", reservationShift)

      if (shiftError) {
        setAlertMessage("Error al verificar disponibilidad: " + shiftError.message)
        setAlertType("error")
        return
      }

      if (existingShift.length > 0) {
        setAlertMessage("Esta jornada ya está reservada para esta fecha. Por favor elige otra jornada o fecha.")
        setAlertType("error")
        return
      }
    }

    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    const { error } = await supabase.from("user_services").insert([
      {
        user_id: user.id,
        service_name: service,
        assigned_date: dateStr,
        status: "confirmed",
        location_id: reservationLocation,
        address: reservationAddress,
        phone: reservationPhone,
        ...(service === "Limpieza de casas" && { shift: reservationShift }),
      },
    ])

    if (error) {
      setAlertMessage("Error al crear la reserva: " + error.message)
      setAlertType("error")
    } else {
      setAlertMessage("¡Reserva creada exitosamente!")
      setAlertType("success")
      fetchAllReservations()
      fetchUserReservations()
      setSelectedDate(null)
      setShowReservationModal(false)
      setReservationLocation("")
      setReservationAddress("")
      setReservationPhone("")
      setReservationShift("")
    }
  }

  async function handleDeleteReservation(reservationId) {
    const { error } = await supabase.from("user_services").delete().eq("id", reservationId)

    if (error) {
      setAlertMessage("Error al eliminar la reserva")
      setAlertType("error")
    } else {
      setAlertMessage("Reserva eliminada exitosamente")
      setAlertType("success")
      fetchAllReservations()
      fetchUserReservations()
      setShowDeleteModal(false)
      setReservationToDelete(null)
    }
  }

  async function handleEditReservation() {
    if (!editDate || !editService) {
      setAlertMessage("Por favor completa todos los campos")
      setAlertType("error")
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
      setAlertMessage("Error al actualizar la reserva: " + error.message)
      setAlertType("error")
    } else {
      setAlertMessage("Reserva actualizada exitosamente")
      setAlertType("success")
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

  function openReservationDetail(reservation) {
    setReservationDetail(reservation)
    setShowReservationDetailModal(true)
  }

  const selectedService = servicesOptions.find((s) => s.value === service)

  return (
    <>
      <style>{calendarStyles + responsiveModalStyles}</style>

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

        {/* Alerta en pantalla */}
        {alertMessage && (
          <div
            style={{
              position: "fixed",
              top: 100,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 13000,
              maxWidth: 500,
              width: "90%",
              padding: "1rem 1.5rem",
              borderRadius: 12,
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              border: alertType === "success" ? "1px solid #22c55e" : "1px solid #ef4444",
              backgroundColor: alertType === "success" ? "#f0fdf4" : "#fef2f2",
              color: alertType === "success" ? "#166534" : "#dc2626",
              fontWeight: 600,
              textAlign: "center",
              animation: "slideDown 0.3s ease-out",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>
                {alertType === "success" ? "✅" : "❌"}
              </span>
              <span>{alertMessage}</span>
              <button
                onClick={() => setAlertMessage("")}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "inherit",
                  opacity: 0.7,
                }}
              >
                ×
              </button>
            </div>
          </div>
        )}

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
                      cursor: "pointer",
                    }}
                    onClick={() => openReservationDetail(reservation)}
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
                            📍 <strong>Ubicación:</strong> {locationOptions.find(l => l.id === reservation.location_id)?.location || "Desconocida"}
                          </div>
                          <div style={{ marginBottom: "0.25rem" }}>
                            🏠 <strong>Dirección:</strong> {reservation.address}
                          </div>
                          <div style={{ marginBottom: "0.25rem" }}>
                            📞 <strong>Teléfono:</strong> {reservation.phone}
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
                          padding: "0.5rem 1rem",
                          borderRadius: 8,
                          fontSize: "0.85rem",
                          fontWeight: 600,
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
                          <div>📍 Ubicación: {locationOptions.find(l => l.id === reservation.location_id)?.location || "Desconocida"}</div>
                          <div>🏠 Dirección: {reservation.address}</div>
                          <div>📞 Teléfono reserva: {reservation.phone}</div>
                          <div>@{reservation.users?.username}</div>
                          {reservation.users?.phone && <div>📞 Teléfono usuario: {reservation.users.phone}</div>}
                          {reservation.users?.email && <div>✉️ {reservation.users.email}</div>}
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
              className="reservation-modal-buttons"
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

      {/* Modal de detalles de reserva */}
      {showReservationModal && (
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
                </div>
              ) : (
                <div style={{ color: "#92400e" }}>
                  <strong>Precio: Por cotización</strong>
                  <br />
                  Se enviará una cotización detallada al confirmar la reserva.
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
      )}

      {/* Modal de detalles de reserva */}
      {showReservationDetailModal && reservationDetail && (
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
                      color: reservationDetail.status === "confirmed" ? "#22c55e" : "#f59e0b",
                      fontWeight: 600,
                    }}
                  >
                    {reservationDetail.status === "confirmed" ? "Confirmada" : "Pendiente"}
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
      )}
    </>
  )
}
