"use client"

import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { servicesOptions, calendarStyles, responsiveModalStyles } from './constants'
import Header from './Header'
import Alert from './Alert'
import UserInfo from './UserInfo'
import TabNavigation from './TabNavigation'
import CalendarView from './CalendarView'
import MyReservationsView from './MyReservationsView'
import AdminView from './AdminView'
import CRMView from './CRMView'
import UserLoyaltyView from './UserLoyaltyView'
import AuthModal from './AuthModal'
import ReservationModal from './ReservationModal'
import EditModal from './EditModal'
import DeleteModal from './DeleteModal'
import ReservationDetailModal from './ReservationDetailModal'
import ClientSelectionModal from './ClientSelectionModal'

// Configurar moment en español
moment.locale("es")
const localizer = momentLocalizer(moment)

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
  const [isAdminCreating, setIsAdminCreating] = useState(false)
  const [adminSelectedClient, setAdminSelectedClient] = useState(null)
  const [showClientSelectionModal, setShowClientSelectionModal] = useState(false)
  const [allUsers, setAllUsers] = useState([])

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

  async function fetchAllUsers() {
    const { data, error } = await supabase.from("users").select("*").order("name")
    if (!error && data) {
      setAllUsers(data)
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
    if (service === "Limpieza de casas" && user && user.role !== "admin") {
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

    // Admin reservation creation flow
    if (user.role === "admin") {
      setSelectedDate(start)
      setIsAdminCreating(true)
      fetchAllUsers()
      setShowClientSelectionModal(true)
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
      // Set default tab based on user role
      setActiveTab(data[0].role === "admin" ? "admin" : "calendar")

      // Notify admin about pending services
      if (data[0].role === "admin") {
        // Check for pending reservations after a short delay to allow data to load
        setTimeout(() => {
          const pendingCount = allReservations.filter(r => r.status === 'pending').length
          if (pendingCount > 0) {
            setAlertMessage(`Tienes ${pendingCount} servicio(s) pendiente(s) de confirmación`)
            setAlertType("success")
          }
        }, 1000)
      }
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
    // Set default tab based on user role
    setActiveTab(newUser.role === "admin" ? "admin" : "calendar")
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

    // Check if admin is creating but hasn't selected a client
    if (isAdminCreating && !adminSelectedClient) {
      setAlertMessage("Por favor selecciona un cliente para la reserva")
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
    const reservationUser = isAdminCreating ? adminSelectedClient : user

    const { error } = await supabase.from("user_services").insert([
      {
        user_id: reservationUser.id,
        service_name: service,
        assigned_date: dateStr,
        status: user.role === "admin" ? "confirmed" : "pending",
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
      setAlertMessage(`¡Reserva creada exitosamente${isAdminCreating ? ` para ${adminSelectedClient.name}` : ''}!`)
      setAlertType("success")
      fetchAllReservations()
      if (!isAdminCreating) {
        fetchUserReservations()
      }
      setSelectedDate(null)
      setShowReservationModal(false)
      setReservationLocation("")
      setReservationAddress("")
      setReservationPhone("")
      setReservationShift("")
      setIsAdminCreating(false)
      setAdminSelectedClient(null)
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

  function handleClientSelect(client) {
    setAdminSelectedClient(client)
    setShowReservationModal(true)
    setReservationLocation("")
    setReservationAddress(client.address || "")
    setReservationPhone(client.phone || "")
    setReservationShift("")
  }

  async function handleStatusChange(reservationId, newStatus) {
    const { error } = await supabase
      .from("user_services")
      .update({ status: newStatus })
      .eq("id", reservationId)

    if (error) {
      setAlertMessage("Error al actualizar el estado: " + error.message)
      setAlertType("error")
    } else {
      setAlertMessage(`Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'completada'} exitosamente`)
      setAlertType("success")
      fetchAllReservations()
      fetchUserReservations()
    }
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
        <Header />

        <Alert alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />

        <UserInfo user={user} handleLogout={handleLogout} />

        <TabNavigation user={user} activeTab={activeTab} setActiveTab={setActiveTab} userReservations={userReservations} />

        {/* Contenido principal basado en la pestaña activa */}
        {(!user || activeTab === "calendar") && (
          <CalendarView
            user={user}
            service={service}
            setService={setService}
            selectedService={selectedService}
            events={events}
            loading={loading}
            handleSelectSlot={handleSelectSlot}
            calDate={calDate}
            setCalDate={setCalDate}
            calView={calView}
            setCalView={setCalView}
            locationOptions={locationOptions}
            openReservationDetail={openReservationDetail}
          />
        )}

        {user && activeTab === "myReservations" && (
          <MyReservationsView
            userReservations={userReservations}
            setActiveTab={setActiveTab}
            openReservationDetail={openReservationDetail}
            locationOptions={locationOptions}
          />
        )}

        {user && activeTab === "loyalty" && (
          <UserLoyaltyView user={user} />
        )}

        {user && user.role === "admin" && activeTab === "admin" && (
          <AdminView
            allReservations={allReservations}
            service={service}
            openEditModal={openEditModal}
            setReservationToDelete={setReservationToDelete}
            setShowDeleteModal={setShowDeleteModal}
            locationOptions={locationOptions}
            handleStatusChange={handleStatusChange}
            users={allUsers}
          />
        )}

        {user && user.role === "admin" && activeTab === "crm" && (
          <CRMView
            allReservations={allReservations}
            allUsers={allUsers}
            handleStatusChange={handleStatusChange}
            fetchAllUsers={fetchAllUsers}
          />
        )}

      </div>

      <AuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        loginError={loginError}
        regUsername={regUsername}
        setRegUsername={setRegUsername}
        regPassword={regPassword}
        setRegPassword={setRegPassword}
        regName={regName}
        setRegName={setRegName}
        regPhone={regPhone}
        setRegPhone={setRegPhone}
        regEmail={regEmail}
        setRegEmail={setRegEmail}
        regAddress={regAddress}
        setRegAddress={setRegAddress}
        handleRegister={handleRegister}
        regError={regError}
        regSuccess={regSuccess}
        clearAuthFields={clearAuthFields}
      />

      <EditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        reservationToEdit={reservationToEdit}
        editDate={editDate}
        setEditDate={setEditDate}
        editService={editService}
        setEditService={setEditService}
        handleEditReservation={handleEditReservation}
      />

      <DeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        reservationToDelete={reservationToDelete}
        handleDeleteReservation={handleDeleteReservation}
      />

      <ReservationModal
        showReservationModal={showReservationModal}
        setShowReservationModal={setShowReservationModal}
        selectedDate={selectedDate}
        service={service}
        reservationLocation={reservationLocation}
        setReservationLocation={setReservationLocation}
        reservationAddress={reservationAddress}
        setReservationAddress={setReservationAddress}
        reservationPhone={reservationPhone}
        setReservationPhone={setReservationPhone}
        reservationShift={reservationShift}
        setReservationShift={setReservationShift}
        handleReserve={handleReserve}
        locationOptions={locationOptions}
        user={user}
      />

      <ReservationDetailModal
        showReservationDetailModal={showReservationDetailModal}
        setShowReservationDetailModal={setShowReservationDetailModal}
        reservationDetail={reservationDetail}
        locationOptions={locationOptions}
      />

      <ClientSelectionModal
        showClientSelectionModal={showClientSelectionModal}
        setShowClientSelectionModal={setShowClientSelectionModal}
        users={allUsers}
        onClientSelect={handleClientSelect}
      />
    </>
  )
}
