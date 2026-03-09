import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { servicesOptions } from './constants'
import Alert from './Alert'
import {
  Users,
  Search,
  Target,
  TrendingUp,
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
  ChevronRight,
  Star
} from 'lucide-react'

export default function CRMView({
  allReservations,
  allUsers,
  handleStatusChange,
  fetchAllUsers,
  availableServices: propAvailableServices,
  alertMessage,
  setAlertMessage,
  alertType,
  setAlertType
}) {
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientHistory, setClientHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [usersLoading, setUsersLoading] = useState(true)
  const [clientDiscounts, setClientDiscounts] = useState([])
  const [discountConfig, setDiscountConfig] = useState([])
  const [showDiscountConfigModal, setShowDiscountConfigModal] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState(null)
  const [availableServices, setAvailableServices] = useState(propAvailableServices || [])
  const [clientServiceCounts, setClientServiceCounts] = useState({})
  const [newDiscount, setNewDiscount] = useState({
    service_type: '',
    services_required: '',
    discount_percentage: ''
  })

  // Filter users to only show clients (role: "user")
  const clients = allUsers.filter(user => user.role === "user")

  // Update loading state when users are loaded
  useEffect(() => {
    if (allUsers && allUsers.length > 0) {
      setUsersLoading(false)
    }
  }, [allUsers])

  // Fetch users and discount config when component mounts
  useEffect(() => {
    if (fetchAllUsers) {
      fetchAllUsers()
    }
    fetchDiscountConfig()
    fetchAvailableServices()
  }, [fetchAllUsers])

  // Sync availableServices from props
  useEffect(() => {
    if (propAvailableServices && propAvailableServices.length > 0) {
      setAvailableServices(propAvailableServices)
    }
  }, [propAvailableServices])

  useEffect(() => {
    if (selectedClient) {
      // Debug: log the IDs to check for type mismatch
      console.log("Selected client ID:", selectedClient.id, typeof selectedClient.id);
      console.log("All reservations user_ids:", allReservations.map(r => ({ id: r.id, user_id: r.user_id, type: typeof r.user_id })));

      // Get client's reservation history - handle both string and number IDs
      const history = allReservations.filter(res => {
        const resUserId = res.user_id?.toString();
        const clientId = selectedClient.id?.toString();
        return resUserId === clientId;
      })
        .sort((a, b) => new Date(b.assigned_date) - new Date(a.assigned_date))

      console.log("Filtered history:", history.length, "reservations");
      setClientHistory(history)

      // Fetch service counts from database
      fetchClientServiceCounts(selectedClient.id)
    }
  }, [selectedClient, allReservations])

  const fetchDiscountConfig = async () => {
    try {
      // First try with the join
      const { data, error } = await supabase
        .from('service_discount_config')
        .select(`
          *,
          service_available:service_type (name)
        `)
        .order('service_type', { ascending: true })
        .order('services_required', { ascending: true })

      if (error) throw error

      // Transform data to include service_name from the join
      const transformedData = (data || []).map(item => ({
        ...item,
        service_name: item.service_available?.name || item.service_type
      }))
      setDiscountConfig(transformedData)
    } catch (error) {
      console.error('Error fetching discount config:', error)
      // Fallback: try without join
      try {
        const { data } = await supabase
          .from('service_discount_config')
          .select('*')
          .order('services_required', { ascending: true })

        setDiscountConfig(data || [])
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
      }
    }
  }

  const fetchAvailableServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_available')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setAvailableServices(data || [])
    } catch (error) {
      console.error('Error fetching available services:', error)
      // Fallback to constants if table is empty
      setAvailableServices(servicesOptions.map(s => ({ id: s.value, name: s.label })))
    }
  }

  const fetchClientServiceCounts = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_services')
        .select('service_name, status')
        .eq('user_id', userId)
        .eq('status', 'completed')

      if (error) throw error

      // Count services by service_name
      const counts = {}
        ; (data || []).forEach(res => {
          const serviceName = res.service_name
          counts[serviceName] = (counts[serviceName] || 0) + 1
        })
      setClientServiceCounts(counts)
    } catch (error) {
      console.error('Error fetching client service counts:', error)
      setClientServiceCounts({})
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

  const handleSaveDiscountConfig = async () => {
    if (!newDiscount.service_type || !newDiscount.services_required || !newDiscount.discount_percentage) {
      setAlertMessage('Por favor completa todos los campos')
      setAlertType('error')
      return
    }

    try {
      // Get the service name from availableServices
      const serviceTypeId = parseInt(newDiscount.service_type)

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
        // Create new global discount rule (user_id = null for global)
        const { error } = await supabase
          .from('service_discount_config')
          .insert({
            service_type: serviceTypeId, // This is the foreign key to service_available
            services_required: parseInt(newDiscount.services_required),
            discount_percentage: parseFloat(newDiscount.discount_percentage),
          })

        if (error) throw error
      }

      // Refresh config and close modal
      await fetchDiscountConfig()
      setShowDiscountConfigModal(false)
      setEditingDiscount(null)
      setNewDiscount({ service_type: '', services_required: '', discount_percentage: '' })

      setAlertMessage(editingDiscount ? 'Configuración actualizada exitosamente' : 'Nueva regla de descuento creada exitosamente')
      setAlertType('success')
    } catch (error) {
      console.error('Error saving discount config:', error)
      setAlertMessage('Error al guardar la configuración')
      setAlertType('error')
    }
  }

  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount)
    setNewDiscount({
      service_type: discount.service_type ? discount.service_type.toString() : '',
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
      setAlertMessage('Configuración eliminada exitosamente')
      setAlertType('success')
    } catch (error) {
      console.error('Error deleting discount config:', error)
      setAlertMessage('Error al eliminar la configuración')
      setAlertType('error')
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

      {/* Global Discount Configuration - Outside of client selection */}
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
                    {availableServices.find(s => s.id === config.service_type)?.name || `Servicio #${config.service_type}`}
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
            No hay reglas de descuento configuradas. Crea una regla para definir los beneficios por cantidad de servicios.
          </div>
        )}
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
            {usersLoading ? 'Cargando...' : `${clients.length} Clientes registrados`}
          </div>
        </div>

        {usersLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ color: '#6366f1', fontSize: '1.5rem', marginBottom: '1rem' }}>
              <div style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</div>
            </div>
            <p style={{ color: '#64748b', fontWeight: 600 }}>Cargando clientes...</p>
          </div>
        ) : clients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 24, border: '1px solid #f1f5f9' }}>
            <Users size={40} style={{ marginBottom: '1rem', color: '#cbd5e1' }} />
            <p style={{ color: '#64748b', fontWeight: 600 }}>No se encontraron clientes</p>
          </div>
        ) : (
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
                onClick={() => {
                  console.log("Selected client:", client);
                  setSelectedClient(client);
                }}
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
        )}
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

          </div>

          {/* Client Progress Towards Discounts Section */}
          {discountConfig.length > 0 && (
            <div
              style={{
                background: "#fff",
                padding: "2.5rem",
                borderRadius: 24,
                marginBottom: "2.5rem",
                border: "1px solid #e0e7ff",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
                <div style={{ background: "#e0e7ff", padding: "0.5rem", borderRadius: 10, color: "#4f46e5" }}>
                  <TrendingUp size={20} />
                </div>
                <h3 style={{ color: "#1e293b", margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>
                  Progreso del Cliente hacia Descuentos
                </h3>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1.5rem",
                }}
              >
                {discountConfig.map((config) => {
                  // service_type is now an ID (BIGINT), need to use it to look up counts
                  const serviceId = config.service_type
                  const serviceName = availableServices.find(s => s.id === serviceId)?.name || `Servicio #${serviceId}`
                  const completedCount = clientServiceCounts[serviceId] || 0
                  const progress = Math.min((completedCount / config.services_required) * 100, 100)
                  const isCompleted = completedCount >= config.services_required

                  return (
                    <div
                      key={config.id}
                      style={{
                        background: isCompleted ? "#f0fdf4" : "#f8fafc",
                        padding: "1.5rem",
                        borderRadius: 20,
                        border: `2px solid ${isCompleted ? '#22c55e' : '#e2e8f0'}`,
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      {isCompleted && (
                        <div style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          background: "#22c55e",
                          color: "white",
                          padding: "0.2rem 0.5rem",
                          borderRadius: 8,
                          fontSize: "0.7rem",
                          fontWeight: 800
                        }}>
                          ✓ DESCUNTO ACTIVO
                        </div>
                      )}
                      <div style={{ fontWeight: "800", color: "#1e293b", fontSize: "1rem", marginBottom: "0.5rem" }}>
                        {serviceName}
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.75rem" }}>
                        <div style={{ fontSize: "1.75rem", fontWeight: 900, color: isCompleted ? "#22c55e" : "#6366f1" }}>
                          {completedCount}
                        </div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#64748b" }}>
                          / {config.services_required} servicios
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, marginBottom: "0.5rem" }}>
                        <div
                          style={{
                            width: `${progress}%`,
                            height: "100%",
                            background: isCompleted ? "#22c55e" : "#6366f1",
                            borderRadius: 4,
                            transition: "width 0.3s ease"
                          }}
                        />
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                        {isCompleted
                          ? <span style={{ color: "#22c55e" }}>¡Ha completado! Obtiene {config.discount_percentage}% de descuento</span>
                          : `Faltan ${config.services_required - completedCount} servicios para obtener ${config.discount_percentage}% de descuento`
                        }
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

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
                  {availableServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
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

      {/* Alert Component */}
      <Alert alertMessage={alertMessage} alertType={alertType} setAlertMessage={setAlertMessage} />
    </div>
  )
}