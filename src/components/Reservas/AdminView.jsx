import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { servicesOptions } from './constants'
import {
  Users,
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  ClipboardList,
  MoreVertical,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Star,
  Zap,
  LayoutDashboard,
  BarChart3,
  CalendarDays,
  Phone,
  Target,
  ShieldCheck
} from 'lucide-react'

export default function AdminView({
  allReservations,
  service,
  openEditModal,
  setReservationToDelete,
  setShowDeleteModal,
  locationOptions,
  handleStatusChange,
  users,
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [loyaltyData, setLoyaltyData] = useState({})

  useEffect(() => {
    fetchLoyaltyData()
  }, [allReservations])

  const fetchLoyaltyData = async () => {
    if (allReservations.length === 0) return

    const userIds = [...new Set(allReservations.map(r => r.user_id).filter(id => id))]

    if (userIds.length === 0) return

    try {
      const { data, error } = await supabase
        .from('customer_loyalty')
        .select('user_id, points')
        .in('user_id', userIds)

      if (error) throw error

      const loyaltyMap = {}
      data.forEach(item => {
        loyaltyMap[item.user_id] = (loyaltyMap[item.user_id] || 0) + item.points
      })
      setLoyaltyData(loyaltyMap)
    } catch (error) {
      console.error('Error fetching loyalty data:', error)
    }
  }

  const getLoyaltyTier = (points) => {
    if (points >= 100) return { name: "VIP Oro", color: "#FFD700" }
    if (points >= 50) return { name: "VIP Plata", color: "#C0C0C0" }
    if (points >= 25) return { name: "VIP Bronce", color: "#CD7F32" }
    return { name: "Regular", color: "#6B7280" }
  }

  // Filter reservations based on search and filters
  const filteredReservations = allReservations.filter(reservation => {
    const matchesSearch = searchTerm === '' ||
      reservation.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.users?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.phone?.includes(searchTerm) ||
      reservation.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locationOptions.find(l => l.id === reservation.location_id)?.location?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter
    const matchesLocation = locationFilter === 'all' || reservation.location_id === locationFilter
    const matchesDate = dateFilter === '' || reservation.assigned_date === dateFilter

    return matchesSearch && matchesStatus && matchesLocation && matchesDate
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentReservations = filteredReservations.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1)
  }
  return (
    <div>
      {/* Modern Dashboard Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          padding: "2.5rem 2rem",
          borderRadius: 24,
          marginBottom: "2rem",
          color: "#1e293b",
          textAlign: "center",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid #e2e8f0"
        }}
      >
        <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.05 }}>
          <LayoutDashboard size={150} color="#3b82f6" />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "rgba(34, 197, 94, 0.05)",
            padding: "0.5rem 1rem",
            borderRadius: "50px",
            marginBottom: "1rem",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(34, 197, 94, 0.1)",
            color: "#16a34a"
          }}>
            <ShieldCheck size={18} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Acceso Administrativo</span>
          </div>

          <h2 style={{ fontSize: "2.75rem", fontWeight: 900, marginBottom: "0.75rem", letterSpacing: "-0.025em", color: "#0f172a" }}>
            Panel de Administración
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#64748b", margin: 0, maxWidth: "600px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6, fontWeight: 500 }}>
            Gestiona la agenda, supervisa el estado de los servicios y mantén el control total de las operaciones.
          </p>
        </div>
      </div>

      {/* Modern Dashboard Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "1.75rem",
            borderRadius: 20,
            border: "1px solid #f1f5f9",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-4px)"
            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: 12, color: "#64748b" }}>
              <BarChart3 size={24} />
            </div>
            <div style={{ color: "#22c55e", background: "#f0fdf4", padding: "0.25rem 0.5rem", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700 }}>
              +12% hoy
            </div>
          </div>
          <div>
            <div style={{ fontSize: "2.25rem", fontWeight: 900, color: "#1e293b" }}>{allReservations.length}</div>
            <div style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>Total Reservas</div>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "1.75rem",
            borderRadius: 20,
            border: "1px solid #f1f5f9",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-4px)"
            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ background: "#f0fdf4", padding: "0.75rem", borderRadius: 12, color: "#22c55e" }}>
              <CheckCircle size={24} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "2.25rem", fontWeight: 900, color: "#1e293b" }}>
              {allReservations.filter((r) => r.status === "confirmed").length}
            </div>
            <div style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>Confirmadas</div>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "1.75rem",
            borderRadius: 20,
            border: "1px solid #f1f5f9",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-4px)"
            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ background: "#fff7ed", padding: "0.75rem", borderRadius: 12, color: "#f97316" }}>
              <Clock size={24} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "2.25rem", fontWeight: 900, color: "#1e293b" }}>
              {allReservations.filter((r) => r.status === "pending").length}
            </div>
            <div style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>Pendientes</div>
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "1.75rem",
            borderRadius: 20,
            border: "1px solid #f1f5f9",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-4px)"
            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ background: "#eff6ff", padding: "0.75rem", borderRadius: 12, color: "#3b82f6" }}>
              <CalendarDays size={24} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "2.25rem", fontWeight: 900, color: "#1e293b" }}>
              {allReservations.filter((r) => new Date(r.assigned_date) >= new Date()).length}
            </div>
            <div style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: 600 }}>Próximas</div>
          </div>
        </div>
      </div>

      {/* Modern Filters and Quick Actions */}
      <div
        style={{
          background: "#fff",
          padding: "2rem",
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
            <div style={{ background: "#eff6ff", padding: "0.5rem", borderRadius: 10, color: "#3b82f6" }}>
              <Filter size={20} />
            </div>
            <h3 style={{ color: "#1e293b", fontSize: "1.25rem", fontWeight: 800, margin: 0 }}>
              Filtros y Búsqueda
            </h3>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => {
                setStatusFilter('pending')
                setSearchTerm('')
                setLocationFilter('all')
                setDateFilter('')
                handleFilterChange()
              }}
              style={{
                background: "#fff7ed",
                color: "#c2410c",
                border: "1px solid #ffedd5",
                borderRadius: 12,
                padding: "0.6rem 1.25rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#ffedd5"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff7ed"}
            >
              <Zap size={16} /> Pendientes
            </button>
            <button
              onClick={() => {
                const today = new Date().toISOString().split('T')[0]
                setDateFilter(today)
                setStatusFilter('all')
                setSearchTerm('')
                setLocationFilter('all')
                handleFilterChange()
              }}
              style={{
                background: "#f0fdf4",
                color: "#15803d",
                border: "1px solid #dcfce7",
                borderRadius: 12,
                padding: "0.6rem 1.25rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#dcfce7"}
              onMouseLeave={e => e.currentTarget.style.background = "#f0fdf4"}
            >
              <Calendar size={16} /> Hoy
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <div style={{ position: "relative" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.6rem" }}>
              Buscar cliente o detalle
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Nombre, teléfono, dirección..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  handleFilterChange()
                }}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem 0.85rem 2.75rem",
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  fontSize: "0.95rem",
                  transition: "all 0.2s",
                  outline: "none"
                }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.6rem" }}>
              Filtrar por fecha
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value)
                  handleFilterChange()
                }}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  fontSize: "0.95rem",
                  transition: "all 0.2s",
                  outline: "none",
                  backgroundColor: "#fff"
                }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.6rem" }}>
              Estado del servicio
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                handleFilterChange()
              }}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                fontSize: "0.95rem",
                transition: "all 0.2s",
                outline: "none",
                backgroundColor: "#fff",
                appearance: "none",
                cursor: "pointer"
              }}
              onFocus={e => e.target.style.borderColor = "#3b82f6"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="completed">Completada</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: "0.6rem" }}>
              Ubicación / Zona
            </label>
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value)
                handleFilterChange()
              }}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: 14,
                border: "1px solid #e2e8f0",
                fontSize: "0.95rem",
                transition: "all 0.2s",
                outline: "none",
                backgroundColor: "#fff",
                appearance: "none",
                cursor: "pointer"
              }}
              onFocus={e => e.target.style.borderColor = "#3b82f6"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            >
              <option value="all">Todas las zonas</option>
              {locationOptions.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || statusFilter !== 'all' || locationFilter !== 'all' || dateFilter) && (
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setLocationFilter('all')
                setDateFilter('')
                setCurrentPage(1)
              }}
              style={{
                background: "transparent",
                color: "#64748b",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
                padding: "0.5rem"
              }}
            >
              Restablecer todos los filtros
            </button>
          </div>
        )}
      </div>

      {/* Modern Data Table */}
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
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
              <ClipboardList size={20} color="#3b82f6" />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#1e293b" }}>Gestión de Reservas</h3>
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", fontWeight: 500 }}>
              Administrando servicios para: <span style={{ color: "#3b82f6", fontWeight: 700 }}>{service}</span>
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.75rem", fontWeight: 900, color: "#1e293b", lineHeight: 1 }}>
              {filteredReservations.length}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", marginTop: "0.25rem" }}>
              Resultados
            </div>
          </div>
        </div>

        {currentReservations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 2rem",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem"
            }}
          >
            <div style={{ background: "#f8fafc", padding: "2rem", borderRadius: "50%", color: "#cbd5e1" }}>
              <Search size={48} />
            </div>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", marginBottom: "0.5rem" }}>
                No se encontraron resultados
              </div>
              <p style={{ color: "#64748b", margin: 0 }}>
                Intenta ajustar los filtros de búsqueda o restablecerlos para ver más registros.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <style>
                {`
                  .admin-table { width: 100%; border-collapse: separate; border-spacing: 0; }
                  .admin-table th { 
                    padding: 1rem 1.5rem; 
                    text-align: left; 
                    background: #f8fafc; 
                    color: #64748b; 
                    font-weight: 700; 
                    font-size: 0.75rem; 
                    text-transform: uppercase; 
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid #f1f5f9;
                  }
                  .admin-table td { 
                    padding: 1.25rem 1.5rem; 
                    border-bottom: 1px solid #f1f5f9; 
                    vertical-align: middle;
                    transition: all 0.2s;
                  }
                  .admin-table tr:hover td { background-color: #f8fafc; }
                  
                  @media (max-width: 1024px) {
                    .hide-md { display: none; }
                  }
                  @media (max-width: 768px) {
                    .hide-sm { display: none; }
                  }
                `}
              </style>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Información</th>
                    <th className="hide-sm">Detalles Servicio</th>
                    <th className="hide-md">Ubicación</th>
                    <th>Estado</th>
                    <th className="hide-sm">Cliente</th>
                    <th style={{ textAlign: "center" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{
                            width: 40, height: 40, borderRadius: 12, background: "#eff6ff", color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, fontSize: "0.75rem"
                          }}>
                            #{reservation.id.toString().slice(-3)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#1e293b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              <Calendar size={14} color="#64748b" />
                              {new Date(reservation.assigned_date + 'T12:00:00').toLocaleDateString("es-ES", { day: 'numeric', month: 'short' })}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#64748b", textTransform: "capitalize" }}>{reservation.shift}</div>
                          </div>
                        </div>
                      </td>
                      <td className="hide-sm">
                        <div style={{ fontSize: "0.9rem", color: "#334155", fontWeight: 600 }}>{reservation.service_name}</div>
                        {reservation.hours && (
                          <div style={{ fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
                            <Clock size={12} /> {reservation.hours} horas
                          </div>
                        )}
                      </td>
                      <td className="hide-md">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#334155", fontWeight: 500, fontSize: "0.85rem" }}>
                          <MapPin size={14} color="#94a3b8" />
                          {locationOptions.find(l => l.id === reservation.location_id)?.location || "S.D."}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.2rem", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {reservation.address}
                        </div>
                      </td>
                      <td>
                        <span style={{
                          padding: "0.4rem 0.75rem",
                          borderRadius: 10,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          background: reservation.status === "confirmed" ? "#f0fdf4" : reservation.status === "completed" ? "#f8fafc" : "#fff7ed",
                          color: reservation.status === "confirmed" ? "#15803d" : reservation.status === "completed" ? "#64748b" : "#c2410c",
                          border: `1px solid ${reservation.status === "confirmed" ? "#dcfce7" : reservation.status === "completed" ? "#f1f5f9" : "#ffedd5"}`
                        }}>
                          {reservation.status === "confirmed" ? <CheckCircle size={12} /> : reservation.status === "completed" ? <CheckCircle size={12} /> : <Clock size={12} />}
                          {reservation.status === "confirmed" ? "Confirmada" : reservation.status === "completed" ? "Finalizada" : "Pendiente"}
                        </span>
                      </td>
                      <td className="hide-sm">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.85rem" }}>{reservation.users?.name || "Cliente"}</div>
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{reservation.phone}</div>
                          </div>
                          {(() => {
                            const points = loyaltyData[reservation.user_id] || 0
                            const tier = getLoyaltyTier(points)
                            if (points > 0) return (
                              <div title={`${tier.name}: ${points} pts`} style={{ color: tier.color, flexShrink: 0 }}>
                                <Award size={20} />
                              </div>
                            )
                          })()}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                          {reservation.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                              style={{ padding: "0.5rem", borderRadius: 10, border: "none", background: "#f0fdf4", color: "#15803d", cursor: "pointer", transition: "all 0.2s" }}
                              title="Confirmar"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(reservation)}
                            style={{ padding: "0.5rem", borderRadius: 10, border: "none", background: "#eff6ff", color: "#3b82f6", cursor: "pointer", transition: "all 0.2s" }}
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setReservationToDelete(reservation)
                              setShowDeleteModal(true)
                            }}
                            style={{ padding: "0.5rem", borderRadius: 10, border: "none", background: "#fef2f2", color: "#ef4444", cursor: "pointer", transition: "all 0.2s" }}
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1.5rem 2rem",
                  borderTop: "1px solid #f1f5f9",
                  background: "#f8fafc"
                }}
              >
                <div style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>
                  Página <span style={{ color: "#1e293b" }}>{currentPage}</span> de <span style={{ color: "#1e293b" }}>{totalPages}</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.5rem 1rem", borderRadius: 10, border: "1px solid #e2e8f0", background: currentPage === 1 ? "#f1f5f9" : "#fff", color: currentPage === 1 ? "#94a3b8" : "#475569", fontWeight: 700, cursor: currentPage === 1 ? "not-allowed" : "pointer", fontSize: "0.85rem", transition: "all 0.2s"
                    }}
                  >
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.5rem 1rem", borderRadius: 10, border: "1px solid #e2e8f0", background: currentPage === totalPages ? "#f1f5f9" : "#fff", color: currentPage === totalPages ? "#94a3b8" : "#475569", fontWeight: 700, cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontSize: "0.85rem", transition: "all 0.2s"
                    }}
                  >
                    Siguiente <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}