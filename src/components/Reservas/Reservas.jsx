"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { supabase, supabaseKey } from "../../supabaseClient"
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import {
  Calendar as CalendarIcon,
  LogIn,
  LogOut,
  User,
  Settings,
  ShieldCheck,
  LayoutDashboard,
  Gift,
  Clock,
  CheckCircle,
  AlertTriangle,
  ClipboardList
} from 'lucide-react'
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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regName, setRegName] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regAddress, setRegAddress] = useState("")
  const [regError, setRegError] = useState("")
  const [regSuccess, setRegSuccess] = useState("")
  const [regLoading, setRegLoading] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

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
  const [reservationHours, setReservationHours] = useState(4)
  const [isAdminCreating, setIsAdminCreating] = useState(false)
  const [adminSelectedClient, setAdminSelectedClient] = useState(null)
  const [showClientSelectionModal, setShowClientSelectionModal] = useState(false)
  const [allUsers, setAllUsers] = useState([])

  // Estado para modal de confirmación
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [confirmationData, setConfirmationData] = useState(null)

  // Estado para modal de registro exitoso
  const [showRegistrationSuccessModal, setShowRegistrationSuccessModal] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

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


  // State change logger for debugging
  useEffect(() => {
    console.log("DEBUG - User State:", user ? user.email : "null", "| Loading:", initialLoading);
  }, [user, initialLoading]);

  // Consolidated session management
  useEffect(() => {
    let mounted = true;
    let authEventProcessed = false;

    const fetchProfile = async (userId) => {
      if (!mounted || !userId) return;
      console.log("RESERVAS - Fetching profile for:", userId);
      try {
        const { data: userData, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (mounted) {
          if (!error && userData) {
            console.log("RESERVAS - Profile loaded:", userData.role);
            setUser(userData);
            if (activeTab === "calendar") {
              setActiveTab(userData.role === "admin" ? "admin" : "calendar");
            }
          } else {
            console.error("RESERVAS - Profile error:", error);
          }
          setInitialLoading(false);
        }
      } catch (err) {
        console.error("RESERVAS - Profile exception:", err);
        if (mounted) setInitialLoading(false);
      }
    };

    // 1. Initial check: getSession covers the initial load from localStorage
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted || authEventProcessed) return;
      console.log("RESERVAS - Initial getSession:", !!session);

      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        // Fallback: getUser is more thorough but slower
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (mounted && !authEventProcessed) {
            if (user) {
              console.log("RESERVAS - User found via getUser backup");
              fetchProfile(user.id);
            } else {
              console.log("RESERVAS - No session found");
              setInitialLoading(false);
            }
          }
        });
      }
    });


    // 2. Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("RESERVAS - Auth State Change:", event, !!session);
      if (!mounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        authEventProcessed = true;
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          console.log("RESERVAS - Event fired with no user:", event);
          setInitialLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        authEventProcessed = true;
        setUser(null);
        setUserReservations([]);
        setActiveTab("calendar");
        setInitialLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe()
    }
  }, [])

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

  // Handle URL query parameters for auth modal
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const mode = searchParams.get("authMode")
    if (mode) {
      if (mode === "login" || mode === "forgotPassword" || mode === "register") {
        setAuthMode(mode)
        setShowAuthModal(true)
        // Clean up URL
        searchParams.delete("authMode")
        setSearchParams(searchParams)
      }
    }
  }, [searchParams, setSearchParams])

  // Auto-clear alert after 5 seconds

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
      .select("*, users(name, phone, email)")
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
      console.log('locationDates', data);

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
    setReservationHours(4)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setLoginError("Debes confirmar tu correo electrónico antes de iniciar sesión.")
        } else if (error.message.includes("Invalid login credentials")) {
          setLoginError("Correo electrónico o contraseña incorrectos.")
        } else {
          setLoginError("Error de conexión. Intenta nuevamente.")
        }
        console.error("Login error:", error)
        return
      }

      if (data.user) {
        // Fetch user data from users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (userError) {
          setLoginError("Error al obtener datos del usuario.")
          return
        }

        setUser(userData)
        clearAuthFields()
        setShowAuthModal(false)
        // Set default tab based on user role
        setActiveTab(userData.role === "admin" ? "admin" : "calendar")

        // Notify admin about pending services
        if (userData.role === "admin") {
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
        setLoginError("Correo electrónico o contraseña incorrectos")
      }
    } catch (error) {
      setLoginError("Error inesperado. Inténtalo de nuevo.")
      console.error("Login error:", error)
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setRegError("")
    setRegSuccess("")
    setRegLoading(true)

    if (!regPassword || !regName || !regEmail) {
      setRegError("Por favor completa todos los campos obligatorios")
      setRegLoading(false)
      return
    }

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
      })

      if (authError) {
        setRegError("Error al crear la cuenta: " + authError.message)
        setRegLoading(false)
        return
      }

      if (authData.user) {
        // Insert user data into users table
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              id: authData.user.id,
              name: regName,
              password: regPassword,
              phone: regPhone,
              email: regEmail,
              address: regAddress,
              role: "user", // Rol por defecto
            },
          ])
          .select()
          .single()

        if (insertError) {
          // If insert fails, try to delete the auth user to clean up
          await supabase.auth.admin.deleteUser(authData.user.id)
          setRegError("Error al crear la cuenta: " + insertError.message)
          setRegLoading(false)
          return
        }

        // Clear form and show success modal
        clearAuthFields()
        setShowAuthModal(false)
        setRegisteredEmail(regEmail)
        setShowRegistrationSuccessModal(true)
      }
    } catch (error) {
      setRegError("Error inesperado. Inténtalo de nuevo.")
      console.error("Registration error:", error)
    } finally {
      setRegLoading(false)
    }
  }

  function clearAuthFields() {
    setEmail("")
    setPassword("")
    setRegPassword("")
    setRegName("")
    setRegPhone("")
    setRegEmail("")
    setRegAddress("")
    setLoginError("")
    setRegError("")
    setRegSuccess("")
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    setSelectedDate(null)
    setUserReservations([])
    setActiveTab("calendar")
  }

  function handleConfirmReserve(applicableDiscount = 0) {
    // Calculate total cost
    const totalCost = service === "Limpieza de casas" ? Math.round(reservationHours * 20 * (1 - applicableDiscount / 100)) : null

    // Set confirmation data
    setConfirmationData({
      totalCost,
      service,
      selectedDate,
      reservationHours,
      applicableDiscount,
      isAdminCreating,
      adminSelectedClient,
    })

    // Show confirmation modal
    setShowConfirmationModal(true)
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

    if (service === "Limpieza de casas" && (!reservationShift || !reservationHours)) {
      setAlertMessage("Por favor selecciona una jornada y las horas de servicio")
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
        ...(service === "Limpieza de casas" && { shift: reservationShift, hours: reservationHours }),
      },
    ])

    if (error) {
      setAlertMessage("Error al crear la reserva: " + error.message)
      setAlertType("error")
    } else {
      const totalCost = service === "Limpieza de casas" ? Math.round(reservationHours * 20 * (1 - (confirmationData?.applicableDiscount || 0) / 100)) : null
      setAlertMessage(`¡Reserva creada exitosamente${isAdminCreating ? ` para ${adminSelectedClient.name}` : ''}!${totalCost ? ` Valor a cancelar: ${totalCost}€. El administrador se comunicará para confirmar el servicio y proceder con el pago.` : ''}`)
      setAlertType("success")

      // Send email notification
      const reservationUser = isAdminCreating ? adminSelectedClient : user
      const locationName = locationOptions.find(loc => loc.id == reservationLocation)?.location || "No especificada"

      const emailHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6; padding: 30px; margin: 0;">
  <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden;">
    
    <!-- Encabezado -->
    <div style="background: linear-gradient(135deg, #22c55e, #16a34a); padding: 30px 20px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">Nueva Reserva de Servicio</h1>
    </div>

    <!-- Contenido principal -->
    <div style="padding: 30px;">
      
      <!-- Detalles del cliente -->
      <div style="background-color: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
        <h2 style="color: #111827; font-size: 18px; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;"> Detalles del Cliente</h2>
        <p style="margin: 6px 0;"><strong>Nombre:</strong> ${reservationUser.name}</p>
        <p style="margin: 6px 0;"><strong>Email:</strong> ${reservationUser.email}</p>
        <p style="margin: 6px 0;"><strong>Teléfono:</strong> ${reservationPhone}</p>
        <p style="margin: 6px 0;"><strong>Dirección:</strong> ${reservationAddress}</p>
      </div>

      <!-- Detalles del servicio -->
      <div style="background-color: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 25px;">
        <h2 style="color: #111827; font-size: 18px; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;"> Detalles del Servicio</h2>
        <p style="margin: 6px 0;"><strong>Servicio:</strong> ${service}</p>
        <p style="margin: 6px 0;"><strong>Fecha:</strong> ${selectedDate.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })}</p>
        <p style="margin: 6px 0;"><strong>Ubicación:</strong> ${locationName}</p>

        ${service === "Limpieza de casas" ? `
          <p style="margin: 6px 0;"><strong>Jornada:</strong> ${reservationShift}</p>
          <p style="margin: 6px 0;"><strong>Horas:</strong> ${reservationHours}</p>
          <p style="margin: 6px 0;"><strong>Costo Total:</strong> ${totalCost}€</p>
          ${confirmationData?.applicableDiscount > 0 ? `<p style="margin: 6px 0; color: #16a34a;"><strong>Descuento Aplicado:</strong> ${confirmationData.applicableDiscount}%</p>` : ''}
        ` : ''}
      </div>

      <!-- Estado -->
      <div style="background-color: #ecfdf5; border-left: 4px solid #22c55e; border-radius: 8px; padding: 20px;">
        <h3 style="color: #065f46; font-size: 16px; margin-top: 0;">Estado de la Reserva</h3>
        <p style="margin: 6px 0;"><strong>Estado:</strong> ${user.role === "admin" ? "✅ Confirmada" : "🕓 Pendiente de Confirmación"}</p>
        ${user.role !== "admin" ? `
          <p style="margin: 6px 0; color: #64748b; font-size: 14px;">
            El administrador revisará y confirmará la reserva pronto.
          </p>
        ` : ''}
      </div>
    </div>

    <!-- Pie -->
    <div style="background-color: #f9fafb; text-align: center; padding: 20px; border-top: 1px solid #e5e7eb;">
      <p style="color: #9ca3af; font-size: 13px; margin: 0;">
        Este es un mensaje automático del sistema de reservas de <strong>StarLimpiezas</strong>.<br>
        Por favor, no respondas a este correo.
      </p>
    </div>
  </div>
</div>

      `

      try {
        const response = await fetch("https://gvivprtrbphfvedbiice.supabase.co/functions/v1/SendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            to: [reservationUser.email],
            subject: "Nueva Reserva de Servicio - StarLimpiezas",
            html: emailHtml,
            from: "StarLimpiezas <customer@starlimpiezas.com>"
          })
        });

        console.log("🔹 Fetch ejecutado. Estado:", response.status);

        // Verifica si el servidor respondió correctamente
        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Error en la respuesta del servidor:", errorText);
        } else {
          const data = await response.json().catch(() => ({})); // por si no hay JSON
          console.log("✅ Email enviado correctamente. Respuesta del servidor:", data);
        }

      } catch (emailError) {
        console.error("🚨 Error enviando el correo (fetch falló):", emailError);
      }


      // Close both modals immediately
      setShowReservationModal(false)
      setShowConfirmationModal(false)

      // Update calendar view
      fetchAllReservations()
      if (!isAdminCreating) {
        fetchUserReservations()
      }

      // Reset form state
      setSelectedDate(null)
      setReservationLocation("")
      setReservationAddress("")
      setReservationPhone("")
      setReservationShift("")
      setReservationHours(4)
      setIsAdminCreating(false)
      setAdminSelectedClient(null)
      setConfirmationData(null)
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
    setReservationHours(4)
  }

  async function handleStatusChange(reservationId, newStatus) {
    // First, get the reservation details to know user_id and service_name
    const { data: reservation, error: fetchError } = await supabase
      .from("user_services")
      .select("user_id, service_name, status")
      .eq("id", reservationId)
      .single()

    if (fetchError) {
      setAlertMessage("Error al obtener detalles de la reserva: " + fetchError.message)
      setAlertType("error")
      return
    }

    const { error } = await supabase
      .from("user_services")
      .update({ status: newStatus })
      .eq("id", reservationId)

    if (error) {
      setAlertMessage("Error al actualizar el estado: " + error.message)
      setAlertType("error")
    } else {
      // If marking as completed and it wasn't completed before, add loyalty points
      if (newStatus === 'completed' && reservation.status !== 'completed') {
        const { error: loyaltyError } = await supabase.rpc('add_loyalty_points', {
          p_user_id: reservation.user_id,
          p_service_type: reservation.service_name
        })

        if (loyaltyError) {
          console.error('Error adding loyalty points:', loyaltyError)
          // Don't show error to user, just log it
        }
      }

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

      {/* Loading screen while checking session */}
      {initialLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #22c55e",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginBottom: "1rem",
            }}
          />
          <p style={{ color: "#64748b", fontSize: "1.1rem" }}>Cargando...</p>
        </div>
      )}

      {/* Botón flotante de autenticación (Login) */}
      {!user && !initialLoading && (
        <button
          style={{
            position: "fixed",
            zIndex: 9999,
            right: 32,
            top: 32,
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            color: "#fff",
            fontWeight: 800,
            border: "none",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(34,197,94,0.3), 0 4px 10px rgba(0,0,0,0.1)",
            padding: "0.85rem 1.75rem",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => {
            setShowAuthModal(true)
            setAuthMode("login")
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"
            e.currentTarget.style.boxShadow = "0 15px 35px rgba(34,197,94,0.4), 0 8px 15px rgba(0,0,0,0.1)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)"
            e.currentTarget.style.boxShadow = "0 10px 25px rgba(34,197,94,0.3), 0 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          <LogIn size={20} />
          <span>Acceder</span>
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
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        loginError={loginError}
        loginLoading={loginLoading}
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
        regLoading={regLoading}
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
        reservationHours={reservationHours}
        setReservationHours={setReservationHours}
        handleReserve={handleReserve}
        locationOptions={locationOptions}
        user={user}
        onConfirmReserve={handleConfirmReserve}
      />

      {/* Confirmation Modal */}
      {showConfirmationModal && confirmationData && (
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
            zIndex: 12000,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowConfirmationModal(false)}
        >
          <div
            className="confirmation-modal"
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
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                Confirmar Reserva
              </h3>
              <p style={{ color: "#64748b" }}>¿Estás seguro de que deseas confirmar esta reserva?</p>
            </div>

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
                📋 Detalles de la Reserva:
              </h4>
              <div style={{ color: "#64748b" }}>
                <strong>Servicio:</strong> {confirmationData.service}
                <br />
                <strong>Fecha:</strong>{" "}
                {confirmationData.selectedDate
                  ? confirmationData.selectedDate.toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                  : ""}
                {confirmationData.service === "Limpieza de casas" && (
                  <>
                    <br />
                    <strong>Horas:</strong> {confirmationData.reservationHours}
                    <br />
                    <strong>Valor del Servicio:</strong> {confirmationData.totalCost}€
                  </>
                )}
              </div>
            </div>

            {confirmationData.totalCost && (
              <div
                style={{
                  background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                  padding: "1.5rem",
                  borderRadius: 16,
                  marginBottom: "2rem",
                  border: "2px solid #f59e0b",
                  textAlign: "center",
                }}
              >
                <h4 style={{ color: "#92400e", marginBottom: "0.5rem", fontSize: "1.2rem" }}>
                  💰 Valor a Cancelar
                </h4>
                <div style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#92400e" }}>
                  {confirmationData.totalCost}€
                </div>
                {confirmationData.applicableDiscount > 0 && (
                  <div style={{ fontSize: "0.9rem", color: "#92400e", marginTop: "0.5rem" }}>
                    (Incluye {confirmationData.applicableDiscount}% de descuento aplicado)
                  </div>
                )}
                <div style={{ fontSize: "0.9rem", color: "#92400e", marginTop: "1rem" }}>
                  El administrador del sistema se comunicará para confirmar el servicio y proceder con el proceso de pago.
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button
                type="button"
                onClick={() => setShowConfirmationModal(false)}
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
                ✅ Confirmar y Reservar
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Registration Success Modal */}
      {showRegistrationSuccessModal && (
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
            zIndex: 13000,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowRegistrationSuccessModal(false)}
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
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: "2rem" }}>
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                }}
              >
                ✅
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "#1f2937",
                  marginBottom: "0.5rem",
                }}
              >
                ¡Cuenta Creada Exitosamente!
              </h3>
              <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>
                Se ha enviado un correo de validación a:
              </p>
              <div
                style={{
                  background: "#f8fafc",
                  padding: "1rem",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontWeight: 600,
                  color: "#1f2937",
                  marginBottom: "2rem",
                }}
              >
                {registeredEmail}
              </div>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "2rem" }}>
                Revisa tu bandeja de entrada y haz clic en el enlace de validación para poder iniciar sesión.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowRegistrationSuccessModal(false)}
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
                width: "100%",
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  )
}
