import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { servicesOptions } from './constants'
import {
  Users,
  Search,
  Target,
  TrendingUp,
  Award,
  Gift,
  Settings,
  History,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  User,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  BarChart3,
  Star,
  ChevronRight
} from 'lucide-react'

export default function CRMView({
  allReservations,
  allUsers,
  handleStatusChange,
  fetchAllUsers,
}) {
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientHistory, setClientHistory] = useState([])
  const [loyaltyPoints, setLoyaltyPoints] = useState({})
  const [showLoyaltyModal, setShowLoyaltyModal] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [pointsToAdd, setPointsToAdd] = useState(0)
  const [loading, setLoading] = useState(false)
  const [clientDiscounts, setClientDiscounts] = useState([])
  const [discountConfig, setDiscountConfig] = useState([])
  const [showDiscountConfigModal, setShowDiscountConfigModal] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState(null)
  const [newDiscount, setNewDiscount] = useState({
    service_type: '',
    services_required: '',
    discount_percentage: ''
  })

  // Filter users to only show clients (role: "user")
  const clients = allUsers.filter(user => user.role === "user")


  // Fetch loyalty points from database
  const fetchLoyaltyPoints = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('customer_loyalty')
        .select('service_type, points')
        .eq('user_id', userId)

      if (error) throw error

      const points = {}
      data.forEach(item => {
        points[item.service_type] = item.points
      })
      setLoyaltyPoints(points)
    } catch (error) {
      console.error('Error fetching loyalty points:', error)
      // Fallback to local calculation if database fails
      calculateLocalPoints(userId)
    }
  }

  // Calculate points locally (fallback)
  const calculateLocalPoints = (userId) => {
    const history = allReservations.filter(res => res.user_id === userId && res.status === 'completed')
    const points = {}
    history.forEach(reservation => {
      if (!points[reservation.service_name]) {
        points[reservation.service_name] = 0
      }
      if (reservation.service_name === "Limpieza de casas") {
        points[reservation.service_name] += 10
      } else {
        points[reservation.service_name] += 5
      }
    })
    setLoyaltyPoints(points)
  }

  // Fetch users and discount config when component mounts
  useEffect(() => {
    if (fetchAllUsers) {
      fetchAllUsers()
    }
    fetchDiscountConfig()
  }, [fetchAllUsers])

  useEffect(() => {
    if (selectedClient) {
      // Get client's reservation history
      const history = allReservations.filter(res => res.user_id === selectedClient.id)
        .sort((a, b) => new Date(b.assigned_date) - new Date(a.assigned_date))

      setClientHistory(history)

      // Fetch loyalty points and discounts from database
      fetchLoyaltyPoints(selectedClient.id)
      fetchClientDiscounts(selectedClient.id)
    }
  }, [selectedClient, allReservations])

  const fetchDiscountConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('service_discount_config')
        .select('*')
        .order('service_type', { ascending: true })
        .order('services_required', { ascending: true })

      if (error) throw error
      setDiscountConfig(data || [])
    } catch (error) {
      console.error('Error fetching discount config:', error)
    }
  }

  const fetchClientDiscounts = async (userId) => {
    try {
      const { data, error } = await supabase.rpc('get_customer_discounts', {
        p_user_id: userId
      })

      if (error) throw error
      setClientDiscounts(data || [])
    } catch (error) {
      console.error('Error fetching client discounts:', error)
      setClientDiscounts([])
    }
  }

  const handleAddLoyaltyPoints = async () => {
    if (!selectedService || pointsToAdd <= 0 || !selectedClient) return

    setLoading(true)
    try {
      // Calculate points based on service type
      let calculatedPoints = pointsToAdd
      if (pointsToAdd === 0) {
        // Auto-calculate based on service type
        calculatedPoints = selectedService === "Limpieza de casas" ? 10 : 5
      }

      // Check if loyalty record already exists
      const { data: existingRecord, error: fetchError } = await supabase
        .from('customer_loyalty')
        .select('points')
        .eq('user_id', selectedClient.id)
        .eq('service_type', selectedService)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError
      }

      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('customer_loyalty')
          .update({
            points: existingRecord.points + calculatedPoints,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', selectedClient.id)
          .eq('service_type', selectedService)

        if (updateError) throw updateError
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('customer_loyalty')
          .insert({
            user_id: selectedClient.id,
            service_type: selectedService,
            points: calculatedPoints
          })

        if (insertError) throw insertError
      }

      // Refresh loyalty points
      await fetchLoyaltyPoints(selectedClient.id)

      alert(`Se agregaron ${calculatedPoints} puntos de fidelidad para ${servicesOptions.find(s => s.value === selectedService)?.label}`)
      setShowLoyaltyModal(false)
      setSelectedService('')
      setPointsToAdd(0)
    } catch (error) {
      console.error('Error adding loyalty points:', error)
      alert('Error al agregar puntos de fidelidad. Intente nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  // Function to automatically add loyalty points when service is completed
  const addLoyaltyPointsForCompletedService = async (reservation) => {
    try {
      // Calculate points based on service type
      const calculatedPoints = reservation.service_name === "Limpieza de casas" ? 10 : 5

      // Check if loyalty record already exists
      const { data: existingRecord, error: fetchError } = await supabase
        .from('customer_loyalty')
        .select('points')
        .eq('user_id', reservation.user_id)
        .eq('service_type', reservation.service_name)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw fetchError
      }

      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('customer_loyalty')
          .update({
            points: existingRecord.points + calculatedPoints,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', reservation.user_id)
          .eq('service_type', reservation.service_name)

        if (updateError) throw updateError
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('customer_loyalty')
          .insert({
            user_id: reservation.user_id,
            service_type: reservation.service_name,
            points: calculatedPoints
          })

        if (insertError) throw insertError
      }

      // Refresh loyalty points if this client is currently selected
      if (selectedClient && selectedClient.id === reservation.user_id) {
        await fetchLoyaltyPoints(selectedClient.id)
      }
    } catch (error) {
      console.error('Error adding automatic loyalty points:', error)
    }
  }

  const getTotalLoyaltyPoints = () => {
    return Object.values(loyaltyPoints).reduce((sum, points) => sum + points, 0)
  }

  const getLoyaltyTier = (points) => {
    if (points >= 100) return { name: "VIP Oro", color: "#FFD700", discount: "15%" }
    if (points >= 50) return { name: "VIP Plata", color: "#C0C0C0", discount: "10%" }
    if (points >= 25) return { name: "VIP Bronce", color: "#CD7F32", discount: "5%" }
    return { name: "Cliente Regular", color: "#6B7280", discount: "0%" }
  }

  const handleSaveDiscountConfig = async () => {
    if (!newDiscount.service_type || !newDiscount.services_required || !newDiscount.discount_percentage) {
      alert('Por favor completa todos los campos')
      return
    }

    try {
      if (editingDiscount) {
        // Update existing
        const { error } = await supabase
          .from('service_discount_config')
          .update({
            services_required: parseInt(newDiscount.services_required),
            discount_percentage: parseFloat(newDiscount.discount_percentage),
            updated_at: new Date().toISOString()
          })
          .eq('id', editingDiscount.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('service_discount_config')
          .insert({
            service_type: newDiscount.service_type,
            services_required: parseInt(newDiscount.services_required),
            discount_percentage: parseFloat(newDiscount.discount_percentage)
          })

        if (error) throw error
      }

      // Refresh config and close modal
      await fetchDiscountConfig()
      setShowDiscountConfigModal(false)
      setEditingDiscount(null)
      setNewDiscount({ service_type: '', services_required: '', discount_percentage: '' })

      alert(editingDiscount ? 'Configuración actualizada exitosamente' : 'Nueva configuración creada exitosamente')
    } catch (error) {
      console.error('Error saving discount config:', error)
      alert('Error al guardar la configuración')
    }
  }

  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount)
    setNewDiscount({
      service_type: discount.service_type,
      services_required: discount.services_required.toString(),
      discount_percentage: discount.discount_percentage.toString()
    })
    setShowDiscountConfigModal(true)
  }

  const handleDeleteDiscount = async (discountId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta configuración de descuento?')) return

    try {
      const { error } = await supabase
        .from('service_discount_config')
        .delete()
        .eq('id', discountId)

      if (error) throw error

      await fetchDiscountConfig()
      alert('Configuración eliminada exitosamente')
    } catch (error) {
      console.error('Error deleting discount config:', error)
      alert('Error al eliminar la configuración')
    }
  }

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", paddingBottom: "4rem" }}>
      {/* Premium Dashboard Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
          padding: "3rem 2.5rem",
          borderRadius: 24,
          marginBottom: "2.5rem",
          color: "#1e293b",
          textAlign: "left",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.05)",
          border: "1px solid #ddd6fe"
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ background: "rgba(99, 102, 241, 0.05)", padding: "0.75rem", borderRadius: 12, backdropFilter: "blur(8px)", color: "#6366f1", border: "1px solid rgba(99, 102, 241, 0.1)" }}>
              <Users size={28} />
            </div>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 900,
                margin: 0,
                letterSpacing: "-0.025em",
                color: "#1e1b4b"
              }}
            >
              Gestión de Clientes (CRM)
            </h2>
          </div>
          <p style={{ fontSize: "1.1rem", color: "#475569", maxWidth: 600, lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
            Administra la base de clientes, supervisa la fidelidad y configura estrategias de retención personalizadas.
          </p>
        </div>
        {/* Decorative background element */}
        <div style={{ position: "absolute", right: "-5%", top: "-20%", width: 300, height: 300, background: "rgba(99, 102, 241, 0.03)", borderRadius: "50%", zIndex: 0 }} />
      </div>

      {/* Client Selection Grid */}
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: 24,
          marginBottom: "2.5rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          border: "1px solid #f1f5f9",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ background: "#eff6ff", padding: "0.5rem", borderRadius: 10, color: "#3b82f6" }}>
              <Search size={20} />
            </div>
            <h3 style={{ color: "#1e293b", margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
              Seleccionar Cliente
            </h3>
          </div>
          <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
            {clients.length} Clientes registrados
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {clients.map((client) => (
            <div
              key={client.id}
              style={{
                padding: "1.25rem",
                border: selectedClient?.id === client.id ? "2px solid #6366f1" : "1px solid #f1f5f9",
                borderRadius: 20,
                background: selectedClient?.id === client.id ? "#f5f3ff" : "#fff",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                boxShadow: selectedClient?.id === client.id ? "0 10px 15px -3px rgba(99, 102, 241, 0.1)" : "none"
              }}
              onClick={() => setSelectedClient(client)}
              onMouseEnter={e => {
                if (selectedClient?.id !== client.id) {
                  e.currentTarget.style.borderColor = "#e2e8f0"
                  e.currentTarget.style.transform = "translateY(-2px)"
                }
              }}
              onMouseLeave={e => {
                if (selectedClient?.id !== client.id) {
                  e.currentTarget.style.borderColor = "#f1f5f9"
                  e.currentTarget.style.transform = "translateY(0)"
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: selectedClient?.id === client.id ? "#6366f1" : "#f8fafc",
                  color: selectedClient?.id === client.id ? "#fff" : "#64748b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  fontWeight: 800
                }}>
                  {client.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem" }}>{client.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 500 }}>@{client.username}</div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "0.75rem" }}>
                <div style={{ fontSize: "0.85rem", color: "#475569", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <Mail size={14} color="#94a3b8" /> {client.email}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#475569", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Phone size={14} color="#94a3b8" /> {client.phone}
                </div>
              </div>

              {selectedClient?.id === client.id && (
                <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", color: "#6366f1" }}>
                  <CheckCircle size={20} fill="#f5f3ff" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Client Details View */}
      {selectedClient && (
        <>
          {/* Key Metrics Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: 24,
                border: "1px solid #f1f5f9",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem"
              }}
            >
              <div style={{ background: "#eff6ff", padding: "1rem", borderRadius: 16, color: "#3b82f6" }}>
                <BarChart3 size={32} />
              </div>
              <div>
                <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1e293b" }}>{clientHistory.length}</div>
                <div style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>Total Servicios</div>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                padding: "1.75rem",
                borderRadius: 24,
                border: "1px solid #f1f5f9",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem"
              }}
            >
              <div style={{ background: "#f0fdf4", padding: "1rem", borderRadius: 16, color: "#22c55e" }}>
                <CheckCircle size={32} />
              </div>
              <div>
                <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1e293b" }}>{clientHistory.filter(h => h.status === 'completed').length}</div>
                <div style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>Servicios Completados</div>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                padding: "1.75rem",
                borderRadius: 24,
                border: "1px solid #f1f5f9",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem"
              }}
            >
              <div style={{ background: "#fff7ed", padding: "1rem", borderRadius: 16, color: "#f97316" }}>
                <Star size={32} />
              </div>
              <div>
                <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1e293b" }}>{getTotalLoyaltyPoints()}</div>
                <div style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>Puntos Acumulados</div>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                padding: "1.75rem",
                borderRadius: 24,
                border: "1px solid #f1f5f9",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                background: `linear-gradient(to right, #fff, ${getLoyaltyTier(getTotalLoyaltyPoints()).color}10)`
              }}
            >
              <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: 16, color: getLoyaltyTier(getTotalLoyaltyPoints()).color }}>
                <Award size={32} />
              </div>
              <div>
                <div style={{ fontSize: "1.25rem", fontWeight: 900, color: "#1e293b" }}>{getLoyaltyTier(getTotalLoyaltyPoints()).name}</div>
                <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 700 }}>Beneficio: {getLoyaltyTier(getTotalLoyaltyPoints()).discount} OFF</div>
              </div>
            </div>
          </div>

          {/* Loyalty Breakdown Section */}
          <div
            style={{
              background: "#fff",
              padding: "2.5rem",
              borderRadius: 24,
              marginBottom: "2.5rem",
              border: "1px solid #f1f5f9",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ background: "#fef3c7", padding: "0.5rem", borderRadius: 10, color: "#f59e0b" }}>
                  <Gift size={20} />
                </div>
                <h3 style={{ color: "#1e293b", margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
                  Detalle de Fidelidad por Servicio
                </h3>
              </div>
              <button
                onClick={() => setShowLoyaltyModal(true)}
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  padding: "0.75rem 1.5rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Plus size={18} /> Agregar Puntos Manuales
              </button>
            </div>

            {Object.keys(loyaltyPoints).length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "#f8fafc", borderRadius: 20, color: "#64748b", fontWeight: 500 }}>
                El cliente aún no ha acumulado puntos en ningún servicio específico.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {Object.entries(loyaltyPoints).map(([service, points]) => (
                  <div
                    key={service}
                    style={{
                      background: "#f8fafc",
                      padding: "1.5rem",
                      borderRadius: 20,
                      border: "1px solid #f1f5f9",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    <div style={{ fontWeight: "800", color: "#475569", marginBottom: "0.5rem", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.025em" }}>
                      {servicesOptions.find(s => s.value === service)?.label || service}
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                      <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1e293b" }}>
                        {points}
                      </div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#64748b" }}>puntos</div>
                    </div>
                    {/* Progress indicator decoration */}
                    <div style={{ marginTop: "1rem", height: 6, background: "#e2e8f0", borderRadius: 3 }}>
                      <div style={{ width: `${Math.min(points, 100)}%`, height: "100%", background: "#6366f1", borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Client Discounts Section */}
          <div
            style={{
              background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
              padding: "2.5rem",
              borderRadius: 24,
              marginBottom: "2.5rem",
              border: "1px solid #fde68a",
              boxShadow: "0 4px 6px -1px rgba(180, 83, 9, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
              <div style={{ background: "#fef3c7", padding: "0.5rem", borderRadius: 10, color: "#d97706" }}>
                <TrendingUp size={20} />
              </div>
              <h3 style={{ color: "#92400e", margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
                Descuentos Disponibles para el Cliente
              </h3>
            </div>

            {clientDiscounts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2.5rem", background: "rgba(255,255,255,0.5)", borderRadius: 20, color: "#92400e", fontWeight: 600, border: "1px dashed #fcd34d" }}>
                <div style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>💎</div>
                Este cliente no tiene cupones o descuentos activos en este momento.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {clientDiscounts.map((discount, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#fff",
                      padding: "1.75rem",
                      borderRadius: 20,
                      border: "2px solid #fcd34d",
                      textAlign: "center",
                      position: "relative",
                      boxShadow: "0 10px 15px -3px rgba(180, 83, 9, 0.1)",
                    }}
                  >
                    <div style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#fcd34d",
                      color: "#92400e",
                      padding: "0.25rem 0.75rem",
                      borderRadius: 20,
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      textTransform: "uppercase"
                    }}>
                      Cupón Activo
                    </div>
                    <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#d97706", marginBottom: "0.25rem" }}>
                      {discount.discount_percentage}%
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#92400e", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      De Descuento
                    </div>
                    <div style={{ color: "#64748b", marginTop: "1rem", fontSize: "0.9rem", fontWeight: 500 }}>
                      Aplicable en: <span style={{ color: "#1e293b", fontWeight: 700 }}>{servicesOptions.find(s => s.value === discount.service_type)?.label || discount.service_type}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.5rem" }}>
                      Basado en {discount.completed_services} servicios previos
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Discount Configuration Management Section */}
          <div
            style={{
              background: "#fff",
              padding: "2.5rem",
              borderRadius: 24,
              marginBottom: "2.5rem",
              border: "1px solid #f1f5f9",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
                flexWrap: "wrap",
                gap: "1rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ background: "#f1f5f9", padding: "0.5rem", borderRadius: 10, color: "#475569" }}>
                  <Settings size={20} />
                </div>
                <h3 style={{ color: "#1e293b", margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
                  Configuración Global de Descuentos
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingDiscount(null)
                  setNewDiscount({ service_type: '', services_required: '', discount_percentage: '' })
                  setShowDiscountConfigModal(true)
                }}
                style={{
                  background: "#f8fafc",
                  color: "#1e293b",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "0.75rem 1.25rem",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#fff"
                  e.currentTarget.style.borderColor = "#cbd5e1"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#f8fafc"
                  e.currentTarget.style.borderColor = "#e2e8f0"
                }}
              >
                <Plus size={18} /> Nueva Regla
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {discountConfig.map((config) => (
                <div
                  key={config.id}
                  style={{
                    background: "#f8fafc",
                    padding: "1.25rem",
                    borderRadius: 20,
                    border: "1px solid #f1f5f9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ background: "#fff", padding: "0.6rem", borderRadius: 12, border: "1px solid #f1f5f9", color: "#6366f1" }}>
                      <Target size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.95rem" }}>
                        {servicesOptions.find(s => s.value === config.service_type)?.label || config.service_type}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600, marginTop: "0.1rem" }}>
                        {config.services_required} servicios completados → <span style={{ color: "#10b981" }}>{config.discount_percentage}% OFF</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      onClick={() => handleEditDiscount(config)}
                      style={{
                        background: "#fff",
                        color: "#3b82f6",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      title="Editar regla"
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#3b82f6"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteDiscount(config.id)}
                      style={{
                        background: "#fff",
                        color: "#ef4444",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        width: 36,
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      title="Eliminar regla"
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#ef4444"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {discountConfig.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8", fontStyle: "italic" }}>
                No hay reglas de descuento configuradas.
              </div>
            )}
          </div>

          {/* Service History Section */}
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              border: "1px solid #f1f5f9",
              overflow: "hidden",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div
              style={{
                background: "linear-gradient(to right, #f8fafc, #fff)",
                padding: "1.5rem 2rem",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}
            >
              <div style={{ background: "#eff6ff", padding: "0.5rem", borderRadius: 10, color: "#3b82f6" }}>
                <History size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#1e293b" }}>Historial de Servicios</h3>
                <div style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>{selectedClient.name}</div>
              </div>
            </div>

            {clientHistory.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 2rem",
                  color: "#94a3b8",
                }}
              >
                <div style={{ background: "#f8fafc", width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <AlertCircle size={32} />
                </div>
                <div style={{ fontWeight: 600 }}>No hay servicios registrados</div>
                <div style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>Este cliente aún no tiene reservas en el sistema.</div>
              </div>
            ) : (
              <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                {clientHistory.map((reservation) => (
                  <div
                    key={reservation.id}
                    style={{
                      padding: "1.25rem 2rem",
                      borderBottom: "1px solid #f1f5f9",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        background: reservation.status === "completed" ? "#f0fdf4" : "#f8fafc",
                        color: reservation.status === "completed" ? "#22c55e" : "#64748b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "0.85rem"
                      }}>
                        #{reservation.id.toString().slice(-3)}
                      </div>
                      <div>
                        <div style={{ fontWeight: "700", color: "#1e293b", marginBottom: "0.25rem" }}>
                          {servicesOptions.find(s => s.value === reservation.service_name)?.label || reservation.service_name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                            <Clock size={14} /> {new Date(reservation.assigned_date + 'T12:00:00').toLocaleDateString("es-ES", { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {reservation.shift && (
                            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", textTransform: "capitalize" }}>
                              <Star size={12} /> {reservation.shift}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                      <span
                        style={{
                          padding: "0.4rem 0.75rem",
                          borderRadius: 10,
                          fontSize: "0.8rem",
                          fontWeight: "700",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          backgroundColor:
                            reservation.status === "confirmed" ? "#f0fdf4" :
                              reservation.status === "completed" ? "#eff6ff" : "#fff7ed",
                          color:
                            reservation.status === "confirmed" ? "#15803d" :
                              reservation.status === "completed" ? "#1d4ed8" : "#c2410c",
                        }}
                      >
                        {reservation.status === "confirmed" ? <CheckCircle size={12} /> :
                          reservation.status === "completed" ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {reservation.status === "confirmed" ? "Confirmada" :
                          reservation.status === "completed" ? "Finalizada" : "Pendiente"}
                      </span>

                      {/* Quick Actions for History */}
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                              style={{
                                background: "#f0fdf4",
                                color: "#15803d",
                                border: "1px solid #dcfce7",
                                borderRadius: 8,
                                padding: "0.35rem 0.75rem",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
                              onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={async () => {
                                await handleStatusChange(reservation.id, 'completed')
                                await addLoyaltyPointsForCompletedService(reservation)
                              }}
                              style={{
                                background: "#eff6ff",
                                color: "#1d4ed8",
                                border: "1px solid #dbeafe",
                                borderRadius: 8,
                                padding: "0.35rem 0.75rem",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                transition: "all 0.2s"
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = "#dbeafe"}
                              onMouseLeave={e => e.currentTarget.style.background = "#eff6ff"}
                            >
                              Completar
                            </button>
                          </>
                        )}
                        {reservation.status === 'confirmed' && new Date(reservation.assigned_date) < new Date() && (
                          <button
                            onClick={async () => {
                              await handleStatusChange(reservation.id, 'completed')
                              await addLoyaltyPointsForCompletedService(reservation)
                            }}
                            style={{
                              background: "#fff7ed",
                              color: "#c2410c",
                              border: "1px solid #ffedd5",
                              borderRadius: 8,
                              padding: "0.35rem 0.75rem",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#ffedd5"}
                            onMouseLeave={e => e.currentTarget.style.background = "#fff7ed"}
                          >
                            Finalizar Servicio
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Loyalty Points Modal */}
      {showLoyaltyModal && (
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
          onClick={() => setShowLoyaltyModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "2.5rem",
              borderRadius: 32,
              maxWidth: 420,
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{
                width: 64, height: 64, background: "#fef3c7", color: "#f59e0b",
                borderRadius: 20, display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 1rem"
              }}>
                <Gift size={32} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
                Agregar Puntos
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Otorga puntos de fidelidad manuales al cliente
                <span style={{ color: "#1e293b", fontWeight: 700 }}> {selectedClient.name}</span>.
              </p>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                Tipo de Servicio
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem 0.85rem 2.5rem",
                    borderRadius: 14,
                    border: "1.5px solid #e2e8f0",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#1e293b",
                    appearance: "none",
                    background: "#fff"
                  }}
                >
                  <option value="">Seleccionar servicio</option>
                  {servicesOptions.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
                <Target size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                Puntos a Otorgar
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  min="1"
                  value={pointsToAdd}
                  onChange={(e) => setPointsToAdd(parseInt(e.target.value) || 0)}
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem 0.85rem 2.5rem",
                    borderRadius: 14,
                    border: "1.5px solid #e2e8f0",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                  placeholder="Ej: 10"
                />
                <Award size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => setShowLoyaltyModal(false)}
                style={{
                  flex: 1,
                  padding: "0.85rem",
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddLoyaltyPoints}
                disabled={loading}
                style={{
                  flex: 2,
                  padding: "0.85rem",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                  color: "#white",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                {loading ? "Procesando..." : "Otorgar Puntos"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discount Configuration Modal */}
      {showDiscountConfigModal && (
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
          onClick={() => setShowDiscountConfigModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "2.5rem",
              borderRadius: 32,
              maxWidth: 480,
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{
                width: 64, height: 64, background: "#eff6ff", color: "#3b82f6",
                borderRadius: 20, display: "flex", alignItems: "center",
                justifyContent: "center", margin: "0 auto 1rem"
              }}>
                <Settings size={32} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
                {editingDiscount ? 'Editar Regla' : 'Nueva Regla de Descuento'}
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                Configura los umbrales de beneficios automáticos para el sistema de fidelidad.
              </p>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                Servicio Aplicable
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={newDiscount.service_type}
                  onChange={(e) => setNewDiscount({ ...newDiscount, service_type: e.target.value })}
                  disabled={!!editingDiscount}
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem 0.85rem 2.5rem",
                    borderRadius: 14,
                    border: "1.5px solid #e2e8f0",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#1e293b",
                    appearance: "none",
                    background: editingDiscount ? "#f8fafc" : "#fff",
                    cursor: editingDiscount ? "not-allowed" : "pointer"
                  }}
                >
                  <option value="">Seleccionar servicio</option>
                  {servicesOptions.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
                <Target size={18} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                  Meta (Servicios)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    min="1"
                    value={newDiscount.services_required}
                    onChange={(e) => setNewDiscount({ ...newDiscount, services_required: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem 0.85rem 2.5rem",
                      borderRadius: 14,
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                    placeholder="Ej: 5"
                  />
                  <CheckCircle size={16} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem" }}>
                  Descuento (%)
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={newDiscount.discount_percentage}
                    onChange={(e) => setNewDiscount({ ...newDiscount, discount_percentage: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.85rem 1rem 0.85rem 2.5rem",
                      borderRadius: 14,
                      border: "1.5px solid #e2e8f0",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#1d4ed8",
                    }}
                    placeholder="Ej: 10"
                  />
                  <TrendingUp size={16} color="#94a3b8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={() => setShowDiscountConfigModal(false)}
                style={{
                  flex: 1,
                  padding: "0.85rem",
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveDiscountConfig}
                style={{
                  flex: 2,
                  padding: "0.85rem",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "#white",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)"
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                {editingDiscount ? 'Guardar Cambios' : 'Crear Regla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}