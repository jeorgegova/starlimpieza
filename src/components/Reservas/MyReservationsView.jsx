import React, { useState } from 'react'
import {
  Calendar,
  MapPin,
  Phone,
  Home,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  History,
  XCircle,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react'
import { servicesOptions } from './constants'

export default function MyReservationsView({
  userReservations,
  setActiveTab,
  openReservationDetail,
  locationOptions,
}) {
  const [filterStatus, setFilterStatus] = useState(null);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmada',
          color: '#16a34a',
          bg: '#f0fdf4',
          icon: <CheckCircle size={14} />
        }
      case 'completed':
        return {
          label: 'Finalizada',
          color: '#2563eb',
          bg: '#eff6ff',
          icon: <History size={14} />
        }
      case 'pending':
      default:
        return {
          label: 'Pendiente',
          color: '#d97706',
          bg: '#fffbeb',
          icon: <Clock size={14} />
        }
    }
  }

  const stats = [
    {
      id: 'pending',
      label: 'Pendientes',
      count: userReservations.filter(r => r.status === 'pending' || !r.status).length,
      bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      border: '#f59e0b',
      color: '#92400e',
      icon: <Clock size={18} />
    },
    {
      id: 'confirmed',
      label: 'Confirmadas',
      count: userReservations.filter(r => r.status === 'confirmed').length,
      bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      border: '#22c55e',
      color: '#166534',
      icon: <CheckCircle size={18} />
    },
    {
      id: 'completed',
      label: 'Finalizadas',
      count: userReservations.filter(r => r.status === 'completed').length,
      bg: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      border: '#3b82f6',
      color: '#1e40af',
      icon: <TrendingUp size={18} />
    }
  ]

  const filteredReservations = filterStatus
    ? userReservations.filter(r => {
      if (filterStatus === 'pending') return r.status === 'pending' || !r.status;
      return r.status === filterStatus;
    })
    : userReservations;

  return (
    <div style={{ paddingBottom: '2rem' }}>
      {/* Premium Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)",
          padding: "3rem 2rem",
          borderRadius: 32,
          marginBottom: "2.5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          color: "#1e293b",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
          border: "1px solid #e2e8f0"
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            padding: '1rem',
            background: 'rgba(59, 130, 246, 0.05)',
            borderRadius: '20px',
            backdropFilter: 'blur(8px)',
            marginBottom: '1.25rem',
            color: '#3b82f6',
            border: "1px solid rgba(59, 130, 246, 0.1)"
          }}>
            <ClipboardList size={32} />
          </div>
          <h3 style={{ fontWeight: 900, fontSize: "2rem", margin: "0 0 0.5rem 0", letterSpacing: "-0.025em", color: "#0f172a" }}>
            Mis Reservas
          </h3>
          <p style={{ color: "#64748b", fontSize: "1rem", margin: 0, fontWeight: 500 }}>
            Gestiona y haz seguimiento de tus servicios de limpieza
          </p>
        </div>
        <div style={{ position: "absolute", top: "-50%", right: "-10%", width: 300, height: 300, background: "rgba(59, 130, 246, 0.03)", borderRadius: "50%" }} />
      </div>

      {userReservations.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "5rem 2rem",
            background: "#fff",
            borderRadius: 32,
            border: "2px dashed #e2e8f0",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{
            width: 96,
            height: 96,
            background: '#f8fafc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#cbd5e1',
            marginBottom: '2rem'
          }}>
            <Calendar size={48} />
          </div>
          <h4 style={{ color: "#1e293b", marginBottom: "1rem", fontSize: "1.5rem", fontWeight: 800 }}>
            Tu agenda está vacía
          </h4>
          <p style={{ color: "#64748b", fontSize: "1.05rem", marginBottom: "2.5rem", maxWidth: '400px', lineHeight: 1.6, fontWeight: 500 }}>
            ¿Necesitas un espacio brillante? Programa tu primer servicio profesional en segundos.
          </p>
          <button
            onClick={() => setActiveTab("calendar")}
            style={{
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 18,
              padding: "1.25rem 2.5rem",
              fontWeight: 800,
              cursor: "pointer",
              fontSize: "1.1rem",
              boxShadow: "0 10px 15px -3px rgba(34,197,94,0.3)",
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            Nueva Reserva <ArrowRight size={20} />
          </button>
        </div>
      ) : (
        <div>
          {/* Status Filters */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.id}
                onClick={() => setFilterStatus(filterStatus === stat.id ? null : stat.id)}
                style={{
                  background: stat.bg,
                  padding: "1.5rem 1rem",
                  borderRadius: 24,
                  border: `2px solid ${filterStatus === stat.id ? stat.border : 'transparent'}`,
                  textAlign: "center",
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  transform: filterStatus === stat.id ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: filterStatus === stat.id ? `0 12px 20px -8px ${stat.border}66` : '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  opacity: filterStatus && filterStatus !== stat.id ? 0.6 : 1
                }}
              >
                <div style={{
                  color: stat.color,
                  background: 'white',
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                  {stat.icon}
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, color: stat.color, lineHeight: 1 }}>
                  {stat.count}
                </div>
                <div style={{ color: stat.color, fontSize: "0.7rem", fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Reset Filter Button */}
          {filterStatus && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <button
                onClick={() => setFilterStatus(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  padding: '8px 16px',
                  borderRadius: '14px',
                  fontSize: '0.9rem',
                  color: '#475569',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <XCircle size={16} />
                Mostrar todo
              </button>
            </div>
          )}

          {/* Reservations Grid */}
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {filteredReservations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 24, border: '1px solid #f1f5f9' }}>
                <Search size={40} style={{ marginBottom: '1rem', color: '#cbd5e1' }} />
                <p style={{ color: '#64748b', fontWeight: 600 }}>No hay reservas que coincidan con el filtro</p>
              </div>
            ) : (
              filteredReservations.map((reservation) => {
                const statusInfo = getStatusInfo(reservation.status);
                const service = servicesOptions.find((s) => s.value === reservation.service_name);
                const location = locationOptions.find(l => l.id === reservation.location_id);

                return (
                  <div
                    key={reservation.id}
                    style={{
                      background: "#fff",
                      padding: "1.75rem",
                      borderRadius: 28,
                      border: "1px solid #f1f5f9",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.5rem'
                    }}
                    onClick={() => openReservationDetail(reservation)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)"
                      e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0,0,0,0.05)"
                      e.currentTarget.style.borderColor = "#e2e8f0"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0,0,0,0.05)"
                      e.currentTarget.style.borderColor = "#f1f5f9"
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          background: '#eff6ff',
                          borderRadius: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#3b82f6'
                        }}>
                          <ClipboardList size={24} />
                        </div>
                        <div>
                          <h4 style={{ color: "#1e293b", margin: 0, fontSize: "1.15rem", fontWeight: 800 }}>
                            {service?.label || reservation.service_name}
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            ID #{reservation.id.toString().slice(-6)}
                          </span>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        padding: "6px 14px",
                        borderRadius: 14,
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        border: `1px solid ${statusInfo.color}11`
                      }}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1.25rem',
                      padding: '1.25rem',
                      background: '#f8fafc',
                      borderRadius: 20,
                    }}>
                      <InfoItem icon={<Calendar size={16} />} text={
                        new Date(reservation.assigned_date + 'T12:00:00').toLocaleDateString("es-ES", {
                          weekday: "short",
                          month: "long",
                          day: "numeric",
                        })
                      } bold />
                      <InfoItem icon={<MapPin size={16} />} text={location?.location || "S.D."} />
                      <InfoItem icon={<Home size={16} />} text={reservation.address} />
                      <InfoItem icon={<Phone size={16} />} text={reservation.phone} />
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6', fontSize: '0.9rem', fontWeight: 700 }}>
                        Ver detalles completos <ChevronRight size={16} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
                        Actualizada hace poco
                      </div>
                    </div>
                  </div>
                )
              }))}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoItem({ icon, text, bold }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
      <div style={{ color: '#94a3b8' }}>{icon}</div>
      <span style={{
        fontSize: '0.9rem',
        fontWeight: bold ? 700 : 500,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}>
        {text}
      </span>
    </div>
  )
}