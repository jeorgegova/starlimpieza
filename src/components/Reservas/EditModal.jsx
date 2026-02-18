import { servicesOptions } from './constants'
import {
  X,
  Calendar,
  Activity,
  User,
  CheckCircle,
  Clock,
  Save,
  ChevronRight
} from 'lucide-react'

export default function EditModal({
  showEditModal,
  setShowEditModal,
  reservationToEdit,
  editDate,
  setEditDate,
  editService,
  setEditService,
  handleEditReservation,
}) {
  if (!showEditModal || !reservationToEdit) return null

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
        padding: "1rem",
        backdropFilter: "blur(6px)",
      }}
      onClick={() => setShowEditModal(false)}
    >
      <div
        style={{
          background: "#fff",
          padding: 0,
          borderRadius: 32,
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #f1f5f9",
          position: "relative",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)",
          padding: "2.5rem 2rem",
          position: "relative",
          color: "#1e293b",
          borderBottom: "1px solid #e2e8f0"
        }}>
          <button
            onClick={() => setShowEditModal(false)}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(59, 130, 246, 0.05)",
              border: "none",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#3b82f6",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)"}
          >
            <X size={20} />
          </button>

          <h3
            style={{
              fontSize: "1.75rem",
              fontWeight: 900,
              margin: 0,
              letterSpacing: "-0.025em",
              color: "#0f172a"
            }}
          >
            Editar Reserva
          </h3>
          <p style={{ color: "#64748b", fontSize: "0.95rem", marginTop: "0.5rem", fontWeight: 500 }}>
            Actualizando servicio para <span style={{ color: "#3b82f6", fontWeight: 700 }}>{reservationToEdit.users?.name}</span>
          </p>
        </div>

        <div style={{ padding: "2rem" }}>
          {/* Service Configuration */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.025em" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Calendar size={14} /> Fecha programada
              </div>
            </label>
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.85rem 1rem",
                borderRadius: 14,
                border: "1.5px solid #e2e8f0",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#1e293b",
                transition: "all 0.2s",
                outline: "none"
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#3b82f6"}
              onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
            />
          </div>

          <div style={{ marginBottom: "2.5rem" }}>
            <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.025em" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Activity size={14} /> Tipo de Servicio
              </div>
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={editService}
                onChange={(e) => setEditService(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: 14,
                  border: "1.5px solid #e2e8f0",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#1e293b",
                  appearance: "none",
                  background: "#fff",
                  outline: "none"
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#3b82f6"}
                onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                {servicesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }}>
                <ChevronRight size={18} style={{ transform: "rotate(90deg)" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setShowEditModal(false)}
              style={{
                flex: 1,
                padding: "1rem",
                borderRadius: 16,
                border: "1.5px solid #e2e8f0",
                background: "#f8fafc",
                color: "#64748b",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
              onMouseLeave={e => e.currentTarget.style.background = "#f8fafc"}
            >
              Cancelar
            </button>
            <button
              onClick={handleEditReservation}
              style={{
                flex: 2,
                padding: "1rem",
                borderRadius: 16,
                border: "none",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <Save size={18} /> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}