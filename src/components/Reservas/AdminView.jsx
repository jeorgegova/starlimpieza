import { useState } from 'react'
import { servicesOptions } from './constants'

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
          background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
          padding: "2rem",
          borderRadius: 16,
          marginBottom: "2rem",
          color: "white",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(31, 41, 55, 0.3)",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: "0.5rem",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          🛠️ Panel de Administración
        </h2>
        <p style={{ fontSize: "1.2rem", opacity: 0.9, margin: 0 }}>
          Gestiona todas las reservas y servicios de manera eficiente
        </p>
      </div>

      {/* Modern Dashboard Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            padding: "1.5rem",
            borderRadius: 16,
            border: "1px solid #d1d5db",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📊</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#1f2937", marginBottom: "0.5rem" }}>
            {allReservations.length}
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem", fontWeight: "600" }}>
            Total Reservas
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
            Servicio: {service}
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            padding: "1.5rem",
            borderRadius: 16,
            border: "1px solid #d1d5db",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>✅</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#1f2937", marginBottom: "0.5rem" }}>
            {allReservations.filter((r) => r.status === "confirmed").length}
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem", fontWeight: "600" }}>
            Reservas Confirmadas
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
            Listas para ejecutar
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            padding: "1.5rem",
            borderRadius: 16,
            border: "1px solid #d1d5db",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>⏳</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#1f2937", marginBottom: "0.5rem" }}>
            {allReservations.filter((r) => r.status === "pending").length}
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem", fontWeight: "600" }}>
            Reservas Pendientes
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
            Requieren confirmación
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            padding: "1.5rem",
            borderRadius: 16,
            border: "1px solid #d1d5db",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📅</div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#1f2937", marginBottom: "0.5rem" }}>
            {allReservations.filter((r) => new Date(r.assigned_date) >= new Date()).length}
          </div>
          <div style={{ color: "#6b7280", fontSize: "0.9rem", fontWeight: "600" }}>
            Servicios Próximos
          </div>
          <div style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
            En los próximos días
          </div>
        </div>
      </div>

      {/* Modern Filters and Quick Actions */}
      <div
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          padding: "1.5rem",
          borderRadius: 16,
          marginBottom: "2rem",
          border: "1px solid #e2e8f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
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
          <h3 style={{ color: "#1f2937", fontSize: "1.3rem", fontWeight: "700", margin: 0 }}>
            🔍 Filtros y Búsqueda
          </h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => {
                // Quick action: Show only pending reservations
                setStatusFilter('pending')
                setSearchTerm('')
                setLocationFilter('all')
                setDateFilter('')
                handleFilterChange()
              }}
              style={{
                background: "#f8fafc",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "0.5rem 1rem",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => e.target.style.background = "#f1f5f9"}
              onMouseLeave={(e) => e.target.style.background = "#f8fafc"}
            >
              ⚡ Mostrar Pendientes
            </button>
            <button
              onClick={() => {
                // Quick action: Show today's reservations
                const today = new Date().toISOString().split('T')[0]
                setDateFilter(today)
                setStatusFilter('all')
                setSearchTerm('')
                setLocationFilter('all')
                handleFilterChange()
              }}
              style={{
                background: "#f8fafc",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "0.5rem 1rem",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => e.target.style.background = "#f1f5f9"}
              onMouseLeave={(e) => e.target.style.background = "#f8fafc"}
            >
              📅 Hoy
            </button>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <div>
            <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.5rem" }}>
              🔍 Buscar cliente
            </label>
            <input
              type="text"
              placeholder="Nombre, teléfono, ubicación..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                handleFilterChange()
              }}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.5rem" }}>
              📅 Filtrar por fecha
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value)
                handleFilterChange()
              }}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: "0.9rem",
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.5rem" }}>
              📍 Filtrar por ubicación
            </label>
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value)
                handleFilterChange()
              }}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: "0.9rem",
                backgroundColor: "#fff",
              }}
            >
              <option value="all">Todas las ubicaciones</option>
              {locationOptions.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "0.9rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.5rem" }}>
              ⏰ Filtrar por estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                handleFilterChange()
              }}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: "0.9rem",
                backgroundColor: "#fff",
              }}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="completed">Completada</option>
            </select>
          </div>
        </div>

        {(searchTerm || statusFilter !== 'all' || locationFilter !== 'all' || dateFilter) && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setLocationFilter('all')
                setDateFilter('')
                setCurrentPage(1)
              }}
              style={{
                background: "#f3f4f6",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "0.5rem 1rem",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Modern Data Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            padding: "1rem 1.5rem",
            borderBottom: "2px solid #e5e7eb",
            fontWeight: 700,
            color: "#1f2937",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "1.2rem" }}>📋 Gestión de Reservas</h3>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", color: "#6b7280", fontWeight: "500" }}>
              Servicio: {service}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1f2937" }}>
              {filteredReservations.length}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              de {allReservations.length} total
            </div>
          </div>
        </div>

        {/* Nota compacta para admin */}
        <div
          style={{
            background: "#f8fafc",
            padding: "0.5rem 1rem",
            borderBottom: "1px solid #e2e8f0",
            color: "#374151",
            fontSize: "0.8rem",
            textAlign: "center",
            fontWeight: "500",
          }}
        >
          <strong>Nota:</strong> Gestionas reservas de otros usuarios
        </div>

        {currentReservations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#64748b",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              borderRadius: 16,
              border: "2px dashed #e2e8f0",
              margin: "2rem 0",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem", opacity: 0.5 }}>📋</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem" }}>
              {allReservations.length === 0 ? "No hay reservas para este servicio" : "No se encontraron reservas con los filtros aplicados"}
            </div>
            <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
              {allReservations.length === 0 ? "Las nuevas reservas aparecerán aquí" : "Intenta ajustar los filtros de búsqueda"}
            </div>
          </div>
        ) : (
          <>
            <div style={{ overflowX: "auto", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <style>
                {`
                  @media (max-width: 1024px) {
                    .admin-table th, .admin-table td {
                      padding: 0.75rem 1rem !important;
                      font-size: 0.8rem !important;
                    }
                    .admin-table th span {
                      font-size: 0.75rem !important;
                    }
                  }
                  @media (max-width: 768px) {
                    .admin-table {
                      font-size: 0.75rem !important;
                    }
                    .admin-table th, .admin-table td {
                      padding: 0.5rem 0.5rem !important;
                    }
                    .admin-table th span {
                      display: none !important;
                    }
                    .admin-table th {
                      font-size: 0.65rem !important;
                      padding: 0.5rem 0.25rem !important;
                      text-align: center !important;
                      white-space: nowrap !important;
                      overflow: hidden !important;
                      text-overflow: ellipsis !important;
                      max-width: 60px !important;
                    }
                    .admin-table td {
                      text-align: center !important;
                      max-width: 60px !important;
                      overflow: hidden !important;
                      text-overflow: ellipsis !important;
                    }
                    .admin-table td:nth-child(2), .admin-table td:nth-child(6), .admin-table td:nth-child(7) {
                      text-align: left !important;
                      max-width: 80px !important;
                    }
                    .admin-table th:nth-child(6), .admin-table td:nth-child(6),
                    .admin-table th:nth-child(7), .admin-table td:nth-child(7) {
                      display: none !important;
                    }
                    .action-buttons-mobile {
                      flex-direction: column !important;
                      gap: 0.25rem !important;
                      align-items: center !important;
                    }
                    .action-buttons-mobile button {
                      min-width: 50px !important;
                      padding: 0.3rem 0.4rem !important;
                      font-size: 0.65rem !important;
                    }
                  }
                  @media (max-width: 480px) {
                    .admin-table th {
                      width: 35px !important;
                      font-size: 0.65rem !important;
                    }
                    .admin-table td {
                      padding: 0.4rem 0.5rem !important;
                      font-size: 0.7rem !important;
                    }
                    .status-badge {
                      padding: 0.3rem 0.6rem !important;
                      font-size: 0.7rem !important;
                    }
                  }
                `}
              </style>
              <table
                className="admin-table"
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0",
                  fontSize: "0.875rem",
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <thead>
                  <tr style={{
                    background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
                    color: "white",
                    borderBottom: "2px solid #6b7280"
                  }}>
                    <th style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderRight: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        🆔 ID
                      </span>
                    </th>
                    <th style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderRight: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        👤 Cliente
                      </span>
                    </th>
                    <th style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderRight: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        🧹 Servicio
                      </span>
                    </th>
                    <th style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderRight: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        📅 Fecha
                      </span>
                    </th>
                    <th style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderRight: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        🕐 Jornada
                      </span>
                    </th>
                    <th style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderRight: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        📍 Ubicación
                      </span>
                    </th>
                    <th style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderRight: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        📞 Teléfono
                      </span>
                    </th>
                    <th style={{
                      padding: "1rem 1.5rem",
                      textAlign: "left",
                      fontWeight: "700",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderRight: "1px solid rgba(255,255,255,0.1)"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        ⏰ Estado
                      </span>
                    </th>
                    <th style={{
                      padding: "1rem 1.5rem",
                      textAlign: "center",
                      fontWeight: "700",
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                        ⚡ Acciones
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentReservations.map((reservation, index) => (
                    <tr
                      key={reservation.id}
                      style={{
                        borderBottom: index === currentReservations.length - 1 ? "none" : "1px solid #e5e7eb",
                        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#f1f5f9"
                        e.target.style.transform = "scale(1.01)"
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#f8fafc"
                        e.target.style.transform = "scale(1)"
                      }}
                    >
                      <td style={{
                        padding: "1rem 1.5rem",
                        borderRight: "1px solid #e5e7eb",
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        color: "#1e293b"
                      }}>
                        #{reservation.id}
                      </td>
                      <td style={{ padding: "1rem 1.5rem", borderRight: "1px solid #e5e7eb" }}>
                        <div style={{ fontWeight: "600", color: "#1f2937", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                          {reservation.users?.name || "Usuario Desconocido"}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          @{reservation.users?.username}
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", borderRight: "1px solid #e5e7eb" }}>
                        <div style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem" }}>
                          {servicesOptions.find(s => s.value === reservation.service_name)?.label || reservation.service_name}
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", borderRight: "1px solid #e5e7eb" }}>
                        <div style={{ fontWeight: "500", color: "#1f2937", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                          {new Date(reservation.assigned_date).toLocaleDateString("es-ES", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                          {new Date(reservation.assigned_date).getFullYear()}
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", borderRight: "1px solid #e5e7eb" }}>
                        <span style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          backgroundColor: reservation.shift === "mañana" ? "#fefce8" : "#f8fafc",
                          color: reservation.shift === "mañana" ? "#92400e" : "#374151",
                          border: `1px solid ${reservation.shift === "mañana" ? "#d97706" : "#6b7280"}`,
                        }}>
                          {reservation.shift ? (reservation.shift === "mañana" ? "Mañana" : "Tarde") : "Sin especificar"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", borderRight: "1px solid #e5e7eb" }}>
                        <div style={{ fontWeight: "500", color: "#374151", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                          {locationOptions.find(l => l.id === reservation.location_id)?.location || "Desconocida"}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {reservation.address}
                        </div>
                      </td>
                      <td style={{
                        padding: "1rem 1.5rem",
                        borderRight: "1px solid #e5e7eb",
                        fontFamily: "monospace",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        color: "#374151"
                      }}>
                        {reservation.phone}
                      </td>
                      <td style={{ padding: "1rem 1.5rem", borderRight: "1px solid #e5e7eb" }}>
                        <span
                          className="status-badge"
                          style={{
                            padding: "0.4rem 0.8rem",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            backgroundColor:
                              reservation.status === "confirmed" ? "#f0f9ff" :
                              reservation.status === "completed" ? "#f8fafc" : "#fefce8",
                            color:
                              reservation.status === "confirmed" ? "#0369a1" :
                              reservation.status === "completed" ? "#374151" : "#92400e",
                            border: `1px solid ${
                              reservation.status === "confirmed" ? "#0ea5e9" :
                              reservation.status === "completed" ? "#6b7280" : "#d97706"
                            }`,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                        >
                          <span>
                            {reservation.status === "confirmed" ? "✓" :
                             reservation.status === "completed" ? "✓" : "⏳"}
                          </span>
                          {reservation.status === "confirmed" ? "Confirmada" :
                           reservation.status === "completed" ? "Completada" : "Pendiente"}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                        <div className="action-buttons-mobile" style={{ display: "flex", gap: "0.5rem", justifyContent: "center", alignItems: "center" }}>
                          {reservation.status === 'pending' && (
                            <button
                              onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                              style={{
                                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: 8,
                                padding: "0.6rem 0.8rem",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                boxShadow: "0 2px 8px rgba(34, 197, 94, 0.3)",
                                minWidth: "80px",
                                justifyContent: "center",
                              }}
                              onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
                              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                              title="Confirmar reserva"
                            >
                              <span style={{ fontSize: "0.8rem" }}>✓</span>
                              <span style={{ display: "none", "@media (min-width: 768px)": { display: "inline" } }}>Confirmar</span>
                            </button>
                          )}
                          {reservation.status === 'confirmed' && new Date(reservation.assigned_date) < new Date() && (
                            <button
                              onClick={() => handleStatusChange(reservation.id, 'completed')}
                              style={{
                                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: 8,
                                padding: "0.6rem 0.8rem",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.3rem",
                                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                                minWidth: "80px",
                                justifyContent: "center",
                              }}
                              onMouseEnter={(e) => e.target.style.transform = "translateY(-1px)"}
                              onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                              title="Marcar como completada"
                            >
                              <span style={{ fontSize: "0.8rem" }}>✓</span>
                              <span style={{ display: "none", "@media (min-width: 768px)": { display: "inline" } }}>Completar</span>
                            </button>
                          )}
                          <button
                            onClick={() => openEditModal(reservation)}
                            style={{
                              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                              color: "#475569",
                              border: "1px solid #e2e8f0",
                              borderRadius: 8,
                              padding: "0.6rem 0.8rem",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              minWidth: "70px",
                              justifyContent: "center",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)"
                              e.target.style.transform = "translateY(-1px)"
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"
                              e.target.style.transform = "translateY(0)"
                            }}
                            title="Editar reserva"
                          >
                            <span style={{ fontSize: "0.9rem" }}>✏️</span>
                          </button>
                          <button
                            onClick={() => {
                              setReservationToDelete(reservation)
                              setShowDeleteModal(true)
                            }}
                            style={{
                              background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              borderRadius: 8,
                              padding: "0.6rem 0.8rem",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              minWidth: "70px",
                              justifyContent: "center",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)"
                              e.target.style.transform = "translateY(-1px)"
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)"
                              e.target.style.transform = "translateY(0)"
                            }}
                            title="Eliminar reserva"
                          >
                            <span style={{ fontSize: "0.9rem" }}>🗑️</span>
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
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "1rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                }}
              >
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: "0.5rem 1rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    backgroundColor: currentPage === 1 ? "#f3f4f6" : "#fff",
                    color: currentPage === 1 ? "#9ca3af" : "#374151",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Anterior
                </button>

                <span style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "0.5rem 1rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    backgroundColor: currentPage === totalPages ? "#f3f4f6" : "#fff",
                    color: currentPage === totalPages ? "#9ca3af" : "#374151",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}