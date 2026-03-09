import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { servicesOptions } from './constants'
import {
  Award,
  Gift,
  Star,
  TrendingUp,
  CheckCircle,
  Clock,
  ChevronRight,
  Target,
  Trophy,
  Zap,
  Info
} from 'lucide-react'

export default function UserLoyaltyView({ user }) {
  const [discounts, setDiscounts] = useState([])
  const [loyaltyPoints, setLoyaltyPoints] = useState({})
  const [discountConfigs, setDiscountConfigs] = useState([])
  const [completedServices, setCompletedServices] = useState({})
  const [serviceProgress, setServiceProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const [availableServices, setAvailableServices] = useState([])

  useEffect(() => {
    if (user) {
      fetchUserDiscounts()
      fetchLoyaltyPoints()
      fetchDiscountConfigs()
      fetchCompletedServices()
      fetchAvailableServices()
    }
  }, [user])

  // Calculate service progress when configs and completed services are loaded
  useEffect(() => {
    // Only run if we have discount configs and completed services data
    // Also ensure availableServices is loaded for proper service name mapping
    if (discountConfigs.length > 0 && Object.keys(completedServices).length >= 0 && availableServices.length > 0) {
      calculateServiceProgress()
    }
  }, [discountConfigs, completedServices, availableServices])

  const fetchUserDiscounts = async () => {
    try {
      const { data, error } = await supabase.rpc('get_customer_discounts', {
        p_user_id: user.id
      })

      if (error) throw error
      setDiscounts(data || [])
    } catch (error) {
      console.error('Error fetching discounts:', error)
    }
  }

  const fetchLoyaltyPoints = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_loyalty')
        .select('service_type, points')
        .eq('user_id', user.id)

      if (error) throw error

      const points = {}
      data.forEach(item => {
        points[item.service_type] = item.points
      })
      setLoyaltyPoints(points)
    } catch (error) {
      console.error('Error fetching loyalty points:', error)
    }
  }

  const fetchDiscountConfigs = async () => {
    try {
      // First try with the join
      const { data, error } = await supabase
        .from('service_discount_config')
        .select(`
          *,
          service_available:service_type (name)
        `)
        .eq('active', true)
        .order('service_type', { ascending: true })
        .order('services_required', { ascending: true })

      if (error) throw error

      // Transform data to include service_name from the join
      const transformedData = (data || []).map(item => ({
        ...item,
        service_name: item.service_available?.name || item.service_type
      }))
      setDiscountConfigs(transformedData)
    } catch (error) {
      console.error('Error fetching discount configs:', error)
      // Fallback: try without join
      try {
        const { data } = await supabase
          .from('service_discount_config')
          .select('*')
          .eq('active', true)
          .order('services_required', { ascending: true })

        setDiscountConfigs(data || [])
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
      }
    }
  }

  const fetchCompletedServices = async () => {
    try {
      console.log('Fetching completed services for user:', user.id)

      // Query user_services table directly to count completed services
      const { data: userServices, error } = await supabase
        .from('user_services')
        .select('service_name, status')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching user services:', error)
        throw error
      }

      console.log('All user services:', userServices)

      // Count completed services by service type (store raw values - mapping happens in calculateServiceProgress)
      const servicesCount = {}
      userServices.forEach(service => {
        if (service.status === 'completed') {
          const serviceType = service.service_name
          servicesCount[serviceType] = (servicesCount[serviceType] || 0) + 1
        }
      })

      console.log('Completed services count by type:', servicesCount)
      setCompletedServices(servicesCount)
    } catch (error) {
      console.error('Error fetching completed services:', error)
      setCompletedServices({})
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_available')
        .select('id, name')
        .order('name', { ascending: true })

      if (error) throw error
      setAvailableServices(data || [])
    } catch (error) {
      console.error('Error fetching available services:', error)
    }
  }

  const calculateServiceProgress = () => {
    // Create a simple map: service_name -> completed count
    // The completedServices already has service names as keys
    const completedCounts = { ...completedServices }

    // Build a map from service_type ID to service_name using availableServices
    const serviceIdToName = {}
    const serviceNameToId = {}
    availableServices.forEach(service => {
      serviceIdToName[service.id] = service.name
      serviceIdToName[service.id.toString()] = service.name
      serviceNameToId[service.name] = service.id
    })

    // Also add mappings from servicesOptions as fallback
    servicesOptions.forEach(opt => {
      serviceIdToName[opt.value] = opt.label
      serviceIdToName[opt.value.toString()] = opt.label
      serviceNameToId[opt.label] = opt.value
    })

    // For each discount config, calculate progress
    const progressData = discountConfigs.map(config => {
      // Get service name - try to get from join, fallback to availableServices lookup, then to raw value
      let serviceName = config.service_name
      if (!serviceName && config.service_type) {
        serviceName = serviceIdToName[config.service_type] || config.service_type.toString()
      }

      // Get completed count for this service - try multiple keys for flexibility
      let completedCount = completedCounts[serviceName] || 0

      // If not found, try by service_type ID
      if (completedCount === 0 && config.service_type) {
        completedCount = completedCounts[config.service_type] ||
          completedCounts[config.service_type.toString()] ||
          completedCounts[serviceIdToName[config.service_type]] || 0
      }

      const progress = Math.min((completedCount / config.services_required) * 100, 100)
      const isCompleted = completedCount >= config.services_required

      return {
        id: config.id,
        serviceName: serviceName,
        completedCount: completedCount,
        servicesRequired: config.services_required,
        discountPercentage: config.discount_percentage,
        progress: progress,
        isCompleted: isCompleted
      }
    })

    setServiceProgress(progressData)
  }

  const getTotalPoints = () => {
    return Object.values(loyaltyPoints).reduce((sum, points) => sum + points, 0)
  }

  const getLoyaltyTier = (points) => {
    if (points >= 100) return { name: "VIP Oro", color: "#FFD700", benefits: "Descuento máximo + prioridad" }
    if (points >= 50) return { name: "VIP Plata", color: "#C0C0C0", benefits: "Descuento alto + soporte preferente" }
    if (points >= 25) return { name: "VIP Bronce", color: "#CD7F32", benefits: "Descuento medio + beneficios exclusivos" }
    return { name: "Cliente Regular", color: "#6B7280", benefits: "Beneficios básicos" }
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#f8fafc", borderRadius: 24 }}>
        <div style={{
          width: 48, height: 48, background: "#fff", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}>
          <Clock className="animate-spin-slow" size={24} color="#3b82f6" />
        </div>
        <p style={{ color: "#64748b", fontWeight: 600, fontSize: "1.1rem" }}>Cargando tus bonificaciones...</p>
      </div>
    )
  }

  const totalPoints = getTotalPoints()

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: "2rem" }}>
      {/* Main Content Section */}
      <div
        style={{
          background: "#fff",
          padding: "2.5rem",
          borderRadius: 32,
          border: "1px solid #f1f5f9",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem", justifyContent: "center" }}>
          <div style={{ background: "#fef3c7", padding: "0.6rem", borderRadius: 12, color: "#f59e0b" }}>
            <Gift size={24} />
          </div>
          <h3
            style={{
              color: "#1e293b",
              margin: 0,
              fontSize: "1.75rem",
              fontWeight: 900,
              letterSpacing: "-0.025em"
            }}
          >
            Tus Beneficios Disponibles
          </h3>
          <div style={{ flex: 1, height: 2, background: "#f1f5f9", marginLeft: "1rem" }} className="hide-sm" />
        </div>

        {Object.keys(serviceProgress).length === 0 || !Array.isArray(serviceProgress) ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#f8fafc", borderRadius: 24, border: "2px dashed #e2e8f0" }}>
            <div style={{ width: 64, height: 64, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              <Target size={32} color="#94a3b8" />
            </div>
            <h4 style={{ color: "#1e293b", marginBottom: "0.5rem", fontSize: "1.25rem", fontWeight: 800 }}>
              ¡Comienza tu camino al ahorro!
            </h4>
            <p style={{ color: "#64748b", fontSize: "1rem", maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
              Completa tu primer servicio para desbloquear bonificaciones exclusivas y descuentos por fidelidad.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {serviceProgress.map((progress) => {
              const isCompleted = progress.isCompleted

              return (
                <div
                  key={progress.id}
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
                      ✓ DESCUENTO ACTIVO
                    </div>
                  )}
                  <div style={{ fontWeight: "800", color: "#1e293b", fontSize: "1rem", marginBottom: "0.5rem" }}>
                    {progress.serviceName}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.75rem" }}>
                    <div style={{ fontSize: "1.75rem", fontWeight: 900, color: isCompleted ? "#22c55e" : "#6366f1" }}>
                      {progress.completedCount}
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#64748b" }}>
                      / {progress.servicesRequired} servicios
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 8, background: "#e2e8f0", borderRadius: 4, marginBottom: "0.5rem" }}>
                    <div
                      style={{
                        width: `${progress.progress}%`,
                        height: "100%",
                        background: isCompleted ? "#22c55e" : "#6366f1",
                        borderRadius: 4,
                        transition: "width 0.3s ease"
                      }}
                    />
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                    {isCompleted
                      ? <span style={{ color: "#22c55e" }}>¡Has completado! Obtienes {progress.discountPercentage}% de descuento</span>
                      : `Faltan ${progress.servicesRequired - progress.completedCount} servicios para obtener ${progress.discountPercentage}% de descuento`
                    }
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div style={{ marginTop: "3rem", padding: "1.5rem", background: "#f8fafc", borderRadius: 20, display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          <Info size={20} color="#94a3b8" style={{ marginTop: "0.1rem" }} />
          <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", lineHeight: 1.5 }}>
            <strong>Nota:</strong> Los descuentos se aplican automáticamente en tu próxima reserva del mismo servicio. Los puntos de fidelidad globales contribuyen a tu rango VIP, el cual otorga beneficios adicionales en todos nuestros servicios.
          </p>
        </div>
      </div>
    </div>
  )
}