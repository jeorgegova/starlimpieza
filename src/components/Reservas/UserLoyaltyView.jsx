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

      // Count completed services by service type
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
  const tier = getLoyaltyTier(totalPoints)

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: "2rem" }}>
      {/* Tier Header Card */}
      <div
        style={{
          background: `linear-gradient(135deg, ${tier.color}11 0%, ${tier.color}22 100%)`,
          padding: "3rem 2rem",
          borderRadius: 28,
          marginBottom: "3rem",
          color: tier.color,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 10px 15px -3px ${tier.color}11`,
          border: `1px solid ${tier.color}33`
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            width: 80, height: 80, background: "white",
            borderRadius: 24, display: "flex",
            alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem",
            boxShadow: `0 8px 16px ${tier.color}22`,
            color: tier.color
          }}>
            {tier.name === "VIP Oro" ? <Trophy size={40} /> : tier.name === "VIP Plata" ? <Award size={40} /> : tier.name === "VIP Bronce" ? <Trophy size={40} /> : <Star size={40} />}
          </div>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              marginBottom: "0.5rem",
              letterSpacing: "-0.025em",
              color: "#1e293b"
            }}
          >
            {tier.name}
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#64748b", fontWeight: 600, marginBottom: "2rem" }}>
            {tier.benefits}
          </p>
          <div
            style={{
              background: tier.color,
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              fontWeight: 800,
              fontSize: "1.1rem",
              boxShadow: `0 10px 15px -3px ${tier.color}44`
            }}
          >
            <Zap size={20} fill="white" /> {totalPoints} puntos acumulados
          </div>
        </div>
        {/* Decorative background circle */}
        <div style={{ position: "absolute", right: "-10%", top: "-20%", width: 300, height: 300, background: `${tier.color}08`, borderRadius: "50%", zIndex: 0 }} />
      </div>

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

        {Object.keys(serviceProgress).length === 0 ? (
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
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "2rem",
            }}
          >
            {Object.entries(serviceProgress).map(([serviceType, progress]) => {
              const serviceLabel = servicesOptions.find(s => s.value === serviceType)?.label || serviceType
              const isUnlocked = !!progress.currentDiscount

              return (
                <div
                  key={serviceType}
                  style={{
                    background: isUnlocked ? "#fff" : "#fafafa",
                    padding: "2rem",
                    borderRadius: 24,
                    border: isUnlocked ? "2px solid #22c55e" : "1px solid #f1f5f9",
                    position: "relative",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: isUnlocked ? "0 15px 30px -10px rgba(34, 197, 94, 0.2)" : "none"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    if (!isUnlocked) e.currentTarget.style.borderColor = "#e2e8f0"
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)"
                    if (!isUnlocked) e.currentTarget.style.borderColor = "#f1f5f9"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                    <div>
                      <h4
                        style={{
                          color: "#1e293b",
                          margin: 0,
                          fontSize: "1.2rem",
                          fontWeight: 800,
                          marginBottom: "0.25rem"
                        }}
                      >
                        {serviceLabel}
                      </h4>
                      <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                        Servicio de Fidelidad
                      </div>
                    </div>
                    <div style={{
                      width: 44, height: 44, borderRadius: 14,
                      background: isUnlocked ? "#f0fdf4" : "#f1f5f9",
                      color: isUnlocked ? "#22c55e" : "#94a3b8",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {isUnlocked ? <Gift size={24} /> : <Target size={24} />}
                    </div>
                  </div>

                  {/* Unlocked Discount Badge */}
                  {isUnlocked && (
                    <div
                      style={{
                        background: "#f0fdf4",
                        color: "#166534",
                        padding: "0.75rem 1rem",
                        borderRadius: 14,
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        marginBottom: "1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        border: "1px solid #dcfce7"
                      }}
                    >
                      <CheckCircle size={18} /> {progress.currentDiscount.percentage}% Descuento Activo
                    </div>
                  )}

                  {/* Progress Visualization */}
                  <div style={{ marginTop: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: 700 }}>
                      <span style={{ color: "#64748b" }}>Progreso de recompensa</span>
                      <span style={{ color: "#1e293b" }}>{progress.completed} / {progress.nextDiscount ? progress.nextDiscount.required : progress.currentDiscount?.required || 0}</span>
                    </div>
                    <div
                      style={{
                        background: "#f1f5f9",
                        borderRadius: "12px",
                        height: "10px",
                        overflow: "hidden",
                        marginBottom: "1.25rem",
                      }}
                    >
                      <div
                        style={{
                          background: isUnlocked ? "linear-gradient(to right, #22c55e, #10b981)" : "linear-gradient(to right, #3b82f6, #2563eb)",
                          height: "100%",
                          width: progress.nextDiscount
                            ? `${(progress.completed / progress.nextDiscount.required) * 100}%`
                            : "100%",
                          borderRadius: "12px",
                          transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      />
                    </div>

                    {/* Next step info */}
                    {progress.nextDiscount ? (
                      <div
                        style={{
                          background: "#fff",
                          border: "1.5px solid #eff6ff",
                          color: "#1d4ed8",
                          padding: "1rem",
                          borderRadius: 16,
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem"
                        }}
                      >
                        <div style={{ background: "#dbeafe", color: "#1d4ed8", padding: "0.4rem", borderRadius: 8 }}>
                          <TrendingUp size={16} />
                        </div>
                        <div>
                          <div>Próximo beneficio: {progress.nextDiscount.percentage}% OFF</div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
                            Faltan {progress.nextDiscount.remaining} servicio{progress.nextDiscount.remaining !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          background: "#fffbeb",
                          color: "#92400e",
                          padding: "1rem",
                          borderRadius: 16,
                          fontSize: "0.9rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          border: "1px solid #fef3c7"
                        }}
                      >
                        <Trophy size={20} color="#f59e0b" />
                        <div>¡Nivel máximo alcanzado!</div>
                      </div>
                    )}
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