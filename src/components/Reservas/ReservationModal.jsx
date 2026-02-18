import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { servicesOptions } from './constants'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import {
  MapPin,
  Home,
  Phone,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  X,
  CreditCard,
  Calendar,
  Sparkles,
  Zap
} from 'lucide-react'

export default function ReservationModal({
  showReservationModal,
  setShowReservationModal,
  selectedDate,
  service,
  reservationLocation,
  setReservationLocation,
  reservationAddress,
  setReservationAddress,
  reservationPhone,
  setReservationPhone,
  reservationShift,
  setReservationShift,
  reservationHours,
  setReservationHours,
  handleReserve,
  locationOptions,
  user,
  onConfirmReserve,
}) {
  const [applicableDiscount, setApplicableDiscount] = useState(0)
  const [loadingDiscount, setLoadingDiscount] = useState(false)
  const [step, setStep] = useState(1) // 1: Ubicación, 2: Detalles, 3: Resumen

  useEffect(() => {
    if (showReservationModal && user && service) {
      calculateDiscount()
    }
    if (showReservationModal) {
      setStep(1) // Reset to first step when opening
    }
  }, [showReservationModal, user, service])

  const calculateDiscount = async () => {
    if (!user || !service) return

    setLoadingDiscount(true)
    try {
      const { data, error } = await supabase.rpc('get_service_discount', {
        p_user_id: user.id,
        p_service_type: service
      })

      if (error) throw error
      setApplicableDiscount(data || 0)
    } catch (error) {
      console.error('Error calculating discount:', error)
      setApplicableDiscount(0)
    } finally {
      setLoadingDiscount(false)
    }
  }

  if (!showReservationModal) return null

  const selectedService = servicesOptions.find((s) => s.value === service)
  const totalPrice = service === "Limpieza de casas"
    ? Math.round(reservationHours * 20 * (1 - applicableDiscount / 100))
    : null;

  const nextStep = () => {
    if (step === 1) {
      if (!reservationLocation || !reservationAddress || !reservationPhone) {
        alert("Por favor, completa los campos obligatorios")
        return
      }
    }
    if (step === 2 && service === "Limpieza de casas") {
      if (!reservationHours || !reservationShift) {
        alert("Por favor, selecciona las horas y la jornada")
        return
      }
    }
    setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  return (
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
        backdropFilter: "blur(8px)",
        padding: "1rem",
      }}
      onClick={() => setShowReservationModal(false)}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 28,
          width: "100%",
          maxWidth: 580,
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          animation: "modalFadeIn 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>
          {`
            @keyframes modalFadeIn {
              from { opacity: 0; transform: scale(0.95) translateY(10px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}
        </style>

        {/* Header con indicadores de pasos */}
        <div style={{ padding: "1.75rem 2rem 1rem", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>
              Nueva Reserva
            </h3>
            <button
              onClick={() => setShowReservationModal(false)}
              style={{
                background: "#f8fafc",
                border: "none",
                borderRadius: "50%",
                padding: "8px",
                cursor: "pointer",
                color: "#64748b",
                display: "flex",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
              onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {[1, 2, 3].map(i => (
              <React.Fragment key={i}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: step >= i ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" : "#f1f5f9",
                  color: step >= i ? "#fff" : "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  transition: "all 0.3s ease",
                  boxShadow: step === i ? "0 0 0 4px rgba(34,197,94,0.15)" : "none"
                }}>
                  {step > i ? <CheckCircle size={18} /> : i}
                </div>
                {i < 3 && <div style={{ flex: 1, height: 2, background: step > i ? "#22c55e" : "#f1f5f9", transition: "all 0.3s ease" }} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Contenido del paso */}
        <div style={{ padding: "2rem", overflowY: "auto", flex: 1 }}>

          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ background: "#f0fdf4", padding: "1.25rem", borderRadius: 16, border: "1px solid #dcfce7", display: "flex", gap: "1rem", alignItems: "center" }}>
                <Zap size={24} color="#22c55e" />
                <div>
                  <div style={{ color: "#166534", fontWeight: 700, fontSize: "0.95rem" }}>Servicio Seleccionado</div>
                  <div style={{ color: "#15803d", fontSize: "0.85rem" }}>{selectedService?.label}</div>
                </div>
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                  <MapPin size={18} color="#3b82f6" /> Ubicación
                </label>
                <select
                  value={reservationLocation}
                  onChange={(e) => setReservationLocation(e.target.value)}
                  style={{
                    width: "100%", padding: "0.85rem", borderRadius: 14, border: "2px solid #e2e8f0", fontSize: "1rem", backgroundColor: "#fff", transition: "all 0.3s", outline: "none"
                  }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                >
                  <option value="">Selecciona zona de servicio</option>
                  {locationOptions.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                  <Home size={18} color="#3b82f6" /> Dirección Completa
                </label>
                <input
                  type="text"
                  value={reservationAddress}
                  onChange={(e) => setReservationAddress(e.target.value)}
                  style={{
                    width: "100%", padding: "0.85rem", borderRadius: 14, border: "2px solid #e2e8f0", fontSize: "1rem", transition: "all 0.3s", outline: "none"
                  }}
                  onFocus={e => e.target.style.borderColor = "#3b82f6"}
                  onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                  placeholder="Ej: Calle Mayor 123, 2-B"
                />
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                  <Phone size={18} color="#3b82f6" /> Teléfono de Contacto
                </label>
                <PhoneInput
                  country={'es'}
                  value={reservationPhone}
                  onChange={phone => setReservationPhone('+' + phone)}
                  inputStyle={{
                    width: "100%", height: "48px", borderRadius: 14, border: "2px solid #e2e8f0", fontSize: "1rem", transition: "all 0.3s"
                  }}
                  buttonStyle={{
                    borderRadius: "14px 0 0 14px", border: "2px solid #e2e8f0", background: "white"
                  }}
                  containerStyle={{ width: "100%" }}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {service === "Limpieza de casas" ? (
                <>
                  <div style={{ background: "#eff6ff", padding: "1.25rem", borderRadius: 16, border: "1px solid #dbeafe" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#1e40af", fontWeight: 700, marginBottom: "0.5rem" }}>
                      <Sparkles size={18} /> Tarifas y Horarios
                    </div>
                    <div style={{ color: "#3b82f6", fontSize: "0.85rem", lineHeight: 1.4 }}>
                      Precio base: <strong>20€/hora</strong>. Mínimo 4h. Se asignan 2 profesionales para mayor rapidez.
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                      <Clock size={18} color="#3b82f6" /> Duración deseada
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                      {["4", "5", "6", "7", "8"].map(h => (
                        <button
                          key={h}
                          onClick={() => setReservationHours(parseInt(h))}
                          style={{
                            padding: "0.75rem",
                            borderRadius: 12,
                            border: reservationHours === parseInt(h) ? "2px solid #22c55e" : "1px solid #e2e8f0",
                            background: reservationHours === parseInt(h) ? "#f0fdf4" : "white",
                            color: reservationHours === parseInt(h) ? "#166534" : "#64748b",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                        >
                          {h} Horas
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                      <Calendar size={18} color="#3b82f6" /> Preferencia horaria
                    </label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      {["mañana", "tarde"].map(s => (
                        <button
                          key={s}
                          onClick={() => setReservationShift(s)}
                          style={{
                            flex: 1,
                            padding: "0.85rem",
                            borderRadius: 12,
                            border: reservationShift === s ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                            background: reservationShift === s ? "#eff6ff" : "white",
                            color: reservationShift === s ? "#1e40af" : "#64748b",
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            textTransform: "capitalize"
                          }}
                        >
                          {s === "mañana" ? "☀️ Mañana" : "🌆 Tarde"}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <div style={{ background: "#f8fafc", padding: "2rem", borderRadius: 20, border: "1px dashed #cbd5e1" }}>
                    <Info size={40} color="#64748b" style={{ marginBottom: "1rem" }} />
                    <h4 style={{ color: "#1e293b", margin: "0 0 0.5rem 0" }}>Cotización Requerida</h4>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.5, margin: 0 }}>
                      Este servicio requiere una revisión personalizada. Te enviaremos el presupuesto detallado tras recibir tu solicitud.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: 20, border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 1rem 0", color: "#1e293b", fontSize: "1rem", fontWeight: 800 }}>Resumen de la Orden</h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Servicio</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>{selectedService?.label}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Fecha</span>
                    <span style={{ fontWeight: 600, color: "#1e293b" }}>{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b" }}>Dirección</span>
                    <span style={{ fontWeight: 600, color: "#1e293b", textAlign: "right", maxWidth: "60%" }}>{reservationAddress}</span>
                  </div>
                  {service === "Limpieza de casas" && (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748b" }}>Duración</span>
                      <span style={{ fontWeight: 600, color: "#1e293b" }}>{reservationHours} Horas ({reservationShift})</span>
                    </div>
                  )}
                </div>

                <div style={{ height: 1, background: "#e2e8f0", margin: "1rem 0" }} />

                {service === "Limpieza de casas" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {applicableDiscount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#22c55e", fontWeight: 600, fontSize: "0.9rem" }}>
                        <span>Descuento aplicado ({applicableDiscount}%)</span>
                        <span>-{Math.round(reservationHours * 20 * (applicableDiscount / 100))}€</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 800, color: "#1e293b", fontSize: "1.1rem" }}>Total estimado</span>
                      <span style={{ fontWeight: 900, color: "#166534", fontSize: "1.5rem" }}>{totalPrice}€</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", color: "#3b82f6", fontWeight: 700 }}>
                    Pendiente de Cotización
                  </div>
                )}
              </div>

              <div style={{ background: "#fef2f2", padding: "1rem", borderRadius: 12, border: "1px solid #fecaca", display: "flex", gap: "0.75rem" }}>
                <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#991b1b", lineHeight: 1.4 }}>
                  <strong>Política de cancelación:</strong> Menos de 48h conlleva el pago del 50%. Menos de 24h conlleva el 100%.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer con botones de navegación */}
        <div style={{ padding: "1.5rem 2rem", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", gap: "1rem" }}>
          {step > 1 && (
            <button
              onClick={prevStep}
              style={{
                flex: 1, padding: "0.9rem", borderRadius: 14, border: "1px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
              }}
            >
              <ChevronLeft size={20} /> Atrás
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={nextStep}
              style={{
                flex: 2, padding: "0.9rem", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", color: "#fff", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 12px rgba(34,197,94,0.2)"
              }}
            >
              Siguiente <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={() => {
                if (onConfirmReserve) {
                  onConfirmReserve(applicableDiscount);
                } else {
                  handleReserve();
                }
              }}
              style={{
                flex: 2, padding: "0.9rem", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)", color: "#fff", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 12px rgba(29,78,216,0.2)"
              }}
            >
              <CreditCard size={20} /> Confirmar y Reservar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}