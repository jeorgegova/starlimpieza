import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { servicesOptions } from './constants'

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
    <div>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "2rem",
          borderRadius: 16,
          marginBottom: "2rem",
          color: "white",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          🎯 CRM - Gestión de Clientes
        </h2>
        <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
          Administra la fidelidad y el historial de tus clientes
        </p>
      </div>

      {/* Client Selection */}
      <div
        style={{
          background: "#f8fafc",
          padding: "1.5rem",
          borderRadius: 12,
          marginBottom: "2rem",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3 style={{ color: "#1f2937", marginBottom: "1rem", fontSize: "1.2rem" }}>
          👤 Seleccionar Cliente
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {clients.map((client) => (
            <div
              key={client.id}
              style={{
                padding: "1rem",
                border: selectedClient?.id === client.id ? "2px solid #667eea" : "1px solid #e2e8f0",
                borderRadius: 8,
                background: selectedClient?.id === client.id ? "#f0f4ff" : "white",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() => setSelectedClient(client)}
            >
              <div style={{ fontWeight: "600", color: "#1f2937" }}>
                {client.name}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                @{client.username} • {client.email}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                📞 {client.phone}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Details */}
      {selectedClient && (
        <>
          {/* Client Summary Cards */}
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "1.5rem",
                borderRadius: 12,
                color: "white",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📊</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                {clientHistory.length}
              </div>
              <div style={{ opacity: 0.9 }}>Total Servicios</div>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                padding: "1.5rem",
                borderRadius: 12,
                color: "white",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✅</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                {clientHistory.filter(h => h.status === 'completed').length}
              </div>
              <div style={{ opacity: 0.9 }}>Servicios Completados</div>
            </div>

            <div
              style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                padding: "1.5rem",
                borderRadius: 12,
                color: "white",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏆</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
                {getTotalLoyaltyPoints()}
              </div>
              <div style={{ opacity: 0.9 }}>Puntos Fidelidad</div>
            </div>

            <div
              style={{
                background: `linear-gradient(135deg, ${getLoyaltyTier(getTotalLoyaltyPoints()).color} 0%, ${getLoyaltyTier(getTotalLoyaltyPoints()).color}80 100%)`,
                padding: "1.5rem",
                borderRadius: 12,
                color: "white",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⭐</div>
              <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>
                {getLoyaltyTier(getTotalLoyaltyPoints()).name}
              </div>
              <div style={{ opacity: 0.9 }}>
                Descuento: {getLoyaltyTier(getTotalLoyaltyPoints()).discount}
              </div>
            </div>
          </div>

          {/* Loyalty Management */}
          <div
            style={{
              background: "#f8fafc",
              padding: "1.5rem",
              borderRadius: 12,
              marginBottom: "2rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ color: "#1f2937", fontSize: "1.2rem" }}>
                🎁 Gestión de Fidelidad
              </h3>
              <button
                onClick={() => setShowLoyaltyModal(true)}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.5rem 1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ➕ Agregar Puntos
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              {Object.entries(loyaltyPoints).map(([service, points]) => (
                <div
                  key={service}
                  style={{
                    background: "white",
                    padding: "1rem",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem" }}>
                    {servicesOptions.find(s => s.value === service)?.label || service}
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#667eea" }}>
                    {points} pts
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Discounts */}
          <div
            style={{
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              padding: "1.5rem",
              borderRadius: 12,
              marginBottom: "2rem",
              border: "1px solid #f59e0b",
            }}
          >
            <h3 style={{ color: "#92400e", fontSize: "1.2rem", marginBottom: "1rem" }}>
              💰 Descuentos Disponibles
            </h3>

            {clientDiscounts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "1rem", color: "#92400e" }}>
                Este cliente no tiene descuentos disponibles actualmente
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                }}
              >
                {clientDiscounts.map((discount, index) => (
                  <div
                    key={index}
                    style={{
                      background: "white",
                      padding: "1rem",
                      borderRadius: 8,
                      border: "2px solid #f59e0b",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎁</div>
                    <div style={{ fontWeight: "700", color: "#92400e", fontSize: "1.2rem" }}>
                      {discount.discount_percentage}% OFF
                    </div>
                    <div style={{ color: "#64748b", marginTop: "0.5rem" }}>
                      en {servicesOptions.find(s => s.value === discount.service_type)?.label || discount.service_type}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.25rem" }}>
                      {discount.completed_services} servicios completados
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Discount Configuration Management */}
          <div
            style={{
              background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
              padding: "1.5rem",
              borderRadius: 12,
              marginBottom: "2rem",
              border: "1px solid #0ea5e9",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3 style={{ color: "#0c4a6e", fontSize: "1.2rem" }}>
                ⚙️ Configuración de Descuentos
              </h3>
              <button
                onClick={() => {
                  setEditingDiscount(null)
                  setNewDiscount({ service_type: '', services_required: '', discount_percentage: '' })
                  setShowDiscountConfigModal(true)
                }}
                style={{
                  background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.5rem 1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ➕ Nueva Configuración
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              {discountConfig.map((config) => (
                <div
                  key={config.id}
                  style={{
                    background: "white",
                    padding: "1rem",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "600", color: "#1f2937" }}>
                      {servicesOptions.find(s => s.value === config.service_type)?.label || config.service_type}
                    </div>
                    <div style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      {config.services_required} servicios → {config.discount_percentage}% descuento
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleEditDiscount(config)}
                      style={{
                        background: "#eff6ff",
                        color: "#2563eb",
                        border: "1px solid #bfdbfe",
                        borderRadius: 4,
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteDiscount(config.id)}
                      style={{
                        background: "#fef2f2",
                        color: "#dc2626",
                        border: "1px solid #fecaca",
                        borderRadius: 4,
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service History */}
          <div
            style={{
              background: "white",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#f8fafc",
                padding: "1rem 1.5rem",
                borderBottom: "1px solid #e5e7eb",
                fontWeight: 600,
                color: "#1f2937",
              }}
            >
              📋 Historial de Servicios - {selectedClient.name}
            </div>

            {clientHistory.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "#64748b",
                }}
              >
                No hay servicios registrados para este cliente
              </div>
            ) : (
              <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {clientHistory.map((reservation) => (
                  <div
                    key={reservation.id}
                    style={{
                      padding: "1rem 1.5rem",
                      borderBottom: "1px solid #f1f5f9",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "600", color: "#1f2937", marginBottom: "0.25rem" }}>
                        {servicesOptions.find(s => s.value === reservation.service_name)?.label || reservation.service_name}
                      </div>
                      <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                        📅 {new Date(reservation.assigned_date).toLocaleDateString("es-ES")}
                        {reservation.shift && ` • 🕐 ${reservation.shift === "mañana" ? "Mañana" : "Tarde"}`}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          backgroundColor:
                            reservation.status === "confirmed" ? "#dcfce7" :
                            reservation.status === "completed" ? "#dbeafe" : "#fef3c7",
                          color:
                            reservation.status === "confirmed" ? "#166534" :
                            reservation.status === "completed" ? "#1e40af" : "#92400e",
                        }}
                      >
                        {reservation.status === "confirmed" ? "Confirmada" :
                         reservation.status === "completed" ? "Completada" : "Pendiente"}
                      </span>
                      {reservation.status === 'pending' && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <button
                            onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                            style={{
                              background: "#dcfce7",
                              color: "#166534",
                              border: "1px solid #bbf7d0",
                              borderRadius: 4,
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              marginRight: "0.25rem",
                            }}
                          >
                            ✓ Confirmar
                          </button>
                          <button
                            onClick={async () => {
                              await handleStatusChange(reservation.id, 'completed')
                              // Automatically add loyalty points when service is completed
                              await addLoyaltyPointsForCompletedService(reservation)
                            }}
                            style={{
                              background: "#dbeafe",
                              color: "#1e40af",
                              border: "1px solid #bfdbfe",
                              borderRadius: 4,
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            ✓ Completar
                          </button>
                        </div>
                      )}
                      {reservation.status === 'confirmed' && new Date(reservation.assigned_date) < new Date() && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <button
                            onClick={async () => {
                              await handleStatusChange(reservation.id, 'completed')
                              // Automatically add loyalty points when service is completed
                              await addLoyaltyPointsForCompletedService(reservation)
                            }}
                            style={{
                              background: "#fef3c7",
                              color: "#92400e",
                              border: "1px solid #fde68a",
                              borderRadius: 4,
                              padding: "0.25rem 0.5rem",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            ✅ Completar Servicio
                          </button>
                        </div>
                      )}
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
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 11000,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowLoyaltyModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: 16,
              maxWidth: 400,
              width: "90%",
              boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem", textAlign: "center" }}>
              🎁 Agregar Puntos de Fidelidad
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
                Servicio
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                }}
              >
                <option value="">Seleccionar servicio</option>
                {servicesOptions.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
                Puntos a Agregar
              </label>
              <input
                type="number"
                min="1"
                value={pointsToAdd}
                onChange={(e) => setPointsToAdd(parseInt(e.target.value) || 0)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                }}
                placeholder="Ej: 10"
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={() => setShowLoyaltyModal(false)}
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  padding: "0.75rem 1.5rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddLoyaltyPoints}
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.75rem 1.5rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Agregar Puntos
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
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 11000,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowDiscountConfigModal(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: 16,
              maxWidth: 500,
              width: "90%",
              boxShadow: "0 25px 80px rgba(0,0,0,0.15)",
              border: "1px solid #e5e7eb",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#1f2937", marginBottom: "1.5rem", textAlign: "center" }}>
              {editingDiscount ? 'Editar Configuración de Descuento' : 'Nueva Configuración de Descuento'}
            </h3>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
                Servicio
              </label>
              <select
                value={newDiscount.service_type}
                onChange={(e) => setNewDiscount({...newDiscount, service_type: e.target.value})}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                }}
              >
                <option value="">Seleccionar servicio</option>
                {servicesOptions.map((service) => (
                  <option key={service.value} value={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
                Servicios Requeridos
              </label>
              <input
                type="number"
                min="1"
                value={newDiscount.services_required}
                onChange={(e) => setNewDiscount({...newDiscount, services_required: e.target.value})}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                }}
                placeholder="Ej: 5"
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label style={{ display: "block", fontWeight: "600", color: "#374151", marginBottom: "0.5rem" }}>
                Porcentaje de Descuento
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={newDiscount.discount_percentage}
                onChange={(e) => setNewDiscount({...newDiscount, discount_percentage: e.target.value})}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  fontSize: "1rem",
                }}
                placeholder="Ej: 10.0"
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={() => setShowDiscountConfigModal(false)}
                style={{
                  background: "#f3f4f6",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  padding: "0.75rem 1.5rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveDiscountConfig}
                style={{
                  background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "0.75rem 1.5rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {editingDiscount ? 'Actualizar' : 'Crear'} Configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}