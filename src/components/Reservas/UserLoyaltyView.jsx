import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { servicesOptions } from './constants'

export default function UserLoyaltyView({ user }) {
  const [discounts, setDiscounts] = useState([])
  const [loyaltyPoints, setLoyaltyPoints] = useState({})
  const [discountConfigs, setDiscountConfigs] = useState([])
  const [completedServices, setCompletedServices] = useState({})
  const [serviceProgress, setServiceProgress] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserDiscounts()
      fetchLoyaltyPoints()
      fetchDiscountConfigs()
      fetchCompletedServices()
    }
  }, [user])

  useEffect(() => {
    if (discountConfigs.length > 0 && Object.keys(completedServices).length > 0) {
      calculateServiceProgress()
    }
  }, [discountConfigs, completedServices])

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
      const { data, error } = await supabase
        .from('service_discount_config')
        .select('*')
        .order('service_type', { ascending: true })
        .order('services_required', { ascending: true })

      if (error) throw error
      setDiscountConfigs(data || [])
    } catch (error) {
      console.error('Error fetching discount configs:', error)
    }
  }

  const fetchCompletedServices = async () => {
    try {
      const { data, error } = await supabase.rpc('get_customer_completed_services', {
        p_user_id: user.id
      })

      if (error) throw error

      const servicesCount = {}
      data.forEach(item => {
        servicesCount[item.service_type] = item.completed_count
      })
      setCompletedServices(servicesCount)
    } catch (error) {
      console.error('Error fetching completed services:', error)
      setCompletedServices({})
    } finally {
      setLoading(false)
    }
  }

  const calculateServiceProgress = () => {
    const progress = {}

    // Group configs by service type
    const configsByService = discountConfigs.reduce((acc, config) => {
      if (!acc[config.service_type]) {
        acc[config.service_type] = []
      }
      acc[config.service_type].push(config)
      return acc
    }, {})

    // For each service, calculate progress
    Object.keys(configsByService).forEach(serviceType => {
      const configs = configsByService[serviceType]
      const completedCount = completedServices[serviceType] || 0

      // Find current discount level (highest unlocked)
      const currentDiscount = configs
        .filter(config => config.services_required <= completedCount)
        .sort((a, b) => b.discount_percentage - a.discount_percentage)[0]

      // Find next discount level
      const nextDiscount = configs
        .filter(config => config.services_required > completedCount)
        .sort((a, b) => a.services_required - b.services_required)[0]

      progress[serviceType] = {
        completed: completedCount,
        currentDiscount: currentDiscount ? {
          percentage: currentDiscount.discount_percentage,
          required: currentDiscount.services_required
        } : null,
        nextDiscount: nextDiscount ? {
          percentage: nextDiscount.discount_percentage,
          required: nextDiscount.services_required,
          remaining: nextDiscount.services_required - completedCount
        } : null
      }
    })

    setServiceProgress(progress)
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
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "1.5rem" }}>⏳</div>
        <p>Cargando tus bonificaciones...</p>
      </div>
    )
  }

  const totalPoints = getTotalPoints()
  const tier = getLoyaltyTier(totalPoints)

  return (
    <div>
      {/* Header con nivel VIP */}
      <div
        style={{
          background: `linear-gradient(135deg, ${tier.color}20 0%, ${tier.color}10 100%)`,
          padding: "1.5rem",
          borderRadius: 16,
          marginBottom: "2rem",
          border: `2px solid ${tier.color}30`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
          {tier.name === "VIP Oro" ? "👑" : tier.name === "VIP Plata" ? "🥈" : tier.name === "VIP Bronce" ? "🥉" : "⭐"}
        </div>
        <h2
          style={{
            color: tier.color,
            marginBottom: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: "700",
          }}
        >
          {tier.name}
        </h2>
        <p style={{ color: "#64748b", marginBottom: "1rem" }}>
          {tier.benefits}
        </p>
        <div
          style={{
            background: tier.color,
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: 20,
            display: "inline-block",
            fontWeight: "600",
          }}
        >
          {totalPoints} puntos acumulados
        </div>
      </div>

      {/* Bonificaciones disponibles */}
      <div
        style={{
          background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
          padding: "1.5rem",
          borderRadius: 16,
          marginBottom: "2rem",
          border: "1px solid #0ea5e9",
        }}
      >
        <h3
          style={{
            color: "#0c4a6e",
            marginBottom: "1rem",
            fontSize: "1.3rem",
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          🎁 Tus Bonificaciones Disponibles
        </h3>

        {Object.keys(serviceProgress).length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
            <h4 style={{ color: "#64748b", marginBottom: "0.5rem" }}>
              ¡Completa más servicios para obtener descuentos!
            </h4>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              Cada servicio completado te acerca a mejores bonificaciones
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1rem",
            }}
          >
            {Object.entries(serviceProgress).map(([serviceType, progress]) => {
              const serviceLabel = servicesOptions.find(s => s.value === serviceType)?.label || serviceType

              return (
                <div
                  key={serviceType}
                  style={{
                    background: "white",
                    padding: "1.5rem",
                    borderRadius: 12,
                    border: progress.currentDiscount ? "2px solid #22c55e" : "2px solid #e5e7eb",
                    boxShadow: progress.currentDiscount ? "0 4px 12px rgba(34, 197, 94, 0.15)" : "0 2px 8px rgba(0,0,0,0.05)",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    {progress.currentDiscount ? "🎁" : "🎯"}
                  </div>

                  <h4
                    style={{
                      color: progress.currentDiscount ? "#16a34a" : "#64748b",
                      marginBottom: "0.5rem",
                      fontSize: "1.1rem",
                      fontWeight: "700",
                    }}
                  >
                    {serviceLabel}
                  </h4>

                  {/* Current discount if unlocked */}
                  {progress.currentDiscount && (
                    <div
                      style={{
                        background: "#dcfce7",
                        color: "#166534",
                        padding: "0.5rem",
                        borderRadius: 8,
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                      }}
                    >
                      ✅ {progress.currentDiscount.percentage}% de descuento desbloqueado
                    </div>
                  )}

                  {/* Progress bar */}
                  <div style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        background: "#e5e7eb",
                        borderRadius: "10px",
                        height: "8px",
                        overflow: "hidden",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          background: progress.currentDiscount ? "#22c55e" : "#3b82f6",
                          height: "100%",
                          width: progress.nextDiscount
                            ? `${(progress.completed / progress.nextDiscount.required) * 100}%`
                            : "100%",
                          borderRadius: "10px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      {progress.completed} de {progress.nextDiscount ? progress.nextDiscount.required : progress.currentDiscount?.required || 0} servicios completados
                    </div>
                  </div>

                  {/* Next discount info */}
                  {progress.nextDiscount ? (
                    <div
                      style={{
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        padding: "0.75rem",
                        borderRadius: 8,
                        fontSize: "0.85rem",
                        fontWeight: "600",
                      }}
                    >
                      🎯 Próximo: {progress.nextDiscount.percentage}% descuento
                      <br />
                      <span style={{ fontWeight: "400", color: "#64748b" }}>
                        {progress.nextDiscount.remaining} servicio{progress.nextDiscount.remaining !== 1 ? 's' : ''} más
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: "#fef3c7",
                        color: "#92400e",
                        padding: "0.75rem",
                        borderRadius: 8,
                        fontSize: "0.85rem",
                        fontWeight: "600",
                      }}
                    >
                      🏆 ¡Máximo nivel alcanzado!
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}